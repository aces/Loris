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

    /**quality_control
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
        $user      =& User::singleton();
        $db        = Database::singleton();
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

        $uploaderList =[];
        $uploaders    = $db -> pselect(
            "SELECT UploadedBy FROM mri_upload GROUP BY UploadedBy",
            array()
        );
        foreach($uploaders as $up){
            $uploaderList[$up['UploadedBy']] = $up['UploadedBy'];
        }
        $namesList    =[];
        $patientNames = $db->pselect(
            "SELECT PatientName FROM tarchive GROUP BY PatientName",
            array()
        );
        foreach($patientNames as $pn){
            $namesList[$pn['PatientName']] = $pn['PatientName'];
        }
        $errorList =[];
        foreach ($this->errors as $error){
            $errorList[$error] = $error;
        }
        // Form Elements
        $this->addBasicText('candId', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        //$this->addSelect('errorMessage', 'Error Message', $errorList);
        $this->addSelect('t1ScanDoneInMRIPF', 'T1 Scan Done', array("Yes"=>"Yes", "No"=>"No"));
        $this->addSelect('mriParameterForm', "MRI Parameter Form", array("Complete"=>"Complete", "Incomplete"=>"Incomplete"));
        $this->addSelect('t1QCStatus', 'T1 QC Status', array( "Pass"=>"Pass", "Fail"=>"Fail"));
        $this->addSelect('scanInImagingBrowser', 'Scan Status', array("Found"=>"Found in Imaging Browser", "Missing"=> "Missing From Imaging Browser"));
        $this->addSelect('uploadedBy', 'Uploaded By', $uploaderList);
        //$this->addSelect('PatientName', 'Patient ID', $namesList);
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

        // MRI PF incomplete, QC Pass, Tarchive Exists, scan in browser
        $query =  " FROM (
                   SELECT c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   s.Visit_label as visit_label,
                   'Incomplete' as mri_parameter_form,
                   ' ' as t1_scan_done,
                   t.tarchiveID as tarchive_loc,
                   'Found' as scan_location,
                   qc.QCStatus as qc_status,
                   mu.uploadedBy as uploaded_by,
                   f.CommentID as CommentID
            FROM flag f
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN files fi ON (fi.SessionID = f.SessionID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN files_qcstatus qc ON (qc.FileID = fi.FileID)
            LEFT JOIN mri_upload mu ON (mu.SessionID = f.SessionID)
            WHERE f.CommentID NOT LIKE 'DDE%'
                  AND f.Test_name='mri_parameter_form'
                  AND s.Active='Y'
                  AND s.CenterID <> '1'
                  AND t.ArchiveLocation IS NOT NULL
                  AND fi.AcquisitionProtocolID=44
                  AND m.T1_Scan_done IS NULL";

      // MRI PF complete, T1_Scan_done = NO, QC = Pass, Scan in Browser
      $query = $query . " UNION ALL " . "SELECT c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   s.Visit_label as visit_label,
                   'Complete' as mri_parameter_form,
                   'No' as t1_scan_done,
                   t.tarchiveID as tarchive_loc,
                   'Found' as scan_location,
                   qc.QCStatus as qc_status,
                   mu.uploadedBy as uploaded_by,
                   f.CommentID as CommentID
            FROM flag f
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN files fi ON (fi.SessionID = f.SessionID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN files_qcstatus qc ON (qc.FileID=fi.FileID)
            LEFT JOIN mri_upload mu ON (mu.SessionID = f.SessionID)
            WHERE f.CommentID NOT LIKE 'DDE%'
                  AND f.Test_name='mri_parameter_form'
                  AND f.Administration <> 'None'
                  AND s.Active='Y'
                  AND s.CenterID <> '1'
                  AND f.Data_entry='Complete'
                  AND fi.AcquisitionProtocolID = 44
                  AND (m.T1_Scan_done IS NOT NULL
                    AND m.T1_Scan_done != 'Complete'
                    AND m.T1_Scan_done != 'Partial')";

      // MRI PF Complete, scan done = No,
     $query = $query . " UNION ALL " . " SELECT c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   s.Visit_label as visit_label,
                   'Complete' as mri_parameter_form,
                   'Yes' as t1_scan_done,
                   t.tarchiveID as tarchive_loc,
                   'Missing' as scan_location,
                    ' ' as qc_status,
                   mu.uploadedBy as uploaded_by,
                   f.CommentID as CommentID
                   FROM flag f
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN mri_upload mu ON (mu.SessionID = f.SessionID)
            WHERE f.CommentID NOT LIKE 'DDE%'
                  AND f.Test_name='mri_parameter_form'
                  AND s.Active='Y'
                  AND s.CenterID <> '1'
                  AND (m.T1_Scan_done = 'Complete' OR m.T1_Scan_done = 'Partial')
                  AND s.ID NOT IN (SELECT SessionID FROM files fi where fi.AcquisitionProtocolID=44)) as tmp";

        $this->query = $query;
        $this->columns = [
                          'PSCID',
                          'SessionID',
                          'cand_id',
                          'visit_label',
                          'mri_parameter_form',
                          't1_scan_done',
                          'tarchive_loc',
                          'scan_location',
                          'qc_status',
                          'uploaded_by',
                          'CommentID',
                         ];


        $this->group_by = 'PSCID,
            SessionID,
            cand_id,
            visit_label,
            mri_parameter_form,
            t1_scan_done,
            tarchive_loc,
            scan_location,
            qc_status,
            uploaded_by,
            CommentID';

        $this->order_by = 'PSCID';

        $this->headers      = [
                               'PSCID',
                               'Session ID',
                               'DCCID',
                               'Visit Label',
                               'MRI Parameter Form',
                               'T1 Scan Done in MRI PF',
                               'Tarchive',
                               'Scan in Imaging Browser',
                               'T1 QC Status',
                               'Uploaded By',
                               'CommentID',
                            ];

        //$this->tpl_data['hiddenHeaders'] = json_encode(['CommentID']);

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
