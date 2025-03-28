<?php declare(strict_types=1);

require_once __DIR__ . "/LorisIntegrationTest.class.inc";
/**
 * This contains an abstract class for Loris tests to extend.
 * It sets up the database handler, creates a user, creates a
 * webDriver instance, and logs in so that tests can focus on
 * the module being tested and not the overhead of logging in
 * to Loris.
 *
 * @category Test
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class LorisIntegrationTestWithCandidate extends LorisIntegrationTest
{

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in, and creating a candidate
     * with a session
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->DB->insert(
            "candidate",
            [
                'ID'                    => 1,
                'CandID'                => '900000',
                'PSCID'                 => 'TST0001',
                'RegistrationCenterID'  => 1,
                'RegistrationProjectID' => 1,
                'Active'                => 'Y',
                'UserID'                => 1,
                'Entity_type'           => 'Human',
                'Sex'                   => 'Female'
            ]
        );

        $this->DB->insert(
            'session',
            [
                'ID'            => '999999',
                'CandidateID'   => 1,
                'Visit_label'   => 'Test',
                'CenterID'      => 1,
                'ProjectID'     => 1,
                'Current_stage' => 'Not Started',
            ]
        );
        // Set up database wrapper and config
    }

    /**
     * {@inheritDoc}
     *
     * @return void
     */
    public function tearDown(): void
    {
        $this->DB->delete("session", ['CandidateID' => 1]);
        $this->DB->delete("candidate", ['CandID' => '900000']);
        parent::tearDown();
    }
}

