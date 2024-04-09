<?php
/**
 * This file contains the entry point for a LORIS PSR15-based router.
 * The entrypoint constructs a ServerRequestInterface PSR7 object
 * (currently by using Laminas Diactoros), adds generic LORIS middleware,
 * and then delegates to a LORIS BaseRouter.
 *
 * The this entry point then prints the resulting value to the user.
 *
 * PHP Version 7
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

// FIXME: The code in NDB_Client should mostly be replaced by middleware.
$client = new \NDB_Client;
$client->initialize();

// Middleware that happens on every request. This doesn't include
// any authentication middleware, because that's done dynamically
// based on the module router, depending on if the module is public.
$middlewarechain = (new \LORIS\Middleware\ContentLength())
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

$entrypoint = new \LORIS\Router\BaseRouter(
    $user,
    __DIR__ . "/../project/",
    __DIR__ . "/../modules/"
);

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
