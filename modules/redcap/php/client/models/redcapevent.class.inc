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
 * This represents a redcap event.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapEvent
{
    /**
     * The REDCap event ID.
     *
     * @var int
     */
    public readonly int $id;

    /**
     * The REDCap event name.
     *
     * @var string
     */
    public readonly string $name;

    /**
     * The REDCap unique event name. This is usually the event name concatenated
     * with the arm number.
     *
     * @var string
     */
    public readonly string $unique_name;

    /**
     * The REDCap arm number.
     *
     * @var int
     */
    public readonly int $arm_number;

    /**
     * The REDCap custom event name, if any.
     *
     * @var string
     */
    public readonly ?string $custom_label;

    /**
     * Constructor
     *
     * @param array $props The event properties from redcap.
     */
    public function __construct(array $props)
    {
        $props = new RedcapProps('event', $props);

        $this->id           = $props->getInt('event_id');
        $this->arm_number   = $props->getInt('arm_num');
        $this->name         = $props->getString('event_name');
        $this->unique_name  = $props->getString('unique_event_name');
        $this->custom_label = $props->getStringNullable('custom_event_label');
    }

    /**
     * Props array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'event_id'           => $this->id,
            'event_name'         => $this->arm_number,
            'arm_num'            => $this->name,
            'unique_event_name'  => $this->unique_name,
            'custom_event_label' => $this->custom_label,
        ];
    }
}
