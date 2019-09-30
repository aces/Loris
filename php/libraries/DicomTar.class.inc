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
namespace LORIS;

use \LORIS\Data\Models\DicomTarDTO;
use \LORIS\Data\Models\DicomSeriesDTO;

/**
 * This class defines a DicomTar to allows one to type hint function's parameters.
 * An instance of DicomTar allow to access data related to a `tarchive` row and 
 * its related series.
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class DicomTar
{
    private $_tarchiveid;

    private $_tarname;

    private $_archivelocation;

    private $_patientname;

    /**
     * Constructor
     *
     * @param ?int $tarchiveid This DicomTar unique id
     */
    public function __construct(?int $tarchiveid)
    {
        if ($tarchiveid !== null) {
            $dbrow = \NDB_Factory::singleton()
                ->database()
                ->pselectRow(
                    '
                      SELECT
                        ArchiveLocation as archivelocation,
                        PatientName as patientname
                      FROM
                        tarchive
                      WHERE
                        TarchiveID = :v_tarchiveid
                    ',
                    array('v_tarchiveid' => $tarchiveid)
                );
            if (empty($dbrow)) {
                throw new \NotFound('There is no tarchive with that id');
            }
            $this->_tarchiveid      = $tarchiveid;
            $this->_tarname         = basename($dbrow['archivelocation']);
            $this->_archivelocation = $dbrow['archivelocation'];
            $this->_patientname     = $dbrow['patientname'];
        }
    }

    /**
     * Creates a imutable object representation of this tarchive.
     *
     * @return DicomTarDTO
     */
    public function asDTO(): DicomTarDTO
    {
        return new DicomTarDTO(
            $this->_tarchiveid ?? null,
            $this->_tarname ?? null,
            $this->_archivelocation ?? null,
            $this->_patientname ?? null,
            ...$this->getSeries()
        );
    }

    /**
     * Get this dicomtar series.
     *
     * @return DicomSeriesDTO[]
     */
    public function getSeries(): array
    {
        if ($this->_tarchiveid === null) {
            return array();
        }

        $dbrow = \NDB_Factory::singleton()
            ->database()
            ->pselect(
                '
                 SELECT
                   TarchiveSeriesID as id,
                   SeriesDescription as seriesdescription,
                   SeriesNumber as seriesnumber,
                   EchoTime as echotime,
                   RepetitionTime as repetitiontime,
                   InversionTime as inversiontime,
                   SliceThickness as slicethickness,
                   Modality as modality,
                   SeriesUID as seriesuid
                 FROM
                   tarchive_series
                 WHERE
                   TarchiveID = :v_tarchiveid
                ',
                array('v_tarchiveid' => $this->_tarchiveid)
            );

        return array_map(
            function ($row) {
                return new DicomSeriesDTO(
                    intval($row['id']),
                    $row['seriesdescription'],
                    intval($row['seriesnumber']),
                    $row['echotime'],
                    $row['repetitiontime'],
                    $row['inversiontime'],
                    $row['slicethickness'],
                    $row['modality'],
                    $row['seriesuid']
                );
            },
            $dbrow
        );
    }
}
