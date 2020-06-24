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
class LorisApiInstrumentsTests extends LorisApiTests
{
    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstruments(): void
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
                    "$this->base_uri/candidates/$id/$v/instruments/",
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
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments/{instruments}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrument(): void
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
                    "$this->base_uri/candidates/$id/$v/instruments/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $instrumentsArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $instruments      = array_keys($instrumentsArray['Instruments']);
                foreach ($instruments as $instrument) {
                    $instr    = $instrumentsArray['Instruments'][$instrument];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/instruments/$instr",
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
     * TODO NOT WORKING: internal server error
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $this->guzzleLogin();
        $response = $this->client->request(
            'PATCH',
            'https://spelletier-dev.loris.ca
            /api/v0.0.3/candidates/300001/V1/instruments/aosi',
            [
                'headers' => $this->headers,
                'json'    => []
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

    /**
     * TODO NOT WORKING: internal server error
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @param string $candid candidate ID
     * @param string $visit  visit ID
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrument(
        $candid = '115788',
        $visit = 'V2'
    ): void {
        $this->guzzleLogin();
        $json     = [
            'CandID'  => $candid,
            'Visit'   => $visit,
            'Site'    => "Data Coordinating Center",
            'Battery' => "Fresh",
            'Project' => "Pumpernickel"
        ];
        $response = $this->client->request(
            'PUT',
            'https://spelletier-dev.loris.ca
            /api/v0.0.3//candidates/300001/V1/instruments/aosi',
            [
                'headers' => $this->headers,
                'json'    =>
                    [
                        'candid' => $json
                    ]
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

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments/{instruments}/flags
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentFlags(): void
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
                    "$this->base_uri/candidates/$id/$v/instruments/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $instrumentsArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $instruments      = array_keys($instrumentsArray['Instruments']);
                foreach ($instruments as $instrument) {
                    $instr    = $instrumentsArray['Instruments'][$instrument];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/instruments/$instr/flags",
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
     * TODO NOT WORKING: error 405 Not Allowed
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments/{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        $candid     = '300001';
        $visit      = 'V1';
        $instrument = 'aosi';
        $this->guzzleLogin();
        $response = $this->client->request(
            'PATCH',
            "https://spelletier-dev.loris.ca/api/v0.0.3/
            candidates/$candid/$visit/instruments/$instrument/flag",
            [
                'headers' => $this->headers,
                'json'    => []
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

    /**
     * TODO NOT WORKING: Client error 405 not allowed
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        $candid = '300001';
        $visit  = 'V1';
        $this->guzzleLogin();
        $json     = ['CandID'  => $candid,
            'Visit'   => $visit,
            'Site'    => "Data Coordinating Center",
            'Battery' => "Fresh",
            'Project' => "Pumpernickel"
        ];
        $response = $this->client->request(
            'PUT',
            "https://spelletier-dev.loris.ca/api/v0.0.3
            /candidates/$candid/$visit/instruments/aosi/flags",
            [
                'headers' => $this->headers,
                'json'    =>
                    [
                        'candid' => $json
                    ]
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

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments/{instruments}/dde
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentDde(): void
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
                    "$this->base_uri/candidates/$id/$v/instruments/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $instrumentsArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $instruments      = array_keys($instrumentsArray['Instruments']);
                foreach ($instruments as $instrument) {
                    $instr    = $instrumentsArray['Instruments'][$instrument];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/instruments/$instr/dde",
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
     * endpoint /candidates/{candid}/{visit}/instruments/{instruments}/dde/flags
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentDdeFlags():
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
                $v        = $visitsArray['Visits'][$visit];
                $response = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/instruments/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $instrumentsArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $instruments      = array_keys($instrumentsArray['Instruments']);
                foreach ($instruments as $instrument) {
                    $instr    = $instrumentsArray['Instruments'][$instrument];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/instruments/$instr/dde/flags",
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


}
