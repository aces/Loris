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
use \Loris\StudyEntities\Candidate\CandID;

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
        return $user->hasAnyPermission(
            array(
                'candidate_parameter_view',
                'candidate_parameter_edit',
            )
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
