<?php declare(strict_types=1);
/**
 * This file contains the NDB_Form_candidate_parameters class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Candidate_Parameters
 * @author   MOB <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\candidate_parameters;
use \LORIS\StudyEntities\Candidate\CandID;
use \LORIS\StudyEntities\Candidate;


/**
 * Main class for candidate_parameters module
 * corresponding to /candidate_parameters/ URL
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of candidate_parameter categories
 * and tabs to view them.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Candidate_Parameters
 * @author   MOB <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Candidate_Parameters extends \NDB_Form
{

    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $candidate =& \Candidate::singleton(new CandID($this->identifier));

        // User must either have 'access_all_profiles' permission, or
        // one of the candidate_parameter permissions AND have the candidate's site.
        return $user->hasPermission('access_all_profiles') ||
            ($user->hasAnyPermission(
                array(
                    'candidate_parameter_view',
                    'candidate_parameter_edit',
                ))
                && $user->hasCenter($candidate->getCenterID())
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
            array(
                $baseURL . "/candidate_parameters/js/CandidateParameters.js",
            )
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

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                'Candidate Parameters',
                "/candidate_parameters/?candID=$candID&identifier=$candID"
            )
        );
    }
}
