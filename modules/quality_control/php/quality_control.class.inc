<?php
/**
 * This file contains the NDB_Menu_Filter_media class
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Quality_Control
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
namespace LORIS\quality_control;

/**
 * Main class for quality control module corresponding to /quality_control/ URL
 * Tools section of the LorisMenu.
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Quality_Control
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Quality_Control extends \NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $AjaxModule         = true;
    public $hasHidePermission  = false;
    public $fieldOptions;

    /**
     * Check user permissions
     *
     * @param \User $user UserID
     *
     * @return bool
     * @throws \ConfigurationException
     */
    function _hasAccess(\User $user) : bool
    {
        //create user object
        $this->hasHidePermission = $user->hasPermission("superuser");
        return $user->hasPermission('data_team_helper');
    }

    /**
     * Checks configuration module to find which scans are relevant
     * to the given project
     *
     * @return array $scan_types of desired scan types.
     */
    function _getScanTypes(): array
    {
        $config = \NDB_Config::singleton();
        $db     = \Database::singleton();

        $toTable_scan_types = $config->getSetting('tblScanTypes');

        $all_scan_types_2d = $db->pselect(
            "SELECT ID, Scan_type FROM mri_scan_type mri",
            array()
        );

        $all_scan_types = array();
        foreach ($all_scan_types_2d as $row) {
            $type = $row['Scan_type'];
            $all_scan_types[$row['ID']] = $type;
        }

        // Get the intersection between all the scan types and those
        // that are desired to go into imaging browser table, based on
        // array values rather than keys (hence the array_flip), then flip
        // the resulting array back to revert it to a key/value (i.e.
        // acquisition protocol ID/scan type) combination.
        $scan_id_types =array_flip(
            array_intersect_key(
                array_flip($all_scan_types),
                array_flip($toTable_scan_types)
            )
        );
        $scan_types    =[];

        foreach ($scan_id_types as $scan) {
            $scan_types[$scan] = $scan;
        }
        return $scan_types;
    }



    /**
     * Builds query for given modality. Works with t1w, t2w, dti.
     *
     * @param string $scan_type One of 't1w', 't2w', 'dti'
     * @param string $scan_done Name of column to check in mri_parameter_form
     * @param string $acqID     Aquisition protocol ID for given modality
     *
     * @return string $query for the given modality
     */
    function _buildQuery($scan_type, $scan_done, $acqID): string
    {

        $select =  " SELECT DISTINCT
           c.PSCID,
           s.ID as SessionID,
           s.CandID as cand_id,
           (SELECT name FROM psc WHERE CenterID=s.CenterID) as site,
           s.Visit_label as visit_label,
           '".$scan_type."' as scan_type,
           t.TarchiveID as tarchiveID,
           CASE
              WHEN EXISTS(
                  SELECT
                      *
                  FROM
                      tarchive_series ts
                  LEFT JOIN mri_protocol mp ON mp.Scan_type=".$acqID."
                  WHERE
                      ts.TarchiveID = t.TarchiveID
                      AND (ts.EchoTime BETWEEN mp.TE_min AND mp.TE_max)
                      AND (ts.RepetitionTime BETWEEN mp.TR_min AND mp.TR_max)".
               " ) THEN 'In DICOM'".
              " ELSE 'Missing'
           END as tarchive_loc,
           (SELECT Name FROM Project WHERE ProjectID=s.ProjectID) as project,".
            " (SELECT title FROM subproject WHERE SubprojectID=s.SubprojectID)
           as subproject,".
            " CASE
              WHEN m.Data_entry_completion_status='Incomplete' THEN 'Incomplete'
              ELSE 'Complete'
           END AS mri_parameter_form,
           CASE
              WHEN m.".$scan_done." IS NULL THEN ''
              WHEN (m.".$scan_done." = 'Complete'
              OR m.".$scan_done." = 'Partial') THEN 'Yes'
              ELSE 'No'
           END as scan_done,
           CASE
              WHEN (fi.fileID IS NULL AND mvl.PatientName IS NULL) THEN 'Missing'
              WHEN fi.fileID IS NOT NULL THEN 'In Imaging Browser'
              WHEN mvl.PatientName IS NOT NULL THEN 'In MRI Violated Scans'
           END as scan_location,
           CASE
              WHEN qc.Selected = '' THEN 'False'
              WHEN qc.Selected = 'true' THEN 'True'
           END as selected,
           qc.QCStatus as qc_status,
           mu.uploadedBy as uploaded_by,
           f.CommentID as CommentID ";

        $joins = " FROM flag f
        JOIN session s ON (f.SessionID=s.ID)
        JOIN candidate c ON (s.CandID=c.CandID)
        LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
        LEFT JOIN tarchive t ON (t.SessionID=s.ID)
        LEFT JOIN files fi ON (fi.SessionID=s.ID AND
        fi.AcquisitionProtocolID=".$acqID.")
        LEFT JOIN mri_violations_log mvl ON
        (mvl.CandID = s.CandID AND mvl.Scan_type=".$acqID."
        AND mvl.PatientName LIKE CONCAT ('%', s.Visit_label,'%'))
        LEFT JOIN files_qcstatus qc ON (qc.FileID = fi.FileID)
        LEFT JOIN mri_upload mu ON (mu.SessionID = f.SessionID) ";

        $where = " WHERE 1=1
          AND NOT f.CommentID LIKE 'DDE%'
          AND f.Test_name='mri_parameter_form'
          AND c.Active='Y'
          AND s.Active='Y'
          AND s.CenterID <> '1' ";

        $query = $select.$joins.$where;
        return $query;
    }

    /**
     * Build a list of imaging QC to display in Data Table
     *
     * @return void
     * @throws \DatabaseException
     */
    function _setupVariables(): void
    {

        $this->skipTemplate = true;
        $user      = \User::singleton();
        $db        = \Database::singleton();
        $siteList  = array();
        $visitList = \Utility::getVisitList();
        // allow to view all sites data through filter
        if ($user->hasPermission('imaging_browser_qc')) {
            $siteList = \Utility::getSiteList();
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

        $scan_types = $this->_getScanTypes();

        $projectList  = \Utility::getProjectList();
        $projectList2 = array();
        foreach ($projectList as $key => $value) {
            $projectList2[$value] = $value;
        }
        $subprojectList  = \Utility::getSubprojectList();
        $subprojectList2 = array();
        foreach ($subprojectList as $key => $value) {
            $subprojectList2[$value] = $value;
        }
        //print_r($subprojectList2);
        $uploaderList = array();
        $uploaders    = $db -> pselect(
            "SELECT UploadedBy FROM mri_upload GROUP BY UploadedBy",
            array()
        );
        foreach ($uploaders as $up) {
            $uploaderList[$up['UploadedBy']] = $up['UploadedBy'];
        }

        $scan_location = array(
            "In Imaging Browser"    => "Found in Imaging Browser",
            "In MRI Violated Scans" => "Found in MRI Violated Scans",
            "Missing"               => "Missing",
        );

        $this->fieldOptions
            = [
                'site'             => $siteList,
                'project'          => $projectList2,
                'subproject'       => $subprojectList2,
                'scanType'         => $scan_types,
                'mRIParameterForm' => array(
                    "Incomplete" => "Incomplete",
                    "Complete"   => "Complete",
                ),
                'scanDoneInMRIPF'  => array(
                    "Yes" => "Yes",
                    "No"  => "No",
                ),
                'tarchive'         => array(
                    "In DICOM" => "In DICOM Archives",
                    "Missing"  => "Missing",
                ),
                'scanLocation'     => $scan_location,
                'qCStatus'         => array(
                    "Pass" => "Pass",
                    "Fail" => "Fail",
                ),
                'uploadedBy'       => $uploaderList,
                'selected'         => array(
                    "True"  => "True",
                    "False" => "False",
                ),
                'visitLabel'       => $visitList,
            ];

        $scan_types = $this->_getScanTypes();
        $scans_done = array();
        $acq_IDs    = array();
        foreach ($scan_types as $scan_type) {
            $query_params        = array('scan_type' => $scan_type);
            $acq_IDs[$scan_type] = $db->pselectOne(
                "SELECT ID FROM mri_scan_type WHERE Scan_type=:scan_type",
                $query_params
            );
            if (substr("$scan_type", 0, 2) == "t1") {
                $scans_done[$scan_type] = "T1_Scan_done";
            } elseif (substr("$scan_type", 0, 3) == "t2w") {
                $scans_done[$scan_type] = "T2_Scan_done";
            } elseif (substr("$scan_type", 0, 3) == "dti") {
                $scans_done[$scan_type] = "dti_Scan_done";
            } else {
                $scans_done[$scan_type] = $scan_type . "_Scan_done";
            }
        }

        foreach ($scan_types as $scan_type) {
            $scan_types[$scan_type]
                = $this->_buildQuery(
                    $scan_type,
                    $scans_done[$scan_type],
                    $acq_IDs[$scan_type]
                );
        }

        $query = implode(
            "
          UNION ALL
          ",
            $scan_types
        );

        $this->query = " FROM ( " . $query . " ) as tmp";

        $this->columns = [
            'PSCID',
            'SessionID',
            'cand_id',
            'site',
            'project',
            'subproject',
            'visit_label',
            'scan_type',
            'mri_parameter_form',
            'scan_done',
            'tarchive_loc',
            'scan_location',
            'qc_status',
            'uploaded_by',
            'selected',
            'CommentID',
            'TarchiveID',
        ];

        $this->group_by = 'PSCID,
            SessionID,
            cand_id,
            site,
            project,
            subproject,
            visit_label,
            scan_type,
            mri_parameter_form,
            scan_done,
            tarchive_loc,
            scan_location,
            qc_status,
            selected,
            uploaded_by,
            CommentID,
            TarchiveID ';

        $this->order_by = 'PSCID';
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
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

