<?php declare(strict_types=1);

namespace LORIS\instrument_manager;
use LORIS\InstrumentDataParser;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

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

                $fileName   = "${instrument}_headers.csv";
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
        if (! $request->getAttribute('user')->hasPermission(
            'instrument_manager_write'
        )
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }
        $data_file    = $request->getUploadedFiles()['data_file'];
        $request_body = (array)$request->getParsedBody();

        $fileLocation = sys_get_temp_dir() . '/' . $data_file->getClientFilename();
        $data_file->moveTo($fileLocation);  // TODO: Explore alternatives

        $userID = $request->getAttribute('user')->getUsername();

        if (isset($request_body['instrument'])) {
            $instrument = $request_body['instrument'];
            if ($this->instrumentExists($instrument)) {
                // Parse
                $dataParser = new InstrumentDataParser(
                    $instrument,
                    new SplFileInfo($fileLocation)
                );

                try {
                    $data      = $dataParser->parseCSV($this->loris);
                    $validData = $dataParser->validateData(
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

                    $result = $dataParser->insertInstrumentData(
                        $this->loris,
                        $validData['data']
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
        }

        return new \LORIS\Http\Response\JSON\BadRequest(
            'Invalid request'
        );
    }

    /**
     * Checks the test_names table for the existence of the instrument
     *
     * @param string $instrument The instrument name
     *
     * @return bool True if the name is found in the table
     */
    protected function instrumentExists(string $instrument): bool
    {
        $count = $this->loris->getDatabaseConnection()->pselectOne(
            'SELECT count(*) FROM test_names WHERE Test_name=:v_instrument',
            [':v_instrument' => $instrument]
        );
        return $count > 0;
    }

}
