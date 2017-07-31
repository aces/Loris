<?php
/**
 * This file contains the NDB_Menu_Filter_quality_control class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality Control
 * @author   Leo Thomas <lthomas.mcin@gmail.com>, Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
/**
 * Imaging QC Class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality Control
 * @author   Leo Thomas <lthomas.mcin@gmail.com>, Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu_Filter_Quality_Control extends NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $AjaxModule         = true;
    public $errors  = array(
        0 => "No MRI parameter form",
        1 => "T1 Scan done NOT Partial or Complete in MRI parameter form",
        2 => "MRI PF Completed = No T1 Scan, No DICOM logged in Archive but scan is inserted and in browser",
        3 => "MRI Parameter Form Incomplete, Tarchive exists, QC pass"
    );
    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& User::singleton();
        return $user->hasPermission('imaging_browser_qc');
    }
    /**
     * Override default behaviour, since the page is loaded from qualityControlIndex.js
     *
     * @return void
     * @access public
     */
    function display()
    {
        return null;
    }
    /**
     * Create a form to filter behavioral QC by various criteria
     *
     * @return bool
     * @throws ConfigurationException
     * @throws DatabaseException
     * @throws Exception
     */
    function _setFilterForm()
    {
        $user =& User::singleton();
        $db   = Database::singleton();
        $siteList  = array();
        $visitList = Utility::getVisitList();
        // allow to view all sites data through filter
        if ($user->hasPermission('imaging_browser_qc')) {
            $siteList = Utility::getSiteList(false);
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            // allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site = &Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }
        $instrumentList   = [];
        $instrumentsQuery = $db->pselect(
            "SELECT Test_name, Full_name FROM test_names ORDER BY Test_name",
            []
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Full_name']] = $instrument['Full_name'];
        }
        $projectList = Utility::getProjectList();
        $uploaderList =[];
        $uploaders = $db -> pselect(
            "SELECT UploadedBy FROM mri_upload GROUP BY UploadedBy" , array());
        foreach($uploaders as $up){
            $uploaderList[$up['UploadedBy']] = $up['UploadedBy'];
        }
        $namesList =[];
        $patientNames = $db->pselect(
            "SELECT PatientName FROM tarchive GROUP BY PatientName", array());
        foreach($patientNames as $pn){
            $namesList[$pn['PatientName']] = $pn['PatientName'];
        }
        // Form Elements
        $this->addBasicText('candId', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('errorMessage', 'Error Message', $this->errors);
        $this->addSelect('UploadedBy', 'Uploaded By', $uploaderList);
        $this->addSelect('PatientName', 'Patient ID', $namesList);
        $this->addSelect('site', 'Site', $siteList);
        // $this->tpl_data["hasWritePermission"] = $this->hasWritePermission;
        return true;
    }
    /**
     * Build a list of behavioural QC to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {

        $db =& Database::singleton();

        // this query looks for both mri_uploads with no associated mri_parameter_forms, and one with mri_paramter_forms that DO NOT have T1_Scan_done equal to partial or complete.

        /*
        $query = "
            FROM mri_upload m
            LEFT JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID)
            LEFT JOIN flag f ON (f.SessionID = t.SessionID and f.CommentID not like 'DDE%')
            WHERE f.CommentID NOT IN (SELECT CommentId FROM mri_parameter_form)
            GROUP BY t.PatientName ,f.SessionID, UploadID, t.CenterName
            UNION
            SELECT m.UploadedBy, UploadDate, f.SessionID,t.PatientName, t.CenterName, (\"".$this->errors[1]."\") as message, (f.CommentID) as CommentID
            FROM mri_upload m
            LEFT JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID)
            LEFT JOIN flag f ON (f.SessionID = t.SessionID and f.CommentID not like 'DDE%')
            WHERE f.CommentID IN (
                SELECT CommentID
                FROM mri_parameter_form mpf
                WHERE (mpf.T1_Scan_done !='Complete' or mpf.T1_scan_done!= 'Partial')
                )";
        */

       /* $query= "
			FROM mri_upload m
			JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID)
			JOIN flag f ON (f.SessionID = t.SessionID and f.CommentID not like 'DDE%')
			WHERE f.CommentID IN (
				SELECT CommentID
				FROM mri_parameter_form mpf
				WHERE (mpf.T1_Scan_done !='Complete' AND mpf.T1_scan_done!= 'Partial')
				)"; */

      /* MRI Parameter Form Completed, Answer = No T1 Scan
      * No DICOM recorded
      * Scan in Browser and QC Status = Pass*/

        $query =  "
            FROM flag f 
            JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN files fi ON (fi.SessionID = f.SessionID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN files_qcstatus qc ON (qc.FileID = fi.FileID)
            WHERE f.CommentID NOT LIKE 'DDE%'
                  AND f.Test_name='mri_parameter_form'
                  AND s.Active='Y'
                  AND s.CenterID <> '1'
                  AND t.TarchiveID IS NOT NULL
                  AND fi.AcquisitionProtocolID=44
                  AND m.T1_Scan_done IS NULL
                  AND qc.QCStatus = 'Pass'"
             . "UNION ALL" .
            "SELECT c.PSCID,
                SessionID,  
                cand_id,
                visit_label,
                (".$this->errors[3].") as message, 
                CommentID 
            FROM flag f 
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN files fi ON (fi.SessionID = f.SessionID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN files_qcstatus qc ON (qc.FileID=fi.FileID)
            WHERE f.CommentID NOT LIKE 'DDE%'
                  AND f.Test_name='mri_parameter_form'
                  AND f.Administration <> 'None'
                  AND t.TarchiveID IS NULL
                  AND s.Active='Y'
                  AND s.CenterID <> '1'
                  AND f.Data_entry='Complete'
                  AND fi.AcquisitionProtocolID = 44
                  AND m.T1_Scan_done = 'No'
                  AND qc.QCStatus = 'Pass'";


        $this->query = $query;
        //$this->columns = array("m.UploadedBy", "UploadDate", 't.PatientName', 't.CenterName', '("'.$this->errors[1].'") as error_message','(" ") as action',  'f.CommentID as CommentID');
        $this->columns = [
            'c.PSCID',
            's.ID as SessionID',
            's.CandID as cand_id',
            's.Visit_label as visit_label',
            '("'.$this->errors[2].'") as error_message',
            'f.CommentID as CommentID'
        ];
       // $this->group_by = 'c.PSCID, SessionID, cand_id, visit_label, CommentID';
        $this->order_by = 'c.PSCID';

      //  $this->headers = ['Uploaded By', 'Upload Date', 'Patient Name', 'Location', 'Error Message', 'Action', 'CommentID'];
        $this->headers = [
            'PSCID',
            'Session ID',
            'DCCID',
            'Visit Label',
            'Error Message',
        ];
        $this->validFilters = array('m.UploadedBy','message');
        $this->formToFilter = array(
            'UploadedBy' => 'm.UploadedBy',
            'error_message' => 'message');

        $this->tpl_data['hiddenHeaders'] = json_encode(['CommentID']);
        return true;
    }
    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        return json_encode($result);
    }
    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/quality_control/js/qualityControlIndex.js",
            )
        );
    }
}