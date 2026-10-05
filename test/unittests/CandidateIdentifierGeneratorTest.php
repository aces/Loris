<?php

declare(strict_types=1);

/**
 * Unit tests for CandidateIdentifierGenerator class
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Test
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/IdentifierType.class.inc';
require_once __DIR__ . '/../../php/libraries/IdentifierGenerator.php';
require_once __DIR__
    . '/../../php/libraries/CandidateIdentifierGenerator.php';

use PHPUnit\Framework\TestCase;

/**
 * Unit tests for CandidateIdentifierGenerator class
 *
 * @category Tests
 * @package  Test
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifierGeneratorTest extends TestCase
{
    protected $factory;
    protected $DB;
    protected $config;

    /**
     * This method is called before each test is executed.
     * Sets up fixtures: factory, config, database
     *
     * @return void
     */
    protected function setUp(): void
    {
        $this->factory = NDB_Factory::singleton();
        $this->factory->reset();
        $this->config = $this->factory->Config(CONFIG_XML);
        $database     = $this->config->getSetting('database');

        putenv("LORIS_{$database['database']}_USERNAME={$database['username']}");
        putenv("LORIS_{$database['database']}_PASSWORD={$database['password']}");
        putenv("LORIS_{$database['database']}_HOST={$database['host']}");

        $this->DB = $this->factory->database();

        $this->DB->setFakeTableData(
            'candidate_identifiers',
            []
        );
    }

    /**
     * Tests generating the first sequential numeric identifier
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateFirstSequentialNumericIdentifier(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertSame('0000', $generator->generate());
    }

    public function testGenerateNextSequentialNumericIdentifier(): void
    {
        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 1,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => '0099',
            ]
        );

        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertSame('0100', $generator->generate());
    }

    /**
     * Tests sequential alpha generation using the default minimum value
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateFirstSequentialAlphaIdentifier(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertSame(
            'ALPHA-AAAA',
            $generator->generate()
        );
    }

    /**
     * Tests sequential alpha generation across a character boundary
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateSequentialAlphaBoundary(): void
    {
        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 1,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => 'ALPHA-AAAZ',
            ]
        );

        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertSame(
            'ALPHA-AABA',
            $generator->generate()
        );
    }

    /**
     * Tests sequential alpha generation near the default maximum value
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateAlphaDefaultMax(): void
    {
        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 1,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => 'ALPHA-ZZZX',
            ]
        );

        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertSame(
            'ALPHA-ZZZY',
            $generator->generate()
        );
    }

    /**
     * Tests that sequential alpha generation fails at the default maximum
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateAlphaDefaultMaxExceeded(): void
    {
        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 1,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => 'ALPHA-ZZZY',
            ]
        );

        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'ALPHA-{SEQUENCE:4,FORMAT:alpha}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            'Cannot create new identifier because all valid identifiers are in use!'
        );

        $generator->generate();
    }

    /**
     * Tests random numeric generation
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateRandomNumericIdentifier(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'RAND-{RANDOM:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertMatchesRegularExpression(
            '/^RAND-[0-9]{4}$/',
            $generator->generate()
        );
    }

    /**
     * Tests random alpha generation
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateRandomAlphaIdentifier(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'RANDALPHA-{RANDOM:4,FORMAT:alpha}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertMatchesRegularExpression(
            '/^RANDALPHA-[A-Z]{4}$/',
            $generator->generate()
        );
    }

    /**
     * Tests random alphanumeric generation
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateRandomAlphanumericIdentifier(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'RANDALPHANUM-{RANDOM:4,FORMAT:alphanumeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertMatchesRegularExpression(
            '/^RANDALPHANUM-[0-9A-Z]{4}$/',
            $generator->generate()
        );
    }

    /**
     * Tests sequential numeric generation with custom padding
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateNumericPadding(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'PAD-{SEQUENCE:4,FORMAT:numeric,PADDING:2,MIN:1}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertSame(
            'PAD-2221',
            $generator->generate()
        );
    }

    /**
     * Tests that invalid numeric padding throws an exception
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateInvalidNumericPadding(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'PAD-{SEQUENCE:4,FORMAT:numeric,PADDING:X,MIN:1}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $this->expectException(\ConfigurationException::class);
        $this->expectExceptionMessage(
            'Padding character must be part of the configured alphabet.'
        );

        new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );
    }

    /**
     * Tests sequential alpha generation with custom padding
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateAlphaPadding(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'PADALPHA-{SEQUENCE:4,FORMAT:alpha,PADDING:X,MIN:A}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->assertSame(
            'PADALPHA-XXXA',
            $generator->generate()
        );
    }

    /**
     * Tests sequential generation with minimum and maximum values
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateMinMax(): void
    {
        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 1,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => 'MAXTEST-0001',
            ]
        );

        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 2,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => 'MAXTEST-0002',
            ]
        );

        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: 'MAXTEST-{SEQUENCE:4,FORMAT:numeric,MIN:1,MAX:3}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->expectException(\LorisException::class);
        $this->expectExceptionMessage(
            'Cannot create new identifier because all valid identifiers are in use!'
        );

        $generator->generate();
    }

    /**
     * Tests sequential generation with a site alias
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateSiteAlias(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: '{SITE:ALIAS}{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'DCC',
            ''
        );

        $this->assertSame(
            'DCC0000',
            $generator->generate()
        );
    }

    /**
     * Tests sequential generation with a project alias
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateProjectAlias(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: '{PROJECT:ALIAS}{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            '',
            'PUMP'
        );

        $this->assertSame(
            'PUMP0000',
            $generator->generate()
        );
    }

    /**
     * Tests that an identifier type must be persisted before generating.
     *
     * @return void
     * @covers CandidateIdentifierGenerator::generate
     */
    public function testGenerateWithUnpersistedIdentifierType(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: null,
            name: 'TestID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
        );

        $generator = new CandidateIdentifierGenerator(
            $this->DB,
            $identifierType,
            'MTL',
            'P1'
        );

        $this->expectException(\LogicException::class);
        $this->expectExceptionMessage(
            'Identifier type must be persisted before generating identifiers'
        );

        $generator->generate();
    }

    /**
     * Tears down the fixture and cleans up temporary tables.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        $this->DB->run(
            'DROP TEMPORARY TABLE IF EXISTS candidate_identifiers'
        );

        $this->factory->reset();

        parent::tearDown();
    }
}
