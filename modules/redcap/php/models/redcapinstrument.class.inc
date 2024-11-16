<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\models;

use LORIS\redcap\models\RedcapProp;

/**
 * This represents a Redcap Instrument
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapInstrument extends RedcapProp
{

    /**
     * Redcap instrument num.
     *
     * @var string
     */
    private string $_name;

    /**
     * Redcap instrument label.
     *
     * @var string
     */
    private string $_label;

    /**
     * Constructor
     *
     * @param array $props The instrument properties from redcap.
     */
    public function __construct(array $props)
    {
        $propType = 'instrument';
        $expectedProps = [
            'instrument_name',
            'instrument_label'
        ];
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'instrument_name');
        self::checkPropIsNotNull($props, $propType, 'instrument_label');

        $this->_name  = $props['instrument_name'];
        $this->_label = $props['instrument_label'];
    }

    /**
     * Get instrument name
     *
     * @return string
     */
    public function getInstrumentName(): string
    {
        return $this->_name;
    }

    /**
     * Get instrument label
     *
     * @return string
     */
    public function getInstrumentLabel(): string
    {
        return $this->_label;
    }

    /**
     * Props array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'instrument_name'  => $this->_name,
            'instrument_label' => $this->_label,
        ];
    }
}