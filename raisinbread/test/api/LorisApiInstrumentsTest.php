<?php

require_once __DIR__ . "/LorisApiAuthenticatedTest.php";

/**
 * PHPUnit class for API test suite. This script sends HTTP requests to every
 * endpoints of the api module and look at the response content, status code and
 * headers where it applies. All endpoints are accessible at <host>/api/<version>/
 * (e.g. the endpoint of the version 0.0.3 of the API "/projects" URI for the host
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
    protected $instrumentTest = "aosi";
    protected $candidTest     = "300001";
    protected $visitTest      = "V1";


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

    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $json       = [];
        $response = $this->client->request(
            'PATCH',
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest",
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
        $json       = [
            $this->instrumentTest => []
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest",
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
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        $json       = [
            'Meta'  => [
                'Candidate'  => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => false,
                'Instrument' => $this->instrumentTest
            ],
            'Flags' => [
                'Data_entry' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest/flags",
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
        $json       = [
            'Meta'  => [
                'Candidate'  => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => false,
                'Instrument' => $this->instrumentTest
            ],
            'Flags' => [
                'Validity' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest/flags",
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
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest/dde",
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
            'PUT',
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest/flags/dde",
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
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidVisitInstrumentsInstrumentDdeFlags(): void
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
            'PATCH',
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest/dde/flags",
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
            "candidates/$this->candid/$this->visit/instruments/$this->instrumentTest/flags/dde",
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
