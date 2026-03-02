<?php declare(strict_types=1);

/**
 * This file contains the entry point for a LORIS PSR15-based router.
 * The entrypoint constructs a ServerRequestInterface PSR7 object
 * (currently by using Laminas Diactoros), adds generic LORIS middleware,
 * and then delegates to a LORIS BaseRouter.
 *
 * The this entry point then prints the resulting value to the user.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../vendor/autoload.php';

// We don't want PHP to automatically add cache control headers unless
// we explicitly generate them in the request response. (This needs
// to be done before NDB_Client starts the PHP session.)
session_cache_limiter("");

// PHP documentation says this should always be enabled for session security.
// PHP documentation says this is disabled by default.
// Explicitly enable it.
// phpcs:ignore
// See: https://www.php.net/manual/en/session.configuration.php#ini.session.use-strict-mode
ini_set('session.use_strict_mode', '1');

bind_textdomain_codeset("loris", 'UTF-8');
bindtextdomain("loris", __DIR__ . '/../locale');
textdomain("loris");

// Get the requested URI
$request_uri = $_SERVER['REQUEST_URI'];

// Check if the request starts with /meg/
if (strpos($request_uri, '/meg/') === 0) {
    // Target URL
    $target_url = 'http://localhost:8000' . $request_uri;

    // Initialize cURL
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $target_url);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    curl_setopt($ch, CURLOPT_TIMEOUT, 300); // 0 = no timeout

    // Pass through the request method
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

    // Pass through request headers
    $headers = [];
    foreach ($_SERVER as $key => $value) {
        if (substr($key, 0, 5) == 'HTTP_') {
            $header = str_replace('_', '-', substr($key, 5));
            $headers[] = "$header: $value";
        }
    }

    // Add content-type if present
    if (isset($_SERVER['CONTENT_TYPE'])) {
        $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
    }

    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    // Pass through POST data
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    }

    // Execute cURL request
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

    // Get response headers and body
    $response_headers = substr($response, 0, $header_size);
    $response_body = substr($response, $header_size);

    // Close cURL
    curl_close($ch);

    // Forward response headers
    $headers_list = explode("\r\n", $response_headers);
    foreach ($headers_list as $header) {
        if (!empty($header) && !preg_match('/Transfer-Encoding/i', $header)) {
            header($header);
        }
    }

    // Output response body
    echo $response_body;
    exit;
}

// TODO: Remove this code once PHP 8.4 becomes the minimal PHP version in LORIS.
if (version_compare(PHP_VERSION, '8.4', '<')) {
    // @phan-file-suppress PhanRedefineFunctionInternal

    // phpcs:ignore
    if (!function_exists('array_any')) {
        // phpcs:ignore
        function array_any(array $array, callable $callback): bool
        {
            foreach ($array as $key => $value) {
                if ($callback($value, $key)) {
                    return true;
                }
            }
            return false;
        }
    }
    // phpcs:ignore
    if (!function_exists('array_find')) {
        // phpcs:ignore
        function array_find(array $array, callable $callback)
        {
            foreach ($array as $key => $value) {
                if ($callback($value, $key)) {
                    return $value;
                }
            }
            return null;
        }
    }
}

// FIXME: The code in NDB_Client should mostly be replaced by middleware.
$client = new \NDB_Client;
$client->initialize();

Profiler::checkpoint("Profiler started");
// Middleware that happens on every request. This doesn't include
// any authentication middleware, because that's done dynamically
// based on the module router, depending on if the module is public.
$middlewarechain = (new \LORIS\Middleware\Language())
    ->withMiddleware(new \LORIS\Middleware\ContentLength())
    ->withMiddleware(new \LORIS\Middleware\LorisMenu())
    ->withMiddleware(new \LORIS\Middleware\ContentLength())
    ->withMiddleware(new \LORIS\Middleware\AWS())
    ->withMiddleware(new \LORIS\Middleware\ContentSecurityPolicy())
    ->withMiddleware(new \LORIS\Middleware\MFA())
    ->withMiddleware(new \LORIS\Middleware\ResponseGenerator());

$serverrequest = \Laminas\Diactoros\ServerRequestFactory::fromGlobals();

// Remove the lorispath from the URI query parameters.
// Both the request query parameters and the URI query string must be updated.
$params = $serverrequest->getQueryParams();
unset($params['lorispath']);
$serverrequest = $serverrequest->withQueryParams($params);

$query = implode(
    "&",
    array_map(
        fn ($key, $value) => $key . "=" . $value,
        array_keys($params),
        $params
    )
);

$uri           = $serverrequest->getUri();
$serverrequest = $serverrequest->withUri($uri->withQuery($query));

// Now that we've created the ServerRequest, handle it.
$factory = \NDB_Factory::singleton();
$user    = $factory->user();

$lorisInstance = new \LORIS\LorisInstance(
    $factory->database(),
    $factory->config(),
    [
        __DIR__ . "/../project/modules",
        __DIR__ . "/../modules/"
    ]
);
$entrypoint    = new \LORIS\Router\BaseRouter(
    $lorisInstance,
    $user,
);
$serverrequest = $serverrequest->withAttribute("user", $user)
    ->withAttribute("loris", $lorisInstance);

// Now handle the request.
$response = $middlewarechain->process($serverrequest, $entrypoint);

// Add the HTTP header line.
header(
    "HTTP/" . $response->getProtocolVersion()
    . " " . $response->getStatusCode()
    . " " . $response->getReasonPhrase()
);

// Add the headers from the response.
$headers = $response->getHeaders();
foreach ($headers as $name => $values) {
    header($name . ': ' . implode(', ', $values));
}

// Include the body.
$bodystream = $response->getBody();

// First we need to disable any output buffering so that
// it streams to the output instead of into the buffer
// and uses up all the memory for large chunks of data.
for ($i = ob_get_level(); $i != 0; $i = ob_get_level()) {
    ob_end_clean();
}
ob_implicit_flush();

while ($bodystream->eof() == false) {
    // 64k oughta be enough for anybody.
    print $bodystream->read(1024*64);
}
