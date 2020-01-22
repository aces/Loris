<?php
/**
 * This file is used by the Schedule Module to fetch sessions, given DCCID and PSCID 
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

// Check if candidate is valid/exists (CandID/DCCID and PSCID must belong to same candidate)
$candidate = $DB->pselectRow(
    "
    	SELECT 
    		* 
    	FROM 
    		candidate 
    	WHERE 
    		CandID = :candId
    	AND 
    		PSCID =  :pscId
    ",
    array(
        "candId" => $_GET["CandID"],
        "pscId"  => $_GET["PSCID"],
    )
);

if (empty($candidate)) {
    http_response_code(400);
    die(json_encode([
        "error" => "DCCID and PSCID don't belong to a candidate."
    ]));
}

// Check if sessions exist
$sessions = $DB->pselect(
    "
        SELECT
            session.ID AS SessionID,
            session.Visit_Label,
            psc.Name AS SiteName
        FROM
            session
        JOIN
            psc
        ON
            session.CenterID = psc.CenterID
        WHERE 
    		CandID = :candId
    ",
    array(
        "candId" => $_GET["CandID"]
    )
);

echo json_encode($sessions);

?>
