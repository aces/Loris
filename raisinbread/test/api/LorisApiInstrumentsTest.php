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
 * @group      api-v0.0.4-dev
 */
class LorisApiInstrumentsTest extends LorisApiAuthenticatedTest
{
    protected $instrumentTest = "testtest";
    protected $candidTest     = "900000";
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

    /**
     * Tests the HTTP POST request for the
     * endpoint /candidates/{candid}/{visit}/instruments
     *
     * @return void
     */
    public function testPostCandidatesCandidVisitInstruments(): void
    {
        // Remove all instruments from this CandID.
        $SessionID = $this->DB->pselectOne(
            "SELECT ID FROM session WHERE Visit_label=:VL AND CandID=:Candidate",
            [
                'VL' => $this->visitTest,
                'Candidate' => $this->candidTest
            ]
        );
        $this->DB->delete("flag", ['SessionID' => $SessionID]);

        // Insert one
        $json_data = [
            'Meta' => [
                'CandID' => $this->candidTest,
                'Visit' => $this->visitTest,
            ],
            "Instruments" => [ 'bmi' ],
        ];
        $response = $this->client->request(
            'POST',
            "candidates/$this->candidTest/$this->visitTest/instruments",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'    => $json_data,
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
        $this->assertEquals($instrArray['Instruments'], ['bmi']);

        // Insert another and make sure they are both there now.
        $json_data = [
            'Meta' => [
                'CandID' => $this->candidTest,
                'Visit' => $this->visitTest,
            ],
            "Instruments" => [ 'testtest' ],
        ];
        $response = $this->client->request(
            'POST',
            "candidates/$this->candidTest/$this->visitTest/instruments",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'    => $json_data,
            ]
        );
        $instrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($instrArray['Instruments'], ['bmi', 'testtest']);
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

        $bodystr = $response->getBody()->getContents();
        $this->assertNotEmpty($bodystr);
        $InstrumentsArray = json_decode(
            (string) utf8_encode($bodystr),
            true
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
            'Instrument',
            $InstrumentsArray['Meta']
        );
        $this->assertArrayHasKey(
            'DDE',
            $InstrumentsArray['Meta']
        );

        $this->assertSame($InstrumentsArray['Meta']['DDE'], false);
        $this->assertSame($InstrumentsArray['Meta']['Candidate'], $this->candidTest);
        $this->assertSame($InstrumentsArray['Meta']['Visit'], $this->visitTest);
        $this->assertSame($InstrumentsArray['Meta']['Instrument'], $this->instrumentTest);

        $this->assertArrayHasKey('Data', $InstrumentsArray);
        $this->assertNotEmpty($InstrumentsArray['Data']);
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $json = [
            'Data' => [
                'UserID' => "2"
            ]
        ];
        $response = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody()->getContents();
        //print "body: $body";
        $this->assertEmpty($body);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $json = [
            'Data' => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
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
     * endpoint /candidates/{candid}/{visit}/instruments/{instruments}/flags
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
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}/flag
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
                'Data_entry'     => 'Complete',
                'Administration' => 'All',
                'Validity'       => 'Invalid' 
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/flags",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        // Test that it should be forbidden to modify an instrument that is flagged as Complete
        $json = [
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
            [
                'headers' => $this->headers,
                'json'    => $json,
                'http_errors' => false
            ]
        );
        $this->assertEquals(403, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        // This will test that it should be forbidden to modify an instrument that is flagged as Complete
        $json = [
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
            [
                'headers' => $this->headers,
                'json'    => $json,
                'http_errors' => false
            ]
        );
        $this->assertEquals(403, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}
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
                'Data_entry'     => 'Complete',
                'Administration' => 'Partial',
                'Validity'       => 'Questionable' 
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/flags",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        // This will test that it should be forbidden to modify an instrument that is flagged as Complete
        $json = [
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
            [
                'headers' => $this->headers,
                'json'    => $json,
                'http_errors' => false
            ]
        );
        $this->assertEquals(403, $response->getStatusCode());
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
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments/" .
                 "$this->instrumentTest/dde",
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
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}/flag
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
            'Data' => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde",
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
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}
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
            'Data' => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde",
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
     * endpoint /candidates/{candid}/{visit}/instruments/{instruments}/dde/flags
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
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidVisitInstrumentsInstrumentDdeFlags(): void
    {
        $json       = [
            'Meta'  => [
                'Candidate'  => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => false,
                'Instrument' => $this->instrumentTest
            ],
            'Flags' => [
                'Data_entry'     => 'Complete',
                'Administration' => 'All',
                'Validity'       => 'Valid' 
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde/flags",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        // This will test that it should be forbidden to modify an instrument that is flagged as Complete
        $json = [
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PATCH',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde",
            [
                'headers' => $this->headers,
                'json'    => $json,
                'http_errors' => false
            ]
        );
        $this->assertEquals(403, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/instruments/{instrument}
     *
     * @return void
     */
    public function testPutCandidVisitInstrumentsInstrumentDdeFlags(): void
    {
        $json       = [
            'Meta'  => [
                'Candidate'  => $this->candidTest,
                'Visit'      => $this->visitTest,
                'DDE'        => false,
                'Instrument' => $this->instrumentTest
            ],
            'Flags' => [
                'Data_entry'     => 'Complete',
                'Administration' => 'All',
                'Validity'       => 'Valid' 
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde/flags",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        // This will test that it should be forbidden to modify an instrument that is flagged as Complete
        $json = [
            $this->instrumentTest => [
                'UserID' => "2"
            ]
        ];
        $response   = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/dde",
            [
                'headers' => $this->headers,
                'json'    => $json,
                'http_errors' => false
            ]
        );
        $this->assertEquals(403, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);


    }

}
