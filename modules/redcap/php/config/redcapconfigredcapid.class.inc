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
 * Enumeration that describes what kind of REDCap participant identifier is used to
 * map REDCap participants with LORIS candidates.
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
enum RedcapConfigRedcapId
{
    /**
     * The REDCap record ID should be used as the participant identifier.
     */
    case RecordId;

    /**
     * The REDCap survey participant identifier should be used as the participant
     * identifier.
     */
    case SurveyParticipantId;
}
