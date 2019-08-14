<?php declare(strict_types=1);
/**
 * This implements the Options endpoint class for the Biobank Module.
 *
 * PHP Version 7.2
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
 * PHP Version 7.2
 *
 * @category   API
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
class OptionsEndpoint implements RequestHandlerInterface
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
        return array(
                'GET',
                'OPTIONS',
               );
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
        $db   = \Database::singleton();
        $user = $request->getAttribute('user');

        try {
            switch($request->getMethod()) {
            case 'GET':
                $options = $this->getOptions($db, $user);
                return new \LORIS\Http\Response\OK($options);
            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }
        } catch (\Invalid $e) {
            return \LORIS\Http\Response\BadRequest($e->getMessage());
        } catch (\Forbidden $e) {
            return \LORIS\Http\Response\Forbidden($e->getMessage());
        }
    }

    /**
     * Retrieves all options for populating forms and mapping front-end data.
     *
     * @param Database $db   Database instance
     * @param User     $user User instance
     *
     * @return array All options required by the Biobank Module
     */
    function getOptions(\Database $db, \User $user)
    {
        $contCont = new ContainerController($db, $user);
        $specCont = new SpecimenController($db, $user);

        // XXX: This should eventually be replaced by a call directly to a
        // Candidate endpoint or Candidate controller that will be able to
        // provide Candidate Objects.
        $query      = 'SELECT CandID as id, PSCID as pscid FROM candidate';
        $candidates = $db->pselectWithIndexKey($query, array(), 'id');

        // XXX: This should eventually be replaced by a call directly to a
        // Session endpoint or Session controller that will be able to provide
        // Session Objects.
        $query    = 'SELECT ID as id, Visit_label as label FROM session';
        $sessions = $db->pselectWithIndexKey($query, array(), 'id');

        // XXX: This should eventually be replaced by a call directly to a
        // Examiner endpoint or Examiner controller that will be able to provide
        // Examiner Objects.
        $query     = 'SELECT examinerID as id, full_name as label FROM examiners';
        $examiners = $db->pselectWithIndexKey($query, array(), 'id');

        // XXX: This should eventually be replaced by a call directly to a
        // Center Endpoint or Center Controller that will be able to provide
        // Center Objects.
        $centers = \Utility::getSiteList();
        foreach ($centers as $id => $center) {
            if ($user->hasCenter($id) === false) {
                unset($centers[$id]);
            }
        }

        // XXX: This should eventually be replaced by a call directly to a
        // Session Controller or Session Options endpoint that will be able to
        // provide these options.
        $query  = 'SELECT c.CandID as candidateId,                              
                         s.ID sessionId,                                        
                         s.Visit_label as label,                                
                         s.CenterID as centerId                                 
                 FROM candidate c                                               
                 LEFT JOIN session s                                            
                   USING(CandID)';
        $result = $db->pselect($query, array());
        $candidateSessions = array();
        $sessionCenters    = array();
        foreach ($result as $row) {
            foreach ($row as $column=>$value) {
                $candidateSessions[$row['candidateId']][$row['sessionId']]['label'] = $row['label'];
                $sessionCenters[$row['sessionId']]['centerId'] = $row['centerId'];
            }
        }

        return array(
                'candidates'        => $candidates,
                'sessions'          => $sessions,
                'projects'          => \Utility::getProjectList(),
                'centers'           => $centers,
                'examiners'         => $examiners,
                'candidateSessions' => $candidateSessions,
                'sessionCenters'    => $sessionCenters,
                'container'         => $contCont->getOptions(),
                'specimen'          => $specCont->getOptions(),
               );
    }
}
