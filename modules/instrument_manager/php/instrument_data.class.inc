<?php declare(strict_types=1);

namespace LORIS\instrument_manager;
use LORIS\InstrumentDataParser;
use LORIS\RedcapCSVParser;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \SplFileInfo;
use LORIS\server_processes_manager as SP;

require_once 'RedcapCSVParser.class.inc';
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
        $params = $request->getQueryParams();
        if (isset($params['instrument'])) {
            $instrument = $params['instrument'];

            if ($this->instrumentExists($instrument)) {
                $headers = InstrumentDataParser::getCSVHeaders(
                    $this->loris,
                    $instrument
                );

                $fileName   = "{$instrument}_headers.csv";
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

            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid request'
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

        if (isset($requestBody['instrument'])) {
            $instrumentName = $requestBody['instrument'];
            if ($this->instrumentExists($instrumentName)) {
                $dataFile = $request->getUploadedFiles()['data_file'];
                $userID   = $request->getAttribute('user')->getUsername();

                $uploadFolder = $this->loris
                    ->getConfiguration()->getSetting('instrumentDataPath');
                $filePrefix   = $userID . '_' . time() . '_';
                $fileLocation = $uploadFolder . "/$filePrefix"
                    . $dataFile->getClientFilename();
                $dataFile->moveTo($fileLocation);

                $fileInfo = new SplFileInfo($fileLocation);
                $this->_insertCSVFileEntry($fileInfo->getFilename());

                if ($fileInfo->getSize() > self::MAX_FILE_BYTES) {
                    // Run as background task
                    $serverProcessLauncher = new SP\ServerProcessLauncher();
                    $serverProcessLauncher->parseInstrumentData(
                        $instrumentName,
                        $fileLocation,
                    );

                    $result = [
                        'success' => true,
                        'message' => "Due to the relatively large size of the " .
                            "uploaded file, the process will being run " .
                            "asynchronously in the background. You will receive " .
                            "an email once completed."

                    ];
                    return new \LORIS\Http\Response\JSON\Created($result);
                }

                // Parse
                try {
                    $dataParser = new InstrumentDataParser(
                        $instrumentName,
                        $fileInfo,
                    );
                    $data       = $dataParser->parseCSV($this->loris);

                    $validData  = $dataParser->validateData(
                        $data,
                        [
                            'UserID'   => $userID,
                            'Examiner' => $userID
                        ]
                    );

                    if (count($validData['errors']) > 0) {
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

                    return new \LORIS\Http\Response\JSON\Created($result);
                } catch (\Exception $e) {
                    return new \LORIS\Http\Response\JSON\OK(
                        [
                            'message' => $e->getMessage()
                        ]
                    );
                }
            }

            return new \LORIS\Http\Response\JSON\BadRequest(
                'Instrument does not exist'
            );
        } else if (isset($requestBody['multi-instrument'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Multi-instrument not yet implemented'
            );
//            $dataParser = new RedcapCSVParser(
//                $fileInfo,
//            );
//            $result       = $dataParser->parseDataCSV($this->loris, ['bmi'], $userID);
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
