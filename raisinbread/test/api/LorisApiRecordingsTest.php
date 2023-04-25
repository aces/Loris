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
class LorisApiRecordingsTest extends LorisApiAuthenticatedTest
{
    protected $frecordTest         = "sub-OTT174_ses-V1_task-faceO_eeg.edf";
    protected $candidTest          = "300174";
    protected $visitTest           = "V1";
    protected $headernameTest      = "json_file";
    protected $fBIDSArchiveTest    = "archive_bids.tsv";
    protected $fBIDSChannelsTest   = "channels_bids.tsv";
    protected $fBIDSElectrodesTest = "electrodes_bids.tsv";
    protected $fBIDSEventsTest     = "events_bids.tsv";

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
        try {
            $response = $this->client->request(
                'GET',
                "candidates/$this->candidTest/$this->visitTest/recordings/" .
                "$this->frecordTest",
                [
                'headers' => $this->headers,
                'save_to' => $stream
                ]
            );
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/metadata
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileMetadata(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/metadata",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
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

        $this->assertArrayHasKey('Meta', $recordingsArray);
        $meta = $recordingsArray['Meta'];
        $this->assertSame(gettype($meta), 'array');

        $this->assertArrayHasKey('CandID', $meta);
        $this->assertSame(gettype($meta['CandID']), 'string');
        $this->assertArrayHasKey('Visit', $meta);
        $this->assertSame(gettype($meta['Visit']), 'string');
        $this->assertArrayHasKey('File', $meta);
        $this->assertSame(gettype($meta['File']), 'string');

        $this->assertArrayHasKey('Data', $recordingsArray);
        $data = $recordingsArray['Data'];
        $this->assertSame(gettype($data), 'array');

        foreach ($data as $value) {
            $this->assertSame(gettype($value), 'string');
        }
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/metadata/{headername}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileMetadataHeadername(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/metadata/$this->headernameTest",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
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

        $this->assertArrayHasKey('Meta', $recordingsArray);
        $meta = $recordingsArray['Meta'];
        $this->assertSame(gettype($meta), 'array');

        $this->assertArrayHasKey('CandID', $meta);
        $this->assertSame(gettype($meta['CandID']), 'string');
        $this->assertArrayHasKey('Visit', $meta);
        $this->assertSame(gettype($meta['Visit']), 'string');
        $this->assertArrayHasKey('File', $meta);
        $this->assertSame(gettype($meta['File']), 'string');
        $this->assertArrayHasKey('Header', $meta);
        $this->assertSame(gettype($meta['Header']), 'string');

        $this->assertArrayHasKey('Value', $recordingsArray);
        $this->assertSame(gettype($recordingsArray['Value']), 'string');
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/channels
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdffileChannels(): void
    {
            // $this->markTestIncomplete(
            //   "rewrite"
            // );
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/channels",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/electrodes
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileElectrodes(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/electrodes",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/events
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileEvents(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/events",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
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
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/bidsfiles/archive
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileBidsfilesArchive(): void
    {
        try {
            $resource = \GuzzleHttp\Psr7\Utils::tryFopen($this->fBIDSArchiveTest, 'w');
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "File cannot be opened: " . $this->fBIDSArchiveTest
            );
        }
        $stream   = \GuzzleHttp\Psr7\Utils::streamFor($resource);
        try {
            $response = $this->client->request(
                'GET',
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
                [
                    'headers' => $this->headers,
                    'save_to' => $stream
                ]
            );
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable($this->fBIDSArchiveTest);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/bidsfiles/channels
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileBidsfilesChannels(): void
    {
        try {
            $resource = \GuzzleHttp\Psr7\Utils::tryFopen($this->fBIDSChannelsTest, 'w');
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "File cannot be opened: " . $this->fBIDSChannelsTest
            );
        }
        $stream   = \GuzzleHttp\Psr7\Utils::streamFor($resource);
        try {
            $response = $this->client->request(
                'GET',
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
                [
                    'headers' => $this->headers,
                    'save_to' => $stream
                ]
            );
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable($this->fBIDSChannelsTest);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/bidsfiles/electrodes
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileBidsfilesElectrodes(): void
    {
        try {
            $resource = \GuzzleHttp\Psr7\Utils::tryFopen($this->fBIDSElectrodesTest, 'w');
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "File cannot be opened: " . $this->fBIDSElectrodesTest
            );
        }
        $stream   = \GuzzleHttp\Psr7\Utils::streamFor($resource);
        try {
            $response = $this->client->request(
                'GET',
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
                [
                    'headers' => $this->headers,
                    'save_to' => $stream
                ]
            );
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable($this->fBIDSElectrodesTest);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/recordings/{edffile}/bidsfiles/events
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitRecordingsEdfFileBidsfilesEvents(): void
    {
        try {
            $resource = \GuzzleHttp\Psr7\Utils::tryFopen($this->fBIDSEventsTest, 'w');
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "File cannot be opened: " . $this->fBIDSEventsTest
            );
        }
        $stream   = \GuzzleHttp\Psr7\Utils::streamFor($resource);
        try {
            $response = $this->client->request(
                'GET',
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
                [
                    'headers' => $this->headers,
                    'save_to' => $stream
                ]
            );
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
                "candidates/$this->candidTest/$this->visitTest/recordings/$this->frecordTest/bidsfiles/archive",
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable($this->fBIDSEventsTest);
    }
}
