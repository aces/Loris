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
class LorisApiImagesTests extends LorisApiAuthenticationTest
{
    protected $candidTest = "300167";
    protected $imagefileTest = "demo_400162_V6_t1_001.mnc";
    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImages(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/",
            [
                'headers' => $this->headers
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
        $imagesMetaJson   = array_keys($imagesArray['Meta']);
        $imagesFilesJson   = array_keys($imagesArray['Files'][0]);
        // Test if body contains:
        // Meta:
        //      CandID: "115788"
        //      Visit: 'V3"
        // Files: [] if no files, otherwise
        // Files:
        //      #:
        //          OutputType	"native"
        //          Filename	"demo_115788_V3_t1_001.mnc"
        //          AcquisitionType	"t1"

        $this->assertArrayHasKey('CandID', $imagesMetaJson);
        $this->assertArrayHasKey('Visit', $imagesMetaJson);
        $this->assertArrayHasKey('OutputType', $imagesFilesJson);
        $this->assertArrayHasKey('Filename', $imagesFilesJson);
        $this->assertArrayHasKey('AcquisitionType', $imagesFilesJson);

        $this->assertIsString($imagesMetaJson['CandID']);
        $this->assertIsString($imagesMetaJson['Visit']);
        $this->assertIsString($imagesMetaJson['OutputType']);
        $this->assertIsString($imagesMetaJson['Filename']);
        $this->assertIsString($imagesMetaJson['AcquisitionType']);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilename(): void
    {
        parent::setUp();
        $resource = fopen($this->imagefileTest, 'w');
        $stream   = GuzzleHttp\Psr7\stream_for($resource);
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest",
            [
                'headers' => $this->headers,
                'save_to' => $stream
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        # TODO: HOW TO TEST IMAGE?
    }

    /**
     * Download an image with
     * endpoint /candidates/{candid}/{visit}/images/{filename}
     *
     * @param string $this->candidTest    candidate ID
     * @param string $visit visit ID
     *
     * @return void
     */
    private function _downloadCandidatesCandidVisitImagesFilename(): void
    {
        if (!file_exists('/images')) {
            mkdir('/images');
        }
        $tarname  = "demo_$this->candidTest\_$visit\_t1_001.mnc";
        $resource = fopen("/images/$tarname", 'w');
        $stream   = GuzzleHttp\Psr7\stream_for($resource);
        $this->client->request(
            'GET',
            "$this->candidTest/$visit/images/$tarname",
            [
                'headers' => $this->headers,
                'save_to' => $stream
            ]
        );
    }

    /**
     * Download an image with endpoint /candidates/{candid}/{visit}/dicoms/{tarname}
     *
     * @param string $this->candidTest    candidate ID
     * @param string $visit visit ID
     *
     * @return void
     */
    private function _downloadCandidatesCandidVisitDicomTarname(): void {
        if (!file_exists('dicoms')) {
            mkdir('dicoms');
        }
        $tarName  = "DCM_2018-04-20_ImagingUpload-14-25-U1OlWq.tar";
        $resource = fopen("dicoms/$tarName", 'w');
        $stream   = GuzzleHttp\Psr7\stream_for($resource);
        $this->client->request(
            'GET',
            "candidates/$this->candidTest/$visit/dicoms/$tarName",
            [
                'headers' => $this->headers,
                'save_to' => $stream
            ]
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/qc
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameQc(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest/qc",
            [
                'headers' => $this->headers
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
        $imagesMetaJson   = array_keys($imagesArray['Meta']);
        $imagesCaveatsJson   = array_keys($imagesArray['Caveats'][0]);
        // Test if body contains:
        // Meta:
        //      CandID: "115788"
        //      Visit: 'V3"
        //      File: "demo_115788_V3_t1_001.mnc"
        // Qc: null
        // Selected null:
        // Caveats null:
        //      #:
        //          Severity	null
        //          Header	null
        //          Value	null
        //          ValidRange	null
        //          ValidRegex	null
        $this->assertArrayHasKey('CandID', $imagesMetaJson);
        $this->assertArrayHasKey('Visit', $imagesMetaJson);
        $this->assertArrayHasKey('File', $imagesMetaJson);
        $this->assertArrayHasKey('Severity', $imagesCaveatsJson);
        $this->assertArrayHasKey('Header', $imagesCaveatsJson);
        $this->assertArrayHasKey('Value', $imagesCaveatsJson);
        $this->assertArrayHasKey('ValidRange', $imagesCaveatsJson);
        $this->assertArrayHasKey('ValidRegex', $imagesCaveatsJson);

        $this->assertIsString($imagesMetaJson['CandID']);
        $this->assertIsString($imagesMetaJson['Visit']);
        $this->assertIsString($imagesMetaJson['File']);

    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/imaging/qc
     * TODO WILL RESULT IN ERROR; got the error
     * TODO "error":"Candidate from URL does not match JSON metadata."
     * Error in: /modules/api/php/endpoints/candidate/visit/image/qc.class.inc
     *
     * @param string $candid Candidate ID
     * @param string $visit  visit ID
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitImagesFilenameQc(): void {
        parent::setUp();
        $candid = '400162';
        $visit = 'V6';
        $site = 'Rome';
        $project = "Pumpernickel";
        $filename = 'demo_400162_V6_t1_001.mnc';
        $json     = [
            'Meta'  =>
                [
                    'CandID'   => $candid,
                    'Visit'   => $visit,
                    'File'    => $filename
        ],
            "QC" => 'pass',
            "Selected" => true,
            "Caveats" => [
                'Severity' => 'High'
            ]
        ];
        $response = $this->client->request(
            'PUT',
            "candidates/$candid/$visit/images/$filename/qc",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        // Verify the status code
        $this->assertEquals(201, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $response = $this->client->request(
            'PUT',
            "candidates/$candid/$visit",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        // Verify the status code; should be 204 because it was just created,
        // so it already exists
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
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest/format/brainbrowser",
            [
                'headers' => $this->headers
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
        $imagesMetaJson   = array_keys($imagesArray['Meta']);
        $imagesCaveatsJson   = array_keys($imagesArray['Caveats'][0]);
        // Test if body contains:
        // Meta:
        //      CandID: "115788"
        //      Visit: 'V3"
        //      File: "demo_115788_V3_t1_001.mnc"
        // Qc: null
        // Selected null:
        // Caveats null:
        //      #:
        //          Severity	null
        //          Header	null
        //          Value	null
        //          ValidRange	null
        //          ValidRegex	null
        $this->assertArrayHasKey('CandID', $imagesMetaJson);
        $this->assertArrayHasKey('Visit', $imagesMetaJson);
        $this->assertArrayHasKey('File', $imagesMetaJson);
        $this->assertArrayHasKey('Severity', $imagesCaveatsJson);
        $this->assertArrayHasKey('Header', $imagesCaveatsJson);
        $this->assertArrayHasKey('Value', $imagesCaveatsJson);
        $this->assertArrayHasKey('ValidRange', $imagesCaveatsJson);
        $this->assertArrayHasKey('ValidRegex', $imagesCaveatsJson);

        $this->assertIsString($imagesMetaJson['CandID']);
        $this->assertIsString($imagesMetaJson['Visit']);
        $this->assertIsString($imagesMetaJson['File']);

    }

    ############################# NOT WORKING : error (blank poge) ##############################

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/format/raw
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatRaw(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest/format/raw",
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
     * endpoint /candidates/{candid}/{visit}/images/filename/format/thumbnail
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatThumbnail():
    void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest/format/thumbnail",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $this->assertFileIsReadable('demo_115788_V3_t1_001_151_check.jpg');
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/headers
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeaders(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest/headers",
            [
                'headers' => $this->headers
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

        $this->assertArrayHasKey('Meta', $imagesHeadersArray);
        $this->assertArrayHasKey('Physical', $imagesHeadersArray);
        $this->assertArrayHasKey('Description', $imagesHeadersArray);
        $this->assertArrayHasKey('Dimensions', $imagesHeadersArray);
        $this->assertArrayHasKey('ScannerInfo', $imagesHeadersArray);

        $imagesHeadersMetaJson   = array_keys($imagesHeadersArray['Meta']);
        $imagesHeadersPhysicalJson   = array_keys($imagesHeadersArray['Physical']);
        $imagesHeadersDescriptionJson   = array_keys($imagesHeadersArray['Description']);
        $imagesHeadersDimensionsJson   = array_keys($imagesHeadersArray['Dimensions']);
        $imagesHeadersScannerInfoJson   = array_keys($imagesHeadersArray['ScannerInfo']);
        $imagesHeadersScannerInfoXJson   = array_keys($imagesHeadersArray['ScannerInfo']['XSpace']);
        $imagesHeadersScannerInfoYJson   = array_keys($imagesHeadersArray['ScannerInfo']['YSpace']);
        $imagesHeadersScannerInfoZJson   = array_keys($imagesHeadersArray['ScannerInfo']['ZSpace']);

        $this->assertArrayHasKey('CandID', $imagesHeadersMetaJson);
        $this->assertArrayHasKey('Visit', $imagesHeadersMetaJson);
        $this->assertArrayHasKey('File', $imagesHeadersMetaJson);
        $this->assertArrayHasKey('TE', $imagesHeadersPhysicalJson);
        $this->assertArrayHasKey('TR', $imagesHeadersPhysicalJson);
        $this->assertArrayHasKey('TI', $imagesHeadersPhysicalJson);
        $this->assertArrayHasKey('SliceThickness', $imagesHeadersPhysicalJson);
        $this->assertArrayHasKey('SeriesName', $imagesHeadersDescriptionJson);
        $this->assertArrayHasKey('SeriesDescription', $imagesHeadersDescriptionJson);
        $this->assertArrayHasKey('XSpace', $imagesHeadersDimensionsJson);

        $this->assertIsString($imagesHeadersMetaJson['CandID']);
        $this->assertIsString($imagesHeadersMetaJson['Visit']);
        $this->assertIsString($imagesHeadersMetaJson['File']);
        $this->assertIsString($imagesHeadersPhysicalJson['TE']);
        $this->assertIsString($imagesHeadersPhysicalJson['TR']);
        $this->assertIsString($imagesHeadersPhysicalJson['TI']);
        $this->assertIsString($imagesHeadersPhysicalJson['SliceThickness']);
        $this->assertIsString($imagesHeadersDescriptionJson['SeriesName']);
        $this->assertIsString($imagesHeadersDescriptionJson['SeriesDescription']);
        $this->assertIsArray($imagesHeadersDimensionsJson['XSpace']);
        $this->assertIsString($imagesHeadersScannerInfoXJson['Length']);
        $this->assertIsString($imagesHeadersScannerInfoXJson['StepSize']);
        $this->assertIsArray($imagesHeadersDimensionsJson['YSpace']);
        $this->assertIsString($imagesHeadersScannerInfoYJson['Length']);
        $this->assertIsString($imagesHeadersScannerInfoYJson['StepSize']);
        $this->assertIsArray($imagesHeadersDimensionsJson['ZSpace']);
        $this->assertIsString($imagesHeadersScannerInfoZJson['Length']);
        $this->assertIsString($imagesHeadersScannerInfoZJson['StepSize']);
        $this->assertIsString($imagesHeadersScannerInfoJson['Manufacturer']);
        $this->assertIsString($imagesHeadersScannerInfoJson['Model']);
        $this->assertIsString($imagesHeadersScannerInfoJson['SoftwareVersion']);
        $this->assertIsString($imagesHeadersScannerInfoJson['SerialNumber']);
        $this->assertIsString($imagesHeadersScannerInfoJson['FieldStrength']);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/header/full
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeadersFull(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest",
            [
                'headers' => $this->headers
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

        $this->assertArrayHasKey('Meta', $imagesHeadersFullArray);
        $this->assertArrayHasKey('Headers', $imagesHeadersFullArray);

        $imagesHeadersFullMetaJson   = array_keys($imagesHeadersFullArray['Meta']);
        $imagesHeadersFullHeadersJson   = array_keys($imagesHeadersFullArray['Headers'][0]);

        $this->assertArrayHasKey('CandID', $imagesHeadersFullMetaJson);
        $this->assertArrayHasKey('Visit', $imagesHeadersFullMetaJson);
        $this->assertArrayHasKey('File', $imagesHeadersFullMetaJson);
        $this->assertArrayHasKey('slice_thickness', $imagesHeadersFullHeadersJson);
        $this->assertArrayHasKey('acquisition:slice_order', $imagesHeadersFullHeadersJson);
        $this->assertArrayHasKey('dicom_0x0051:el_0x1011', $imagesHeadersFullHeadersJson);
        $this->assertArrayHasKey('image:vartype', $imagesHeadersFullHeadersJson);
        $this->assertArrayHasKey('acquisition:percent_sampling', $imagesHeadersFullHeadersJson);
        $this->assertArrayHasKey('dicom_0x0051:el_0x1012', $imagesHeadersFullHeadersJson);
        $this->assertArrayHasKey('dicom_0x0028:vartype', $imagesHeadersFullHeadersJson);

        //      dicom_0x0028:vartype	"group________"
        //      yspace:alignment	"centre"
        //      acquisition:receive_coil	"HeadMatrixix\\\"\\\""
        //      max:vartype	"var_attribute"
        //      acquisition:num_slices	"1."
        //      pixel_bandwidth	"220"
        //      dicom_0x0019:el_0x1015	"-54.26612012, -134.07770952, 129.75284501"
        //      xspace	"160"
        //      xstep	"-1."
        //      acquisition_matrix	"0s, 256s, 224s, 0s"
        //      dicom_0x0019:varid	"MNI DICOM variable"
        //      acquisition:injection_route	"\\b"
        //      acquisition:tracer	"%%%%%%%%"
        //      study_id	"2666758"
        //      xspace:version	"MINC Version    1.0"
        //      dicom_0x0051:vartype	"group________"
        //      dicom_0x0040:el_0x0000	"140"
        //      xspace:step	"-1."
        //      dicom_0x0029:varid	"MNI DICOM variable"
        //      dicom_groups:varid	"MNI DICOM variable"
        //      dicom_0x0051:el_0x1019	"A1/IR"
        //      modality	"MR"
        //      dicom_0x0008:el_0x0000	"796"
        //      dicom_0x0029:el_0x1009	"20080626"
        //      dicom_0x0019:el_0x1011	"No"
        //      dicom_0x0029:el_0x0010	"SIEMENS CSA HEADER"
        //      :history	"Thu May 23 14:25:53 2019>>> dcm2mnc -dname  -stdin -clobber -usecoordinates /tmp/TarLoad-14-25-CSDPCa\\n\",\n\""
        //      min:version	"MINC Version    1.0"
        //      sequence_variant	"SP\\\\MP\\\\OSP"
        //      acquisition:positron_fraction	"4.94065645841247e-324"
        //      acquisition:SAR	"0.02765926080036"
        //      study:varid	"MINC standard variable"
        //      dicom_0x0018:vartype	"group________"
        //      mr_acquisition_type	"3D"
        //      dicom_0x0028:el_0x0002	"1s"
        //      patient_name	"DCC355_115788_V3"
        //      dicom_0x0028:el_0x0004	"MONOCHROME2"
        //      max:version	"MINC Version    1.0"
        //      acquisition:start_time	"20180420 173325.203000"
        //      number_of_phase_encoding_steps	"289"
        //      dicom_0x0019:el_0x1017	"1"
        //      acquisition:repetition_time	"2.4"
        //      percent_phase_field_of_view	"87.5"
        //      study:field_value	"3."
        //      acquisition:num_averages	"1."
        //      dicom_0x0020:varid	"MNI DICOM variable"
        //      dicom_0x0051:el_0x0000	"256"
        //      dicom_0x0023:vartype	"group________"
        //      largest_pixel_image_value	"416s"
        //      dicom_0x0023:el_0x0000	"21830"
        //      :ident	"cecile:cecile-dev.loris.ca:2019.05.23.14.26.07:8708:3"
        //      acquisition:scanning_sequence	"*tfl3d1_ns"
        //      software_versions	"syngo MR B15"
        //      transmitting_coil	"Body"
        //      acquisition:version	"MINC Version    1.0"
        //      xspace:alignment	"centre"
        //      dicom_0x0010:varid	"MNI DICOM variable"
        //      acquisition:varid	"MINC standard variable"
        //      dicominfo:window_min	"-45."
        //      cols	"224s"
        //      dicom_0x0032:el_0x0000	"16"
        //      image:varid	"MINC standard variable"
        //      yspace:version	"MINC Version    1.0"
        //      dicom_0x0018:el_0x0000	"464"
        //      :minc_version	"2.4.02"
        //      acquisition:pixel_bandwidth	"220."
        //      xspace:start	"85.4593993992131"
        //      acquisition:protocol	"t1_mpr_1mm_p2_pos50"
        //      dicom_0x0023:varid	"MNI DICOM variable"
        //      number_of_averages	"1"
        //      dicom_0x0032:vartype	"group________"
        //      scanning_sequence	"GR\\\\IR"
        //      ystart	"125.807581594045"
        //      min:varid	"MINC standard variable"
        //      yspace:start	"125.807581594045"
        //      zspace:spacing	"regular__"
        //      dicom_0x0018:varid	"MNI DICOM variable"
        //      study:device_model	"TrioTim"
        //      xspace:spacetype	"native____"
        //      pixel_representation	"0s"
        //      acquisition:injection_time	"`VÏ5þ\u007f"
        //      dicom_0x0021:el_0x0000	"44"
        //      phase_encoding_direction	"ROW"
        //      acquisition:dose_units	"Bq"
        //      manufacturer	"SIEMENS"
        //      bits_allocated	"16s"
        //      image:dimorder	"xspace,zspace,yspace"
        //      acquisition:radionuclide_halflife	"6.95297601191542e-310"
        //      zspace:step	"-1."
        //      imaged_nucleus	"1H"
        //      acquisition:imaged_nucleus	"1H"
        //      acquisition:echo_time	"0.00316"
        //      image_position_patient	"-54.26612011662\\\\-134.07770952461\\\\129.75284501147"
        //      study:study_id	"20180420.173325"
        //      zspace:comments	"Z increases from patient inferior to superior"
        //      zspace:vartype	"dimension____"
        //      study:modality	"MRI__"
        //      sequence_name	"*tfl3d1_ns"
        //      dicom_0x0021:varid	"MNI DICOM variable"
        //      dicom_0x0019:el_0x1009	"1.0"
        //      dicom_0x0010:vartype	"group________"
        //      dicom_0x0008:el_0x1140	"0xfffe  0xe000  length = 94 : VR= (sequence)\\n\",\n\"      0x0008  0x1150  length = 26 : VR=UI, value = \\\"1.2.840.10008.5.1.4.1.1.4\\\"\\n\",\n\"      0x0008  0x1155  length = 52 : VR=UI, value = \\\"1.3.12.2.1107.5.2.32.35140.2008062618021181787092958\\\"\\n\",\n\"   0xfffe  0xe000  length = 94 : VR= (sequence)\\n\",\n\"      0x0008  0x1150  length = 26 : VR=UI, value = \\\"1.2.840.10008.5.1.4.1.1.4\\\"\\n\",\n\"      0x0008  0x1155  length = 52 : VR=UI, value = \\\"1.3.12.2.1107.5.2.32.35140.2008062618020669782192950\\\"\\n\",\n\"   0xfffe  0xe000  length = 94 : VR= (sequence)\\n\",\n\"      0x0008  0x1150  length = 26 : VR=UI, value = \\\"1.2.840.10008.5.1.4.1.1.4\\\"\\n\",\n\"      0x0008  0x1155  length = 52 : VR=UI, value = \\\"1.3.12.2.1107.5.2.32.35140.2008062618020412765892946\\\"\\n\",\n\""
        //      series_number	"7"
        //      dicom_0x0020:el_0x1001	"0"
        //      dicom_0x0029:el_0x1160	"com"
        //      slice_location	"-85.459399399219"
        //      dicom_0x0040:varid	"MNI DICOM variable"
        //      window_center	"84"
        //      echo_time	"0.00316"
        //      dicom_0x0018:el_0x0080	"2400"
        //      yspace	"224"
        //      dicom_0x0051:el_0x100b	"224*256"
        //      dicom_0x0051:el_0x0010	"SIEMENS MR HEADER"
        //      dicom_0x0028:el_0x0000	"158"
        //      dicom_0x0008:vartype	"group________"
        //      dicom_0x0020:vartype	"group________"
        //      dicom_0x0019:el_0x1014	"0\\\\0\\\\0"
        //      dicom_0x0029:el_0x1008	"IMAGE NUM 4"
        //      image:signtype	"unsigned"
        //      manufacturer_model_name	"TrioTim"
        //      xstart	"85.4593993992131"
        //      max:dimorder	"xspace"
        //      dicom_0x0010:el_0x0000	"86"
        //      dicom_0x0019:el_0x0010	"SIEMENS MR HEADER"
        //      dicom_0x0051:el_0x100a	"TA 06:17"
        //      dicominfo:image_type	"ORIGINAL\\\\PRIMARY\\\\M\\\\ND\\\\NORM"
        //      window_width	"243"
        //      zspace:version	"MINC Version    1.0"
        //      acquisition:transmit_coil	"Body"
        //      xspace:length	"160"
        //      repetition_time	"2.4"
        //      dicom_0x0051:el_0x100e	"Sag>Cor(-7.5)>Tra(6.4)"
        //      acquisition:delay_in_TR	"0."
        //      acquisition:injection_year	"0"
        //      acquisition:image_type	"ORIGINAL\\\\PRIMARY\\\\M\\\\ND\\\\NORM"
        //      dicom_0x0020:el_0x0000	"446"
        //      acquisition:injection_hour	"0"
        //      acquisition:injection_day	"0"
        //      patient:position	"HFS"
        //      image:complete	"true_"
        //      receiving_coil	"HeadMatrixix\\\"\\"
        //      image:valid_range	"0., 4095."
        //      dicom_0x0051:el_0x100f	"t:HEA;HEP"
        //      sar	"0.02765926080036"
        //      zspace:spacetype	"native____"
        //      dicom_0x0028:varid	"MNI DICOM variable"
        //      dicom_0x0023:el_0x0008	"0"
        //      yspace:comments	"Y increases from patient posterior to anterior"
        //      min:dimorder	"xspace"
        //      dicom_0x0029:el_0x0011	"SIEMENS MEDCOM HEADER2"
        //      dicom_0x0051:el_0x100c	"FoV 224*256"
        //      dicom_groups:vartype	"group________"
        //      dicom_0x0021:el_0x1120	"0\\\\0"
        //      dicom_0x0008:el_0x0016	"1.2.840.10008.5.1.4.1.1.4"
        //      acquisition:phase_enc_dir	"ROW"
        //      patient_position	"HFS"
        //      xspace:comments	"X increases from patient left to right"
        //      zspace:alignment	"centre"
        //      window_center_width_explanation	"Algo1"
        //      dicom_0x0019:el_0x0000	"204"
        //      dicom_0x0008:el_0x0005	"ISO_IR 100"
        //      dicom_0x0019:el_0x1013	"0, 0, -1304"
        //      zstart	"120.940432611389"
        //      acquisition:mr_acq_type	"3D"
        //      max:varid	"MINC standard variable"
        //      dicom_0x0029:el_0x0000	"62930"
        //      acquisition:percent_phase_fov	"87.5"
        //      xspace:direction_cosines	"0.985131207584203, 0.13025590758387, 0.112026346826063"
        //      high_bit	"11s"
        //      dicom_0x0019:el_0x100f	"Normal"
        //      acquisition:window_center	"84."
        //      acquisition:num_dyn_scans	"0."
        //      dicominfo:window_max	"699.5"
        //      dicom_0x0051:el_0x1009	"1.0"
        //      dicom_0x0051:el_0x100d	"SP R85.5"
        //      acquisition:injection_seconds	"0."
        //      acquisition:injection_minute	"0"
        //      dicom_0x0029:el_0x1019	"20080626"
        //      acquisition:slice_thickness	"1."
        //      rows	"256s"
        //      dicom_0x0018:el_0x1318	"0"
        //      acquisition_number	"1"
        //      dicom_0x0029:vartype	"group________"
        //      acquisition:vartype	"group________"
        //      echo_numbers	"1"
        //      zspace:start	"120.940432611389"
        //      dicom_0x0018:el_0x0081	"3.16"
        //      dicom_0x0051:el_0x1013	"+LPH"
        //      percent_sampling	"100"
        //      acquisition:injection_month	"0"
        //      image_orientation_patient	"-0.1310810311687\\\\0.99137165748661\\\\4.2154332e-009\\\\-0.1110597456842\\\\-0.0146845249073\\\\-0.9937052367864"
        //      dicom_0x0021:el_0x1340	"1"
        //      acquisition:injection_dose	"6.94056256164753e-310"
        //      instance_number	"1"
        //      dicom_0x0018:el_0x9087	"0."
        //      yspace:spacetype	"native____"
        //      echo_train_length	"1"
        //      patient:varid	"MINC standard variable"
        //      xspace:vartype	"dimension____"
        //      yspace:direction_cosines	"-0.1310810311687, 0.991371657486611, -4.2154332e-09"
        //      dicom_0x0021:el_0x1370	"1"
        //      study:vartype	"group________"
        //      zspace	"256"
        //      dicom_0x0018:el_0x1314	"8"
        //      dicom_0x0019:vartype	"group________"
        //      zstep	"-1."
        //      dicom_0x0008:el_0x0008	"ORIGINAL\\\\PRIMARY\\\\M\\\\ND\\\\NORM"
        //      zspace:length	"256"
        //      zspace:varid	"MINC standard variable"
        //      bits_stored	"12s"
        //      acquisition:num_phase_enc_steps	"289."
        //      protocol_name	"t1_mpr_1mm_p2_pos50"
        //      series_description	"t1_mpr_1mm_p2_pos50"
        //      magnetic_field_strength	"3"
        //      dicom_0x0051:el_0x1016	"p2 M/ND/NORM"
        //      dicominfo:vartype	"group________"
        //      dicom_0x0020:el_0x1002	"1"
        //      dicom_0x0040:vartype	"group________"
        //      dicom_0x0019:el_0x1012	"0, 0, -1304"
        //      acquisition:echo_number	"1."
        //      yspace:spacing	"regular__"
        //      dicom_0x0018:el_0x0025	"N"
        //      dicom_0x0018:el_0x9075	"1"
        //      dicom_0x0051:varid	"MNI DICOM variable"
        //      acquisition:imaging_frequency	"123254688."
        //      acquisition:echo_train_length	"1."
        //      dicom_0x0008:varid	"MNI DICOM variable"
        //      study_instance_uid	"1.2.124.113532.172.28.8.14.20080626.165827.6991660"
        //      study:version	"MINC Version    1.0"
        //      pixel_spacing	"1\\\\1"
        //      dicom_0x0029:el_0x1018	"MR"
        //      ystep	"-1."
        //      dicom_0x0023:el_0x0009	"0x1"
        //      yspace:step	"-1."
        //      patient:weight	"105.6870356541"
        //      variable_flip_angle_flag	"N"
        //      dicom_0x0021:el_0x1330	"160"
        //      dicom_0x0021:vartype	"group________"
        //      dicom_0x0010:el_0x1030	"105.6870356541"
        //      patient:vartype	"group________"
        //      imaging_frequency	"123.254688"
        //      dicom_0x0032:varid	"MNI DICOM variable"
        //      dicom_0x0051:el_0x1008	"IMAGE NUM 4"
        //      xspace:varid	"MINC standard variable"
        //      patient:version	"MINC Version    1.0"
        //      acquisition:flip_angle	"8."
        //      acquisition:injection_volume	"2.09462490200788e-317"
        //      study:manufacturer	"SIEMENS"
        //      yspace:vartype	"dimension____"
        //      dicominfo:varid	"MNI DICOM information variable"
        //      zspace:direction_cosines	"-0.111059745684205, -0.0146845249073007, 0.993705236786446"
        //      dicom_0x0019:el_0x100b	"377100"
        //      tarchiveLocation	"2018/DCM_2018-04-20_ImagingUpload-14-25-U1OlWq.tar"
        //      patient:full_name	"DCC355_115788_V3"
        //      series_instance_uid	"1.3.12.2.1107.5.2.32.35140.2008062618041745845693489.0.0.0"
        //      yspace:varid	"MINC standard variable"
        //      dicom_0x0019:el_0x1018	"8900"
        //      study:software_version	"syngo MR B15"
        //      acquisition:window_width	"243."
        //      acquisition:series_description	"t1_mpr_1mm_p2_pos50"
        //      dicom_0x0051:el_0x1017	"SL 1.0"
        //      xspace:spacing	"regular__"
        //      yspace:length	"224"
        //      acquisition:acquisition_id	"7"
        //      smallest_pixel_image_value	"0s"
        //      min:vartype	"var_attribute"
        //      dicom_0x0019:el_0x1008	"IMAGE NUM 4"
        //      image:version	"MINC Version    1.0"
        //      dimnames	"xspace yspace zspace"
        //      check_nii_filename	"assembly/115788/V3/mri/native/demo_115788_V3_t1_001.nii"
        //      acquisition:inversion_time	"1.2"
        //      inversion_time	"1.2"
        //      dicom_0x0018:el_0x0022	"IR"
        //      dicom_0x0018:el_0x0082	"1200"
        //      acquisition_time	"180421.300000"
        //      acquisition:acquisition_time	"180421.300000"
        //      dicom_0x0040:el_0x0275	"0xfffe  0xe000  length = 66 : VR= (sequence)\\n\",\n\"      0x0040  0x0007  length = 26 : VR=LO, value = \\\"MRI BRAIN W/O CONT W STEM \\\"\\n\",\n\"      0x0040  0x0009  length = 8 : VR=SH, value = \\\"2666758 \\\"\\n\",\n\"      0x0040  0x1001  length = 8 : VR=SH, value = \\\"2666758 \\\"\\n\",\n\""
        //      dicom_0x0008:el_0x0050	"2666758"
        //      dicom_0x0040:el_0x0244	"20180420"
        //      study:start_date	"20180420"
        //      study:start_time	"173325.203000"
        //      image_date	"20180420"
        //      acquisition_date	"20180420"
        //      dicom_0x0008:el_0x0018	"1.3.12.2.1107.5.2.32.35140.2008062618103771524393582"
        //      dicom_0x0040:el_0x0245	"173325.328000"
        //      series_date	"20180420"
        //      dicom_0x0008:el_0x0013	"181050.468000"
        //      image_time	"181050.468000"
        //      study:serial_no	"35140"
        //      series_time	"181050.453000"
        //      study_date	"20180420"
        //      dicom_0x0008:el_0x0012	"20180420"
        //      study_time	"173325.203000"
        //      acquisition:image_time	"181050.468000"
        //      device_serial_number	"35140"
        //      frame_of_reference_uid	"1.3.12.2.1107.5.2.32.35140.1.20080626173325375.0.0.0"
        //      acquisition:series_time	"181050.453000"
        //      SNR	"9.14677"
        //      dicom_0x0088:varid	"MNI DICOM variable"
        //      dicom_0x0088:vartype	"group________"
        //      dicom_0x0088:el_0x0140	"1.3.12.2.1107.5.2.32.35140.30000008062608505214000000249"
        //      dicom_0x0088:el_0x0000	"5130"
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
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/images/$this->imagefileTest/headers/headername",
            [
                'headers' => $this->headers
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

        $this->assertArrayHasKey('Meta', $imagesHeadersHeadernameArray);
        $this->assertArrayHasKey('Value', $imagesHeadersHeadernameArray);

        $imagesHeadersHeadernameMetaJson   = array_keys($imagesHeadersHeadernameArray['Meta']);

        $this->assertArrayHasKey('CandID', $imagesHeadersFullMetaJson);
        $this->assertArrayHasKey('Visit', $imagesHeadersFullMetaJson);
        $this->assertArrayHasKey('File', $imagesHeadersFullMetaJson);
        $this->assertArrayHasKey('headername', $imagesHeadersFullHeadersJson);

    }
}
