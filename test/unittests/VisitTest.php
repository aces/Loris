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
use \LORIS\VisitController;
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
     * @var Visit
     */
    private $_visit;

    protected function setUp()
    {
/*        parent::setUp();
        $this->factory = NDB_Factory::singleton();
        $this->factory->setTesting(true);
        $mockdb = $this->getMockBuilder("\Database")->getMock();
        $mockconfig = $this->getMockBuilder("\NDB_Config")->getMock();
        $this->factory->setConfig($mockconfig);
        $db = $this->factory->setDatabase($mockdb);  
        
        $this->_visitController = new \Loris\VisitController($db);
*/
        //parent::setUp();
        //$db = parent::getConnection();
        //$db = NDB_Factory->database();
       
/*        $this->factory = NDB_Factory::singleton();

        $dbname = $this->factory->settings()->dbName();
        $host   = $this->factory->settings()->dbHost();
        $user   = $this->factory->settings()->dbUserName();
        $pwd    = $this->factory->settings()->dbPassword();

        $db =& (\NDB_Factory::singleton($dbname, $user, $pwd, $host))->database(); 
*/

        $this->factory = NDB_Factory::singleton();
        $db = $this->database = Database::singleton(
            $this->factory->settings()->dbName(),
            $this->factory->settings()->dbUserName(),
            $this->factory->settings()->dbPassword(),
            $this->factory->settings()->dbHost()
        );
        $this->_visitController = new \Loris\VisitController($db);

        $v1 = new \Loris\Visit('V1');
        $v2 = new \Loris\Visit('V2');
        $v3 = new \Loris\Visit('V3');

        $this->_listOfVisit = array($v1, $v2, $v3);

        $this->_listOfVisitProject = array(
                                      array($v1, 1, 11),
                                      array($v1, 2, 13),
                                      array($v1, 3, 11),
                                      array($v2, 1, 12),
                                      array($v2, 3, 11),
                                      array($v3, 3, 11)
                                     );
    }

    function testVisit()
    {
       $visit_name = "Visit 1";
       $visit = new Visit($visit_name);
       $this->assertEquals($visit_name, $visit->getName(), "the name of the visit does not match");
    }

    function testAllVisit()
    {
        $visits = $this->_visitController->getAllVisits();
        $this->assertEquals($this->_listOfVisit, $visits, "the name of the visit does not match value in DB");
    }  

    function testVisitsProjects()
    {
        $visits = $this->_visitController->getVisitsProject();
        $this->assertEquals($this->_listOfVisitProject, $visits, "the project and subproject relation does not match value in DB");
    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown()
    {
        parent::tearDown();
        $this->factory->reset();
    }

}
