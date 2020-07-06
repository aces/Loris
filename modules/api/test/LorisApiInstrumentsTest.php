<?php

require_once __DIR__ . "/LorisApiAuthenticationTest.php";

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
class LorisApiInstrumentsTests extends LorisApiAuthenticationTest
{
    protected $instrumentTest = "medical_history";
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
        parent::setUp();
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
        $instrumentsMetaJson        = array_keys($instrumentsArray['Meta']);
        $instrumentsInstrumentsJson = array_keys($instrumentsArray['Instruments']);

        $this->assertArrayHasKey('CandID', $instrumentsMetaJson);
        $this->assertArrayHasKey('Visit', $instrumentsMetaJson);
        $this->assertArrayHasKey('0', $instrumentsInstrumentsJson);
        $this->assertArrayHasKey('1', $instrumentsInstrumentsJson);
        $this->assertArrayHasKey('2', $instrumentsInstrumentsJson);
        $this->assertArrayHasKey('3', $instrumentsInstrumentsJson);
        $this->assertArrayHasKey('4', $instrumentsInstrumentsJson);

        $this->assertIsString($instrumentsMetaJson['CandID']);
        $this->assertIsString($instrumentsMetaJson['Visit']);
        $this->assertIsString($instrumentsMetaJson['0']);
        $this->assertIsString($instrumentsMetaJson['1']);
        $this->assertIsString($instrumentsMetaJson['2']);
        $this->assertIsString($instrumentsMetaJson['3']);
        $this->assertIsString($instrumentsMetaJson['4']);

    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/instruments{instruments}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitInstrumentsInstrument(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrumentsInstrumentsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $instrumentsInstrumentsMetaJson = array_keys($instrumentsInstrumentsArray['Meta']);
        $instrumentsInstrumentsInstrJson     = array_keys($instrumentsInstrumentsArray[$this->instrumentTest]);

        $this->assertArrayHasKey('Candidate', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Visit', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('DDE', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Instrument', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('CommentID', $instrumentsInstrumentsInstrJson);
        $this->assertArrayHasKey('UserID', $instrumentsInstrumentsInstrJson);
        $this->assertArrayHasKey('Examiner', $instrumentsInstrumentsInstrJson);
        $this->assertArrayHasKey('Testdate', $instrumentsInstrumentsInstrJson);
        $this->assertArrayHasKey('Data_entry_completion_status', $instrumentsInstrumentsInstrJson);

        $this->assertIsString($instrumentsInstrumentsMetaJson['Candidate']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Visit']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['DDE']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Instrument']);
        $this->assertIsString($instrumentsInstrumentsInstrJson['CommentID']);
        $this->assertIsString($instrumentsInstrumentsInstrJson['UserID']);
        $this->assertIsString($instrumentsInstrumentsInstrJson['Examiner']);
        $this->assertIsString($instrumentsInstrumentsInstrJson['Testdate']);
        $this->assertIsString($instrumentsInstrumentsInstrJson['Data_entry_completion_status']);

    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrument(): void
    {
        parent::setUp();
        $candid = '300003';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'CandID'  => $candid,
                'Visit'   => $visit,
                'DDE'    => false,
                'Instrument' => $instrument],
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
     * @param string $this->candidTest candidate ID
     * @param string $visit  visit ID
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitInstrumentsInstrument(): void
    {
        parent::setUp();
        $candid = '300003';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'CandID'  => $candid,
                'Visit'   => $visit,
                'DDE'    => false,
                'Instrument' => $instrument],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response = $this->client->request(
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
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/instruments/$this->instrumentTest/flags",
            [
                 'headers' => $this->headers
             ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrumentsInstrumentsArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $instrumentsInstrumentsMetaJson  = array_keys($instrumentsInstrumentsArray['Meta']);
        $instrumentsInstrumentsFlagsJson = array_keys($instrumentsInstrumentsArray['Flags']);

        $this->assertArrayHasKey('Candidate', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Visit', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('DDE', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Instrument', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Data_entry', $instrumentsInstrumentsFlagsJson);
        $this->assertArrayHasKey('Administration', $instrumentsInstrumentsFlagsJson);
        $this->assertArrayHasKey('Validity', $instrumentsInstrumentsFlagsJson);

        $this->assertIsString($instrumentsInstrumentsMetaJson['Candidate']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Visit']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['DDE']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Instrument']);
        $this->assertIsString($instrumentsInstrumentsFlagsJson['Data_entry']);
        $this->assertIsString($instrumentsInstrumentsFlagsJson['Administration']);
        $this->assertIsString($instrumentsInstrumentsFlagsJson['Validity']);

    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentFlags(): void
    {
        parent::setUp();
        $candid = '300003';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'Candidate'  => $candid,
                'Visit'   => $visit,
                'DDE'    => false,
                'Instrument' => $instrument],
            'Flags' => [
                'Data_entry' => "2"
            ]
        ];
        $response = $this->client->request(
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
        parent::setUp();
        $candid = '300004';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'Candidate'  => $candid,
                'Visit'   => $visit,
                'DDE'    => false,
                'Instrument' => $instrument],
            'Flags' => [
                'Validity' => "2"
            ]
        ];
        $response = $this->client->request(
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
        parent::setUp();
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

        $instrumentsInstrumentsArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $instrumentsInstrumentsMetaJson  = array_keys($instrumentsInstrumentsArray['Meta']);
        $instrumentsInstrumentsDdeJson = array_keys($instrumentsInstrumentsArray[$this->instrumentTest]);

        $this->assertArrayHasKey('Candidate', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Visit', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('DDE', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Instrument', $instrumentsInstrumentsMetaJson);

        $this->assertArrayHasKey('CommentID', $instrumentsInstrumentsDdeJson);
        $this->assertArrayHasKey('UserID', $instrumentsInstrumentsDdeJson);
        $this->assertArrayHasKey('Examiner', $instrumentsInstrumentsDdeJson);
        $this->assertArrayHasKey('Testdate', $instrumentsInstrumentsDdeJson);
        $this->assertArrayHasKey('Data_entry_completion_status', $instrumentsInstrumentsDdeJson);

        $this->assertIsString($instrumentsInstrumentsMetaJson['Candidate']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Visit']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['DDE']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Instrument']);
        $this->assertIsString($instrumentsInstrumentsDdeJson['CommentID']);
        $this->assertIsString($instrumentsInstrumentsDdeJson['UserID']);
        $this->assertIsString($instrumentsInstrumentsDdeJson['Examiner']);
        $this->assertIsString($instrumentsInstrumentsDdeJson['Testdate']);
        $this->assertIsString($instrumentsInstrumentsDdeJson['Data_entry_completion_status']);

    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentDde(): void
    {
        parent::setUp();
        $candid = '300003';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'CandID'  => $candid,
                'Visit'   => $visit,
                'DDE'    => true,
                'Instrument' => $instrument],
            $instrument=> [
                'UserID' => "2"
            ]
        ];
        $response = $this->client->request(
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
        parent::setUp();
        $candid = '300003';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'CandID'  => $candid,
                'Visit'   => $visit,
                'DDE'    => false,
                'Instrument' => $instrument],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response = $this->client->request(
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

        $instrumentsInstrumentsArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $instrumentsInstrumentsMetaJson  = array_keys($instrumentsInstrumentsArray['Meta']);
        $instrumentsInstrumentsFlagsJson = array_keys($instrumentsInstrumentsArray['Flags']);

        $this->assertArrayHasKey('Candidate', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Visit', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('DDE', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Instrument', $instrumentsInstrumentsMetaJson);
        $this->assertArrayHasKey('Data_entry', $instrumentsInstrumentsFlagsJson);
        $this->assertArrayHasKey('Administration', $instrumentsInstrumentsFlagsJson);
        $this->assertArrayHasKey('Validity', $instrumentsInstrumentsFlagsJson);

        $this->assertIsString($instrumentsInstrumentsMetaJson['Candidate']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Visit']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['DDE']);
        $this->assertIsString($instrumentsInstrumentsMetaJson['Instrument']);
        $this->assertIsString($instrumentsInstrumentsFlagsJson['Data_entry']);
        $this->assertIsString($instrumentsInstrumentsFlagsJson['Administration']);
        $this->assertIsString($instrumentsInstrumentsFlagsJson['Validity']);

    }

    /**
     * Tests the HTTP PATCH request for the
     * endpoint /projects/{project}/instruments{instrument}/flag
     *
     * @return void
     */
    public function testPatchCandidatesCandidVisitInstrumentsInstrumentDdeFlags(): void
    {
        parent::setUp();
        $candid = '300003';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'CandID'  => $candid,
                'Visit'   => $visit,
                'DDE'    => false,
                'Instrument' => $instrument],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response = $this->client->request(
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
    public function testPutCandidatesCandidVisitInstrumentsInstrumentDdeFlags(): void
    {
        parent::setUp();
        $candid = '300003';
        $visit  = 'V1';
        $instrument  = 'aosi';
        $json     = [
            'Meta' => [
                'CandID'  => $candid,
                'Visit'   => $visit,
                'DDE'    => false,
                'Instrument' => $instrument],
            $instrument => [
                'UserID' => "2"
            ]
        ];
        $response = $this->client->request(
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
