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
class LorisApiProjectsTests extends LorisApiTests
{
    /**
     * Tests the HTTP GET request for the endpoint /projects
     *
     * @return void
     */
    public function testGetProjects(): void
    {
        $this->guzzleLogin();
        $response = $this->client->request(
            'GET',
            "$this->base_uri/projects",
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

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}
     *
     * @return void
     */
    public function testGetProjectsProject(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/projects",
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
        $projectIds   = array_keys($candidsArray['Projects']);
        foreach ($projectIds as $projectId) {
            $response = $this->client->request(
                'GET',
                "$this->base_uri/projects/$projectId",
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
     * Tests the HTTP GET request for the endpoint /projects/{project}/candidates
     *
     * @return void
     */
    public function testGetProjectsProjectCandidates(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/projects",
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
        $projectIds   = array_keys($candidsArray['Projects']);
        foreach ($projectIds as $projectId) {
            $response = $this->client->request(
                'GET',
                "$this->base_uri/projects/$projectId/candidates",
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
     * Tests the HTTP GET request for the endpoint /projects/{project}/images
     *
     * @return void
     */
    public function testGetProjectsProjectImages(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/projects",
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
        $projectIds   = array_keys($candidsArray['Projects']);
        foreach ($projectIds as $projectId) {
            $response = $this->client->request(
                'GET',
                "$this->base_uri/projects/$projectId/images",
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
     * Tests the HTTP GET request for the endpoint /projects/{project}/visits
     *
     * @return void
     */
    public function testGetProjectsProjectVisits(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/projects",
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
        $projectIds   = array_keys($candidsArray['Projects']);
        foreach ($projectIds as $projectId) {
            $response = $this->client->request(
                'GET',
                "$this->base_uri/projects/$projectId/visits",
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
     * Tests the HTTP GET request for the endpoint /projects/{project}/instruments
     *
     * @return void
     */
    public function testGetProjectsProjectInstruments(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/projects",
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
        $projectIds   = array_keys($candidsArray['Projects']);
        foreach ($projectIds as $projectId) {
            $response = $this->client->request(
                'GET',
                "$this->base_uri/projects/$projectId/instruments",
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
     * Tests the HTTP GET request for the
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @return void
     */
    public function testGetProjectsProjectInstrumentsInstrument(): void
    {
        $this->guzzleLogin();
        $response     = $this->client->request(
            'GET',
            "$this->base_uri/projects",
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
        $projectIds   = array_keys($candidsArray['Projects']);
        foreach ($projectIds as $projectId) {
            $response    = $this->client->request(
                'GET',
                "$this->base_uri/projects/$projectId/instruments",
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
            $instruments = array_keys($visitsArray['Instruments']);
            foreach ($instruments as $instrument) {
                $response = $this->client->request(
                    'GET',
                    "$this->base_uri/projects/$projectId/instruments/$instrument",
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
     * Tests the HTTP GET request for the
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @return void
     */
    public function testPatchProjectsProjectInstrumentsInstrument(): void
    {
        $this->guzzleLogin();
        $response = $this->client->request(
            'PATCH',
            'https://spelletier-dev.loris.ca
            /api/v0.0.3//candidates/300001/V1/instruments/aosi',
            [
                'headers' => $this->headers,
                'json'    => []
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
