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
class LorisApiRecordingsTest extends LorisApiAuthenticatedTest
{
    protected $frecordTest     = "sub-OTT174_ses-V1_task-faceO_eeg.edf";
    protected $frecordTestFile = "bids_imports/Face13_BIDSVersion_1.1.0/" .
    "sub-OTT174/ses-V1/eeg/sub-OTT174_ses-V1_task-faceO_eeg.edf";
    protected $candidTest      = "300174";
    protected $visitTest       = "V1";

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
     * endpoint /candidates/{candid}/{visit}/recordings
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordings(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $recordingsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($recordingsArray), 'array');
        $this->assertSame(gettype($recordingsArray['Meta']), 'array');
        $this->assertSame(
            gettype($recordingsArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsArray['Files']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsArray['Files']['0']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsArray['Files']['0']),
            'array'
        );

        $this->assertArrayHasKey('Meta', $recordingsArray);
        $this->assertArrayHasKey('CandID', $recordingsArray['Meta']);
        $this->assertArrayHasKey('Visit', $recordingsArray['Meta']);
        $this->assertArrayHasKey('Files', $recordingsArray);
        $this->assertArrayHasKey('0', $recordingsArray['Files']);
        $this->assertArrayHasKey('OutputType', $recordingsArray['Files']['0']);
        $this->assertArrayHasKey('Filename', $recordingsArray['Files']['0']);
        $this->assertArrayHasKey(
            'AcquisitionModality',
            $recordingsArray['Files']['0']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffile(): void
    {
        $resource = fopen($this->frecordTest, 'w');
        $stream   = GuzzleHttp\Psr7\stream_for($resource);
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/" .
            "$this->frecordTest",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
                'save_to'     => $stream
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable($this->frecordTest);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/channels
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffileChannels(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/" .
            "recordings/$this->frecordTest/channels",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest/channels"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $recChannelsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($recChannelsArray),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['ChannelName']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['ChannelDescription']),
            'NULL'
        );
        $this->assertSame(
            gettype(
                $recChannelsArray['Channels']['0']['ChannelTypeDescription']
            ),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['ChannelStatus']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['StatusDescription']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['SamplingFrequency']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['LowCutoff']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['HighCutoff']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['ManualFlag']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['Notch']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['Reference']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['Unit']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Channels']['0']['ChannelFilePath']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $recChannelsArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $recChannelsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $recChannelsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Channels',
            $recChannelsArray
        );
        $this->assertArrayHasKey(
            '0',
            $recChannelsArray['Channels']
        );
        $this->assertArrayHasKey(
            'ChannelName',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelDescription',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelTypeDescription',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelStatus',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'StatusDescription',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'SamplingFrequency',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'LowCutoff',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'HighCutoff',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ManualFlag',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'Notch',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'Reference',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'Unit',
            $recChannelsArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelFilePath',
            $recChannelsArray['Channels']['0']
        );
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
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/" .
            "$this->frecordTest/channels/meta",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest/channels/meta"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $recChannelsMetaArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($recChannelsMetaArray),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['ChannelName']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['ChannelDescription']),
            'NULL'
        );
        $this->assertSame(
            gettype(
                $recChannelsMetaArray['Channels']['0']['ChannelTypeDescription']
            ),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['ChannelStatus']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['StatusDescription']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['SamplingFrequency']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['LowCutoff']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['HighCutoff']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['ManualFlag']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['Notch']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['Reference']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['Unit']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Channels']['0']['ChannelFilePath']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $recChannelsMetaArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $recChannelsMetaArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $recChannelsMetaArray['Meta']
        );
        $this->assertArrayHasKey(
            'Channels',
            $recChannelsMetaArray
        );
        $this->assertArrayHasKey(
            '0',
            $recChannelsMetaArray['Channels']
        );
        $this->assertArrayHasKey(
            'ChannelName',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelDescription',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelTypeDescription',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelStatus',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'StatusDescription',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'SamplingFrequency',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'LowCutoff',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'HighCutoff',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ManualFlag',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'Notch',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'Reference',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'Unit',
            $recChannelsMetaArray['Channels']['0']
        );
        $this->assertArrayHasKey(
            'ChannelFilePath',
            $recChannelsMetaArray['Channels']['0']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/electrodes
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileElectrodes(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/" .
            "$this->frecordTest/electrodes",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest/electrodes"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $recChannelsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($recChannelsArray),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['ElectrodeName']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['ElectrodeType']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['ElectrodeMaterial']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['X']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['Y']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['Z']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['Impedance']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsArray['Electrodes']['0']['ElectrodeFilePath']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $recChannelsArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $recChannelsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $recChannelsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Electrodes',
            $recChannelsArray
        );
        $this->assertArrayHasKey(
            '0',
            $recChannelsArray['Electrodes']
        );
        $this->assertArrayHasKey(
            'ElectrodeName',
            $recChannelsArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'ElectrodeType',
            $recChannelsArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'ElectrodeMaterial',
            $recChannelsArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'X',
            $recChannelsArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'Y',
            $recChannelsArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'Z',
            $recChannelsArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'Impedance',
            $recChannelsArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'ElectrodeFilePath',
            $recChannelsArray['Electrodes']['0']
        );
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
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/" .
            "$this->frecordTest/electrodes/meta",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest/electrodes/meta"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $recChannelsMetaArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($recChannelsMetaArray),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']),
            'array'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['ElectrodeName']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['ElectrodeType']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['ElectrodeMaterial']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['X']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['Y']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['Z']),
            'string'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['Impedance']),
            'NULL'
        );
        $this->assertSame(
            gettype($recChannelsMetaArray['Electrodes']['0']['ElectrodeFilePath']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $recChannelsMetaArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $recChannelsMetaArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $recChannelsMetaArray['Meta']
        );
        $this->assertArrayHasKey(
            'Electrodes',
            $recChannelsMetaArray
        );
        $this->assertArrayHasKey(
            '0',
            $recChannelsMetaArray['Electrodes']
        );
        $this->assertArrayHasKey(
            'ElectrodeName',
            $recChannelsMetaArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'ElectrodeType',
            $recChannelsMetaArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'ElectrodeMaterial',
            $recChannelsMetaArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'X',
            $recChannelsMetaArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'Y',
            $recChannelsMetaArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'Z',
            $recChannelsMetaArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'Impedance',
            $recChannelsMetaArray['Electrodes']['0']
        );
        $this->assertArrayHasKey(
            'ElectrodeFilePath',
            $recChannelsMetaArray['Electrodes']['0']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/events
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileEvents(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/" .
            "$this->frecordTest/events/meta",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest/events/meta"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $recordingsEventsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($recordingsEventsArray),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['Onset']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['Duration']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['EventCode']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['EventSample']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['EventType']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['TrialType']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['ResponseTime']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsArray['TaskEvents']['0']['EventFilePath']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $recordingsEventsArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $recordingsEventsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $recordingsEventsArray['Meta']
        );
        $this->assertArrayHasKey(
            'TaskEvents',
            $recordingsEventsArray
        );
        $this->assertArrayHasKey(
            '0',
            $recordingsEventsArray['TaskEvents']
        );
        $this->assertArrayHasKey(
            'Onset',
            $recordingsEventsArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'Duration',
            $recordingsEventsArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventCode',
            $recordingsEventsArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventSample',
            $recordingsEventsArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventType',
            $recordingsEventsArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'TrialType',
            $recordingsEventsArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'ResponseTime',
            $recordingsEventsArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventFilePath',
            $recordingsEventsArray['TaskEvents']['0']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/events/meta
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileEventsMeta(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/" .
            "$this->frecordTest/events/meta",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestIncomplete("Endpoint not found: GET" .
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest/events/meta"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $recordingsEventsMetaArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($recordingsEventsMetaArray),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']),
            'array'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['Onset']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['Duration']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['EventCode']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['EventSample']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['EventType']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['TrialType']),
            'string'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['ResponseTime']),
            'NULL'
        );
        $this->assertSame(
            gettype($recordingsEventsMetaArray['TaskEvents']['0']['EventFilePath']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $recordingsEventsMetaArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $recordingsEventsMetaArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $recordingsEventsMetaArray['Meta']
        );
        $this->assertArrayHasKey(
            'TaskEvents',
            $recordingsEventsMetaArray
        );
        $this->assertArrayHasKey(
            '0',
            $recordingsEventsMetaArray['TaskEvents']
        );
        $this->assertArrayHasKey(
            'Onset',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'Duration',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventCode',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventSample',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventType',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'TrialType',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'ResponseTime',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
        $this->assertArrayHasKey(
            'EventFilePath',
            $recordingsEventsMetaArray['TaskEvents']['0']
        );
    }
}
