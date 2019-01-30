<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
use \PHPUnit\Framework\TestCase;

class CandIDGenerator_Test extends TestCase {
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

        $candidateID = (new CandIDGenerator)->generate();
        $this->assertGreaterThanOrEqual(CANDIDATE_MIN_CANDID, $candidateID);
        $this->assertLessThanOrEqual(CANDIDATE_MAX_CANDID, $candidateID);
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
            ->will($this->onConsecutiveCalls(CANDIDATE_MIN_CANDID, 0));

        $candidateID = (new CandIDGenerator)->generate();
        $this->assertGreaterThanOrEqual(CANDIDATE_MIN_CANDID, $candidateID);
        $this->assertLessThanOrEqual(CANDIDATE_MAX_CANDID, $candidateID);
    }
}
