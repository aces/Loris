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
        
        $scan_status = array(
          "In Imaging Browser"=>"Found in Imaging Browser", 
          "In MRI Violated Scans"=>"Found in MRI Violated Scans", 
          "Missing"=> "Missing"
          );
        // Form Elements
        $this->addBasicText('candId', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('scan_type', 'Scan Type', array("T1"=>"T1", "T2"=>"T2"));
        $this->addSelect('mRIParameterForm', "MRI Parameter Form", array("Complete"=>"Complete", "Incomplete"=>"Incomplete"));
        $this->addSelect('t1ScanDoneInMRIPF', 'T1 Scan Done', array("Yes"=>"Yes", "No"=>"No"));
        $this->addSelect('tarchive', 'Tarchive Status', array("In DICOM"=> "In DICOM Archives", "Missing"=>"Missing"));
        $this->addSelect('scan', 'Scan Status', $scan_status);
        $this->addSelect('t1QCStatus', 'T1 QC Status', array( "Pass"=>"Pass", "Fail"=>"Fail"));
        $this->addSelect('uploadedBy', 'Uploaded By', $uploaderList);
        //$this->addSelect('site', 'Site', $siteList);
        return true;
    }

    function _buildQuery($scan_type, $scan_done, $acqID){
      
      $query =  "  
                  SELECT 
                   c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   s.Visit_label as visit_label,
                   '".$scan_type."' as scan_type,
                   CASE
                      WHEN m.".$scan_done." IS NULL THEN 'Incomplete'
                      ELSE 'Complete'
                   END AS mri_parameter_form,
                   CASE 
                      WHEN m.".$scan_done." IS NULL THEN ''
                      WHEN m.".$scan_done." = 'Complete' THEN 'Yes'
                      WHEN m.".$scan_done." = 'Partial' THEN 'Yes'
                      ELSE 'No'
                    END as t1_scan_done,
                    CASE 
                      WHEN t.tarchiveID IS NULL THEN 'Missing'
                      ELSE 'In DICOM'
                    END as tarchive_loc,
                    CASE 
                      WHEN fi.fileID IS NULL AND mpv.PatientName IS NULL THEN 'Missing'
                      WHEN fi.fileID IS NOT NULL THEN 'In Imaging Browser'
                      WHEN mpv.PatientName IS NOT NULL THEN 'In MRI Violated Scans'
                    END as scan_location,
                   qc.QCStatus as qc_status,
                   mu.uploadedBy as uploaded_by,
                   f.CommentID as CommentID,
                   t.tarchiveID as tarchiveID
            FROM flag f
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN files fi ON (fi.SessionID = s.ID AND fi.AcquisitionProtocolID=".$acqID.")
            LEFT JOIN mri_protocol_violated_scans mpv ON (mpv.CandID = s.CandID AND mpv.PatientName LIKE CONCAT ('%', s.Visit_label,'%'))
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN files_qcstatus qc ON (qc.FileID = fi.FileID)
            LEFT JOIN mri_upload mu ON (mu.SessionID = f.SessionID)
            WHERE 1=1
            AND NOT (((m.".$scan_done."='Complete' OR m.".$scan_done."='Partial') AND m.".$scan_done." IS NOT NULL) AND ((fi.fileID IS NOT NULL OR mpv.PatientName IS NOT NULL) AND t.tarchiveID IS NOT NULL))
            AND NOT (((m.".$scan_done."!='Complete' AND m.".$scan_done."!='Partial') OR m.".$scan_done." IS NULL) AND ((fi.fileID IS NULL AND mpv.PatientName IS NULL) AND t.tarchiveID IS NULL))
              AND NOT f.CommentID LIKE 'DDE%'
              AND f.Test_name='mri_parameter_form'
              AND s.Active='Y'
              AND s.CenterID <> '1' 
              ";

              //var_dump($query);
              return $query;
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

        // joins tarchive, files and mri_violated_scans to Session table and then filters out 
        // the "normal" cases: 
        //    1) Data correct - MRI PF = Complete, Scan Done = Yes, scan in MRI Violations or in Imaging Browser, DICOM exists
        //    2) No Data - MRI PF Incomplete, No scan in browser, No DICOM.

        $query_t1 = $this->_buildQuery("T1", "T1_Scan_done", "44");
        $query_t2 = $this->_buildQuery("T2", "T2_Scan_done", "45");
        
        $this->query = "FROM ( " . $query_t1 . " UNION ALL ". $query_t2 . ") as tmp;";
        var_dump($this->query);
        $this->columns = [
                          'PSCID',
                          'SessionID',
                          'cand_id',
                          'visit_label',
                          'scan_type',
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
            scan_type,
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
                               'Scan Type',
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
