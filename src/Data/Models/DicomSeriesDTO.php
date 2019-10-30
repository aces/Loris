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
    private $_seriesid;

    private $_seriesdescription;

    private $_seriesnumber;

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
        $this->_seriesid          = $id;
        $this->_seriesdescription = $description;
        $this->_seriesnumber      = $number;
        $this->_echotime          = $echotime;
        $this->_repetitiontime    = $repetitiontime;
        $this->_inversiontime     = $inversiontime;
        $this->_slicethickness    = $slicethickness;
        $this->_modality          = $modality;
        $this->_seriesuid         = $seriesuid;
    }

    /**
     * Accessor for id
     *
     * @return ?int
     */
    public function getTarchiveSeriesID()
    {
        return $this->_seriesid;
    }

    /**
     * Accessor for seriesdescription
     *
     * @return ?string
     */
    public function getSeriesDescription()
    {
        return $this->_seriesdescription;
    }

    /**
     * Accessor for seriesnumber
     *
     * @return ?int
     */
    public function getSeriesNumber()
    {
        return $this->_seriesnumber;
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
     * Accessor for inversiontime
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
                'id'             => $this->_seriesid,
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

