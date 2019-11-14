<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 *  @category Recording
 *  @package  Main
 *  @author   Cecile Madjar <cecile.madjar@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

/**
 * RecordingElectrodes value object to allow one to type hint function's
 * parameters.
 *
 * @category Recording
 * @package  Main
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RecordingElectrodes
{
    /**
     * Contructor
     *
     * @param ?string $electrodename     Electrode Name
     * @param ?string $electrodetype     Electrode Type
     * @param ?string $electrodematerial Electrode Material
     * @param ?string $x                 X
     * @param ?string $y                 Y
     * @param ?string $z                 Z
     * @param ?string $impedance         Impedance
     * @param ?string $filepath          Electrodes BIDS File Path
     */
    public function __construct(
        ?string $electrodename,
        ?string $electrodetype,
        ?string $electrodematerial,
        ?string $x,
        ?string $y,
        ?string $z,
        ?string $impedance,
        ?string $filepath
    ) {
        $this->_electrodename     = $electrodename;
        $this->_electrodetype     = $electrodetype;
        $this->_electrodematerial = $electrodematerial;
        $this->_x         = $x;
        $this->_y         = $y;
        $this->_z         = $z;
        $this->_impedance = $impedance;
        $this->_filepath  = $filepath;
    }

    /**
     * Accessor for electrode name
     *
     * @return ?string
     */
    public function getElectrodeName(): ?string
    {
        return $this->_electrodename;
    }

    /**
     * Accessor for electrode type
     *
     * @return ?string
     */
    public function getElectrodeType(): ?string
    {
        return $this->_electrodetype;
    }

    /**
     * Accessor for electrode material
     *
     * @return ?string
     */
    public function getElectrodeMaterial(): ?string
    {
        return $this->_electrodematerial;
    }

    /**
     * Accessor for x
     *
     * @return ?string
     */
    public function getX(): ?string
    {
        return $this->_x;
    }

    /**
     * Accessor for y
     *
     * @return ?string
     */
    public function getY(): ?string
    {
        return $this->_y;
    }

    /**
     * Accessor for z
     *
     * @return ?string
     */
    public function getZ(): ?string
    {
        return $this->_z;
    }

    /**
     * Accessor for impedance
     *
     * @return ?string
     */
    public function getImpedance(): ?string
    {
        return $this->_impedance;
    }

    /**
     * Accessor for filepath
     *
     * @return \SplFileInfo
     */
    public function getFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_Factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_filepath;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }
}
