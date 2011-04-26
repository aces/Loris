<?
#!/data/web/neurodb/software/bin/php
/**
 * this script fixed the invalid records in the session table
 * it selects the records w/ Objective=0, or Current_stage=NULL, or PSCID = ''
 * and runs the updates
 *
 * @package behavioural
 * @subpackage NIHPD
 */

// all the generic client shit goes here
// PEAR::Config
require_once "Config.php";

// define which configuration file we're using for this installation
$configFile = "../config.xml";

// load the configuration data into a global variable $config
$configObj = new Config;
$root =& $configObj->parseConfig($configFile, "XML");
if(PEAR::isError($root)) {
    die("Config error: ".$root->getMessage());
}
$configObj =& $root->searchPath(array('config'));
$config =& $configObj->toArray();
$config = $config['config'];
unset($configObj, $root);

// require all relevant OO class libraries
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/Candidate.class.inc";
require_once "../php/libraries/TimePoint.class.inc";
require_once "../php/libraries/Utility.class.inc";

/*
* new DB Object
*/
$DB =& Database::singleton($config['database']['database'], $config['database']['username'], $config['database']['password'], $config['database']['host']);
if(PEAR::isError($DB)) {
    fwrite(STDERR, "Could not connect to database: ".$DB->getMessage()."\n");
    return false;
}
$db =& $DB;

// get list of sessionIDs w/ problems
// apply the fix only where candidate.Entity_type = 'Human'
$query = "Select s.ID FROM candidate as c, session as s WHERE c.CandID = s.CandID AND c.Entity_type = 'Human' AND c.Active = 'Y' AND c.Cancelled = 'N' AND s.Active = 'Y' AND s.Cancelled = 'N' AND (s.Current_stage is NULL OR s.PSCID = '' OR s.Objective = 0) ORDER BY s.ID";

$db->select($query,$result);
if (PEAR::isError($db)) {
    fwrite(STDERR, "Failed to get session records, DB Error: " . $result->getMessage()."\n");
    return false;
}

fwrite(STDERR, "Starting... \n");

$TAB = "\t";
$NEWLINE = "\n";

print $NEWLINE;

// check each records, find out what's wrong and prepare update
foreach ($result as $sessionRecord) {
    
    $sessionID = $sessionRecord['ID'];

    fwrite(STDERR, $sessionID."\n");


    // timepoint object
    $timePoint =& TimePoint::singleton($sessionID);
    if(PEAR::isError($timePoint)) {
        fwrite(STDERR, "Failed to create timepoint ($sessionID) object: " . $timePoint->getMessage()."\n");
        return false; 
    }
    
    $currentStage = $timePoint->getCurrentStage();
    
    // check & fix the current stage
    if (empty($currentStage)) {
        // set the correct current stage so that the rest of the records can be fixed
        $success = $timePoint->setCurrentStage();
        if(PEAR::isError($success)) {
            fwrite(STDERR, "Failed to set current stage: " . $success->getMessage()."\n");
            return false;
        }
        unset($success);
    }

    // reload the timepoint object
    $success = $timePoint->select($sessionID);
    if(PEAR::isError($success)) {
        fwrite(STDERR, "Failed to reload timepoint object: " . $success->getMessage()."\n");
        return false;
    }
    unset($success);
    
    // get the vars from the refreshed object
    $currentStage = $timePoint->getCurrentStage();
    $objective = $timePoint->getObjective();
    $PSCID = $timePoint->getPSCID();
    $candID = $timePoint->getCandID();
    
    // if the objective =0 prepare it for update
    if ($objective == 0) {
        if ($currentStage != 'Not Started') {
            fwrite(STDERR, "Invalid Objective ($objective) / Current stage ($currentStage) combo\n");
            return false;
        }
        
        // set the objective to NULL if the timepoint was not started
        $setArray = array('Objective'=>null);
    }

    //if PSCID is empty create candidate object to get the PSCID
    if (empty($PSCID)) {
        
        // create candidate object
        $candidate =& Candidate::singleton($candID);
        if (PEAR::isError($candidate)) {
            fwrite(STDERR, "Failed to create candidate object: " . $candidate->getMessage()."\n");
            return false;
        }

        // add the correct PSCID to the set array
        $setArray = array_merge($setArray, array('PSCID'=>$candidate->getPSCID()));
    }
    
    // where constraint
    $whereArray = array('ID'=>$timePoint->getSessionID());
    
    //update the session record
    $success = $db->update('session', $setArray, $whereArray);
    if (PEAR::isError($success)) {
        fwrite(STDERR, "Failed to update session table, DB Error: " . $success->getMessage()."\n");
        return false; 
    }
    
    unset($setArray);
    unset($whereArray);
    unset($success);
    unset($timePoint);
    unset($candidate);
    unset($PSCID);
    unset($candID);
    unset($currentStage);
    unset($objective);

    print $NEWLINE;
}

fwrite(STDERR, "End. \n");
?>