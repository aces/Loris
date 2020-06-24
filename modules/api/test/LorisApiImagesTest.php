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
class LorisApiImagesTests extends LorisApiTests
{
    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImages(): void
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
                    "$this->base_uri/candidates/$id/$v/images/",
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
     * endpoint /candidates/{candid}/{visit}/images/filename
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilename(): void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $fname    = $imagesArray['Files'][$file]['Filename'];
                    $resource = fopen($fname, 'w');
                    $stream   = GuzzleHttp\Psr7\stream_for($resource);
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$fname",
                        [
                            'headers' => $this->headers,
                            'save_to' => $stream
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
    }

    /**
     * Download an image with
     * endpoint /candidates/{candid}/{visit}/images/{filename}
     *
     * @param string $id    candidate ID
     * @param string $visit visit ID
     *
     * @return void
     */
    private function _downloadCandidatesCandidVisitImagesFilename(
        string $id = '115788',
        string $visit = 'V3'
    ): void {
        if (!file_exists('/images')) {
            mkdir('/images');
        }
        $tarname  = "demo_$id\_$visit\_t1_001.mnc";
        $resource = fopen("/images/$tarname", 'w');
        $stream   = GuzzleHttp\Psr7\stream_for($resource);
        $this->client->request(
            'GET',
            "$this->base_uri/$id/$visit/images/$tarname",
            [
                'headers' => $this->headers,
                'save_to' => $stream
            ]
        );
    }

    /**
     * Download an image with endpoint /candidates/{candid}/{visit}/dicoms/{tarname}
     *
     * @param string $id    candidate ID
     * @param string $visit visit ID
     *
     * @return void
     */
    private function _downloadCandidatesCandidVisitDicomTarname(
        string $id = '115788',
        string $visit = 'V3'
    ): void {
        if (!file_exists('dicoms')) {
            mkdir('dicoms');
        }
        $tarName  = "DCM_2018-04-20_ImagingUpload-14-25-U1OlWq.tar";
        $resource = fopen("dicoms/$tarName", 'w');
        $stream   = GuzzleHttp\Psr7\stream_for($resource);
        $this->client->request(
            'GET',
            "$this->base_uri/candidates/$id/$visit/dicoms/$tarName",
            [
                'headers' => $this->headers,
                'save_to' => $stream
            ]
        );
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/qc
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameQc(): void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $fname    = $imagesArray['Files'][$file]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$fname/qc",
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
    }

    /**
     * Tests the HTTP PUT request for the
     * endpoint /candidates/{candid}/{visit}/imaging/qc
     * TODO WILL RESULT IN ERROR; got the error
     * TODO "error":"Candidate from URL does not match JSON metadata."
     * Error in: /modules/api/php/endpoints/candidate/visit/image/qc.class.inc
     *
     * @param string $candid Candidate ID
     * @param string $visit  visit ID
     *
     * @return void
     */
    public function testPutCandidatesCandidVisitImagesFilenameQc(
        $candid = '115788',
        $visit = 'V3'
    ): void {
        $this->guzzleLogin();
        $filename = 'demo_115788_V3_t2_001_t2-defaced_001.mnc';
        $json     = ['CandID'  => $candid,
            'Visit'   => $visit,
            'Site'    => "Data Coordinating Center",
            'Battery' => "Fresh",
            'Project' => "Pumpernickel"
        ];
        $response = $this->client->request(
            'PUT',
            "$this->base_uri/candidates/$candid/$visit/images/$filename/qc",
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
     * endpoint /candidates/{candid}/{visit}/images/filename/format/brainbrowser
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatBbrowser(): void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $fname    = $imagesArray['Files'][$file]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$fname",
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
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/format/raw
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatRaw(): void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $fname    = $imagesArray['Files'][$file]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$fname",
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
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/format/thumbnail
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameFormatThumbnail():
    void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $fname    = $imagesArray['Files'][$file]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$fname",
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
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/headers
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeaders(): void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $fname    = $imagesArray['Files'][$file]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$fname",
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
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/header/full
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeadersFull(): void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $imgFile  = $imagesArray['Files'][$file]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$imgFile",
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
    }

    /**
     * Tests the HTTP GET request for the
     * endpoint /candidates/{candid}/{visit}/images/filename/header/headername
     *
     * @return void
     */
    public function testGetCandidatesCandidVisitImagesFilenameHeadersHeadername():
    void
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
                $v           = $visitsArray['Visits'][$visit];
                $response    = $this->client->request(
                    'GET',
                    "$this->base_uri/candidates/$id/$v/images/",
                    [
                        'headers' => $this->headers
                    ]
                );
                $imagesArray = json_decode(
                    (string) utf8_encode(
                        $response->getBody()->getContents()
                    ),
                    true
                );
                $files       = array_keys($imagesArray['Files']);
                foreach ($files as $file) {
                    $imgFile  = $imagesArray['Files'][$file]['Filename'];
                    $response = $this->client->request(
                        'GET',
                        "$this->base_uri/candidates/$id/$v/images/$imgFile",
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
    }


}
