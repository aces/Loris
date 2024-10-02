<?php declare(strict_types=1);

namespace LORIS\create_timepoint;

use LORIS\StudyEntities\Candidate\CandID;
use LORIS\VisitController;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;
/**
 * Timepoint class - GET & POST request methods.
 *
 * Used to retrieve info & create timepoint by the create_timepoint form.
 * Ensures the user can create timepoint before processing
 * the GET or POST body (array) data.
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Timepoint extends \NDB_Page implements ETagCalculator
{
    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        case 'POST':
            return $this->_handlePOST($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Verify identifier from GET query.
        if (!$this->_verifyCreatePermissions($request, $values['identifier'])) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'Forbidden'
            );
        }

        // Setup variables
        $conflict = []; // conflict messages.

        //Projects and sites should be limited to the logged in user's affiliations
        $user           = $request->getAttribute("user");
        $userProjects   = $user->getProjects();
        $projectOptions = [];
        foreach ($userProjects as $project) {
            $projectOptions[$project->getId()->__toString()] = $project->getName();
        }
        $values['project'] = $projectOptions;
        $values['psc']     = \Utility::getSiteNameListByIDs($user->getCenterIDs());

        //Cohorts should be determined by project options
        //Nested array of valid suprojects grouped by projects
        $cohortGroups = [];
        foreach ($projectOptions as $pid=>$pname) {
            $cohortGroups[$pid] = \Utility::getCohortList(
                \ProjectID::singleton($pid)
            );
        }
        $values['cohortGroups'] = $cohortGroups;

        //Visits are determined by cohort-project associations.
        $visitGroups = [];
        foreach ($cohortGroups as $pid=>$cohortList) {
            foreach ($cohortList as $sid=>$title) {
                $visitGroups[$pid][$sid] = \Utility::getVisitsForProjectCohort(
                    \ProjectID::singleton($pid),
                    $sid
                );
            }
        }
        $values['visitGroups'] = $visitGroups;

        // List languages
        $values['languages'] = \Utility::getLanguageList();

        if (!empty($conflict)) {
            return new \LORIS\Http\Response\JSON\Conflict(
                $conflict['cohortID']
            );
        }
        if (empty($values['psc'])) {
            unset($values['psc']);
        }

        return new \LORIS\Http\Response\JsonResponse(
            $values
        );
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true);
        if (!is_array($values)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid request'
            );
        }

        if (!$this->_verifyCreatePermissions($request, $values['identifier'])) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'Forbidden'
            );
        }

        // Validate POST data.
        $values = $this->_validate($values);

        // convert site entered to a \Site object
        $user = \User::singleton();

        $user_list_of_sites = $user->getCenterIDs();
        $num_sites          = count($user_list_of_sites);
        $site = null;
        if ($num_sites == 1) {
            $site = \Site::singleton($user_list_of_sites[0]);
        } else if ($num_sites > 1) {
            $site = \Site::singleton(\CenterID::singleton((intval($values['psc']))));
        }

        // Project
        $project = null;
        $user_list_of_projects = $user->getProjectIDs();
        if (count($user_list_of_projects) == 1) {
            // if there is only one project, autoselect first project from array of 1
            $project = \Project::getProjectFromID(array_pop($user_list_of_projects));
        } else if (count($user_list_of_projects) > 1) {
            $project_id = \ProjectID::singleton(intval($values['project']));
            $project    = \Project::getProjectFromID($project_id);
        }

        if (isset($values['conflict'])) {
            return new \LORIS\Http\Response\JSON\Conflict(
                json_encode($values['conflict'])
            );
        }

        //Visit - Get all visits to map ID back to label for session table
        $visits     = \Utility::getVisitsForProjectCohort(
            $project->getId(),
            intval($values['cohort'])
        );
        $visitLabel = $visits[$values['visit']];
        $visitName  = (new VisitController(
            $this->loris->getDatabaseConnection()
        ))->getVisitFromVisitLabel($visitLabel)->getName();

        \TimePoint::createNew(
            \Candidate::singleton(new CandID($values['candID'])),
            intval($values['cohort']),
            $visitName,
            $site,
            $project,
            intval($values['languages']) ?? null
        );
        return new \LORIS\Http\Response\JSON\Created(['success']);
    }

    /**
     * Permission verification.
     *
     * @param ServerRequestInterface $request    The incoming PSR7 request.
     * @param string                 $identifier The identifier.
     *
     * @return bool
     */
    private function _verifyCreatePermissions(
        ServerRequestInterface $request,
        string $identifier
    ) : bool {
        $user      = $request->getAttribute('user');
        $candidate = \Candidate::singleton(new CandID($identifier));
        return (
            $user->hasPermission('data_entry') &&
            $user->hasCenter($candidate->getCenterID())
        );
    }

    /**
     * Validate the post data,
     * from the create timepoint form.
     *
     * @param array $values the form values.
     *
     * @return array
     */
    private function _validate(array $values) : array
    {
        $user = \User::singleton();

        if (!isset($values['identifier'])) {
            $values['error'] = 'BadRequest';
            return $values;
        }
        $values['identifier'] = isset($values['identifier']) ?
            intval($values['identifier']) : null;
        $values['psc']        = empty($values['psc']) ?
            null : $values['psc'];

        // validate site entered
        $site = !empty($values['psc'])
            ?  \CenterID::singleton(intval($values['psc']))
            : null;

        $user_list_of_sites = $user->getCenterIDs();
        $num_sites          = count($user_list_of_sites);
        $conflict           = [];
        if ($num_sites == 0) {
            $conflict['psc']
                = "You must be affiliated with a site to create a timepoint.";
        } else if ($num_sites > 1 && (empty($site) || !$user->hasCenter($site))) {
            $conflict['psc']
                = "Site must be selected from the available dropdown.";
        }

        //Project
        $user_list_of_projects = $user->getProjectIDs();
        if (count($user_list_of_projects) == 0) {
            $conflict['project']
                = "You must be affiliated with a project to create a timepoint.";
        } else if (count($user_list_of_projects) > 1
            && is_null($values['project'])
        ) {
            $conflict['project']
                = "A project must be selected from the available dropdown.";
        }

        $candid    = $values['candID'];
        $cohortID  = intval($values['cohort']);
        $projectID = \ProjectID::singleton(intval($values['project']));

        //Visit - Get all visits to map ID back to label for session table
        $visits     = \Utility::getVisitsForProjectCohort(
            $projectID,
            intval($values['cohort'])
        );
        $visitLabel = $visits[$values['visit']];
        $visitName  = (new VisitController(
            $this->loris->getDatabaseConnection()
        ))->getVisitFromVisitLabel($visitLabel)->getName();

        try {
            \TimePoint::isValidVisitLabel(
                new CandID($candid),
                $projectID,
                $cohortID,
                $visitName,
            );
        } catch (\LorisException $exception) {
            $conflict['visitLabel'] = $exception->getMessage();
        }

        // validate language
        $languages = \Utility::getLanguageList();
        if (count($languages) > 1 && empty($values['languages'])) {
            $conflict['languages'] = 'A language must be selected.';
        }
        // set form message if exists.
        if ($conflict) {
            $values['conflict'] = $conflict;
        }
        return $values;
    }

    /**
     * Returns true if the user has permission to access
     * the Create Timepoint module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_entry');
    }
    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        if ($request->getMethod() === 'POST') {
            return '';
        }
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }
    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
            'POST',
        ];
    }
}
