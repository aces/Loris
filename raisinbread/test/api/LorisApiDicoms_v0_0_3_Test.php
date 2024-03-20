<?php

require_once __DIR__ . "/LorisApiAuthenticated_v0_0_3_Test.php";

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
 * @group      api-v0.0.3
 */
class LorisApiDicoms_v0_0_3_Test extends LorisApiAuthenticated_v0_0_3_Test
{
    protected $candidTest    = "400162";
    protected $visitTest     = "V6";
    protected $tarfileTest   = "DCM_2016-08-15_ImagingUpload-18-25-i9GRv3.tar";
    protected $processidTest = "";

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicoms(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/dicoms",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $dicomArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($dicomArray), 'array');
        $this->assertSame(gettype($dicomArray['Meta']), 'array');
        $this->assertSame(
            gettype($dicomArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($dicomArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($dicomArray['DicomArchives']),
            'array'
        );
        $this->assertSame(
            gettype($dicomArray['DicomArchives']['0']),
            'array'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']
            ),
            'array'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['ArchiveName']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['PatientName']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
            ),
            'array'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['SeriesDescription']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['SeriesNumber']
            ),
            'integer'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['EchoTime']
            ),
            'integer'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['RepetitionTime']
            ),
            'integer'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['InversionTime']
            ),
            'NULL'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['1']['InversionTime']
            ),
            'integer'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['SliceThickness']
            ),
            'integer'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['Modality']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $dicomArray['DicomArchives']['0']['SeriesInfo']['0']['SeriesUID']
            ),
            'string'
        );

        $this->assertArrayHasKey('Meta', $dicomArray);
        $this->assertArrayHasKey('CandID', $dicomArray['Meta']);
        $this->assertArrayHasKey('Visit', $dicomArray['Meta']);

        $this->assertArrayHasKey(
            'DicomArchives',
            $dicomArray
        );
        $this->assertArrayHasKey(
            '0',
            $dicomArray['DicomArchives']
        );
        $this->assertArrayHasKey(
            'ArchiveName',
            $dicomArray['DicomArchives']['0']
        );
        $this->assertArrayHasKey(
            'SeriesInfo',
            $dicomArray['DicomArchives']['0']
        );
        $this->assertArrayHasKey(
            '0',
            $dicomArray['DicomArchives']['0']['SeriesInfo']
        );
        $this->assertArrayHasKey(
            'SeriesDescription',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'SeriesDescription',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'SeriesNumber',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'EchoTime',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'RepetitionTime',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'InversionTime',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'SliceThickness',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'Modality',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
        $this->assertArrayHasKey(
            'SeriesUID',
            $dicomArray['DicomArchives']['0']['SeriesInfo']['0']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms/tarname
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicomsTarname(): void
    {
        $resource        = fopen($this->tarfileTest, 'w');
        $stream          = GuzzleHttp\Stream\Stream::factory($resource);
        try {
            $response_stream = $this->client->request(
                'GET',
                "candidates/$this->candidTest/$this->visitTest/dicoms/" .
                "$this->tarfileTest",
                [
                'headers' => $this->headers,
                'save_to' => $stream
                ]
            );
        } catch (Exception $e) {
            $this->markTestIncomplete(
                "Endpoint not found: " .
                "candidates/$this->candidTest/$this->visitTest/dicoms/" .
                "$this->tarfileTest"
            );
        }

        $this->assertEquals(200, $response_stream->getStatusCode());
        // Verify the endpoint has a body
        $body = $response_stream->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable($this->tarfileTest);
    }
}
