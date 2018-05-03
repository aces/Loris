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


$url = ltrim($_SERVER['REQUEST_URI'], "/");

if (preg_match(
    '#^bootstrap/(.*)#',
    $url
)) {
    // Bootstrap is not a Loris module, don't rewrite it.
    // RewriteRule
    //      ^bootstrap/(.*)
    //      bootstrap/$1 [L]
    return false;
} else if (preg_match(
    '#^([0-9]{6,6})/$#',
    $url
)) {
    // Redirect /CandID/ to visit label list
    // RewriteRule
    //      ^([0-9]{6,6})/$
    //      /main.php?test_name=timepoint_list&candID=$1

    $getParams = explode("/", $url);

    $_REQUEST["test_name"] = "timepoint_list";
    $_REQUEST['candID']    = $getParams[0];

    include_once __DIR__ . "/main.php";
} else if (preg_match(
    '#^([0-9]{6,6})/([0-9]+)/$#',
    $url
)) {
    // Want to redirect /CandID/Visit_label/ to instrument list, but
    // because of the main.php URL structure it needs to be the sessionID instead
    // of Visit_label
    // RewriteRule
    //      ^([0-9]{6,6})/([0-9]+)/$
    //      /main.php?test_name=instrument_list&candID=$1&sessionID=$2

    $getParams = explode("/", $url);

    $_REQUEST["test_name"] = "instrument_list";
    $_REQUEST['candID']    = $getParams[0];
    $_REQUEST['sessionID'] = $getParams[1];

    include_once __DIR__ . "/main.php";
} else if (preg_match(
    '#^([0-9]{6,6})/([0-9]+)/([a-zA-Z0-9_]+)/$#',
    $url
)) {
    // Redirect /CandID/Visit/Instrument/ to the instrument
    // RewriteRule
    //      ^([0-9]{6,6})/([0-9]+)/([a-zA-Z0-9_]+)/$
    //      /main.php?test_name=$3&candID=$1&sessionID=$2 [QSA]

    $getParams = explode("/", $url);

    $_REQUEST["test_name"] = $getParams[2];
    $_REQUEST['candID']    = $getParams[0];
    $_REQUEST['sessionID'] = $getParams[1];

    include_once __DIR__ . "/main.php";
} else if (preg_match(
    '#^([0-9]{6,6})/([0-9]+)/([a-zA-Z0-9_]+)/([a-zA-Z0-9_]+)/$#',
    $url
)) {
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
} else if (preg_match(
    '#^([a-zA-Z0-9_-]+)/(\?|$)#',
    $url
)) {
    // RewriteRule
    //      ^([a-zA-Z0-9_-]+)/$
    //      /main.php?test_name=$1 [QSA]

    $getParams = explode("/", $url);

    $_REQUEST["test_name"] = $getParams[0];

    include_once __DIR__ . "/main.php";
} else if (preg_match(
    '#^([a-zA-Z_-]+)/css/([a-zA-Z0-9_.-]+)$#',
    $url
)) {
    // RewriteRule
    //      ^([a-zA-Z_-]+)/css/([a-zA-Z0-9_.-]+)$
    //      /GetCSS.php?Module=$1&file=$2
    // NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED

    $getParams = explode("/", $url);

    $_GET["Module"]   = $getParams[0];
    $_REQUEST['file'] = $getParams[2];

    include_once __DIR__ . "/GetCSS.php";
} else if (preg_match(
    '#^([a-zA-Z_-]+)/js/([a-zA-Z0-9_.-]+)$#',
    $url
)) {
    // RewriteRule
    //      ^([a-zA-Z_-]+)/js/([a-zA-Z0-9_.-]+)$
    //      /GetJS.php?Module=$1&file=$2
    // NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED

    $getParams = explode("/", $url);

    $_GET["Module"] = $getParams[0];
    $_GET['file']   = $getParams[2];

    include_once __DIR__ . "/GetJS.php";
} else if (preg_match(
    '#^([a-zA-Z_-]+)/static/([a-zA-Z0-9_.-/]+)$#',
    $url
)) {
    // RewriteRule
    //      ^([a-zA-Z_-]+)/static/([a-zA-Z0-9_.-/]+)$
    //      /GetStatic.php?Module=$1&file=$2
    // NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED

    $getParams = explode("/", $url);

    $_GET["Module"] = $getParams[0];
    $_GET['file']   = $getParams[2];

    include_once __DIR__ . "/GetStatic.php";
} else if (preg_match(
    '#^([a-zA-Z_-]+)/ajax/([a-zA-Z0-9_.-/]+)$#',
    $url
)) {
    // RewriteRule
    //      ^([a-zA-Z_-]+)/ajax/([a-zA-Z0-9_.-]+)$
    //      /AjaxHelper.php?Module=$1&script=$2 [QSA]
    // NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED

    $getParams = explode("/", $url);

    $_GET["Module"] = $getParams[0];
    $_GET['script'] = $getParams[2];

    include_once __DIR__ . "/AjaxHelper.php";
} else if (preg_match(
    '#^([a-zA-Z0-9_-]+)/([a-zA-Z0-9_.-]+)/(\?|$)#',
    $url
)) {
    // RewriteRule
    //      ^([a-zA-Z0-9_-]+)/([a-zA-Z0-9_.-]+)/$
    //      /main.php?test_name=$1&subtest=$2 [QSA]

    $getParams = explode("/", $url);

    $_REQUEST["test_name"] = $getParams[0];
    $_REQUEST['subtest']   = $getParams[1];

    include_once __DIR__ . "/main.php";
} else {
    return false;
}

?>
