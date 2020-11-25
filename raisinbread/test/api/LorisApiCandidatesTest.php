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
class LorisApiCandidatesTest extends LorisApiAuthenticatedTest
{
    protected $candidTest = '300001';

    /**
     * Tests the HTTP GET request for the endpoint /candidates
     *
     * @return void
     */
    public function testGetCandidates(): void
    {
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

        $this->assertSame(
            gettype($candidatesArray),
            'array'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']['Project']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']['PSCID']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']['Site']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']['EDC']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']['DoB']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesArray['Candidates']['0']['Sex']),
            'string'
        );

        $this->assertArrayHasKey('Candidates', $candidatesArray);
        $this->assertArrayHasKey('0', $candidatesArray['Candidates']);
        $this->assertArrayHasKey(
            'CandID',
            $candidatesArray['Candidates']['0']
        );
        $this->assertArrayHasKey(
            'Project',
            $candidatesArray['Candidates']['0']
        );
        $this->assertArrayHasKey(
            'Site',
            $candidatesArray['Candidates']['0']
        );
        $this->assertArrayHasKey(
            'EDC',
            $candidatesArray['Candidates']['0']
        );
        $this->assertArrayHasKey(
            'DoB',
            $candidatesArray['Candidates']['0']
        );
        $this->assertArrayHasKey(
            'Sex',
            $candidatesArray['Candidates']['0']
        );
    }

    /**
     * Tests the HTTP GET request for the endpoint /candidates/{candid}
     *
     * @return void
     */
    public function testGetCandidatesCandid(): void
    {
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

        $candidatesCandidArray = json_decode(
            (string) utf8_encode(
                $response->getBody()->getContents()
            ),
            true
        );

        $this->assertSame(
            gettype($candidatesCandidArray),
            'array'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']['CandID']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']['Project']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']['PSCID']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']['Site']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']['EDC']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']['DoB']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Meta']['Sex']),
            'string'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Visits']),
            'array'
        );
        $this->assertSame(
            gettype($candidatesCandidArray['Visits']['0']),
            'string'
        );

        $this->assertArrayHasKey(
            'Meta',
            $candidatesCandidArray
        );
        $this->assertArrayHasKey(
            'Visits',
            $candidatesCandidArray
        );
        $this->assertArrayHasKey(
            '0',
            $candidatesCandidArray['Visits']
        );

    }

    /**
     * Tests the HTTP POST request for the endpoint /candidates/{candid}
     *
     * @return void
     */
    public function testPostCandidatesCandid(): void
    {
        // First, create a valid new candidate
        $json_new     = [
            'Candidate' =>
                [
                    'Project' => "Rye",
                    'Site'    => "Data Coordinating Center",
                    'EDC'     => "2020-01-03",
                    'DoB'     => "2020-01-03",
                    'Sex'     => "Male"
                ]
        ];
        $response_new = $this->client->request(
            'POST',
            "candidates",
            [
                'headers' => $this->headers,
                'json'    => $json_new
            ]
        );
        // Verify the status code
        $this->assertEquals(201, $response_new->getStatusCode());
        // Verify the endpoint has a body
        $body = $response_new->getBody();
        $this->assertNotEmpty($body);

        // Erase sites that were setup in LorisApiAuthenticatedTest
        // setup for data access in other tests.
        $this->DB->run(
            'DELETE FROM user_psc_rel WHERE UserID=999990 AND CenterID <> 1'
        );

        // Second, try to create a valid new candidate in a site that the
        // user is not affiliated with. The test user is only afficilated to
        // Data Coordinating Center
        $json_new     = [
            'Candidate' =>
                [
                    'Project' => "Rye",
                    'Site'    => "Montreal",
                    'EDC'     => "2020-01-03",
                    'DoB'     => "2020-01-03",
                    'Sex'     => "Male"
                ]
        ];
        $response_new = $this->client->request(
            'POST',
            "candidates",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
                'json'        => $json_new
            ]
        );
        // Verify the status code
        $this->assertEquals(403, $response_new->getStatusCode());
        // Verify the endpoint has a body
        $body = $response_new->getBody();
        $this->assertNotEmpty($body);

        $json_new     = [
            'Candidate' =>
                [
                    'Project' => "",
                    'Site'    => "Data Coordinating Center",
                    'EDC'     => "2020-01-03",
                    'DoB'     => "2020-01-03",
                    'Sex'     => "Male"
                ]
        ];
        $response_new = $this->client->request(
            'POST',
            "candidates",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
                'json'        => $json_new
            ]
        );
        // Verify the status code
        $this->assertEquals(400, $response_new->getStatusCode());
        // Verify the endpoint has a body
        $body = $response_new->getBody();
        $this->assertNotEmpty($body);

        // Finally, try to create a new candidate with an invalid input
        $json_invalid = [
            'Candidate' =>
                [
                    'Site' => "Data Coordinating Center",
                    'EDC'  => "2020-01-03",
                    'DoB'  => "2020-01-03",
                    'Sex'  => "Male"
                ]
        ];

        $response_invalid = $this->client->request(
            'POST',
            "candidates",
            [
                'headers'     => $this->headers,
                'http_errors' => false,
                'json'        => $json_invalid
            ],
        );
        // Verify the status code
        $this->assertEquals(400, $response_invalid->getStatusCode());
        // Verify the endpoint has a body
        $body = $response_invalid->getBody();
        $this->assertNotEmpty($body);
    }
}
