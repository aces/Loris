<?php

/**
 * This class features the code for the menu portion of the Loris imaging
 * browser.
 *
 * PHP Version 5
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Imaging
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    Loris License
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\imaging_browser;

/**
 * Provides the PHP code for the menu filter for the imaging browser
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Imaging
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    Loris License
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */
class Imaging_Browser extends \NDB_Menu_Filter
{
    var $AjaxModule      = true;
    public $skipTemplate = true;
    public $fieldOptions;
    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user hass access
     */
    function _hasAccess(\User $user) : bool
    {
        /* User has access if they have an 'all site' permission or if they are
        * part of a study site and are permitted to view their own site.
         */
        return $user->hasAnyPermission(
            array(
             'imaging_browser_view_allsites',
             'imaging_browser_phantom_allsites',
             'imaging_browser_phantom_ownsite',
            )
        )
        || (
            $user->hasStudySite()
            && $user->hasPermission('imaging_browser_view_site')
        );
    }

    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return void
     */
    function _setupVariables()
    {
        $config = \NDB_Config::singleton();
        $DB     = \Database::singleton();
        $toTable_scan_types = $config->getSetting('tblScanTypes');
        $all_scan_types_2d  = $DB->pselect(
            "SELECT ID, Scan_type FROM mri_scan_type mri",
            array()
        );

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

        if (!empty($scan_id_types)) {
            $this->acqpid = "AND AcquisitionProtocolID IN (".
                    implode(",", array_keys($scan_id_types)) .")";
            $isFirst      = true;
            $acqpif       = '';
            $newQueryCase = '';
            foreach ($scan_id_types as $key => $value) {
                if ($isFirst) {
                    $acqpif       = "IF(FIND_IN_SET({$key},GROUP_CONCAT(
                        DISTINCT AcquisitionProtocolID))>0 ";
                    $newQueryCase = "AND(FIND_IN_SET({$key},GROUP_CONCAT(
                        DISTINCT AcquisitionProtocolID))";
                } else {
                    $acqpif       .= "OR FIND_IN_SET({$key},GROUP_CONCAT(
                        DISTINCT AcquisitionProtocolID))>0 ";
                    $newQueryCase .= " OR FIND_IN_SET({$key},GROUP_CONCAT(
                        DISTINCT AcquisitionProtocolID))";
                }
                $isFirst = false;
            }
            $acqpif       .= ",'new','')";
            $newQueryCase .=")";
        } else {
            $this->acqpid = '';
            $acqpif       = "'new'";
            $newQueryCase ='';
        }

        $NewDataSubquery = "CASE 
            COALESCE(Max(fqc.QCLastChangeTime), 'new')
            WHEN 'new' THEN {$acqpif}
            WHEN ''    THEN {$acqpif}
            WHEN NULL  THEN {$acqpif}
            ELSE ''
            END";

        foreach ($scan_id_types as $id => $type) {
            $pass[$id]          = $type . 'pass';
            $qc[$id]            = $type . 'QC';
            $coalesce_desc[$id] = $pass[$id] . '.' . $qc[$id];
            $case_desc[$id]     = "CASE
                COALESCE($coalesce_desc[$id], '')
                WHEN '' THEN ''
                WHEN 1 THEN 'Passed'
                WHEN 2 THEN 'Failed'
                END";
        }

        $PendingFailSubquery = "
            CASE s.MRIQCStatus
                WHEN 'Fail' THEN
                    IF(s.MRIQCPending='Y', 'Pending Fail', 'Fail')
                WHEN 'Pass' THEN
                    IF(s.MRIQCPending='Y', 'Pending Pass', 'Pass') 
                ELSE s.MRIQCStatus
            END 
            ";

        $PendingNewquery = "CASE 
    WHEN s.MRIQCPending='Y' THEN 'P'
    WHEN MAX(fqc.QCFirstChangeTime) IS NULL $newQueryCase THEN  'N'
      
END";
        $this->query     = " FROM psc AS p 
            JOIN session s ON (s.CenterID=p.CenterID) 
            JOIN candidate c ON (c.CandID=s.CandID) 
            JOIN files f ON (f.SessionID=s.ID) 
            LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID) 
            JOIN mri_acquisition_dates md ON (md.SessionID=s.ID)
            LEFT JOIN mri_scan_type modality ON 
            (f.AcquisitionProtocolID=modality.ID)";

        $left_joins = "";
        foreach ($case_desc as $key => $value) {
            $left_joins .= "
            LEFT JOIN (SELECT files.SessionID, 
            MIN(files_qcstatus.QCStatus+0) as " . $DB->escape($qc[$key]) . " 
            FROM files 
            JOIN files_qcstatus USING (FileID) 
            WHERE files.AcquisitionProtocolID=" . $DB->quote($key) . " 
            AND files_qcstatus.QCStatus IN (1, 2) 
            GROUP BY files.SessionID) " . $DB->escape($pass[$key]) . " 
            ON (" . $DB->escape($pass[$key]) . ".SessionID=f.SessionID) ";
        }

        $where = "
            WHERE 
            s.Active = 'Y' AND
            f.FileType='mnc'";

        $this->query .= $left_joins;
        $this->query .= $where;

        $config = \NDB_Config::singleton();
        $user   = \User::singleton();
        $DB     = \Database::singleton();
        if (!$user->hasPermission('imaging_browser_view_allsites')) {
            $site_arr = implode(",", $user->getCenterIDs());
            if (!$user->hasPermission('imaging_browser_view_site')) {
                // User must have one of the two phantom permissions to get here
                $this->query .= " AND c.Entity_type = 'Scanner' ";
                if (!$user->hasPermission('imaging_browser_phantom_allsites')) {
                    // Display only the phantom scans at the user's centers
                    // For phantoms, use session centerID
                    $this->query .= " AND s.CenterID IN (" . $site_arr . ") ";
                }
            } else {
                if ($user->hasPermission('imaging_browser_phantom_allsites')) {
                    $this->query .= " AND (c.RegistrationCenterID IN ($site_arr) 
                                      OR c.Entity_type = 'Scanner') ";
                } else if ($user->hasPermission('imaging_browser_phantom_ownsite')) {
                    $this->query .= " AND (c.RegistrationCenterID IN ($site_arr)
                                      OR (c.Entity_type = 'Scanner'
                                      AND s.CenterID IN (" . $site_arr . "))) ";
                } else {
                    $this->query .= " AND c.RegistrationCenterID IN ($site_arr) ";
                }
            }
        }

        // Initialize the arrays that go into this->columns and
        // $this->headers so that array_merge works even if no
        // $scan_types are set in the configuration module
        $modalities_subquery_as = array();
        $as = array();

        foreach ($case_desc as $key => $value) {
            $modalities_subquery[$key] = $value;
            $as[$key] = $scan_id_types[$key] . '_QC_Status';
            $modalities_subquery_as[$key] = $modalities_subquery[$key] .
                                            ' as ' .
                                            $as[$key];
        }

        $this->columns = array(
                          'p.Name as Site',
                          'c.PSCID as PSCID',
                          'c.CandID as DCCID',
                          's.visit_label as Visit_Label',
                          "$PendingFailSubquery as Visit_QC_Status",
                          'MIN(md.AcquisitionDate) as First_Acquisition',
                          'FROM_UNIXTIME(MIN(f.InsertTime)) as First_Insertion',
                          'FROM_UNIXTIME(MAX(fqc.QCLastChangeTime)) as Last_QC',
                          "$NewDataSubquery as New_Data",
                         );
        $this->columns = array_merge(
            $this->columns,
            array("GROUP_CONCAT(DISTINCT OutputType) as Links"),
            array(
             's.ID as sessionID',
             'GROUP_CONCAT(DISTINCT modality.ID) as sequenceType',
             "$PendingNewquery as pending",
            ),
            $modalities_subquery_as
        );

        $this->order_by = 'c.PSCID, s.Visit_label';
        $this->group_by = 's.ID';

        // Insert project column after DCCID, if useProject config is enabled
        if ($config->getSetting('useProjects') === "true") {
            array_splice(
                $this->columns,
                3,
                0,
                '(SELECT Name FROM Project WHERE ProjectID=c.ProjectID) as project'
            );
            array_splice($this->headers, 3, 0, 'Project');
        }
    }

    /**
     * Setup $this->tpl_data for use by Smarty
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        // create user object
        $user     = \User::singleton();
        $siteList = array();

        // PSC
        if ($user->hasPermission('imaging_browser_view_allsites')
            || $user->hasPermission('imaging_browser_phantom_allsites')
        ) {
            // get the list of study sites
            $siteList = \Utility::getSiteList();
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site = \Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }

        $DB    = \Database::singleton();
        $allAr = array();

        $config = \NDB_Config::singleton();

        $toTable_scan_types = $config->getSetting('tblScanTypes');

        $all_scan_types_2d = $DB->pselect(
            "SELECT ID, Scan_type FROM mri_scan_type mri",
            array()
        );

        foreach ($all_scan_types_2d as $row) {
            $type = $row['Scan_type'];
            $all_scan_types[$row['ID']] = $type;
        }

        // Get the intersection between all the scan types and those
        // that are desired to go into imaging browser table, based on
        // array values rather than keys (hence the array_flip), then flip
        // the resulting array back to revert it to a key/value (i.e.
        // acquisition protocol ID/scan type) combination.

        $scan_id_types          =array_flip(
            array_intersect_key(
                array_flip($all_scan_types),
                array_flip($toTable_scan_types)
            )
        );
        $modalities_subquery_as = array();
        $as = array();
        $list_of_projects = array();

        foreach ($scan_id_types as $key => $value) {
            $modalities_subquery[$key] = $value;
            $as[$key] = $scan_id_types[$key] . '_QC_Status';
            $modalities_subquery_as[$key] = $modalities_subquery[$key] .
                ' as ' .
                $as[$key];
        }

        if ($config->getSetting('useProjects') === "true") {
            $list_of_projects = $allAr;
            $projectList      = \Utility::getProjectList();
            foreach ($projectList as $key => $project) {
                unset($projectList[$key]);
                $list_of_projects[$project] = $project;
            }
        }

            $visitQCStatus = array(
                              'Pass' => 'Pass',
                              'Fail' => 'Fail',
                             );

            $pending = array(
                        'P' => 'Pending',
                        'N' => 'New',
                       );

            $types_q    = $DB->pselect(
                "SELECT ID, Scan_type FROM mri_scan_type mri
                 JOIN files f ON (f.AcquisitionProtocolID=mri.ID)",
                array()
            );
            $scan_types = $allAr;
        foreach ($types_q as $key=>$sequenceType) {
            $scan_types[$sequenceType['ID']] = $sequenceType['Scan_type'];
        }

            $outputTypes = $DB->pselect(
                "SELECT DISTINCT OutputType AS outputType 
            FROM files WHERE FileType='mnc' AND OutputType!='native'",
                array()
            );

            $this->fieldOptions = [
                                   'sites'         => $siteList,
                                   'projects'      => $list_of_projects,
                                   'visitQCStatus' => $visitQCStatus,
                                   'sequenceTypes' => $scan_types,
                                   'pendingNew'    => $pending,
                                   'configLabels'  => $scan_id_types,
                                  ];

            $this->tpl_data['backURL'] = $_SERVER['REQUEST_URI'];
    }
    /**
     * Converts this menu filter to an array of the form
     *
     * Headers => (string array)
     * Data => (array of arrays of row data)
     *
     * @note overloaded function
     *         Overloading this method to create a list of sessionID that
     *         will be used for the Navigation Links in  the viewSession
     *         page.
     *
     * @return array
     */
    function toArray()
    {
        $data  = parent::toArray();
        $index = array_search('SessionID', $data['Headers']);
        if ($index !== false) {
            $_SESSION['State']->setProperty(
                'mriSessionsListed',
                array_column($data['Data'], $index)
            );
        }
        return $data;
    }

    /**
     * Include additional CSS files:
     *  1. imaging_browser.css
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/imaging_browser/css/imaging_browser.css"]
        );
    }



    /**
     * Include the column formatter
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            array(
             $baseurl . "/imaging_browser/js/imagingBrowserIndex.js",
            )
        );
    }
}
