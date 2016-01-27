<?php
error_log("URL:  " . $_SERVER['REQUEST_URI']);
if (preg_match('#^/bootstrap/(.*)#', $_SERVER["REQUEST_URI"])){
	// Bootstrap is not a Loris module, don't rewrite it.
	// RewriteRule ^bootstrap/(.*) bootstrap/$1 [L]
	return false;
} else if (preg_match('#^/([0-9]{6,6})/$#', $_SERVER["REQUEST_URI"])) {
	// Redirect /CandID/ to visit label list
 	// RewriteRule ^([0-9]{6,6})/$ /main.php?test_name=timepoint_list&candID=$1
	$_REQUEST["test_name"] = "timepoint_list";
	$_REQUEST['candID'] = $_SERVER["REQUEST_URI"].split("/")[1];
	include_once __DIR__ . "/main.php";
} else if (preg_match('#^/([0-9]{6,6})/([0-9]+)/$#', $_SERVER["REQUEST_URI"])) {
	// Want to redirect /CandID/Visit_label/ to instrument list, but
	// because of the main.php URL structure it needs to be the sessionID instead
	// of Visit_label
	// RewriteRule ^([0-9]{6,6})/([0-9]+)/$ /main.php?test_name=instrument_list&candID=$1&sessionID=$2
	$getParams = $_SERVER["REQUEST_URI"].split("/");
	$_REQUEST["test_name"] = "timepoint_list";
	$_REQUEST['candID'] = $getParams[1];
	$_REQUEST['sessionID'] = $getParams[2];
	include_once __DIR__ . "/main.php";
} else if (preg_match('#^/([0-9]{6,6})/([0-9]+)/([a-zA-Z_]+)/$#', $_SERVER["REQUEST_URI"])) {
	// Redirect /CandID/Visit/Instrument/ to the instrument
    // RewriteRule ^([0-9]{6,6})/([0-9]+)/([a-zA-Z_]+)/$ /main.php?test_name=$3&candID=$1&sessionID=$2 [QSA]
    $getParams = $_SERVER["REQUEST_URI"].split("/");
	$_REQUEST["test_name"] = $getParams[3];
	$_REQUEST['candID'] = $getParams[1];
	$_REQUEST['sessionID'] = $getParams[2];
	include_once __DIR__ . "/main.php";
} else if (preg_match('#^/([0-9]{6,6})/([0-9]+)/([a-zA-Z_]+)/([a-zA-Z0-9_]+)/$#', $_SERVER["REQUEST_URI"])) {
	// Redirect /CandID/Visit/Instrument/subtest/ to the instrument
    // RewriteRule ^([0-9]{6,6})/([0-9]+)/([a-zA-Z_]+)/([a-zA-Z0-9_]+)/$ /main.php?test_name=$3&candID=$1&sessionID=$2&subtest=$4 [QSA]
    $getParams = $_SERVER["REQUEST_URI"].split("/");
	$_REQUEST["test_name"] = $getParams[3];
	$_REQUEST['candID'] = $getParams[1];
	$_REQUEST['sessionID'] = $getParams[2];
	$_REQUEST['subtest'] = $getParams[4];
	include_once __DIR__ . "/main.php";
} else if (preg_match('#^/([a-zA-Z_-]+)/$#', $_SERVER["REQUEST_URI"])) {
	// RewriteRule ^([a-zA-Z_-]+)/$ /main.php?test_name=$1 [QSA]
	$getParams = $_SERVER["REQUEST_URI"].split("/");
	$_REQUEST["test_name"] = $getParams[1];
	include_once __DIR__ . "/main.php";
} else if (preg_match('#^/([a-zA-Z_-]+)/css/([a-zA-Z0-9_.-]+)$#', $_SERVER["REQUEST_URI"])) {
	// RewriteRule ^([a-zA-Z_-]+)/css/([a-zA-Z0-9_.-]+)$ /GetCSS.php?Module=$1&file=$2
	// NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED
	$getParams = $_SERVER["REQUEST_URI"].split("/");
	$_GET["Module"] = $getParams[1];
	$_REQUEST['file'] = $getParams[3];
	include_once __DIR__ . "/GetCSS.php";
} else if (preg_match('#^/([a-zA-Z_-]+)/js/([a-zA-Z0-9_.-]+)$', $_SERVER["REQUEST_URI"])) {
	// RewriteRule ^([a-zA-Z_-]+)/js/([a-zA-Z0-9_.-]+)$ /GetJS.php?Module=$1&file=$2
	// NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED
	$getParams = $_SERVER["REQUEST_URI"].split("/");
	$_GET["Module"] = $getParams[1];
	$_GET['file'] = $getParams[3];
	include_once __DIR__ . "/GetJS.php";
} else if (preg_match('#^/([a-zA-Z_-]+)/static/([a-zA-Z0-9_.-/]+)$', $_SERVER["REQUEST_URI"])) {
	// RewriteRule ^([a-zA-Z_-]+)/static/([a-zA-Z0-9_.-/]+)$ /GetStatic.php?Module=$1&file=$2
	// NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED
	$getParams = $_SERVER["REQUEST_URI"].split("/");
	$_GET["Module"] = $getParams[1];
	$_GET['file'] = $getParams[3];
	include_once __DIR__ . "/GetStatic.php";
} else if (preg_match('#^/([a-zA-Z_-]+)/static/([a-zA-Z0-9_.-/]+)$', $_SERVER["REQUEST_URI"])) {
	// RewriteRule ^([a-zA-Z_-]+)/ajax/([a-zA-Z0-9_.-]+)$ /AjaxHelper.php?Module=$1&script=$2 [QSA]
	// NOT SURE IF THIS WORKS IF FILE IS NOT SPECIFIED
	$getParams = $_SERVER["REQUEST_URI"].split("/");
	$_GET["Module"] = $getParams[1];
	$_GET['script'] = $getParams[3];
	include_once __DIR__ . "/AjaxHelper.php";
} else if (preg_match('#^/([a-zA-Z_-]+)/([a-zA-Z0-9_.-]+)/$#', $_SERVER["REQUEST_URI"])) {
	// RewriteRule ^([a-zA-Z_-]+)/([a-zA-Z0-9_.-]+)/$ /main.php?test_name=$1&subtest=$2 [QSA]
    $getParams = $_SERVER["REQUEST_URI"].split("/");
	$_REQUEST["test_name"] = $getParams[1];
	$_REQUEST['subtest'] = $getParams[2];
	include_once __DIR__ . "/main.php";
} else if (preg_match('#^/preferences/$#', $_SERVER["REQUEST_URI"])) {
	// Preferences is a special case for url rewriting
 	// RewriteRule ^preferences/$ /main.php?test_name=user_accounts&subtest=my_preferences
	$_REQUEST["test_name"] = "user_accounts";
	$_REQUEST['subtest'] = "my_preferences";
	include_once __DIR__ . "/main.php";
} else {
	return false;
}

?>