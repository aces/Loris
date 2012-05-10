<?php
/* This is used by the stats page to get the list of scorable columns for an
 * instrument via AJAX. It's used so that ScatterPlot-SVG.php can be run for
 * any scorable in an instrument, dynamically */
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
require_once "Utility.class.inc";

$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

//extract the test_name from the test_names table
$visits = Utility::getVisitLabelUsingTestName(Utility::getTestNameUsingFullName($_REQUEST['instrument']));
if (count($visits) > 1) print "All Visits\n";

if ($visits!=null) {
    foreach($visits as $visit) {
        print $visit['visit_label'] . "\n";
    }
}
?>
