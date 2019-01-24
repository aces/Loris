<?php declare(strict_types=1);
/**
 * File implements the DicomTar class
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
 * This class defines a DicomTar to allows one to type hint function's parameters
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
                        SUBSTRING_INDEX(ArchiveLocation, "/", -1) as tarname,
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
            $this->_tarchiveid  = $tarchiveid;
            $this->_tarname     = $dbrow['tarname'];
            $this->_patientname = $dbrow['patientname'];
        }
    }

    /**
     * Creates a imutable object representation of this tarchive
     *
     * @return \LORIS\DicomTarDTO
     */
    public function asDTO(): \LORIS\DicomTarDTO
    {
        return new \LORIS\DicomTarDTO(
            $this->_tarchiveid ?? null,
            $this->_tarname ?? null,
            $this->_patientname ?? null,
            ...$this->getSeries()
        );
    }

    /**
     * Get this dicomtar series
     *
     * @return DicomSeries[]
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
                   SeriesDescription as description,
                   SeriesNumber as number,
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
                return new \LORIS\DicomSerieDTO(
                    intval($row['id']),
                    $row['description'],
                    intval($row['number']),
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

/**
 * This class defines a DicomTarDTO which is an immutable representation of a
 * DicomTar object.
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class DicomTarDTO implements \LORIS\Data\DataInstance
{
    private $_tarchiveid;

    private $_tarname;

    private $_patientname;

    private $_series;

    /**
     * Constructor
     *
     * @param ?int          $tarchiveid  The TarchiveID
     * @param ?string       $tarname     The dicom filename
     * @param ?string       $patientname The PatientName
     * @param DicomSerieDTO ...$series   An array of dicom series
     */
    public function __construct(
        ?int $tarchiveid,
        ?string $tarname,
        ?string $patientname,
        DicomSerieDTO ...$series
    ) {
        $this->_tarchiveid  = $tarchiveid;
        $this->_tarname     = $tarname;
        $this->_patientname = $patientname;
        $this->_series      = $series;
    }

    /**
     * Accessor for tarchiveid
     *
     * @return ?int|null
     */
    public function getTarchiveid(): ?int
    {
        return $this->_tarchiveid;
    }

    /**
     * Returns a new instance of this class with the new value
     *
     * @param int $tarchiveid The new tarchiveid
     *
     * @return DicomTarDTO
     */
    public function withTarchiveid($tarchiveid): DicomTarDTO
    {
        $new = clone($this);
        $new->_tarchiveid = $tarchiveid;
        return $new;
    }

    /**
     * Accessor for tarname
     *
     * @return string|null
     */
    public function getTarname(): ?string
    {
        return $this->_tarname;
    }

    /**
     * Returns a new instance of this class with the new value
     *
     * @param string $tarname The new tarname
     *
     * @return DicomTarDTO
     */
    public function withTarname($tarname): DicomTarDTO
    {
        $new           = clone($this);
        $new->_tarname = $tarname;
        return $new;
    }

    /**
     * Accessor for patientname
     *
     * @return string|null
     */
    public function getPatientname(): ?string
    {
        return $this->_patientname;
    }

    /**
     * Returns a new instance of this class with the new value
     *
     * @param string $patientname The new patientname
     *
     * @return DicomTarDTO
     */
    public function withPatientname(string $patientname): DicomTarDTO
    {
        $this->_patientname = $patientname;
    }

    /**
     * Accessor for series
     *
     * @return DicomSerieDTO[]
     */
    public function getSeries(): array
    {
        return $this->_series;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface
     *
     * @return string
     */
    public function toJSON() : string
    {
        $series = array_map(
            function ($item) {
                return $item->toArray();
            },
            $this->_series
        );

        return json_encode(
            array(
             'tarchiveid'  => $this->_tarchiveid,
             'tarname'     => $this->_tarname,
             'patientname' => $this->_patientname,
             'series'      => $series,
            )
        );
    }
}
/**
 * This class defines a DicomTarSerieDTO which is an immutable representation of a
 * Dicom series object.
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class DicomSerieDTO
{
    private $_id;

    private $_description;

    private $_number;

    private $_echotime;

    private $_repetitiontime;

    private $_inversiontime;

    private $_slicethickness;

    private $_modality;

    private $_seriesuid;

    /**
     * Constructor
     *
     * @param ?int    $id             The TarchiveSeriesID
     * @param ?string $description    The SeriesDescription
     * @param ?int    $number         The SeriesNumber
     * @param ?float  $echotime       The EchoTime
     * @param ?float  $repetitiontime The RepetitionTime
     * @param ?float  $inversiontime  The InversionTime
     * @param ?float  $slicethickness The SliceThickness
     * @param ?string $modality       The Modality
     * @param ?string $seriesuid      The SeriesUID
     */
    public function __construct(
        ?int    $id,
        ?string $description,
        ?int    $number,
        ?string $echotime,
        ?string $repetitiontime,
        ?string $inversiontime,
        ?string $slicethickness,
        ?string $modality,
        ?string $seriesuid
    ) {
        $this->_id          = $id;
        $this->_description = $description;
        $this->_number      = $number;
        $this->_echotime    = $echotime;
        $this->_repetitiontime = $repetitiontime;
        $this->_inversiontime  = $inversiontime;
        $this->_slicethickness = $slicethickness;
        $this->_modality       = $modality;
        $this->_seriesuid      = $seriesuid;
    }

    /**
     * Accessor for id
     *
     * @return ?int
     */
    public function getId()
    {
        return $this->_id;
    }

    /**
     * Accessor for description
     *
     * @return ?string
     */
    public function getDescription()
    {
        return $this->_description;
    }

    /**
     * Accessor for number
     *
     * @return ?int
     */
    public function getNumber()
    {
        return $this->_number;
    }

    /**
     * Accessor for echotime
     *
     * @return ?string
     */
    public function getEchotime()
    {
        return $this->_echotime;
    }

    /**
     * Accessor for repetitiontime
     *
     * @return ?string
     */
    public function getRepetitiontime()
    {
        return $this->_repetitiontime;
    }

    /**
     * Accessor for invertiontime
     *
     * @return ?string
     */
    public function getInversiontime()
    {
        return $this->_inversiontime;
    }

    /**
     * Accessor for slicethickness
     *
     * @return ?string
     */
    public function getSlicethickness()
    {
        return $this->_slicethickness;
    }

    /**
     * Accessor for modality
     *
     * @return ?string
     */
    public function getModality()
    {
        return $this->_modality;
    }

    /**
     * Accessor for seriesuid
     *
     * @return ?string
     */
    public function getSeriesuid()
    {
        return $this->_seriesuid;
    }

    /**
     * Returns an array representation of this
     *
     * @return array the series data.
     */
    public function toArray(): array
    {
        return array(
                'id'             => $this->_id,
                'description'    => $this->_description,
                'number'         => $this->_number,
                'echotime'       => $this->_echotime,
                'repetitiontime' => $this->_repetitiontime,
                'inversiontime'  => $this->_inversiontime,
                'slicethickness' => $this->_slicethickness,
                'modality'       => $this->_modality,
                'seriesuid'      => $this->_seriesuid,
               );
    }

}

