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
    protected $visitTest      = "V3";

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
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($instrArray), 'array');
        $this->assertSame(
            gettype($instrArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Instruments']),
            'array'
        );
        $this->assertSame(
            gettype($instrArray['Instruments']['0']),
            'string'
        );

        $this->assertArrayHasKey(
            'CandID',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            '0',
            $instrArray['Instruments']
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
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($instrArray['Meta']['Candidate']),
            'string'
        );

        $this->assertSame(
            gettype($instrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['DDE']),
            'boolean'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Instrument']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray[$this->instrumentTest]['CommentID']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray[$this->instrumentTest]['Testdate']),
            'string'
        );
        $this->assertSame(
            gettype(
                $instrArray[$this->instrumentTest]['Data_entry_completion_status']
            ),
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'CommentID',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'UserID',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Examiner',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Testdate',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Data_entry_completion_status',
            $instrArray[$this->instrumentTest]
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
        $json       = [
            'Meta'      => [
                'CandID'     => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => false,
                'Instrument' => $this->instrumentTest
            ],
            $this->instrumentTest => [
                'UserID' => "2"
            ]

        ];
        $response = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
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
        $json       = [
            'Meta'      => [
                'CandID'     => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => false,
                'Instrument' => $this->instrumentTest
            ],
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
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
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($instrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['DDE']),
            'boolean'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Instrument']),
            'string'
        );
        $this->assertArrayHasKey(
            'Candidate',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Data_entry',
            $instrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Administration',
            $instrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Validity',
            $instrArray['Flags']
        );
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
            "candidates/$this->candidTest/$this->visitTest/instruments/" .
            "$this->instrumentTest/dde",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($instrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['DDE']),
            'boolean'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Instrument']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray[$this->instrumentTest]['CommentID']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray[$this->instrumentTest]['Testdate']),
            'string'
        );
        $this->assertSame(
            gettype(
                $instrArray[$this->instrumentTest]['Data_entry_completion_status']
            ),
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $instrArray['Meta']
        );

        $this->assertArrayHasKey(
            'CommentID',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'UserID',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Examiner',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Testdate',
            $instrArray[$this->instrumentTest]
        );
        $this->assertArrayHasKey(
            'Data_entry_completion_status',
            $instrArray[$this->instrumentTest]
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
        $json       = [
            'Meta'      => [
                'CandID'     => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => true,
                'Instrument' => $this->instrumentTest
            ],
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
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
        $json       = [
            'Meta'      => [
                'CandID'     => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => false,
                'Instrument' => $this->instrumentTest
            ],
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
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
            "candidates/$this->candidTest/$this->visitTest/instruments/" .
            "$this->instrumentTest/dde/flags",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($instrArray['Meta']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['DDE']),
            'boolean'
        );
        $this->assertSame(
            gettype($instrArray['Meta']['Instrument']),
            'string'
        );

        $this->assertArrayHasKey(
            'Candidate',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instrument',
            $instrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Data_entry',
            $instrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Administration',
            $instrArray['Flags']
        );
        $this->assertArrayHasKey(
            'Validity',
            $instrArray['Flags']
        );
    }
}
