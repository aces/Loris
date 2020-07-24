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
class LorisApiProjectsTest extends LorisApiAuthenticatedTest
{
    protected $projectIdTest = "Pumpernickel";

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
     * Tests the HTTP GET request for the endpoint /projects
     *
     * @return void
     */
    public function testGetProjects(): void
    {
        $response = $this->client->request(
            'GET',
            "projects",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        if ($response->getStatusCode() === 404) {
            $this->markTestSkipped(
                "Endpoint not found: GET projects"
            );
        }
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype(
                $projectsArray['Projects']
            ),
            'array'
        );
        $this->assertSame(
            gettype(
                $projectsArray['Projects']['Pumpernickel']
            ),
            'array'
        );
        $this->assertSame(
            gettype(
                $projectsArray['Projects']['Pumpernickel']['useEDC']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $projectsArray['Projects']['Pumpernickel']['PSCID']
            ),
            'array'
        );
        $this->assertSame(
            gettype($projectsArray['Projects']['Pumpernickel']['PSCID']['Type']),
            'string'
        );
        $this->assertSame(
            gettype($projectsArray['Projects']['Pumpernickel']['PSCID']['Regex']),
            'string'
        );

        $this->assertArrayHasKey(
            'Projects',
            $projectsArray
        );
        $this->assertArrayHasKey(
            'Pumpernickel',
            $projectsArray['Projects']
        );
        $this->assertArrayHasKey(
            'useEDC',
            $projectsArray['Projects']['Pumpernickel']
        );
        $this->assertArrayHasKey(
            'PSCID',
            $projectsArray['Projects']['Pumpernickel']
        );
        $this->assertArrayHasKey(
            'Type',
            $projectsArray['Projects']['Pumpernickel']['PSCID']
        );
        $this->assertArrayHasKey(
            'Regex',
            $projectsArray['Projects']['Pumpernickel']['PSCID']
        );
    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}
     *
     * @return void
     */
    public function testGetProjectsProject(): void
    {
        $response = $this->client->request(
            'GET',
            "projects/$this->projectIdTest",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsProjectArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($projectsProjectArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($projectsProjectArray['Meta']['Project']),
            'string'
        );
        $this->assertSame(
            gettype($projectsProjectArray['Candidates']),
            'array'
        );
        $this->assertSame(
            gettype($projectsProjectArray['Candidates']['0']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $projectsProjectArray
        );
        $this->assertArrayHasKey(
            'Project',
            $projectsProjectArray['Meta']
        );
        $this->assertArrayHasKey(
            'Candidates',
            $projectsProjectArray
        );
        $this->assertArrayHasKey(
            '0',
            $projectsProjectArray['Candidates']
        );
    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/candidates
     *
     * @return void
     */
    public function testGetProjectsProjectCandidates(): void
    {
        $response = $this->client->request(
            'GET',
            "projects/$this->projectIdTest/candidates",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsProjectArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($projectsProjectArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($projectsProjectArray['Meta']['Project']),
            'string'
        );
        $this->assertSame(
            gettype($projectsProjectArray['Candidates']),
            'array'
        );
        $this->assertSame(
            gettype($projectsProjectArray['Candidates']['0']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $projectsProjectArray
        );
        $this->assertArrayHasKey(
            'Project',
            $projectsProjectArray['Meta']
        );
        $this->assertArrayHasKey(
            'Candidates',
            $projectsProjectArray
        );

    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/images
     *
     * @return void
     */
    public function testGetProjectsProjectImages(): void
    {
        $response = $this->client->request(
            'GET',
            "projects/$this->projectIdTest/images",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $projectsImagesArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($projectsImagesArray['Images']),
            'array'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']),
            'array'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['Candidate']),
            'string'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['PSCID']),
            'string'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['Visit_date']),
            'string'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['Site']),
            'string'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['InsertTime']),
            'string'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['ScanType']),
            'string'
        );
        $qc_status = $projectsImagesArray['Images']['0']['QC_status'];
        if ($qc_status === 'string') {
            $this->assertSame(
                gettype($qc_status),
                'string'
            );
        } else {
            $this->assertSame(
                gettype($qc_status),
                'NULL'
            );
        }
        $selected = $projectsImagesArray['Images']['0']['QC_status'];
        if ($selected === 'string') {
            $this->assertSame(
                gettype($selected),
                'string'
            );
        } else {
            $this->assertSame(
                gettype($selected),
                'NULL'
            );
        }
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['Selected']),
            'string'
        );
        $this->assertSame(
            gettype($projectsImagesArray['Images']['0']['Link']),
            'string'
        );

        $this->assertArrayHasKey(
            'Images',
            $projectsImagesArray
        );
        $this->assertArrayHasKey(
            '0',
            $projectsImagesArray['Images']
        );
        $this->assertArrayHasKey(
            'Candidate',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'PSCID',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'Visit',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'Visit_date',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'Site',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'InsertTime',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'ScanType',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'QC_status',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'Selected',
            $projectsImagesArray['Images']['0']
        );
        $this->assertArrayHasKey(
            'Link',
            $projectsImagesArray['Images']['0']
        );
    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/visits
     *
     * @return void
     */
    public function testGetProjectsProjectVisits(): void
    {
        $response = $this->client->request(
            'GET',
            "projects/$this->projectIdTest/visits",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsVisitsArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($projectsVisitsArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($projectsVisitsArray['Meta']['Project']),
            'string'
        );
        $this->assertSame(
            gettype($projectsVisitsArray['Visits']),
            'array'
        );
        $this->assertSame(
            gettype($projectsVisitsArray['Visits']['0']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $projectsVisitsArray
        );
        $this->assertArrayHasKey(
            'Project',
            $projectsVisitsArray['Meta']
        );
        $this->assertArrayHasKey(
            'Visits',
            $projectsVisitsArray
        );
        $this->assertArrayHasKey(
            '0',
            $projectsVisitsArray['Visits']
        );
    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/instruments
     *
     * @return void
     */
    public function testGetProjectsProjectInstruments(): void
    {
        $response = $this->client->request(
            'GET',
            "projects/$this->projectIdTest/instruments",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsInstrArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($projectsInstrArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($projectsInstrArray['Meta']['Project']),
            'string'
        );
        $this->assertSame(
            gettype($projectsInstrArray['Instruments']),
            'array'
        );
        $this->assertSame(
            gettype($projectsInstrArray['Instruments']['aosi']),
            'array'
        );
        $this->assertSame(
            gettype(
                $projectsInstrArray['Instruments']['aosi']['Fullname']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $projectsInstrArray['Instruments']['aosi']['Subgroup']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $projectsInstrArray['Instruments']['aosi']['DoubleDataEntryEnabled']
            ),
            'boolean'
        );

        $this->assertArrayHasKey(
            'Meta',
            $projectsInstrArray
        );
        $this->assertArrayHasKey(
            'Project',
            $projectsInstrArray['Meta']
        );
        $this->assertArrayHasKey(
            'Instruments',
            $projectsInstrArray
        );
        $this->assertArrayHasKey(
            'radiology_review',
            $projectsInstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            'bmi',
            $projectsInstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            'medical_history',
            $projectsInstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            'aosi',
            $projectsInstrArray['Instruments']
        );
        $this->assertArrayHasKey(
            'mri_parameter_form',
            $projectsInstrArray['Instruments']
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /projects/{project}/instruments/{instrument}
     *
     * @return void
     */
    public function testGetProjectsProjectInstrumentsInstrument(): void
    {
        $response = $this->client->request(
            'GET',
            "projects/$this->projectIdTest/instruments/aosi",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsInstrumentsAosiArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Meta']['InstrumentVersion']),
            'string'
        );
        $this->assertSame(
            gettype(
                $projectsInstrumentsAosiArray['Meta']['InstrumentFormatVersion']
            ),
            'string'
        );
        $this->assertSame(
            gettype(
                $projectsInstrumentsAosiArray['Meta']['ShortName']
            ),
            'string'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Meta']['LongName']),
            'string'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Meta']['IncludeMetaDataFields']),
            'string'
        );

        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Elements']),
            'array'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Elements']['0']),
            'array'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Elements']['0']['Type']),
            'string'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Elements']['0']['GroupType']),
            'string'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Elements']['0']['Elements']),
            'array'
        );
        $this->assertSame(
            gettype($projectsInstrumentsAosiArray['Elements']['0']['Description']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $projectsInstrumentsAosiArray
        );
        $this->assertArrayHasKey(
            'InstrumentVersion',
            $projectsInstrumentsAosiArray['Meta']
        );
        $this->assertArrayHasKey(
            'InstrumentFormatVersion',
            $projectsInstrumentsAosiArray['Meta']
        );
        $this->assertArrayHasKey(
            'ShortName',
            $projectsInstrumentsAosiArray['Meta']
        );
        $this->assertArrayHasKey(
            'LongName',
            $projectsInstrumentsAosiArray['Meta']
        );
        $this->assertArrayHasKey(
            'IncludeMetaDataFields',
            $projectsInstrumentsAosiArray['Meta']
        );
    }
}
