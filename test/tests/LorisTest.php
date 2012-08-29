<?php
require_once 'Database.class.inc';
require_once "User.class.inc";
require_once 'NDB_Config.class.inc';

abstract class LorisTest extends WebTestCase {

    function setUp() {
        /*global $config;
        global $DB;
         */

        $this->config =& NDB_Config::singleton();
        
        $database = $this->config->getSetting('database');
        $this->url = $this->config->getSetting("url");
        
        $track = $this->config->getSetting('logHistory');
        $this->CandID = $this->config->getSetting("testCandidate");

        $ignores = $this->config->getSetting("ignoreInstruments");
        if(is_array($ignores)) {
            $this->ignoreInstruments = $ignores;
        } else {
            $this->ignoreInstruments = array($ignores);
        }

        // Make sure the setting is exactly the string "false", not something
        // else that evaluates to false like 0, just for safety.
        if($track == "false") 
            $track = 0;
        else
            $track = 1;

        // Inversely, if there's no <test> section, we assume that they /don't/ want us to
        // test anything that will modify the database.. such as on, say, production. So
        // this one defaults to false
        $testModify = $this->config->getSetting("testModify");
        if($testModify == "true") {
            $this->RunDangerousTests = true;
        } else {
            $this->RunDangerousTests = false;
        }

        
        $this->DB =& Database::singleton($database['database'], $database['username'], $database['password'], $database['host'], $track);
        if(PEAR::isError($this->DB)) {
            print $this->DB->getMessage() . "\n";
        }

        $this->DB->delete("users", array("UserID" => 'UnitTester'));
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));

        $this->DB->insert("users", array(
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
            'Pending_approval' => False
        ));
        $this->DB->run("INSERT INTO user_perm_rel SELECT 999990, PermID FROM permissions");

    }

    function tearDown() {
        $this->DB->delete("users", array("UserID" => 'UnitTester'));
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));
    }

    function login($username, $password) {
        $this->post($this->url . '/main.php', array(
            'username' => $username, 
            'password' => $password,
            'login' => 'login'
        ));
    }

    function assertBasicConditions() {
        $this->assertResponse(200);
        $this->assertPattern('/^<!DOCTYPE/', "Leftover debugging messages");
        $this->assertNoPattern("/The following errors occured/");
    }
}
?>
