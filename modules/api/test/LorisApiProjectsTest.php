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
class LorisApiProjectsTests extends LorisApiAuthenticationTest
{
    protected $projectIdTest = "Pumpernickel";
    protected $candidTest = "115788";
    protected $visitTest = "V1";
    /**
     * Tests the HTTP GET request for the endpoint /projects
     *
     * @return void
     */
    public function testGetProjects(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "projects",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertArrayHasKey('Projects', $projectsArray);
        $this->assertArrayHasKey('Pumpernickel', $projectsArray['Projects']);
        $this->assertArrayHasKey('useEDC', $projectsArray['Projects']['Pumpernickel']);
        $this->assertArrayHasKey('PSCID', $projectsArray['Projects']['Pumpernickel']);
        $this->assertArrayHasKey('Type', $projectsArray['Projects']['Pumpernickel']);
        $this->assertArrayHasKey('Regex', $projectsArray['Projects']['Pumpernickel']);
        $this->assertArrayHasKey('Validity', $projectsArray['Projects']['Pumpernickel']);

        $this->assertIsArray($projectsArray['Projects']);
        $this->assertIsArray($projectsArray['Projects']['Pumpernickel']);
        $this->assertIsString($projectsArray['Projects']['Pumpernickel']['useEDC']);
        $this->assertIsArray($projectsArray['Projects']['Pumpernickel']['PSCID']);
        $this->assertIsString($projectsArray['Projects']['Pumpernickel']['PSCID']);
        $this->assertIsString($projectsArray['Projects']['Pumpernickel']['Validity']);

    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}
     *
     * @return void
     */
    public function testGetProjectsProject(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "projects/$this->projectId",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsProjectArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertArrayHasKey('Meta', $projectsProjectArray);
        $this->assertArrayHasKey('Project', $projectsProjectArray['Meta']);
        $this->assertArrayHasKey('Candidates', $projectsProjectArray);

        $this->assertIsArray($projectsProjectArray['Meta']);
        $this->assertIsString($projectsProjectArray['Meta']['Project']);
        $this->assertIsArray($projectsProjectArray['Candidates']);
        $this->assertIsString($projectsProjectArray['Candidates']['0']);

    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/candidates
     *
     * @return void
     */
    public function testGetProjectsProjectCandidates(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "projects/$this->projectId/candidates",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsProjectArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertArrayHasKey('Meta', $projectsProjectArray);
        $this->assertArrayHasKey('Project', $projectsProjectArray['Meta']);
        $this->assertArrayHasKey('Candidates', $projectsProjectArray);

        $this->assertIsArray($projectsProjectArray['Meta']);
        $this->assertIsString($projectsProjectArray['Meta']['Project']);
        $this->assertIsArray($projectsProjectArray['Candidates']);
        $this->assertIsString($projectsProjectArray['Candidates']['0']);

    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/images
     *
     * @return void
     */
    public function testGetProjectsProjectImages(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "projects/$this->projectId/images",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $projectsImagesArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertArrayHasKey('Images', $projectsImagesArray);
        $this->assertArrayHasKey('0', $projectsImagesArray['Images']);
        $this->assertArrayHasKey('Candidate', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('PSCID', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('Visit', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('Visit_date', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('Site', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('InsertTime', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('ScanType', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('QC_status', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('Selected', $projectsImagesArray['Images']['0']);
        $this->assertArrayHasKey('Link', $projectsImagesArray['Images']['0']);

        $this->assertIsArray($projectsImagesArray['Images']);
        $this->assertIsArray($projectsImagesArray['Images']['0']);
        $this->assertIsString($projectsImagesArray['Images']['0']['Candidate']);
        $this->assertIsString($projectsImagesArray['Images']['0']['PSCID']);
        $this->assertIsString($projectsImagesArray['Images']['0']['Visit']);
        $this->assertIsString($projectsImagesArray['Images']['0']['Visit_date']);
        $this->assertIsString($projectsImagesArray['Images']['0']['Site']);
        $this->assertIsString($projectsImagesArray['Images']['0']['InsertTime']);
        $this->assertIsString($projectsImagesArray['Images']['0']['ScanType']);
        $this->assertIsString($projectsImagesArray['Images']['0']['QC_status']);
        $this->assertIsString($projectsImagesArray['Images']['0']['Selected']);
        $this->assertIsString($projectsImagesArray['Images']['0']['Link']);

    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/visits
     *
     * @return void
     */
    public function testGetProjectsProjectVisits(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "projects/$this->projectId/visits",
            [
                'headers' => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsVisitsArray     = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertArrayHasKey('Meta', $projectsVisitsArray);
        $this->assertArrayHasKey('Project', $projectsVisitsArray['Images']);
        $this->assertArrayHasKey('Visits', $projectsVisitsArray);
        $this->assertArrayHasKey('0', $projectsVisitsArray['Visit']);

        $this->assertIsArray($projectsImagesArray['Meta']);
        $this->assertIsString($projectsImagesArray['Meta']['Project']);
        $this->assertIsArray($projectsImagesArray['Visits']);
        $this->assertIsString($projectsImagesArray['Visits']['0']);

    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/instruments
     *
     * @return void
     */
    public function testGetProjectsProjectInstruments(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "projects/$projectIdTest/instruments",
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
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @return void
     */
    public function testGetProjectsProjectInstrumentsInstrument(): void
    {
        parent::setUp();
        $response = $this->client->request(
            'GET',
            "projects/$this->projectId/instruments/$instrument",
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
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @return void
     */
    public function testPatchProjectsProjectInstrumentsInstrument(): void
    {
        parent::setUp();
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
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

}
