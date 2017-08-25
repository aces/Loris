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

        $uploaderList =[];
        $uploaders    = $db -> pselect(
            "SELECT UploadedBy FROM mri_upload GROUP BY UploadedBy",
            array()
        );
        foreach($uploaders as $up){
            $uploaderList[$up['UploadedBy']] = $up['UploadedBy'];
        }
        
        // Form Elements
        $this->addBasicText('candId', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('mRIParameterForm', "MRI Parameter Form", array("Complete"=>"Complete", "Incomplete"=>"Incomplete"));
        $this->addSelect('t1ScanDoneInMRIPF', 'T1 Scan Done', array("Yes"=>"Yes", "No"=>"No"));
        $this->addSelect('tarchive', 'Tarchive Status', array("In DICOM"=> "In DICOM Archives", "Missing"=>"Missing"));
        $this->addSelect('scan', 'Scan Status', array("Found"=>"Found in Imaging Browser", "Missing"=> "Missing"));
        $this->addSelect('t1QCStatus', 'T1 QC Status', array( "Pass"=>"Pass", "Fail"=>"Fail"));
        $this->addSelect('uploadedBy', 'Uploaded By', $uploaderList);
        //$this->addSelect('site', 'Site', $siteList);
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

        $query =  " FROM (
                   SELECT 
                   c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   s.Visit_label as visit_label,
                   CASE
                      WHEN m.T1_Scan_done IS NULL THEN 'Incomplete'
                      ELSE 'Complete'
                   END AS mri_parameter_form,
                   CASE 
                      WHEN m.T1_Scan_done IS NULL THEN ''
                      WHEN m.T1_Scan_done = 'Complete' THEN 'Yes'
                      WHEN m.T1_Scan_done = 'Partial' THEN 'Yes'
                      ELSE 'No'
                    END as t1_scan_done,
                    CASE 
                      WHEN t.tarchiveID IS NULL THEN 'Missing'
                      ELSE 'In DICOM'
                    END as tarchive_loc,
                    CASE 
                      WHEN fi.fileID IS NOT NULL THEN 'In Imaging Browser'
                      WHEN fi.fileID IS NULL AND mpv.PatientName IS NULL THEN 'Missing'
                    END as scan_location,
                   qc.QCStatus as qc_status,
                   mu.uploadedBy as uploaded_by,
                   f.CommentID as CommentID,
                   t.tarchiveID as tarchiveID
            FROM flag f
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN files fi ON (fi.SessionID = s.ID AND fi.AcquisitionProtocolID=44)
            LEFT JOIN mri_protocol_violated_scans mpv ON (mpv.CandID = s.CandID)
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN files_qcstatus qc ON (qc.FileID = fi.FileID)
            LEFT JOIN mri_upload mu ON (mu.SessionID = f.SessionID)
            WHERE 1=1
              AND (
              ((m.T1_Scan_done='Complete' OR m.T1_Scan_done='Partial') AND (fi.fileID IS NULL OR t.tarchiveID IS NULL))
              OR
              (((m.T1_Scan_done!='Complete' AND m.T1_Scan_done!='Partial') OR m.T1_Scan_done IS NULL) AND ((fi.fileID IS NOT NULL AND mpv.PatientName IS NOT NULL) OR t.tarchiveID IS NOT NULL))
              )
              AND f.CommentID NOT LIKE 'DDE%'
              AND f.Test_name='mri_parameter_form'
              AND s.Active='Y'
              AND s.CenterID <> '1'
              ) as tmp";

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
                          'TarchiveID',
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
            CommentID,
            TarchiveID ';

        $this->order_by = 'PSCID';

        $this->headers      = [
                               'PSCID',
                               'Session ID',
                               'DCCID',
                               'Visit Label',
                               'MRI Parameter Form',
                               'T1 Scan Done in MRI PF',
                               'Tarchive',
                               'Scan',
                               'T1 QC Status',
                               'Uploaded By',
                               'CommentID',
                               'TarchiveID',
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
