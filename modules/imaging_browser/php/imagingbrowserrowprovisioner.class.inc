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

namespace LORIS\imaging_browser;

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
class ImagingBrowserRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create an ImagingBrowserRowProvisioner, which gets rows for
     * the imaging browser menu table.
     */
    function __construct()
    {
        $config = \NDB_Config::singleton();

        // ===========================================================
        // Get the different scan types to be displayed in data table
        // ===========================================================

        // Grep all the different scan types present in mri_scan_type
        $all_scan_types = \Utility::getScanTypeList();

        // Get the intersection between all the scan types and those
        // that are desired to go into imaging browser table, based on
        // array values rather than keys (hence the array_flip), then flip
        // the resulting array back to revert it to a key/value (i.e.
        // acquisition protocol ID/scan type) combination.
        $toTable_scan_types = $config->getSetting('tblScanTypes');
        $scan_id_types      = array_flip(
            array_intersect_key(
                array_flip($all_scan_types),
                array_flip($toTable_scan_types)
            )
        );

        // =======================================================
        // Create New Data Subquery
        // =======================================================

        if (!empty($scan_id_types)) {
            $acqpid       = "AND AcquisitionProtocolID IN ("
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
            $acqpid       = '';
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
        $case_desc     = array();
        $qc            = array();
        $pass          = array();
        $coalesce_desc = array();

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
            LEFT JOIN (
              SELECT files.SessionID, 
                MIN(files_qcstatus.QCStatus+0) as $qc[$key] 
              FROM files 
              JOIN files_qcstatus USING (FileID) 
              WHERE files.AcquisitionProtocolID= $key 
                AND files_qcstatus.QCStatus IN (1, 2) 
              GROUP BY files.SessionID) $pass[$key] 
                ON ($pass[$key].SessionID=f.SessionID
            ) ";
        }

        // ===============================================
        // Create modality subquery
        // ===============================================

        // Initialize the arrays that go into this->columns and
        // $this->headers so that array_merge works even if no
        // $scan_types are set in the configuration module
        $modalities_subquery = '';
        foreach ($case_desc as $key => $value) {
            $modalities_subquery = "$value as $scan_id_types[$key]_QC_Status";
        }

        // =================================================
        // Final query
        // =================================================

        parent::__construct(
            "SELECT 
              p.Name as Site,
              c.PSCID as PSCID,
              c.CandID as DCCID,
              Project.Name as project,
              s.Visit_label as visitLabel,
              $PendingFailSubquery as Visit_QC_Status,
              DATE_FORMAT(MIN(pf.Value), \"%Y-%m-%d\") as First_Acquisition,
              FROM_UNIXTIME(MIN(f.InsertTime)) as First_Insertion,
              FROM_UNIXTIME(MAX(fqc.QCLastChangeTime)) as Last_QC,
              $NewDataSubquery as New_Data,
              GROUP_CONCAT(DISTINCT OutputType) as Links,
              s.ID as sessionID,
              GROUP_CONCAT(DISTINCT modality.Scan_type) as sequenceType,
              $PendingNewquery as pending,
              $modalities_subquery,
              s.CenterID as CenterID,
              c.Entity_type as entityType,
              s.ProjectID
            FROM psc AS p 
              JOIN session s ON (s.CenterID=p.CenterID) 
              JOIN candidate c ON (c.CandID=s.CandID) 
              LEFT JOIN Project ON (s.ProjectID=Project.ProjectID)
              JOIN files f ON (f.SessionID=s.ID) 
              LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID) 
              JOIN parameter_file pf ON (f.FileID=pf.FileID)
              JOIN parameter_type pt USING (ParameterTypeID)
              LEFT JOIN mri_scan_type modality ON 
                (f.AcquisitionProtocolID=modality.ID)
              $left_joins 
            WHERE 
              s.Active = 'Y' AND
              f.FileType='mnc'
            GROUP BY s.ID
            ORDER BY c.PSCID, s.Visit_label
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
        $cid = (int )$row['CenterID'];
        $pid = (int )$row['ProjectID'];
        unset($row['CenterID']);
        unset($row['ProjectID']);
        return new ImagingBrowserRow($row, $cid, $pid);
    }
}
