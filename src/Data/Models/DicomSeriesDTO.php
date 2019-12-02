<?php declare(strict_types=1);
/**
 * File implements the DicomSeriesDTO class
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
 * This class defines a DicomTarSerieDTO which is an immutable representation of a
 * Dicom series object.
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class DicomSeriesDTO
{
    private $seriesid;

    private $seriesdescription;

    private $seriesnumber;

    private $echotime;

    private $repetitiontime;

    private $inversiontime;

    private $slicethickness;

    private $modality;

    private $seriesuid;

    /**
     * Constructor
     *
     * @param ?int    $id             The TarchiveSeriesID
     * @param ?string $description    The SeriesDescription
     * @param ?int    $number         The SeriesNumber
     * @param ?string $echotime       The EchoTime
     * @param ?string $repetitiontime The RepetitionTime
     * @param ?string $inversiontime  The InversionTime
     * @param ?string $slicethickness The SliceThickness
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
        $this->seriesid          = $id;
        $this->seriesdescription = $description;
        $this->seriesnumber      = $number;
        $this->echotime          = $echotime;
        $this->repetitiontime    = $repetitiontime;
        $this->inversiontime     = $inversiontime;
        $this->slicethickness    = $slicethickness;
        $this->modality          = $modality;
        $this->seriesuid         = $seriesuid;
    }

    /**
     * Accessor for id
     *
     * @return ?int
     */
    public function getTarchiveSeriesID()
    {
        return $this->seriesid;
    }

    /**
     * Accessor for seriesdescription
     *
     * @return ?string
     */
    public function getSeriesDescription()
    {
        return $this->seriesdescription;
    }

    /**
     * Accessor for seriesnumber
     *
     * @return ?int
     */
    public function getSeriesNumber()
    {
        return $this->seriesnumber;
    }

    /**
     * Accessor for echotime
     *
     * @return ?string
     */
    public function getEchotime()
    {
        return $this->echotime;
    }

    /**
     * Accessor for repetitiontime
     *
     * @return ?string
     */
    public function getRepetitiontime()
    {
        return $this->repetitiontime;
    }

    /**
     * Accessor for inversiontime
     *
     * @return ?string
     */
    public function getInversiontime()
    {
        return $this->inversiontime;
    }

    /**
     * Accessor for slicethickness
     *
     * @return ?string
     */
    public function getSlicethickness()
    {
        return $this->slicethickness;
    }

    /**
     * Accessor for modality
     *
     * @return ?string
     */
    public function getModality()
    {
        return $this->modality;
    }

    /**
     * Accessor for seriesuid
     *
     * @return ?string
     */
    public function getSeriesuid()
    {
        return $this->seriesuid;
    }
    /**
     * Returns an array representation of this
     *
     * @return array the series data.
     */
    public function toArray(): array
    {
        return array(
                'id'             => $this->seriesid,
                'description'    => $this->description,
                'number'         => $this->number,
                'echotime'       => $this->echotime,
                'repetitiontime' => $this->repetitiontime,
                'inversiontime'  => $this->inversiontime,
                'slicethickness' => $this->slicethickness,
                'modality'       => $this->modality,
                'seriesuid'      => $this->seriesuid,
               );
    }
}
