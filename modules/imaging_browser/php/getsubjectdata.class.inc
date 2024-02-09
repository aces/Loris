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

        if (is_null($qcstatus)) {
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

    /**
     * Gets a rejected parameter according to its type
     *
     * @param \MRIFile $file file object
     * @param string   $type type of the rejected
     *
     * @return ?string The parameter of the rejected
     */
    function _getRejected(\MRIFile $file, string $type): ?string
    {
        $array     = [];
        $parameter = 'processing:' . $type . '_rejected';
        if (preg_match(
            "/(Directions)([^\(]+)(\(\d+\))/",
            $file->getParameter($parameter) ?? '',
            $array
        )
        ) {
            $dirList = preg_split('/\,/', $array[2]);
            if (count($dirList) > 1) {
                sort($dirList);
            }
            return "Directions " . join(", ", $dirList) . " " . $array[3];
        } else {
            return $file->getParameter($parameter);
        }
    }

    /**
     * Gets Selected status from files_qcstatus for a given FileID
     *
     * @param int $FileID the value of FileID
     *
     * @return ?string
     */
    function _getSelected($FileID): ?bool
    {
        $selected = $this->db->pselectOne(
            "SELECT Selected FROM files_qcstatus ".
            "WHERE FileID =:FileID",
            ['FileID' => $FileID]
        );
        return $selected != null ? (bool) $selected : null;
    }

    /**
     * Gets the ID of the record in table violations_resolved associated
     * to the manual caveat set on a given file.
     *
     * @param $fileID int the ID of the record in table files.
     *
     * @return ?int ID of the associated record in table violations_resolved or
     *              null if there is none.
     */
    function _getManualCaveatViolationsResolvedID(int $fileID): ?int
    {
        $query = "
            SELECT vr.ID
            FROM files f
            JOIN mri_violations_log mvl
              ON (mvl.MincFile = f.File)
            JOIN violations_resolved vr
              ON (    vr.ExtID     = mvl.LogID
                  AND vr.TypeTable = 'mri_violations_log'
                  AND vr.Resolved  = 'inserted_flag'
              )
            WHERE f.FileID =:fileID
            AND mvl.Header LIKE 'Manual Caveat Set by %';
        ";

        return $this->db->pselectOneInt($query, ['fileID' => $fileID]);
    }

    /**
     * Gets candidate's scans with the same acquisitionID.
     *
     * @param int $initialFileID            the value of initialFileID
     * @param int $initialFileAcquisitionID the value of initialFileAcquisitionID
     *
     * @return string of FileIDs, comma separated
     */
    function _getFilesAcrossTimepoints($initialFileID, $initialFileAcquisitionID)
    {
        $selectResults = $this->db->pselect(
            "SELECT FileID FROM files ".
            "WHERE AcquisitionProtocolID =:initialFileAcquisitionID ".
            "AND SessionID in (SELECT s2.ID FROM session s1 RIGHT JOIN session s2 ".
            "ON s1.CandID = s2.CandID WHERE s1.ID =:initialFileID)",
            [
                'initialFileAcquisitionID' => $initialFileAcquisitionID,
                'initialFileID'            => $initialFileID,
            ]
        );

        $fileIDS = [];
        foreach ($selectResults as $selectResult) {
            $fileIDS[] = $selectResult['FileID'];
        }
        $fileIDString = implode(",", $fileIDS);
        return $fileIDString;
    }

    /**
     * Gets the ID of the record in table violations_resolved associated
     * to the manual caveat set on a given file.
     *
     * @param $fileID int the ID of the record in table files.
     *
     * @return ?array array of IDs of the associated records in table
     *              mri_violations_log or null if there is none.
     */
    function _getProtocolViolations(int $fileID): ?array
    {
        $query = "
            SELECT mvl.LogID
            FROM files f
            JOIN mri_violations_log mvl
              ON (mvl.MincFile = f.File)
            WHERE f.FileID =:fileID
            AND mvl.Header NOT LIKE 'Manual Caveat Set by %';
        ";

        return $this->db->pselect($query, ['fileID' => $fileID]);
    }

    /**
     * Determine whether the user has permission to QC the imaging_browser page
     *
     * @return bool whether the user has QC permission
     */
    function _hasQCPerm(): bool
    {
        return \User::singleton()->hasPermission('imaging_browser_qc');
    }
}
