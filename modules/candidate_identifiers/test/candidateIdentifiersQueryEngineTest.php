<?php declare(strict_types=1);

/**
 * Candidate Identifiers Query Engine tests.
 *
 * PHP version 8
 *
 * @category Tests
 * @package  LORIS
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

use PHPUnit\Framework\TestCase;

use LORIS\StudyEntities\Candidate\CandID;
use LORIS\Data\Query\QueryTerm;

use LORIS\Data\Query\Criteria\Equal;
use LORIS\Data\Query\Criteria\NotEqual;
use LORIS\Data\Query\Criteria\In;

use LORIS\Data\Query\Criteria\GreaterThanOrEqual;
use LORIS\Data\Query\Criteria\GreaterThan;
use LORIS\Data\Query\Criteria\LessThanOrEqual;
use LORIS\Data\Query\Criteria\LessThan;

use LORIS\Data\Query\Criteria\IsNull;
use LORIS\Data\Query\Criteria\NotNull;

use LORIS\Data\Query\Criteria\StartsWith;
use LORIS\Data\Query\Criteria\EndsWith;
use LORIS\Data\Query\Criteria\Substring;

/**
 * Tests all operations of the Candidate Identifiers Query Engine.
 *
 * @category Tests
 * @package  LORIS
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CandidateIdentifiersQueryEngineTest extends TestCase
{
    protected \LORIS\candidate_identifiers\QueryEngine $engine;
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
            "candidate_identifier_types",
            [
                [
                    'CandidateIdentifierTypeID' => 1,
                    'Name'                      => 'PSCID',
                    'Format'                    => '{SITE:ALIAS}'
                        . '{SEQUENCE:4,FORMAT:alphanumeric}',
                    'AllowMultiple'             => 0,
                    'permID'                    => null,

                    'IsRequired'                => 1,
                    'IsUnique'                  => 1,
                    'AutoGenerate'              => 1,
                ],
                [
                    'CandidateIdentifierTypeID' => 2,
                    'Name'                      => 'ExternalID',
                    'Format'                    => '{ALPHANUMERIC:8}',
                    'AllowMultiple'             => 0,
                    'permID'                    => null,
                    'IsRequired'                => 0,
                    'IsUnique'                  => 1,
                    'AutoGenerate'              => 0,
                ],
                [
                    'CandidateIdentifierTypeID' => 3,
                    'Name'                      => 'AlternateID',
                    'Format'                    => '{ALPHANUMERIC:8}',
                    'AllowMultiple'             => 1,
                    'permID'                    => null,
                    'IsRequired'                => 0,
                    'IsUnique'                  => 0,
                    'AutoGenerate'              => 0,
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "candidate_identifiers",
            [
                [
                    'CandidateIdentifierID'     => 1,
                    'CandidateID'               => 1,
                    'CandidateIdentifierTypeID' => 1,
                    'Value'                     => 'test1',
                ],
                [
                    'CandidateIdentifierID'     => 2,
                    'CandidateID'               => 2,
                    'CandidateIdentifierTypeID' => 1,
                    'Value'                     => 'test2',
                ],
                [
                    'CandidateIdentifierID'     => 3,
                    'CandidateID'               => 1,
                    'CandidateIdentifierTypeID' => 2,
                    'Value'                     => 'EXT001',
                ],
                [
                    'CandidateIdentifierID'     => 4,
                    'CandidateID'               => 2,
                    'CandidateIdentifierTypeID' => 2,
                    'Value'                     => 'EXT002',
                ],
                [
                    'CandidateIdentifierID'     => 5,
                    'CandidateID'               => 1,
                    'CandidateIdentifierTypeID' => 3,
                    'Value'                     => 'ALT001',
                ],
                [
                    'CandidateIdentifierID'     => 6,
                    'CandidateID'               => 1,
                    'CandidateIdentifierTypeID' => 3,
                    'Value'                     => 'ALT002',
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "candidate_identifier_types_project_rel",
            []
        );

        // Ensure tests are run using this module directory with no overrides.
        // We are in test, so .. brings us to candidate_parameters and ../../ brings
        // us to modules for the LorisInstance config.
        $lorisinstance = new \LORIS\LorisInstance(
            $this->DB,
            $this->config,
            [__DIR__ . "/../../"]
        );

        $engine = $lorisinstance->getModule(
            'candidate_identifiers'
        )->getQueryEngines()[0];

        assert($engine instanceof \LORIS\candidate_identifiers\QueryEngine);

        $this->engine = $engine;
    }

    /**
     * {@inheritDoc}
     *
     * @return void
     */
    function tearDown() : void
    {
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS candidate");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS candidate_identifiers");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS candidate_identifier_types");
        $this->DB->run(
            "DROP TEMPORARY TABLE IF EXISTS candidate_identifier_types_project_rel"
        );
    }

    /**
     * Test that matching configurable identifier values returns
     * the correct CandIDs.
     *
     * @return void
     */
    public function testIdentifierMatches()
    {
        $candiddict = $this->_getDictItem("Identifier_1");

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("test1"))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        // 123456 is equal, and 123458 is Active='N', so we should only get 123457
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("test1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("test2"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("test2", "test1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThanOrEqual("test1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThan("test1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThanOrEqual("test2"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThan("test2"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new IsNull())
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotNull())
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("test"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("EXT"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("test1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        // No configured identifier ends with "3".
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("3"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Substring("est"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));
    }

    /**
     * Test that matching PSCID fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testExternalIdentifierMatches()
    {
        $candiddict = $this->_getDictItem("Identifier_2");
        $result     = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("EXT001"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("EXT001"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("EXT001"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("EXT"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("002"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Substring("XT"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new IsNull())
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotNull())
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        // No LessThan/GreaterThan/etc since PSCID is a string
    }

    /**
     * Test retrieval of configurable candidate identifiers.
     *
     * @return void
     */
    function testGetCandidateData()
    {
        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [
                    $this->_getDictItem("Identifier_1"),
                    $this->_getDictItem("Identifier_2"),
                ],
                [new CandID("123456")],
                null
            )
        );

        $this->assertEquals(
            [
                '123456' => [
                    'Identifier_1' => 'test1',
                    'Identifier_2' => 'EXT001',
                ],
            ],
            $results
        );
    }

    /**
     * Test retrieval of multiple values for a candidate identifier.
     *
     * @return void
     */
    public function testGetMultipleCandidateIdentifiers()
    {
        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [$this->_getDictItem("Identifier_3")],
                [new CandID("123456")],
                null
            )
        );

        $this->assertArrayHasKey('123456', $results);

        $candidateData = $results['123456'];

        if (!is_array($candidateData)) {
            $this->fail('Expected candidate data to be an array.');
        }

        $this->assertArrayHasKey('Identifier_3', $candidateData);

        $identifier = $candidateData['Identifier_3'];

        $this->assertEquals(
            'Candidate Identifier ID',
            $identifier['keytype']
        );

        $this->assertEquals(
            [
                5 => 'ALT001',
                6 => 'ALT002',
            ],
            $identifier['values']
        );
    }

    /**
     * Assert that nothing matched in a result.
     *
     * @param iterable $result The result of getCandidateMatches
     *
     * @return void
     */
    protected function assertMatchNone($result)
    {
        if (!is_array($result)) {
            $result = iterator_to_array($result);
        }
        $this->assertTrue(is_array($result));
        $this->assertEquals(0, count($result));
    }

    /**
     * Assert that exactly 1 result matched and it was $candid
     *
     * @param iterable $result The result of getCandidateMatches
     * @param string   $candid The expected CandID
     *
     * @return void
     */
    protected function assertMatchOne($result, $candid)
    {
        if (!is_array($result)) {
            $result = iterator_to_array($result);
        }
        $this->assertTrue(is_array($result));
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID($candid));
    }

    /**
     * Assert that a query matched all candidates from the test.
     *
     * @param iterable $result The result of getCandidateMatches
     *
     * @return void
     */
    protected function assertMatchAll($result)
    {
        if (!is_array($result)) {
            $result = iterator_to_array($result);
        }
        $this->assertTrue(is_array($result));
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));
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
