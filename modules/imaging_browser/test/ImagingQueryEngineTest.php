<?php

use PHPUnit\Framework\TestCase;

use LORIS\StudyEntities\Candidate\CandID;
use LORIS\Data\Query\QueryTerm;

use LORIS\Data\Query\Criteria\Equal;
use LORIS\Data\Query\Criteria\NotEqual;
use LORIS\Data\Query\Criteria\In;

use LORIS\Data\Query\Criteria\StartsWith;
use LORIS\Data\Query\Criteria\EndsWith;
use LORIS\Data\Query\Criteria\Substring;

/**
 * Tests all operations of the Imaging QueryEngine
 * implementation
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ImagingQueryEngineTest extends TestCase
{

    protected \LORIS\imaging_browser\QueryEngine $engine;
    protected $factory;
    protected $config;
    protected $DB;

    /**
     * {@inheritDoc}
     *
     * @return void
     */
    function setUp() : void
    {
        $this->factory = NDB_Factory::singleton();
        $this->factory->reset();

        $this->config = $this->factory->Config("../project/config.xml");

        $database = $this->config->getSetting('database');

        $this->DB = $this->factory->database(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            true,
        );

        $this->factory->setDatabase($this->DB);

        $this->DB->setFakeTableData(
            "candidate",
            [
                [
                    'ID'                    => 1,
                    'CandID'                => "123456",
                    'PSCID'                 => "test1",
                    'RegistrationProjectID' => '1',
                    'RegistrationCenterID'  => '1',
                    'Active'                => 'Y',
                    'DoB'                   => '1920-01-30',
                    'DoD'                   => '1950-11-16',
                    'Sex'                   => 'Male',
                    'EDC'                   => null,
                    'Entity_type'           => 'Human',
                ],
                [
                    'ID'                    => 2,
                    'CandID'                => "123457",
                    'PSCID'                 => "test2",
                    'RegistrationProjectID' => '1',
                    'RegistrationCenterID'  => '2',
                    'Active'                => 'Y',
                    'DoB'                   => '1930-05-03',
                    'DoD'                   => null,
                    'Sex'                   => 'Female',
                    'EDC'                   => '1930-04-01',
                    'Entity_type'           => 'Human',
                ],
                [
                    'ID'                    => 3,
                    'CandID'                => "123458",
                    'PSCID'                 => "test3",
                    'RegistrationProjectID' => '1',
                    'RegistrationCenterID'  => '3',
                    'Active'                => 'N',
                    'DoB'                   => '1940-01-01',
                    'Sex'                   => 'Other',
                    'EDC'                   => '1930-04-01',
                    'Entity_type'           => 'Human',
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "session",
            [
                // Candidate 123456 has 2 visits, one with MRI data and one
                // without.
                [
                    'ID'          => 1,
                    'CandID'      => "123456",
                    'CenterID'    => 1,
                    'ProjectID'   => 1,
                    'CohortID'    => 1,
                    'Active'      => 'Y',
                    'Visit_Label' => 'TestMRIVisit',
                    'Scan_Done'   => 'Y'
                ],
                [
                    'ID'          => 2,
                    'CandID'      => "123456",
                    'CenterID'    => 1,
                    'ProjectID'   => 1,
                    'CohortID'    => 1,
                    'Active'      => 'Y',
                    'Visit_Label' => 'TestBvlVisit',
                    'Scan_Done'   => 'N'
                ],
                // Candidate 123457 has 1 visit with different MRI data
                // It contains multiple ScanType1 and no ScanType2
                [
                    'ID'          => 3,
                    'CandID'      => "123457",
                    'CenterID'    => 1,
                    'ProjectID'   => 1,
                    'CohortID'    => 1,
                    'Active'      => 'Y',
                    'Visit_Label' => 'TestMRIVisit',
                    'Scan_Done'   => 'Y'
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "mri_scan_type",
            [
                [
                    'ID'        => 98,
                    'Scan_type' => 'ScanType1',
                ],
                [
                    'ID'        => 99,
                    'Scan_type' => 'ScanType2',
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "files",
            [
                [
                    'FileID'                => 1,
                    'SessionID'             => 1,
                    'AcquisitionProtocolID' => 98,
                    'File'                  => 'test/abc.file'
                ],
                [
                    'FileID'                => 2,
                    'SessionID'             => 3,
                    'AcquisitionProtocolID' => 98,
                    'File'                  => 'test/abc.file1'
                ],
                [
                    'FileID'                => 3,
                    'SessionID'             => 3,
                    'AcquisitionProtocolID' => 98,
                    'File'                  => 'test/abc.file2'
                ],
                [
                    'FileID'                => 4,
                    'SessionID'             => 3,
                    'AcquisitionProtocolID' => 99,
                    'File'                  => 'test/Scantype2'
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "files_qcstatus",
            [
                [
                    'FileID'   => 1,
                    'QCStatus' => 'Pass'
                ],
                [
                    'FileID'   => 2,
                    'QCStatus' => 'Fail'
                ],
                [
                    'FileID'   => 3,
                    'QCStatus' => 'Pass'
                ],
            ]
        );
        // Ensure tests are run using this module directory with no overrides.
        // We are in test, so .. brings us to candidate_parameters and ../../ brings
        // us to modules for the LorisInstance config.
        $lorisinstance = new \LORIS\LorisInstance(
            $this->DB,
            $this->config,
            [__DIR__ . "/../../"]
        );

        $this->engine = $lorisinstance->getModule(
            'imaging_browser'
        )->getQueryEngine();
    }

    /**
     * {@inheritDoc}
     *
     * @return void
     */
    function tearDown() : void
    {
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS files_qcstatus");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS session");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS files");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS mri_scan_type");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS candidate");
    }

    /**
     * Test that matching ScanDone matches the correct CandIDs.
     *
     * @return void
     */
    public function testScanDoneMatches()
    {
        $dict = $this->_getDictItem("ScanDone");

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new Equal(true))
            )
        );

        // 123456 has a ScanDone = true result for visit TestMRIVisit
        // So does 123457.
        $this->assertTrue(is_array($result));
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        // 123456 has a ScanDone = false result for visit TestBvlVisit
        // No other candidate has a ScanDone=false session.
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new NotEqual(true))
            )
        );
        $this->assertTrue(is_array($result));
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
    }

    /**
     * Test that matching a modality matches the correct CandIDs.
     *
     * @return void
     */
    public function testImageLocationMatches()
    {
        $dict = $this->_getDictItem("ScanType1_file");

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new Equal('test/abc.file'))
            )
        );

        // 123456 has ScanType1 at session 1
        $this->assertTrue(is_array($result));
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        // 123456 has no files that aren't equal to test/abc.file
        // 123457 has files that are not equal to test/abc.file.
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new NotEqual('test/abc.file'))
            )
        );
        $this->assertTrue(is_array($result));
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        // Both 123456 and 123457 have files that start with test/abc
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new StartsWith('test/abc'))
            )
        );
        $this->assertTrue(is_array($result));
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        // Both 123456 and 123457 have files that contain abc
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new Substring('abc'))
            )
        );
        $this->assertTrue(is_array($result));
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        // Only 123457 has files that end with abc.file1
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new EndsWith('abc.file1'))
            )
        );
        $this->assertTrue(is_array($result));
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));
    }

    /**
     * Test that matching a QC Status matches the correct CandIDs.
     *
     * @return void
     */
    public function testImageQCMatches()
    {
        $dict = $this->_getDictItem("ScanType1_QCStatus");

        // Both candidates have a passed scan
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new Equal('Pass'))
            )
        );
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        // Only 123457 has a failed scan.
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new Equal('Fail'))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        // The failed scan is the only not Equal to pass Scan
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new NotEqual('Pass'))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        // The failed scan is still the only failed scan with an "IN" criteria
        // The failed scan is the only not Equal to pass Scan
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($dict, new In('Fail'))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        // FIXME: Exists is an option on the frontend, should test.

    }

    /**
     * Ensures that getCandidateData works for all field types
     * in the dictionary.
     *
     * @return void
     */
    function testGetCandidateData()
    {
        // Test getting some candidate scoped data
        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [
                    $this->_getDictItem("ScanDone"),
                    $this->_getDictItem("ScanType1_file"),
                    $this->_getDictItem("ScanType1_QCStatus"),
                ],
                [new CandID("123456"), new CandID("123457"), new CandID("123458")],
                null
            )
        );

        // 123458 had no files, but has a session, so still has the ScanDone
        $this->assertEquals(count($results), 3);
        $this->assertEquals(
            $results,
            [
                "123456" => [
                    "ScanDone"           => [
                        "1" => [
                            'VisitLabel' => 'TestMRIVisit',
                            'SessionID'  => 1,
                            'value'      => true,
                        ],
                        "2" => [
                            'VisitLabel' => 'TestBvlVisit',
                            'SessionID'  => 2,
                            'value'      => false,
                        ],
                    ],
                    "ScanType1_file"     => [
                        'keytype' => 'Imaging Filename',
                        "1"       => [
                            'VisitLabel' => 'TestMRIVisit',
                            'SessionID'  => 1,
                            'values'     => ['abc.file' => 'test/abc.file'],
                        ],
                    ],
                    "ScanType1_QCStatus" => [
                        'keytype' => 'Imaging Filename',
                        "1"       => [
                            'VisitLabel' => 'TestMRIVisit',
                            'SessionID'  => 1,
                            'values'     => ['abc.file' => 'Pass'],
                        ],
                    ],
                ],
                "123457" => [
                    "ScanDone"           => [
                        "3" => [
                            'VisitLabel' => 'TestMRIVisit',
                            'SessionID'  => 3,
                            'value'      => true,
                        ]
                    ],
                    "ScanType1_file"     => [
                        'keytype' => 'Imaging Filename',
                        "3"       => [
                            'VisitLabel' => 'TestMRIVisit',
                            'SessionID'  => 3,
                            'values'     => [
                                'abc.file1' => 'test/abc.file1',
                                'abc.file2' => 'test/abc.file2'
                            ],
                        ]
                    ],
                    "ScanType1_QCStatus" => [
                        'keytype' => 'Imaging Filename',
                        "3"       => [
                            'VisitLabel' => 'TestMRIVisit',
                            'SessionID'  => 3,
                            'values'     => [
                                'abc.file1' => 'Fail',
                                'abc.file2' => 'Pass'
                            ],
                        ],
                    ],
                ],
                "123458" => [
                    'ScanDone'           => [],
                    'ScanType1_file'     => [],
                    'ScanType1_QCStatus' => [],
                ],
            ]
        );
    }

    /**
     * Gets a dictionary item named $name, in any
     * category.
     *
     * @param string $name The dictionary item name
     *
     * @return \LORIS\Data\Dictionary\DictionaryItem
     */
    private function _getDictItem(string $name)
    {
        $categories = $this->engine->getDataDictionary();
        foreach ($categories as $category) {
            $items = $category->getItems();
            foreach ($items as $item) {
                if ($item->getName() == $name) {
                    return $item;
                }
            }
        }
        throw new \Exception("Could not get dictionary item");
    }
}

