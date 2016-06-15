<?php
/* This is used by the stats page to get the list of scorable columns for an
 * instrument via AJAX. It's used so that ScatterPlot-SVG.php can be run for
 * any scorable in an instrument, dynamically */
ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

require_once "Utility.class.inc";

$cols = Utility::getScoreColsForInstrument($_REQUEST['instrument']);
if(strrpos($_REQUEST['instrument'], "_proband") === false) {
    print "Candidate_Age\n";
}
foreach ($cols as $val) {
    print "$val\n";
}
?>
