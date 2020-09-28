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
class LorisApiDicomsTest extends LorisApiAuthenticatedTest
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
                gettype($dicomArray['DicomTars']),
                'array'
            );
            $this->assertSame(
                gettype($dicomArray['DicomTars']['0']),
                'array'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']
                ),
                'array'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']
                ),
                'array'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['SeriesDescription']
                ),
                'string'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['SeriesNumber']
                ),
                'integer'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['EchoTime']
                ),
                'string'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['RepetitionTime']
                ),
                'string'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['InversionTime']
                ),
                'NULL'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['1']['InversionTime']
                ),
                'string'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['SliceThickness']
                ),
                'string'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['Modality']
                ),
                'string'
            );
            $this->assertSame(
                gettype(
                    $dicomArray['DicomTars']['0']['SeriesInfo']['0']['SeriesUID']
                ),
                'string'
            );

            $this->assertArrayHasKey('Meta', $dicomArray);
            $this->assertArrayHasKey('CandID', $dicomArray['Meta']);
            $this->assertArrayHasKey('Visit', $dicomArray['Meta']);

            $this->assertArrayHasKey(
                'DicomTars',
                $dicomArray
            );
            $this->assertArrayHasKey(
                '0',
                $dicomArray['DicomTars']
            );
            $this->assertArrayHasKey(
                'Tarname',
                $dicomArray['DicomTars']['0']
            );

            $this->assertArrayHasKey(
                'SeriesInfo',
                $dicomArray['DicomTars']['0']
            );
            $this->assertArrayHasKey(
                '0',
                $dicomArray['DicomTars']['0']['SeriesInfo']
            );
            $this->assertArrayHasKey(
                'SeriesDescription',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'SeriesDescription',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'SeriesNumber',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'EchoTime',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'RepetitionTime',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'InversionTime',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'SliceThickness',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'Modality',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
            );
            $this->assertArrayHasKey(
                'SeriesUID',
                $dicomArray['DicomTars']['0']['SeriesInfo']['0']
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
        $stream          = GuzzleHttp\Psr7\stream_for($resource);
        $response_stream = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/dicoms/" .
            "$this->tarfileTest",
            [
                'headers' => $this->headers,
                'save_to' => $stream
            ]
        );
        $this->assertEquals(200, $response_stream->getStatusCode());
        // Verify the endpoint has a body
        $body = $response_stream->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable($this->tarfileTest);
    }
}
