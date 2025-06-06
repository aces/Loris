<?php declare(strict_types=1);

/**
 * This tool scores any registered instrument that was built using the
 * NDB_BVL_Instrument class and that has a working score() method.
 * The command line arguments need to contain a valid test_name, a 'all' or 'one'
 * option, a CandID and a SessionID.
 *
 * The 'all' option scores all existing records of an instrument if and only if
 *  - They belong to an active timepoint
 *  - The data-entry status of the timepoint is set to `complete`
 *  - The administration of the timepoint is NOT `none`
 *
 * Note: This tool can also be used to debug the scoring algorithms for development.
 *
 * Limitation: This tool does not reset or nullify the score of an instrument
 * which was previously scored but no longer meets the criteria above (i.e. if the
 * administration was changed from `all` to `none`, the score will not be removed).
 *
 * @package behavioural
 */

require_once __DIR__."/../generic_includes.php";

// LOGGING
$dir = __DIR__ . "/../logs/";
if (!is_dir($dir)) {
    mkdir($dir);
}
$date    = date("Y-m-d_h:i");
$logPath = "$dir/score_instrument.$date.log";
$logfp   = fopen($logPath, 'a');

if (!$logfp) {
    printError(
        "No logs can be generated, path:$logPath ".
        "does not exist or can not be written to.\n"
    );
}

/* -------------------------
 * HELP SCREEN
 * display and stop processing if action=help
 * -------------------------
 */
if (isset($argv[1]) && $argv[1] === 'help' || in_array('-h', $argv, true)) {
    showHelp();
}

if (empty($argv[1])
    || ($argv[1] !== 'all' && empty($argv[2]))
    || ($argv[1] !== 'all'
    && $argv[2]=='one'
    && (empty($argv[3]) || empty($argv[4])))
) {
    echo "\nERROR: Too few arguments passed. Check documentation and try again.";
    showHelp();
}
if (($argv[1] === 'all' && isset($argv[2]) && $argv[2] !== 'inprogress')
    || ($argv[1] !== 'all' && !in_array($argv[2], ['all', 'one'], true))
    || ($argv[1] !== 'all'
    && $argv[2] === 'all'
    && isset($argv[3])
    && $argv[3] !== 'inprogress')
    || ($argv[1] !== 'all'
    && $argv[2] === 'one'
    && isset($argv[5])
    && $argv[5] !== 'inprogress')
) {
    echo "\nERROR: Too many or incorrect arguments passed. "
    . "Check documentation and try again.";

    showHelp();
}

/* -------------------------
 * get cmd-line arguments
 * -------------------------
 */

// get $action argument
$test_name = $argv[1];
// get scope of changes. all stages or only inprogress
$inProgress = in_array('inprogress', $argv, true);
// get $action argument
$action ='';
if (isset($argv[2]) && $argv[2] !== 'inprogress') {
    $action = strtolower($argv[2]);
}
// CandID
if (!empty($argv[3]) && $argv[3] !== 'inprogress') {
    $candID = $argv[3];
}
// sessionID
if (!empty($argv[4])) {
    $sessionID = $argv[4];
}

// include instrument class
if (strtolower($test_name) != 'all') {
    if (!is_file(
        __DIR__
        . "/../../project/instruments/NDB_BVL_Instrument_$test_name.class.inc"
    ) && !is_file(__DIR__."/../../project/instruments/$test_name.linst")
    ) {
        printError(
            "Included file does not exist ("
            . __DIR__
            . "/../../project/instruments/NDB_BVL_Instrument_$test_name.class.inc)"
        );

        return false;
    }
}

// check that the $test_name is a valid instrument
$qparams = [];
if ($test_name== 'all') {
    $query = "SELECT Test_name FROM test_names";
} else {
    $query          = "SELECT Test_name FROM test_names WHERE Test_name = :tnm";
    $qparams['tnm'] = $test_name;
}
$testNames = $DB->pselect($query, $qparams);

// if nothing is returned than the instrument DNE
if (count($testNames) === 0) {
    printError("Invalid Instrument ($test_name)!");
    return false;
}

// get the list of CommentIDs for valid timepoints
foreach ($testNames as $test) {
    $instrumentName = $test['Test_name'];
    printOut("Running scoring for $instrumentName");
    logMessage("------------------------------");

    $query = "
        SELECT c.CandID,
            s.Visit_label,
            s.ID as SessionID,
            f.CommentID,
            c.PSCID
        FROM candidate c
            JOIN session s ON c.ID=s.CandidateID
            JOIN flag f ON s.ID=f.SessionID
            JOIN test_names tn ON tn.ID = f.TestID
        WHERE s.Active = 'Y'
            AND c.Active='Y'
            AND tn.Test_name = :tnm
            AND f.Administration <> 'None'
            AND f.Administration IS NOT NULL
            ";

    $params = ['tnm' => $instrumentName];

    // only want to score one instrument for one candidate
    if ($action=='one') {
        $query .= " AND s.ID = :sid AND c.CandID= :cid";
        $params = array_merge(
            $params,
            [
                'sid' => $sessionID,
                'cid' => $candID,
            ]
        );
    }

    // only want to score sessions that are still in the Visit stage.
    if ($inProgress) {
        $query .= " AND s.Current_stage='Visit'";
    }

    $instrumentMetaData = $DB->pselect($query, $params);

    // return error if no candidates/timepoint matched the args
    if (count($instrumentMetaData) === 0) {
        // given that the tool might be run with all
        // $candID and $sessionID might not be defined
        if (!empty($candID) && !empty($sessionID)) {
            printOut(
                "No records match the criteria returned for "
                . "candidate ($candID), "
                . "timepoint ($sessionID), "
                . "instrument ($instrumentName)!"
            );
        } else {
            printOut("No records for instrument $instrumentName!");
        }
        continue;
    }

    printOut("Start");

    // loop the list and derive scores for each record
    foreach ($instrumentMetaData as $record) {
        // make an instance of the instrument's object
        $instrument      = NDB_BVL_Instrument::factory(
            $lorisInstance,
            $instrumentName,
            $record['CommentID'],
            '',
        );
        $instrumentTable = $instrument->table;

        // print out candidate/session info
        printOut(
            "Candidate: "
            . $record['CandID']
            . "/"
            . $record['Visit_label']
            . "/"
            . $record['SessionID']
            . ":: ("
            . $record['PSCID']
            . ")"
        );

        // call the score function
        $oldRecord = $instrument->getInstanceData();
        $success   = $instrument->score();
        $newRecord = $instrument->getInstanceData();
        unset($oldRecord['Testdate']);
        unset($newRecord['Testdate']);
        $diff = array_diff_assoc($oldRecord, $newRecord);

        if ($diff != []) {
            logMessage("Updated $record[CommentID]:");
            foreach ($diff as $key => $val) {
                $old = $oldRecord[$key] == null ? 'null' : $oldRecord[$key];
                $new = $newRecord[$key] == null ? 'null' : $newRecord[$key];
                logMessage("\t$key: $old => $new");
            }
        } else {
            logMessage("No changes made to " . $record['CommentID']);
        }
        // unset
        unset($instrument);
    }
}
printOut("End");
fclose($logfp);

/**
 * Prints to log file
 *
 * @param string $message The message to print
 *
 * @return void
 */
function logMessage($message)
{
    global $logfp;
    if (!$logfp) {
        //The log file could not be instantiated
        //use print instead
        print_r($message);
    }
    $now_string = date("Y-m-d h:i:s");
    fwrite($logfp, "[$now_string] $message\n");
}

/**
 * Prints to STDERR
 *
 * @param string $message The message to print
 *
 * @return void
 */
function printError($message)
{
    logMessage($message);
    fwrite(STDERR, "$message \n");
}

/**
 * Prints to STDOUT
 *
 * @param string $message The message to print
 *
 * @return void
 */
function printOut($message)
{
    logMessage($message);
    print_r("$message\n");
}

/**
 * Show Help Message
 *
 * @return void
 */
function showHelp()
{
    echo "\n\n*** Score Instruments ***\n\n";

    echo "Usage:
    score_instrument.php [help | -h]                                       "
    . "-> displays this message

    score_instrument.php <test_name> one <candID> <sessionID> [inprogress] "
    . "-> scores test only for this candidate

    score_instrument.php <test_name> all [inprogress]                      "
    . "-> scores test for all candidates meeting the necessary criteria

    score_instrument.php all [inprogress]                                  "
    . "-> scores all instruments for all candidates meeting the necessary criteria
    \n\n";

    die();
}
