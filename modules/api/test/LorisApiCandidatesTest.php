<?php

require_once __DIR__ . "LorisApiTest.php";

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
class LorisApiCandidatesTests extends LorisApiTests
{
    /**
     * Tests the HTTP GET request for the endpoint /candidates
     *
     * @return void
     */
    public function testGetCandidates(): void
    {
        $this->guzzleLogin();
        $response = $this->client->request(
            'GET',
            "$this->base_uri/candidates",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a header
        $headers = $response->getHeaders();
        $this->assertNotEmpty($headers);
        foreach ($headers as $header) {
            $this->assertNotEmpty($header);
            //$this->assertIsString($header[0]);
        }
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the endpoint /candidates/{candid}
     *
     * @return void
     */
    public function testGetCandidatesCandid(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/candidates",
            [
                'headers' => $this->headers
            ]
        );
        $candidsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );
        $candids      = array_keys($candidsArray['Candidates']);
        foreach ($candids as $candid) {
            $id       = $candidsArray['Candidates'][$candid]['CandID'];
            $response = $this->client->request(
                'GET',
                "$this->base_uri/candidates/$id",
                [
                    'headers' => $this->headers
                ]
            );
            $this->assertEquals(200, $response->getStatusCode());
            $headers = $response->getHeaders();
            $this->assertNotEmpty($headers);
            foreach ($headers as $header) {
                $this->assertNotEmpty($header);
                //$this->assertIsString($header[0]);
            }
            // Verify the endpoint has a body
            $body = $response->getBody();
            $this->assertNotEmpty($body);
        }
    }

    /**
     * Tests the HTTP POST request for the endpoint /candidates/{candid}
     *
     * @return void
     */
    public function testPostCandidatesCandid(): void
    {
        $this->guzzleLogin();
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
                "$this->base_uri/candidates",
                [
                    'headers' => $this->headers,
                    'json'    => $json
                ]
            );
            // Verify the status code
            $this->assertEquals(201, $response->getStatusCode());
            // Verify the endpoint has a header
            $headers = $response->getHeaders();
            $this->assertNotEmpty($headers);
            foreach ($headers as $header) {
                $this->assertNotEmpty($header);
                //$this->assertIsString($header[0]);
            }
            // Verify the endpoint has a body
            $body = $response->getBody();
            $this->assertNotEmpty($body);
        }
    }

}
