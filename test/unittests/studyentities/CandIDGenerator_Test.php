<?php declare(strict_types=1);
namespace LORIS\StudyEntitites\Candidate\Test;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \PHPUnit\Framework\TestCase;
use \LORIS\StudyEntities\Candidate\CandID;
use \LORIS\StudyEntities\Candidate\CandIDGenerator;

class CandIDGenerator_Test extends TestCase {

    private $_dbMock;
    private $_configMock;
    private $_configMap = array();

    /* These values should match the constants in CandIDGenerator and CandID */
    private const MIN_CANDID = 100000;
    private const MAX_CANDID = 999999;

    /**
     * Sets up fixtures:
     *  - config and Database test doubles
     *  - _factory
     *
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();
        $this->_configMap = array(
            array(
                'useProjects',
                false,
            ),
            array(
                'HeaderTable',
                null,
            ),
        );
        #$this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        #$this->_dbMock     = $this->getMockBuilder('Database')->getMock();
        #$this->_factory   = \NDB_Factory::singleton();
        #$this->_factory->setConfig($this->_configMock);
        #$this->_factory->setDatabase($this->_dbMock);
    }

    /**
     * Ensure that a generated CandID is within the minimum and maximum range.
     *
     * @covers CandIDGenerator::generate()
     * @return void
     */
    public function testGeneratedCandIDIsWithinBounds()
    {
        $candidateID = (new CandIDGenerator)->generate();
        
        $stringified = (string) $candidateID;
        $is_numeric = is_numeric($stringified);
        $this->assertTrue(is_numeric($stringified));
        $this->assertGreaterThanOrEqual(self::MIN_CANDID, intval($stringified));
        $this->assertLessThanOrEqual(self::MAX_CANDID, intval($stringified));
        // Leverage validation of CandID object to ensure that the ID generated
        // is valid.
        new CandID((new CandIDGenerator)->generate());
    }
}
