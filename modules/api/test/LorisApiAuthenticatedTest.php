<?php

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
use GuzzleHttp\Client;

/**
 * PHPUnit class for API test suite. This script sends HTTP request to every
 * enpoints of the api module and look at the response content, status code and
 * headers where it applies. All endpoints are accessible at <host>/api/<version>/
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
class LorisApiAuthenticatedTest extends LorisIntegrationTest
{

    protected $client;
    protected $headers;
    protected $base_uri;

    /**
     * Call to LorisApiAuthenticationTest::setUp()
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $this->login("UnitTester", $this->validPassword);
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
     * Used to log in with GuzzleHttp\Client
     *
     * @param string $username The username to log in as
     * @param string $password The (plain text) password to login as.
     *
     * @return void
     */
    public function login($username, $password)
    {
        $this->base_uri = "$this->url/api/v0.0.3/";
        $this->client   = new Client(['base_uri' => $this->base_uri]);
        $response       = $this->client->request(
            'POST',
            "login",
            [
                'json' => ['username' => $username,
                    'password' => $password
                ]
            ]
        );
        $token          = json_decode(
            $response->getBody()->getContents()
        )->token ?? null;

        if ($token === null) {
            throw new \LorisException("Login failed");
        }
        $this->assertEquals(200, $response->getStatusCode());
        $headers       = [
            'Authorization' => "Bearer $token",
            'Accept'        => 'application/json'
        ];
        $this->headers = $headers;
    }
}

