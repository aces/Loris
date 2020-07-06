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
class LorisApiCandidatesTests extends LorisApiAuthenticationTest
{
    /**
     * Tests the HTTP GET request for the endpoint /candidates
     *
     * @return void
     */
    public function testGetCandidates(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $candidatesArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $candidatesCandidatesJson   = array_keys($candidatesArray['Meta']);
        $candidatesFilesJson   = array_keys($candidatesArray['Files'][0]);

        $this->assertArrayHasKey('CandID', $candidatesCandidatesJson);
        $this->assertArrayHasKey('Project', $candidatesCandidatesJson);
        $this->assertArrayHasKey('Site', $candidatesCandidatesJson);
        $this->assertArrayHasKey('EDC', $candidatesCandidatesJson);
        $this->assertArrayHasKey('DoB', $candidatesCandidatesJson);
        $this->assertArrayHasKey('Sex', $candidatesCandidatesJson);

        $this->assertIsString($candidatesCandidatesJson['CandID']);
        $this->assertIsString($candidatesCandidatesJson['Project']);
        $this->assertIsString($candidatesCandidatesJson['Site']);

    }

    /**
     * Tests the HTTP GET request for the endpoint /candidates/{candid}
     *
     * @return void
     */
    public function testGetCandidatesCandid(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $candidatesArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $candidatesMetaJson   = array_keys($candidatesArray['Meta']);
        $candidatesFilesJson   = array_keys($imagesArray['Files'][0]);

        // Test if body contains:
        // Meta:
        //      CandID, Project, Site, EDC (optional), DoB, Sex
        // Visits:
        //      (if 3 visits): 0: "V#", 1: "V#", 2: "V#",

        $this->assertArrayHasKey('CandID', $candidatesMetaJson);
        $this->assertArrayHasKey('Project', $candidatesMetaJson);
        $this->assertArrayHasKey('Site', $candidatesMetaJson);
        $this->assertArrayHasKey('EDC', $candidatesMetaJson);
        $this->assertArrayHasKey('DoB', $candidatesMetaJson);
        $this->assertArrayHasKey('Sex', $candidatesMetaJson);

        $this->assertArrayHasKey('V1', $candidatesFilesJson);
        $this->assertArrayHasKey('V2', $candidatesFilesJson);
        $this->assertArrayHasKey('V3', $candidatesFilesJson);

        $this->assertIsString($imagesMetaJson['CandID']);
        $this->assertIsString($imagesMetaJson['Project']);
        $this->assertIsString($imagesMetaJson['Site']);

        $this->assertIsString($imagesMetaJson['V1']);
        $this->assertIsString($imagesMetaJson['V2']);
        $this->assertIsString($imagesMetaJson['V3']);


    }

    /**
     * Tests the HTTP POST request for the endpoint /candidates/{candid}
     *
     * @return void
     */
    public function testPostCandidatesCandid(): void
    {
        parent::setUp();
        $json1      = [
            'Candidate' =>
                [
                    'Project' => "Rye",
                    'Site'    => "Data Coordinating Center",
                    'EDC'     => "2020-01-03",
                    'DoB'     => "2020-01-03",
                    'Sex'     => "Male"
                ]
        ];
        $json_exist = [
            'Candidate' =>
                [
                    'Project' => "Pumpernickel",
                    'Site'    => "Data Coordinating Center",
                    'EDC'     => "2020-01-01",
                    'DoB'     => "2020-01-01",
                    'Sex'     => "Female"
                ]
        ];
        $jsons      = [$json1, $json_exist];
        foreach ($jsons as $json) {
            $response = $this->client->request(
                'POST',
                "candidates",
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
            // To test: Wrong inputs

        }
    }

}
