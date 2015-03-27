<?php
/**
 * This page implements a front end which is used to unify all
 * of the different MRI violation types (could not identify scan,
 * header violation in the scan after identifying scan type, mislabeled 
 * scan, etc) and link to the appropriate module to further investigate
 * why a scan was excluded by the imaging pipeline scripts.
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once 'NDB_Menu_Filter.class.inc';
require_once 'NDB_Menu_Filter_Form.class.inc';
/**
 * Implement the menu filter for searching through all violated scans
 *
 * @category MRI
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */      
class NDB_Menu_Filter_Form_mri_violations extends NDB_Menu_Filter_Form
{
    /**
     * Check if user should be allowed to see this page.
     *
     * @return boolean true if the user is permitted to see violated scans
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $this->tpl_data['violated_scans_modifications'] 
            = $user->hasPermission('violated_scans_edit');
        return ($user->hasPermission('violated_scans_view_allsites'));
    }

    function _process($values)
    {
        if (!is_array($values) || count($values) ==0) {
            return true;
        }
        $DB =& Database::singleton();
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        foreach ($values AS $key=>$val) {
            $hash = $key;
            $row = $DB->pselectRow(
                    "SELECT * FROM violations_resolved 
                    WHERE hash = :hash", array('hash' => $hash));
            
            //if row is found, check value and update if needed
            if(!empty($row)){
                foreach($row as $key2 => $val2){
                    //found matching
                    if($key2 == 'Resolved'){
                        // user input matches DB content, so do nothing.
                        if($val==$val2){
                            break;
                        }
                        // user input doesn't match DB, so we update the DB
                        else{
                            $setArray = array('Resolved'=>(string)$val2);
                            $whereArray = array('hash'=>$hash);
                            $DB->update('violations_resolved', $setArray, $whereArray);
                        }
                    }
                }
            }
            //if row is not found, and selection<>0, then insert new row.
            else{
                // no need to insert to DB for Unresolved value.
                if($val==0){
                    continue;
                }
                $newlyResolved = array();
                $newlyResolved['hash'] = $key;                
                $newlyResolved['Resolved'] = (string)$val;
                $newlyResolved['User'] = $user->getUsername();
                $newlyResolved['ChangeDate'] = date("Y-m-d H:i:s");

                // Table 1
                $ID_mri_protocol_violated_scans = $DB->pselectOne(
                    "SELECT ID
                    FROM mri_protocol_violated_scans 
                    WHERE (:hash = md5(concat_WS(':',minc_location,PatientName,SeriesUID,time_run)))",
                    array('hash' => $key)
                    );
                if(!empty($ID_mri_protocol_violated_scans)){
                    $newlyResolved['TypeTable'] = 'mri_protocol_violated_scans';
                    $newlyResolved['ExtID'] = $ID_mri_protocol_violated_scans;
                }
                // Table 2
                $ID_mri_violations_log = $DB->pselectOne(
                    "SELECT LogID
                    FROM mri_violations_log
                    WHERE (:hash = md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)))",
                    array('hash' => $key)
                    );
                //echo "ID[2] = ".$ID_mri_violations_log."\n";
                if(!empty($ID_mri_violations_log)){
                    $newlyResolved['TypeTable'] = 'mri_violations_log';
                    $newlyResolved['ExtID'] = $ID_mri_violations_log;
                } 
                
                // Table 3
                $ID_MRICandidateErrors = $DB->pselectOne(
                    "SELECT ID
                    FROM MRICandidateErrors
                    WHERE (:hash = md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)))",
                    array('hash' => $key)
                    );
                //echo "ID[3] = ".$ID_MRICandidateErrors."\n";
                if(!empty($ID_MRICandidateErrors)){
                    $newlyResolved['TypeTable'] = 'MRICandidateErrors';
                    $newlyResolved['ExtID'] = $ID_MRICandidateErrors;
                } 
                //echo "DO INSERT NOW!\n";
                var_dump($newlyResolved);
                $DB->insert('violations_resolved', $newlyResolved);                
            }
        }
        
        $this->tpl_data['success'] = true;
    }

    /**
     * Set up the class and smarty variables to use for the menu filter to 
     * generate the proper query for the menu filter
     * 
     * @return none
     */
    function _setupVariables()
    {
        // set the class variables
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $this->columns = array('v.PatientName',
            'v.TimeRun',
            'v.MincFile',
            'v.Series_Description as Series_Description_Or_Scan_Type',
            'v.Problem',
            'v.SeriesUID',
            'v.hash',
            'v.join_id',
            'v.Resolved'
        );

        $this->query = " FROM (
            SELECT PatientName as PatientName,
                time_run as TimeRun,
                minc_location as MincFile,
                series_description as Series_Description,
                'Could not identify scan type' as Problem, 
                SeriesUID,
                md5(concat_WS(':',minc_location,PatientName,SeriesUID,time_run)) as hash,
                mri_protocol_violated_scans.ID as join_id,                
                violations_resolved.Resolved as Resolved
            FROM mri_protocol_violated_scans 
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_protocol_violated_scans.ID 
            AND violations_resolved.TypeTable='mri_protocol_violated_scans')"
            . " UNION " . 
            "SELECT PatientName,
                TimeRun,
                MincFile,   
                mri_scan_type.Scan_type,
                'Protocol Violation',
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)) as hash,
                mri_violations_log.LogID as join_id,
                violations_resolved.Resolved as Resolved
            FROM mri_violations_log 
            LEFT JOIN mri_scan_type 
            ON (mri_scan_type.ID=mri_violations_log.Scan_type)
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_violations_log.LogID 
            AND violations_resolved.TypeTable='mri_violations')"
            . " UNION " . 
            "SELECT PatientName,
                TimeRun,
                MincFile,
                null,
                Reason, 
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)) as hash,
                MRICandidateErrors.ID as join_id,
                violations_resolved.Resolved as Resolved
            FROM MRICandidateErrors
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=MRICandidateErrors.ID 
            AND violations_resolved.TypeTable='MRICandidateErrors')"
         . ") as v WHERE 1=1";
        $this->order_by = 'v.TimeRun DESC';

        $this->formToFilter = array(
                'PatientName' => 'v.PatientName',
                'TimeRun' => 'v.TimeRun',
                'ProblemType' => 'v.Problem',
                'Filename' => 'v.MincFile',
                'Description' => 'v.Series_Description',
                'SeriesUID' => 'v.SeriesUID',
                'Resolved' => 'v.Resolved'
        );
        $this->validFilters = array(
            'v.PatientName',
            'v.TimeRun',
            'v.MincFile',
            'v.Problem',
            'v.Series_Description',
            'v.SeriesUID',
            'v.Resolved'
        );
        return true;
    }

    /**
     * Generate the quickform elements necessary for filter form
     *
     * @return none, but as a side-effect sets up QuickForm variables
     */
    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $this->addBasicText('PatientName', 'Patient Name');
        $this->addBasicText('Description', 'Series Description or Scan Type');
        $this->addBasicText('TimeRun', 'Time Run');
        $this->addBasicText('Filename', 'File name');
        $this->addBasicText('SeriesUID', 'Series UID');
        $this->addSelect(
            "ProblemType",
            "Type of problem",
            array(
                '' => 'Any',
                'CandID and PSCID do not match database' 
                    => 'Candidate Mismatch',
                'Could not identify scan type'
                    => 'Could not identify scan type',
                'Protocol Violation'
                    => 'MRI Protocol Check violation'
            )
        );
        // conflict resolved
        $this->addSelect(
            'Resolved', 
            'Violation resolved', 
            array(
                '0'=>'Unresolved', 
                '1'=>'Reran',
                '2'=>'Emailed site/pending',
                '3'=>'Inserted',
                '4'=>'Rejected',
                '5'=>'Inserted with flag'
                )            
            );
        
        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = Utility::getSiteList();
            if(Utility::isErrorX($sites)) {
                return PEAR::raiseError("DB Error: ".$sites->getMessage());
            }
            if(is_array($sites)) $sites = array('' => 'All') + $sites;
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        } 
        $this->addSelect('Site', 'Site', $sites);
                
        return true;
    }

    /**
     * Overwrite the setDataTableRows function to exclude fields
     * which were only selected for generating a link, and aren't
     * used for display to the user
     *
     * @param integer $count Offset of page that filter starts on
     *
     * @return none but as a side-effect populates $this->tpl_data['items']
     */
    function _setDataTableRows($count)
    {
        $options = array(
	        '0'=>'Unresolved', 
	        '1'=>'Reran',
	        '2'=>'Emailed site/pending',
	        '3'=>'Inserted',
	        '4'=>'Rejected',
	        '5'=>'Inserted with flag',
	        '6'=>'Resolved #1',
	        '7'=>'Resolved #2',
	        '8'=>'Resolved #3',
	        '9'=>'Resolved #4');
        $x=0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key === 'PatientName') {
                    $this->tpl_data['items'][$x]['PatientName'] = $val;
                }
                if ($key === 'join_id') {
                    $this->tpl_data['join_id'] = $val;
                }
                if ($key === 'hash') {
                    $hash = $val;
                    //$this->addSelect($val, "", $options);                    
                }
                if ($key === 'Resolved') {
                    $resolved_index = $val;                    
                }
                if ($key === 'Problem') {
                    if($val="Could not identify scan type"){    
                        $this->tpl_data['join_tbl'] = "mri_protocol_violated_scans";
                    }
                    elseif($val="Protocol Violation"){
                        $this->tpl_data['join_tbl'] = "mri_violations_log";
                    }
                    else{
                        $this->tpl_data['join_tbl'] = "MRICandidateErrors";
                    }
                }
                if ($key === 'SeriesUID') {
                    $this->tpl_data['series'] = $val;
                } else {		 
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }            
                $i++;
            }
            
            $optional = array("selected" => (string)$resolved_index);
            //var_dump($optional);
            //$hash = $this->tpl_data['hash'];
            $this->addSelect($hash, "", $options, $optional);
            $x++;
        }
        echo "MRI VIOLATIONS";
        return true;
    }

}
?>
