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

    private $_fileid;

    private $_filename;

    private $_filelocation;

    private $_outputtype;

    private $_acquisitionprotocol;

    private $_filetype;

    private $_centerid;

    private $_entitytype;

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
        $this->_fileid       = $fileid;
        $this->_filename     = $filename;
        $this->_filelocation = $filelocation;
        $this->_outputtype   = $outputtype;
        $this->_acquisitionprotocol = $acquisitionprotocol;
        $this->_filetype            = $filetype;
        $this->_centerid            = $centerid;
        $this->_entitytype          = $entitytype;
    }

    /**
     * Accessor for fileid.
     *
     * @return ?int
     */
    public function getFileid(): ?int
    {
        return $this->_fileid;
    }

    /**
     * Accessor for filename.
     *
     * @return ?string
     */
    public function getFilename(): ?string
    {
        return $this->_filename;
    }

    /**
     * Accessor for filelocation.
     *
     * @return ?string
     */
    public function getFilelocation(): ?string
    {
        return $this->_filelocation;
    }

    /**
     * Accessor for outputtype.
     *
     * @return ?string
     */
    public function getOutputtype(): ?string
    {
        return $this->_outputtype;
    }

    /**
     * Accessor for acquisitionprotocol.
     *
     * @return ?string
     */
    public function getAcquisitionprotocol(): ?string
    {
        return $this->_acquisitionprotocol;
    }

    /**
     * Accessor for filetype.
     *
     * @return ?string
     */
    public function getFiletype(): ?string
    {
        return $this->_filetype;
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
             'fileid'              => $this->_tarchiveid,
             'filename'            => $this->_tarname,
             'filelocation'        => $this->_filelocation,
             'outputtype'          => $this->_outputtype,
             'acquisitionprotocol' => $this->_acquisitionprotocol,
             'filetype'            => $this->_filetype,
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
        return intval($this->_centerid);
    }

    /**
     * This tells is the image is a phantom.
     *
     * @return bool True is the Entity_type is a scanner
     */
    public function isPhantom(): bool
    {
        return $this->_entitytype === 'Scanner';
    }

}

