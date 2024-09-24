<?php

require_once __DIR__ . "/LorisApiAuthenticated_v0_0_3_Test.php";

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
 * @group      api-v0.0.3
 */
class LorisApiProjects_v0_0_3_Test extends LorisApiAuthenticated_v0_0_3_Test
{
    protected $projectName = "Pumpernickel";

    protected $instrumentName = "bmi";

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
            "projects/$this->projectName",
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
            "projects/$this->projectName/candidates",
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
            "projects/$this->projectName/images",
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
            "projects/$this->projectName/visits",
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
            "projects/$this->projectName/instruments",
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
            "projects/$this->projectName/instruments/$this->instrumentName",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $instrumentProjectArray = json_decode(
            (string) utf8_encode(
                strstr($response->getBody()->getContents(),"{")
            ),
            true
        );

        $this->assertSame(
            gettype($instrumentProjectArray),
            'array'
        );

        // == Meta tag

        $this->assertArrayHasKey(
            'Meta',
            $instrumentProjectArray
        );

        $instrumentMeta = $instrumentProjectArray['Meta'];

        $this->assertSame(
            gettype($instrumentMeta),
            'array'
        );

        $this->assertArrayHasKey(
            'InstrumentVersion',
            $instrumentMeta
        );
        $this->assertSame(
            gettype($instrumentMeta['InstrumentVersion']),
            'string'
        );
        $this->assertArrayHasKey(
            'InstrumentFormatVersion',
            $instrumentMeta
        );
        $this->assertSame(
            gettype($instrumentMeta['InstrumentFormatVersion']),
            'string'
        );
        $this->assertArrayHasKey(
            'ShortName',
            $instrumentMeta
        );
        $this->assertSame(
            gettype($instrumentMeta['ShortName']),
            'string'
        );
        $this->assertArrayHasKey(
            'LongName',
            $instrumentMeta
        );
        $this->assertSame(
            gettype($instrumentMeta['LongName']),
            'string'
        );
        $this->assertArrayHasKey(
            'IncludeMetaDataFields',
            $instrumentMeta
        );
        $this->assertSame(
            gettype($instrumentMeta['IncludeMetaDataFields']),
            'string'
        );

        // == Elements tag

        $this->assertArrayHasKey(
            'Elements',
            $instrumentProjectArray
        );
        $this->assertSame(
            gettype($instrumentProjectArray['Elements']),
            'array'
        );

        $this->assertArrayHasKey(
            '0',
            $instrumentProjectArray['Elements']
        );

        $elementGroup = $instrumentProjectArray['Elements']['0'];

        $this->assertSame(
            gettype($elementGroup),
            'array'
        );

        $this->assertArrayHasKey(
            'Type',
            $elementGroup
        );
        $this->assertSame(
            gettype($elementGroup['Type']),
            'string'
        );

        $elementType = [
            // a group of elements...
            'ElementGroup',
            // ... or one element type
            'advcheckbox',
            'date',
            'file',
            'group',
            'header',
            'hidden',
            'link',
            'page',
            'password',
            'radio',
            'select',
            'static',
            'submit',
            'text',
            'textarea',
            'time',
        ];
        $this->assertContains(
            $elementGroup['Type'],
            $elementType
        );

        $this->assertArrayHasKey(
            'GroupType',
            $elementGroup
        );
        $this->assertSame(
            gettype($elementGroup['GroupType']),
            'string'
        );
        $this->assertArrayHasKey(
            'Description',
            $elementGroup
        );
        $this->assertSame(
            gettype($elementGroup['Description']),
            'string'
        );
        $this->assertArrayHasKey(
            'Elements',
            $elementGroup
        );
        $this->assertSame(
            gettype($elementGroup['Elements']),
            'array'
        );

        $this->assertArrayHasKey(
            '0',
            $elementGroup['Elements']
        );

        // == sub elements

        $groupSubElements = $elementGroup['Elements']['0'];

        $this->assertArrayHasKey(
            'Type',
            $groupSubElements
        );
        $this->assertSame(
            gettype($groupSubElements['Type']),
            'string'
        );
        $this->assertContains(
            $groupSubElements['Type'],
            $elementType
        );
        $this->assertArrayHasKey(
            'Name',
            $groupSubElements
        );
        $this->assertSame(
            gettype($groupSubElements['Name']),
            'string'
        );
        $this->assertArrayHasKey(
            'Description',
            $groupSubElements
        );
        $this->assertSame(
            gettype($groupSubElements['Description']),
            'string'
        );
        $this->assertArrayHasKey(
            'Options',
            $groupSubElements
        );
        $this->assertSame(
            gettype($groupSubElements['Options']),
            'array'
        );
    }

    /**
     * Tests the HTTP GET request for the endpoint /projects/{project}/recordings
     *
     * @return void
     */
    public function testGetProjectsRecordings(): void
    {
        $response = $this->client->request(
            'GET',
            "projects/$this->projectName/recordings",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $projectsRecordingsArray = json_decode(
            (string) utf8_encode(
                strstr($response->getBody()->getContents(),"{")
            ),
            true
        );

        $this->assertSame(
            gettype($projectsRecordingsArray),
            'array'
        );

        $this->assertArrayHasKey(
            'Recordings',
            $projectsRecordingsArray
        );
        $this->assertSame(
            gettype($projectsRecordingsArray['Recordings']),
            'array'
        );

        $this->assertArrayHasKey(
            '0',
            $projectsRecordingsArray['Recordings']
        );

        $recordings = $projectsRecordingsArray['Recordings']['0'];

        $this->assertArrayHasKey(
            'Candidate',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['Candidate']),
            'string'
        );
        $this->assertArrayHasKey(
            'PSCID',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['PSCID']),
            'string'
        );
        $this->assertArrayHasKey(
            'Visit',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['Visit']),
            'string'
        );
        $this->assertArrayHasKey(
            'Visit_date',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['Visit_date']),
            'string'
        );
        $this->assertArrayHasKey(
            'Site',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['Site']),
            'string'
        );
        $this->assertArrayHasKey(
            'File',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['File']),
            'string'
        );
        $this->assertArrayHasKey(
            'Modality',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['Modality']),
            'string'
        );
        $this->assertArrayHasKey(
            'InsertTime',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['InsertTime']),
            'string'
        );
        $this->assertArrayHasKey(
            'Link',
            $recordings
        );
        $this->assertSame(
            gettype($recordings['Link']),
            'string'
        );
    }
}
