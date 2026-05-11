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
 * This represents a REDCap mapping between repeated instruments and events.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapRepeatingInstrumentEvent implements IRedcapInstrumentEvent
{
    /**
     * A REDCap unique event name.
     *
     * @var string
     */
    public readonly string $unique_event_name;

    /**
     * Redcap Form name.
     *
     * @var string
     */
    public readonly string $form_name;

    /**
     * If any, Custom form name.
     *
     * @var ?string
     */
    public readonly ?string $custom_label;

    /**
     * Constructor
     *
     * @param array $props The repeated instrument properties from redcap.
     */
    public function __construct(array $props)
    {
        $props = new RedcapProps('repeating_instrument', $props);

        $this->unique_event_name = $props->getString('event_name');
        $this->form_name         = $props->getString('form_name');
        $this->custom_label      = $props->getStringNullable('custom_form_label');
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
            'form_name'         => $this->form_name,
            'event_name'        => $this->unique_event_name,
            'custom_form_label' => $this->custom_label
        ];
    }
}
