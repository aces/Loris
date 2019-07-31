<?php
/**
 * Unit test for Visit class
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Test
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/VisitController.class.inc';
require_once __DIR__ . '/../../php/libraries/Visit.class.inc';

use \LORIS\Visit;
//use \LORIS\VisitController;
use \PHPUnit\Framework\TestCase;

/**
 * Unit test for Candidate class
 *
 * @category Tests
 * @package  Test
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitTest extends TestCase
{
    /**
     * Visit object use in tests
     *
     */
    private $_visit;

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
        $this->factory->setTesting(false);
        $this->config = $this->factory->Config(CONFIG_XML);
        $database     = $this->config->getSetting('database');
        $this->DB     = Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            1
        );
        $this->_visitController = new \Loris\VisitController($this->DB);

        $v1 = new \Loris\Visit('V1', 1);
        $v2 = new \Loris\Visit('V2', 2);
        $v3 = new \Loris\Visit('V3', 3);
        $v4 = new \Loris\Visit('V4', 4);
        $v5 = new \Loris\Visit('V5', 5);
        $v6 = new \Loris\Visit('V6', 6);
        $v7 = new \Loris\Visit('Living_Phantom_DCC_SD_3t2', 7);
        $v8 = new \Loris\Visit('Living_Phantom_DCC_SD_3dwi', 8);
        $v9 = new \Loris\Visit('Living_Phantom_DCC_SD_3mprage', 9);

        $this->_listOfVisit = array(
                               $v1,
                               $v2,
                               $v3,
                               $v4,
                               $v5,
                               $v6,
                               $v7,
                               $v8,
                               $v9,
                              );

        $this->_listOfVisitProject = array(
            array($v1, 1, 1),
            array($v1, 1, 2),
            array($v1, 3, 1),
            array($v2, 1, 1),
            array($v2, 1, 2),
            array($v2, 3, 1),
            array($v3, 1, 1),
            array($v3, 1, 2),
            array($v3, 2, 3),
            array($v3, 2, 4),
            array($v3, 3, 1),
            array($v3, 3, 3),
            array($v4, 2, 3),
            array($v4, 2, 4),
            array($v4, 3, 3),
            array($v5, 2, 3),
            array($v5, 2, 4),
            array($v5, 3, 3),
            array($v6, 2, 3),
            array($v6, 2, 4),
            array($v6, 3, 3),
        );

    }

    /**
     * Test that Visit::getName returns the correct name of the visit 
     *
     * @return void
     * @covers Visit::getName
     */
    function testVisit()
    {
        $visit_name = "Visit 1";
        $visit      = new Visit($visit_name);
        $this->assertEquals(
            $visit_name, 
            $visit->getName(), 
            "the name of the visit does not match"
        );
    }

    /**
     * Test that VisitController::getAllVisits returns the correct array of
     * visits in the database
     *
     * @return void
     * @covers VisitController::getAllVisits
     */
    function testAllVisit()
    {
        $visits = $this->_visitController->getAllVisits();
        $this->assertEquals(
            $this->_listOfVisit, 
            $visits, 
            "the name of the visit does not match value in DB"
        );
    }

    /**
     * Test that VisitController::getVisitsProjectSubproject returns the proper
     * project-subproject relation for the visits in the database
     *
     * @return void
     * @covers VisitController::getVisitsProjectSubproject
     */
    function testVisitsProjects()
    {
        $visits = $this->_visitController->getVisitsProjectSubproject();
        $this->assertEquals(
            $this->_listOfVisitProject, 
            $visits, 
            "the project subproject relation does not match value in DB"
        );
    }

    /**
     * Test that VisitController::getVisitsByName returns an array with 
     * visit objects from the database with the given name
     *
     * @return void
     * @covers VisitController::getVisitsByName
     */
    function testGetVisitsByName()
    {
        $visit_result = new \Loris\Visit('V1', 1);
        $visits = $this->_visitController->getVisitsByName("V1");
        $this->assertEquals(
            array($visit_result),
            $visits
        );
    }


    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        parent::tearDown();
        $this->factory->reset();
    }

}
