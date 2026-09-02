<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\config;

/**
 * Enumeration that describes which kind of index is used to order repeating
 * instrument records.
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
enum RedcapConfigRepeatId
{
    /**
     * REDCap repeated records are ordered by the "redcap_repeat_instance" field.
     */
    case RepeatInstance;

    /**
     * REDCap repeated records are ordered by the "timestamp" field.
     */
    case Timestamp;
}
