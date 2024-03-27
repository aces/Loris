<?php
require_once __DIR__ . "/LorisApiAuthenticated_v0_0_3_Test.php";

/**
 * PHPUnit class for API test suite. This script sends HTTP requests to every
 * endpoints of the api module and look at the response content, status code and
 * headers where it applies. All endpoints are accessible at <host>/api/<version>/
 * (e.g. the endpoint of the version 0.0.4-dev of the API "/projects" URI for the host
 * "example.loris.ca" would be https://example.loris.ca/api/v0.0.4-dev/projects)
 *
 * @category   API
 * @package    Tests
 * @subpackage Integration
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 * @group      api-v0.0.3
 */
class LorisApiSites_v0_0_3_Test extends LorisApiAuthenticated_v0_0_3_Test
{
    /**
     * Tests the HTTP GET request for the endpoint /sites
     *
     * @return void
     */
    public function testGetSites(): void
    {
        $response = $this->client->request(
            'GET',
            "sites",
            [
                'http_errors' => false,
                'headers'     => $this->headers
            ]
        );

        // endpoint was added in v0.0.4
        $this->assertEquals(404, $response->getStatusCode());
    }
}
