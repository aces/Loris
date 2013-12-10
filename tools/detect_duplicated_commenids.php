#!/usr/bin/php
<?php
/**
 * detects the duplicated commentids for the given instrument
 *
 * PHP version 5
 *
 * @category Utility_Script
 * @package  Loris_Script 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/IBIS
 */
require_once "generic_includes.php";
require_once "ConflictDetector.class.inc";
require_once "NDB_BVL_InstrumentStatus.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "User.class.inc";
require_once "Utility.class.inc";
require_once "NDB_Client.class.inc";

/**
 * *Todo:
 * 1) The option for removing the excluded_feedbacks should be added as well
 */

/**
 * User prompt
 */
if ((count($argv)<2) || (count($argv)>6)) {


    echo "Usage: php detect_conflicts.php -i Instrument \n";
    echo "Example: php detect_conflicts.php bdi \n";

    echo "to run the script for all the instruments
            simply type -i all \n";
    die();
}

/**
 * parse the options
 */
$opts = getopt("i:t");
$change = false;
$change_all = false;
$instrument = null;
$visit_label = null;
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
 * Initialization
 */
$config = NDB_Config::singleton();
$db = Database::singleton();
$ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
$config = NDB_Config::singleton();
$db_config = $config->getSetting('database');
//$dataDir = "/home/gustodatabaseuser/conflicts/".$db_config['database'];
$dataDir = "logs";
$diff = null;
$new_conflicts = array();
$recreated_conflicts = array();
$current_conflicts = array();
$conflicts_to_be_excluded = array();
/**
 * Check to see if the variable instrument is set
 */
if (($instrument=='all') ||($instrument=='All')){
    $instruments = Utility::getAllInstruments();
}
else{
    $instruments = array($instrument=>$instrument);
}

$candidates= $DB->pselect("SELECT CandID, PSCID FROM candidate",array());

//get all the candidates:
//$candidates = $db->pselect("SELECT Candid,PSCID FROM CANDIDATES")
$subprojectids = $DB->pselect("SELECT DISTINCT subprojectid FROM session",array());

//print_r($instruments);
foreach ($instruments as $instrument=>$full_name) {
    print "instrument is $instrument";
    if ((isset($instrument)) && (hasData($instrument))) {
        print "instrument is $instrument";
        $commentids = array();
        foreach ($candidates as $candidate){
            $candid = $candidate['CandID'];
            $pscid = $candidate['PSCID'];
            foreach($subprojectids as $subprojectid) {
                $session_info = $DB->pselectRow("SELECT DISTINCT s.Visit_label,s.ID from session s
             JOIN candidate c on (c.candid=s.candid)
             JOIN flag f on (f.sessionid=s.id)
             WHERE s.candID = :cid AND f.test_name = :fname AND s.subprojectid = :subid",
                array('cid'=>$candid,'fname'=>$instrument,'subid'=>$subprojectid['subprojectid']));
                $sessionid = $session_info['ID'];
                $visit_label = $session_info['Visit_label'];
                if ($sessionid !=null){
                    // if ($pscid == '010-20860'){
                    $commentid = getCommentIDs($instrument,$visit_label,$sessionid,$candid,$pscid,$subprojectid['subprojectid']);
                    $size = sizeof($commentid);
                    if ($size>=2){
                        print_r($commentid);
                        print"\n=================================================================\n";
                        $commentids[] = $commentid;
                        //print_r($commentids);
                    }
                }
            }
        }
        writeCSV($commentids, $dataDir, $instrument,"Conflicts_to_be_inserted");
    }
}
///print_r($commentids);




/**
*Get the commentids for the given instrument, candidate and visit_label
*
* @param String $test_name    The instrument been searched
* @param string $Visitlabel   The VisitLabel Placed in the CSV file
* @param string $sessionid    The SessionID been searched
* @param string $candid       The candid been searched
* @param string $pscid        The PSCID been searched
* @param string $subprojectid The subprojecitd been searched
* 
* @return array $commentids An array of commentids found
* 
*/

//Add in or not-in flag...
//Data_entry done or not...

function getCommentIDs($test_name, $visit_label=null,$sid=null, $candid=null,$pscid=null,$subprojectid=null)
{

    $commentID = $candid. $pscid. $sid . $subprojectid;
    $commentids = array();
    $flag_info = array();

    if ($commentID !=null && $test_name!=null){
        $query = " SELECT '$pscid' AS PSCID,'$visit_label' AS VisitLabel, t.* FROM $test_name t";
        $where = " WHERE t.CommentID like concat ('%', :cid, '%')
                   AND t.CommentID NOT LIKE '%DDE%'";

        if ($commentID!=null) {
            $params['cid'] = $commentID;
        }

        $query .=$where;
        $commentids = $GLOBALS['DB']->pselect($query, $params);
    }

    ///include the flag_data_entry  and in_flag
    if ($commentids !=null) {


        foreach ($commentids as $key=>$commentid){
            $flag = array();
            $flag = $GLOBALS['DB']->pselectRow("SELECT * FROM flag where CommentID = :cid",array('cid'=>$commentid['CommentID']));
            $flag_info['flag_data_entry'] = $flag['Data_entry'];
            $flag_info['in_flag'] = 'No';

            if (($flag!=null)&&(!empty($flag))){
                $flag_info['in_flag'] = 'Yes';
            }
            $commentid = $flag_info + $commentid;
            $commentids[$key] = $commentid;
            
        }

    }


    /*
    if ($cids!=null){
    foreach ($cids as $cid){
    $commentids[] = $cid;
    }
    }
    */
    return $commentids;
}



/**
*  Write the data into a csv file
*
* @param String       $output      Array of data been written into csv
* @param unknown_type $path        The file path
* @param unknown_type $instrument  The name of the instrument
* @param unknown_type $visit_label The name of the visit
* @param unknown_type $prefix      The type of csv file
* 
* @return Null
*/

function writeCSV($output,$path,$instrument)
{

    /**
     * Construct the file-path
     */
    if ($output!=null) {
        $name = $instrument . "_" . date('ymd-His') . ".csv";
        $path = "$path/$name";
        /**
         * Write the header into the file
         */
        $fp = fopen($path, 'w');

        $column_headers = $output[0][0];
        //print_r($column_headers);
        $column_headers = array_keys($column_headers);
        fputcsv($fp, $column_headers, "\t"); //write the headers to the CSV file
        /**
         * insert the data into the csv file
         */
        foreach ($output as $data) {
            foreach($data as $array){
                //print_r($array);
                fputcsv($fp, $array, "\t"); //write the headers to the CSV file
            }
        }
        fclose($fp);
        print "The CSV output for $prefix (for instrument $instrument) is available under $path \n";
    }
}


function hasData($instrument){
    $commentids = $GLOBALS['DB']->pselect("SELECT COUNT(*) FROM $instrument", array());
    if ((count($commentids)) > 0){
        return true;
    }
    return false;
}

?>
