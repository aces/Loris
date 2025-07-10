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

namespace LORIS\redcap\client\models\mappings;

/**
 * This interface allows for type abstraction of REDCap instrument event mappings
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface IRedcapInstrumentEvent
{
    /**
     * Get the REDCap unique event name.
     *
     * @return string
     */
    public function getUniqueEventName(): string;

    /**
     * Get the REDCap form name.
     *
     * @return string
     */
    public function getFormName(): string;
}
