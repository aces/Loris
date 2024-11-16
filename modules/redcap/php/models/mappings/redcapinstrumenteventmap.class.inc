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
 * This represents a REDCap mapping between instruments and events
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapInstrumentEventMap extends RedcapProp
{
    /**
     * Redcap Arm num.
     *
     * @var int
     */
    private int $_arm_num;

    /**
     * Redcap Unique Event name.
     *
     * @var string
     */
    private string $_unique_event_name;

    /**
     * Redcap form name.
     *
     * @var string
     */
    private string $_form_name;

    /**
     * Constructor
     *
     * @param array $props The properties from redcap.
     */
    public function __construct(array $props)
    {
        $propType = 'instrument_event_mapping';
        $expectedProps = [
            'arm_num',
            'unique_event_name',
            'form'
        ];
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'arm_num');
        self::checkPropIsNotNull($props, $propType, 'unique_event_name');
        self::checkPropIsNotNull($props, $propType, 'form');

        $this->_arm_num           = intval($props['arm_num']);
        $this->_unique_event_name = $props['unique_event_name'];
        $this->_form_name         = $props['form'];
    }

    /**
     * Get Arm num.
     *
     * @return int
     */
    public function getArmNum(): int
    {
        return $this->_arm_num;
    }

    /**
     * Get unique event name.
     *
     * @return string
     */
    public function getEventName(): string
    {
        return $this->_unique_event_name;
    }

    /**
     * Get form name.
     *
     * @return string
     */
    public function getFormName(): string
    {
        return $this->_form_name;
    }

    /**
     * Get an array representation.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'arm_num'           => $this->_arm_num,
            'unique_event_name' => $this->_unique_event_name,
            'form'              => $this->_form_name,
        ];
    }
}