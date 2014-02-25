<?php
/**
 * This file contains tests for the NDB_Factory class, which should
 * return singletons used in Loris in either a testing (Mock) variety,
 * or a normal production variety
 *
 * PHP Version 5
 *
 * @category Testing
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__ . '/../test_includes.php';
require_once 'simpletest/autorun.php';
require_once 'NDB_Factory.class.inc';


/**
 * Implementation of tests for NDB_Factory
 *
 * @category Testing
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class TestOfNDBFactory extends UnitTestCase
{
    /** 
     * Set up of testing suite
     * 
     * @return none
     */
    function setUp()
    {
        $this->Factory = new NDB_Factory();
    }

    /**
     * Ensure that one and only one object is created by singleton
     * function
     *
     * @return none
     */
    function testFactorySingleton()
    {
        $factory = NDB_Factory::singleton();
        $this->assertIsA($factory, 'NDB_Factory');
        $factory2 = NDB_Factory::singleton();
        $this->assertReference($factory, $factory2);
    }

    /**
     * Ensure that setTesting modifies the testing behaviour of the
     * factory
     *
     * @return none
     */
    function testSetTesting()
    {
        $this->assertFalse($this->Factory->Testing);
        $this->Factory->setTesting(true);
        $this->assertTrue($this->Factory->Testing);
        $this->Factory->setTesting(false);
        $this->assertFalse($this->Factory->Testing);
    }

    /**
     * Ensure that the $factory->user function returns one and only
     * one (mock) user object
     *
     * @return none
     */
    function testUser()
    {
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

    /**
     * Ensure that the couchDB function returns one and only one
     * (Mock) CouchDB Wrapper
     *
     * @return none
     */
    function testCouchDb()
    {
        $Factory = $this->Factory;
        $Factory->setTesting(true);
        $couch = $Factory->CouchDB();
        $this->assertIsA($couch, 'MockCouchDBWrap');
        $couch2 = $Factory->CouchDB();
        $this->assertReference($couch, $couch2);
    }

    /**
     * Ensure that the config function returns one and only one
     * (Mock) NDB_Config object
     *
     * @return none
     */
    function testConfig()
    {
        $Factory = $this->Factory;

        $Factory->setTesting(false);
        $config = $Factory->config();
        $this->assertIsA($config, 'NDB_Config');
        $this->assertNotA($config, 'MockNDB_Config');

        $Factory->reset();
        $Factory->setTesting(true);
        $config = $Factory->config();
        $this->assertIsA($config, 'MockNDB_Config');
        $config2 = $Factory->config();
        $config->expectOnce('load');

        $this->assertReference($config, $config2);
    }

    /**
     * Ensure that the database function returns one and only
     * one Mock database object
     *
     * @return none
     */
    function testDatabase()
    {
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

    /**
     * Ensure that the reset function throws away references
     * that were previously held to mock objects
     *
     * @return none
     */
    function testReset()
    {
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
