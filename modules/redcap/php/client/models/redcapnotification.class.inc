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

/**
 * This reprensents a redcap notification.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapNotification
{
    public readonly \DateTimeInterface $received_datetime;
    public readonly string $instance_url;
    public readonly string $project_url;
    public readonly string $project_id;
    public readonly string $instrument_name;
    public readonly string $record_id;
    public readonly string $unique_event_name;
    public readonly string $username;
    public readonly string $complete;

    /**
     * Constructor
     *
     * @param array              $props             The notification properties
     *                                              typically from REDCap.
     * @param \DateTimeInterface $received_datetime The time at which the REDCap
     *                                              notification has been received.
     */
    public function __construct(array $props, \DateTimeInterface $received_datetime)
    {
        $requiredprops = [
            'instrument',
            'project_id',
            'project_url',
            'record',
            'redcap_event_name',
            'redcap_url',
            'username',
        ];

        // Make sure all the required properties exists
        foreach ($requiredprops as $required) {
            if (empty($props[$required] ?? null)) {
                throw new \UnexpectedValueException(
                    "[redcap] Error: missing property $required"
                );
            }
        }

        // ${instrument}_complete is required as well.
        $complete_key = $props['instrument'] . '_complete';
        if (!isset($props[$complete_key])) {
            throw new \UnexpectedValueException(
                "[redcap] Error: missing property $complete_key"
            );
        }

        $this->received_datetime = $received_datetime;
        $this->instrument_name   = $props['instrument'];
        $this->project_id        = $props['project_id'];
        $this->project_url       = $props['project_url'];
        $this->record_id         = $props['record'];
        $this->unique_event_name = $props['redcap_event_name'];
        $this->instance_url      = $props['redcap_url'];
        $this->complete          = $props[$complete_key] ?? '';
        $this->username          = $props['username'];
    }

    /**
     * Tells if the notification reflects a complete REDCap record.
     *
     * @return bool
     */
    public function isComplete(): bool
    {
        return $this->complete == '2';
    }

    /**
     * Creates a database row representation of this notification.
     *
     * @return array
     */
    public function toDatabaseArray(): array
    {
        return [
            'instrument'        => $this->instrument_name,
            'project_id'        => $this->project_id,
            'project_url'       => $this->project_url,
            'received_dt'       => $this->received_datetime->format('Y-m-d H:i:s'),
            'record'            => $this->record_id,
            'redcap_event_name' => $this->unique_event_name,
            'redcap_url'        => $this->instance_url,
            'complete'          => $this->complete,
            'username'          => $this->username,
        ];
    }
}
