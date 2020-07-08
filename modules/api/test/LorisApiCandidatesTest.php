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
class LorisApiCandidatesTest extends LorisApiAuthenticationTest
{
    protected $candidTest = '300001';

    /**
     * Call to setUp()
     *
     * @return void
     */
    public function setUp()
    {
	parent::setUp();
    }


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

        // Second, create a candidate that already exist
        $json_exist     = [
            'Candidate' =>
                [
                    'Project' => "Pumpernickel",
                    'Site'    => "Data Coordinating Center",
                    'EDC'     => "2020-01-01",
                    'DoB'     => "2020-01-01",
                    'Sex'     => "Female"
                ]
        ];
        $response_exist = $this->client->request(
            'POST',
            "candidates",
            [
                'headers' => $this->headers,
                'json'    => $json_exist
            ]
        );
        // Verify the status code
        $this->assertEquals(201, $response_exist->getStatusCode());
        // Verify the endpoint has a body
        $body = $response_exist->getBody();
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

        try{
            $response_invalid = $this->client->request(
                'POST',
                "candidates",
                [
                    'headers' => $this->headers,
                    'json'    => $json_invalid
                ]
            );
            // Verify the status code
            $this->assertEquals(201, $response_invalid->getStatusCode());
            // Verify the endpoint has a body
            $body = $response_invalid->getBody();
            $this->assertNotEmpty($body);

        } catch (\Exception $e) {
            $message = explode(
                '}',
                explode('{', $e->getMessage())[1]
            )[0];
        }
        // Verify the status code
        $this->assertEquals('"error":"No project named: "', $message);
    }
}
