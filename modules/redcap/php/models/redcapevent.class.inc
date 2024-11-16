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
 * This represents a redcap event.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapEvent extends RedcapProp
{

    /**
     * Redcap Event ID.
     *
     * @var int
     */
    private int $_id;

    /**
     * Redcap event name.
     *
     * @var string
     */
    private string $_name;

    /**
     * Redcap Arm number.
     *
     * @var int
     */
    private int $_arm_num;

    /**
     * Concatenates the event name and arm number.
     *
     * @var string
     */
    private string $_unique_name;

    /**
     * If any, custom Redcap Event name.
     *
     * @var string
     */
    private string $_custom_label;

    /**
     * Constructor
     *
     * @param array $props The event properties from redcap.
     */
    public function __construct(array $props)
    {
        $propType      = 'event';
        $expectedProps = [
            'event_id',
            'event_name',
            'arm_num',
            'unique_event_name',
            'custom_event_label',
        ];
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'event_id');
        self::checkPropIsNotNull($props, $propType, 'event_name');
        self::checkPropIsNotNull($props, $propType, 'arm_num');

        // check unique event name
        // format should be: "<event_name>_arm_<arm_num>"
        $tmpUniqueEvent = strtolower(
            $props['event_name'] . "_arm_" . $props['arm_num']
        );
        if ($props['unique_event_name'] !== $tmpUniqueEvent) {
            throw new \LorisException(
                "[redcap:event] 'unique_event_name' format, expected "
                . "'$tmpUniqueEvent' found " . $props['unique_event_name']
            );
        }

        $this->_id           = intval($props['event_id']);
        $this->_arm_num      = intval($props['arm_num']);
        $this->_name         = $props['event_name'];
        $this->_unique_name  = $props['unique_event_name'];
        $this->_custom_label = $props['custom_event_label'] ?? '';
    }

    /**
     * Get Event ID.
     *
     * @return int
     */
    public function getId(): int
    {
        return $this->_id;
    }

    /**
     * Get Arm value
     *
     * @return int
     */
    public function getArmNum(): int
    {
        return $this->_arm_num;
    }

    /**
     * Get Event name.
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->_name;
    }

    /**
     * Get Event Unique name.
     *
     * @return string
     */
    public function getEventUniqueName(): string
    {
        return $this->_unique_name;
    }

    /**
     * Get custom label.
     *
     * @return string
     */
    public function getCustomLabel(): string
    {
        return $this->_custom_label;
    }

    /**
     * Props array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'event_id'           => $this->_id,
            'event_name'         => $this->_arm_num,
            'arm_num'            => $this->_name,
            'unique_event_name'  => $this->_unique_name,
            'custom_event_label' => $this->_custom_label,
        ];
    }
}