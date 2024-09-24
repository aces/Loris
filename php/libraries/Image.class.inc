<?php declare(strict_types=1);
/**
 * File that describe the Image class
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
 * This class defines an Image and business logic related to Images.
 *
 * @category Imaging
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Image
{
    private $_fileid;

    private $_filename;

    private $_filelocation;

    private $_outputtype;

    private $_acquisitionprotocol;

    private $_filetype;

    private \CenterID $_centerid;

    private $_entitytype;

    /**
     * Constructor
     *
     * @param ?int $fileid This Image FileID
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
                       FileType as filetype,
                       s.CenterID as centerid,
                       c.Entity_type as entitytype
                     FROM
                       files f
                     LEFT JOIN session s
                       ON (f.SessionID = s.ID)
                     LEFT JOIN candidate c
                       ON (s.CandID = c.CandID)
                     LEFT JOIN mri_scan_type mst
                       ON (mst.ID = f.AcquisitionProtocolID)
                     WHERE f.FileID = :v_fileid
                    ',
                    ['v_fileid' => $fileid]
                );
            if (empty($dbrow)) {
                throw new \NotFound('There is no file with that FileID');
            }
            $this->_fileid       = $fileid;
            $this->_filename     = basename($dbrow['filelocation']);
            $this->_filelocation = $dbrow['filelocation'];
            $this->_outputtype   = $dbrow['outputtype'];
            $this->_acquisitionprotocol = $dbrow['acquisitionprotocol'];
            $this->_filetype            = $dbrow['filetype'];
            $this->_centerid            = $dbrow['centerid'] === null
            ? null
            : \CenterID::singleton($dbrow['centerid']);
            $this->_entitytype          = $dbrow['entitytype'];
        }
    }

    /**
     * Get a specific file header from paramter file
     *
     * @param string $headername The parameter name to retreive
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
                [
                    'v_fileid'     => $this->_fileid,
                    'v_headername' => $headername,
                ]
            );
        return $dbrow['Value'] ?? '';
    }

    /**
     * Get all headers from the parameter files tablei for that Image.
     *
     * @return array An associative array of {Name => Value}
     */
    public function getHeaders(): array
    {
        $dbrows = \NDB_Factory::singleton()
            ->database()
            ->pselect(
                '
                       SELECT
                         pt.Name as name,
                         pf.Value as value
                       FROM
                         parameter_file pf
                       JOIN parameter_type pt
                         USING (ParameterTypeID)
                       JOIN files f
                         USING (FileID)
                       WHERE
                         f.FileID = :v_fileid
                      ',
                ['v_fileid' => $this->_fileid]
            );
        return array_reduce(
            iterator_to_array($dbrows),
            function ($carry, $row) {
                $carry[$row['name']] = $row['value'];
                return $carry;
            },
            []
        );
    }

    /**
     * Get this image QC status from the database
     *
     * @return \LORIS\ImageQcStatus
     */
    public function getQcStatus(): \LORIS\ImageQcStatus
    {
        $qcstatus = null;
        $selected = null;

        $row = \NDB_Factory::singleton()->database()->pselectRow(
            'SELECT
               QCStatus as qcstatus,
               Selected as selected
             FROM
               files_qcstatus
             WHERE
               FileID = :v_fileid
            ',
            ['v_fileid' => $this->_fileid]
        );

        if (is_array($row)) {
            $qcstatus = $row['qcstatus'] ?? null;
            $selected = is_null($row['selected']) ? null : boolval($row['selected']);
        }

        return new \LORIS\ImageQcStatus($qcstatus, $selected);
    }

    /**
     * Update this image qc status in the database
     *
     * This is not handling the QCFirstChangeTime. That column and
     * QCLastChangeTime should be managed by `DEFAULT CURRENT_TIMESTAMP`
     * and `ON UPDATE CURRENT_TIMESTAMP` respectively
     *
     * @param \LORIS\ImageQcStatus $qcstatus The new values
     *
     * @throws \DatabaseException
     *
     * @return void
     */
    public function saveQcStatus(\LORIS\ImageQcStatus $qcstatus): void
    {
        $values = [
            'QCStatus'         => $qcstatus->getQcStatus(),
            'Selected'         => $qcstatus->isSelected() ? 'true' : 'false',
            'QCLastChangeTime' => time(),
            'FileID'           => $this->_fileid,
        ];

        \NDB_Factory::singleton()->database()->replace(
            'files_qcstatus',
            $values
        );
    }

    /**
     * Gets the caveats for that image
     *
     * @return \LORIS\ImageCaveats[]
     */
    public function getCaveats(): array
    {
        $rows = \NDB_Factory::singleton()->database()->pselect(
            'SELECT
               mvl.Severity as serverity,
               mvl.Header as header,
               mvl.Value as value,
               mvl.ValidRange as validrange,
               mvl.ValidRegex as validregex
             FROM
               files f
             LEFT JOIN mri_violations_log mvl
               ON (f.SeriesUID = mvl.SeriesUID)
             WHERE
               f.FileID = :v_fileid
            ',
            ['v_fileid' => $this->_fileid]
        );

        return array_map(
            function ($row) {
                $values = array_values($row);
                return new \LORIS\ImageCaveats(...$values);
            },
            iterator_to_array($rows)
        );
    }

    /**
     * Return a SPLFileInfo object based on this images's properties.
     *
     * @return \SplFileInfo
     */
    public function getFileInfo(): \SplFileInfo
    {
        return $this->_getFullPath($this->_filelocation);
    }

    /**
     * Return a SPLFileInfo object based on this images's properties.
     *
     * @return \SplFileInfo
     */
    public function getNiiFileInfo(): \SplFileInfo
    {
        return $this->_getFullPath($this->getHeader('check_nii_filename'));
    }

    /**
     * Return a SPLFileInfo object based on this images's properties.
     *
     * @return \SplFileInfo
     */
    public function getBvalFileInfo(): \SplFileInfo
    {
        return $this->_getFullPath($this->getHeader('check_bval_filename'));
    }

    /**
     * Return a SPLFileInfo object based on this images's properties.
     *
     * @return \SplFileInfo
     */
    public function getBvecFileInfo(): \SplFileInfo
    {
        return $this->_getFullPath($this->getHeader('check_bvec_filename'));
    }

    /**
     * Return a SPLFileInfo object based on this images's properties.
     *
     * @return \SplFileInfo
     */
    public function getBidsJsonFileInfo(): \SplFileInfo
    {
        return $this->_getFullPath($this->getHeader('bids_json_file'));
    }

    /**
     * Return a SPLFileInfo object based on this images's thumbnail properties.
     *
     * @return \SplFileInfo
     */
    public function getThumbnailFileInfo(): \SplFileInfo
    {
        $picfile = $this->getHeader('check_pic_filename');
        if (strpos($picfile, '://') !== false) {
            // It represents a URI, not a local path
            return new \SplFileInfo($picfile);
        }

        return $this->_getFullPath('/pic/'. $this->getHeader('check_pic_filename'));
    }

    /**
     * Returns the full path to the file after adding
     * imagePath if applicable.
     *
     * @param string $relpath The relative pathname
     *
     * @return \SplFileInfo
     */
    private function _getFullPath(string $relpath) : \SplFileInfo
    {
        if (strpos($relpath, '://') !== false) {
            // It represents a URI, not a local path
            return new \SplFileInfo($relpath);
        }
        $imagepath = \NDB_factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $relpath;

        return new \SplFileInfo($fullpath);
    }
    /**
     * Creates an immutable object representation of this Image
     *
     * @return \LORIS\Data\Models\ImageDTO
     */
    public function asDTO(): \LORIS\Data\Models\ImageDTO
    {
        return new \LORIS\Data\Models\ImageDTO(
            $this->_fileid,
            $this->_filename,
            $this->_filelocation,
            $this->_outputtype,
            $this->_acquisitionprotocol,
            $this->_filetype,
            $this->_centerid,
            $this->_entitytype
        );
    }
}
