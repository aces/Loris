<?php

require_once __DIR__ . "LorisApiTest.php";

/**
 * PHPUnit class for API test suite. This script sends HTTP request to every enpoints
 * of the api module and look at the response content, status code and headers where
 * it applies. All endpoints are accessible at <host>/api/<version>/
 * (e.g. the endpoint of the version 0.0.3 ofd the API "/projects" URI for the host
 * "example.loris.ca" would be https://example.loris.ca/api/v0.0.3/projects)
 *
 * @category   API
 * @package    Tests
 * @subpackage Integration
 * @author     Simon Pelletier <simon.pelletier@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class LorisApiDicomsTests extends LorisApiTests
{
    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicoms(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/candidates",
            [
                'headers' => $this->headers
            ]
        );
        $candidsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $candids      = array_keys($candidsArray['Candidates']);
        foreach ($candids as $candid) {
            $id          = $candidsArray['Candidates'][$candid]['CandID'];
            $response    = $this->client->request(
                'GET',
                "$this->base_uri/candidates/$id",
                [
                    'headers' => $this->headers
                ]
            );
            $visitsArray = json_decode(
                (string) utf8_encode(
                    $response->getBody()->getContents()
                ),
                true
            );
            $visits      = array_keys($visitsArray['Visits']);
            foreach ($visits as $visit) {
                $v        = $visitsArray['Visits'][$visit];
                $response = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/dicoms/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $this->assertEquals(200, $response->getStatusCode());
                $headers = $response->getHeaders();
                $this->assertNotEmpty($headers);
                foreach ($headers as $header) {
                    $this->assertNotEmpty($header);
                    //$this->assertIsString($header[0]);
                }
                // Verify the endpoint has a body
                $body = $response->getBody();
                $this->assertNotEmpty($body);
            }
        }
    }

    /**
     * Tests the HTTP POST request for the
     * endpoint /candidates/{candid}/{visit}/dicoms
     * // TODO HANDLING OF POST HANDLING NOT IMPLEMENTED
     *
     * @return void
     */
    public function testPostCandidatesCandidVisitDicoms(): void
    {
        $this->guzzleLogin();
        $candid   = '115788';
        $visit    = 'V2';
        $response = $this->client->request(
            'POST',
            "$this->base_uri/candidates/$candid/$visit/dicoms",
            [
                'headers' => $this->headers,
                'json'    => $this->headers
            ]
        );
        $this->assertEquals(201, $response->getStatusCode());
        $headers = $response->getHeaders();
        $this->assertNotEmpty($headers);
        foreach ($headers as $header) {
            $this->assertNotEmpty($header);
            //$this->assertIsString($header[0]);
        }
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms/tarname
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicomsTarname(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/candidates",
            [
                'headers' => $this->headers
            ]
        );
        $candidsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $candids      = array_keys($candidsArray['Candidates']);
        foreach ($candids as $candid) {
            $id          = $candidsArray['Candidates'][$candid]['CandID'];
            $response    = $this->client->request(
                'GET',
                "$this->base_uri/candidates/$id",
                [
                    'headers' => $this->headers
                ]
            );
            $visitsArray = json_decode(
                (string) utf8_encode(
                    $response->getBody()->getContents()
                ),
                true
            );
            $visits      = array_keys($visitsArray['Visits']);
            foreach ($visits as $visit) {
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/dicoms",
                    [
                        'headers' => $this->headers
                    ]
                );
                $dicomsArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($dicomsArray['DicomTars']);
                foreach ($files as $file) {
                    $tar      = $dicomsArray['DicomTars'][$file]['Tarname'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/recordings/$tar",
                        [
                            'headers' => $this->headers
                        ]
                    );
                    $this->assertEquals(200, $response->getStatusCode());
                    $headers = $response->getHeaders();
                    $this->assertNotEmpty($headers);
                    foreach ($headers as $header) {
                        $this->assertNotEmpty($header);
                        //$this->assertIsString($header[0]);
                    }
                    // Verify the endpoint has a body
                    $body = $response->getBody();
                    $this->assertNotEmpty($body);
                }
            }
        }
    }

    // THESE ENDPOINTS DO NOT EXIST YET

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms/{tarname}/processes
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicomsTarnameProcesses(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/candidates",
            [
                'headers' => $this->headers
            ]
        );
        $candidsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $candids      = array_keys($candidsArray['Candidates']);
        foreach ($candids as $candid) {
            $id          = $candidsArray['Candidates'][$candid]['CandID'];
            $response    = $this->client->request(
                'GET',
                "$this->base_uri/candidates/$id",
                [
                    'headers' => $this->headers
                ]
            );
            $visitsArray = json_decode(
                (string) utf8_encode(
                    $response->getBody()->getContents()
                ),
                true
            );
            $visits      = array_keys($visitsArray['Visits']);
            foreach ($visits as $visit) {
                $v        = $visitsArray['Visits'][$visit];
                $response = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/dicoms",
                    [
                        'headers' => $this->headers
                    ]
                );
                $recordingsArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files           = array_keys($recordingsArray['DicomTars']);
                foreach ($files as $file) {
                    $tar      = $recordingsArray['DicomTars'][$file]['Tarname'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/dicoms/$tar/processes",
                        [
                            'headers' => $this->headers
                        ]
                    );
                    $this->assertEquals(200, $response->getStatusCode());
                    $headers = $response->getHeaders();
                    $this->assertNotEmpty($headers);
                    foreach ($headers as $header) {
                        $this->assertNotEmpty($header);
                        //$this->assertIsString($header[0]);
                    }
                    // Verify the endpoint has a body
                    $body = $response->getBody();
                    $this->assertNotEmpty($body);
                }
            }
        }
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms/{tarname}/processes/{processid}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicomsTarnameProcessesProcessid():
    void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/candidates",
            [
                'headers' => $this->headers
            ]
        );
        $candidsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $candids      = array_keys($candidsArray['Candidates']);
        foreach ($candids as $candid) {
            $id          = $candidsArray['Candidates'][$candid]['CandID'];
            $response    = $this->client->request(
                'GET',
                "$this->base_uri/candidates/$id",
                [
                    'headers' => $this->headers
                ]
            );
            $visitsArray = json_decode(
                (string) utf8_encode(
                    $response->getBody()->getContents()
                ),
                true
            );
            $visits      = array_keys($visitsArray['Visits']);
            foreach ($visits as $visit) {
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/dicoms/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $dicomsArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($dicomsArray['DicomTars']);
                foreach ($files as $file) {
                    $tar      = $dicomsArray['DicomTars'][$file]['Tarname'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/dicoms/$tar/processes",
                        [
                            'headers' => $this->headers
                        ]
                    );
                    $processIdsArray = json_decode(
                        (string) utf8_encode(
                            $response->getBody()->getContents()
                        ),
                        true
                    );
                    $processIDs      = array_keys($processIdsArray['DicomTars']);
                    foreach ($processIDs as $processid) {
                        $response = $this->client->request(
                            'GET',
                            "$this->base_uri/
                            candidates/$id/$v/dicoms/$tar/processes/$processid",
                            [
                                'headers' => $this->headers
                            ]
                        );
                        $this->assertEquals(
                            200,
                            $response->getStatusCode()
                        );
                        $headers = $response->getHeaders();
                        $this->assertNotEmpty($headers);
                        foreach ($headers as $header) {
                            $this->assertNotEmpty($header);
                            //$this->assertIsString($header[0]);
                        }
                        // Verify the endpoint has a body
                        $body = $response->getBody();
                        $this->assertNotEmpty($body);
                    }
                }
            }
        }
    }

}
