<?php
/**
 * Implementation of .htacces as a PHP router file
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Jordan Stirling <jordan.stirling@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


$url     = ltrim($_SERVER['PHP_SELF'], "/");
$request = $_SERVER['REQUEST_URI'];

if ($request != '/'
    && file_exists(__DIR__ . $request)
    && $request != "/acknowledgements/"
    && strpos($request, "/api/") === false
) {
    // FIXME: Should this be in the main index.php to prevent the need
    // for 2 router files? (The AjaxHelper needs to be handled separatedly)
    return false;
}
if (preg_match(
    '#^([a-zA-Z_-]+)/ajax/([a-zA-Z0-9_.-/]+)$#',
    $url
)
) {
    // RewriteRule
    //      ^([a-zA-Z_-]+)/ajax/([a-zA-Z0-9_.-]+)$
    //      /AjaxHelper.php?Module=$1&script=$2 [QSA]
    // NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED

    $getParams = explode("/", $url);

    $_GET["Module"] = $getParams[0];
    $_GET['script'] = $getParams[2];

    include_once __DIR__ . "/AjaxHelper.php";
} else if (preg_match(
    '#^(/*)instruments/(.+)/#',
    $url
)
) {
    // Redirect /CandID/Visit/Instrument/ to the instrument
    // RewriteRule
    //      ^([0-9]{6,6})/([0-9]+)/([a-zA-Z0-9_]+)/$
    //      /main.php?test_name=$3&candID=$1&sessionID=$2 [QSA]

    $getParams = explode("/", $url);

    $_REQUEST["test_name"] = $getParams[1];
    $_GET['test_name']     = $getParams[1];

    include_once __DIR__ . "/main.php";
} else if (preg_match(
    '#^([0-9]{6,6})/([0-9]+)/([a-zA-Z0-9_]+)/([a-zA-Z0-9_]+)/$#',
    $url
)
) {
    // Redirect /CandID/Visit/Instrument/subtest/ to the instrument
    // RewriteRule
    //      ^([0-9]{6,6})/([0-9]+)/([a-zA-Z0-9_]+)/([a-zA-Z0-9_]+)/$
    //      /main.php?test_name=$3&candID=$1&sessionID=$2&subtest=$4 [QSA]

    $getParams = explode("/", $url);

    $_REQUEST["test_name"] = $getParams[2];
    $_REQUEST['candID']    = $getParams[0];
    $_REQUEST['sessionID'] = $getParams[1];
    $_REQUEST['subtest']   = $getParams[3];

    include_once __DIR__ . "/main.php";
} else {
    include_once __DIR__ . "/index.php";
}

