<?php
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
require_once __DIR__ . "/../vendor/autoload.php";
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

/**
 * User prompt
 */

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

// If it's an instrument
if ($opts['i']!=null) {
    $instrument = $opts['i'];
}

// to be removed
if ($opts['r']!=null) {
    $to_remove = true;
}


/**
 * Initialization
 */
$config         = NDB_Config::singleton();
$ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
$dataDir        = "logs";
$diff           = null;
$commentids     = array();
//Check to see if the variable instrument is set
if (($instrument=='all') ||($instrument=='All')) {
    $instruments = Utility::getAllInstruments();
} else {
    $instruments = array($instrument => $instrument);
}

//get all candidates
$candidates = $DB->pselect("SELECT CandID, PSCID FROM candidate", array());
//get all subprojectids
$subprojectids = $DB->pselect(
    "SELECT DISTINCT subprojectid FROM session",
    array()
);

foreach ($instruments as $instrument=>$full_name) {

    if ((isset($instrument)) && (hasData($instrument))) {
        print "instrument is $instrument \n";
        $commentids = array();
        foreach ($candidates as $candidate) {
            $candid = $candidate['CandID'];
            $pscid  = $candidate['PSCID'];
            foreach ($subprojectids as $subprojectid) {
                $session_info = $DB->pselectRow(
                    "SELECT DISTINCT s.Visit_label,s.ID from session s
                    JOIN candidate c on (c.candid=s.candid)
                    JOIN flag f on (f.sessionid=s.id)
                    WHERE s.candID = :cid AND f.test_name = :fname AND
                    s.subprojectid = :subid",
                    array(
                        'cid'   => $candid,
                        'fname' => $instrument,
                        'subid' => $subprojectid['subprojectid'],
                    )
                );
                if (($session_info!=null) && (!empty($session_info))) {
                    $sessionid   = $session_info['ID'];
                    $visit_label = $session_info['Visit_label'];
                    if ($sessionid !=null) {
                        $commentid = getCommentIDs(
                            $instrument,
                            $visit_label,
                            $sessionid,
                            $candid,
                            $pscid,
                            $subprojectid['subprojectid']
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
 * @param string $test_name    The instrument been searched
 * @param string $visit_label  The VisitLabel Placed in the CSV file
 * @param string $sid          The SessionID been searched
 * @param string $candid       The candid been searched
 * @param string $pscid        The PSCID been searched
 * @param string $subprojectid The subprojecitd been searched
 *
 * @return array $commentids An array of commentids found
 */
function getCommentIDs(
    $test_name, $visit_label=null, $sid=null,
    $candid=null,$pscid=null, $subprojectid=null
) {

    $commentID  = $candid. $pscid. $sid . $subprojectid;
    $commentids = array();
    $flag_info  = array();

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
        foreach ($commentids as $key=>$commentid) {
            $flag = array();
            $flag = $GLOBALS['DB']->pselectRow(
                "SELECT * FROM flag WHERE CommentID = :cid",
                array('cid' => $commentid['CommentID'])
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
 *  Write the data into a csv file
 *
 * @param String $output     Array of data been written into csv
 * @param String $path       The file path
 * @param String $instrument The name of the instrument
 *
 * @return NULL
 */
function writeCSV($output,$path,$instrument)
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
        array()
    );
    if ((count($commentids)) > 0) {
        return true;
    }
    return false;
}


