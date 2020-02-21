<?php
namespace LORIS\candidate_profile;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;


/**
 * The candidate_profile page provides a dashboard which is an overview
 * of a specific candidate. The dashboard summarizes information about
 * the candidate across all LORIS modules and modalities.
 *
 * Modules provide widgets which get registered into the page. The
 * only widget provided by the module itself is a card summarizing
 * the data returned from the LORIS API for that candidate.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Candidate_Profile extends \NDB_Page
{
    protected $candidate;

    /**
     * All users can access the page, the modules which register widgets
     * onto the candidate dashboard validate the permissions for that
     * widget.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $this->candidate->isAccessibleBy($user);
    }

    /**
     * Ensure $this->candidate is set so that _hasAccess is valid
     * before calling the parent middleware.
     *
     * @return ResponseInterface
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        $this->candidate = $request->getAttribute('candidate');
        return parent::process($request, $handler);
      }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->candidate = $request->getAttribute('candidate');
        if ($this->candidate === null) {
            // This should be impossible, because the Module router added the attribute
            // before loading this page.
            throw new \LorisException("No candidate provided");
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
     * Add CSSGrid dependency for the module.
     *
     * @return array
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

