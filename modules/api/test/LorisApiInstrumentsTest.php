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
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrumentsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($instrumentsArray), 'array');
        $this->assertSame(
            gettype($instrumentsArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($instrumentsArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($instrumentsArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($instrumentsArray['Instruments']),
            'array'
        );
        $this->assertSame(
            gettype($instrumentsArray['Instruments']['0']),
            'string'
        );
        $this->assertSame(
            gettype($instrumentsArray['Instruments']['1']),
            'string'
        );
        $this->assertSame(
            gettype($instrumentsArray['Instruments']['2']),
            'string'
        );
        $this->assertSame(
            gettype($instrumentsArray['Instruments']['3']),
            'string'
        );
        $this->assertSame(
            gettype($instrumentsArray['Instruments']['4']),
            'string'
        );

        $this->assertArrayHasKey(
            'CandID',
            $instrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $instrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            '0',
            $instrumentsArray['Instruments']
        );
        $this->assertArrayHasKey(
            '1',
            $instrumentsArray['Instruments']
        );
        $this->assertArrayHasKey(
            '2',
            $instrumentsArray['Instruments']
        );
        $this->assertArrayHasKey(
            '3',
            $instrumentsArray['Instruments']
        );
        $this->assertArrayHasKey(
            '4',
            $instrumentsArray['Instruments']
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
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrumentsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($InstrumentsArray['Meta']['CandID']),
            'string'
        );

        $this->assertSame(
            $InstrumentsArray['Meta']['Candidate'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Visit'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['DDE'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Instrument'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['CommentID'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['UserID'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['Examiner'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['Testdate'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['Data_entry_completion_status'],
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'CommentID',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'UserID',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Examiner',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Testdate',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Data_entry_completion_status',
            $InstrumentsArray[$this->instrumentTest]
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
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
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
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
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
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrumentsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            $InstrumentsArray['Meta']['Candidate'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Visit'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['DDE'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Instrument'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Flags']['Data_entry'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Flags']['Administration'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Flags']['Validity'],
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Data_entry',
            $InstrumentsArray['Flags']
        );
        $this->assertArrayHasKey(
            'Administration',
            $InstrumentsArray['Flags']
        );
        $this->assertArrayHasKey(
            'Validity',
            $InstrumentsArray['Flags']
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
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
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
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
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
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrumentsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            $InstrumentsArray['Meta']['Candidate'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Visit'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['DDE'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Instrument'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['CommentID'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['UserID'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['Examiner'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['Testdate'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray[$this->instrumentTest]['Data_entry_completion_status'],
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrumentsArray['Meta']
        );

        $this->assertArrayHasKey(
            'CommentID',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'UserID',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Examiner',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Testdate',
            $InstrumentsArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Data_entry_completion_status',
            $InstrumentsArray[$this->instrumentTest]
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
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
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
            "candidates/$candid/$visit/instruments/$instrument/flags/dde",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
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
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $InstrumentsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            $InstrumentsArray['Meta']['Candidate'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Visit'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['DDE'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Meta']['Instrument'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Flags']['Data_entry'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Flags']['Administration'],
            'string'
        );
        $this->assertSame(
            $InstrumentsArray['Flags']['Validity'],
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Data_entry',
            $InstrumentsArray['Flags']
        );
        $this->assertArrayHasKey(
            'Administration',
            $InstrumentsArray['Flags']
        );
        $this->assertArrayHasKey(
            'Validity',
            $InstrumentsArray['Flags']
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
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
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
            "candidates/$candid/$visit/instruments/$instrument/flags/dde",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }


}
