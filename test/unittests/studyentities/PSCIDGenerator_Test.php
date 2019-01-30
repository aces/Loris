<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
use \PHPUnit\Framework\TestCase;
use \LORIS\StudyEntities\Candidate\PSCIDGenerator;

class PSCIDGenerator_Test extends TestCase {

    /**
     * Test PSCIDGenerator for config setting
     * generation = random, & type=numeric
     *
     * @return void
     */
    public function testGeneratePSCIDForRandomNumericGeneration()
    {
        $seq = array(
            'seq' => array(
                0 => array(
                    '#' => '',
                    '@' => array('type' => 'siteAbbrev'),
                ),
                1 => array(
                    '#' => '',
                    '@' => array(
                        'type'      => 'numeric',
                        'minLength' => '4',
                    ),
                ),
            ),
        );

        $this->_configMap = array(
            array(
                'PSCID',
                array(
                    'generation' => 'random',
                    'structure'  => $seq,
                ),
            ),
        );

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));

        //mock Database::pselectOne(), returns count 0
        //case when generated PSCID is not used, therefore not found in DB
        $this->_dbMock->expects($this->once())
            ->method('pselectOne')
            ->willReturn(0);

        $this->assertRegExp('/AAA[0-9]{4}$/', (new PSCIDGenerator('AAA'))->generate());
    }

    /**
     * Test static function Candidate::_generatePSCID for config setting
     * generation=sequential & type=numeric
     * For this test _generatePSCID should return 3rd generated PSCID,
     * since 2 other ones already exist in DB
     *
     * @covers Candidate::_generatePSCID
     * @return void
     */
    public function testGeneratePSCIDForSequentialNumericGeneration()
    {

        $seq = array(
            'seq' => array(
                0 => array(
                    '#' => '',
                    '@' => array('type' => 'siteAbbrev'),
                ),
                1 => array(
                    '#' => '',
                    '@' => array(
                        'type'      => 'numeric',
                        'minLength' => '4',
                    ),
                ),
            ),
        );
        $this->_configMap = array(
            array(
                'PSCID',
                array(
                    'generation' => 'sequential',
                    'structure'  => $seq,
                ),
            ),
        );

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));

        //mock pselectOne
        // First 2 calls to select one return count = 1
        //case when first 2 generated PSCIDs already exist in DB
        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->will($this->onConsecutiveCalls(1, 1, 0));

        $this->assertEquals('AB0002', (new PSCIDGenerator('AB'))->generate());
    }
}
