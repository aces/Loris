<?php
/**
 * The candidate_profile menu
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Candidate_Profile
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\candidate_profile;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * The candidate_profile menu
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Candidate_Profile
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
class Candidate_Profile extends \NDB_Page
{
    protected $candidate;

    /**
     * Overloading this method to allow access to candidate_profile
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // FIXME: This should be based on whether the user has access
        // to the candidate (site, project, etc).
        return true;
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface {
        //$candID = $request->getAttribute('CandID') ?? new CandID("965327");
        $candIDStr = ltrim($request->getURI()->getPath(), '/');
        try {
            $candID = new CandID($candIDStr);
            $this->candidate = \Candidate::singleton($candID);
       } catch (\DomainException | \LORISException $e) {
           // A LORISException means the \Candidate::singleton couldn't load the candidate (ie
           // because the CandID doesn't exist in the database.) A \DomainException means the
           // CandID format was invalid. Either one means the URL was not valid.
           return (new \LORIS\Http\Response())->withBody(new \LORIS\Http\StringStream("Candidate not found"))->withStatus(404);
       }

        $DB   = \NDB_Factory::singleton()->database();
        $user = \User::singleton();

        $modules = \Module::getActiveModules($DB);

        $widgets = [];
        foreach ($modules as $module) {
            if ($module->hasAccess($user)) {
                $mwidgets = $module->getWidgets('candidate', $user, [
                    'candidate' => $this->candidate,
                ]);
                foreach ($mwidgets as $widget) {
                    if (!($widget instanceof CandidateWidget)) {
                        continue;
                    }
                    $widgets[] = $widget;
                }
            }
        }

        $this->tpl_data['widgets'] = $widgets;
        $this->tpl_data['candidate'] = $this->candidate;

        $this->tpl_data['visitmap'] = array_flip($this->candidate->getListOfVisitLabels());

        return parent::handle($request);
    }

    /**
     * Get dependencies to candidate_profile for image browsing link
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
            array($baseURL . '/candidate_profile/js/candidateProfileIndex.js')
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        if($this->candidate === null) {
            return new \LORIS\BreadcrumbTrail(
                new \LORIS\Breadcrumb(
                    'Access Profile',
                    '/candidate_list'
                ),
            );
        }
        $candid = $this->candidate->getCandID();
        $pscid  = $this->candidate->getPSCID();

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                'Access Profile',
                '/candidate_list'
            ),
            new \LORIS\Breadcrumb(
                "Candidate Dashboard $candid / $pscid",
                "/$candid"
            )
        );
    }
}

