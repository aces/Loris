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
                        'length' => '4',
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

        $this->assertRegExp('/AAA[0-9]{4}$/', (new PSCIDGenerator('AAA'))->generate());
    }

    /**
     * Test function PSCIDGenerator::generate for config settings:
     * generation=sequential & type=numeric
     *
     * @covers IdentifierGenerator::generate()
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
                        'length' => '4',
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


        $generator = new PSCIDGenerator('AB');
        $this->assertEquals('AB0000', (new PSCIDGenerator('AB'))->generate());
    }

    /**
     * Test function PSCIDGenerator::generate for config settings:
     * generation=sequential & type=numeric with a fixed prefix.
     *
     * @covers IdentifierGenerator::generate()
     * @return void
     */
    public function testGeneratePSCIDForStaticPrefix()
    {

        $seq = array(
            'seq' => array(
                0 => array(
                    '#' => 'XXL',
                    '@' => array('type' => 'static'),
                ),
                1 => array(
                    '#' => '',
                    '@' => array(
                        'type'      => 'numeric',
                        'length' => '3',
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

        $this->assertEquals('XXL000', (new PSCIDGenerator())->generate());
    }
    /**
     * Test function PSCIDGenerator::generate for config settings:
     * generation=sequential & type=numeric with a fixed prefix.
     *
     * @covers IdentifierGenerator::generate()
     * @return void
     */
    public function testConflictingConfigSettingsCauseException()
    {

        $seq = array(
            'seq' => array(
                0 => array(
                    '#' => 'XXL',
                    '@' => array('type' => 'static'),
                ),
                1 => array(
                    '#' => '',
                    '@' => array(
                        'type'      => 'numeric',
                        'length' => '3',
                    ),
                ),
                // The array below conflicts with the one above.
                2 => array(
                    '#' => '',
                    '@' => array(
                        'type'      => 'alphanumeric',
                        'length' => '4',
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

        $this->expectException(\LorisException::class);
        (new PSCIDGenerator())->generate();
    }
}
