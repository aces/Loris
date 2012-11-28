<?

require_once "../php/libraries/NDB_Client.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";
require_once "ConflictDetector.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$config = NDB_Config::singleton();
$db = Database::singleton();

$ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');

// clear the unresolved conflicts for all the instruments
foreach ($ddeInstruments as $test) {
    $instruments = $db->pselect("SELECT CommentID, Test_name, CONCAT('DDE_', CommentID) AS DDECommentID FROM flag WHERE Test_name=:testname AND CommentID NOT LIKE 'DDE%' AND Data_entry='Complete'",
        array('testname' => $test)
    );

    foreach($instruments as $instrument) {
    // If the instrument requires double data entry, check that DDE is also done
    if(in_array($instrument['Test_name'], $ddeInstruments)) {
        print "Recreating conflicts for " . $instrument['Test_name'] . ':' .  $instrument['CommentID'] . "\n";
        ConflictDetector::clearConflictsForInstance($instrument['CommentID']);
        $diff=ConflictDetector::detectConflictsForCommentIds($instrument['Test_name'], 
            $instrument['CommentID'], $instrument['DDECommentID']
        );
        ConflictDetector::recordUnresolvedConflicts($diff);
    }
    }
}

//$db->delete("conflicts_unresolved", array());

?>
