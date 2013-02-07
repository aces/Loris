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
$ddeInstruments = array('figs_year3');

// clear the unresolved conflicts for all the instruments
foreach ($ddeInstruments as $test) {
    $instruments = $db->pselect("SELECT CommentID, Test_name, CONCAT('DDE_', CommentID) AS DDECommentID FROM flag sde join session s ON (s.ID=sde.SessionID) JOIN candidate c ON (c.CandID=s.CandID) WHERE sde.Test_name=:testname AND sde.CommentID NOT LIKE 'DDE%' AND sde.Data_entry='Complete' AND s.Active='Y' AND c.Active='Y' AND EXISTS (SELECT 'x' FROM flag dde WHERE dde.CommentID=CONCAT('DDE_', sde.CommentID) AND Data_entry='Complete')",
        array('testname' => $test)
    );

    foreach($instruments as $instrument) {
    // If the instrument requires double data entry, check that DDE is also done
    if(in_array($instrument['Test_name'], $ddeInstruments)) {
        ConflictDetector::clearConflictsForInstance($instrument['CommentID']);
        print "Recreating conflicts for " . $instrument['Test_name'] . ':' .  $instrument['CommentID'] . "\n";
        $diff=ConflictDetector::detectConflictsForCommentIds($instrument['Test_name'], 
            $instrument['CommentID'], $instrument['DDECommentID']
        );
        ConflictDetector::recordUnresolvedConflicts($diff);
    }
    }
}

//$db->delete("conflicts_unresolved", array());

?>
