<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Models;

/**
 * This class defines a MRIUploadDTO which is an immutable representation of a
 * MRIUpload object.
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class MRIUploadDTO implements \LORIS\Data\DataInstance
{
    private $_mri_upload_id;
    private $_uploaded_by;
    private $_upload_date;
    private $_upload_location;
    private $_decompress_location;
    private $_insertion_complete;
    private $_inserting;
    private $_patient_name;
    private $_inserted_minc_count;
    private $_created_minc_count;
    private $_tarchive_id;
    private $_session_id;
    private $_is_candidate_info_validated;
    private $_is_tarchive_validated;
    private $_is_phantom;

    /**
     * Constructor
     *
     * @param int|null mri_upload_id The UploadID
     * @param $uploaded_by The UploadedBy
     * @param $upload_date The UploadDate
     * @param $upload_location The UploadLocation
     * @param $decompress_location The DecompressedLocation
     * @param $insertion_complete The InsertionComplete
     * @param $inserting The Inserting
     * @param $patient_name The PatientName
     * @param int|null                                                 $inserted_minc_count The number_of_mincInserted
     * @param int|null                                                 $created_minc_count  The number_of_mincCreated
     * @param int|null                                                 $tarchive_id         The TarchiveID
     * @param int|null                                                 $session_id          The SessionID
     * @param $is_candidate_info_validated The IsCandidateInfoValidated
     * @param $is_tarchive_validated The IsTarchiveValidated
     * @param $is_phantom The IsPhantom
     */
    public function __construct(
        ?int $mri_upload_id,
        ?string $uploaded_by,
        \DateTime $upload_date,
        ?string $upload_location,
        ?string $decompress_location,
        ?bool $insertion_complete = false,
        ?bool $inserting,
        ?string $patient_name,
        ?int $inserted_minc_count,
        ?int $created_minc_count,
        ?int $tarchive_id,
        ?int $session_id,
        ?bool $is_candidate_info_validated,
        ?bool $is_tarchive_validated = false,
        ?bool $is_phantom = false
    ) {
        $this->_mri_upload_id       = $mri_upload_id;
        $this->_uploaded_by         = $uploaded_by;
        $this->_upload_date         = $upload_date;
        $this->_upload_location     = $upload_location;
        $this->_decompress_location = $decompress_location;
        $this->_insertion_complete  = $insertion_complete;
        $this->_inserting           = $inserting;
        $this->_patient_name        = $patient_name;
        $this->_inserted_minc_count = $inserted_minc_count;
        $this->_created_minc_count  = $created_minc_count;
        $this->_tarchive_id         = $tarchive_id;
        $this->_session_id          = $session_id;
        $this->_is_candidate_info_validated = $is_candidate_info_validated;
        $this->_is_tarchive_validated       = $is_tarchive_validated;
        $this->_is_phantom = $is_phantom;
    }

    public static function fromDBRow(array $row): MRIUploadDTO
    {
        return new MRIUploadDTO(
            intval($row['mri_upload_id']),
            $row['uploaded_by'],
            new \DateTime($row['upload_date']),
            $row['upload_location'],
            $row['decompress_location'],
            boolval($row['insertion_complete']),
            is_null($row['inserting']) ? null : boolval($row['inserting']),
            $row['patient_name'],
            is_null($row['inserted_minc_count']) ? null : intval($row['inserted_minc_count']),
            is_null($row['created_minc_count']) ? null : intval($row['created_minc_count']),
            is_null($row['tarchive_id']) ? null : intval($row['tarchive_id']),
            is_null($row['session_id']) ? null : intval($row['session_id']),
            is_null($row['is_candidate_info_validated']) ? null : boolval($row['is_candidate_info_validated']),
            boolval($row['is_tarchive_validated']),
            $row['is_phantom'] === 'Y'
        );
    }

    /**
     * Accessor for mri_upload_id.
     *
     * @return int|null
     */
    public function getUploadID(): ?int
    {
        return $this->_mri_upload_id;
    }

    /**
     * Accessor for uploaded_by.
     *
     * @return string|null
     */
    public function getUploadedBy(): ?string
    {
        return $this->_uploaded_by;
    }

    /**
     * Accessor for uploaded_date.
     *
     * @return \DateTime|null
     */
    public function getUploadedDate(): ?\DateTime
    {
        return $this->_uploaded_date;
    }

    /**
     * Accessor for upload_location.
     *
     * @return string|null
     */
    public function getUploadLocation(): ?string
    {
        return $this->_upload_location;
    }

    /**
     * DataInstances must be serializable to JSON.
     *
     * ToJSON must serialize this resource instance to a string of valid JSON.
     *
     * @return string of data in JSON format.
     */
    function toJSON(): string
    {
        return json_encode(get_object_vars($this));
    }
}
