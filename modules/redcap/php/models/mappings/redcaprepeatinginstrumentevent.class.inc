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

namespace LORIS\redcap\models\mappings;

use LORIS\redcap\models\RedcapProp;

/**
 * This represents a REDCap mapping between repeated instruments and events.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapRepeatingInstrumentEvent extends RedcapProp
{
    /**
     * Redcap Event name.
     * This is linked to a UNIQUE event name.
     *
     * @var string
     */
    private string $_event_name;

    /**
     * Redcap Form name.
     *
     * @var string
     */
    private string $_form_name;

    /**
     * If any, Custom form name.
     *
     * @var string|null
     */
    private ?string $_custom_label;


    /**
     * Constructor
     *
     * @param array $props The repeated instrument properties from redcap.
     */
    public function __construct(array $props)
    {
        $propType      = 'repeating_instrument';
        $expectedProps = [
            'form_name',
            'event_name',
            'custom_form_label',
        ];
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'form_name');
        self::checkPropIsNotNull($props, $propType, 'event_name');

        $this->_event_name   = $props['event_name'];
        $this->_form_name    = $props['form_name'];
        $this->_custom_label = $props['custom_form_label'];
    }

    /**
     * Get the Unique Event name.
     *
     * @return string
     */
    public function getEventName(): string
    {
        return $this->_event_name;
    }

    /**
     * Get Form name.
     *
     * @return string
     */
    public function getFormName(): string
    {
        return $this->_form_name;
    }

    /**
     * Get Custom Form name.
     *
     * @return string|null
     */
    public function getCustomFormName(): ?string
    {
        return $this->_custom_label;
    }

    /**
     * Get an array representation.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'form_name'         => $this->_form_name,
            'event_name'        => $this->_event_name,
            'custom_form_label' => $this->_custom_label
        ];
    }
}