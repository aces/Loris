<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category Imaging
 * @package  Main
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Models;

/**
 * This class defines an MRIUploadDTO which is an immutable representation of
 * an MRIUpload object.
 *
 * @category Imaging
 * @package  Main
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class MRIUploadDTO implements \LORIS\Data\DataInstance
{
    private bool $insertion_complete;
    private bool $is_tarchive_validated;
    private bool $is_phantom;

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
        private ?int $mri_upload_id,
        private ?string $uploaded_by,
        private \DateTime $upload_date,
        private ?string $upload_location,
        private ?string $decompress_location,
        ?bool $insertion_complete,
        private ?bool $inserting,
        private ?string $patient_name,
        private ?int $inserted_minc_count,
        private ?int $created_minc_count,
        private ?int $tarchive_id,
        private ?int $session_id,
        private ?bool $is_candidate_info_validated,
        ?bool $is_tarchive_validated,
        ?bool $is_phantom
    ) {
        $this->insertion_complete    = $insertion_complete ?? false;
        $this->is_tarchive_validated = $is_tarchive_validated ?? false;
        $this->is_phantom            = $is_phantom ?? false;
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
        return $this->upload_date;
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
    public function toJSON(): string
    {
        return json_encode(get_object_vars($this));
    }

    /**
     * Implement the JsonSerializable interface by
     * converting to a string
     *
     * @return string
     */
    public function jsonSerialize() : string
    {
        return $this->toJSON();
    }
}
