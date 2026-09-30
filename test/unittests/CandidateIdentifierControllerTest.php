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
    protected $identifierTypeController;
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

        $this->identifierTypeController
            = new \LORIS\IdentifierTypeController(
                $this->DB
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
     * Tests that a candidate identifier can be created
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::createCandidateIdentifier
     */
    public function testCreateCandidateIdentifier(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: null,
                candidateID: 2,
                type: $identifierType,
                value: '5678',
            );

        $created = $this->candidateIdentifierController
            ->createCandidateIdentifier($candidateIdentifier);

        $this->assertNotNull($created->candidateIdentifierID);
        $this->assertSame(2, $created->candidateID);
        $this->assertSame('5678', $created->value);
        $this->assertSame(
            1,
            $created->type->candidateIdentifierTypeID
        );
    }

    /**
     * Tests that multiple values cannot be created when they are not allowed
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::createCandidateIdentifier
     */
    public function testCreateCandidateIdentifierMultipleNotAllowed(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: null,
                candidateID: 1,
                type: $identifierType,
                value: '5678',
            );

        $this->expectException(\InvalidArgumentException::class);

        $this->candidateIdentifierController
            ->createCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that a unique value cannot be created for another candidate
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::createCandidateIdentifier
     */
    public function testCreateCandidateIdentifierDuplicateValue(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: null,
                candidateID: 2,
                type: $identifierType,
                value: '1234',
            );

        $this->expectException(\InvalidArgumentException::class);

        $this->candidateIdentifierController
            ->createCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that an invalid candidate identifier value cannot be created
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::createCandidateIdentifier
     */
    public function testCreateCandidateIdentifierInvalidFormat(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: null,
                candidateID: 2,
                type: $identifierType,
                value: '12AB',
            );

        $this->expectException(\InvalidArgumentException::class);

        $this->candidateIdentifierController
            ->createCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that a candidate identifier can be updated
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::updateCandidateIdentifier
     */
    public function testUpdateCandidateIdentifier(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: 1,
                candidateID: 1,
                type: $identifierType,
                value: '5678',
            );

        $updated = $this->candidateIdentifierController
            ->updateCandidateIdentifier($candidateIdentifier);

        $this->assertSame(1, $updated->candidateIdentifierID);
        $this->assertSame(1, $updated->candidateID);
        $this->assertSame('5678', $updated->value);
        $this->assertSame(
            1,
            $updated->type->candidateIdentifierTypeID
        );
    }

    /**
     * Tests that multiple values cannot be assigned when they are not allowed
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::updateCandidateIdentifier
     */
    public function testUpdateCandidateIdentifierMultipleNotAllowed(): void
    {
        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 2,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => '5678',
            ]
        );

        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: 1,
                candidateID: 2,
                type: $identifierType,
                value: '1234',
            );

        $this->expectException(\InvalidArgumentException::class);

        $this->candidateIdentifierController
            ->updateCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that a unique value cannot be assigned to another candidate
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::updateCandidateIdentifier
     */
    public function testUpdateCandidateIdentifierDuplicateValue(): void
    {
        $this->DB->insert(
            'candidate_identifiers',
            [
                'CandidateID'               => 2,
                'CandidateIdentifierTypeID' => 1,
                'Value'                     => '5678',
            ]
        );

        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: 1,
                candidateID: 1,
                type: $identifierType,
                value: '5678',
            );

        $this->expectException(\InvalidArgumentException::class);

        $this->candidateIdentifierController
            ->updateCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that a candidate identifier without an ID cannot be updated
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::updateCandidateIdentifier
     */
    public function testUpdateCandidateIdentifierWithoutID(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: null,
                candidateID: 1,
                type: $identifierType,
                value: '5678',
            );

        $this->expectException(\InvalidArgumentException::class);

        $this->candidateIdentifierController
            ->updateCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that updating a nonexistent candidate identifier throws NotFound
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::updateCandidateIdentifier
     */
    public function testUpdateCandidateIdentifierNotFound(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: 999,
                candidateID: 1,
                type: $identifierType,
                value: '5678',
            );

        $this->expectException(\NotFound::class);

        $this->candidateIdentifierController
            ->updateCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that an invalid candidate identifier value cannot be updated
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::updateCandidateIdentifier
     */
    public function testUpdateCandidateIdentifierInvalidFormat(): void
    {
        $identifierType = $this->identifierTypeController
            ->getIdentifierTypeFromID(1);

        $candidateIdentifier
            = new \LORIS\StudyEntities\Candidate\CandidateIdentifier(
                candidateIdentifierID: 1,
                candidateID: 1,
                type: $identifierType,
                value: '12AB',
            );

        $this->expectException(\InvalidArgumentException::class);

        $this->candidateIdentifierController
            ->updateCandidateIdentifier($candidateIdentifier);
    }

    /**
     * Tests that a candidate identifier can be deleted
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::deleteCandidateIdentifier
     */
    public function testDeleteCandidateIdentifier(): void
    {
        $this->candidateIdentifierController
            ->deleteCandidateIdentifier(1);

        $this->expectException(\NotFound::class);

        $this->candidateIdentifierController
            ->getCandidateIdentifierFromID(1);
    }

    /**
     * Tests that deleting a nonexistent candidate identifier throws NotFound
     *
     * @return void
     * @covers \LORIS\CandidateIdentifierController::deleteCandidateIdentifier
     */
    public function testDeleteCandidateIdentifierNotFound(): void
    {
        $this->expectException(\NotFound::class);

        $this->candidateIdentifierController
            ->deleteCandidateIdentifier(999);
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
