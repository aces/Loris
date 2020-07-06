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
class LorisApiDicomsTests extends LorisApiAuthenticationTest
{
    protected $candidTest = "400162";
    protected $tarfileTest = "DCM_2016-08-15_ImagingUpload-18-25-i9GRv3.tar";
    protected $processidTest = "";

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicoms(): void
    {
        parent::setUp();
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


        $candidatesMetaJson   = array_keys($candidatesArray['Meta']);
        $candidatesDicomtarsJson   = array_keys($candidatesArray['DicomTars'][0]);
        $candidatesSeriesinfoJson   = array_keys($candidatesArray['DicomTars'][0]['SeriesInfos']);

        // Test if body contains:
        // Meta:
        //      CandID: "115788",
        //      Visit: "V3"
        // DicomTars:
        //      0:
        //          Tarname: "DCM_2018-04-20_ImagingUpload-14-25-U1OlWq.tar",
        //          SeriesInfo:
        //              SeriesDescription, "T2 and PD"
        //              SeriesNumber, 3
        //              EchoTime, "13"
        //              RepetitionTime, "3850",
        //              InversionTime	null
        //              SliceThickness	"3"
        //              Modality	"MR"
        //              SeriesUID	"1.3.12.2.1107.5.2.32.351…17435860771290643.0.0.0"

        $this->assertArrayHasKey('CandID', $candidatesMetaJson);
        $this->assertArrayHasKey('Visit', $candidatesMetaJson);

        $this->assertArrayHasKey('Tarname', $candidatesDicomtarsJson);
        $this->assertArrayHasKey('SeriesInfos', $candidatesDicomtarsJson);

        $this->assertArrayHasKey('SeriesDescription', $candidatesSeriesinfoJson);
        $this->assertArrayHasKey('SeriesNumber', $candidatesSeriesinfoJson);
        $this->assertArrayHasKey('EchoTime', $candidatesSeriesinfoJson);
        $this->assertArrayHasKey('RepetitionTime', $candidatesSeriesinfoJson);
        $this->assertArrayHasKey('InversionTime', $candidatesSeriesinfoJson);
        $this->assertArrayHasKey('SliceThickness', $candidatesSeriesinfoJson);
        $this->assertArrayHasKey('Modality', $candidatesSeriesinfoJson);
        $this->assertArrayHasKey('SeriesUID', $candidatesSeriesinfoJson);


        $this->assertIsString($candidatesMetaJson['CandID']);
        $this->assertIsString($candidatesMetaJson['Project']);

        $this->assertIsString($candidatesDicomtarsJson['Tarname']);
        $this->assertIsArray($candidatesDicomtarsJson['SeriesInfos']);

        $this->assertIsString($candidatesSeriesinfoJson['SeriesDescription']);
        $this->assertIsArray($candidatesSeriesinfoJson['SeriesNumber']);
        $this->assertIsString($candidatesSeriesinfoJson['EchoTime']);
        $this->assertIsArray($candidatesSeriesinfoJson['RepetitionTime']);
        $this->assertIsString($candidatesSeriesinfoJson['InversionTime']);
        $this->assertIsArray($candidatesSeriesinfoJson['SliceThickness']);
        $this->assertIsString($candidatesSeriesinfoJson['Modality']);
        $this->assertIsArray($candidatesSeriesinfoJson['SeriesUID']);
    }

    /**
     * Tests the HTTP POST request for the
     * endpoint /candidates/{candid}/{visit}/dicoms
     * // TODO HANDLING OF POST HANDLING NOT IMPLEMENTED
     *
     * @return void
     */
    public function testPostCandidatesCandidVisitDicoms(): void
    {
        parent::setUp();
        $candid   = '115788';
        $visit    = 'V2';
        $response = $this->client->request(
            'POST',
            "candidates/$candid/$visit/dicoms",
            [
                'headers' => $this->headers,
                'json'    => $this->headers
            ]
        );
        $this->assertEquals(201, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);


    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms/tarname
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicomsTarname(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/recordings/$this->tarfileTest",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

    }

    // THESE ENDPOINTS DO NOT EXIST YET

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/dicoms/{tarname}/processes
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicomsTarnameProcesses(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/dicoms/$this->tarfileTest/processes",
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
     * endpoint /candidates/{candid}/{visit}/dicoms/{tarname}/processes/{processid}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitDicomsTarnameProcessesProcessid():
    void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "
            candidates/$this->candidTest/$this->visitTest/dicoms/$this->tarfileTest/processes/$this->processidTest",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(
            200,
            $response->getStatusCode()
        );
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }
}
