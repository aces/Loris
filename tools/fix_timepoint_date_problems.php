<?php
#!/data/web/neurodb/software/bin/php
/**
 * @version $Id: fix_timepoint_date_problems.php,v 1.21 2006/05/05 15:42:25 dario Exp $
 *
 * This is the tool to diagnose and correct the date problems in a candidate profile and add missing instruments to the bvl battery.
 *
 * Currently the tool does the following:
 * - corrects DOB and EDC (candidate table)
 * - corrects Date_screening, Date_visit (session table)
 * - corrects bvl batteries by:
 *    adding records in the flag table
 *    adding records in the instrument tables
 *    adding records into the feedback_bvl* tables (creates new feedback)
 *    writes a log entry
 *    sending automatic email notification - to be completed later
 *
 * The procedure to correct the problems is:
 * run w/ fix_date option to UPDATE the date fields in the candidate/session table (as needed)
 * run w/ diagnose option to get the difference in batteries
 * run the tool w/ add_instrument option to add missing instruments, and create new feedback 
 * send email to PSC
 * close Mantis bug
 * 
 * ways to use this script:
 * -- get a help screen
 * fix_timepoint_date_problems.php help
 *
 * -- to fix dates (when fixing stage dates, sessionID must be specified)
 * fix_timepoint_date_problems.php fix_date <candID> <newCorrectDate> <dob/edc>
 * fix_timepoint_date_problems.php fix_date <candID> <newCorrectDate> <screening/visit> <sessionID>
 *
 * -- when diagnosing a problem (if only CandID is specified, all timepoints are diagnosed
 * fix_timepoint_date_problems.php diagnose <candID> [<sessionID>]
 * fix_timepoint_date_problems.php diagnose <candID> [<newCorrectDate> <dob/edc/>]
 * fix_timepoint_date_problems.php diagnose <candID> [<sessionID> <newCorrectDate> <screening/visit>]
 *
 * -- to fix bvl battery (run only once the dates are fixed)
 * fix_timepoint_date_problems.php add_instrument  <candID> <sessionID> <test_name>
 *
 * @package behavioural
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");

// path to config file
$configFile = "../project/config.xml";

require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";
require_once "NDB_BVL_Battery.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$db =& Database::singleton();

/**
 * HELP SCREEN
 * display and stop processing if action=help
 */
if (empty($argv[1]) || $argv[1] == 'help') {
    fwrite(STDERR, "Usage: \n\n");
    fwrite(STDERR, "fix_timepoint_date_problems.php help - displays this msg\n");
    fwrite(STDERR, "fix_timepoint_date_problems.php fix_date        <candID> <newCorrectDate> <dob/edc>\n");
    fwrite(STDERR, "fix_timepoint_date_problems.php fix_date        <candID> <newCorrectDate> <screening/visit> <sessionID>\n");
    fwrite(STDERR, "fix_timepoint_date_problems.php diagnose        <candID> \n");
    fwrite(STDERR, "fix_timepoint_date_problems.php diagnose        <candID> [<newCorrectDate> <dob/edc/>]\n");
    fwrite(STDERR, "fix_timepoint_date_problems.php diagnose        <candID> [<newCorrectDate> <screening/visit> <sessionID>]\n");
    fwrite(STDERR, "fix_timepoint_date_problems.php add_instrument  <candID> <sessionID> <test_name>\n");
    fwrite(STDERR, "NOTES: The date format is: YYYY-MM-DD.\n");
    fwrite(STDERR, "fix_date: updates the dates in candidate or session table. Does not alter the BVL battery\n");
    return;
}

/**
* get cmd-line arguments
*/
// get $action argument
$action = strtolower($argv[1]);

// CandID
$candID = $argv[2];

// get the rest of the arguments
switch ($action) {
 case 'fix_date':
     // new date
     $newDate = $argv[3];
     // date type
     $dateType = strtolower($argv[4]);
     // sessionID
     if (in_array($dateType, array('screening','visit'))) $sessionID = $argv[5];
     break;

 case 'diagnose':
     // new date
     if (!empty($argv[3])) $newDate = $argv[3];
     // date type
     if (!empty($argv[4])) $dateType = strtolower($argv[4]);
     // sessionID
     if (in_array($dateType, array('screening','visit'))) $sessionID = $argv[5];
     break;
    
 case 'add_instrument':
     // sessionID
     $sessionID = $argv[3];
     // test name
     $testName = $argv[4];
     break;
}

/**
* check arguments for valididty
* combinations of arguments are tested for each option in the $action switch below and in local functions
*/
// check the $action options
if (!in_array($action, array('diagnose', 'fix_date', 'add_instrument'))) {
    fwrite(STDERR, "Error, invalid 1st argument ($action).\n Available options are:'diagnose','fix_date','add_instrument'\n");
    fwrite(STDERR, "For the script syntax type: fix_timepoint_date_problems.php help \n");
    return false;
}
// check $candID
if (!preg_match("/^([0-9]{6})$/", $candID)) {
    fwrite(STDERR, "Error, invalid 2st argument CandID ($candID).\n It has to be a 6-digit number\n");
    fwrite(STDERR, "For the script syntax type: fix_timepoint_date_problems.php help \n");
    return false;
}
// Candidate object - to check if valid $candID
$candidate =& Candidate::singleton($candID);
//get the list of timepoints (sessionIDs) for the profile
$listOfTimePoints = $candidate->getListOfTimePoints();
if (!is_array($listOfTimePoints)) {
    fwrite(STDERR, "This candidate profile has no registered timepoints. Cannot proceed. \n");
    return false;
}
// check sessionID
if (!empty($sessionID)) {
    // check SessionID - if supplied as an argument, it has to be in the list of existing timepoints
    if (!in_array($sessionID, $listOfTimePoints)) {
        fwrite(STDERR, "Please specify a valid SessionID for candidate ($candID).\n Valid SessionIDs for this subject are:\n");
        foreach ($listOfTimePoints as $key=>$val) {
            fwrite(STDERR, "$val\n");
        }
        fwrite(STDERR, "For the script syntax type: fix_timepoint_date_problems.php help \n");
        return false;
    }
}

/*
 * The switch to execute actions
 */
switch ($action)
{
 /**
  * Fixing the behavioral battery by adding the instrument
  * arguments: $candID, $sessionID, $testName
  * RUN THE DIAGNOSTICS BEFORE TO SEE WHAT NEEDS TO BE FIXED
  */
 case 'add_instrument':
     // add a missing instrument (sessionID and test name are checked inside the function)
     $success = addInstrument($sessionID, $testName);
     break;

  /**
   * Fixing the dates
   * arguments: $candID, $dateType, $newDate, $sessionID
   */
 case 'fix_date':
     // fix the date (arguments are checked by the function
     $success = fixDate($candID, $dateType, $newDate, $sessionID);
     break;
    
  /**
   * Timepoint Diagnostics
   * Recommended: run the diagnostics once the dates have been fixed, you can also pass the 'correct' date and the date type to see what changes would happen if the dates were different
   */
   case 'diagnose':
   if (!empty($sessionID)) {
       // overwrite the array to include the provided $sessionID only
       $listOfTimePoints = array($sessionID);
   }

   // print out candidate info
   fwrite(STDERR, "Candidate: $candID \n");

   // check/diagnose each timepoint separately
   foreach ($listOfTimePoints as $sessionID) {

       // create timepoint object
       $timePoint =& TimePoint::singleton($sessionID);

       // print out the $sessionID
       fwrite(STDERR, "\n Timepoint ".$timePoint->getVisitLabel()." ; SubProjectID: ".$timePoint->getSubprojectID()." ; Effective DOB: ".$timePoint->getEffectiveDateOfBirth()." ; (SessionID): $sessionID \n");

       // diagnose - get the list of missing instruments
       try {
           $listNewInstruments = diagnose($sessionID, $dateType, $newDate);
       } catch (LorisException $e) {
       // handle the error and skip to next time point
           fwrite(STDERR, "Error, failed to get the list of needed instruments for candidate ($candID), timepoint ($sessionID):\n");
           fwrite(STDERR, $listNewInstruments->getMessage()."\n");
           continue;
       }

       // if there are missing instruments
       if (count($listNewInstruments) > 0) {

           fwrite(STDERR, "\n Missing instruments are:\n");

           //print out the list of missing instruments
           foreach ($listNewInstruments as $instrument) {
               fwrite(STDERR, "$instrument \n");
           }
       } else {
           fwrite(STDERR, "\n There are no missing instruments \n");
       }
   }
   break;
} // end switch ($action)


/**
 * local functions
 */

/**
 * adds a bvl instrument to the battery
 * the function checks the args, add the instrument (if valid), creates a bvl feedback, writes a log and displays the message
 * @param int sessionID of the timepoint
 * @testName string name of the instrument to add to the battery
 * @throws LorisException
 * @return void
 */
function addInstrument($sessionID, $testName)
{
    // check the user $_ENV['USER']
    $user =& User::singleton(getenv('USER'));
    if($user->getUsername() == null) {
        throw new LorisException("Error: Database user named " . getenv('USER') . " does not exist. Please create and then retry script\n");
    }

    // check the args
    if (empty($sessionID) || empty($testName)) {
        throw new LorisException("SessionID and Test name must be provided");
    }

    $db =& Database::singleton();

    // create timepoint object
    $timePoint =& TimePoint::singleton($sessionID);
    
    // create battery object
    $battery =& new NDB_BVL_Battery();

    // set the SessionID for the battery
    $success = $battery->selectBattery($sessionID);
    
    // check if the instrument is already in the battery
    $existingBattery = $battery->getBattery();

    // return error if instrument is in the battery
    if (in_array($testName, $existingBattery)) {
        throw new LorisException("WARNING, cannot add new instrument ($testName) b/c it's already part of the battery for timepoint ($sessionID) \n");
    }
    
    // add to battery - this method check if the $testName is valid
    $success = $battery->addInstrument($testName);
    
    // get CommentID of the newly assigned instrument
    $query = "SELECT CommentID FROM flag WHERE SessionID='$sessionID' AND Test_name='$testName'";
    
    /*
     * add Feedback
     */
    // feedback object
    print $user->getUsername();
    $feedback = NDB_BVL_Feedback::singleton($user->getUsername(), null, $sessionID);

    //get thread feedback type
    $threadFeedbackType = $feedback->getFeedbackTypeIdByName('other');
    if (empty($threadFeedbackType))
    {
        //create thread feedback type "Other", if it does not exist
        $threadFeedbackType = $feedback->createFeedbackType("Other", "Other");
    }

    // add the new thread
    $success = $feedback->createThread('instrument', $threadFeedbackType, "Instrument ($testName) has been added to the battery. You may now complete data entry for this instrument. Please respond to this feedback to acknowledge the changes.", 'Y');

    // activate threads
    $success = $feedback->activateThread();
    
    // print the success msg
    fwrite(STDERR,"Added the instrument ($testName) to the battery of the timepoint ($sessionID)\n");
    
    // destroy objects
    unset($timePoint);
    unset($battery);
    unset($feedback);
    
    return;
}

/*
 * updates the date field in database
 * the function checks the args, updates the date, write the log (print) and prints msg on the screen
 * @param int candidate ID
 * @param string type of the date to change
 * @param date the new date in format YYYY-MM-DD
 * @param int sessionID, optional
 * @throws LorisException
 * @return void
 */
function fixDate($candID, $dateType, $newDate, $sessionID=null)
{
    // check the user $_ENV['USER']
    $user =& User::singleton(getenv('USER'));
    if($user->getUsername() == null) {
        throw new LorisException("Error: Database user named " . getenv('USER') . " does not exist. Please create and then retry script\n");
    }

    $db =& Database::singleton();
    
    // check the args
    if (empty($dateType) || !in_array($dateType, array('dob', 'edc', 'screening', 'visit')) || empty($newDate)
    || (in_array($dateType, array('screening', 'visit')) && empty($sessionID))) {
        throw new LorisException("Please pass a valid set of arguments\n");
    }

    // check the date format (redundant)
    $dateArray = explode('-', $newDate);
    if (!is_array($dateArray) || !checkdate($dateArray[1], $dateArray[2], $dateArray[0])) {
        throw new LorisException("Invalid Date! Please use the following format: YYYY-MM-DD \n");
    }
    unset($dateArray);

    // candidate object - needed to get the dob/edc
    $candidate =& Candidate::singleton($candID);

    // fixing DOB or EDC
    if (in_array($dateType, array('dob', 'edc'))) {

        // set and where arrays
        $setArray = array($dateType => $newDate);
        $whereArray = array('CandID' => $candID);
        
        // update candidate table record
        $success = $db->update('candidate', $setArray, $whereArray);
        
        /*
        * add Feedback
        */
        // feedback object
        $feedback =& NDB_BVL_Feedback::singleton($user->getUsername(), $candID);
        
        // add the new thread
        $success = $feedback->createThread('profile', '5', "The date of $dateType has been changed to $newDate.", 'N');

        // log the change
        fwrite (STDERR, "Updated $dateType to: $newDate, for candidate $candID. Check the record in the DB! \n");

    } else {
        
        // fixing Date_screening or Date_visit

        // create timepoint object
        $timePoint =& TimePoint::singleton($sessionID);

        // check if the timepoint is started before attempting to make changes to it
        if ($timePoint->getCurrentStage() == 'Not Started') {
            throw new LorisException("Error: Cannot perform screening/visit date fixes on the non-started timepoints!");
        }

        // get the stage statuses
        $screeningStage = $timePoint->getScreeningStatus();
        $visitStage = $timePoint->getVisitStatus();
        // make sure that the stage to fix is started
        if ($dateType == 'visit' && empty($visitStage) || $dateType == 'screening' && empty($screeningStage)) {
            throw new LorisException("Error: failed to retrieve the date of $dateType (sessionID: $sessionID) b/c that stage was not started!");
        }

        // set and where arrays for the update
        $setArray = array("Date_".$dateType => $newDate);
        $whereArray = array("ID" => $sessionID);
        
        // update session table record
        $success = $db->update('session', $setArray, $whereArray);

        /*
        * add Feedback
        */
        // feedback object
        $feedback =& NDB_BVL_Feedback::singleton($user->getUsername(), null, $sessionID);
        
        // add the new thread
        $success = $feedback->createThread('visit', '5', "The date of $dateType has been changed to $newDate.", 'N');
        
        // log the change
        fwrite(STDERR, "Updated date of $dateType to $newDate, for candidate $candID, timepoint $sessionID. Check the DB record!\n");
    } // end if
    
    return;
}


/**
 * returns an array of missing instruments for the timepoint
 *
 * @param  int valid timepoint's sessionID, field session.ID
 * @param  string dateType, type of date to change
 * @param  string date, new date to use to define the battery
 * @return array list of missing instruments
 * @throws LorisException
 */
function diagnose($sessionID, $dateType=null, $newDate=null)
{
    // check args: sessionID
    if (empty($sessionID)) {
        throw new LorisException("Error, SessionID missing!");
    }
    // check args: dateType and newDate
    if (!empty($dateType) || !empty($newDate)) {
        // check the args
        if (empty($dateType) || !in_array($dateType, array('dob', 'edc', 'screening', 'visit')) || empty($newDate)
        || (in_array($dateType, array('screening', 'visit')) && empty($sessionID))) {
            throw new LorisException("Please pass a valid set of arguments\n");
        }

        // check the date format (redundant)
        $dateArray = explode('-', $newDate);
        if (!is_array($dateArray) || !checkdate($dateArray[1], $dateArray[2], $dateArray[0])) {
            throw new LorisException("Invalid Date! Please use the following format: YYYY-MM-DD \n");
        }
        unset($dateArray);
    }
    
    // create timepoint object
    $timePoint =& TimePoint::singleton($sessionID);

    // candidate object - needed to get the dob/edc
//    $candidate =& Candidate::singleton($timePoint->getCandID());

    // get the statuses and dates of the screening and visit stages to decide what to do w/ each of them
    $stageList['screening']['status'] = $timePoint->getScreeningStatus();
    $stageList['screening']['date'] = $timePoint->getDateOfScreening();
    $stageList['visit']['status'] = $timePoint->getVisitStatus();
    $stageList['visit']['date'] = $timePoint->getDateOfVisit();
    $subProjectID = $timePoint->getSubprojectID();
    
    // define the date of birth to use (dob or edc)
    if (($dateType=='dob' && $subProjectID==1) || ($dateType=='edc' && $subProjectID==2)) $dateBirth=$newDate;
    else $dateBirth = $timePoint->getEffectiveDateOfBirth();

    // check if the timepoint is started before attempting to make changes to it
    if ($timePoint->getCurrentStage() == 'Not Started' || empty($stageList['screening']['status'])) {
        throw new LorisException("Error: Cannot diagnose the non-started timepoints!");
    }
    // check the subProjectID
    if (empty($subProjectID)) {
        throw new LorisException("SubProjectID ($subProjectID) is empty for timepoint ($sessionID)");
    }
    

    // initialize the array
    $missingInstruments = array();
    
    // check/diagnose the battery for each stage
    foreach ($stageList as $stage => $stageData) {
        
        // if the stage is started
        if (!empty($stageData['status'])) {
            
            $dateOfStage = (!empty($newDate) && strtolower($dateType)==$stage) ? $newDate : $stageList[$stage]['date'];

            // compute subject age for the current stage
            $ageArray = Utility::calculateAge($dateBirth, $dateOfStage);
            $age = ($ageArray['year'] * 12 + $ageArray['mon']) * 30 + $ageArray['day'];
            if ($age < 0) {
                $age = 0;
            }
            unset($ageArray);
            fwrite(STDERR, "Age at $stage: $age [ $dateBirth $dateOfStage]\n");

            // create battery object
            $battery =& new NDB_BVL_Battery();

            // set the SessionID for the battery
            $success = $battery->selectBattery($sessionID);
            
            // get the existing battery for the stage
            $existingTests = $battery->getBattery($stage);
            
            // determine the correct list of instruments
            $neededTests = Utility::lookupBattery($age, $stage);

            // get the differnce between the two batteries
            $difference = array_diff($neededTests, $existingTests);
            
            // add to array to missing instruments
            $missingInstruments = array_merge($missingInstruments, $difference);

            // unset vars and objects
            unset($battery);
            unset($neededTests);
            unset($existingTests);
            unset($age);
            unset($difference);
        }
    } // end foreach
    
    return $missingInstruments;
}
?>
