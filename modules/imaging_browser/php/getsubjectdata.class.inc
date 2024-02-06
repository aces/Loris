<?php

namespace LORIS\imaging_browser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

class GetSubjectData extends \NDB_Page implements RequestHandlerInterface {
    /**
     * The database connection
     *
     * @var \Database
     */
    private $db;

    /**
     * The user accessing the endpoint
     *
     * @var \User
     */
    private $user;

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
        $this->db   = $this->loris->getDatabaseConnection();
        $this->user = $request->getAttribute('user');
        $method     = $request->getMethod();
        switch ($method) {
        case 'GET':
            return $this->getData();
        }
    }

    /**
     * Converts the results of this menu filter to a JSON format.
     *
     * @return ResponseInterface The outgoing PSR7 with a string of json
     *                           encoded tests as the body.
     */
    private function getData(): ResponseInterface
    {
        $row = $this->getRow($_REQUEST['sessionID']);
        return new \LORIS\Http\Response\JSON\OK($row);
    }

    function getRow($sessionID)
    {
        $timePoint = \TimePoint::singleton(
            new \SessionID(strval($sessionID))
        );

        $subjectData = [];
        $subjectData['sessionID']   = $sessionID;
        $subjectData['CohortID']    = $timePoint->getCohortID();
        $subjectData['CohortTitle'] = $timePoint->getData('CohortTitle');
        $subjectData['visitLabel']  = $timePoint->getVisitLabel();
        $subjectData['visitNo']     = $timePoint->getVisitNo();
        $subjectData['site']        = $timePoint->getPSC();
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
        $subjectData['mriqcstatus']  = $qcstatus['MRIQCStatus'];
        $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];
        $subjectData['mricaveat']    = $qcstatus['MRICaveat'];
        $subjectData['candid']       = $timePoint->getCandID();

        $candidate            =& \Candidate::singleton($timePoint->getCandID());
        $subjectData['pscid'] = $candidate->getPSCID();
        $subjectData['dob']   = $candidate->getCandidateDoB();
        $subjectData['edc']   = $candidate->getCandidateEDC();
        $subjectData['sex']   = $candidate->getCandidateSex();

        // This doesn't work.
        //Need to find the proper way to get the TarchiveID.
        //It should be per file, not per candidate. --Dave
        $params     = [];
        $EntityType = $candidate->getEntityType();
        if ($EntityType == 'Scanner') {
            $ID = ":PPSCID";
            $params['PPSCID'] = $timePoint->getData('PSCID');
        } else {
            $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            $params['PPSCID']  = $candidate->getPSCID();
            $params['PCandID'] = $timePoint->getCandID();
            $params['PVL']     = $timePoint->getVisitLabel();
        }
        $tarchiveIDs = $this->db->pselect(
            "SELECT TarchiveID
            FROM tarchive
            WHERE PatientName LIKE $ID",
            $params
        );
        $subjectData['tarchiveids'] = $tarchiveIDs;
        // Cache the data
        return $subjectData;
    }

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
