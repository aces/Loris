<?php
require_once "NDB_Form.class.inc";

/**
 * @package main
 */

class NDB_Form_data_integrity_flag extends NDB_Form
{

    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return ($user->hasPermission('data_integrity_flag'));
    }


    function _getDefaults()
    {
        $defaults = array();
        $DB =& Database::singleton();

        /////////////////////////////////////////////////////
        ///////////////Constructs the where clause...
        ////////////////////////////////////////////////////////
        $extra_where .= $this->AddWhere("dataflag_visitlabel", 'visit_label');
        $extra_where .= $this->AddWhere("dataflag_instrument", 'instrument');
        $extra_where .= $this->AddWhere("dataflag_userid", 'users');

        //construct the query
        if (($extra_where) !=null){
            $query = "SELECT * FROM data_integrity_flag
                WHERE 1=1 $extra_where ORDER BY dataflag_date";
            $DB->select($query,  $info);

            $defaults["instrument"] = $_REQUEST['instrument'];
            $defaults["visit_label"] = $_REQUEST['visit_label'];
            $defaults["users"] = $_REQUEST['users'];
        }
        return $defaults;
    }

    function _process($values)
    {

        // get the userID
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $user_name = $user->getUsername();

        $instrument = $this->getTestNameusingMappedName($_REQUEST['instrument']); //get actual test_name

        //$data_cleaning_fb_open = $this->getFeedbackcount($instrument,$_REQUEST['visit_label']);
        $visit_label = $_REQUEST['visit_label'];
        //save the date, flag status and comment in the data_integrity_flag table
        $DB =& Database::singleton();
        $comment = $values['comment'];


        $date = sprintf("%04d-%02d-%02d", $values['date']['Y'], $values['date']['M'], $values['date']['d']);
        if($date == '0000-00-00') {
            $date = NULL;
        }

        $flag = $values['flag_status'];

        //$instrument=
        $sucess =  $DB->update('data_integrity_flag',array('latest_entry'=>0),array('dataflag_instrument' => $instrument, 'dataflag_visitlabel'=>$visit_label));
        $success = $DB->insert("data_integrity_flag", array('dataflag_instrument'=>$instrument,'dataflag_visitlabel'=>$visit_label,'dataflag_comment'=>$comment,'dataflag_date'=>$date,'dataflag_status'=>$flag,'latest_entry'=>1,'dataflag_userid'=>$user_name));

        if(PEAR::isError($success)) {
            return PEAR::raiseError("NDB_Form_data_integrity_flag::_process: ".$success->getMessage());
        }
        $this->tpl_data['success'] = true;
    }


    function data_integrity_flag()
    {

        //initializations
        $DB =& Database::singleton();
        $extra_where = '';
        $conflicts = array();
        $smarty = new Smarty_neurodb();
        $config =& NDB_Config::singleton();
        $study = $config->getSetting('study');
        $instrument = $this->getTestNameusingMappedName($_REQUEST['instrument']); //converts the full_name into the test_name

        $visit_array=Utility::getExistingVisitLabels();
        $visit_array = array_combine($visit_array,$visit_array);
        $visit_array = array_merge(array('all_visits'=>"All Visits"),$visit_array);

        //Menu Filters
        $this->tpl_data['visitLabels'] = $visit_array;
        $this->tpl_data['visit_label'] = $_REQUEST['visit_label'];
        $this->tpl_data['test_name'] = $instrument;
        $this->form->AddElement('select','users','Users',array_merge(array(''=>'All Users'),$this->getDIUsers()),array('id'=>'users'));




        $this->form->addFormRule(array(&$this,'_validate'));

        /////////////////////////////////////////////////////
        ///////////////Constructs the where clause...
        ////////////////////////////////////////////////////////
        $extra_where = null;
        $extra_where .= $this->AddWhere("dataflag_visitlabel", 'visit_label');
        $extra_where .= $this->AddWhere("dataflag_instrument", 'instrument');
        $extra_where .= $this->AddWhere("dataflag_userid", 'users');

        //construct the query
        //if (($extra_where) !=null){
        $query = "SELECT * FROM data_integrity_flag
            WHERE 1=1 $extra_where ORDER BY dataflag_date desc";
        $DB->select($query,  $info);
        //}



        ////////////////////////////////////////////////////////
        /////////create the quickform elements/////////////////
        ////////////////////////////////////////////////////////
        $dateOptions = array(
                'language'        => 'en',
                'format'          => 'YMd',
                'addEmptyOption'  => true,
                'minYear'         => $study['startYear'],
                'maxYear'         => $study['endYear']
                );

        $this->form->addElement('date', 'date', "Date:", $dateOptions); //date drop down
        $this->form->addElement("select", 'flag_status', 'Flag Status:', array(''=>null,"1"=>'1- Ready For Review',"2"=>'2- Review Completed', "3"=>'3- Feedbacks Closed', "4"=>'4- Finalization')); //flag status
        $this->form->addElement("textarea", 'comment','Comment:',array('rows' => 2, 'cols' => 20));//comment box

        //static or hiddent elements
        $this->form->addElement("static", "instrument", "Instrument: ");//comment box
        $this->form->addElement("static", "visit_label", "Visit: ");//comment box

        ///////////////////////////////////////////////////////////////
        ///////////////////////RESULTS//////////////////////////////
        ///////////////////////////////////////////////////////////////

        //Show the number of generated results...
        //If there are no data print a message to that effect
        if(empty($info)){
            $this->form->addElement('static', "status", "No matching criteria found.");
            return;
        } else {
            $this->form->addElement('static', 'total', 'Total number of results:', sizeof($info));
        }
        //Loop through the conflicts and add a row per
        foreach($info AS $data) {
            $this->tpl_data['elements_list_names'] [] = $data['dataflag_id'];
            $this->tpl_data['elements_array'][$data['dataflag_id']]['date']= $data['dataflag_date'];
            $this->tpl_data['elements_array'][$data['dataflag_id']]['flag'] = $data['dataflag_status'];
            $this->tpl_data['elements_array'][$data['dataflag_id']]['comment']= $data['dataflag_comment'];
            $this->tpl_data['elements_array'][$data['dataflag_id']]['instrument']= $data['dataflag_instrument'];
            $this->tpl_data['elements_array'][$data['dataflag_id']]['visit_label']= $data['dataflag_visitlabel'];
            $this->tpl_data['elements_array'][$data['dataflag_id']]['userid']= $data['dataflag_userid'];
            //$this->tpl_data['elements_array'][$data['dataflag_id']]['dc_open_feedback']= $data['dataflag_dc_open_feedback'];
            $this->tpl_data['elements_array'][$data['dataflag_id']]['dc_open_feedback']= $data['dataflag_fbcreated'] - $data['dataflag_fbclosed']-$data['dataflag_fbcomment'];
        }
    }

    /**
     * AddWhere
     * Constructs the query....
     *
     * @param unknown_type $Column
     * @param unknown_type $Filter
     * @return unknown
     */

    function AddWhere($Column, $Filter) {
        // create Database object
        $DB = Database::singleton();
        if(PEAR::isError($DB)) {
            print "Could not connect to database: ".$DB->getMessage()."<br>\n";
            die();
        }

        if(!empty($_REQUEST[$Filter]) && $_REQUEST[$Filter] !=='All Instruments' &&  $_REQUEST[$Filter] !=='All Visits') {

            if ($Filter =='instrument'){
                $test_name = $this->getTestNameusingMappedName($_REQUEST[$Filter]); //get actual test_name
                return " AND $Column LIKE " . $DB->quote($test_name);
            }
            return " AND $Column LIKE " . $DB->quote($_REQUEST[$Filter]);
        }


        return '';
    }

    /**
     * _validate
     *
     * @param unknown_type $fields
     * @return unknown
     */
    function _validate($fields){
        $errors=array();
        if ((preg_match('/All/',$_REQUEST['instrument'],$matches)) || (preg_match('/All/',$_REQUEST['visit_label'],$matches))){
            $errors['comment']= 'An Instrument/Vist must be selected';
        }

        // create Database object
        $DB = Database::singleton();
        if(PEAR::isError($DB)) {
            print "Could not connect to database: ".$DB->getMessage()."<br>\n";
            die();
        }

        $is_error_set = false;

        foreach ($fields as $field=>$value){

            if (preg_match('/date/',$field,$matches)){
                if((($value['Y'] == "")&&($value['M'] == "")&&($value['d'] == ""))){
                    $errors[$field]= 'Date is required';
                }
                if ($value !=null){
                    // if not answered is not selected, time cannot be empty

                    if((($value['Y'] != "")||($value['M'] != "")||($value['d'] != ""))){
                        if($value['Y'] == ""){
                            $errors[$field] .= "$field_name: Please fill in the administration date for all 3 fields";
                        } else if($value['M'] == ""){
                            $errors[$field] .= "$field_name: Please fill in the administration date for all 3 fields";
                        } else if($value['d'] == ""){
                            $errors[$field] .= "$field_name: Please fill in the administration date for all 3 fields";
                        }

                        if(!(checkdate($value['M'], $value['d'], $value['Y']))){
                            $errors[$field]= 'Date is not a valid date';
                        }
                    }
                }
            }

            if (preg_match('/flag_status/',$field,$matches)){

                if (($value == '') || ($value==null)){
                    $errors[$field]= 'The validation flag is not set';
                }

            }
        }
        return count($errors) > 0 ? $errors:true;
    }

    // }}}
    // {{{ _getQuickformDate()
/**
 * Convert a database date or timestamp into a QuickForm acceptable date or time
 *
 * @param string  $databaseValue        the date or timestamp from the database
 * @return array   $formDateValue       the quickform date/timestamp array
 * @access private
 */

function _getQuickformDate($databaseValue/*,$date_reference*/){
    if(!empty($databaseValue)){
        if(strstr($databaseValue,":")){
            $formDateValue=explode(":",$databaseValue);
            $formDateValue=array("H"=>$formDateValue[0],"i"=>$formDateValue[1]);  //handle time
        } else {
            // split mysql Date_taken field into array
            $formDateValue = explode('-', $databaseValue);
            $formDateValue = array('Y'=>$formDateValue[0], 'M'=>$formDateValue[1], 'd'=>$formDateValue[2]);  //handle date
        }
    }
    return $formDateValue;
}

function getFeedbackcount($test_name,$visit_label,$type='data_cleaning'){
    $DB =& Database::singleton();
    $query = "SELECT COUNT(*)
        FROM session s
        JOIN flag f ON (s.ID = f.SessionID)
        JOIN feedback_bvl_thread b ON (b.commentid = f.commentid)
        JOIN feedback_bvl_entry be ON (be.FeedbackID = b.FeedbackID)
        JOIN feedback_bvl_type ftp ON (b.Feedback_type = ftp.Feedback_type)
        JOIN candidate c ON (c.Candid = s.Candid)
        JOIN psc ON (s.CenterID = psc.CenterID)
        WHERE 
        c.PSCID NOT LIKE '%999-99999%' AND c.Active = 'Y' AND s.Active = 'Y' AND 
        f.test_name =:tname AND psc.Centerid!= '1' AND ftp.Name =:feedback_type AND s.Visit_label =:vlabel
        AND b.status = 'Opened'";
    $count = $DB->pselectOne($query,array('tname'=>$test_name,'feedback_type'=>$type,'vlabel'=>$visit_label));
    return $count;
}


/**
 * getTestNameusingMappedName
 * returns the Test_name and its corresponding visit_label.. using the full_name  and/or subprojectID ..
 */

function getTestNameusingMappedName ($full_name, $subprojectID = null)
{
    $DB =& Database::singleton();
    $values = array();
    if ((!(is_null($full_name)))) {
        $test_name = Utility::getTestNameUsingFullName($full_name);
    }
    return 	$test_name;
}


/**
 * Returns the list of users changed the Data-integrity flags
 */

function getDIUsers()
{
    $DB =& Database::singleton();
    $users = $DB->pselect("SELECT DISTINCT dataflag_userid FROM data_integrity_flag",array());
    $user_ids = array();
    foreach ($users as $user){
        $user_ids[$user['dataflag_userid']] = $user['dataflag_userid'];
    }
    return $user_ids;
}

}
?>
