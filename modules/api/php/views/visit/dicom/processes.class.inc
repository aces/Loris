<?php declare(strict_types=1);

/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views\Visit\Dicom;

/**
 * Creates an array representation of a server process.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Processes
{
    private \LORIS\LorisInstance $loris;
    private $_mriuploads;

    /**
     * Constructor
     *
     * @param \LORIS\LorisInstance              $loris      The LORIS Instance
     * @param \LORIS\Data\Models\MRIUploadDTO[] $mriuploads a list or MRIUploadDTO
     */
    public function __construct(\LORIS\LorisInstance $loris, array $mriuploads)
    {
        $this->loris       = $loris;
        $this->_mriuploads = $mriuploads;
    }

    /**
     * Creates a serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'MriUploads' => array_map(
                $this->_formatMRIUploads(...),
                $this->_mriuploads
            ),
        ];
    }

    /**
     * Mapper function that takes an MRIUploadDTO and return an array
     * representation of it.
     *
     * @param \LORIS\Data\Models\MRIUploadDTO $mriuploaddto An MRIUploadDTO object
     *
     * @return array
     */
    private function _formatMRIUploads(
        \LORIS\Data\Models\MRIUploadDTO $mriuploaddto
    ): array {
        $mriupload = new \MRIUpload($this->loris, $mriuploaddto->getUploadID());

        return [
            'MriUploadID' => $mriuploaddto->getUploadID(),
            'Processes'   => $mriupload->getProcesses(),
        ];
    }
}
