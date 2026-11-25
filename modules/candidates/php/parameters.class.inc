<?php declare(strict_types=1);

/**
 * This file contains the Parameters page
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Candidates
 * @author   MOB <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\candidates;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * The candidate parameters page, at /candidates/parameters/
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of candidate_parameter categories
 * and tabs to view them.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Candidates
 * @author   MOB <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Parameters extends \NDB_Form
{
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        $candidate =& \Candidate::singleton(new CandID($this->identifier));

        /* User must have one of the candidate_parameter permissions
        AND have the candidate's site. */
        return ($user->hasAnyPermission(
            [
                'candidate_parameter_view',
                'candidate_parameter_edit',
            ]
        ) && $user->hasCenter($candidate->getCenterID())
        );
    }

    /**
     * Override default behaviour, since the page is loaded from index.js
     *
     * @return string
     */
    function display()
    {
        return "";
    }

    /**
     * Include the Tabs.js and index.js (entry point of the module)
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/candidates/js/CandidateParameters.js",
            ]
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $candidate =& \Candidate::singleton(new CandID($this->identifier));
        $candID    = $candidate->getCandID();
        $pscid     = $candidate->getPSCID();

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                dgettext("candidates", 'Access Profile'),
                '/candidates'
            ),
            new \LORIS\Breadcrumb(
                dgettext("candidates", "Candidate Profile")
                . " $candID / $pscid",
                "/$candID"
            ),
            new \LORIS\Breadcrumb(
                dgettext("candidates", "Candidate Parameters"),
                "/candidates/parameters/?candID=$candID&identifier=$candID"
            )
        );
    }
}
