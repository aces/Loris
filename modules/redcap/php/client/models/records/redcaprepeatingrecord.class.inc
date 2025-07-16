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
 * This represents a redcap repeating record.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapRepeatingRecord extends RedcapRecord
{
    private int $_repeat_index;

    /**
     * Constructor
     *
     * @param string $form_name    This record form name in redcap
     * @param array  $props        The record properties typically from redcap.
     * @param int    $repeat_index This record repeat index.
     */
    public function __construct(string $form_name, array $props, int $repeat_index)
    {
        $this->_repeat_index = $repeat_index;

        parent::__construct($form_name, $props);
    }

    /**
     * Get the repeating index.
     *
     * @return int
     */
    public function getRepeatIndex(): int
    {
        return $this->_repeat_index;
    }

    /**
     * Get the LORIS instrument name.
     *
     * @return string
     */
    public function getLorisInstrumentName(): string
    {
        return $this->getFormName() . '_' . $this->_repeat_index;
    }
}
