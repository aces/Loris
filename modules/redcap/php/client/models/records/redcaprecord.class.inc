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
     * Get the instrument name
     *
     * @return string
     */
    public function getInstrumentName(): string
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
