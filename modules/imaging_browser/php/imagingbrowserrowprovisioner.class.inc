<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the imaging browser menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\candidate_list;

/**
 * This class implements a data provisioner to get all possible rows
 * for the imaging browser menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class CandidateListRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create an ImagingBrowserRowProvisioner, which gets rows for
     * the imaging browser menu table.
     */
    function __construct()
    {
        $config = \NDB_Config::singleton();
        $user   = \User::singleton();


        // ===========================================================
        // Get the different scan types to be displayed in data table
        // ===========================================================

        // Grep all the different scan types present in mri_scan_type
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
        $scan_id_types = array_flip(
            array_intersect_key(
                array_flip($all_scan_types),
                array_flip($toTable_scan_types)
            )
        );


        // =======================================================
        // Create New Data Subquery
        // =======================================================

        if (!empty($scan_id_types)) {
            $this->acqpid = "AND AcquisitionProtocolID IN ("
                . implode(",", array_keys($scan_id_types))
                . ")";
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
            $newQueryCase .= ")";
        } else {
            $this->acqpid = '';
            $acqpif       = "'new'";
            $newQueryCase ='';
        }

        $NewDataSubquery = "
            CASE 
                COALESCE(Max(fqc.QCLastChangeTime), 'new')
                WHEN 'new' THEN {$acqpif}
                WHEN ''    THEN {$acqpif}
                WHEN NULL  THEN {$acqpif}
                ELSE ''
            END";


        // =====================================================
        // Create Pending Fail and Pending New subquery
        // =====================================================

        foreach ($scan_id_types as $id => $type) {
            $pass[$id]          = $type . 'pass';
            $qc[$id]            = $type . 'QC';
            $coalesce_desc[$id] = $pass[$id] . '.' . $qc[$id];
            $case_desc[$id]     = "
                CASE
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

        $PendingNewquery = "
            CASE 
                WHEN s.MRIQCPending='Y' THEN 'P'
                WHEN MAX(fqc.QCFirstChangeTime) IS NULL $newQueryCase THEN  'N'      
            END";


        // ====================================================
        // Create left join to include QC status for specific
        // scans in the data table
        // ====================================================

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


        // ===================================================
        // Determine which data should be returned depending
        // on user permission
        // ===================================================

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

        // ===============================================
        // Create modality subquery
        // ===============================================

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


        // =================================================
        // Final query
        // =================================================

        parent::__construct(
            "SELECT 
              p.Name as Site,
              c.PSCID as PSCID,
              c.CandID as DCCID,
              (SELECT Name 
                FROM Project 
                WHERE ProjectID=c.ProjectID) AS project
              s.visit_label as Visit_Label
              $PendingFailSubquery as Visit_QC_Status
              MIN(md.AcquisitionDate) as First_Acquisition
              FROM_UNIXTIME(MIN(f.InsertTime)) as First_Insertion
              FROM_UNIXTIME(MAX(fqc.QCLastChangeTime)) as Last_QC
              $NewDataSubquery as New_Data
              GROUP_CONCAT(DISTINCT OutputType) as Links
              s.ID as sessionID
              GROUP_CONCAT(DISTINCT modality.Scan_type) as sequenceType
              $PendingNewquery as pending
              $modalities_subquery_as
            FROM psc AS p 
              JOIN session s ON (s.CenterID=p.CenterID) 
              JOIN candidate c ON (c.CandID=s.CandID) 
              JOIN files f ON (f.SessionID=s.ID) 
              LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID) 
              JOIN mri_acquisition_dates md ON (md.SessionID=s.ID)
              LEFT JOIN mri_scan_type modality ON 
                (f.AcquisitionProtocolID=modality.ID)
              $left_joins 
            WHERE 
              s.Active = 'Y' AND
              f.FileType='mnc'
            ORDER BY c.PSCID, s.Visit_label
            GROUP BY s.ID
            ",
            array()
        );
    }

    /**
     * Returns an instance of an ImagingBrowserRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        // XXX This should probably be updated to allow users
        // to access candidates who have any session at one of the
        // user's sites, but for now this maintains the previous
        // behaviour of requiring the registration site to match
        // one of the user's sites.
        $cid = (int )$row['RegistrationCenterID'];
        unset($row['RegistrationCenterID']);
        return new ImagingBrowserRow($row, $cid);
    }
}