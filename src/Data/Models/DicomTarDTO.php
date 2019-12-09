<?php declare(strict_types=1);
/**
 * File implements the DicomTarDTO class
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
    private $tarchiveid;

    private $tarname;

    private $archivelocation;

    private $patientname;

    private $series;

    /**
     * Constructor
     *
     * @param ?int            $tarchiveid      The TarchiveID
     * @param ?string         $tarname         The dicom filename
     * @param ?string         $archivelocation The dicom file location
     * @param ?string         $patientname     The PatientName
     * @param ?DicomSeriesDTO ...$series       An array of dicom series
     */
    public function __construct(
        ?int $tarchiveid,
        ?string $tarname,
        ?string $archivelocation,
        ?string $patientname,
        ?DicomSeriesDTO ...$series
    ) {
        $this->tarchiveid      = $tarchiveid;
        $this->tarname         = $tarname;
        $this->archivelocation = $archivelocation;
        $this->patientname     = $patientname;
        $this->series          = $series;
    }

    /**
     * Accessor for tarname
     *
     * @return string|null
     */
    public function getTarname(): ?string
    {
        return $this->tarname;
    }
    /**
     * Accessor for ArchiveLocation
     *
     * @return string|null
     */
    public function getArchiveLocation(): ?string
    {
        return $this->archivelocation;
    }

    /**
     * Accessor for patientname
     *
     * @return string|null
     */
    public function getPatientname(): ?string
    {
        return $this->patientname;
    }

    /**
     * Accessor for series
     *
     * @return DicomSeriesDTO[]|null
     */
    public function getSeries(): ?array
    {
        return $this->series;
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
            $this->series
        );

        return json_encode(
            array(
             'tarchiveid'  => $this->tarchiveid,
             'tarname'     => $this->tarname,
             'patientname' => $this->patientname,
             'series'      => $series,
            )
        );
    }
}
