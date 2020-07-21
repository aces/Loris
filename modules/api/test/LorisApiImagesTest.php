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
class LorisApiImagesTest extends LorisApiAuthenticatedTest
{
    protected $candidTest    = "676061";
    protected $visitTest     = "V4";
    protected $imagefileTest = "demo_676061_V4_t1_001.mnc";

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
     * endpoint /candidates/{candid}/{visit}/images
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImages(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/",
            [
                'headers'     => $this->headers,
                'http_errors' => false
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $imagesArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($imagesArray), 'array');
        $this->assertSame(gettype($imagesArray['Meta']), 'array');
        $this->assertSame(gettype($imagesArray['Meta']['CandID']), 'string');
        $this->assertSame(gettype($imagesArray['Meta']['Visit']), 'string');
        $this->assertSame(gettype($imagesArray['Files']), 'array');
        $this->assertSame(
            gettype($imagesArray['Files']['0']['OutputType']),
            'string'
        );
        $this->assertSame(
            gettype($imagesArray['Files']['0']['Filename']),
            'string'
        );
        $this->assertSame(
            gettype($imagesArray['Files']['0']['AcquisitionType']),
            'string'
        );

        $this->assertArrayHasKey('Meta', $imagesArray);
        $this->assertArrayHasKey('CandID', $imagesArray['Meta']);
        $this->assertArrayHasKey('Visit', $imagesArray['Meta']);
        $this->assertArrayHasKey('Files', $imagesArray);
        $this->assertArrayHasKey('OutputType', $imagesArray['Files']['0']);
        $this->assertArrayHasKey('Filename', $imagesArray['Files']['0']);
        $this->assertArrayHasKey('AcquisitionType', $imagesArray['Files']['0']);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilename(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/qc
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameQc(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/" .
            "$this->imagefileTest/qc",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $imagesArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($imagesArray),
            'array'
        );
        $this->assertSame(
            gettype($imagesArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($imagesArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($imagesArray['Meta']['Visit']),
            'string'
        );
        try {
            $this->assertSame(
                gettype($imagesArray['QC']),
                'string'
            );
        } catch (Exception $e) {
            echo 'QC is ' . gettype($imagesArray['QC']) .
                ' but shoud be "Pass". Did you reset raisinbread?';
        }
        $this->assertSame(
            gettype($imagesArray['Selected']),
            'boolean'
        );
        $this->assertSame(
            gettype($imagesArray['Caveats'][0]),
            'array'
        );
        $this->assertSame(
            gettype($imagesArray['Caveats']['0']['Severity']),
            'NULL'
        );
        $this->assertSame(
            gettype($imagesArray['Caveats']['0']['Header']),
            'NULL'
        );
        $this->assertSame(
            gettype($imagesArray['Caveats']['0']['Value']),
            'NULL'
        );
        $this->assertSame(
            gettype($imagesArray['Caveats']['0']['ValidRange']),
            'NULL'
        );
        $this->assertSame(
            gettype($imagesArray['Caveats']['0']['ValidRegex']),
            'NULL'
        );

        $this->assertArrayHasKey(
            'Meta',
            $imagesArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $imagesArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $imagesArray['Meta']
        );
        $this->assertArrayHasKey(
            'QC',
            $imagesArray
        );
        $this->assertArrayHasKey(
            'Selected',
            $imagesArray
        );
        $this->assertArrayHasKey(
            'Caveats',
            $imagesArray
        );
        $this->assertArrayHasKey(
            '0',
            $imagesArray['Caveats']
        );
        $this->assertArrayHasKey(
            'Severity',
            $imagesArray['Caveats']['0']
        );
        $this->assertArrayHasKey(
            'Header',
            $imagesArray['Caveats']['0']
        );
        $this->assertArrayHasKey(
            'Value',
            $imagesArray['Caveats']['0']
        );
        $this->assertArrayHasKey(
            'ValidRange',
            $imagesArray['Caveats']['0']
        );
        $this->assertArrayHasKey(
            'ValidRegex',
            $imagesArray['Caveats']['0']
        );
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/imaging/qc
     * TODO: NOT WORKING: the request puts QC to null, but was 'Pass' should become
     * 'pass'. Selected remains true, should be changed to false
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitImagesFilenameQc(): void
    {
        $candid   = '587630';
        $visit    = 'V1';
        $filename = 'demo_587630_V1_t1_001.mnc';
        $json     = [
            'Meta'     => [
                'CandID' => $candid,
                'Visit'  => $visit,
                'File'   => $filename
            ],
            "QC"       => 'pass',
            "Selected" => false,
            'Caveats'  => [
                '0' => [
                    'Severity'   => '',
                    'Header'     => '',
                    'Value'      => '',
                    'ValidRange' => '',
                    'ValidRegex' => ''
                ]
            ]
        ];

        $response = $this->client->request(
            'PUT',
            "candidates/$candid/$visit/images/$filename/qc",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
                'json'        => $json
            ]
        );
        // Verify the status code
        $this->assertEquals(204, $response->getStatusCode());
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/format/brainbrowser
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatBbrowser(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    // NOT WORKING : error (blank poge) ##############################

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/format/raw
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatRaw(): void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/format/thumbnail
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatThumbnail():
    void
    {
        $this->markTestSkipped('Missing data in docker image');
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/headers
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeaders(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/" .
            "$this->imagefileTest/headers",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $imagesHeadersArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($imagesHeadersArray),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Meta']['File']),
            'string'
        );

        $this->assertSame(
            gettype($imagesHeadersArray['Physical']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Physical']['TE']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Physical']['TR']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Physical']['TI']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Physical']['SliceThickness']),
            'string'
        );

        $this->assertSame(
            gettype($imagesHeadersArray['Description']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Description']['SeriesName']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Description']['SeriesDescription']),
            'string'
        );

        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['XSpace']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['XSpace']['Length']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['XSpace']['StepSize']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['YSpace']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['YSpace']['Length']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['YSpace']['StepSize']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['ZSpace']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['ZSpace']['Length']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['Dimensions']['ZSpace']['StepSize']),
            'string'
        );

        $this->assertSame(
            gettype($imagesHeadersArray['ScannerInfo']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['ScannerInfo']['Manufacturer']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['ScannerInfo']['Model']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['ScannerInfo']['SoftwareVersion']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['ScannerInfo']['SerialNumber']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersArray['ScannerInfo']['FieldStrength']),
            'string'
        );

        $this->assertArrayHasKey('Meta', $imagesHeadersArray);
        $this->assertArrayHasKey('Physical', $imagesHeadersArray);
        $this->assertArrayHasKey('Description', $imagesHeadersArray);
        $this->assertArrayHasKey('Dimensions', $imagesHeadersArray);
        $this->assertArrayHasKey('ScannerInfo', $imagesHeadersArray);

        $this->assertArrayHasKey('Meta', $imagesHeadersArray);
        $this->assertArrayHasKey('CandID', $imagesHeadersArray['Meta']);
        $this->assertArrayHasKey('Visit', $imagesHeadersArray['Meta']);
        $this->assertArrayHasKey('File', $imagesHeadersArray['Meta']);
        $this->assertArrayHasKey('TE', $imagesHeadersArray['Physical']);
        $this->assertArrayHasKey('TR', $imagesHeadersArray['Physical']);
        $this->assertArrayHasKey('TI', $imagesHeadersArray['Physical']);
        $this->assertArrayHasKey(
            'SliceThickness',
            $imagesHeadersArray['Physical']
        );
        $this->assertArrayHasKey(
            'SeriesName',
            $imagesHeadersArray['Description']
        );
        $this->assertArrayHasKey(
            'SeriesDescription',
            $imagesHeadersArray['Description']
        );
        $this->assertArrayHasKey(
            'XSpace',
            $imagesHeadersArray['Dimensions']
        );
        $this->assertArrayHasKey(
            'Length',
            $imagesHeadersArray['Dimensions']['XSpace']
        );
        $this->assertArrayHasKey(
            'StepSize',
            $imagesHeadersArray['Dimensions']['XSpace']
        );
        $this->assertArrayHasKey(
            'YSpace',
            $imagesHeadersArray['Dimensions']
        );
        $this->assertArrayHasKey(
            'Length',
            $imagesHeadersArray['Dimensions']['YSpace']
        );
        $this->assertArrayHasKey(
            'StepSize',
            $imagesHeadersArray['Dimensions']['YSpace']
        );
        $this->assertArrayHasKey(
            'YSpace',
            $imagesHeadersArray['Dimensions']
        );
        $this->assertArrayHasKey(
            'Length',
            $imagesHeadersArray['Dimensions']['YSpace']
        );
        $this->assertArrayHasKey(
            'StepSize',
            $imagesHeadersArray['Dimensions']['YSpace']
        );
        $this->assertArrayHasKey(
            'ScannerInfo',
            $imagesHeadersArray
        );
        $this->assertArrayHasKey(
            'Manufacturer',
            $imagesHeadersArray['ScannerInfo']
        );
        $this->assertArrayHasKey(
            'Model',
            $imagesHeadersArray['ScannerInfo']
        );
        $this->assertArrayHasKey(
            'SoftwareVersion',
            $imagesHeadersArray['ScannerInfo']
        );
        $this->assertArrayHasKey(
            'SerialNumber',
            $imagesHeadersArray['ScannerInfo']
        );
        $this->assertArrayHasKey(
            'FieldStrength',
            $imagesHeadersArray['ScannerInfo']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/header/full
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeadersFull(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/" .
            "$this->imagefileTest/headers/full",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $imagesHeadersFullArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertArrayHasKey(
            'Meta',
            $imagesHeadersFullArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $imagesHeadersFullArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $imagesHeadersFullArray['Meta']
        );
        $this->assertArrayHasKey(
            'File',
            $imagesHeadersFullArray['Meta']
        );
        $this->assertArrayHasKey(
            'Headers',
            $imagesHeadersFullArray
        );
        $this->assertArrayHasKey(
            'slice_thickness',
            $imagesHeadersFullArray['Headers']
        );
        $this->assertArrayHasKey(
            'acquisition:slice_order',
            $imagesHeadersFullArray['Headers']
        );
        $this->assertArrayHasKey(
            'dicom_0x0051:el_0x1011',
            $imagesHeadersFullArray['Headers']
        );
        $this->assertArrayHasKey(
            'image:vartype',
            $imagesHeadersFullArray['Headers']
        );
        $this->assertArrayHasKey(
            'acquisition:percent_sampling',
            $imagesHeadersFullArray['Headers']
        );
        $this->assertArrayHasKey(
            'dicom_0x0051:el_0x1012',
            $imagesHeadersFullArray['Headers']
        );
        $this->assertArrayHasKey(
            'dicom_0x0028:vartype',
            $imagesHeadersFullArray['Headers']
        );

    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/header/headername
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeadersHeadername():
    void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/" .
            "$this->imagefileTest/headers/headername",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $imagesHeadersHeadernameArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertArrayHasKey(
            'Meta',
            $imagesHeadersHeadernameArray
        );
        $this->assertArrayHasKey(
            'Value',
            $imagesHeadersHeadernameArray
        );
        $this->assertArrayHasKey(
            'CandID',
            $imagesHeadersHeadernameArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visit',
            $imagesHeadersHeadernameArray['Meta']
        );
        $this->assertArrayHasKey(
            'File',
            $imagesHeadersHeadernameArray['Meta']
        );
        $this->assertArrayHasKey(
            'Header',
            $imagesHeadersHeadernameArray['Meta']
        );

        $this->assertSame(
            gettype($imagesHeadersHeadernameArray),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersHeadernameArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($imagesHeadersHeadernameArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersHeadernameArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersHeadernameArray['Meta']['File']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersHeadernameArray['Meta']['Header']),
            'string'
        );
        $this->assertSame(
            gettype($imagesHeadersHeadernameArray['Value']),
            'string'
        );
    }
}
