<?php

require_once __DIR__ . "/LorisApiAuthenticatedTest.php";

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
class LorisApiInstrumentsTest extends LorisApiAuthenticatedTest
{
    protected $instrumentTest = "medical_history";
    protected $candidTest     = "300004";
    protected $visitTest      = "V1";

    /**
     * Call to LorisApiAuthenticationTest::setUp()
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Call to LorisApiAuthenticationTest::tearDown()
     *
     * @return void
     */
    public function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstruments(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
                "candidates/$this->candidTest/$this->visitTest/instruments"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($InstrArray), 'array');
        $this->assertSame(
            gettype($InstrArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Instruments']),
            'array'
        );
        $this->assertSame(
            gettype($InstrArray['Instruments']['0']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Instruments']['1']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Instruments']['2']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Instruments']['3']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Instruments']['4']),
            'string'
        );

        $this->assertArrayHasKey(
            'CandID',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            '0',
            $InstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            '1',
            $InstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            '2',
            $InstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            '3',
            $InstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            '4',
            $InstrArray['Instruments']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments/" .
            "$this->instrumentTest",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
                "candidates/$this->candidTest/$this->visitTest/instruments/" .
                "$this->instrumentTest"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($InstrArray['Meta']['Candidate']),
            'string'
        );

        $this->assertSame(
            gettype($InstrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['DDE']),
            'boolean'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Instrument']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray[$this->instrumentTest]['CommentID']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray[$this->instrumentTest]['Testdate']),
            'string'
        );
        $this->assertSame(
            gettype(
                $InstrArray[$this->instrumentTest]['Data_entry_completion_status']
            ),
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'CommentID',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'UserID',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Examiner',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Testdate',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Data_entry_completion_status',
            $InstrArray[$this->instrumentTest]
        );
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $candid     = '300004';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'      => [
                'CandID'     => $candid,
                'Visit'      => $visit,
                'DDE'        => false,
                'Instrument' => $instrument
            ],
            $instrument => [
                'UserID' => "2"
            ]

        ];
        $response = $this->client->request(
            'PATCH',
            "candidates/$candid/$visit/instruments/$instrument",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: PATCH" .
                "candidates/$candid/$visit/instruments/$instrument"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $candid     = '300004';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'      => [
                'CandID'     => $candid,
                'Visit'      => $visit,
                'DDE'        => false,
                'Instrument' => $instrument
            ],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$candid/$visit/instruments/$instrument",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: PUT" .
                "candidates/$candid/$visit/instruments/$instrument"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}/flags
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments/" .
            "$this->instrumentTest/flags",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/instruments/" .
                "$this->instrumentTest/flags"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($InstrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['DDE']),
            'boolean'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Instrument']),
            'string'
        );
        $this->assertArrayHasKey(
            'Candidate',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Data_entry',
            $InstrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Administration',
            $InstrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Validity',
            $InstrArray['Flags']
        );
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        $candid     = '300003';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'  => [
                'Candidate'  => $candid,
                'Visit'      => $visit,
                'DDE'        => false,
                'Instrument' => $instrument
            ],
            'Flags' => [
                'Data_entry' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$candid/$visit/instruments/$instrument/flags",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: PATCH" .
                "candidates/$candid/$visit/instruments/$instrument/flags"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        $candid     = '300004';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'  => [
                'Candidate'  => $candid,
                'Visit'      => $visit,
                'DDE'        => false,
                'Instrument' => $instrument
            ],
            'Flags' => [
                'Validity' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$candid/$visit/instruments/$instrument/flags",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: PUT" .
                "candidates/$candid/$visit/instruments/$instrument/flags"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}/dde
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentDde(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments/
                 $this->instrumentTest/dde",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/instruments/" .
                "$this->instrumentTest/dde"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($InstrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['DDE']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Instrument']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray[$this->instrumentTest]['CommentID']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray[$this->instrumentTest]['Testdate']),
            'string'
        );
        $this->assertSame(
            gettype(
                $InstrArray[$this->instrumentTest]['Data_entry_completion_status']
            ),
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrArray['Meta']
        );

        $this->assertArrayHasKey(
            'CommentID',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'UserID',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Examiner',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Testdate',
            $InstrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Data_entry_completion_status',
            $InstrArray[$this->instrumentTest]
        );
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentDde(): void
    {
        $candid     = '300003';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'      => [
                'CandID'     => $candid,
                'Visit'      => $visit,
                'DDE'        => true,
                'Instrument' => $instrument
            ],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$candid/$visit/instruments/$instrument/dde",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: PATCH" .
                "candidates/$candid/$visit/instruments/$instrument/dde"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrumentDde(): void
    {
        $candid     = '300003';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'      => [
                'CandID'     => $candid,
                'Visit'      => $visit,
                'DDE'        => false,
                'Instrument' => $instrument
            ],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$candid/$visit/instruments/$instrument/dde",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: PUT" .
                "candidates/$candid/$visit/instruments/$instrument/dde"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }


    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}/dde/flags
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentDdeFlags():
    void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments/
            $this->instrumentTest/dde/flags",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/instruments/
            $this->instrumentTest/dde/flags"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($InstrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['DDE']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Meta']['Instrument']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Flags']['Data_entry']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Flags']['Administration']),
            'string'
        );
        $this->assertSame(
            gettype($InstrArray['Flags']['Validity']),
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Data_entry',
            $InstrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Administration',
            $InstrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Validity',
            $InstrArray['Flags']
        );
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidVisitInstrumentsInstrumentDdeFlags(): void
    {
        $candid     = '300003';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'      => [
                'CandID'     => $candid,
                'Visit'      => $visit,
                'DDE'        => false,
                'Instrument' => $instrument
            ],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$candid/$visit/instruments/$instrument/dde/flags",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: GET" .
                "candidates/$candid/$visit/instruments/$instrument/dde/flags"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPutCandidVisitInstrumentsInstrumentDdeFlags(): void
    {
        $candid     = '300003';
        $visit      = 'V1';
        $instrument = 'aosi';
        $json       = [
            'Meta'      => [
                'CandID'     => $candid,
                'Visit'      => $visit,
                'DDE'        => false,
                'Instrument' => $instrument
            ],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$candid/$visit/instruments/$instrument/dde/flags",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete(
                "Endpoint not found: GET" .
                "candidates/$candid/$visit/instruments/$instrument/dde/flags"
            );
        }
        if ($response->getStatusCode() === 405) {
            $this->markTestSkipped(
                "Error 405"
            );
        }
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }


}
