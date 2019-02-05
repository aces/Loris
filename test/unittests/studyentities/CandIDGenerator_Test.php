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
        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();
        $this->_factory   = \NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
    }

    /**
     * Test static function Candidate::_generateCandID
     * returns first generated _candidate ID
     * (i.e. 1st generated ID does not exist in DB)
     *
     * @covers Candidate::_generateCandID
     * @return void
     */
    public function testGenerateCandIDReturnsFirstGeneratedID()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectOne')
            ->willReturn(0);

        $candidateID = new CandID((new CandIDGenerator)->generate());
    }

    /**
     * Test static function Candidate::_generateCandID
     * returns second generated _candidate ID
     * when 1st one exists in DB
     *
     * @covers Candidate::_generateCandID
     * @return void
     */
    public function testGenerateCandIDReturnsSecondGeneratedID()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->will($this->onConsecutiveCalls(self::MIN_CANDID, 0));

        $candidateID = new CandID((new CandIDGenerator)->generate());
    }
}
