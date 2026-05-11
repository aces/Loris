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
class RedcapConfigCreateSession
{
    /**
     * A LORIS site name.
     *
     * @var string
     */
    public readonly string $site_name;

    /**
     * A LORIS project name.
     *
     * @var string
     */
    public readonly string $project_name;

    /**
     * A LORIS cohort name.
     *
     * @var string
     */
    public readonly string $cohort_name;

    /**
     * Constructor.
     *
     * @param string $site_name    A LORIS site name.
     * @param string $project_name A LORIS project name.
     * @param string $cohort_name  A LORIS cohort name.
     */
    public function __construct(
        string $site_name,
        string $project_name,
        string $cohort_name,
    ) {
        $this->site_name    = $site_name;
        $this->project_name = $project_name;
        $this->cohort_name  = $cohort_name;
    }
}
