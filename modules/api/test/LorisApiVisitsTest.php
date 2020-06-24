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
class LorisApiVisitsTests extends LorisApiTests
{
    /**
     * Tests the HTTP GET request for the endpoint /candidates/{candid}/{visit}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisit(): void
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
            $id          = $candidsArray['Candidates'][$candid]['CandID'];
            $response    = $this->client->request(
                'GET',
                "$this->base_uri/candidates/$id",
                [
                    'headers' => $this->headers
                ]
            );
            $visitsArray = json_decode(
                (string) utf8_encode(
                    $response->getBody()->getContents()
                ),
                true
            );
            $visits      = array_keys($visitsArray['Visits']);
            foreach ($visits as $visit) {
                $v        = $visitsArray['Visits'][$visit];
                $response = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v",
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
    }

    /**
     * Tests the HTTP PUT request for the endpoint /candidates/{candid}/{visit}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisit(): void
    {
        $this->guzzleLogin();
        $candid   = '115788';
        $visit    = 'V2';
        $json     = ['CandID'  => $candid,
            'Visit'   => $visit,
            'Site'    => "Data Coordinating Center",
            'Battery' => "Fresh",
            'Project' => "Pumpernickel"
        ];
        $response = $this->client->request(
            'PUT',
            "$this->base_uri/candidates/$candid/$visit",
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
        $response = $this->client->request(
            'PUT',
            "$this->base_uri/candidates/$candid/$visit",
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
     * endpoint /candidates/{candid}/{visit}/imaging/qc
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitQcImaging(): void
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
            $id          = $candidsArray['Candidates'][$candid]['CandID'];
            $response    = $this->client->request(
                'GET',
                "$this->base_uri/candidates/$id",
                [
                    'headers' => $this->headers
                ]
            );
            $visitsArray = json_decode(
                (string) utf8_encode(
                    $response->getBody()->getContents()
                ),
                true
            );
            $visits      = array_keys($visitsArray['Visits']);
            foreach ($visits as $visit) {
                $v        = $visitsArray['Visits'][$visit];
                $response = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/qc/imaging",
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
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/imaging/qc
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitQcImaging(): void
    {
        $this->guzzleLogin();
        $candid   = '300003';
        $visit    = 'V3';
        $json     = ['CandID'  => $candid,
            'Visit'   => $visit,
            'Site'    => "Montreal",
            'Battery' => "Fresh",
            'Project' => "Pumpernickel"
        ];
        $response = $this->client->request(
            'PUT',
            "$this->base_uri/candidates/$candid/$visit",
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
        $response = $this->client->request(
            'PUT',
            "$this->base_uri/candidates/$candid/$visit",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        // Verify the status code; should be 204 because it was just created,
        // so it already exists
        $this->assertEquals(204, $response->getStatusCode());
    }


}
