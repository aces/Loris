#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * Detects the duplicated commentids for the given instrument
 *
 * PHP version 7
 *
 * @category Main
 * @package  Loris
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once "generic_includes.php";
require_once "NDB_BVL_InstrumentStatus.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "User.class.inc";
require_once "Utility.class.inc";
require_once "NDB_Client.class.inc";

/**
 * TODO:
 * 1) The option for removing the excluded_feedbacks should be added as well
 */

/* @var int The minimum number of arguments required to run this script. */
const MIN_NUMBER_OF_ARGS = 2;

/* @var int The maximum number of arguments to run this script. */
const MAX_NUMBER_OF_ARGS = 6;

/* @var int The getCommentIDs function must return an array of at least this
 * size to be included in the csv output.
 */
const MIN_SIZE_OF_COMMENTID_ARRAY = 2;

// User prompt
if ((count($argv) < MIN_NUMBER_OF_ARGS) || (count($argv) > MAX_NUMBER_OF_ARGS)) {
    echo "Usage: php detect_duplicated_commentids.php -i Instrument \n";
    echo "Example: php detect_duplicated_commentids.php bdi \n";

    echo "to run the script for all the instruments
            simply type -i all \n";
    die();
}

// parse the options
$opts        = getopt("i:r");
$change      = false;
$change_all  = false;
$instrument  = null;
$visit_label = null;
$to_remove   = false;
if (!is_array($opts)) {
    print "There was a problem reading in the options.\n\n";
    exit(1);
}

/**
 * IF it's an instrument
 */
if ($opts['i']!=null) {
    $instrument = $opts['i'];
}

/**
 * To be removed
 */
if (($opts['r'])!=null) {
    $to_remove = true;
}


/**
 * Initialization
 */
$dataDir    = "logs";
$diff       = null;
$commentids = [];
//Check to see if the variable instrument is set
if (($instrument=='all') ||($instrument=='All')) {
    $instruments = Utility::getAllInstruments();
} else {
    $instruments = [$instrument => $instrument];
}

//get all candidates
$candidates = $DB->pselect("SELECT CandID, PSCID FROM candidate", []);
//get all cohortids
$cohortids = $DB->pselect(
    "SELECT DISTINCT cohortid FROM session",
    []
);

foreach ($instruments as $instrument => $full_name) {
    if ((isset($instrument)) && (hasData($instrument))) {
        print "instrument is $instrument \n";
        $commentids = [];
        foreach ($candidates as $candidate) {
            $candid = $candidate['CandID'];
            $pscid  = $candidate['PSCID'];
            foreach ($cohortids as $cohortid) {
                $session_info = $DB->pselect(
                    "SELECT DISTINCT s.Visit_label,s.ID from session s
                    JOIN candidate c on (c.candid=s.candid)
                    JOIN flag f on (f.sessionid=s.id)
                    JOIN test_names tn ON tn.ID = f.TestID
                    WHERE s.candID = :cid AND tn.test_name = :fname AND
                    s.cohortid = :cohortid",
                    [
                        'cid'      => $candid,
                        'fname'    => $instrument,
                        'cohortid' => $cohortid['cohortid'],
                    ]
                );
                if (($session_info!=null) && (!empty($session_info))) {
                    $sessionid   = $session_info[0]['ID'];
                    $visit_label = $session_info[0]['Visit_label'];
                    if ($sessionid !=null) {
                        $commentid = getCommentIDs(
                            $instrument,
                            $visit_label,
                            $sessionid,
                            $candid,
                            $pscid,
                            $cohortid['cohortid']
                        );
                        $size      = sizeof($commentid);
                        if ($size >= MIN_SIZE_OF_COMMENTID_ARRAY) {
                            $commentids[] = $commentid;
                        }
                    }
                }
            }
        }
        if (empty($commentids)) {
            print "No duplicated Data detected for $instrument \n";
        }
        writeCSV($commentids, $dataDir, $instrument, "detect_duplicated_commentids");
    }
}





/**
 * Get the commentids for the given instrument, candidate and visit_label
 *
 * @param String  $test_name   The instrument been searched
 * @param ?string $visit_label The VisitLabel Placed in the CSV file
 * @param ?string $sid         The SessionID been searched
 * @param ?string $candid      The candid been searched
 * @param ?string $pscid       The PSCID been searched
 * @param ?string $cohortid    The subprojecitd been searched
 *
 * @return array $commentids An array of commentids found
 */
function getCommentIDs(
    $test_name,
    $visit_label = null,
    $sid = null,
    $candid = null,
    $pscid = null,
    $cohortid = null
) {

    $commentID  = $candid. $pscid. $sid . $cohortid;
    $commentids = [];
    $flag_info  = [];

    if ($commentID !=null && $test_name!=null) {
        $query = " SELECT '$pscid' AS PSCID,'$visit_label' AS VisitLabel,
                 t.* FROM $test_name t";
        $where = " WHERE t.CommentID LIKE CONCAT ('%', :cid, '%')
                   AND t.CommentID NOT LIKE '%DDE%'";
        if ($commentID!=null) {
            $params['cid'] = $commentID;
        }
        $query     .=$where;
        $commentids = $GLOBALS['DB']->pselect($query, $params);
    }

    ///include the flag_data_entry and in_flag
    if ($commentids !=null) {
        foreach ($commentids as $key => $commentid) {
            $flag = [];
            $flag = $GLOBALS['DB']->pselectRow(
                "SELECT * FROM flag WHERE CommentID = :cid",
                ['cid' => $commentid['CommentID']]
            );
            $flag_info['flag_data_entry'] = $flag['Data_entry'];
            $flag_info['in_flag']         = 'No';
            if (($flag!=null)&&(!empty($flag))) {
                $flag_info['in_flag'] = 'Yes';
            }
            $commentid        = $flag_info + $commentid;
            $commentids[$key] = $commentid;
        }
    }
    return $commentids;
}



/**
 * Write the data into a csv file
 *
 * @param String $output     Array of data been written into csv
 * @param String $path       The file path
 * @param String $instrument The name of the instrument
 *
 * @return void
 */
function writeCSV($output, $path, $instrument)
{
    /**
     * Construct the file-path
     */
    if ($output!=null) {
        $name = $instrument . "_" . date('ymd-His') . ".csv";
        $path = "$path/$name";

        //Write the header into the file
        $fp = fopen($path, 'w');
        $column_headers = $output[0][0];
        $column_headers = array_keys($column_headers);
        fputcsv($fp, $column_headers, "\t"); //write the headers to the CSV file
        // insert the data into the csv file
        foreach ($output as $data) {
            foreach ($data as $array) {
                fputcsv($fp, $array, "\t"); //write the headers to the CSV file
            }
        }
        fclose($fp);
        print "The CSV output for $prefix (for instrument $instrument)
        is available under $path \n";
    }
}
/**
 * Checks to see if the table has some data
 *
 * @param String $instrument instrument-name
 *
 * @return NULL
 */
function hasData($instrument)
{
    $commentids = $GLOBALS['DB']->pselect(
        "SELECT COUNT(*) FROM $instrument",
        []
    );
    if ((count($commentids)) > 0) {
        return true;
    }
    return false;
}

?>
