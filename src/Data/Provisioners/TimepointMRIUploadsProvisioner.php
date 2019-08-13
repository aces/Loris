<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Data\Provisioners;

/**
 * This file implements a data provisioner to get all MRIUploads
 * of a visit with a given filename.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class TimepointMRIUploadsProvisioner extends DBRowProvisioner
{
    /**
     * Constructor
     *
     * @param \Timepoint $timepoint The requested timepoint
     * @param string     $filename  The mri_upload basename
     */
    function __construct(\Timepoint $timepoint, string $filename)
    {
        parent::__construct(
            '
             SELECT
               m.UploadID as mri_upload_id,
               m.UploadedBy as uploaded_by,
               m.UploadDate as upload_date,
               m.UploadLocation as upload_location,
               m.DecompressedLocation as decompress_location,
               m.InsertionComplete as insertion_complete,
               m.Inserting as inserting,
               m.PatientName as patient_name,
               m.number_of_mincInserted as inserted_minc_count,
               m.number_of_mincCreated as created_minc_count,
               m.TarchiveID as tarchive_id,
               m.SessionID as session_id,
               m.IsCandidateInfoValidated as is_candidate_info_validated,
               m.IsTarchiveValidated as is_tarchive_validated,
               m.IsPhantom as is_phantom
             FROM
               mri_upload m
             WHERE
               m.SessionID = :v_sessionid AND
               m.UploadLocation LIKE :v_filename
            ',
            array(
             'v_sessionid' => $timepoint->getSessionID(),
             'v_filename'  => '%/' . $filename,
            )
        );
    }

    /**
     * Returns an instance of an Image object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return \LORIS\Data\Models\MRIUploadDTO::fromDBRow($row);
    }
}

