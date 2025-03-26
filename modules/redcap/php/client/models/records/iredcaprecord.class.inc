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
 * This interface allows for type abstraction of REDCap records
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface IRedcapRecord
{
    /**
     * Get the instrument name
     *
     * @return string
     */
    public function getFormName(): string;

    /**
     * Get the instrument name
     *
     * @return string
     */
    public function getInstrumentName(): string;

    /**
     * Get the props names
     *
     * @return array
     */
    public function getPropertyNames(): array;

    /**
     * Props array.
     *
     * @return array
     */
    public function toArray(): array;
}
