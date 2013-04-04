<?php
/**
 * File containing abstract class which contain
 * helper functions that Loris tests can use.
 *
 * These tests assume that the config is already set
 * up and working for the installed project.
 *
 * PHP Version 5
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     http://www.loris.ca
 *
 */
require_once 'Database.class.inc';
require_once "User.class.inc";
require_once 'NDB_Config.class.inc';

/**
 * Abstract base class for Loris tests which want
 * to test accessing through Apache.
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     http://www.loris.ca
 */
abstract class LorisTest extends WebTestCase
{

    /**
     * Get some basic config settings to be used throughout
     * Loris tests.
     *
     * In particular, this ensures that 
     *    1. $this->CandID is the candid in the config file
     *       to use for testing
     *    2. $this->RunDangerousTests is true if testModify
     *       is true in the config settings
     *    3. 
     *
     * @return null
     */
    function setUp()
    {
        $this->config =& NDB_Config::singleton();
        
        $database = $this->config->getSetting('database');
        $this->url = $this->config->getSetting("url");
        
        $track = $this->config->getSetting('logHistory');
        $this->CandID = $this->config->getSetting("testCandidate");

        $ignores = $this->config->getSetting("ignoreInstruments");
        if (is_array($ignores)) {
            $this->ignoreInstruments = $ignores;
        } else {
            $this->ignoreInstruments = array($ignores);
        }

        // Make sure the setting is exactly the string "false", not something
        // else that evaluates to false like 0, just for safety.
        if ($track === "false") {
            $track = 0;
        } else {
            $track = 1;
        }

        // Inversely, if there's no <test> section, we assume that they 
        // /don't/ want us to test anything that will modify the database.. 
        // such as on, say, production. So this one defaults to false
        $testModify = $this->config->getSetting("testModify");
        if ($testModify == "true") {
            $this->RunDangerousTests = true;
        } else {
            $this->RunDangerousTests = false;
        }

        
        $this->DB =& Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            $track
        );

        if (Utility::isErrorX($this->DB)) {
            print $this->DB->getMessage() . "\n";
        }

        $this->DB->delete("users", array("UserID" => 'UnitTester'));
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));

        $this->DB->insert(
            "users", 
            array(
                'ID' => 999990,
                'UserID' => 'UnitTester',
                'Real_name' => 'Unit Tester',
                'First_name' => 'Unit',
                'Last_name' => 'Tester',
                'Email' => 'tester@example.com',
                'CenterID' => 1,
                'Privilege' => 0,
                'PSCPI' => 'N',
                'Active' => 'Y',
                'Examiner' => 'N',
                'Password_md5' => 'a601e42ba82bb37a68ca3c8b7752f2e222',
                'Password_expiry' => '2099-12-31',
                'Pending_approval' => false
            )
        );
        $this->DB->run(
            "INSERT INTO user_perm_rel SELECT 999990, PermID FROM permissions"
        );

    }

    /**
     * Tear down the test. This will delete the user created
     * by setUp. It will not undo any data changed as side
     * effects of tests.
     *
     * @return null
     */
    function tearDown()
    {
        $this->DB->delete("users", array("UserID" => 'UnitTester'));
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));
    }

    /**
     * Helper function to login to the database.
     * This us usually called with "UnitTester"
     *
     * @param string $username The username to log in as. 
     *                         Usually "UnitTester" created in setUp.
     * @param string $password The password to log in as. Usually
     *                         "4test4" for UnitTester user.
     *
     * @return null
     */
    function login($username, $password)
    {
        $this->post(
            $this->url . '/main.php', 
            array(
                'username' => $username, 
                'password' => $password,
                'login' => 'login'
            )
        );
    }

    /**
     * Helper function to assert some basic conditions that should
     * be true of all normal pages, such as the HTTP error code,
     * that no print statements print before the opening of the HTML,
     * and that no errors occured on the page
     *
     * @return null
     */
    function assertBasicConditions()
    {
        $this->assertResponse(200);
        $this->assertPattern('/^<!DOCTYPE/', "Leftover debugging messages");
        $this->assertNoPattern("/The following errors occured/");
    }
}
?>
