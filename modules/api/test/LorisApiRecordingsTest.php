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
class LorisApiRecordingsTests extends LorisApiAuthenticationTest
{
    protected $frecordTest = "sub-OTT167_ses-V1_task-faceO_eeg.edf";
    protected $frecordTestFile = "bids_imports/Face13_BIDSVersion_1.1.0/sub-OTT167/ses-V1/eeg/sub-OTT167_ses-V1_task-faceO_eeg.edf";
    protected $visitTest  = "V1";
    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordings(): void
    {
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffile(): void
    {
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/channels
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffileChannels(): void
    {
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/channels",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
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
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/channels/meta",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/electrodes
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileElectrodes(): void
    {
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/electrodes",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
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
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/electrodes/meta",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/events
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileEvents(): void
    {
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/events/meta",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/events/meta
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileEventsMeta(): void
    {
        parent::visitTest();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/events/meta",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }
}
