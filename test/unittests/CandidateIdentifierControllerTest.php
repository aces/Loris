<?php declare(strict_types=1);

/**
 * Unit tests for CandidateIdentifierController class
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
require_once __DIR__ . '/../../php/libraries/IdentifierTypeController.class.inc';
require_once __DIR__ 
. '/../../php/libraries/CandidateIdentifierController.class.inc';

use PHPUnit\Framework\TestCase;

/**
 * Unit tests for CandidateIdentifierController class
 *
 * @category Tests
 * @package  Test
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifierControllerTest extends TestCase
{
    protected $factory;
    protected $DB;
    protected $config;
    protected $candidateIdentifierController;

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
            'candidate_identifier_types',
            [
                [
                    'CandidateIdentifierTypeID' => 1,
                    'Name'                      => 'TestID',
                    'Format'                    => '{SEQUENCE:4,FORMAT:numeric}',
                    'IsRequired'                => 1,
                    'IsUnique'                  => 1,
                    'AutoGenerate'              => 1,
                    'AllowMultiple'             => 0,
                    'permID'                    => null,
                ],
            ]
        );

        $this->DB->setFakeTableData(
            'candidate_identifier_types_project_rel',
            []
        );

        $this->DB->setFakeTableData(
            'candidate_identifiers',
            [
                [
                    'CandidateIdentifierID'     => 1,
                    'CandidateID'               => 1,
                    'CandidateIdentifierTypeID' => 1,
                    'Value'                     => '1234',
                ],
            ]
        );

        $this->candidateIdentifierController
            = new \LORIS\CandidateIdentifierController(
                $this->DB
            );
    }

    /**
     * Tests that a candidate identifier can be retrieved by ID
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::getCandidateIdentifierFromID
     */
    public function testGetCandidateIdentifierFromID(): void
    {
        $candidateIdentifier = $this->candidateIdentifierController
            ->getCandidateIdentifierFromID(1);

        $this->assertSame(
            1,
            $candidateIdentifier->candidateIdentifierID
        );
        $this->assertSame(1, $candidateIdentifier->candidateID);
        $this->assertSame('1234', $candidateIdentifier->value);

        $this->assertSame(
            1,
            $candidateIdentifier->type->candidateIdentifierTypeID
        );
        $this->assertSame('TestID', $candidateIdentifier->type->name);
        $this->assertSame(
            '{SEQUENCE:4,FORMAT:numeric}',
            $candidateIdentifier->type->format
        );
        $this->assertTrue($candidateIdentifier->type->isRequired);
        $this->assertTrue($candidateIdentifier->type->isUnique);
        $this->assertTrue($candidateIdentifier->type->autoGenerate);
        $this->assertFalse($candidateIdentifier->type->allowMultiple);
        $this->assertSame([], $candidateIdentifier->type->projects);
        $this->assertNull($candidateIdentifier->type->permissionID);
    }

    /**
     * Tests that retrieving a nonexistent candidate identifier throws NotFound
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::getCandidateIdentifierFromID
     */
    public function testGetCandidateIdentifierFromIDNotFound(): void
    {
        $this->expectException(\NotFound::class);

        $this->candidateIdentifierController
            ->getCandidateIdentifierFromID(999);
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
        $this->DB->run(
            'DROP TEMPORARY TABLE IF EXISTS '
                . 'candidate_identifier_types_project_rel'
        );
        $this->DB->run(
            'DROP TEMPORARY TABLE IF EXISTS candidate_identifier_types'
        );

        $this->factory->reset();

        parent::tearDown();
    }
}