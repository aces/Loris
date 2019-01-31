<?php declare(strict_types=1);
/**
 * File describe the Image class
 *
 * PHP Version 7
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

/**
 * This class defines a Image to allows one to type hint function's parameters
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class Image
{
    private $_fileid;

    private $_filename;

    private $_filelocation;

    /**
     * Constructor
     *
     * @param ?int $fileid This File unique id
     */
    public function __construct(?int $fileid)
    {
        if ($fileid !== null) {
            $dbrow = \NDB_Factory::singleton()
                ->database()
                ->pselectRow(
                    '
                     SELECT
                       f.File as filelocation,
                       f.OutputType as outputtype,
                       mst.Scan_type as acquisitionprotocol,
                       FileType as filetype
                     FROM
                       files f 
                     JOIN mri_scan_type mst
                       ON (mst.ID=f.AcquisitionProtocolID)
                     WHERE f.FileID = :v_fileid
                    ',
                    array('v_fileid' => $fileid)
                );
            if (empty($dbrow)) {
                throw new \NotFound('There is no file with that id');
            }

            $this->_fileid       = $fileid;
            $this->_filename     = basename($dbrow['filelocation']);
            $this->_filelocation = $dbrow['filelocation'];
            $this->_outputtype   = $dbrow['outputtype'];
            $this->_acquisitionprotocol = $dbrow['acquisitionprotocol'];
            $this->_filetype            = $dbrow['filetype'];
        }
    }

    /**
     * Get file headers from paramter file
     *
     * @param string $headername $the parameter name to reteive
     *
     * @return string The value or an empty string
     */
    public function getHeader(string $headername): string
    {
        $dbrow = \NDB_Factory::singleton()
             ->database()
                ->pselectRow(
                    '
                       SELECT
                         Value
                       FROM
                         parameter_file pf 
                       JOIN parameter_type pt
                         USING (ParameterTypeID)
                       JOIN files f
                         USING (FileID)
                       WHERE
                         f.FileID = :v_fileid AND
                         pt.Name = :v_headername
                      ',
                    array(
                     'v_fileid'     => $this->_fileid,
                     'v_headername' => $headername,
                    )
                );
        return $dbrow['Value'] ?? '';
    }

    /**
     * Creates a imutable object representation of this tarchive
     *
     * @return \LORIS\ImageDTO
     */
    public function asDTO(): \LORIS\ImageDTO
    {
        return new \LORIS\ImageDTO(
            $this->_fileid,
            $this->_filename,
            $this->_filelocation,
            $this->_outputtype,
            $this->_acquisitionprotocol,
            $this->_filetype
        );
    }
}

/**
 * This class defines a ImageDTO which is an immutable representation of a
 * Image object.
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

    /**
     * Constructor
     *
     * @param ?int    $fileid              The FileID
     * @param ?string $filename            The image filename
     * @param ?string $filelocation        The image location
     * @param ?string $outputtype          The output type
     * @param ?string $acquisitionprotocol The aquisition protocol
     * @param ?string $filetype            The file type
     */
    public function __construct(
        ?int $fileid,
        ?string $filename,
        ?string $filelocation,
        ?string $outputtype,
        ?string $acquisitionprotocol,
        ?string $filetype
    ) {
        $this->_fileid       = $fileid;
        $this->_filename     = $filename;
        $this->_filelocation = $filelocation;
        $this->_outputtype   = $outputtype;
        $this->_acquisitionprotocol = $acquisitionprotocol;
        $this->_filetype            = $filetype;
    }

    /**
     * Accessor for fileid
     *
     * @return int
     */
    public function getFileid(): int
    {
        return $this->_fileid;
    }

    /**
     * METHODDESCRIPTION
     *
     * @access public
     * @return RETURNTYPE RETURNDESCRIPTION
     */
    public function getFilename()
    {
        return $this->_filename;
    }

    /**
     * METHODDESCRIPTION
     *
     * @access public
     * @return RETURNTYPE RETURNDESCRIPTION
     */
    public function getFilelocation()
    {
        return $this->_filelocation;
    }

    /**
     * METHODDESCRIPTION
     *
     * @access public
     * @return RETURNTYPE RETURNDESCRIPTION
     */
    public function getOutputtype()
    {
        return $this->_outputtype;
    }

    /**
     * METHODDESCRIPTION
     *
     * @access public
     * @return RETURNTYPE RETURNDESCRIPTION
     */
    public function getAcquisitionprotocol()
    {
        return $this->_acquisitionprotocol;
    }

    /**
     * METHODDESCRIPTION
     *
     * @access public
     * @return RETURNTYPE RETURNDESCRIPTION
     */
    public function getFiletype()
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
}

