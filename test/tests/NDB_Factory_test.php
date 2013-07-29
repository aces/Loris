<?php

require_once __DIR__ . '/../test_includes.php';
require_once 'simpletest/autorun.php';
require_once 'NDB_Factory.class.inc';


class TestOfNDBFactory extends UnitTestCase {
    function setUp() {
        $this->Factory = new NDB_Factory();
    }

    function testFactorySingleton() {
        $factory = NDB_Factory::singleton();
        $this->assertIsA($factory, 'NDB_Factory');
        $factory2 = NDB_Factory::singleton();
        $this->assertReference($factory, $factory2);
    }

    function testSetTesting() {
        $this->assertFalse($this->Factory->Testing);
        $this->Factory->setTesting(true);
        $this->assertTrue($this->Factory->Testing);
        $this->Factory->setTesting(false);
        $this->assertFalse($this->Factory->Testing);
    }

    function testUser() {
        Mock::generatePartial('User', 'MockUserStub', array('getUsername'));

        $Factory = $this->Factory;
        $Factory->setTesting(true);
        $user = $Factory->User(); 
        $this->assertIsA($user, 'MockUser');
        $user2 = $Factory->User(); 
        $this->assertReference($user, $user2);

        $user3 = new MockUserStub();
        $Factory->setUser($user3);

        $user_factory = $Factory->User();
        $this->assertReference($user_factory, $user3);
    }

    function testCouchDb() {
        $Factory = $this->Factory;
        $Factory->setTesting(true);
        $couch = $Factory->CouchDB();
        $this->assertIsA($couch, 'MockCouchDBWrap');
        $couch2 = $Factory->CouchDB();
        $this->assertReference($couch, $couch2);
    }
    function testConfig() {
        $Factory = $this->Factory;

        $Factory->setTesting(false);
        $config = $Factory->Config();
        $this->assertIsA($config, 'NDB_Config');
        $this->assertNotA($config, 'MockNDB_Config');

        $Factory->reset();
        $Factory->setTesting(true);
        $config = $Factory->Config();
        $this->assertIsA($config, 'MockNDB_Config');
        $config2 = $Factory->Config();
        $config->expectOnce('load');

        $this->assertReference($config, $config2);
    }
    function testDatabase() {
        $Factory = $this->Factory;

        $Factory->setTesting(false);
        /*
        $db = '';
        try {
            $db = $Factory->Database();
        } catch(PDOException $e) { 
        }

        $this->assertIsA($db, 'Database');
        $this->assertNotA($db, 'MockDatabase');
        $db2 = $Factory->Database();
        $this->assertReference($db, $db2);
         */

        $Factory->setTesting(true);
        $db = $Factory->Database();
        $this->assertIsA($db, 'MockDatabase');
        $db2 = $Factory->Database();
        $this->assertReference($db, $db2);
        $db->expectOnce('connect');
    }

    function testReset() {
        $Factory = $this->Factory;
        $Factory->setTesting(true);

        $db = $Factory->Database();
        $db2 = $Factory->Database();

        $this->assertReference($db, $db2);
        $this->assertEqual($db, $db2);
        $Factory->reset();
        $db2 = $Factory->Database();
        $this->assertNotEqual($db, $db2);
    }
}
