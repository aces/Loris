<?php declare(strict_types=1);
/**
 * File that describe the ImageDTO class
 *
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
 * This class defines an ImageDTO which is an immutable representation of a
 * Image object. Its purpose is to provide accessors to an Image properties.
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class ImageDTO implements \LORIS\Data\DataInstance
{

    private $fileid;

    private $filename;

    private $filelocation;

    private $outputtype;

    private $acquisitionprotocol;

    private $filetype;

    private $centerid;

    private $entitytype;

    /**
     * Constructor
     *
     * @param ?int    $fileid              The FileID
     * @param ?string $filename            The image filename
     * @param ?string $filelocation        The image location
     * @param ?string $outputtype          The output type
     * @param ?string $acquisitionprotocol The aquisition protocol
     * @param ?string $filetype            The file type
     * @param ?int    $centerid            The image session's centerid
     * @param ?string $entitytype          The image candidate's entity_type
     */
    public function __construct(
        ?int $fileid,
        ?string $filename,
        ?string $filelocation,
        ?string $outputtype,
        ?string $acquisitionprotocol,
        ?string $filetype,
        ?int $centerid,
        ?string $entitytype
    ) {
        $this->fileid       = $fileid;
        $this->filename     = $filename;
        $this->filelocation = $filelocation;
        $this->outputtype   = $outputtype;
        $this->acquisitionprotocol = $acquisitionprotocol;
        $this->filetype            = $filetype;
        $this->centerid            = $centerid;
        $this->entitytype          = $entitytype;
    }

    /**
     * Accessor for fileid.
     *
     * @return ?int
     */
    public function getFileid(): ?int
    {
        return $this->fileid;
    }

    /**
     * Accessor for filename.
     *
     * @return ?string
     */
    public function getFilename(): ?string
    {
        return $this->filename;
    }

    /**
     * Accessor for filelocation.
     *
     * @return ?string
     */
    public function getFilelocation(): ?string
    {
        return $this->filelocation;
    }

    /**
     * Accessor for outputtype.
     *
     * @return ?string
     */
    public function getOutputtype(): ?string
    {
        return $this->outputtype;
    }

    /**
     * Accessor for acquisitionprotocol.
     *
     * @return ?string
     */
    public function getAcquisitionprotocol(): ?string
    {
        return $this->acquisitionprotocol;
    }

    /**
     * Accessor for filetype.
     *
     * @return ?string
     */
    public function getFiletype(): ?string
    {
        return $this->filetype;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface
     *
     * @return string
     */
    public function toJSON() : string
    {
        return json_encode(
            array(
             'fileid'              => $this->tarchiveid,
             'filename'            => $this->tarname,
             'filelocation'        => $this->filelocation,
             'outputtype'          => $this->outputtype,
             'acquisitionprotocol' => $this->acquisitionprotocol,
             'filetype'            => $this->filetype,
            )
        );
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        return intval($this->centerid);
    }

    /**
     * This tells is the image is a phantom.
     *
     * @return bool True is the Entity_type is a scanner
     */
    public function isPhantom(): bool
    {
        return $this->entitytype === 'Scanner';
    }
}
