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
    public $errors = array(
                        1 => " MRI PF incomplete, Tarchive exists, scan inserted in browser, QC pass",
                        2 => " MRI PF Completed = No Scan, No Tarchive, scan inserted in browser, QC pass",
                        3 => " MRI PF incomplete, No Tarchive, scan inserted in browser, QC pass",
                        4 => " MRI PF Completed = No Scan, Tarchive exists, scan inserted in browser, QC pass"
                     );



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
        $this->addSelect('errorMessage', 'Error Message', $errorList);
        $this->addSelect('uploadedBy', 'Uploaded By', $uploaderList);
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

        $query1 =  " FROM (
            SELECT c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   s.Visit_label as visit_label,
                   ('" .$this->errors[1] . "') as error_message,
                   mu.UploadedBy as uploaded_by,
                   (' ') as action,
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
                  AND t.TarchiveID IS NOT NULL
                  AND fi.AcquisitionProtocolID=44
                  AND m.T1_Scan_done IS NULL
                  AND qc.QCStatus = 'Pass'";

      $query2 =  "SELECT c.PSCID,
                s.ID as SessionID,
                s.CandID as cand_id,
                s.Visit_label as visit_label,
                ('" .$this->errors[2] . "') as error_message,
                mu.UploadedBy as uploaded_by,
                (' ') as action,
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
                  AND t.TarchiveID IS NULL
                  AND s.Active='Y'
                  AND s.CenterID <> '1'
                  AND f.Data_entry='Complete'
                  AND fi.AcquisitionProtocolID = 44
                  AND m.T1_Scan_done != 'Complete'
                  AND qc.QCStatus = 'Pass'";

      $query3 =  " SELECT c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   s.Visit_label as visit_label,
                   ('" .$this->errors[3] . "') as error_message,
                   mu.UploadedBy as uploaded_by,
                   (' ') as action,
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
                  AND t.TarchiveID IS NULL
                  AND fi.AcquisitionProtocolID=44
                  AND m.T1_Scan_done IS NULL
                  AND qc.QCStatus = 'Pass'";

      $query4 =  "SELECT c.PSCID,
                s.ID as SessionID,
                s.CandID as cand_id,
                s.Visit_label as visit_label,
                ('" .$this->errors[4] . "') as error_message,
                mu.UploadedBy as uploaded_by,
                (' ') as action,
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
                  AND t.TarchiveID IS NOT NULL
                  AND s.Active='Y'
                  AND s.CenterID <> '1'
                  AND f.Data_entry='Complete'
                  AND fi.AcquisitionProtocolID = 44
                  AND m.T1_Scan_done != 'Complete'
                  AND qc.QCStatus = 'Pass') as tmp";

        $query = $query1 . " UNION ALL " .
                 $query2 . " UNION ALL " .
                 $query3 . " UNION ALL " .
                 $query4 ;

        $this->query = $query;
        $this->columns = [
                          'PSCID',
                          'SessionID',
                          'cand_id',
                          'visit_label',
                          'error_message',
                          'uploaded_by',
                          'action',
                          'CommentID',
                         ];

        $this->group_by = 'PSCID, SessionID, cand_id, visit_label, error_message, uploaded_by, CommentID, Action';
        $this->order_by = 'PSCID';

        $this->headers      = [
                               'PSCID',
                               'Session ID',
                               'DCCID',
                               'Visit Label',
                               'Error Message',
                               'Uploaded By',
                               'Action',
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
