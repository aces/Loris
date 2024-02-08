<?php

namespace LORIS\imaging_browser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Page that returns an image file data as a Json.
 * Note that much of the code was extracted, or sometimes duplicated,
 * from `ViewSession`.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class GetImageData extends \NDB_Page implements RequestHandlerInterface
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
        $file = new \MRIFile(intval($_REQUEST['fileID']));

        $sessionId = $file->getParameter('SessionID');
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
        $this->db = $this->loris->getDatabaseConnection();
        $method   = $request->getMethod();

        switch ($method) {
        case 'GET':
            return $this->_getData();
        }
    }

    /**
     * Returns a file's data as a Json response
     *
     * @return ResponseInterface The Json response.
     */
    private function _getData() : ResponseInterface
    {
        $row = $this->_getRow($_REQUEST['fileID']);
        return new \LORIS\Http\Response\JSON\OK($row);
    }

    /**
     * Returns a file's data as a Json response
     *
     * @param $fileID The file's id
     *
     * @return array The Json response.
     */
    private function _getRow($fileID)
    {
        $file = new \MRIFile(intval($fileID));

        $sessionId = $file->getParameter('SessionID');

        $timePoint = \TimePoint::singleton(
            new \SessionID($sessionId),
        );

        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();

        $FullFilename = $file->getParameter('File') ?? '';
        $ScannerID    = $file->getParameter('ScannerID');
        $FileID       = intval($fileID);
        $Filename     = basename($FullFilename);
        $APIFile      = $baseurl . "/api/v0.0.3/candidates/"
                . $timePoint->getCandID() . "/"
                . $timePoint->getVisitLabel()
                . "/images/"
                . $Filename;

        $New        = $file->getParameter('QCFirstChangeTime') == '';
        $OutputType = $file->getParameter('OutputType');
        $AcquisitionProtocol = $file->getAcquisitionProtocol();
        $CoordinateSpace     = $file->getParameter('CoordinateSpace');
        $AcquisitionDate     = $file->getParameter('AcquisitionDate');
        $ProcDate            = $file->getParameter('processing:processing_date');
        $FileInsertDate      = date("Y-m-d", $file->getParameter('InsertTime'));
        $SeriesNumber        = (int) $file->getParameter('series_number');

        $EchoTime       = round(
            (float) $file->getParameter('echo_time') * 1000,
            2
        );
        $InversionTime  = round(
            (float) $file->getParameter('inversion_time') * 1000,
            2
        );
        $RepetitionTime = round(
            (float) $file->getParameter('repetition_time') * 1000,
            2
        );

        $SliceThickness
            = round(intval($file->getParameter('slice_thickness')), 2);
        $Time           = round(intval($file->getParameter('time')), 2);
        $ImageType      = $file->getParameter('dicominfo:image_type');
        $PhaseEncodingDirection = $file->getParameter('PhaseEncodingDirection');
        $EchoNumber         = (int) $file->getParameter('echo_numbers');
        $Comment            = $file->getParameter('Comment');
        $ProcessingPipeline = $file->getParameter('processing:pipeline');
        $TotalRejected      = $file->getParameter('processing:total_rejected');
        $SourceFile         = basename(
            $file->getParameter('processing:sourceFile') ?? ''
        );
        $Tool = $file->getParameter('Tool');

        $SlicewiseRejected     = $this->_getRejected($file, 'slicewise');
        $InterlaceRejected     = $this->_getRejected($file, 'interlace');
        $IntergradientRejected = $this->_getRejected($file, 'intergradient');

        $Xstep = round((float) $file->getParameter('xstep'), 2);
        $Ystep = round((float) $file->getParameter('ystep'), 2);
        $Zstep = round((float) $file->getParameter('zstep'), 2);

        $Selected    = $this->_getSelected(
            (int) $file->getParameter('FileID')
        );
        $QCStatus    = $file->getParameter('QCStatus');
        $SNR         = $file->getParameter('SNR');
        $SeriesUID   = $file->getParameter('SeriesUID');
        $XMLreport   = $file->getParameter('processing:DTIPrepXmlReport');
        $XMLprotocol = $file->getParameter('ProtocolFile');
        $NrrdFile    = $file->getParameter('processing:nrrd_file');
        $NiiFile     = $file->getParameter('check_nii_filename');
        $BvalFile    = $file->getParameter('check_bval_filename');
        $BvecFile    = $file->getParameter('check_bvec_filename');
        $JsonFile    = $file->getParameter('bids_json_file');
        $OtherTimepoints = (int) $this->_getFilesAcrossTimepoints(
            (int)$file->getParameter('SessionID'),
            (int)$file->getParameter('AcquisitionProtocolID')
        );

        $manualCaveatViolationsResolvedID
            = $this->_getManualCaveatViolationsResolvedID($FileID);
        $caveat
            = $manualCaveatViolationsResolvedID ? true : false;
        $foundProtocolViolations = $this->_getProtocolViolations($FileID);
        $editableCaveat          = true;
        if ($foundProtocolViolations) {
            $caveat         = 1;
            $editableCaveat = false;
        }
        $file = [
            'FileID'          => $FileID,
            'Filename'        => $Filename,
            'APIFile'         => $APIFile,
            'FullFilename'    => $FullFilename,
            'New'             => $New,
            'Comment'         => $Comment,
            'SourceFile'      => $SourceFile,
            'Tool'            => $Tool,
            'Selected'        => $Selected,
            'QCStatus'        => $QCStatus,
            'Caveat'          => $caveat,
            'SNR'             => $SNR,
            'ScannerID'       => $ScannerID,
            'OtherTimepoints' => $OtherTimepoints,
            'EditableCaveat'  => $editableCaveat,
            'headers'         => [
                'SeriesUID'              => $SeriesUID,
                'Xstep'                  => $Xstep,
                'Ystep'                  => $Ystep,
                'Zstep'                  => $Zstep,
                'OutputType'             => $OutputType,
                'CoordinateSpace'        => $CoordinateSpace,
                "AcquisitionProtocol"    => $AcquisitionProtocol,
                'AcquisitionDate'        => $AcquisitionDate,
                "InsertedDate"           => $FileInsertDate,
                "SeriesNumber"           => $SeriesNumber,
                "SeriesDescription"      => $SeriesNumber,
                "SliceThickness"         => $SliceThickness,
                "RepetitionTime"         => $RepetitionTime,
                "EchoTime"               => $EchoTime,
                "InversionTime"          => $InversionTime,
                "PhaseEncodingDirection" => $PhaseEncodingDirection,
                "ImageType"              => $ImageType,
                "EchoNumber"             => $EchoNumber,
                "NumVolumes"             => $Time,
                "ProcessingPipeline"     => $ProcessingPipeline,
                "ProcDate"               => $ProcDate,
                "TotalRejected"          => $TotalRejected,
                "InterlaceRejected"      => $InterlaceRejected,
                "IntergradientRejected"  => $IntergradientRejected,
                "SlicewiseRejected"      => $SlicewiseRejected,
            ],
            'files'           => [
                'protocol' => $XMLprotocol,
                'report'   => $XMLreport,
                'nrrd'     => $NrrdFile,
                'nii'      => $NiiFile,
                'bval'     => $BvalFile,
                'bvec'     => $BvecFile,
                'json'     => $JsonFile,
            ],
            'HasQCPerm'       => $this->_hasQCPerm(),
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
