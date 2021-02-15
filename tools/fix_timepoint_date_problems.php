#!/usr/bin/env php
<?php
/**
 * This is the tool to diagnose and correct the date problems in a candidate
 * profile and add missing instruments to the bvl battery.
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
 * Run w/ fix_date option to UPDATE the date fields in the candidate/session
 * table (as needed)
 * Run w/ diagnose option to get the difference in batteries
 * Run the tool w/ add_instrument option to add missing instruments, and
 * create new feedback
 * Send email to PSC
 *
 * Ways to use this script:
 * -- get a help screen
 * fix_timepoint_date_problems.php help
 *
 * -- to fix dates (when fixing stage dates, sessionID must be specified)
 * fix_timepoint_date_problems.php fix_date <candID> <newCorrectDate> <dob/edc>
 * fix_timepoint_date_problems.php fix_date <candID> <newCorrectDate>
 *                                          <screening/visit> <sessionID>
 *
 * -- when diagnosing a problem (if only CandID is specified, all timepoints
 * are diagnosed
 * fix_timepoint_date_problems.php diagnose <candID> [<sessionID>]
 * fix_timepoint_date_problems.php diagnose <candID> [<newCorrectDate> <dob/edc/>]
 * fix_timepoint_date_problems.php diagnose <candID> [<sessionID>
 *                                          <newCorrectDate> <screening/visit>]
 *
 * -- to fix bvl battery (run only once the dates are fixed)
 * fix_timepoint_date_problems.php add_instrument <candID> <sessionID> <test_name>
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
use LORIS\StudyEntities\Candidate\CandID;

set_include_path(get_include_path().":../project/libraries:../php/libraries:");

// path to config file
$configFile = dirname(__FILE__) . "/../project/config.xml";

require_once __DIR__ . "/../vendor/autoload.php";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$db = \Database::singleton();

/**
 * HELP SCREEN
 * display and stop processing if action=help
 * or if we have missing arguments
 */
if (empty($argv[1]) || empty($argv[2]) || $argv[1] == 'help') {
    printUsage();
}


/**
 * Get cmd-line arguments
 */
// get $action argument
$action = strtolower($argv[1]);

// CandID
$candID = new CandID($argv[2]);

// get the rest of the arguments
switch ($action) {
case 'fix_date':
    if (empty($argv[3]) || empty($argv[4])) {
        printUsage();
    }

    // new date
    $newDate = $argv[3];
    // date type
    $dateType = strtolower($argv[4]);
    // sessionID
    if (in_array($dateType, ['screening', 'visit'])) {
        if (empty($argv[5])) {
            printUsage();
        }

        $sessionID = $argv[5];
    }
    break;

case 'diagnose':
    // new date
    if (!empty($argv[3])) {
        $newDate = $argv[3];
    }
    // date type
    if (!empty($argv[4])) {
        $dateType = strtolower($argv[4]);
        // sessionID only present when dateType defined
        if (in_array($dateType, ['screening', 'visit'])) {
            if (empty($argv[5])) {
                printUsage();
            }

            $sessionID = $argv[5];
        }
    }
    break;

case 'add_instrument':
    if (empty($argv[3]) || empty($argv[4])) {
        printUsage();
    }

    // sessionID
    $sessionID = $argv[3];
    // test name
    $testName = $argv[4];
    break;
}

/**
 * Check arguments for valididty
 * combinations of arguments are tested for each option in the $action switch
 * below and in local functions
 */
// check the $action options
if (!in_array($action, ['diagnose', 'fix_date', 'add_instrument'])) {
    fwrite(
        STDERR,
        "Error: invalid 1st argument ($action).\n Available options are:" .
        "'diagnose','fix_date','add_instrument'\n"
    );
    fwrite(
        STDERR,
        "For the script syntax type: fix_timepoint_date_problems.php help \n"
    );
    return false;
}
// check $candID
if (!preg_match("/^([0-9]{6})$/", $candID)) {
    fwrite(
        STDERR,
        "Error: invalid 2st argument CandID ($candID).\n " .
        "It has to be a 6-digit number\n"
    );
    fwrite(
        STDERR,
        "For the script syntax type: fix_timepoint_date_problems.php help \n"
    );
    return false;
}
// Candidate object - to check if valid $candID
$candidate =& Candidate::singleton($candID);
//get the list of timepoints (sessionIDs) for the profile
$listOfTimePoints = $candidate->getListOfTimePoints();
if (!is_array($listOfTimePoints)) {
    fwrite(
        STDERR,
        "This candidate profile has no registered timepoints. Cannot proceed. \n"
    );
    return false;
}
// check sessionID
if (!empty($sessionID)) {
    // check SessionID - if supplied as an argument, it has to be in the list
    // of existing timepoints
    if (!in_array($sessionID, $listOfTimePoints)) {
        fwrite(
            STDERR,
            "Please specify a valid SessionID for candidate ($candID).\n" .
            " Valid SessionIDs for this subject are:\n"
        );
        foreach ($listOfTimePoints as $key => $val) {
            fwrite(STDERR, "$val\n");
        }
        fwrite(
            STDERR,
            "For the script syntax type: fix_timepoint_date_problems.php help \n"
        );
        return false;
    }
}

/*
 * The switch to execute actions
 */
switch ($action) {
    /**
     * Fixing the behavioural battery by adding the instrument
     * arguments: $candID, $sessionID, $testName
     * RUN THE DIAGNOSTICS BEFORE TO SEE WHAT NEEDS TO BE FIXED
     */
case 'add_instrument':
    // add a missing instrument (sessionID and test name are checked inside the
    // function)
    try {
        $success = addInstrument($sessionID, $testName);
    } catch (LorisException $e) {
        fwrite(
            STDERR,
            "Error: failed to add the instrument $testName for " .
            "timepoint ($sessionID):\n"
        );
        fwrite(STDERR, $e->getMessage(). "\n");
    }

    break;

    /**
     * Fixing the dates
     * arguments: $candID, $dateType, $newDate, $sessionID
     */
case 'fix_date':
    // fix the date (arguments are checked by the function
    // wrapping in an if/else statement to avoid PHP Notice when $sessionID is
    // empty
    try {
        if (!empty($sessionID)) {
            $success = fixDate($candID, $dateType, $newDate, $sessionID);
        } else {
            $success = fixDate($candID, $dateType, $newDate);
        }
    } catch (LorisException $e) {
        fwrite(
            STDERR,
            "Error: failed to fix the date for candidate ($candID):\n"
        );
        fwrite(STDERR, $e->getMessage(). "\n");
    }

    break;

    /**
     * Timepoint Diagnostics
     * Recommended: run the diagnostics once the dates have been fixed, you can
     * also pass the 'correct' date and the date type to see what changes
     * would happen if the dates were different
     */
case 'diagnose':
    if (!empty($sessionID)) {
        // overwrite the array to include the provided $sessionID only
        $listOfTimePoints = [$sessionID];
    }

    // print out candidate info
    fwrite(STDERR, "Candidate: $candID \n");

    // check/diagnose each timepoint separately
    foreach ($listOfTimePoints as $sessionID) {
        // create timepoint object
        $timePoint =& TimePoint::singleton(new \SessionID(strval($sessionID)));

        // print out the $sessionID
        fwrite(
            STDERR,
            "\n Timepoint ".$timePoint->getVisitLabel()." ; SubProjectID: "
            .$timePoint->getSubprojectID()." ; Effective DOB: "
            .$timePoint->getEffectiveDateOfBirth().
            " ; (SessionID): $sessionID \n"
        );

        // diagnose - get the list of missing instruments
        try {
            // wrapping in if statement to avoid PHP notice. Checking for
            // both dateType and newDate at the same time since
            // one should not be set without the other.
            if (isset($dateType) && isset($newDate)) {
                $listNewInstruments = diagnose($sessionID, $dateType, $newDate);
            } else {
                $listNewInstruments = diagnose($sessionID);
            }
        } catch (LorisException $e) {
            // handle the error and skip to next time point
            fwrite(
                STDERR,
                "Error: failed to get the list of needed instruments for " .
                "candidate ($candID), timepoint ($sessionID):\n"
            );
            //print error message from diagnose function
            fwrite(STDERR, $e->getMessage(). "\n");
            continue;
        }

        // if there are missing instruments
        //if (count($listNewInstruments) > 0) {
        if (!empty($listNewInstruments) > 0) {
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
 * Print usage
 *
 * @return void
 */
function printUsage()
{
    fwrite(STDERR, "Usage: \n\n");
    fwrite(STDERR, "fix_timepoint_date_problems.php help\n");
    fwrite(
        STDERR,
        "fix_timepoint_date_problems.php fix_date        "
        . "<candID> <newCorrectDate> <dob/edc>\n"
    );
    fwrite(
        STDERR,
        "fix_timepoint_date_problems.php fix_date        "
        . "<candID> <newCorrectDate> <screening/visit> <sessionID>\n"
    );
    fwrite(STDERR, "fix_timepoint_date_problems.php diagnose        <candID> \n");
    fwrite(
        STDERR,
        "fix_timepoint_date_problems.php diagnose        <candID> "
        . "[<newCorrectDate> <dob/edc/>]\n"
    );
    fwrite(
        STDERR,
        "fix_timepoint_date_problems.php diagnose        "
        . "<candID> [<newCorrectDate> <screening/visit> <sessionID>]\n"
    );
    fwrite(
        STDERR,
        "fix_timepoint_date_problems.php add_instrument  "
        . "<candID> <sessionID> <test_name>\n"
    );
    fwrite(STDERR, "NOTES: The date format is: YYYY-MM-DD.\n");
    fwrite(
        STDERR,
        "fix_date: updates the dates in candidate or session table. "
        . "Does not alter the BVL battery\n"
    );

    exit();
}

/**
 * Adds a bvl instrument to the battery
 * the function checks the args, add the instrument (if valid), creates a bvl
 * feedback, writes a log and displays the message
 *
 * @param int    $sessionID of the timepoint
 * @param string $testName  of the instrument to add to the battery
 *
 * @return void
 *
 * @throws LorisException
 */
function addInstrument($sessionID, $testName)
{
    // check the user $_ENV['USER']
    $user =& User::singleton(getenv('USER'));
    if (is_a($user, 'LORIS\AnonymousUser')) {
        throw new LorisException(
            "Error: Database user named " . getenv('USER')
            . " does not exist. Please create and then retry script\n"
        );
    }

    // check the args
    if (empty($sessionID) || empty($testName)) {
        throw new LorisException("SessionID and Test name must be provided");
    }

    $db =& Database::singleton();

    // create timepoint object
    $timePoint =& TimePoint::singleton(new \SessionID(strval($sessionID)));

    // create battery object
    $battery = new NDB_BVL_Battery();

    // set the SessionID for the battery
    $success = $battery->selectBattery(new \SessionID(strval($sessionID)));

    // check if the instrument is already in the battery
    $existingBattery = $battery->getBattery();

    // return error if instrument is in the battery
    if (in_array($testName, $existingBattery)) {
        throw new LorisException(
            "WARNING, cannot add new instrument ($testName) because it's " .
            "already part of the battery for timepoint ($sessionID) \n"
        );
    }

    // add to battery - this method check if the $testName is valid
    $success = $battery->addInstrument($testName);

    // get CommentID of the newly assigned instrument
    $query = "SELECT CommentID FROM flag
        WHERE SessionID='$sessionID' AND Test_name='$testName'";

    /*
     * add Feedback
     */
    // feedback object
    print $user->getUsername();
    $feedback = NDB_BVL_Feedback::singleton(
        $user->getUsername(),
        null,
        $sessionID
    );

    //get thread feedback type
    $threadFeedbackType = $feedback->getFeedbackTypeIdByName('other');
    if (empty($threadFeedbackType)) {
        //create thread feedback type "Other", if it does not exist
        $threadFeedbackType = $feedback->createFeedbackType("Other", "Other");
    }

    // add the new thread
    $success = $feedback->createThread(
        'instrument',
        $threadFeedbackType,
        "Instrument ($testName) has been added to the battery. You may now " .
        "complete data entry for this instrument. Please respond to this " .
        "feedback to acknowledge the changes.",
        'Y'
    );

    // activate threads
    $success = $feedback->activateThread();

    // print the success msg
    fwrite(
        STDERR,
        "Added the instrument ($testName) to the battery of the timepoint " .
        "($sessionID)\n"
    );

    // destroy objects
    unset($timePoint);
    unset($battery);
    unset($feedback);

    return;
}

/**
 * Updates the date field in database
 * the function checks the args, updates the date, write the log (print) and
 * prints msg on the screen
 *
 * @param int    $candID    The candID
 * @param string $dateType  of the date to change
 * @param string $newDate   in format YYYY-MM-DD
 * @param ?int   $sessionID the sessionID
 *
 * @return void
 *
 * @throws LorisException
 */
function fixDate($candID, $dateType, $newDate, $sessionID = null)
{
    // check the user $_ENV['USER']
    $user =& User::singleton(getenv('USER'));
    if (is_a($user, 'LORIS\AnonymousUser')) {
        throw new LorisException(
            "Error: A loris user named " . getenv('USER')
            . " does not exist. Please create it and then retry the script.\n"
        );
    }

    $db =& Database::singleton();

    // check the args
    if (empty($dateType)
        || !in_array($dateType, ['dob', 'edc', 'screening', 'visit'])
        || empty($newDate)
        || (in_array($dateType, ['screening', 'visit']) && empty($sessionID))
    ) {
        throw new LorisException("Please pass a valid set of arguments\n");
    }

    // check the date format (redundant)
    $dateArray = explode('-', $newDate);
    if (!is_array($dateArray)
        || !checkdate($dateArray[1], $dateArray[2], $dateArray[0])
    ) {
        throw new LorisException(
            "Invalid Date! Please use the following format: YYYY-MM-DD \n"
        );
    }
    unset($dateArray);

    // candidate object - needed to get the dob/edc
    $candidate =& Candidate::singleton($candID);

    // fixing DOB or EDC
    if (in_array($dateType, ['dob', 'edc'])) {
        // set and where arrays
        $setArray   = [$dateType => $newDate];
        $whereArray = ['CandID' => $candID];

        // update candidate table record
        $success = $db->update('candidate', $setArray, $whereArray);

        /*
        * add Feedback
        */
        // feedback object
        $feedback =& NDB_BVL_Feedback::singleton($user->getUsername(), $candID);

        // add the new thread
        $success = $feedback->createThread(
            'profile',
            '5',
            "The date of $dateType has been changed to $newDate.",
            'N'
        );

        // log the change
        fwrite(
            STDERR,
            "Updated $dateType to: $newDate, for candidate $candID. " .
            "Check the record in the DB! \n"
        );
    } else {
        // fixing Date_screening or Date_visit

        // create timepoint object
        $timePoint =& TimePoint::singleton(new \SessionID(strval($sessionID)));

        // check if the timepoint is started before attempting to make changes
        // to it
        if ($timePoint->getCurrentStage() == 'Not Started') {
            throw new LorisException(
                "Error: Cannot perform screening/visit date fixes on the " .
                "non-started timepoints!"
            );
        }

        // get the stage statuses
        $screeningStage = $timePoint->getScreeningStatus();
        $visitStage     = $timePoint->getVisitStatus();
        // make sure that the stage to fix is started
        if ($dateType == 'visit'
            && empty($visitStage)
            || $dateType == 'screening'
            && empty($screeningStage)
        ) {
            throw new LorisException(
                "Error: failed to retrieve the date of $dateType "
                . "(sessionID: $sessionID) because that stage was not started!"
            );
        }

        // set and where arrays for the update
        $setArray   = ["Date_".$dateType => $newDate];
        $whereArray = ["ID" => $sessionID];

        // update session table record
        $success = $db->update('session', $setArray, $whereArray);

        /*
        * add Feedback
        */
        // feedback object
        $sID      = $sessionID ? new \SessionID(strval($sessionID)) : null;
        $feedback =& NDB_BVL_Feedback::singleton(
            $user->getUsername(),
            null,
            $sID
        );

        // add the new thread
        $success = $feedback->createThread(
            'visit',
            '5',
            "The date of $dateType has been changed to $newDate.",
            'N'
        );

        // log the change
        fwrite(
            STDERR,
            "Updated date of $dateType to $newDate, for candidate $candID, " .
            "timepoint $sessionID. Check the DB record!\n"
        );
    } // end if

    return;
}


/**
 * Returns an array of missing instruments for the timepoint
 *
 * @param int     $sessionID timepoint's sessionID, field session.ID
 * @param ?string $dateType  type of date to change
 * @param string  $newDate   new date to use to define the battery
 *
 * @return array list of missing instruments
 *
 * @throws LorisException
 */
function diagnose($sessionID, $dateType = null, $newDate = null)
{
    // check args: sessionID
    if (empty($sessionID)) {
        throw new LorisException("Error: SessionID missing!");
    }
    // check args: dateType and newDate
    if (!empty($dateType) || !empty($newDate)) {
        // check the args
        if (empty($dateType)
            || !in_array($dateType, ['dob', 'edc', 'screening', 'visit'])
            || empty($newDate)
            || (in_array($dateType, ['screening', 'visit'])
            && empty($sessionID))
        ) {
            throw new LorisException("Please pass a valid set of arguments\n");
        }

        // check the date format (redundant)
        $dateArray = explode('-', $newDate);
        if (!is_array($dateArray)
            || !checkdate($dateArray[1], $dateArray[2], $dateArray[0])
        ) {
            throw new LorisException(
                "Invalid Date! Please use the following format: YYYY-MM-DD"
            );
        }
        unset($dateArray);
    }

    // create timepoint object
    $timePoint =& TimePoint::singleton(new \SessionID(strval($sessionID)));

    // candidate object - needed to get the dob/edc
    // $candidate =& Candidate::singleton($timePoint->getCandID());

    // get the statuses and dates of the screening and visit stages to decide
    // what to do w/ each of them
    $stageList['screening']['status'] = $timePoint->getScreeningStatus();
    $stageList['screening']['date']   = $timePoint->getDateOfScreening();
    $stageList['visit']['status']     = $timePoint->getVisitStatus();
    $stageList['visit']['date']       = $timePoint->getDateOfVisit();
    $subProjectID = $timePoint->getSubprojectID();

    // define the date of birth to use (dob or edc)
    if (($dateType=='dob' && $subProjectID==1)
        || ($dateType=='edc' && $subProjectID==2)
    ) {
        $dateBirth = $newDate;
    } else {
        $dateBirth = $timePoint->getEffectiveDateOfBirth();
    }

    // check if the timepoint is started before attempting to make changes to it
    if ($timePoint->getCurrentStage() == 'Not Started'
        || empty($stageList['screening']['status'])
    ) {
        throw new LorisException(
            "Error: Cannot diagnose the timepoint ($sessionID) " .
            "for candidate (".$timePoint->getCandID()."). "
            . "Make sure that the timepoint is started ("
            . $timePoint->getCurrentStage().") "
            . "and screening status is set ("
            . $stageList['screening']['status'].")."
        );
    }
    // check the subProjectID
    if (empty($subProjectID)) {
        throw new LorisException(
            "SubProjectID ($subProjectID) is empty for timepoint ($sessionID)"
        );
    }

    // initialize the array
    $missingInstruments = [];

    // check/diagnose the battery for each stage
    foreach ($stageList as $stage => $stageData) {
        // if the stage is started
        if (!empty($stageData['status'])) {
            if (!empty($newDate) && strtolower($dateType)==$stage) {
                $dateOfStage = $newDate;
            } else if (!empty($stageList[$stage]['date'])) {
                $dateOfStage = $stageList[$stage]['date'];
            } else {
                $dateOfStage = null;
                $age         = 0;
                fwrite(
                    STDERR,
                    "ERROR: Stage $stage for sessionID $sessionID"
                    . " does not have a date.\n"
                );
            }

            if (!empty($dateOfStage)) {
                // compute subject age for the current stage
                $ageArray = Utility::calculateAge($dateBirth, $dateOfStage);
                $age      = ($ageArray['year'] * 12 + $ageArray['mon']) * 30
                            + $ageArray['day'];
                if ($age < 0) {
                    $age = 0;
                }
                unset($ageArray);
            }
            fwrite(STDERR, "Age at $stage: $age [ $dateBirth $dateOfStage]\n");

            // create battery object
            $battery = new NDB_BVL_Battery();

            // set the SessionID for the battery
            $success = $battery->selectBattery(new \SessionID(strval($sessionID)));

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
