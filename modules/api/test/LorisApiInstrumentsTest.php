<?php

require_once __DIR__ . "/LorisApiAuthenticatedTest.php";

/**
 * PHPUnit class for API test suite. This script sends HTTP request to every
 * endpoints of the api module and look at the response content, status code and
 * headers where it applies. All endpoints are accessible at <host>/api/<version>/
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
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrument(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}/flags
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}/dde
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentDde(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentDde(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrumentDde(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }


    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}/dde/flags
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrumentDdeFlags()
    {
        $this->markTestSkipped('Missing data in docker image');
    }
}
