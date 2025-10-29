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
 * Enumeration that describes what kind of LORIS candidate identifier is used to map
 * REDCap participants with LORIS candidates.
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
enum RedcapConfigLorisId
{
    /**
     * The REDCap partcipant identifier should be mapped to a LORIS candidate PSCID.
     */
    case PscId;

    /**
     * The REDCap partcipant identifier should be mapped to a LORIS candidate CandID.
     */
    case CandId;

    /**
     * The REDCap partcipant identifier should be mapped to a LORIS candidate
     * External Study ID.
     */
    case ExternalId;
}
