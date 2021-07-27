<?php
/**
 * Post method handles writing the file to the provided path.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Dataquery
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\dqt;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \GuzzleHttp\Client;
use \GuzzleHttp\Exception\RequestException;

/**
 * Post method handles writing the file to the provided path.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Dataquery
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Export extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Check user access permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Handles incoming requests to this endpoint.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case "POST":
            return $this->_handlePOST($request);

        default:
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "POST");
        }
    }

    /**
     * Handle how to operate all the files.
     * POST method export a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Open the uploaded file
        $data  = $request->getUploadedFiles()['file'] ?? null;
        $token = $request->getParsedBody()['token'] ?? null;

        if ($data === null) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Missing data.'
            );
        }

        if ($token === null) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Missing NeuroHub token.'
            );
        }

        // Parse the file into a multidimentionnal array
        $lines = str_getcsv($data->getStream()->getContents(), "\n");
        $csv   = array_map('str_getcsv', $lines);

        // Find the index of the columns that contains images url.
        $headers  = array_shift($csv);
        $keywords = [
            'mri_data,Selected_t1',
            'mri_data,Selected_bold',
            'mri_data,Selected_dwi',
            'mri_data,Selected_flair'
        ];

        // Find the headers that matches the keywords
        $image_headers = array_filter(
            $headers,
            function ($header) use ($keywords) {
                foreach ($keywords as $keyword) {
                    if (preg_match("/$keyword/i", $header) === 1) {
                        return true;
                    }
                }
            }
        );

        $filesindexes = [];
        foreach ($image_headers as $header) {
            $index = array_search($header, $headers);
            if ($index !== false) {
                $filesindexes[] = $index;
            }
        }

        if (count($headers) < count($csv[0])) {
            // When cross-sectionnal, 1 needs to be added.
            array_walk(
                $filesindexes,
                function (&$index) {
                    $index++;
                }
            );
        }

        // extract the basenames
        $basenames = [];
        foreach ($csv as &$row) {
            foreach ($filesindexes as $index) {
                $cellcontent = $row[$index] ?? '';
                $filename    = basename($cellcontent);
                if (preg_match('/.*[.]mnc/', $filename) === 1) {
                    $basenames[] = $filename;
                    $row[$index] = $filename;
                }
            }
        }

        /* Send the requests to NeuroHub.
         *
         * 1. CBRAIN file list
         * POST /nh_loris_hooks/file_list_maker
         * $payload = [
         *     'source_basenames' => An array of filenames as found on the
         *                           dataprovider.
         *     'source_dp_id'     => The id or name of the dataprovider to look
         *                           for filenames.
         *     'result_dp_id'     => The id or name of the dataprovider where to
         *                           write the output. (optional)
         *     'result_filename'  => The output filename. (optional)
         *     'result_group_id'  => The output project id or name. (optional)
         * ]
         *
         * 2. CSV
         * POST /nh_loris_hooks/csv_data_maker
         * $payload = [
         *     'table_content'   => A two dimentional array (the csv content).
         *     'result_dp_id'    => The id or name of the dataprovider where to
         *                          write the output. (optional)
         *     'result_filename' => The output filename. (optional)
         *     'result_group_id' => The output project id or name. (optional)
         * ]
         */
        $client  = new Client(['base_uri' => 'https://portal.cbrain.mcgill.ca']);
        $payload = [
            'source_basenames' => $basenames,
            'source_dp_id'     => 222,
        ];

        try {
            $response = $client->request(
                'POST',
                'nh_loris_hooks/file_list_maker',
                [
                    'query'   => 'cbrain_api_token=' . $token,
                    'body'    => json_encode($payload),
                    'headers' => [
                        'Accept'       => 'application/json',
                        'Content-type' => 'application/json',
                    ],
                ],
            );
        } catch (RequestException $e) {
            $message = 'Export failed';
            if ($e->hasResponse()) {
                $status = $e->getResponse()->getStatusCode();
                $reason = $e->getResponse()->getReasonPhrase();
                $body   = $e->getResponse()->getBody()->getContents();
                error_log("$message: $status $reason : $body");
                return new \LORIS\Http\Response\JsonResponse($message, $status);
            }
            return new \LORIS\Http\Response\JSON\InternalServerError($message);
        }

        $images_location = $response->getHeaderLine('Location');

        $table = $this->_buildTable($headers, $csv);

        $payload = [
            'table_content' => $table,
        ];

        try {
            $response = $client->request(
                'POST',
                'nh_loris_hooks/csv_data_maker',
                [
                    'query'   => 'cbrain_api_token=' . $token,
                    'body'    => json_encode($payload),
                    'headers' => [
                        'Accept'       => 'application/json',
                        'Content-type' => 'application/json',
                    ],
                ],
            );
        } catch (RequestException $e) {
            $message = 'Export failed';
            if ($e->hasResponse()) {
                $status = $e->getResponse()->getStatusCode();
                $reason = $e->getResponse()->getReasonPhrase();
                $body   = $e->getResponse()->getBody()->getContents();
                error_log("$message: $status $reason : $body");
                return new \LORIS\Http\Response\JsonResponse($message, $status);
            }
            return new \LORIS\Http\Response\JSON\InternalServerError($message);
        }

        $data_location = $response->getHeaderLine('Location');

        return new \LORIS\Http\Response\JSON\OK(
            [
                'images_location' => $images_location,
                'data_location'   => $data_location
            ]
        );
    }

    /**
     * Formats the table content to make sure headers and data columns are aligned.
     *
     * @param array $headers An array of string to put in the first row.
     * @param array $csv     The table content in a two dimentional array.
     *
     * @return array A two dimentional array with headers in the first row.
     */
    private function _buildTable(array $headers, array $csv) : array
    {
        if (count($headers) < count($csv[0])) {
            // When cross-sectionnal, a visit header needs to be added.
            array_shift($headers);
            array_unshift($headers, 'candid', 'visit');
        }
         $headers[0] = 'candid';
         return array_merge([$headers], $csv);
    }
}
