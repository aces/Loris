<?php
/**
 * This file is used by the Schedule Module to list all valid visit labels
 *
 * PHP Version 5
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

$user = User::singleton();
if (!$user->hasPermission('schedule_module')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$DB = Database::singleton();

// If CandID/DccID is specified, select the visit labels that the candidate has
// Otherwise, list all visit labels
if (isset($_GET["CandID"])) {
	$visits = $DB->pselect(
	    "
	    	SELECT 
	    		Visit_label 
	    	FROM 
	    		session
	    	WHERE 
	    		CandID = :candId
	    ",
	    array(
	        "candId" => $_GET["CandID"],
	        )
	);
} else {
	$visits = $DB->pselect(
	    "
	        SELECT 
	        	Visit_label 
	        FROM 
	        	Visit_Windows
	    ",
	    array()
	);
}

echo json_encode($visits);
?>
