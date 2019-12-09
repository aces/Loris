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
 * This class defines an MRIUploadDTO which is an immutable representation of
 * an MRIUpload object.
 *
 * @category Imaging
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class MRIUploadDTO implements \LORIS\Data\DataInstance
{
    private $mri_upload_id;
    private $uploaded_by;
    private $upload_date;
    private $upload_location;
    private $decompress_location;
    private $insertion_complete;
    private $inserting;
    private $patient_name;
    private $inserted_minc_count;
    private $created_minc_count;
    private $tarchive_id;
    private $session_id;
    private $is_candidate_info_validated;
    private $is_tarchive_validated;
    private $is_phantom;

    /**
     * Constructor
     *
     * @param int|null    $mri_upload_id               The UploadID
     * @param string|null $uploaded_by                 The UploadedBy
     * @param \DateTime   $upload_date                 The UploadDate
     * @param string|null $upload_location             The UploadLocation
     * @param string|null $decompress_location         The DecompressedLocation
     * @param bool|null   $insertion_complete          The InsertionComplete
     * @param bool|null   $inserting                   The Inserting
     * @param string|null $patient_name                The PatientName
     * @param int|null    $inserted_minc_count         The number_of_mincInserted
     * @param int|null    $created_minc_count          The number_of_mincCreated
     * @param int|null    $tarchive_id                 The TarchiveID
     * @param int|null    $session_id                  The SessionID
     * @param bool|null   $is_candidate_info_validated The IsCandidateInfoValidated
     * @param bool|null   $is_tarchive_validated       The IsTarchiveValidated
     * @param bool|null   $is_phantom                  The IsPhantom
     */
    public function __construct(
        ?int $mri_upload_id,
        ?string $uploaded_by,
        \DateTime $upload_date,
        ?string $upload_location,
        ?string $decompress_location,
        ?bool $insertion_complete,
        ?bool $inserting,
        ?string $patient_name,
        ?int $inserted_minc_count,
        ?int $created_minc_count,
        ?int $tarchive_id,
        ?int $session_id,
        ?bool $is_candidate_info_validated,
        ?bool $is_tarchive_validated,
        ?bool $is_phantom
    ) {
        $this->mri_upload_id       = $mri_upload_id;
        $this->uploaded_by         = $uploaded_by;
        $this->upload_date         = $upload_date;
        $this->upload_location     = $upload_location;
        $this->decompress_location = $decompress_location;
        $this->insertion_complete  = $insertion_complete ?? false;
        $this->inserting           = $inserting;
        $this->patient_name        = $patient_name;
        $this->inserted_minc_count = $inserted_minc_count;
        $this->created_minc_count  = $created_minc_count;
        $this->tarchive_id         = $tarchive_id;
        $this->session_id          = $session_id;
        $this->is_candidate_info_validated = $is_candidate_info_validated;
        $this->is_tarchive_validated       = $is_tarchive_validated ?? false;
        $this->is_phantom = $is_phantom ?? false;
    }

    /**
     * Helper function to instanciate an MRIUploadDTO object from a row in the
     * database .
     *
     * @param array $row A row from the mri_upload table.
     *
     * @return MRIUploadDTO
     */
    public static function fromDBRow(array $row): MRIUploadDTO
    {
        $nullOrBool = function ($val) {
            return is_null($val) ? null : boolval($val);
        };

        $nullOrInt = function ($val) {
            return is_null($val) ? null : intval($val);
        };

        return new MRIUploadDTO(
            intval($row['mri_upload_id']),
            $row['uploaded_by'],
            new \DateTime($row['upload_date']),
            $row['upload_location'],
            $row['decompress_location'],
            boolval($row['insertion_complete']),
            $nullOrBool($row['inserting']),
            $row['patient_name'],
            $nullOrInt($row['inserted_minc_count']),
            $nullOrInt($row['created_minc_count']),
            $nullOrInt($row['tarchive_id']),
            $nullOrInt($row['session_id']),
            $nullOrBool($row['is_candidate_info_validated']),
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
        return $this->mri_upload_id;
    }

    /**
     * Accessor for uploaded_by.
     *
     * @return string|null
     */
    public function getUploadedBy(): ?string
    {
        return $this->uploaded_by;
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
        return $this->upload_location;
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
