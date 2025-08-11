<?php declare(strict_types=1);

namespace LORIS\instrument_manager;
use LORIS\InstrumentDataParser;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \SplFileInfo;
use LORIS\server_processes_manager as SP;


/**
 * Upload instrument data
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Instrument_Data extends \NDB_Page
{
    const PERMISSIONS = [
        'instrument_manager_read'
    ];

    const MAX_FILE_BYTES = 1000 * 1000 * 512;  // 512 MB -- TODO: Config?

    /**
     * Checking permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(self::PERMISSIONS);
    }

    /**
     * Handle a PSR7 Request for that endpoint.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $method = $request->getMethod();
        if ($method == 'POST') {
            return $this->handlePOST($request);
        } else if ($method == 'GET') {
            return $this->handleGET($request);
        }

        return parent::handle($request);
    }

    /**
     * Handle a GET requests
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     * @throws \NotFound|\LorisException
     */
    protected function handleGET(ServerRequestInterface $request): ResponseInterface
    {
        $params  = $request->getQueryParams();
        $headers = [];

        if (isset($params['action'])) {
            $action = $params['action'];
            if (isset($params['instrument'])) {
                $instrument = $params['instrument'];

                if ($this->instrumentExists($instrument)) {
                    $headers = InstrumentDataParser::getCSVHeaders(
                        $this->loris,
                        $instrument,
                        $action === 'CREATE_SESSIONS'
                    );
                } else {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        "$instrument does not exist"
                    );
                }
                $fileName = "{$instrument}_headers.csv";
            } else if (isset($params['instruments'])) {
                $instruments = $params['instruments'];
                foreach ($instruments as $instrument) {
                    if ($this->instrumentExists($instrument)) {
                        error_log("checking $instrument");
                        $headers = array_unique(
                            array_merge(
                                $headers,
                                InstrumentDataParser::getCSVHeaders(
                                    $this->loris,
                                    $instrument,
                                    $action === 'CREATE_SESSIONS'
                                )
                            )
                        );
                        error_log("MERGING $instrument");
                    } else {
                        error_log("$instrument does not exist");
                        return new \LORIS\Http\Response\JSON\BadRequest(
                            "$instrument does not exist"
                        );
                    }
                }
                $prefix   = time();
                $fileName = "{$prefix}_headers.csv";
            } else {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid request'
                );
            }

            $fileObject = new \SplFileObject(
                sys_get_temp_dir() . "/$fileName",
                'w'
            );
            $fileObject->fputcsv($headers);

            $downloader = new \LORIS\FilesDownloadHandler(
                new \SPLFileInfo(sys_get_temp_dir())
            );
            return $downloader->handle(
                $request->withAttribute('filename', $fileName)
            );
        }
        return parent::handle($request);
    }


    /**
     * Handle a POST requests
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    protected function handlePOST(
        ServerRequestInterface $request
    ): ResponseInterface {
        // Ensure the user is allowed to upload.
        if (!$request->getAttribute('user')->hasPermission(
            'instrument_manager_write'
        )
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        $requestBody = (array) $request->getParsedBody();

        if (!isset($requestBody['action'])
            || !in_array(
                $requestBody['action'],
                ['VALIDATE_SESSIONS', 'CREATE_SESSIONS']
            )
        ) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'You must select an action'
            );
        }

        $createNonexistent
            = $requestBody['action'] === 'CREATE_SESSIONS';

        if (isset($requestBody['instrument'])
            || isset($requestBody['multi-instrument'])
        ) {
            $multiInstrument = isset($requestBody['multi-instrument']);
            $instrumentNames = [];
            if ($multiInstrument) {
                $instrumentNames = array_map(
                    function ($instrument) {
                        return $instrument['value'];
                    },
                    json_decode($requestBody['multi-instrument'], true)
                );
            }

            $dataFile     = $request->getUploadedFiles()['data_file'];
            $userID       = $request->getAttribute('user')->getUsername();
            $uploadFolder = $this->loris
                ->getConfiguration()->getSetting('instrumentDataPath');
            $filePrefix   = $userID . '_' . time() . '_';
            $fileLocation = $uploadFolder . "/$filePrefix"
                . $dataFile->getClientFilename();
            $fileInfo     = new SplFileInfo($fileLocation);

            $dataFile->moveTo($fileLocation);
            $this->_insertCSVFileEntry($fileInfo->getFilename());

            $instrumentName = $requestBody['instrument'];

            if ($fileInfo->getSize() > self::MAX_FILE_BYTES) {
                // Run as background task
                $serverProcessLauncher = new SP\ServerProcessLauncher();

                if ($multiInstrument) {
                    $serverProcessLauncher->parseInstrumentData(
                        implode('{@}', $instrumentNames),
                        $fileLocation,
                        $createNonexistent,
                        true
                    );
                } else {
                    $serverProcessLauncher->parseInstrumentData(
                        $instrumentName,
                        $fileLocation,
                        $createNonexistent,
                        false
                    );
                }

                $result = [
                    'success' => true,
                    'message' => "Due to the relatively large size of the " .
                        "uploaded file, the process will being run " .
                        "asynchronously in the background. You will receive " .
                        "an email once completed."

                ];
                return new \LORIS\Http\Response\JSON\Created($result);
            }

            try {
                $dataParser = new InstrumentDataParser($fileInfo);

                if ($multiInstrument) {
                    try {
                        $result = $dataParser->parseCSVMulti(
                            $this->loris,
                            $instrumentNames,
                            $userID,
                            $createNonexistent
                        );
                        return new \LORIS\Http\Response\JSON\Created($result);
                    } catch (\RuntimeException $e) {
                        return new \LORIS\Http\Response\JSON\OK(
                            [
                                'success' => false,
                                'message' => $e->getMessage()
                            ]
                        );
                    }
                } else {

                    if ($this->instrumentExists($instrumentName)) {

                        $data = $dataParser->parseCSV(
                            $this->loris,
                            $instrumentName,
                            $createNonexistent
                        );

                        $studyIDs = [];
                        if ($createNonexistent) {
                            $studyIDs = array_reduce(
                                $data,
                                function ($mapping, $row) {
                                    $studyID = $row['StudyID'];
                                    if (!in_array($studyID, $mapping)) {
                                        $mapping[] = $studyID;
                                    }
                                    return $mapping;
                                },
                                []
                            );
                        }

                        $db = $this->loris->getDatabaseConnection();
                        $db->beginTransaction();

                        $validData = $dataParser->validateData(
                            $data,
                            [
                                'UserID'   => $userID,
                                'Examiner' => $userID
                            ],
                            $createNonexistent
                        );

                        if (count($validData['errors']) > 0) {
                            $db->rollBack();    // Rollback created sessions
                            return new \LORIS\Http\Response\JSON\OK(
                                [
                                    'message' => $validData['errors'],
                                ]
                            );
                        }

                        $result = InstrumentDataParser::insertInstrumentData(
                            $this->loris,
                            $validData['data'],
                            $instrumentName,
                            $fileInfo->getFilename()
                        );

                        if ($result['success']) {
                            if ($createNonexistent) {
                                $studyIDMapping = $db->pselect(
                                    'SELECT ExtStudyID, CandID
                            FROM candidate_project_extid_rel
                            WHERE ExtStudyID IN (' .
                                    join(
                                        ',',
                                        array_map(
                                            function ($id) {
                                                return "'$id'";
                                            },
                                            $studyIDs
                                        )
                                    ) .
                                    ')',
                                    [],
                                );

                                $result['idMapping'] = $studyIDMapping;
                            }

                            $db->commit();
                            return new \LORIS\Http\Response\JSON\Created($result);
                        }

                        $db->rollBack();
                        return new \LORIS\Http\Response\JSON\OK(
                            [
                                'success' => false,
                                'message' => $result['message']
                            ]
                        );
                    } else {
                        return new \LORIS\Http\Response\JSON\BadRequest(
                            'Instrument does not exist'
                        );
                    }
                }
            } catch (\Exception $e) {
                return new \LORIS\Http\Response\JSON\OK(
                    [
                        'success' => false,
                        'message' => $e->getMessage()
                    ]
                );
            }
        }

        return new \LORIS\Http\Response\JSON\BadRequest(
            'Invalid request'
        );
    }

    /**
     * Checks the test_names table for the existence of the instrument
     *
     * @param string $instrumentName The instrument name
     *
     * @return bool True if the name is found in the table
     */
    protected function instrumentExists(string $instrumentName): bool
    {
        $count = $this->loris->getDatabaseConnection()->pselectOne(
            'SELECT count(*) FROM test_names WHERE Test_name=:v_instrument',
            [':v_instrument' => $instrumentName]
        );
        return $count > 0;
    }

    /**
     * Insert entry for CSV file
     *
     * @param string $filename The file name
     *
     * @return void
     */
    private function _insertCSVFileEntry($filename)
    {
        $this->loris->getDatabaseConnection()->insert(
            'instrument_data_files',
            [
                'FilePath' => $filename,
            ]
        );
    }
}
