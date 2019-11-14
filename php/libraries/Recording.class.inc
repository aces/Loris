<?php declare(strict_types=1);
/**
 * File that describe the Recording class
 *
 * PHP Version 7
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Cecile Madjar <cecile.madjar@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

/**
 * This class defines a Recording and business logic related to Recordings.
 *
 * @category Imaging
 * @package  Main
 *  @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Recording
{
    private $_fileid;

    private $_filename;

    private $_filelocation;

    private $_outputtype;

    private $_acquisitionmodality;

    private $_filetype;

    private $_centerid;

    private $_entitytype;

    /**
     * Constructor
     *
     * @param ?int $fileid This Recording FileID
     */
    public function __construct(?int $fileid)
    {
        if ($fileid !== null) {
            $dbrow = \NDB_Factory::singleton()
                ->database()
                ->pselectRow(
                    '
                     SELECT
                       f.FilePath as filelocation,
                       pot.OutputTypeName as outputtype,
                       pm.PhysiologicalModality as acquisitionmodality,
                       FileType as filetype,
                       s.CenterID as centerid,
                       c.Entity_type as entitytype
                     FROM
                       physiological_file f 
                     LEFT JOIN session s
                       ON (f.SessionID = s.ID)
                     LEFT JOIN candidate c
                       ON (s.CandID = c.CandID)
                     LEFT JOIN  physiological_output_type pot
                       ON (pot.PhysiologicalOutputTypeID = f.PhysiologicalOutputTypeID)
                     LEFT JOIN physiological_modality pm
                       ON (pm.PhysiologicalModalityID = f.PhysiologicalModalityID)
                     WHERE f.PhysiologicalFileID = :v_fileid
                    ',
                    array('v_fileid' => $fileid)
                );
            if (empty($dbrow)) {
                throw new \NotFound('There is no file with that FileID');
            }
            $this->_fileid       = $fileid;
            $this->_filename     = basename($dbrow['filelocation']);
            $this->_filelocation = $dbrow['filelocation'];
            $this->_outputtype   = $dbrow['outputtype'];
            $this->_acquisitionmodality = $dbrow['acquisitionmodality'];
            $this->_filetype            = $dbrow['filetype'];
            $this->_centerid            = (int) $dbrow['centerid'];
            $this->_entitytype          = $dbrow['entitytype'];
        }
    }

    /**
     * Get a specific file header from physiological_parameter file
     *
     * @param string $headername The parameter name to retrieve
     *
     * @return string The value or an empty string
     */
    public function getMetadata(string $headername): string
    {
        $dbrow = \NDB_Factory::singleton()
            ->database()
            ->pselectRow(
                '
                       SELECT
                         Value
                       FROM
                         physiological_parameter_file pf 
                       JOIN parameter_type pt
                         USING (ParameterTypeID)
                       JOIN physiological_file f
                         USING (PhysiologicalFileID)
                       WHERE
                         f.PhysiologicalFileID = :v_fileid AND
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
     * Get all headers.class from the physiological_parameter files table for that Recording.
     *
     * @return array An associative array of {Name => Value}
     */
    public function getAllMetadata(): array
    {
        $dbrows = \NDB_Factory::singleton()
            ->database()
            ->pselect(
                '
                       SELECT
                         pt.Name as name,
                         pf.Value as value
                       FROM
                         physiological_parameter_file pf 
                       JOIN parameter_type pt
                         USING (ParameterTypeID)
                       JOIN physiological_file f
                         USING (PhysiologicalFileID)
                       WHERE
                         f.PhysiologicalFileID = :v_fileid
                      ',
                array('v_fileid' => $this->_fileid)
            );
        return array_reduce(
            $dbrows,
            function ($carry, $row) {
                $carry[$row['name']] = $row['value'];
                return $carry;
            },
            array()
        );
    }

    /**
     * Return a SPLFileInfo object based on this recording's properties.
     *
     * @return \SplFileInfo
     */
    public function getFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_filelocation;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }

    /**
     * Creates an immutable object representation of this Image
     *
     * @return \LORIS\Data\Models\ImageDTO
     */
    public function asDTO(): \LORIS\Data\Models\RecordingDTO
    {
        return new \LORIS\Data\Models\RecordingDTO(
            $this->_fileid,
            $this->_filename,
            $this->_filelocation,
            $this->_outputtype,
            $this->_acquisitionmodality,
            $this->_filetype,
            $this->_centerid,
            $this->_entitytype
        );
    }
}