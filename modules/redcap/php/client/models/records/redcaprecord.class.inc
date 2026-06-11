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

namespace LORIS\redcap\client\models\records;

use LORIS\redcap\client\RedcapProps;

/**
 * This represents a redcap record.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapRecord
{
    /**
     * The REDCap record ID.
     */
    public readonly string $record_id;

    /**
     * The REDCap unique event name.
     */
    public readonly string $unique_event_name;

    /**
     * The record completion status.
     * 0 = incomplete / partial survey response
     * 1 = unverified
     * 2 = complete
     */
    public readonly int $complete;

    /**
     * The date and time at which the record was completed. This is an undocumented
     * field in the REDCap API.
     */
    public readonly ?\DateTimeImmutable $datetime;

    private string $_form_name;

    private array $_props;

    /**
     * Constructor
     *
     * @param string $form_name the instrument name
     * @param array  $props     The record properties typically from redcap.
     */
    public function __construct(string $form_name, array $props)
    {
        $this->_form_name = $form_name;
        $this->_props     = $props;

        $props = new RedcapProps('record', $props);

        $datetime_string = $props->getStringNullable("{$form_name}_timestamp");
        if ($datetime_string !== null) {
            try {
                $datetime = new \DateTimeImmutable($datetime_string);
            } catch (\DateMalformedStringException) {
                $datetime = null;
            }
        } else {
            $datetime = null;
        }

        $this->record_id         = $props->getString('record_id');
        $this->unique_event_name = $props->getString('redcap_event_name');
        $this->datetime          = $datetime;
        $this->complete          = $props->getInt("{$form_name}_complete");
    }

    /**
     * Get the instrument name.
     *
     * @return string
     */
    public function getFormName(): string
    {
        return $this->_form_name;
    }

    /**
     * Get the LORIS instrument name.
     *
     * @return string
     */
    public function getLorisInstrumentName(): string
    {
        return $this->_form_name;
    }

    /**
     * Get the props names
     *
     * @return array
     */
    public function getPropertyNames(): array
    {
        return array_keys($this->_props);
    }

    /**
     * Get the props array
     *
     * @return array
     */
    public function toArray(): array
    {
        return $this->_props;
    }
}
