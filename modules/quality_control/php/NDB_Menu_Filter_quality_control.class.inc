<?php
/**
 * This file contains the NDB_Menu_Filter_quality_control class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality_Control
 * @author   Leo Thomas <lthomas.mcin@gmail.com>
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
/**
 * Imaging QC Class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality_Control
 * @author   Leo Thomas <lthomas.mcin@gmail.com>
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu_Filter_Quality_Control extends NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $AjaxModule         = true;

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
     * Override default behaviour, since the page is loaded from
     * qualityControlIndex.js
     *
     * @return void
     * @access public
     */
    function display()
    {
        return null;
    }

    /**
    * Checks configuration module to find which scans are relevant
    * to the given project
    *
    * @return array $scan_types of desired scan types.
    */
    function _getScanTypes()
    {
        $config = NDB_Config::singleton();
        $db     = Database::singleton();

        $toTable_scan_types = $config->getSetting('tblScanTypes');

        $all_scan_types_2d = $db->pselect(
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
        $scan_types    =[];

        foreach ($scan_id_types as $scan) {
            $scan_types[$scan] = $scan;
        }
        return $scan_types;
    }


    /**
     * Gets data from tarchive_series table and returns
     * an array of the protocol names corresponding to each series
     * pertaining to the tarchive ID.
     *
     * @return array
     */

    function _getAllProtocolNamesArray($tarchiveID) {
        $db    = Database::singleton();
        $query = "SELECT * FROM tarchive_series WHERE TarchiveID =:ID 
                ORDER BY 'TarchiveSeriesID'";
        $array = $db->pselect(
            $query,
            array(
                'ID'     => $tarchiveID,
            )
        );

        if ($this->_setProtocols()) {
            $previousSeriesDescription = '';
            $previousProtocolName      = '';
            $protocolNameArray = array();
            foreach ($array as &$series) {
                $seriesDescription = $series['SeriesDescription'];
                // if the same series, do not compute the protocol name again,
                // use the previous one
                if ($previousSeriesDescription === $seriesDescription) {
                    $series['ProtocolName'] = $previousProtocolName;
                } else {
                    $protocolName           = $this->_getProtocolName($series);
                    $series['ProtocolName'] = $protocolName;
                    $previousSeriesDescription = $seriesDescription;
                    $previousProtocolName      = $protocolName;
                }
                array_push($protocolNameArray, $protocolName);
            }
            return($protocolNameArray);
        }
    }

    /**
     * Gets protocol data from mri_protocol table and
     * registers it into class variable $protocols.
     *
     * @return bool false if couldn't retrieve data from the table, else true
     */
    function _setProtocols()
    {
        $db                  = Database::singleton();
        try {
            $query           = "SELECT Scan_type, TR_range, TE_range, TI_range, 
                slice_thickness_range FROM mri_protocol";
            $this->protocols = $db->pselect($query, array());
            return true;
        } catch(LorisException $e) {
            return false;
        }
    }



    /**
     * Finds the protocol name by comparing parameters of a series.
     *
     * @param array $series series for which the protocol is to be found
     *
     * @return string name of the protocol, "Unknown" if protocol for
     *         series parameters doesn't exist
     */
    function _getProtocolName($series)
    {
        $tr = $series['RepetitionTime'];
        $te = $series['EchoTime'];
        $ti = $series['InversionTime'];
        $sliceThickness = $series['SliceThickness'];

        foreach ($this->protocols as $protocol) {
            if ((! $protocol['TR_range']
                    || $this->_inRange($tr, $protocol['TR_range']))
                && (! $protocol['TE_range']
                    || $this->_inRange($te, $protocol['TE_range']))
                && (! $protocol['TI_range']
                    || $this->_inRange($ti, $protocol['TI_range']))
                && (! $protocol['slice_thickness_range']
                    || $this->_inRange(
                        $sliceThickness,
                        $protocol['slice_thickness_range']
                    ))) {
                return $this->_getProtocolNameFromID($protocol['Scan_type']);
            }
        }
        return "Unknown";
    }

    /**
     * Compares parameters of a series and of the protocols
     *
     * @param string $seriesRange   series parameter to be compared
     * @param string $protocolRange protocol's parameter
     *        to be compared with
     *
     * @return bool true if series parameter is in range with
     *         the protocol's one, false otherwise
     */
    function _inRange($seriesRange, $protocolRange)
    {
        if (! isset($seriesRange)) {
            return false;
        } else if (! isset($protocolRange)) {
            return false;
        } else {
            $seriesRangeTrimmed = (float)trim($seriesRange);
            $protocolRanges     = explode(",", $protocolRange);

            foreach ($protocolRanges as $range) {
                $rangeTrimmed = trim($range);
                if (strpos($rangeTrimmed, "-")) { // range X-Y
                    $array = explode("-", $rangeTrimmed);
                    $left  = (float)trim($array[0]);
                    $right = (float)trim($array[1]);
                    if ($left <= $seriesRangeTrimmed
                        && $seriesRangeTrimmed <= $right
                    ) {
                        return true;
                    }
                } else { // single value element
                    if ($seriesRangeTrimmed === (float)$rangeTrimmed) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    /**
     * Retrieves the protocol name given the protocol ID
     * from mri_scan_table table
     *
     * @param string $id id of the protocol
     *
     * @return string name of the protocol, "Unknown" if
     *         protocol with the given id doesn't exist.
     */
    function _getProtocolNameFromID($id)
    {
        $db        = Database::singleton();
        try {
            $query = "SELECT Scan_type FROM mri_scan_type WHERE ID=:ID";
            $array = $db->pselectRow($query, array('ID' => $id));
            return $array['Scan_type'];
        } catch (LorisException $e) {
            return "Unknown";
        }
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
    function _buildQuery($scan_type, $scan_done, $acqID)
    {
        $db =& Database::singleton();
        // joins tarchive, files and mri_violated_scans to
        // Session table and then filters out
        // the "normal" cases:
        //    1) Data correct - MRI PF = Complete, Scan Done = Yes,
        //       scan in MRI Violations or in Imaging Browser,
        //       DICOM exists
        //    2) No Data - MRI PF Incomplete, No scan in browser,
        //       No DICOM.

        $all_tarchive_values = $db->pselect(
            "SELECT t.TarchiveID FROM tarchive t",
            array()
        );

        foreach ($all_tarchive_values as $row) {
            $type = $row['TarchiveID'];
            $tarchive_list[$row['TarchiveID']] = $type;
        }

        // returns an associative array where the tarchiveID is the key
        // and the value is an array of all the protocols corresponding to
        // each tarchive file related to the specific tarchiveID
        foreach($tarchive_list as $ID => $tarchiveID) {
            $protocols_per_tarchive[$ID] = $this->_getAllProtocolNamesArray($ID);
        }



        $select =  "  SELECT DISTINCT
                   c.PSCID,
                   s.ID as SessionID,
                   s.CandID as cand_id,
                   (SELECT name FROM psc WHERE CenterID=s.CenterID) as site,
                   s.Visit_label as visit_label,
                   '".$scan_type."' as scan_type,
                   (SELECT Name FROM Project WHERE ProjectID=c.ProjectID) as project,
                   (SELECT title FROM subproject WHERE SubprojectID=s.SubprojectID) as subproject,
                   CASE
                      WHEN m.".$scan_done." IS NULL THEN 'Incomplete'
                      ELSE 'Complete'
                   END AS mri_parameter_form,
                   CASE 
                      WHEN m.".$scan_done." IS NULL THEN ''
                      WHEN (m.".$scan_done." = 'Complete' OR m.".$scan_done." = 'Partial') THEN 'Yes'
                      ELSE 'No'
                   END as scan_done,
                   CASE 
                      WHEN EXISTS (SELECT ts.TarchiveSeriesID
                                  FROM tarchive_series ts
                                  LEFT JOIN tarchive t ON (t.SessionID=sess AND t.TarchiveID=tf.TarchiveID)
                                  WHERE ((tf.SeriesDescription LIKE 't1_%' OR tf.SeriesDescription LIKE 't2_%'))
                     ) THEN 'In DICOM' ELSE 'Missing'
                   END as tarchive_loc,
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
                   t.TarchiveID as tarchiveID, 
                   f.CommentID as CommentID ";
        
            print_r($select);

            $joins = " FROM flag f
            LEFT JOIN session s ON (f.SessionID=s.ID)
            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
            LEFT JOIN tarchive t ON (t.SessionID=s.ID)
            LEFT JOIN files fi ON (fi.SessionID = s.ID AND fi.AcquisitionProtocolID=".$acqID.")
            LEFT JOIN mri_violations_log mvl ON (mvl.CandID = s.CandID AND mvl.Scan_type=".$acqID." AND mvl.PatientName LIKE CONCAT ('%', s.Visit_label,'%'))
            LEFT JOIN candidate c ON (s.CandID=c.CandID)
            LEFT JOIN files_qcstatus qc ON (qc.FileID = fi.FileID)
            LEFT JOIN mri_upload mu ON (mu.SessionID = f.SessionID) ";
           
            $where = " WHERE 1=1
              AND NOT f.CommentID LIKE 'DDE%'
              AND f.Test_name='mri_parameter_form'
              AND s.Active='Y'
              AND s.CenterID <> '1' ";

              $query = $select.$joins.$where;

              return $query;
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
        $db        =& Database::singleton();
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

        $scan_types = $this->_getScanTypes();

        $projectList = Utility::getProjectList();
        $subprojectList = Utility::getSubprojectList();


        $uploaderList =[];
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
        // Form Elements
        $this->addSelect('site', 'Site', $siteList);
        $this->addBasicText('candId', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('project', 'Project', $projectList);
        $this->addSelect('subproject', 'Subproject', $subprojectList);
        $this->addSelect('scanType', 'Scan Type', $scan_types);
        $this->addSelect('mRIParameterForm', "MRI Parameter Form", array("Complete" => "Complete", "Incomplete" => "Incomplete"));
        $this->addSelect('scanDoneInMRIPF', 'Scan Done in MRI PF', array("Yes" => "Yes", "No" => "No"));
        $this->addSelect('tarchive', 'Tarchive Status', array("In DICOM" => "In DICOM Archives", "Missing" => "Missing"));
        $this->addSelect('scanLocation', 'Scan Location', $scan_location);
        $this->addSelect('qCStatus', 'QC Status', array("Pass" => "Pass", "Fail" => "Fail"));
        $this->addSelect('uploadedBy', 'Uploaded By', $uploaderList);
        $this->addSelect('selected', 'Selected', array("True" => "True", "False" => "False"));
        return true;
    }
    /**
     * Build a list of imaging QC to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {

        $db =& Database::singleton();

       //print_r($this->_getAllProtocolNamesArray('4000013'));

        $scan_types = $this->_getScanTypes();
        foreach ($scan_types as $scan_type) {
            $query_params = array('scan_type' => $scan_type);
            $acq_IDs[$scan_type] = $db->pselectOne("SELECT ID FROM mri_scan_type WHERE Scan_type=:scan_type", $query_params);
            if (substr("$scan_type", 0, 2) == "t1") {
                $scans_done[$scan_type] = "T1_Scan_done";
            } elseif (substr("$scan_type", 0, 2) == "t2") {
                $scans_done[$scan_type] = "T2_Scan_done";
            } elseif (substr("$scan_type", 0, 3) == "dti") {
                $scans_done[$scan_type] = "dti_Scan_done";
            }
        }

        foreach ($scan_types as $scan_type) {
            $scan_types[$scan_type] = $this->_buildQuery($scan_type, $scans_done[$scan_type], $acq_IDs[$scan_type]);
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
                          'TarchiveID'
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

        $this->headers = [
                          'PSCID',
                          'Session ID',
                          'DCCID',
                          'Site',
                          'Project',
                          'Subproject',
                          'Visit Label',
                          'Scan Type',
                          'MRI Parameter Form',
                          'Scan Done in MRI PF',
                          'Tarchive',
                          'Scan Location',
                          'QC Status',
                          'Uploaded By',
                          'Selected',
                          'CommentID',
                          'TarchiveID'
                         ];

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
