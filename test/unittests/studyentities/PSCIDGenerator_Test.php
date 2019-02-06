<?php declare(strict_types=1);
/**
 * This file contains unit tests for the PSCIDGenerator class.
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntitites\Candidate\Test;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \PHPUnit\Framework\TestCase;
use \LORIS\StudyEntities\Candidate\PSCIDGenerator;

/**
 * This file contains unit tests for the PSCIDGenerator class.
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class PSCIDGenerator_Test extends TestCase {

    private $_dbMock;
    private $_configMock;
    private $_configMap = array();

    /**
     * Sets up fixtures:
     *  - _candidate object
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

        $this->assertRegExp('/AAA[0-9]{4}$/', (new PSCIDGenerator('AAA'))->generate());
    }

    /**
     * Test function PSCIDGenerator::_generateID for config setting
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
    #    $this->_dbMock->expects($this->any())
    #        ->method('pselectOne')
    #        ->will($this->onConsecutiveCalls(1, 1, 0));

        $this->assertEquals('AB0001', (new PSCIDGenerator('AB'))->generate());
    }
}
