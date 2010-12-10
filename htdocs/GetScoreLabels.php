<?php
/* This is used by the stats page to get the list of scorable columns for an
 * instrument via AJAX. It's used so that ScatterPlot-SVG.php can be run for
 * any scorable in an instrument, dynamically */
 
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

require_once "Utility.class.inc";

$cols = Utility::getScoreColsForInstrument($_REQUEST['instrument']);
print "Candidate_Age\n";
foreach ($cols as $val) {
    print "$val\n";
}
?>
