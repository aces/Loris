<?php
require_once "Database.class.inc";
// This class is the old mri_browser.php portion of the code that 
// deals with showing the menu list of candidates/filtering, refactored
// into a different class to make the mri browser code easier to read

// There's still a lot of improvements to be made to this code, such as
// turning the class into a subclass of NDB_Menu_Filter instead of redoing 
// all of the features of an NDB_Menu_Filter by hands.
class MRIMenuPage {
    function MRIMenuPage() {
        // create Database object
        $DB = Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: " . $DB->getMessage());
        }
        $this->DB = $DB;

        // user is logged in, let's continue with the show...
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("Error creating user object: " . $user->getMessage());
        }

        if(!$user->hasPermission('access_all_profiles')) 
            $extra_where_string .= " AND p.CenterID=".$user->getCenterID();

        // First value is the SQL column, second is the header in the
        // HTML table. 
        $this->formToFilter= array(
                'site' => 'p.CenterID',
                'candID' => 'c.CandID',
                'pscID' => 'c.PSCID',
                'visitLabel' => 's.Visit_label',
                'qcStatus' => 's.MRIQCStatus',
                'SubprojectID' => 's.SubprojectID',
                'pending' => ''
                );
        $this->headers = array(
                'No.' => '',
                'Site' => 'p.CenterID', 
                'DCCID' => 'c.CandID',
                'PSCID' => 'c.PSCID',
                'Visit Label' => 's.Visit_label',
                'QC Status' => 's.MRIQCStatus',
                'First Acq Date' => 'firstAcqDate',
                'Last QC' => 'lastQCDate',
                'New Data' => '',
                'T1 Passed' => '',
                'T2 Passed' => '',
                'Links' => ''
                );

        if(isset($_REQUEST['filter'])) {
            $this->filter = $_REQUEST['filter'];

            $oldFilter = $_SESSION['State']->getProperty('filter');
            if(is_array($oldFilter)) {
                $this->filter = array_merge($oldFilter, $this->filter);
            }
            $_SESSION['State']->setProperty('filter', $this->filter);


            $this->filter = $_SESSION['State']->getProperty('filter');


            foreach($this->formToFilter as $varname=> $field) {
                $extra_where_string .= $this->_addFilter($varname);
            }

            if(is_array($this->filter['order'])) {
                if($this->filter['order']['field'] != '' && $this->headers[$this->filter['order']['field']] != '')
                    $extra_orderby = $this->headers[$this->filter['order']['field']] . ' ' . $this->filter['order']['asc'] . ',';
                else
                    $extra_orderby = '';
            }

            $query = "SELECT s.ID AS sessionID,
                p.Name AS centerName,
                c.CandID AS candID,
                c.PSCID, s.Visit_label AS visitLabel,
                CONCAT(IF(s.MRIQCPending='Y', 'Pending ', ''), s.MRIQCStatus) AS QCStatus,
                s.SubprojectID AS SubprojectID,
                min(f.InsertTime) AS firstInsertDate,
                UNIX_TIMESTAMP(md.AcquisitionDate) AS firstAcqDate,
                UNIX_TIMESTAMP(s.MRIQCFirstChangeTime) AS firstQCDate,
                UNIX_TIMESTAMP(s.MRIQCLastChangeTime) AS lastQCDate
                    FROM psc AS p JOIN session s ON (s.CenterID=p.CenterID) JOIN candidate c ON (c.CandID=s.CandID) JOIN files f ON (f.SessionID=s.ID) LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID) JOIN mri_acquisition_dates md ON (md.SessionID=s.ID)
                    WHERE s.CenterID=p.CenterID AND s.CandID=c.CandID AND f.SessionID=s.ID AND md.SessionID=s.ID
                    $extra_where_string
                    AND f.PendingStaging=0 AND f.FileType='mnc' AND f.OutputType='native' AND f.AcquisitionProtocolID not in (1, 2, 3, 52) 
                    GROUP BY f.SessionID
                    ORDER BY $extra_orderby p.Name, firstAcqDate, c.CandID, s.Visit_label;";
                  
            $DB->select($query, $this->visit_tpl_data['timepoints']);
            if(Utility::isErrorX($this->visit_tpl_data['timepoints']))  {
                print $this->visit_tpl_data['timepoints']->getMessage()."<br>\n";
            }
        } // end if $_REQUEST[filter] is set
        
        $this->PopulateQCData();
        $this->PopulateOutputTypes();

        $params = array();
        $query = "SELECT CenterID, Name, MRI_Alias FROM psc WHERE MRI_Alias<>'' ";
        if (!$user->hasPermission('access_all_profiles')) {
            $query .= " AND CenterID=:CentID";
            $params['CentID'] = $user->getCenterID();
        }
        $query .= " ORDER BY Name";
        $sites = $DB->pselect($query, $params);
        $this->visit_tpl_data['site_options']['']='All';
        foreach($sites AS $site) {
            $this->visit_tpl_data['site_options'][$site['CenterID']] = $site['Name'];
            $this->visit_tpl_data['MRI_Alias'][$site['CenterID']] = $site['MRI_Alias'];
        }

        $this->visit_tpl_data['qcStatus_options'] = array (''=>'All', 'Pass'=>'Pass', 'Fail'=>'Fail');
        $this->visit_tpl_data['SubprojectID_options'] = array (''=>'All', '1'=>'1', '2'=>'2');
        $projects[null] = 'All';
        foreach(Utility::getProjectList() as $key=>$value) {
            $projects[$key] = $value;
        }
        $this->visit_tpl_data['projects'] = $projects;
        $this->visit_tpl_data['pending_new_options'] = array ('' => '', 'P' => 'Pending', 'N' => 'New', 'PN' => 'Pending and New'); 
    }


    function _PopulateQCBreakdown($ProtocolID, $SessionID) {
        $qParams = array('SID' => $SessionID, 'ProtoID' => $ProtocolID);
        $Passes = $this->DB->pselectOne("SELECT count(File) FROM files join files_qcstatus qc USING (FileID) WHERE
            SessionID=:SID AND AcquisitionProtocolID=:ProtoID AND qc.QCStatus='Pass'", $qParams);
        if($Passes > 0) {
            return 'Pass';
        }
        $Fails = $this->DB->pselectOne("SELECT COUNT(File) FROM files JOIN files_qcstatus qc USING (FileID) WHERE
            SessionID=:SID AND AcquisitionProtocolID=:ProtoID AND qc.QCStatus='Fail'", $qParams);
        if($Fails > 0) {
            return 'Fail';
        }
        return '&nbsp;';

    }
    function PopulateQCData() {

        $visit_tpl_data =& $this->visit_tpl_data;

        $visit_tpl_data['numTimepoints'] = count($visit_tpl_data['timepoints']);

        // Go through each 
        for($i=0; $i<$visit_tpl_data['numTimepoints']; $i++) {
            $params['SID'] = $visit_tpl_data['timepoints'][$i]['sessionID'];
            $minQCDate = $this->DB->pselectOne("SELECT MIN(QCLastChangeTime) FROM files LEFT JOIN files_qcstatus USING(FileID) 
                WHERE SessionID=:SID AND OutputType='native' AND AcquisitionProtocolID not in (1, 2, 3, 52) 
                GROUP BY QCLastChangeTime 
                ORDER BY QCLastChangeTime", $params);
            // New data if not QCed
            $visit_tpl_data['timepoints'][$i]['newData'] = empty($minQCDate);
            $visit_tpl_data['timepoints'][$i]['rownum'] = ($i+1);
            $filtered_sessionIDs[] = $visit_tpl_data['timepoints'][$i]['sessionID'];
            $visit_tpl_data['timepoints'][$i]['T1Pass'] = $this->_PopulateQCBreakdown(44, $visit_tpl_data['timepoints'][$i]['sessionID']);
            $visit_tpl_data['timepoints'][$i]['T2Pass'] = $this->_PopulateQCBreakdown(45, $visit_tpl_data['timepoints'][$i]['sessionID']);
        }

        // Keep a list of which sessions are listed in the session, so that the next/previous links work when on a page
        $_SESSION['State']->setProperty('mriSessionsListed', $filtered_sessionIDs);
        $this->visit_tpl_data = $visit_tpl_data;
    }

    function PopulateOutputTypes() {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("Error creating user object: " . $user->getMessage());
        }

        // This is a fixme. Make this a config option. Site users might have permsission to view non native files 
        //should be ($user->hasPermission('view_non_native')) 
        if($user->getCenterID() > 0) {
            $query = "SELECT DISTINCT OutputType AS outputType FROM files WHERE FileType='mnc' AND OutputType!='native'";
            $outputTypes = $this->DB->pselect($query, array());
            $this->visit_tpl_data['outputTypes'] = array_merge(
                    array(array('outputType'=>'native'),array('outputType'=>'selected')), 
                    $outputTypes);
        } else {
            $this->visit_tpl_data['outputTypes'][] = array();
            // to avoid empty fields for non privileged users
            $this->visit_tpl_data['outputTypes'] = array_merge(array(array('outputType'=>'native'),array('outputType'=>'selected')));
        }

        $this->visit_tpl_data['numOutputTypes'] = count($this->visit_tpl_data['outputTypes']);

    }

    // Adds a filter to the where query in the constructor
    function _addFilter($fname) {
        if(!empty($this->filter[$fname])) {
            if ($fname != 'pending') {
                // override to allow for comma separated list 
                // if input contains a comma.
                if(!preg_match("/,/", $this->filter[$fname])) {
                    return ' AND ' . $this->formToFilter[$fname] . ' LIKE ' . $this->DB->quote($this->filter[$fname] . '%');
                }
                return ' AND '.  $this->formToFilter[$fname] . ' IN (' . $this->filter[$fname] .')';
            }
            else {
                switch ($this->filter[$fname]) {
                    case "P":
                        return " AND s.MRIQCPending='Y'"; 
                    case "N":
                        return " AND (s.MRIQCStatus='' OR fqc.QCFirstChangeTime IS NULL)";
                    case "PN":
                         return " AND s.MRIQCPending='Y' AND (s.MRIQCStatus='' OR fqc.QCFirstChangeTime IS NULL)";
                } 
            }
        }
        return '';
    }

    function display($template_file = "mri_browser_visit_list.tpl") {
        $smarty = new Smarty_neurodb;
        $smarty->assign('filter', $this->filter);
        $smarty->assign('headers', $this->headers);
        $smarty->assign('backURL', $_SERVER['REQUEST_URI']);
        $smarty->assign($this->visit_tpl_data);
        return $smarty->fetch("mri_browser_visit_list.tpl");
    }
}

?>
