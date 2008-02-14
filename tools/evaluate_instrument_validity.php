#!/usr/bin/env php
<?
/**
 * @package behavioural
 */

// create an NDB client
require_once "NDB_Client.class.inc";
$client = new NDB_Client;
$client->makeCommandLine();
$client->initialize();

// get a Database connection
$db = Database::singleton();

// get a list of instruments
$instruments = array('wasi', 'wj3', 'das');

// loop over instruments
foreach($instruments AS $test_name) {
    print "Looping $test_name\n";

    $testID = $db->selectOne("SELECT ID FROM test_names WHERE Test_name='$test_name'");
    if($db->isError($testID)) {
        echo "ERROR: Could not get testID for test $test_name: ".$testID->getMessage()."\n";
        continue;
    }

    // get a list of instrument instances
    $instances = array();
    $query = "SELECT flag.CommentID, flag.SessionID, session.Visit_label, session.CandID, t.Examiner, t.Date_taken FROM $test_name AS t, flag, session WHERE flag.CommentID=t.CommentID AND flag.Test_name='$test_name' AND flag.SessionID=session.ID AND session.Submitted = 'Y' AND session.Cancelled='N' AND session.Active='Y' AND flag.Data_entry='Complete' AND flag.Administration IN ('All', 'Partial')";
    $db->select($query, $instances);
    

    print "Looping instances\n";
    // loop over instrument instances
    foreach($instances AS $instance) {
        // evaluate instance
        $validity = determineValidity($testID, $instance['Date_taken'], $instance['Examiner'], $instance['CandID'], $instance['Visit_label']);

        // update database
        $db->update('flag', array('Validity'=>$validity), array('CommentID'=>$instance['CommentID']));
        print "$instance[CommentID]\t$validity\n";
    }
}

function determineValidity($testID, $dateOfAdministration, $examinerID, $candID, $visitLabel) {
    /* algorithm is simple: 
     *
     * 1. if we have a cert event with a usable status for this visit,
     * use that cert status
     *
     * 2. find the last cert event with a usable status for this
     * examiner before this date of administration, and use that
     * status
     *
     * 3. if no cert event is found, the validity is NULL.
     */

    $db =& Database::singleton();


    // get the cert event for this visit
    $status = $db->selectOne("SELECT d.pass FROM cert_details AS d, cert_events AS e WHERE d.certID=e.certID AND d.testID='$testID' AND e.candID='$candID' AND e.visit_label='$visitLabel' AND e.examinerID='$examinerID'");
    if($db->isError($status)) {
        echo "ERROR: Could not get status for specific timepoint: ".$status->getMessage()."\n";
        return null;
    }
    if(!empty($status) && !is_null($status) && $status != '') {
        return mapValidity($status);
    }
    return null;

    // find the last appropriate cert event
    $status = $db->selectOne("SELECT d.pass FROM cert_details AS d, cert_events AS e WHERE d.certID=e.certID AND d.testID='$testID' AND e.examinerID='$examinerID' AND e.date_cert < '$dateOfAdministration' AND d.pass IS NOT NULL ORDER BY e.date_cert DESC LIMIT 1");
    if($db->isError($status)) {
        echo "ERROR: Could not get status for specific timepoint: ".$status->getMessage()."\n";
        return null;
    }
    if(!empty($status) && !is_null($status) && $status != '') {
        return mapValidity($status);
    }

    // all else failed, so it's null
    return null;
}

function mapValidity($status) {
    if(!is_null($status) && $status != '') {
        switch($status) {
        case 'Valid':
        case 'Invalid':
            return $status;
            
        case 'Invalid scoring':
            return 'Questionable';
        }
    }

    return null;
}