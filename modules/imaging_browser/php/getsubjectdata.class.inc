<?php

namespace LORIS\imaging_browser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Page that returns a subject's data as a Json.
 * Note that much of the code was extracted, or sometimes duplicated,
 * from `ViewSession`.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class GetSubjectData extends \NDB_Page implements RequestHandlerInterface
{
    /**
     * The database connection
     *
     * @var \Database
     */
    private $db;

    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $sessionId = $_REQUEST['sessionID'];
        $session   = \TimePoint::singleton(
            new \SessionID(strval($sessionId))
        );
        $candid    = $session->getCandID();
        $candidate = \Candidate::singleton($candid);

        if ($candidate->getEntityType() == 'Scanner') {
            return ($user->hasPermission('imaging_browser_phantom_allsites')
                || $user->hasCenterPermission(
                    'imaging_browser_phantom_ownsite',
                    $session->getCenterID()
                ))
                && ($user->hasProject($session->getProject()->getId()));
        } elseif ($candidate->getEntityType() == 'Human') {
            return ($user->hasPermission('imaging_browser_view_allsites')
                || $user->hasCenterPermission(
                    'imaging_browser_view_site',
                    $session->getCenterID()
                ))
                && $user->hasProject($session->getProject()->getId());
        }
        return false;
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
     * This acts as an Ajax enpoint that handles all action requests from the
     * Battery Manager Module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $this->db = $this->loris->getDatabaseConnection();
        $method   = $request->getMethod();
        switch ($method) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['GET'],
                'Request must be GET'
            );
        }
    }

    /**
     * Returns a scanner's data as a Json response
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The Json response.
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        $sessionID = intval($request->getQueryParams()['sessionID']);
        $row       = $this->_getRow($sessionID);
        return new \LORIS\Http\Response\JSON\OK($row);
    }

    /**
     * Returns a subject's data as a Json response
     *
     * @param $sessionID A session's id
     *
     * @return array The Json response.
     */
    private function _getRow($sessionID)
    {
        $timePoint = \TimePoint::singleton(
            new \SessionID(strval($sessionID))
        );

        $row = [];
        $row['sessionID']   = $sessionID;
        $row['CohortID']    = $timePoint->getCohortID();
        $row['CohortTitle'] = $timePoint->getData('CohortTitle');
        $row['visitLabel']  = $timePoint->getVisitLabel();
        $row['visitNo']     = $timePoint->getVisitNo();
        $row['site']        = $timePoint->getPSC();

        $qcstatus = $this->db->pselectRow(
            "SELECT MRIQCStatus, MRIQCPending, MRICaveat
            FROM session WHERE ID=:SID",
            ['SID' => $sessionID]
        );

        if ($qcstatus === null) {
            throw new \LorisException(
                'Could not find QC status information for the supplied '
                . 'session ID'
            );
        }

        $row['mriqcstatus']  = $qcstatus['MRIQCStatus'];
        $row['mriqcpending'] = $qcstatus['MRIQCPending'];
        $row['mricaveat']    = $qcstatus['MRICaveat'];
        $row['candid']       = $timePoint->getCandID();

        $candidate    =& \Candidate::singleton($timePoint->getCandID());
        $row['pscid'] = $candidate->getPSCID();
        $row['dob']   = $candidate->getCandidateDoB();
        $row['edc']   = $candidate->getCandidateEDC();
        $row['sex']   = $candidate->getCandidateSex();

        $config        = \NDB_Config::singleton();
        $row['useEDC'] = $config->getSetting('useEDC') === 'true' ? true : false;
        return $row;
    }
}
