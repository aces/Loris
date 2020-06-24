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
class LorisApiRecordingsTests extends LorisApiTests
{
    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordings(): void
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
                    "$this->base_uri/candidates/$id/$v/recordings",
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffile(): void
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
                    "$this->base_uri/candidates/$id/$v/recordings",
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
                $recordFiles     = array_keys($recordingsArray['Files']);
                foreach ($recordFiles as $recordFile) {
                    $frecord  = $recordingsArray['Files'][$recordFile]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/recordings/$frecord",
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/channels
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffileChannels(): void
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
                    "$this->base_uri/candidates/$id/$v/recordings",
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
                $recordFiles     = array_keys($recordingsArray['Files']);
                foreach ($recordFiles as $recordFile) {
                    $frecord  = $recordingsArray['Files'][$recordFile]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/recordings/$frecord/channels",
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/channels/meta
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffileChannelsMeta():
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
                    "$this->base_uri/candidates/$id/$v/recordings",
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
                $recordFiles     = array_keys($recordingsArray['Files']);
                foreach ($recordFiles as $recordFile) {
                    $frecord  = $recordingsArray['Files'][$recordFile]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/recordings/$frecord/channels/meta",
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/electrodes
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileElectrodes(): void
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
                    "$this->base_uri/candidates/$id/$v/recordings",
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
                $recordFiles     = array_keys($recordingsArray['Files']);
                foreach ($recordFiles as $recordFile) {
                    $frecord  = $recordingsArray['Files'][$recordFile]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/recordings/$frecord/electrodes",
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/electrodes/meta
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileElectrodesMeta():
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
                    "$this->base_uri/candidates/$id/$v/recordings",
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
                $recordFiles     = array_keys($recordingsArray['Files']);
                foreach ($recordFiles as $recordFile) {
                    $frecord  = $recordingsArray['Files'][$recordFile]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/recordings/$frecord/electrodes/meta",
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/events
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileEvents(): void
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
            (string) utf8_encode($response->getBody()->getContents()),
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
                (string) utf8_encode($response->getBody()->getContents()),
                true
            );
            $visits      = array_keys($visitsArray['Visits']);
            foreach ($visits as $visit) {
                $v        = $visitsArray['Visits'][$visit];
                $response = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/recordings",
                    [
                        'headers' => $this->headers
                    ]
                );
                $recordingsArray = json_decode(
                    (string) utf8_encode($response->getBody()->getContents()),
                    true
                );
                $recordFiles     = array_keys($recordingsArray['Files']);
                foreach ($recordFiles as $recordFile) {
                    $frecord  = $recordingsArray['Files'][$recordFile]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/recordings/$frecord/events/meta",
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/events/meta
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileEventsMeta(): void
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
                    "$this->base_uri/candidates/$id/$v/recordings",
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
                $recordFiles     = array_keys($recordingsArray['Files']);
                foreach ($recordFiles as $recordFile) {
                    $frecord  = $recordingsArray['Files'][$recordFile]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri
                        /candidates/$id/$v/recordings/$frecord/events/meta",
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
