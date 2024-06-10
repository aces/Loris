<?php

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
 * Tests all operations of the CandidateQueryEngine
 * implementation
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CandidateQueryEngineTest extends TestCase
{

    protected \LORIS\candidate_parameters\CandidateQueryEngine $engine;
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

        // Ensure tests are run using this module directory with no overrides.
        // We are in test, so .. brings us to candidate_parameters and ../../ brings
        // us to modules for the LorisInstance config.
        $lorisinstance = new \LORIS\LorisInstance(
            $this->DB,
            $this->config,
            [__DIR__ . "/../../"]
        );

        $this->engine = $lorisinstance->getModule(
            'candidate_parameters'
        )->getQueryEngine();
    }

    /**
     * {@inheritDoc}
     *
     * @return void
     */
    function tearDown() : void
    {
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS candidate");
    }

    /**
     * Test that matching CandID fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testCandIDMatches()
    {
        $candiddict = $this->_getDictItem("CandID");

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("123456"))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        // 123456 is equal, and 123458 is Active='N', so we should only get 123457
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("123456"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("123457"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("123457", "123456"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThanOrEqual("123456"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThan("123456"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThanOrEqual("123457"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThan("123457"))
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
                new QueryTerm($candiddict, new StartsWith("1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("2"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("123456"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("6"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        // 123458 is inactive
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("8"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Substring("5"))
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
    public function testPSCIDMatches()
    {
        $candiddict = $this->_getDictItem("PSCID");
        $result     = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("test1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

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
                new QueryTerm($candiddict, new In("test1"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("te"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("t2"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Substring("es"))
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
     * Test that matching DoB fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testDoBMatches()
    {
        $candiddict = $this->_getDictItem("DoB");
        $result     = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("1920-01-30"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("1920-01-30"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("1920-01-30"))
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
                new QueryTerm($candiddict, new LessThanOrEqual("1930-05-03"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThan("1930-05-03"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThan("1920-01-30"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThanOrEqual("1920-01-30"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        // No starts/ends/substring because it's a date
    }

    /**
     * Test that matching DoD fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testDoDMatches()
    {
        $candiddict = $this->_getDictItem("DoD");
        $result     = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("1950-11-16"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        // XXX: Is this what users expect? It's what SQL logic is, but it's
        // not clear that a user would expect of the DQT when a field is not
        // equal compared to null.
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("1950-11-16"))
            )
        );
        $this->assertTrue(is_array($result));
        $this->assertEquals(0, count($result));
        // $this->assertEquals(1, count($result));
        // $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("1950-11-16"))
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
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotNull())
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThanOrEqual("1951-05-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThan("1951-05-03"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThan("1950-01-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThanOrEqual("1950-01-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        // No starts/ends/substring because it's a date
    }

    /**
     * Test that matching Sex fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testSexMatches()
    {
        $candiddict = $this->_getDictItem("Sex");
        $result     = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("Male"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("Male"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("Female"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new IsNull())
            )
        );
        $this->assertTrue(is_array($result));
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
                new QueryTerm($candiddict, new StartsWith("Fe"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("male"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(2, count($result));
        $this->assertEquals($result[0], new CandID("123456"));
        $this->assertEquals($result[1], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Substring("fem"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));
        // No <, <=, >, >= because it's an enum.
    }

    /**
     * Test that matching EDC fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testEDCMatches()
    {
        $candiddict = $this->_getDictItem("EDC");
        $result     = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("1930-04-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        // XXX: It's not clear that this is what a user would expect from != when
        // a value is null. It's SQL logic.
        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("1930-04-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));
        //$this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("1930-04-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new IsNull())
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotNull())
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThanOrEqual("1930-04-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new LessThan("1930-04-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThan("1930-03-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new GreaterThanOrEqual("1930-04-01"))
            )
        );
        $this->assertTrue(is_array($result));
        assert(is_array($result)); // for phan to know the type
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));
        // StartsWith/EndsWith/Substring not valid since it's a date.
    }

    /**
     * Test that matching RegistrationProject fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testRegistrationProjectMatches()
    {
        // Both candidates only have registrationProjectID 1, but we can
        // be pretty comfortable with the comparison operators working in
        // general because of the other field tests, so we just make sure
        // that the project is set up and do basic tests
        $this->DB->setFakeTableData(
            "Project",
            [
                [
                    'ProjectID'         => 1,
                    'Name'              => 'TestProject',
                    'Alias'             => 'TST',
                    'recruitmentTarget' => 3
                ]
            ]
        );

        $candiddict = $this->_getDictItem("RegistrationProject");
        $result     = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Equal("TestProject"))
        );
        $this->assertMatchAll($result);

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("TestProject"))
            )
        );
        $this->assertEquals(0, count($result));

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotEqual("TestProject2"))
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new In("TestProject"))
        );
        $this->assertMatchAll($result);

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new IsNull())
            )
        );
        $this->assertEquals(0, count($result));

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotNull())
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new StartsWith("TestP"))
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new EndsWith("ject"))
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Substring("stProj"))
        );
        $this->assertMatchAll($result);

        // <=, <, >=, > are meaningless since it's a string
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS Project");
    }

    /**
     * Test that matching RegistrationSite fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testRegistrationSiteMatches()
    {
        $this->DB->setFakeTableData(
            "psc",
            [
                [
                    'CenterID'   => 1,
                    'Name'       => 'TestSite',
                    'Alias'      => 'TST',
                    'MRI_alias'  => 'TSTO',
                    'Study_site' => 'Y',
                ],
                [
                    'CenterID'   => 2,
                    'Name'       => 'Test Site 2',
                    'Alias'      => 'T2',
                    'MRI_alias'  => 'TSTY',
                    'Study_site' => 'N',
                ]
            ]
        );

        $candiddict = $this->_getDictItem("RegistrationSite");
        $result     = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Equal("TestSite"))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123456"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotEqual("TestSite"))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new In("TestSite", "Test Site 2"))
            )
        );
        $this->assertMatchAll($result);

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new IsNull())
            )
        );
        $this->assertEquals(0, count($result));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new NotNull())
            )
        );
        $this->assertMatchAll($result);

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new StartsWith("Test"))
            )
        );
        $this->assertMatchAll($result);

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new EndsWith("2"))
            )
        );
        $this->assertEquals(1, count($result));
        $this->assertEquals($result[0], new CandID("123457"));

        $result = iterator_to_array(
            $this->engine->getCandidateMatches(
                new QueryTerm($candiddict, new Substring("Site"))
            )
        );
        $this->assertMatchAll($result);

        // <=, <, >=, > are meaningless since it's a string
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS psc");
    }

    /**
     * Test that matching entity type fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    public function testEntityType()
    {
        $candiddict = $this->_getDictItem("EntityType");
        $result     = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Equal("Human"))
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotEqual("Human"))
        );
        $this->assertMatchNone($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new In("Scanner"))
        );
        $this->assertMatchNone($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new IsNull())
        );
        $this->assertMatchNone($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotNull())
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new StartsWith("Hu"))
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new EndsWith("an"))
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Substring("um"))
        );
        $this->assertMatchAll($result);
        // No <, <=, >, >= because it's an enum.
    }

    /**
     * Test that matching visit label fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    function testVisitLabelMatches()
    {
        // 123456 has multiple visits, 123457 has none. Operators are implicitly
        // "for at least 1 session".
        $this->DB->setFakeTableData(
            "session",
            [
                [
                    'ID'          => 1,
                    'CandID'      => "123456",
                    'CenterID'    => '1',
                    'ProjectID'   => '1',
                    'Active'      => 'Y',
                    'Visit_label' => 'V1',
                ],
                [
                    'ID'          => 2,
                    'CandID'      => "123456",
                    'CenterID'    => '2',
                    'ProjectID'   => '1',
                    'Active'      => 'Y',
                    'Visit_label' => 'V2',
                ],
            ]
        );

        $candiddict = $this->_getDictItem("VisitLabel");
        $result     = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Equal("V1"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotEqual("V1"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new In("V3"))
        );
        $this->assertMatchNone($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new StartsWith("V"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new EndsWith("1"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Substring("V"))
        );
        $this->assertMatchOne($result, "123456");

        // <, <=, >, >= not valid because visit label is a string
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS session");
    }

    /**
     * Test that matching project fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    function testProjectMatches()
    {
        // 123456 has multiple visits, 123457 has none. Operators are implicitly
        // "for at least 1 session".
        // The ProjectID for the session doesn't match the RegistrationProjectID
        // for, so we need to ensure that the criteria is being compared based
        // on the session's, not the registration.
        $this->DB->setFakeTableData(
            "session",
            [
                [
                    'ID'          => 1,
                    'CandID'      => "123456",
                    'CenterID'    => '1',
                    'ProjectID'   => '2',
                    'Active'      => 'Y',
                    'Visit_label' => 'V1',
                ],
                [
                    'ID'          => 2,
                    'CandID'      => "123456",
                    'CenterID'    => '2',
                    'ProjectID'   => '2',
                    'Active'      => 'Y',
                    'Visit_label' => 'V2',
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "Project",
            [
                [
                    'ProjectID'         => 1,
                    'Name'              => 'TestProject',
                    'Alias'             => 'TST',
                    'recruitmentTarget' => 3
                ],
                [
                    'ProjectID'         => 2,
                    'Name'              => 'TestProject2',
                    'Alias'             => 'T2',
                    'recruitmentTarget' => 3
                ]
            ]
        );

        $candiddict = $this->_getDictItem("Project");
        $result     = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Equal("TestProject"))
        );
        $this->assertMatchNone($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotEqual("TestProject"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new In("TestProject2"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new StartsWith("Test"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new EndsWith("2"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Substring("Pr"))
        );
        $this->assertMatchOne($result, "123456");

        // <, <=, >, >= not valid because visit label is a string
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS session");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS Project");
    }

    /**
     * Test that matching site fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    function testSiteMatches()
    {
        // 123456 has multiple visits at different centers, 123457 has none.
        // Operators are implicitly "for at least 1 session" so only 123456
        // should ever match.
        $this->DB->setFakeTableData(
            "session",
            [
                [
                    'ID'          => 1,
                    'CandID'      => "123456",
                    'CenterID'    => '1',
                    'ProjectID'   => '2',
                    'Active'      => 'Y',
                    'Visit_label' => 'V1',
                ],
                [
                    'ID'          => 2,
                    'CandID'      => "123456",
                    'CenterID'    => '2',
                    'ProjectID'   => '2',
                    'Active'      => 'Y',
                    'Visit_label' => 'V2',
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "psc",
            [
                [
                    'CenterID'   => 1,
                    'Name'       => 'TestSite',
                    'Alias'      => 'TST',
                    'MRI_alias'  => 'TSTO',
                    'Study_site' => 'Y',
                ],
                [
                    'CenterID'   => 2,
                    'Name'       => 'Test Site 2',
                    'Alias'      => 'T2',
                    'MRI_alias'  => 'TSTY',
                    'Study_site' => 'N',
                ]
            ]
        );

        $candiddict = $this->_getDictItem("Site");
        $result     = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Equal("TestSite"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotEqual("TestSite"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new In("TestSite"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new StartsWith("Test"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new EndsWith("2"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Substring("ite"))
        );
        $this->assertMatchOne($result, "123456");

        // <, <=, >, >= not valid because visit label is a string
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS session");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS psc");
    }

    /**
     * Test that matching cohort fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    function testCohortMatches()
    {
        // 123456 and 123457 have 1 visit each, different cohorts
        $this->DB->setFakeTableData(
            "session",
            [
                [
                    'ID'          => 1,
                    'CandID'      => "123456",
                    'CenterID'    => '1',
                    'ProjectID'   => '2',
                    'CohortID'    => '1',
                    'Active'      => 'Y',
                    'Visit_label' => 'V1',
                ],
                [
                    'ID'          => 2,
                    'CandID'      => "123457",
                    'CenterID'    => '2',
                    'ProjectID'   => '2',
                    'CohortID'    => '2',
                    'Active'      => 'Y',
                    'Visit_label' => 'V2',
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "cohort",
            [
                [
                    'CohortID'          => 1,
                    'title'             => 'Cohort1',
                    'useEDC'            => '0',
                    'Windowdifference'  => 'battery',
                    'RecruitmentTarget' => 3,
                ],
                [
                    'CohortID'          => 2,
                    'title'             => 'Battery 2',
                    'useEDC'            => '0',
                    'Windowdifference'  => 'battery',
                    'RecruitmentTarget' => 3,
                ],
            ]
        );

        $candiddict = $this->_getDictItem("Cohort");
        $result     = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Equal("Cohort1"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotEqual("Cohort1"))
        );
        $this->assertMatchOne($result, "123457");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new In("Cohort1"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new IsNull())
        );
        $this->assertMatchNone($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotNull())
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new StartsWith("Coh"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new EndsWith("1"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Substring("hor"))
        );
        $this->assertMatchOne($result, "123456");

        // <, <=, >, >= not valid because visit label is a string
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS session");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS cohort");
    }

    /**
     * Test that matching participant status fields matches the correct
     * CandIDs.
     *
     * @return void
     */
    function testParticipantStatusMatches()
    {
        $candiddict = $this->_getDictItem("ParticipantStatus");
        $this->DB->setFakeTableData(
            "participant_status_options",
            [
                [
                    'ID'          => 1,
                    'Description' => "Withdrawn",
                ],
                [
                    'ID'          => 2,
                    'Description' => "Active",
                ],
            ]
        );
        $this->DB->setFakeTableData(
            "participant_status",
            [
                [
                    'ID'                 => 1,
                    'CandID'             => "123457",
                    'participant_status' => '1',
                ],
                [
                    'ID'                 => 2,
                    'CandID'             => "123456",
                    'participant_status' => '2',
                ],
            ]
        );

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Equal("Withdrawn"))
        );
        $this->assertMatchOne($result, "123457");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotEqual("Withdrawn"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new In("Withdrawn", "Active"))
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new IsNull())
        );
        $this->assertMatchNone($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new NotNull())
        );
        $this->assertMatchAll($result);

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new StartsWith("With"))
        );
        $this->assertMatchOne($result, "123457");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new EndsWith("ive"))
        );
        $this->assertMatchOne($result, "123456");

        $result = $this->engine->getCandidateMatches(
            new QueryTerm($candiddict, new Substring("ct"))
        );
        $this->assertMatchOne($result, "123456");

        // <, <=, >, >= not valid on participant status
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS participant_status");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS participant_status_options");
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
                [$this->_getDictItem("CandID")],
                [new CandID("123456")],
                null
            )
        );
        $this->assertEquals(count($results), 1);
        $this->assertEquals($results, [ '123456' => ["CandID" => "123456" ]]);
        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [$this->_getDictItem("PSCID")],
                [new CandID("123456")],
                null
            )
        );
        $this->assertEquals(count($results), 1);
        $this->assertEquals($results, [ '123456' => ["PSCID" => "test1" ]]);

        // Get all candidate variables that don't require setup at once.
        // There are no sessions setup, so session scoped variables
        // should be an empty array.
        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [
                    $this->_getDictItem("CandID"),
                    $this->_getDictItem("PSCID"),
                    $this->_getDictItem("DoB"),
                    $this->_getDictItem("DoD"),
                    $this->_getDictItem("Sex"),
                    $this->_getDictItem("EDC"),
                    $this->_getDictItem("EntityType"),
                    $this->_getDictItem("VisitLabel"),
                    $this->_getDictItem("Project"),
                    $this->_getDictItem("Cohort"),
                    $this->_getDictItem("Site"),
                ],
                [new CandID("123456")],
                null
            )
        );
        $this->assertEquals(count($results), 1);
        $this->assertEquals(
            $results,
            [ '123456' => [
                "CandID"     => "123456",
                "PSCID"      => "test1",
                'DoB'        => '1920-01-30',
                'DoD'        => '1950-11-16',
                'Sex'        => 'Male',
                'EDC'        => null,
                'EntityType' => 'Human',
                'VisitLabel' => [],
                'Project'    => [],
                'Cohort'     => [],
                'Site'       => [],
            ]
            ]
        );

        // Test things that are Candidate scoped but need
        // data from tables RegistrationProject, RegistrationSite,
        // ParticipantStatus
        $this->DB->setFakeTableData(
            "psc",
            [
                [
                    'CenterID'   => 1,
                    'Name'       => 'TestSite',
                    'Alias'      => 'TST',
                    'MRI_alias'  => 'TSTO',
                    'Study_site' => 'Y',
                ],
                [
                    'CenterID'   => 2,
                    'Name'       => 'Test Site 2',
                    'Alias'      => 'T2',
                    'MRI_alias'  => 'TSTY',
                    'Study_site' => 'N',
                ]
            ]
        );

        $this->DB->setFakeTableData(
            "participant_status_options",
            [
                [
                    'ID'          => 1,
                    'Description' => "Withdrawn",
                ],
                [
                    'ID'          => 2,
                    'Description' => "Active",
                ],
            ]
        );
        $this->DB->setFakeTableData(
            "participant_status",
            [
                [
                    'ID'                 => 1,
                    'CandID'             => "123457",
                    'participant_status' => '1',
                ],
                [
                    'ID'                 => 2,
                    'CandID'             => "123456",
                    'participant_status' => '2',
                ],
            ]
        );
        $this->DB->setFakeTableData(
            "Project",
            [
                [
                    'ProjectID'         => 1,
                    'Name'              => 'TestProject',
                    'Alias'             => 'TST',
                    'recruitmentTarget' => 3
                ],
                [
                    'ProjectID'         => 2,
                    'Name'              => 'TestProject2',
                    'Alias'             => 'T2',
                    'recruitmentTarget' => 3
                ]
            ]
        );

        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [
                    $this->_getDictItem("ParticipantStatus"),
                    $this->_getDictItem("RegistrationProject"),
                    $this->_getDictItem("RegistrationSite"),
                    $this->_getDictItem("Cohort"),
                ],
                [new CandID("123456")],
                null
            )
        );

        $this->assertEquals(count($results), 1);
        $this->assertEquals(
            $results,
            [ '123456' => [
                'ParticipantStatus'   => 'Active',
                'RegistrationProject' => 'TestProject',
                'RegistrationSite'    => 'TestSite',
                // Project, Cohort, and Site are
                // still empty because there are no
                // sessions created
                //'Project' => [],
                'Cohort'              => [],
                //'Site' => [],
            ]
            ]
        );
        $this->DB->setFakeTableData(
            "session",
            [
                [
                    'ID'          => 1,
                    'CandID'      => "123456",
                    'CenterID'    => '1',
                    'ProjectID'   => '2',
                    'CohortID'    => '1',
                    'Active'      => 'Y',
                    'Visit_label' => 'V1',
                ],
                [
                    'ID'          => 2,
                    'CandID'      => "123456",
                    'CenterID'    => '2',
                    'ProjectID'   => '2',
                    'CohortID'    => '1',
                    'Active'      => 'Y',
                    'Visit_label' => 'V2',
                ],
                [
                    'ID'          => 3,
                    'CandID'      => "123457",
                    'CenterID'    => '2',
                    'ProjectID'   => '2',
                    'CohortID'    => '2',
                    'Active'      => 'Y',
                    'Visit_label' => 'V1',
                ],
            ]
        );

        $this->DB->setFakeTableData(
            "cohort",
            [
                [
                    'CohortID'          => 1,
                    'title'             => 'Cohort1',
                    'useEDC'            => '0',
                    'Windowdifference'  => 'battery',
                    'RecruitmentTarget' => 3,
                ],
                [
                    'CohortID'          => 2,
                    'title'             => 'Battery 2',
                    'useEDC'            => '0',
                    'Windowdifference'  => 'battery',
                    'RecruitmentTarget' => 3,
                ],
            ]
        );

        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [
                    $this->_getDictItem("VisitLabel"),
                    $this->_getDictItem("Site"),
                    $this->_getDictItem("Project"),
                    $this->_getDictItem("Cohort"),

                ],
                [new CandID("123456")],
                null
            )
        );
        $this->assertEquals(count($results), 1);
        $this->assertEquals(
            $results,
            [
                '123456' => [
                    // VisitLabel the dictionary name
                    'VisitLabel' => [
                        1 => [
                            // The visit label key for session scoped variables
                            'VisitLabel' => 'V1',
                            'SessionID'  => 1,
                            'value'      => 'V1'
                        ],
                        2 => [
                            'VisitLabel' => 'V2',
                            'SessionID'  => 2,
                            'value'      => 'V2'
                        ],
                    ],
                    'Site'       => [
                        1 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 1,
                            'value'      => 'TestSite'
                        ],
                        2 => [
                            'VisitLabel' => 'V2',
                            'SessionID'  => 2,
                            'value'      => 'Test Site 2'
                        ],
                    ],
                    'Project'    => [
                        1 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 1,
                            'value'      => 'TestProject2'
                        ],
                        2 => [
                            'VisitLabel' => 'V2',
                            'SessionID'  => 2,
                            'value'      => 'TestProject2'
                        ],
                    ],
                    'Cohort'     => [
                        1 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 1,
                            'value'      => 'Cohort1'
                        ],
                        2 => [
                            'VisitLabel' => 'V2',
                            'SessionID'  => 2,
                            'value'      => 'Cohort1'
                        ],
                    ],
                ],
            ]
        );

        $results = iterator_to_array(
            $this->engine->getCandidateData(
                [
                    $this->_getDictItem("VisitLabel"),
                    $this->_getDictItem("Cohort"),
                    $this->_getDictItem("Project"),
                    $this->_getDictItem("RegistrationSite"),
                ],
                // Note: results should be ordered when returning
                // them
                [new CandID("123457"), new CandID("123456")],
                null
            )
        );

        $this->assertEquals(count($results), 2);
        $this->assertEquals(
            $results,
            [
                '123456' => [
                    'VisitLabel'       => [
                        1 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 1,
                            'value'      => 'V1'
                        ],
                        2 => [
                            'VisitLabel' => 'V2',
                            'SessionID'  => 2,
                            'value'      => 'V2'
                        ],
                    ],
                    'Cohort'           => [
                        1 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 1,
                            'value'      => 'Cohort1'
                        ],
                        2 => [
                            'VisitLabel' => 'V2',
                            'SessionID'  => 2,
                            'value'      => 'Cohort1'
                        ],
                    ],
                    'Project'          => [
                        1 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 1,
                            'value'      => 'TestProject2'
                        ],
                        2 => [
                            'VisitLabel' => 'V2',
                            'SessionID'  => 2,
                            'value'      => 'TestProject2'
                        ],
                    ],
                    'RegistrationSite' => 'TestSite',
                ],
                '123457' => [
                    'VisitLabel'       => [
                        3 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 3,
                            'value'      => 'V1'
                        ],
                    ],
                    'Cohort'           => [
                        3 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 3,
                            'value'      => 'Battery 2'
                        ],
                    ],
                    'Project'          => [
                        3 => [
                            'VisitLabel' => 'V1',
                            'SessionID'  => 3,
                            'value'      => 'TestProject2'
                        ],
                    ],
                    'RegistrationSite' => 'Test Site 2',
                ]
            ]
        );

        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS psc");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS Project");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS participant_status");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS participant_status_options");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS cohort");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS session");
    }

    /**
     * Ensure that getCAndidateData doesn't use an excessive
     * amount of memory regardless of how big the data is.
     *
     * @return void
     */
    function testGetCandidateDataMemory()
    {
        $this->engine->useQueryBuffering(false);
        $insert = $this->DB->prepare(
            "INSERT INTO candidate 
            (ID, CandID, PSCID, RegistrationProjectID, RegistrationCenterID,
                Active, DoB, DoD, Sex, EDC, Entity_type)
            VALUES (?, ?, ?, '1', '1', 'Y', '1933-03-23', '1950-03-23',
                'Female', null, 'Human')"
        );

        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS candidate");
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS session");
        $this->DB->setFakeTableData("candidate", []);
        $this->DB->setFakeTableData("session", []);
        for ($i = 100000; $i < 100010; $i++) {
            $insert->execute([$i, $i, "Test$i"]);
        }

        $memory10 = memory_get_peak_usage();

        $bigSize = 20000;

        for ($i = 100010; $i < (100000 + $bigSize); $i++) {
            $insert->execute([$i, $i, "Test$i"]);
        }

        $memoryBig = memory_get_peak_usage();

        // Ensure that the memory used by php didn't change whether
        // a prepared statement was executed 10 or 200 times. Any
        // additional memory should have been used by the SQL server,
        // not by PHP.
        $this->assertTrue($memory10 == $memoryBig);

        $cand10  = [];
        $candBig = [];

        // Allocate the CandID array for both tests upfront to
        // ensure we're measuring memory used by getCandidateData
        // and not the size of the arrays passed as arguments.
        for ($i = 100000; $i < 100010; $i++) {
            $cand10[]  = new CandID("$i");
            $candBig[] = new CandID("$i");
        }
        for ($i = 100010; $i < (100000 + $bigSize); $i++) {
            $candBig[] = new CandID("$i");
        }

        $this->assertEquals(count($cand10), 10);
        $this->assertEquals(count($candBig), $bigSize);

        $results10 = $this->engine->getCandidateData(
            [$this->_getDictItem("PSCID")],
            $cand10,
            null,
        );

        $memory10data = memory_get_usage();

        // Go through all the data returned and measure
        // memory usage after.
        $i = 100000;
        foreach ($results10 as $candid => $data) {
            $this->assertEquals($candid, $i);
            // $this->assertEquals($data['PSCID'], "Test$i");
            $i++;
        }

        $memory10dataAfter = memory_get_usage();

        $iterator10usage = $memory10dataAfter - $memory10data;

        // Now see how much memory is used by iterating over
        // 200 candidates
        $resultsBig = $this->engine->getCandidateData(
            [$this->_getDictItem("PSCID")],
            $candBig,
            null,
        );

        $memoryBigDataBefore = memory_get_usage();
        $i = 100000;
        foreach ($resultsBig as $candid => $data) {
            $this->assertEquals($candid, $i);
            // $this->assertEquals($data['PSCID'], "Test$i");
            $i++;
        }

        $memoryBigDataAfter = memory_get_usage();
        $iteratorBigUsage   = $memoryBigDataAfter - $memoryBigDataBefore;

        // We tested 20,000 candidates. Give 2k buffer room for variation in
        // memory usage.
        $this->assertTrue($iteratorBigUsage <= ($iterator10usage + (1024*2)));
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS candidate");
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

