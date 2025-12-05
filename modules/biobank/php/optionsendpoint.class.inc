<?php declare(strict_types=1);

/**
 * This implements the Options endpoint class for the Biobank Module.
 *
 * PHP Version 8.2
 *
 * @category   API
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris
 */
namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A class for handling the /biobank/options/ endpoint.
 *
 * PHP Version 8.2
 *
 * @category   API
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
class OptionsEndpoint extends \NDB_Page implements RequestHandlerInterface
{
    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return [
            'GET',
            'OPTIONS',
        ];
    }

    /**
     * This function can be overridden in a module's page to load the necessary
     * resources to check the permissions of a user.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {
    }

    /**
     * This function passes the request to the handler. This is necessary since
     * the Endpoint bypass the Module class.
     *
     * XXX: This function should be extracted to a parent class.
     *
     * @param ServerRequestInterface  $request The PSR7 request.
     * @param RequestHandlerInterface $handler The request handler.
     *
     * @return ResponseInterface The outgoing PSR7 response.
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

    /**
     * Handles endpoint requests.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        ini_set('memory_limit', '-1');
        $db   = \NDB_Factory::singleton()->database();
        $user = $request->getAttribute('user');

        try {
            switch ($request->getMethod()) {
            case 'GET':
                $options = $this->getOptions($db, $user);
                return new \LORIS\Http\Response\JSON\OK($options);
            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }
        } catch (Forbidden $e) {
            return new \LORIS\Http\Response\JSON\Forbidden($e->getMessage());
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }
    }

    /**
     * Retrieves all options for populating forms and mapping front-end data.
     *
     * @param \Database $db   Database instance
     * @param \User     $user User instance
     *
     * @return array All options required by the Biobank Module
     */
    function getOptions(\Database $db, \User $user)
    {
        $contCont = new ContainerController($this->loris, $user);
        $specCont = new SpecimenController($this->loris, $user);
        $shipDAO  = new ShipmentDAO($db);

        $userCenters  = implode(',', $user->getCenterIDs());
        $userProjects = implode(',', $user->getProjectIDs());
        // TODO: This should eventually be replaced by a call directly to a
        // Candidate endpoint or Candidate controller that will be able to
        // provide Candidate Objects.
        $query      = "
            SELECT
                c.CandID as id,
                PSCID as pscid,
                Sex as sex,
                GROUP_CONCAT(DISTINCT DxEvolutionID) as diagnosisIds,
                GROUP_CONCAT(DISTINCT s.ID) as sessionIds
            FROM
                candidate c
                LEFT JOIN session s
                  ON s.CandidateID=c.ID
                LEFT JOIN candidate_diagnosis_evolution_rel cder
                  ON cder.CandidateID=c.ID
            WHERE
                s.CenterID IN ($userCenters)
                AND s.ProjectID IN ($userProjects)
            GROUP BY
                CandID
        ";
        $candidates = $db->pselectWithIndexKey($query, [], 'id');
        foreach ($candidates as $id => $candidate) {
            $candidates[$id]['diagnosisIds'] = $candidate['diagnosisIds']
                ? explode(',', $candidate['diagnosisIds'])
                : [];
            $candidates[$id]['sessionIds']   = $candidate['sessionIds']
                ? explode(',', $candidate['sessionIds'])
                : [];
        }

        // XXX: This should eventually be replaced by a call directly to a
        // Candidate endpoint or Candidate controller that will be able to
        // provide Diagnosis Options.
        $query     = '
            SELECT
                DxEvolutionID as id,
                Name as label
            FROM
                diagnosis_evolution
        ';
        $diagnoses = $db->pselectWithIndexKey($query, [], 'id');

        $sessionQuery = "SELECT
            s.ID as id,
            s.Visit_label as label,
            s.CenterID as centerId,
            s.ProjectID as projectId
        FROM session s
        WHERE s.CenterID IN ($userCenters)
          AND s.ProjectID IN ($userProjects)";
        $sessions     = $db->pselectWithIndexKey($sessionQuery, [], 'id');

        // XXX: This should eventually be replaced by a call directly to a
        // Examiner endpoint or Examiner controller that will be able to provide
        // Examiner Objects.
        $query     = 'SELECT examinerID as id, full_name as label FROM examiners';
        $examiners = $db->pselectWithIndexKey($query, [], 'id');

        // XXX: This should eventually be replaced by a call directly to a
        // User endpoint or Examiner controller that will be able to provide
        // User Objects.
        $query = 'SELECT ID as id, Real_name as label FROM users';
        $users = $db->pselectWithIndexKey($query, [], 'id');

        // XXX: This should eventually be replaced by a call directly to a
        // Center Endpoint or Center Controller that will be able to provide
        // Center Objects.
        $centers = \Utility::getSiteList();
        // foreach ($centers as $id => $center) {
        //     if ($user->hasCenter(new \CenterID(strval($id))) === false) {
        //         unset($centers[$id]);
        //     }
        // }

        $shipment = [
            'statuses' => $shipDAO->getStatuses(),
            'types'    => $shipDAO->getTypes(),
        ];

        return [
            'candidates' => $candidates,
            'diagnoses'  => $diagnoses,
            'sessions'   => $sessions,
            'projects'   => \Utility::getProjectList(),
            'centers'    => $centers,
            'examiners'  => $examiners,
            'users'      => $users,
            'container'  => $contCont->getOptions(),
            'specimen'   => $specCont->getOptions(),
            'shipment'   => $shipment,
        ];
    }
}
