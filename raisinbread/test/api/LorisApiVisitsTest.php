<?php

require_once __DIR__ . "/LorisApiAuthenticatedTest.php";

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
 */
class LorisApiVisitsTest extends LorisApiAuthenticatedTest
{
    protected $candidTest = "300008";
    protected $visitTest  = "V1";

    /**
     * Tests the HTTP GET request for the endpoint /candidates/{candid}/{visit}
     *
     * @return void
     */
    public function testGetCandidatesCandidVisit(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $candidatesVisitArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($candidatesVisitArray), 'array');
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']['Site']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']['Battery']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Stages']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Stages']['Visit']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Stages']['Visit']['Date']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Stages']['Visit']['Status']),
            'string'
        );

        $this->assertArrayHasKey('Meta', $candidatesVisitArray);
        $this->assertArrayHasKey('CandID', $candidatesVisitArray['Meta']);
        $this->assertArrayHasKey('Project', $candidatesVisitArray['Meta']);
        $this->assertArrayHasKey('Site', $candidatesVisitArray['Meta']);
        $this->assertArrayHasKey('Battery', $candidatesVisitArray['Meta']);
        $this->assertArrayHasKey('Project', $candidatesVisitArray['Meta']);
        $this->assertArrayHasKey('Stages', $candidatesVisitArray);
        $this->assertArrayHasKey(
            'Visit',
            $candidatesVisitArray['Stages']
        );
        $this->assertArrayHasKey(
            'Date',
            $candidatesVisitArray['Stages']['Visit']
        );
        $this->assertArrayHasKey(
            'Status',
            $candidatesVisitArray['Stages']['Visit']
        );

    }

    /**
     * Tests the HTTP PUT request for the endpoint /candidates/{candid}/{visit}
     *
     * @return void
     */
    public function testPutCandidatesCandidVisit(): void
    {
        $json     = ['CandID'  => '400266',
            'Visit'   => "V3",
            'Site'    => "Data Coordinating Center",
            'Battery' => "Stale",
            'Project' => "Pumpernickel",
        ];
        $response = $this->client->request(
            'PUT',
            "candidates/400266/V3",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        // Verify the status code
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);

        $json     = ['CandID'  => $this->candidTest,
            'Visit'   => $this->visitTest,
            'Site'    => "Data Coordinating Center",
            'Battery' => "Stale",
            'Project' => "Pumpernickel",
        ];
        $response = $this->client->request(
            'PUT',
            "candidates/$this->candidTest/$this->visitTest",
            [
                'headers'     => $this->headers,
                'json'        => $json,
                'http_errors' => false
            ]
        );
        // verify the status code
        $this->assertequals(409, $response->getstatuscode());
        // verify the endpoint has a body
        $body = $response->getbody();
        $this->assertnotempty($body);
 
        $json     = ['CandID'  => '115788',
            'Visit'   => "V1",
            'Site'    => "Data Coordinating Center",
            'Battery' => "Low Yeast",
            'Project' => "Pumpernickel",
        ];
        $response = $this->client->request(
            'PUT',
            "candidates/115788/V1",
            [
                'headers' => $this->headers,
                'json'    => $json
            ]
        );
        // Verify the status code
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/imaging/qc
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitQcImaging(): void
    {
        $response = $this->client->request(
            'GET',
            "candidates/$this->candidTest/$this->visitTest/qc/imaging",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );
        $this->assertEquals(200, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
        $candidatesVisitArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(gettype($candidatesVisitArray), 'array');
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Meta']['Visit']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['SessionQC']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesVisitArray['Pending']),
            'boolean'
        );

        $this->assertArrayHasKey('Meta', $candidatesVisitArray);
        $this->assertArrayHasKey('CandID', $candidatesVisitArray['Meta']);
        $this->assertArrayHasKey('Visit', $candidatesVisitArray['Meta']);
        $this->assertArrayHasKey('SessionQC', $candidatesVisitArray);
        $this->assertArrayHasKey('Pending', $candidatesVisitArray);
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/imaging/qc
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitQcImaging(): void
    {
        $candid   = '400162';
        $visit    = 'V6';
        $json     = [
            "Meta"      => [
                'CandID' => $candid,
                'Visit'  => $visit
            ],
            'SessionQC' => "",
            'Pending'   => true
        ];
        $response = $this->client->request(
            'PUT',
            "candidates/$candid/$visit/qc/imaging",
            [
                'http_errors' => false,
                'headers'     => $this->headers,
                'json'        => $json
            ]
        );
        // Verify the status code
        $this->assertEquals(204, $response->getStatusCode());
        // Verify the endpoint has a body
        $body = $response->getBody();
        $this->assertNotEmpty($body);
    }
}
