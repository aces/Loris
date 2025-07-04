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
 * Class reprenting a REDCap visit mapping configuration, that is, the mapping
 * between a REDCap event and arm and a LORIS visit.
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfigVisit
{
    /**
     * The LORIS visit label of the mapping.
     *
     * @var string
     */
    public readonly string $visit_label;

    /**
     * The REDCap arm name of the mapping, or `NULL`.
     *
     * @var ?string
     */
    public readonly ?string $redcap_arm_name;

    /**
     * The REDCap event name of the mapping, or `NULL`.
     *
     * @var ?string
     */
    public readonly ?string $redcap_event_name;

    /**
     * Constructor.
     *
     * @param string  $visit_label       The LORIS visit label.
     * @param ?string $redcap_arm_name   The REDCap arm name.
     * @param ?string $redcap_event_name The REDCap event name.
     */
    public function __construct(
        string $visit_label,
        ?string $redcap_arm_name,
        ?string $redcap_event_name,
    ) {
        $this->visit_label       = $visit_label;
        $this->redcap_arm_name   = $redcap_arm_name;
        $this->redcap_event_name = $redcap_event_name;
    }
}
