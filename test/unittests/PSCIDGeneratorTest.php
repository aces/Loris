<?php declare(strict_types=1);

/**
 * Unit test for PSCIDGenerator class
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Main
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

use PHPUnit\Framework\TestCase;

/**
 * Unit test for PSCIDGenerator class
 *
 * @category Tests
 * @package  Main
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class PSCIDGeneratorTest extends TestCase
{
    /**
     * NDB_Factory used in tests.
     * Test doubles are injected to the factory object.
     *
     * @var NDB_Factory
     */
    private $_factory;

    /**
     * Test double for NDB_Config object
     *
     * @var \NDB_Config | PHPUnit\Framework\MockObject\MockObject
     */
    private $_configMock;

    /**
     * Test double for Database object
     *
     * @phan-var \Database | PHPUnit\Framework\MockObject\MockObject
     */
    private $_dbMock;

    /**
     * Sets up fixtures
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $dbMock     = $this->getMockBuilder('\Database')->getMock();

        '@phan-var \NDB_Config $configMock';
        '@phan-var \Database $dbMock';

        $this->_configMock = $configMock;
        $this->_dbMock     = $dbMock;

        $this->_factory = NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
    }

    /**
     * Tears down the fixture
     *
     * @return void
     */
    protected function tearDown(): void
    {
        parent::tearDown();
        $this->_factory->reset();
    }

    /**
     * Test sequential generation using the default numeric format
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testSequentialDefaultNumeric()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  => 'TEST-{SEQUENCE:4}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', '');

        $this->assertEquals(
            'TEST-0000',
            $generator->generate()
        );
    }

    /**
     * Test sequential generation across a numeric boundary.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testSequentialNumericBoundary()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  => 'TEST-{SEQUENCE:4}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn(['0099']);

        $generator = new PSCIDGenerator('', '');

        $this->assertEquals(
            'TEST-0100',
            $generator->generate()
        );
    }

    /**
     * Test sequential alpha generation using the default minimum value.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testSequentialDefaultAlpha()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', '');

        $this->assertEquals(
            'ALPHA-AAAA',
            $generator->generate()
        );
    }

    /**
     * Test sequential alpha generation across a character boundary.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testSequentialAlphaBoundary()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  => 'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn(['AAAZ']);

        $generator = new PSCIDGenerator('', '');

        $this->assertEquals(
            'ALPHA-AABA',
            $generator->generate()
        );
    }

    /**
     * Test sequential alpha generation near the default maximum value.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testAlphaDefaultMax()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn(['ZZZX']);

        $generator = new PSCIDGenerator('', '');

        $this->assertEquals(
            'ALPHA-ZZZY',
            $generator->generate()
        );
    }

    /**
     * Test that sequential alpha generation fails at the default maximum.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testAlphaDefaultMaxExceeded()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn(['ZZZY']);

        $generator = new PSCIDGenerator('', '');

        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            'Cannot create new identifier because all valid identifiers are in use!'
        );

        $generator->generate();
    }

    /**
     * Test random numeric generation.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testRandomNumeric()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'random',
                            'structure'  => 'RAND-{RANDOM:4,FORMAT:numeric}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', '');

        $this->assertMatchesRegularExpression(
            '/^RAND-[0-9]{4}$/',
            $generator->generate()
        );
    }

    /**
     * Test random alpha generation.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testRandomAlpha()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'random',
                            'structure'  => 'RANDALPHA-{RANDOM:4,FORMAT:alpha}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', '');

        $this->assertMatchesRegularExpression(
            '/^RANDALPHA-[A-Z]{4}$/',
            $generator->generate()
        );
    }

    /**
     * Test random alphanumeric generation.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testRandomAlphanumeric()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'random',
                            'structure'  =>
                        'RANDALPHANUM-{RANDOM:4,FORMAT:alphanumeric}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', '');

        $this->assertMatchesRegularExpression(
            '/^RANDALPHANUM-[0-9A-Z]{4}$/',
            $generator->generate()
        );
    }

    /**
     * Test sequential numeric generation with custom padding.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testNumericPadding()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'PAD-{SEQUENCE:4,FORMAT:numeric,PADDING:2,MIN:1}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', '');

        $this->assertEquals(
            'PAD-2221',
            $generator->generate()
        );
    }

    /**
     * Test that invalid numeric padding throws an exception.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testInvalidNumericPadding()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'PAD-{SEQUENCE:4,FORMAT:numeric,PADDING:X,MIN:1}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $this->expectException(\ConfigurationException::class);
        $this->expectExceptionMessage(
            'Padding character must be part of the configured alphabet.'
        );

        new PSCIDGenerator('', '');
    }

    /**
     * Test sequential alpha generation with custom padding.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testAlphaPadding()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'PADALPHA-{SEQUENCE:4,FORMAT:alpha,PADDING:X,MIN:A}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', '');

        $this->assertEquals(
            'PADALPHA-XXXA',
            $generator->generate()
        );
    }

    /**
     * Test sequential generation with minimum and maximum values.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testMinMax()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'MAXTEST-{SEQUENCE:4,FORMAT:numeric,MIN:1,MAX:3}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn(['0001', '0002']);

        $generator = new PSCIDGenerator('', '');

        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            'Cannot create new identifier because all valid identifiers are in use!'
        );

        $generator->generate();
    }

    /**
     * Test sequential generation with a site alias.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testSiteAlias()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            '{SITE:ALIAS}{SEQUENCE:4,FORMAT:numeric}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('DCC', '');

        $this->assertEquals(
            'DCC0000',
            $generator->generate()
        );
    }

    /**
     * Test sequential generation with a project alias.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testProjectAlias()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            '{PROJECT:ALIAS}{SEQUENCE:4,FORMAT:numeric}',
                        ],
                    ],
                ]
            );

        $this->_dbMock->method('pselectCol')
            ->willReturn([]);

        $generator = new PSCIDGenerator('', 'PUMP');

        $this->assertEquals(
            'PUMP0000',
            $generator->generate()
        );
    }

    // TODO: Remove generation mismatch tests as part of the
    // Candidate Identifiers rework.

    /**
     * Test that sequential generation with a random template throws an exception.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testSequentialRandomMismatch()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'sequential',
                            'structure'  =>
                            'MISMATCH-{RANDOM:4,FORMAT:numeric}',
                        ],
                    ],
                ]
            );

        $this->expectException(\ConfigurationException::class);
        $this->expectExceptionMessage(
            'Generation methods do not match.'
        );

        new PSCIDGenerator('', '');
    }

    /**
     * Test that random generation with a sequential template throws an exception.
     *
     * @covers PSCIDGenerator
     * @return void
     */
    public function testRandomSequentialMismatch()
    {
        $this->_configMock->method('getSetting')
            ->willReturnMap(
                [
                    [
                        'PSCID',
                        [
                            'generation' => 'random',
                            'structure'  =>
                            'MISMATCH-{SEQUENCE:4,FORMAT:numeric}',
                        ],
                    ],
                ]
            );

        $this->expectException(\ConfigurationException::class);
        $this->expectExceptionMessage(
            'Generation methods do not match.'
        );

        new PSCIDGenerator('', '');
    }
}
