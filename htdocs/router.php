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
$url     = ltrim($_SERVER['REQUEST_URI'], "/");
$urlpath = ltrim($_SERVER['PHP_SELF'], "/");

$request = $_SERVER['REQUEST_URI'];

if ($request != '/'
    && (    file_exists(__DIR__ . $request)
    || file_exists(__DIR__ . "/" . $urlpath))
    && $request != "/acknowledgements/"
    && strpos($request, "/api/") === false
) {
    // FIXME: Should this be in the main index.php to prevent the need
    // for 2 router files? (The AjaxHelper needs to be handled separatedly)
    return false;
}
if (preg_match(
    '#^([a-zA-Z_-]+)/ajax/([a-zA-Z0-9_.-/]+)$#',
    $urlpath
)
) {
    // RewriteRule
    //      ^([a-zA-Z_-]+)/ajax/([a-zA-Z0-9_.-]+)$
    //      /AjaxHelper.php?Module=$1&script=$2 [QSA]
    // NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED

    $getParams = explode("/", $urlpath);

    $_GET["Module"] = $getParams[0];
    $_GET['script'] = $getParams[2];

    include_once __DIR__ . "/AjaxHelper.php";
} else {
    include_once __DIR__ . "/index.php";
}

