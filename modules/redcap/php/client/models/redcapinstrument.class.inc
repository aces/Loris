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

namespace LORIS\redcap\client\models;

use LORIS\redcap\client\RedcapProps;

/**
 * This represents a Redcap Instrument
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapInstrument
{
    /**
     * A REDCap instrument name.
     *
     * @var string
     */
    public readonly string $name;

    /**
     * A REDCap instrument label.
     *
     * @var string
     */
    public readonly string $label;

    /**
     * Constructor
     *
     * @param array $props The instrument properties from REDCap.
     */
    public function __construct(array $props)
    {
        $props = new RedcapProps('instrument', $props);

        $this->name  = $props->getString('instrument_name');
        $this->label = $props->getString('instrument_label');
    }

    /**
     * Props array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'instrument_name'  => $this->name,
            'instrument_label' => $this->label,
        ];
    }
}
