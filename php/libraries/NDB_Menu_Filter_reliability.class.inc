<?php
require_once 'NDB_Menu_Filter.class.inc';
require_once 'Utility.class.inc';
/**
 * The menu for the reliability checking
 * @package mri
 * @subpackage NIHPD
 */

function map_cIDs($array){
    $new_array;
    for($i = 0; $i < count($array); $i++){
      $element = $array[$i];
      $new_array[$element['CommentID']] = $element['reliability_center_id'];
    }
    return $new_array;
}

function find_cID($cID, $array){
  if(empty($array)){
    return false;
  }
  foreach($array as $key=>$value){
    if($key == $cID){
      return true;
    }
  }
  return false;
}

function array_remove($item, $array){
  $index = array_search($item, $array);
  if($index === false){
    return $array;
  }else{
    unset($array[$index]);
    return array_values($array); 
  }
}
 
class NDB_Menu_Filter_reliability extends NDB_Menu_Filter
{

    var $centerIDMap;
    var $reliability_table;
    function _hasAccess() {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        if($user->hasPermission('access_all_profiles') || $user->hasPermission('reliability_edit_all')) {
            return true;
        }
        return false;
    }

    static function getSiteID($site){
        $siteList = Utility::getSiteList();
        foreach($siteList as $id=>$name){    
            $site_id[$name] = $id;
        }
        $id = $site_id[$site];
        return $id;  
    }

    function _setupVariables()
    {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // create the centerID map
        $db =& Database::singleton();
        $pscRows = array();
        $pscRows = $db->pselect("SELECT CenterID, Name FROM psc");
        foreach($pscRows AS $row) {
            $this->centerIDMap[$row['CenterID']] = $row['Name'];
        }
        
        $this->_populate_reliability_table();

        $query = " FROM candidate, session, flag, reliability WHERE reliability.CommentID=flag.CommentID AND candidate.CandID=session.CandID AND session.ID=flag.SessionID";

        // only view their own profiles, unless they have permission to see all
        if (!($user->hasPermission('reliability_edit_all') || $user->hasPermission('access_all_profiles'))) {
            $query .= " AND candidate.centerID = '" . $user->getData('CenterID') . "' "; 
        }

        // set the class variables
        $this->columns = array('reliability.CommentID', 'candidate.PSCID', 'reliability.reliability_center_id AS Site', 'session.SubprojectID as Cohort', 'session.CandID AS DCCID', 'candidate.Gender', 'session.Visit_label', 'reliability.Instrument', 'reliability.Reliability_score', 'session.Current_stage', 'reliability.invalid', 'reliability.Manual_Swap');

        $this->query = $query;
        $this->group_by = '';
        $this->order_by = 'reliability.Instrument, session.CandID, session.Visit_label';
        $this->headers = array('PSCID', 'reliability_center_id','Cohort', 'DCCID', 'Gender', 'Visit_label', 'Instrument', 'reliability_score', 'Reliable');
        $this->validFilters = array('reliability.CommentID', 'reliability.reliability_center_id', 'session.SubprojectID', 'candidate.CenterID', 'session.CandID', 'candidate.PSCID', 'candidate.Gender', 'session.Visit_label', 'reliability.Instrument', 'reliability.Reliability_score', 'session.Current_stage', 'reliability.invalid');

        $this->formToFilter = array(
                                    'CommentID' => 'reliability.CommentID',
                                    'Cohort' => 'session.SubprojectID',
                                    'CenterID' => 'candidate.CenterID',
                                    'reliability_center_id'=> 'reliability.reliability_center_id',
                                    'DCCID' => 'candidate.CandID',
                                    'PSCID' => 'candidate.PSCID',
                                    'Gender' => 'candidate.Gender',
                                    'Visit_label' => 'session.Visit_label',
		                    'Instrument' => 'reliability.Instrument',
                                    'reliability_score'=>'reliability.Reliability_score',
                                    'Current_stage'=>'session.Current_stage',
                                    'Invalid' => 'reliability.invalid'
                                    // 'Lock_record' => 'session.Lock_record'
                                    );
        return true;
    }


    function _setFilterForm()
    {
    	// create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

           // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles') || $user->hasPermission('reliability_edit_all')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList(false);
            if(Utility::isErrorX($list_of_sites)) {
                return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
            }
            if(is_array($list_of_sites)) 
            {
                $new_list = array('' => 'Any');
                foreach($list_of_sites as $key => $val) {
                    $new_list[$key] = $val;
                }
                $list_of_sites = $new_list;
            }
        }else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            //if ($site->isStudySite()) {
                $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
            //}
        }
        
        /// hack for Visit Labels... maybe get all the real visit labels from DB?
        $list_of_visit_labels = array(null=>'Any');
        $visitLabel = Utility::getVisitList();
        foreach($visitLabel as $key => $value){
            $list_of_visit_labels[$key]= $value;
        }
        $list_of_visit_labels_only = $visitLabel;
        $subproject_options = Utility::getSubprojectList();
        $subproject_options = array(null=>'Any') + $subproject_options;
        $gender_options = array(null=>'Any', 'Male'=>'Male', 'Female'=>'Female');
        $list_of_instruments = array(null=>'Any');
        $config =& NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $reliabilityInstruments = $reliabilityConfig['Instrument'];
        foreach(Utility::toArray($reliabilityInstruments) AS $reliabilityInstrument){
          $list_of_instruments[$reliabilityInstrument['Testname']] = $reliabilityInstrument['Displayname']; 
          $list_of_instruments_only[$reliabilityInstrument['Testname']] = $reliabilityInstrument['Displayname']; 
        }

        $lock_options = array(null=>'','Locked'=>'Locked','Unlocked'=>'Unlocked');

        // Form Elements
        $this->form->addElement('select', 'CommentID', 'CommentID:', $subproject_options);
        $this->form->addElement('select', 'Objective', 'Objective:', $subproject_options);
        $this->form->addElement('select', 'CenterID', 'Site:', $list_of_sites);
        $this->form->addElement('select', 'reliability_center_id', 'Site of Reliability:', $list_of_sites);
        $this->form->addElement('text', 'DCCID', 'DCCID::', array("size"=>9, "maxlength"=>6));
        $this->form->addElement('text', 'PSCID', 'PSCID:', array("size"=>9, "maxlength"=>7));
        $this->form->addElement('select', 'Gender', 'Gender:', $gender_options);
        $this->form->addElement('select', 'Visit_label', 'Visit Label:', $list_of_visit_labels);
        $this->form->addElement('select', 'Instrument', 'Instrument:', $list_of_instruments);
        $this->form->addElement('select', 'Invalid', 'Invalid Candidate:', array('' => '', 'yes' => 'Yes', 'no' => 'No'));
	 // $this->form->addElement('select', 'Lock_record', 'Lock_record:', $lock_options);
       
       // For swapping candidates
        if ($user->hasPermission('reliability_swap_candidates')) {
            $this->tpl_data['reliability_swap_candidates'] = true;
            $this->form->addElement('select', 'Cand1Visit_label', 'Visit Label:', $list_of_visit_labels_only);
            $this->form->addElement('text', 'Cand1PSCID', 'PSCID:');
            $this->form->addElement('select', 'Cand2Visit_label', 'Visit Label:', $list_of_visit_labels_only);
            $this->form->addElement('text', 'Cand2PSCID', 'PSCID:');
            $this->form->addElement('select', 'SwapInstrument', 'Instrument:', $list_of_instruments_only);
        } else {
            $this->tpl_data['reliability_swap_candidates'] = false;
        }

        if ($user->hasPermission('data_entry')) {
            $this->tpl_data['IBIS_Access'] = true;
        } else {
            $this->tpl_data['IBIS_Access'] = false;
        }

        // Doing this here is a hack. Since this is a menu filter and not a Form, there's no 
        // _process/_save functions automagically called. There should probably be something like
        // a Menu_Filter_Form base class for instances like this or the conflict resolver, but as
        // things stand you either need to work with the $_POST array/DB directly in a Menu_Filter,
        // or rewrite/imitate the Menu_Filter in an NDB_Form. -- Dave
        if($_POST['swap'] == 'Swap Candidates' || $_POST['swap'] == 'swap') {
            $message = $this->_swap_candidates();
            if(isset($message['error'])) {
                $this->form->addElement('static', 'error', $message['error']);
            }
            if(isset($message['message'])) {
                $this->form->addElement('static', 'message', $message['message']);
            }
        } else if($_POST['swap'] == "Add Candidate" || $_POST['swap'] == 'addnew') {
            $message = $this->_addCandidate();
            if(isset($message['error'])) {
                $this->form->addElement('static', 'error', $message['error']);
            }
            if(isset($message['message'])) {
                $this->form->addElement('static', 'message', $message['message']);
            }
        }
        return true;
    }

    // This is used both by setDataTableRows, and reliability statistics
    function getThreshholds() {
        
        $config =& NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $reliabilityInstruments = $reliabilityConfig['Instrument'];
        foreach(Utility::toArray($reliabilityInstruments) AS $reliabilityInstrument){
          $list_of_thresholds[$reliabilityInstrument['Testname']] = $reliabilityInstrument['Threshold']; 
        } 
        return $list_of_thresholds;
    }
    function _setDataTableRows($count)
    {

        $threshold = $this->getThreshholds();
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            // $identifier = $item['Tracking_log_ID'];
            $comment_id = $item['CommentID'];
            $site_id = $item['Site'];
            $current_stage = $item['Current_stage'];
            $invalid = $item['invalid'];
            $manual= $item['Manual_Swap'];
            if($item['Manual_Swap'] == 'yes' && $item['invalid'] == 'yes') {
                continue;
            }
            foreach ($item as $key => $val) {

                // Confused about this line
                if ($key =='Tracking_log_ID') continue;
                if ($key == 'CommentID') continue;
                if ($key == 'Current_stage') continue;
                if ($key == 'invalid') continue;
                if ($key == 'Manual_Swap') continue;
                // {
                //                    $this->tpl_data['items'][$x][$i]['CommentID'] = $item['CommentID'];
                //               $this->tpl_data['items'][$x][$i]['Instrument'] = $item['Instrument'];
                //                   }
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                if ($key == 'PSCID'){
                   $this->tpl_data['items'][$x][$i]['CommentID'] = $comment_id;
                   $this->tpl_data['items'][$x][$i]['SiteID'] = $item['Site'];
                   $this->tpl_data['items'][$x][$i]['Instrument'] = $item['Instrument'];
                   $this->tpl_data['items'][$x][$i]['Current_stage'] = $current_stage;
                   $this->tpl_data['items'][$x][$i]['invalid'] = $invalid;
                   $this->tpl_data['items'][$x][$i]['manual'] = $manual;
                }
                if ($key == 'Site')
                {
                   $this->tpl_data['items'][$x][$i]['value'] = $this->centerIDMap[$item['Site']];
                }
                if($key == 'Reliability_score'){
                  $this->tpl_data['items'][$x][$i+1]['name'] = 'Reliability';
                  if(is_null($val))
                    $reliable = null;
                  else if($val >= $threshold[$item['Instrument']])
                    $reliable = 'Yes';
                  else
                    $reliable = 'No';
                  $this->tpl_data['items'][$x][$i+1]['value'] = $reliable;
                }
                
               $i++;
            }
            $x++;
        }

        return true;
    }
    
    function _populate_reliability_table()
    { 
       $db =& Database::singleton();
       $this->reliability_table= $db->pselect("SELECT CommentID, reliability_center_id FROM reliability");
       
       
       $this->reliability_table = map_cIDs($this->reliability_table);
       
       // WITHIN SITE
       $siteList = Utility::getSiteList();
       foreach($siteList as $name=>$id){    
	       $site_list[$name] = $id;
       }
       $config =& NDB_Config::singleton();
       $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
       $reliabilityInstruments = $reliabilityConfig['Instrument'];

       foreach($site_list as $site) {
	       foreach(Utility::toArray($reliabilityInstruments) AS $reliabilityInstrument) {
		       $this->within_site_flagging($reliabilityInstrument['Testname'],$reliabilityInstrument['Threshold'], $site, $db);
	       }
       }

       foreach($site_list as $site) {
	       foreach(Utility::toArray($reliabilityInstruments) AS $reliabilityInstrument) {
		       $this->cross_site_flagging($reliabilityInstrument['Testname'], $site, array_remove($site, $site_list), $db);
	       }
       }

    }

    function within_site_flagging($instrument, $ratio, $current_site, $db){
        $params = array();
        $params['currentSite'] = $current_site;
        $params['instrument'] = $instrument; 
        $instrument_records = $db->pselect("SELECT f.CommentID FROM flag as f JOIN session as s ON (f.SessionID=s.ID) WHERE f.Test_name=:instrument AND s.Current_stage<>'Recycling Bin' AND f.Data_entry='Complete' AND f.CommentID LIKE CONCAT('%',:currentSite,'%')  AND f.CommentID NOT LIKE 'DDE%' AND f.Administration <> 'None' ORDER BY RIGHT(f.CommentID, 6)", $params );
        $total_records_count = count($instrument_records);
        $params['currentSite_id']= NDB_Menu_Filter_reliability::getSiteID($current_site);
        $current_count = $db->pselectOne("SELECT count(*) FROM (SELECT DISTINCT r.CommentID FROM reliability as r JOIN flag as f ON (r.CommentID=f.CommentID) JOIN session as s ON (s.ID=f.SessionID) WHERE r.CommentID LIKE CONCAT('%', :currentSite ,'%') AND r.Instrument=:instrument AND r.reliability_center_id=:currentSite_id AND r.invalid = 'no' AND s.Current_stage<>'Recycling Bin') as t",$params);
        $total_count = count($instrument_records);
        if($ratio*$total_records_count >= $total_count) {
            $max = $total_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }
        for($i = 0; $i < count($instrument_records) && $current_count + 1 <= $max; $i += 2) {
            $commentID = $instrument_records[$i]["CommentID"];
            if(!find_cID($commentID, $this->reliability_table)) {
                $db->insert('reliability', array('CommentID' => $instrument_records[$i]["CommentID"],
                            'reliability_center_id' => $params['currentSite_id'],
                            'Instrument' => $instrument
                            ));
                $this->reliability_table[$instrument_records[$i]["CommentID"]] = $params['currentSite_id'];
                $current_count++;
            }                  
        }
    }

    function cross_site_flagging($instrument, $current_site, $reliability_sites, $db){
        $ratio = 0.1;
        $reliability_site_index = 0; 
        // We want the site to be random, starting from 0 causes a bias towards the first entry
        // in $reliability_sites.. so shuffle the array to eliminate the bias
        shuffle($reliability_sites);
       
        $params = array();
        $params['currentSite'] = $current_site;
        $params['instrument'] = $instrument; 
 
        $instrument_records = $db->pselect("SELECT f.CommentID FROM flag as f JOIN session as s ON (f.sessionID=s.ID) WHERE s.Current_stage<>'Recycling Bin' AND f.Data_entry='Complete' AND f.CommentID NOT LIKE CONCAT('%', :currentSite,'%') AND f.Test_name=:instrument AND f.CommentID NOT LIKE 'DDE%'  AND f.Administration <> 'None' ORDER BY RIGHT(f.CommentID, 6)", $params );
        $total_records_count = count($instrument_records);
        $params['currentSite_id']= NDB_Menu_Filter_reliability::getSiteID($current_site);
         $current_count = $db->pselectOne("SELECT count(*) FROM (SELECT DISTINCT r.CommentID FROM reliability as r JOIN flag as f ON (r.CommentID=f.CommentID) JOIN session as s ON (s.ID=f.SessionID) WHERE r.CommentID LIKE CONCAT('%',:currentSite,'%') AND r.Instrument=:instrument AND r.reliability_center_id<>:currentSite_id AND r.invalid = 'no' AND s.Current_stage<>'Recycling Bin') as t", $params);
        $total_count = count($instrument_records);
        if($ratio*$total_records_count >= $total_count) {
            $max = $total_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }
        
       for($i = 0; $i < count($instrument_records) && $current_count + 1 <= $max; $i += 2) {
          $commentID = $instrument_records[$i]["CommentID"];
          if(!find_cID($commentID, $this->reliability_table)) {
            $db->insert('reliability', array('CommentID' => $instrument_records[$i]["CommentID"],
                                              'reliability_center_id' => $params['currentSite_id'],
                                              'Instrument' => $instrument
                                              ));
            $this->reliability_table[$instrument_records[$i]["CommentID"]] = $params['currentSite_id'];
            $current_count++;
          }
          $reliability_site_index = ($reliability_site_index + 1) % count($reliability_sites);                  
       }
    }
    
    function get_current_index($instrument, $current_site, $reliability_sites, $db){
      $site_name = array_flip($this->site_id);
      $params = array();
      $params['currentSite'] = $current_site;
      $params['instrument'] = $instrument; 
      $params['currentSite_id']= NDB_Menu_Filter_reliability::getSiteID($current_site);
      $last_site = $db->pselectOne("SELECT reliability_center_id FROM reliability where ID=(select max(ID) FROM reliability WHERE CommentID LIKE CONCAT('%',:currentSite,'%') AND Instrument=:instrument AND reliability_center_id<>:currentSite_id)",$params);
      if(empty($last_site)){
        return 0;
      }
      else{
        return (array_search($site_name[$last_site], $reliability_sites) + 1) % count($reliability_sites);
      }
    }

    function _swap_candidates() {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        if (!($user->hasPermission('reliability_swap_candidates'))) {
            return array("error" => "You do not have permission to swap candidates");
        }
        $DB =& Database::singleton();
        $params = array();
        $params['pid'] = $_POST['Cand1PSCID'];
        $params['measure'] = $_POST['SwapInstrument'];
        $params['id_V'] = $_POST['Cand1Visit_label'];
        $params_new = array();
        $params_new['id_Replace']= $_POST['Cand2PSCID'];
        $params_new['id_replaceV'] = $_POST['Cand2Visit_label'];

        $query="SELECT reliability.CommentID as OldID, reliability.reliability_center_id as CenterID, reliability.Reliability_score as Score, candidate.CenterID as OldCenterID  FROM candidate JOIN session ON (session.CandID = candidate.CandID) JOIN flag ON (flag.SessionID = session.ID) JOIN reliability ON ( reliability.CommentID=flag.CommentID) WHERE candidate.PSCID=:pid AND reliability.Instrument=:measure and session.Visit_label=:id_V AND flag.Data_entry IS NOT NULL and flag.Data_entry <> 'None'";

        $CommentID = $DB->pselectRow($query,$params );
        if(!$CommentID) {
          return array('error' => $params_new['id_Replace']."/".$params_new['id_replaceV']." did not complete".$params['measure']." or data not entered. Cannot swap candidates.");

        }
        $params_new['Instrument'] = $_POST['SwapInstrument'];
        $query="SELECT f.CommentID as NewID, c.CenterID as NewCenterID FROM session s join flag f ON (f.SessionID=s.ID) JOIN candidate c ON (c.CandID=s.CandID)  WHERE f.Test_name=:Instrument and c.PSCID=:id_Replace AND s.Visit_label=:id_replaceV AND f.Data_entry IS NOT NULL and f.Data_entry <> 'None'";
        $newCommentID = $DB->pselectRow($query, $params_new);
        if(!$newCommentID) { 
            $error_msg = $params_new['id_Replace']."/".$params_new['id_replaceV']." did not complete". $params_new['Instrument']." or data not entered. Cannot swap candidates.";
            return array('error' => '$error_msg');
        }
        if($newCommentID['NewCenterID'] !== $CommentID['OldCenterID']) {
            return array('error' => "Candidates are not from the same site. Cannot swap candidates across sites.");
        }
        elseif($user->getCenterID() != $newCommentID['NewCenterID']) {
            $error_msg = $params_new['id_Replace']."/".$params_new['id_replaceV']." is from a different site than you. Can only swap candidates from the same site.";
            return array('error' =>'$error_msg');
        }
        elseif($user->getCenterID() != $CommentID['OldCenterID']) {
           $error_msg = $params_new['id_Replace']."/".$params_new['id_replaceV']." is from a different site than you. Can only swap candidates from the same site.";
           return array('error' => '$error_msg');

        }
        $value = array('NewID'=>$newCommentID['NewID']);
        $replacementCheck = $DB->pselectRow("SELECT CommentID FROM reliability WHERE CommentID=:NewID'",$value );
        if(!empty($replacementCheck)) {
            $error_msg = $params_new['id_Replace']."/".$params_new['id_replaceV']." already in reliability. Cannot swap".$params['pid']."/".$params['id_V']."for it";
            return array('error' => '$error_msg');
        }

        $CenterID = $CommentID['CenterID'];
        if(!empty($CommentID['Score'])) {
            return array( "error" => "Reliability score already exists for".$params['pid']."/".$params['id_V']."Can not swap candidate.");
        }
        $where_criteria = array ('CommentID'=>$CommentID['OldID'] , 'Instrument'=>$params['measure']);
        $values = array('invalid'=>'yes', 'manual_swap'=>'yes'); 
        $DB->update('reliability', $values,$where_criteria);
        $DB->insert('reliability',array('CommentID'=>$newCommentID['NewID'],
             'reliability_center_id'=>$CenterID,
             'Instrument'=>$params['measure'],
             'Manual_Swap'=>'yes') 
        );

        return array("message" => "Swapped candidate".$params['pid']." for".$params_new['id_Replace']);
    }

    function _addCandidate() {
        $user =& User::singleton();
        $DB =& Database::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $params = array(); 
        $params['Instrument'] = $_POST['AddInstrument'];
        $params['Visit_label']= $_POST['AddVisit_label'];
        $params['PSCID'] = $_POST['AddPSCID'];
        if(!$params['Visit_label']) {
            return array("error" => "You must specify a visit label");
        }

        if(!$params['Instrument']) {
            return array("error" => "You must specify an instrument");
        } 
        if(!$params['CenterID']) {
            return array("error" => "You must specify a center for reliability testing");
        }

        $CommentID = $DB->pselectOne("SELECT CommentID FROM flag f JOIN session s ON (s.ID=f.SessionID) JOIN candidate c USING (CandID) WHERE f.Test_name=:Instrument AND c.PSCID=:PSCID AND s.Visit_label=:Visit_label", $params);
        if(!$CommentID) {
            $error_msg = $params['PSCID']."/".$params['Visit_label']." does not have data entered for".$params['Instrument'];
            return array("error" =>"$error_msg");

        }
        $params['CenterID'] = $_POST['AddReliabilityCenter'];
        $DB->insert('reliability',array('CommentID'=>$CommentID,
               'reliability_center_id'=>$params['CenterID'],
               'Instrument'=>$params['Instrument'],
               'Manual_Swap'=>'no') 
        );
        return array("message" => "Inserted new reliability candidate".$params['PSCID']."/".$params['Visit_label'] );
    }
}
?>
