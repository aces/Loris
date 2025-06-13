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

namespace LORIS\redcap\client\models\mappings;

use LORIS\redcap\client\RedcapProps;

/**
 * This represents a REDCap mapping between instruments and events
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapInstrumentEventMap implements IRedcapInstrumentEvent
{
    /**
     * A REDCap arm number.
     *
     * @var int
     */
    public readonly int $arm_number;

    /**
     * A REDCap unique event name.
     *
     * @var string
     */
    public readonly string $unique_event_name;

    /**
     * A REDCap form name.
     *
     * @var string
     */
    public readonly string $form_name;

    /**
     * Constructor
     *
     * @param array $props The properties from redcap.
     */
    public function __construct(array $props)
    {
        $props = new RedcapProps('instrument_event_mapping', $props);

        $this->arm_number        = $props->getInt('arm_num');
        $this->unique_event_name = $props->getString('unique_event_name');
        $this->form_name         = $props->getString('form');
    }

    /**
     * Get the REDCap unique event name.
     *
     * @return string
     */
    public function getUniqueEventName(): string
    {
        return $this->unique_event_name;
    }

    /**
     * Get the REDCap form name.
     *
     * @return string
     */
    public function getFormName(): string
    {
        return $this->form_name;
    }

    /**
     * Get an array representation.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'arm_num'           => $this->arm_number,
            'unique_event_name' => $this->unique_event_name,
            'form'              => $this->form_name,
        ];
    }
}
