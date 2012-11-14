<?php
#!/data/web/neurodb/software/bin/php
/**
 * @version $Id: derive_timepoint_flags.php,v 3.17 2006/06/20 15:12:29 dario Exp $
 * derives exclusion flags and stores them into parameter_exclusion_session table
 * @package timepoint_flag
 */

// define a config file to use
$configFile = "../project/config.xml";

set_include_path(get_include_path().":../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$tests = $DB->pselect("SELECT Test_name FROM test_names WHERE Test_name NOT LIKE '%_proband' AND Test_name NOT LIKE 'EARLI%' AND Test_name NOT LIKE 'figs%'", array()) ;
/* ************************************************************************* */
// Determine instruments where administration < DoB, or sessions where Visit < DoB
/* ************************************************************************* */
print "SESSIONS WITH ADMINISTRATION BEFORE DOB\n";
print "---------------------------------------\n";
$queries = array("SELECT c.PSCID, c.CandID, s.Visit_label, 'Date_visit' FROM candidate c LEFT JOIN session s USING (CandID) WHERE s.Date_visit < c.DoB AND c.CenterID <> 1 AND COALESCE(s.Visit, 'NotFailure') <> 'Failure'");

foreach($tests as $row) {
    $test = $row['Test_name'];
    if($test == 'tsi') {
        continue;
    }
    $queries[] = "SELECT c.PSCID, c.CandID, s.Visit_label, '$test' FROM candidate c LEFT JOIN session s USING (CandID) LEFT JOIN flag f ON (f.SessionID=s.ID) LEFT JOIN $test t USING (CommentID) WHERE f.Test_name=" . $DB->quote($test)  . " AND t.Date_taken < c.DoB AND c.CenterID <> 1 AND f.Data_entry='Complete' AND COALESCE(s.Visit, 'NotFailure') <> 'Failure'";
}
$query = implode($queries, " UNION ");
//print "$query\n";
$bad_entries = $DB->pselect($query . " ORDER BY PSCID", array());
foreach($bad_entries as $row) {
    print implode($row, "\t");
    print "\n";
}

/* ************************************************************************* */
// Determine sessions where Date_taken of visit n > Date taken of visit n+1
/* ************************************************************************* */
print "\n\nSESSIONS WITH VISIT N AFTER VISIT N+1\n";
print "-------------------------------------\n";
foreach($tests as $test_row) {
    $test = $test_row['Test_name'];
    $instrument_query = "SELECT c.PSCID, c.CandID, t.Date_taken, s.Visit_label, f.CommentID FROM candidate c LEFT JOIN session s USING (CandID) LEFT JOIN flag f ON (f.SessionID=s.ID) JOIN $test t USING (CommentID) WHERE f.Test_name=" . $DB->quote($test)  . " AND f.CommentID NOT LIKE 'DDE%' AND s.Active='Y' AND c.Active='Y' AND t.Date_taken IS NOT NULL  AND f.Data_entry='Complete' AND COALESCE(s.Visit, 'NotFailure') <> 'Failure' ORDER BY PSCID, Visit_label";
    $instrument_data = $DB->pselect($instrument_query, array());
//    print_r($instrument_data);
    $LastCandidate = '';
    $LastDateTaken = 0;
    $LastCommentID = '';
    foreach($instrument_data as $row) {
        if($row['PSCID'] != $LastCandidate) {
            $LastCandidate = $row['PSCID'];
            $LastDateTaken = $row['Date_taken'];
            $LastVisit = $row['Visit_label'];
            $LastCommentID= $row['CommentID'];
            continue;
        }
        if($LastDateTaken > $row['Date_taken']) {
            $disp = array($row['PSCID'], $row['CandID'], $row['Visit_label'], $test, $LastVisit . ' > ' . $row['Visit_label']);
            print implode($disp, "\t");
            print "\n";
        }
        $LastCandidate = $row['PSCID'];
        $LastDateTaken = $row['Date_taken'];
        $LastVisit = $row['Visit_label'];
        $LastCommentID= $row['CommentID'];
        
    }
}

print "\n\nSESSIONS WITH DUPLICATE SCANS\n";
print "-------------------------------------\n";
$query = "SELECT c.PSCID, c.CandID, s.Visit_label, pf.Value, count(*) from parameter_file pf left join files f ON (f.SeriesUID=pf.Value) left join session s ON (s.ID=f.SessionID) left join candidate c USING (CandID) where ParameterTypeID=151 group by Value having count(*) > 1 ORDER BY c.PSCID";

$results = $DB->pselect($query, array());

foreach($results as $row) {
    print "$row[PSCID]\t$row[CandID]\t$row[Visit_label]\t$row[Value]\n";
}

print "\n\nSITES WITH LAST LEGO SCAN MORE THAN 2 MONTHS AGO\n";
print "---------------------------------------------------";
$query = "SELECT psc.MRI_Alias, MAX(pf.Value) as LastLego from files f left join parameter_file pf on (pf.FileID=f.FileID AND pf.ParameterTypeID=67) LEFT JOIN session s ON (s.ID=f.SessionID) LEFT JOIN psc ON (psc.CenterID=s.CenterID) WHERE File like '%lego%' GROUP BY s.CenterID HAVING MAX(pf.Value) < :cutoff";

$results = $DB->pselect($query, array("cutoff" => date("Ymd", strtotime('-2 months'))));
print "\nSite\tLast Lego\n";
foreach($results as $row) {
    print "$row[MRI_Alias]\t$row[LastLego]\n";
}
print "\n\nSCANS THAT FAILED INSERTION IN LAST WEEK\n";
print "-------------------------------------\n";
$data = $DB->pselect("SELECT CandID, c.PSCID, time_run, series_description FROM mri_protocol_violated_scans LEFT JOIN candidate c USING (CandID) WHERE time_run > DATE_SUB(now(), INTERVAL 1 WEEK) ORDER BY time_run DESC" , array());
foreach($data as $row) {
    print implode("\t", $row);
    print "\n";
}
?>
