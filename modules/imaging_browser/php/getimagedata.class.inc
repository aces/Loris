<?php

namespace LORIS\imaging_browser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

class GetImageData extends \NDB_Page implements RequestHandlerInterface {
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
        $FileObj = new \MRIFile(intval($_REQUEST['fileID']));

        $sessionId = $FileObj->getParameter('SessionID');
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
    public function handle(ServerRequestInterface $request) : ResponseInterface
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
    private function getData() : ResponseInterface
    {
        $row = $this->getRow($_REQUEST['fileID']);
        return new \LORIS\Http\Response\JSON\OK($row);
    }

    private function getRow($fileId)
    {
        $FileObj = new \MRIFile(intval($fileId));

        $sessionId = $FileObj->getParameter('SessionID');

        $timePoint = \TimePoint::singleton(
            new \SessionID($sessionId),
        );

        $factory   = \NDB_Factory::singleton();
        $baseurl   = $factory->settings()->getBaseURL();


        $FullFilename = $FileObj->getParameter('File') ?? '';
        $FileID       = intval($fileId);
        $Filename     = basename($FullFilename);
        $APIFile      = $baseurl . "/api/v0.0.3/candidates/"
                . $timePoint->getCandID() . "/"
                . $timePoint->getVisitLabel()
                . "/images/"
                . $Filename;

        $New        = ($FileObj->getParameter('QCFirstChangeTime') == '') ?
                                        true : false;
        $OutputType = $FileObj->getParameter('OutputType');
        $AcquisitionProtocol = $FileObj->getAcquisitionProtocol();
        $CoordinateSpace     = $FileObj->getParameter('CoordinateSpace');
        $AcquisitionDate     = $FileObj->getParameter('AcquisitionDate');
        $ProcDate            = $FileObj->getParameter(
            'processing:processing_date'
        );
        $FileInsertDate      = $FileObj->getParameter('InsertTime');
        $SeriesNumber        = (int) $FileObj->getParameter('series_number');
        $EchoTime            = round(
            (float)$FileObj->getParameter('echo_time') * 1000,
            2
        );
        $InversionTime       = round(
            (float)$FileObj->getParameter('inversion_time') * 1000,
            2
        );
        $RepetitionTime      = round(
            (float)$FileObj->getParameter('repetition_time') * 1000,
            2
        );
        $SliceThickness      = round(
            intval($FileObj->getParameter('slice_thickness')),
            2
        );
        $Time      = round(
            intval($FileObj->getParameter('time')),
            2
        );
        $ImageType = $FileObj->getParameter(
            'dicominfo:image_type'
        );
        $PhaseEncodingDirection = $FileObj->getParameter(
            'PhaseEncodingDirection'
        );
        $EchoNumber         = (int) $FileObj->getParameter('echo_numbers');
        $Comment            = $FileObj->getParameter('Comment');
        $ProcessingPipeline = $FileObj->getParameter('processing:pipeline');
        $TotalRejected      = $FileObj->getParameter(
            'processing:total_rejected'
        );
        $SourceFile         = basename(
            $FileObj->getParameter('processing:sourceFile') ?? ''
        );
        $Tool = $FileObj->getParameter('Tool');
        $SlicewiseRejected     = $this->_getRejected(
            $FileObj,
            'slicewise'
        );
        $InterlaceRejected     = $this->_getRejected(
            $FileObj,
            'interlace'
        );
        $IntergradientRejected = $this->_getRejected(
            $FileObj,
            'intergradient'
        );
        $Xstep       = round(
            (float)($FileObj->getParameter('xstep')),
            2
        );
        $Ystep       = round(
            (float)($FileObj->getParameter('ystep')),
            2
        );
        $Zstep       = round(
            (float)($FileObj->getParameter('zstep')),
            2
        );
        $Selected    = $this->_getSelected(
            (int) $FileObj->getParameter('FileID')
        );
        $QCStatus    = $FileObj->getParameter('QCStatus');
        $QCDate      = $FileObj->getParameter('QCLastChangeTime');
        $SNR         = $FileObj->getParameter('SNR');
        $SeriesUID   = $FileObj->getParameter('SeriesUID');
        $XMLreport   = $FileObj->getParameter('processing:DTIPrepXmlReport');
        $XMLprotocol = $FileObj->getParameter('ProtocolFile');
        $NrrdFile    = $FileObj->getParameter('processing:nrrd_file');
        $NiiFile     = $FileObj->getParameter('check_nii_filename');
        $BvalFile    = $FileObj->getParameter('check_bval_filename');
        $BvecFile    = $FileObj->getParameter('check_bvec_filename');
        $JsonFile    = $FileObj->getParameter('bids_json_file');
        $OtherTimepoints = (int) $this->_getFilesAcrossTimepoints(
            (int)$FileObj->getParameter('SessionID'),
            (int)$FileObj->getParameter('AcquisitionProtocolID')
        );

        $manualCaveatViolationsResolvedID
            = $this->_getManualCaveatViolationsResolvedID($FileID);
        $caveat = $manualCaveatViolationsResolvedID ? true : false;
        $foundProtocolViolations = $this->_getProtocolViolations($FileID);
        $editableCaveat          = true;
        if ($foundProtocolViolations) {
            $caveat         = 1;
            $editableCaveat = false;
        }
        $file = [
            'FileID'                 => $FileID,
            'Filename'               => $Filename,
            'APIFile'                => $APIFile,
            'FullFilename'           => $FullFilename,
            'New'                    => $New,
            'Comment'                => $Comment,
            'SourceFile'             => $SourceFile,
            'Tool'                   => $Tool,
            'Selected'               => $Selected,
            'QCStatus'               => $QCStatus,
            'QCDate'                 => $QCDate,
            'Caveat'                 => $caveat,
            'SNR'                    => $SNR,
            'OtherTimepoints'        => $OtherTimepoints,
            'EditableCaveat'         => $editableCaveat,
            'headers' => [
                'SeriesUID' => $SeriesUID,
                'Xstep'     => $Xstep,
                'Ystep'     => $Ystep,
                'Zstep'     => $Zstep,
                'OutputType' => $OutputType,
                'CoordinateSpace' => $CoordinateSpace,
                "AcquisitionProtocol" => $AcquisitionProtocol,
                'AcquisitionDate' => $AcquisitionDate,
                "InsertedDate" => $FileInsertDate, // date_format
                "SeriesNumber" => $SeriesNumber,
                "SeriesDescription" => $SeriesNumber,
                "SliceThickness" => $SliceThickness,
                "RepetitionTime" => $RepetitionTime,
                "EchoTime" => $EchoTime,
                "InversionTime" => $InversionTime,
                "PhaseEncodingDirection" => $PhaseEncodingDirection,
                "ImageType" => $ImageType,
                "EchoNumber" => $EchoNumber,
                "NumVolumes" => $Time,
                "ProcessingPipeline" => $ProcessingPipeline,
                "ProcDate" => $ProcDate, // date format
                "TotalRejected" => $TotalRejected,
                "InterlaceRejected" => $InterlaceRejected,
                "IntergradientRejected"  => $IntergradientRejected,
                "SlicewiseRejected" => $SlicewiseRejected,
            ],
            'files' => [
                'protocol' => $XMLprotocol,
                'report'   => $XMLreport,
                'nrrd'     => $NrrdFile,
                'nii'      => $NiiFile,
                'bval'     => $BvalFile,
                'bvec'     => $BvecFile,
                'json'     => $JsonFile,
            ],
            'HasQCPerm' => $this->_hasQCPerm(),
        ];

        return $file;
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
