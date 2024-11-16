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

namespace LORIS\redcap\notifications;

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
    private string $_instrument;
    private string $_project_id;
    private string $_project_url;
    private \DateTimeInterface $_received_dt;
    private string $_record;
    private string $_redcap_event_name;
    private string $_redcap_url;
    private string $_complete;
    private string $_username;

    /**
     * Constructor
     *
     * @param array $props The notification properties typically from redcap.
     */
    public function __construct(array $props)
    {
        $requiredprops = [
            'instrument',
            'project_id',
            'project_url',
            'received_dt',
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

        $this->_instrument        = $props['instrument'];
        $this->_project_id        = $props['project_id'];
        $this->_project_url       = $props['project_url'];
        $this->_received_dt       = $props['received_dt'];
        $this->_record            = $props['record'];
        $this->_redcap_event_name = $props['redcap_event_name'];
        $this->_redcap_url        = $props['redcap_url'];
        $this->_complete          = $props[$complete_key] ?? '';
        $this->_username          = $props['username'];
    }

    /**
     * Getter for the complete property
     *
     * @return string
     */
    public function getComplete(): string
    {
        return $this->_complete;
    }

    /**
     * Getter for the REDCap URL
     *
     * @return string
     */
    public function getRedcapURL(): string
    {
        return $this->_redcap_url;
    }

    /**
     * Getter for the instrument property
     *
     * @return string
     */
    public function getInstrument(): string
    {
        return $this->_instrument;
    }

    /**
     * Getter for the project_id property
     *
     * @return string
     */
    public function getProjectId(): string
    {
        return $this->_project_id;
    }

    /**
     * Getter for the complete property
     *
     * @return string
     */
    public function getRecord(): string
    {
        return $this->_record;
    }

    /**
     * Getter for the received_dt property
     *
     * @return \DateTimeInterface
     */
    public function getReceivedDt(): \DateTimeInterface
    {
        return $this->_received_dt;
    }

    /**
     * Getter for the redcap_event_name property
     *
     * @return string
     */
    public function getRedcapEventName(): string
    {
        return $this->_redcap_event_name;
    }

    /**
     * Tells if the notification reflects a complete REDCap record.
     *
     * @return bool
     */
    public function isComplete(): bool
    {
        return $this->_complete == '2';
    }

    /**
     * Creates a database row representation of this notification.
     *
     * @return array
     */
    public function toDatabaseArray(): array
    {
        return [
            'instrument'        => $this->_instrument,
            'project_id'        => $this->_project_id,
            'project_url'       => $this->_project_url,
            'received_dt'       => $this->_received_dt->format('Y-m-d H:i:s'),
            'record'            => $this->_record,
            'redcap_event_name' => $this->_redcap_event_name,
            'redcap_url'        => $this->_redcap_url,
            'complete'          => $this->_complete,
            'username'          => $this->_username,
        ];
    }
}
