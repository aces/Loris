<?php declare(strict_types=1);

/**
 * This file contains the Create_Timepoint class
 *
 * PHP Version 8
 *
 * @category LORIS_Module
 * @package  Create_Timepoint
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\create_timepoint;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * The forms for the new profile menu
 *
 * @category LORIS_Module
 * @package  Create_Timepoint
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class Create_Timepoint extends \NDB_Form
{
    public $skipTemplate = true;

    /**
     * This timepoint's candidate
     *
     * @var \Candidate
     */
    protected $candidate;

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $this->candidate = \Candidate::singleton(new CandID($this->identifier));

        // check user permissions
        return (
            $user->hasPermission('data_entry') &&
            $user->hasCenter($this->candidate->getCenterID())
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $candid = $this->candidate->getCandID();
        $pscid  = $this->candidate->getPSCID();

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                dgettext("candidate_list", 'Access Profile'),
                '/candidate_list'
            ),
            new \LORIS\Breadcrumb(
                dgettext("candidate_profile", "Candidate Profile")
                .  " $candid / $pscid",
                "/$candid"
            ),
            new \LORIS\Breadcrumb(
                dgettext("create_timepoint", 'Create Timepoint'),
                "/create_timepoint/?candID=$candid&identifier=$candid"
            )
        );
    }

    /**
     * Get js Dependencies
     *
     * @return array
     */
    function getJSDependencies()
    {
        $depends = parent::getJSDependencies();
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = array_merge(
            $depends,
            [
                $baseurl . '/create_timepoint/js/createTimepointIndex.js',
            ]
        );
        return $depends;
    }
}
