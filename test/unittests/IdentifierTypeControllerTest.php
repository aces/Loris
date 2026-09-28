<?php declare(strict_types=1);

/**
 * Unit tests for IdentifierTypeController class
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

use PHPUnit\Framework\TestCase;

/**
 * Unit tests for IdentifierTypeController class
 *
 * @category Tests
 * @package  Test
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class IdentifierTypeControllerTest extends TestCase
{
    protected $factory;
    protected $DB;
    protected $config;
    protected $identifierTypeController;

    /**
     * This method is called before each test is executed.
     * Sets up fixtures: factory, config, database
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

        $this->identifierTypeController = new \LORIS\IdentifierTypeController(
            $this->DB
        );
    }

    /**
     * Tests that an identifier can be retrieved by ID
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::getIdentifierTypeFromID
     */
    public function testGetIdentifierTypeFromID(): void
    {
        $identifierType = $this->identifierTypeController->getIdentifierTypeFromID(1);

        $this->assertSame(1, $identifierType->candidateIdentifierTypeID);
        $this->assertSame('TestID', $identifierType->name);
        $this->assertSame(
            '{SEQUENCE:4,FORMAT:numeric}',
            $identifierType->format
        );
        $this->assertTrue($identifierType->isRequired);
        $this->assertTrue($identifierType->isUnique);
        $this->assertTrue($identifierType->autoGenerate);
        $this->assertFalse($identifierType->allowMultiple);
        $this->assertSame([], $identifierType->projects);
        $this->assertNull($identifierType->permissionID);
    }

    /**
     * Tests that retrieving a nonexistent identifier throws NotFound
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::getIdentifierTypeFromID
     */
    public function testGetIdentifierTypeFromIDNotFound(): void
    {
        $this->expectException(\NotFound::class);

        $this->identifierTypeController->getIdentifierTypeFromID(999);
    }

    /**
     * Tests that an identifier type can be created
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::createIdentifierType
     */
    public function testCreateIdentifierType(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: null,
            name: 'CreatedID',
            format: '{SEQUENCE:6,FORMAT:numeric}',
            isRequired: false,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
            projects: [],
            permissionID: null,
        );

        $created = $this->identifierTypeController->createIdentifierType(
            $identifierType
        );

        $this->assertNotNull($created->candidateIdentifierTypeID);
        $this->assertSame('CreatedID', $created->name);
        $this->assertSame(
            '{SEQUENCE:6,FORMAT:numeric}',
            $created->format
        );
        $this->assertFalse($created->isRequired);
        $this->assertTrue($created->isUnique);
        $this->assertTrue($created->autoGenerate);
        $this->assertFalse($created->allowMultiple);
        $this->assertSame([], $created->projects);
        $this->assertNull($created->permissionID);
    }

    /**
     * Tests that an identifier type can be created with a project
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::createIdentifierType
     */
    public function testCreateIdentifierTypeWithProject(): void
    {
        $project = \Project::getProjectFromID(
            new \ProjectID('1')
        );

        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: null,
            name: 'ProjectID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
            projects: [$project],
            permissionID: null,
        );

        $created = $this->identifierTypeController->createIdentifierType(
            $identifierType
        );

        $this->assertCount(1, $created->projects);
        $this->assertSame(
            '1',
            strval($created->projects[0]->getId())
        );
    }

    /**
     * Tests that an identifier type can be created with a permission
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::createIdentifierType
     */
    public function testCreateIdentifierTypeWithPermission(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: null,
            name: 'PermissionID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
            projects: [],
            permissionID: 1,
        );

        $created = $this->identifierTypeController->createIdentifierType(
            $identifierType
        );

        $this->assertSame(1, $created->permissionID);
    }

    /**
     * Tests that an identifier type can be updated
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::updateIdentifierType
     */
    public function testUpdateIdentifierType(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'UpdatedID',
            format: '{SEQUENCE:8,FORMAT:numeric}',
            isRequired: false,
            isUnique: false,
            autoGenerate: false,
            allowMultiple: true,
            projects: [],
            permissionID: null,
        );

        $updated = $this->identifierTypeController->updateIdentifierType(
            $identifierType
        );

        $this->assertSame(1, $updated->candidateIdentifierTypeID);
        $this->assertSame('UpdatedID', $updated->name);
        $this->assertSame(
            '{SEQUENCE:8,FORMAT:numeric}',
            $updated->format
        );
        $this->assertFalse($updated->isRequired);
        $this->assertFalse($updated->isUnique);
        $this->assertFalse($updated->autoGenerate);
        $this->assertTrue($updated->allowMultiple);
        $this->assertSame([], $updated->projects);
        $this->assertNull($updated->permissionID);
    }

    /**
     * Tests that an identifier type's projects can be updated
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::updateIdentifierType
     */
    public function testUpdateIdentifierTypeWithProject(): void
    {
        $project = \Project::getProjectFromID(
            new \ProjectID('1')
        );

        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
            projects: [$project],
            permissionID: null,
        );

        $updated = $this->identifierTypeController->updateIdentifierType(
            $identifierType
        );

        $this->assertCount(1, $updated->projects);
        $this->assertSame(
            '1',
            strval($updated->projects[0]->getId())
        );
    }

    /**
     * Tests that an identifier type's permission can be updated
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::updateIdentifierType
     */
    public function testUpdateIdentifierTypeWithPermission(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: 1,
            name: 'TestID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
            projects: [],
            permissionID: 1,
        );

        $updated = $this->identifierTypeController->updateIdentifierType(
            $identifierType
        );

        $this->assertSame(1, $updated->permissionID);
    }

    /**
     * Tests that an identifier type without an ID cannot be updated
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::updateIdentifierType
     */
    public function testUpdateIdentifierTypeWithoutID(): void
    {
        $identifierType = new \LORIS\IdentifierType(
            candidateIdentifierTypeID: null,
            name: 'TestID',
            format: '{SEQUENCE:4,FORMAT:numeric}',
            isRequired: true,
            isUnique: true,
            autoGenerate: true,
            allowMultiple: false,
            projects: [],
            permissionID: null,
        );

        $this->expectException(\InvalidArgumentException::class);

        $this->identifierTypeController->updateIdentifierType(
            $identifierType
        );
    }

    /**
     * Tests that an identifier type can be deleted
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::deleteIdentifierType
     */
    public function testDeleteIdentifierType(): void
    {
        $this->identifierTypeController->deleteIdentifierType(1);

        $this->expectException(\NotFound::class);

        $this->identifierTypeController->getIdentifierTypeFromID(1);
    }

    /**
     * Tests that deleting a nonexistent identifier type throws NotFound
     *
     * @return void
     * @covers \LORIS\IdentifierTypeController::deleteIdentifierType
     */
    public function testDeleteIdentifierTypeNotFound(): void
    {
        $this->expectException(\NotFound::class);

        $this->identifierTypeController->deleteIdentifierType(2);
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