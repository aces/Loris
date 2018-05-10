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
require_once __DIR__ . '/../../php/libraries/VisitControler.class.inc';
require_once __DIR__ . '/../../php/libraries/Visit.class.inc';
use PHPUnit\Framework\TestCase;

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
        
        $this->_visitControler = new \Loris\VisitControler($db);
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
        $this->_visitControler = new \Loris\VisitControler($db);

        $this->_listOfVisit = array(
                               new \Loris\Visit('v1'),
                               new \Loris\Visit('v2'),
                               new \Loris\Visit('v3')
                              );
    }

    function testVisit()
    {
        $visits = $this->_visitControler->getAllVisits();
        for ($i = 0; $i < 3; $i++) {
//            $this->assertInstanceOF(Visit::class, $visits[$i], "is not an instance of Visit");
//            $this->assertEquals($this->_listOfVisit[$i], $visits[$i]->getName(), "the name of the visit does not match");
            $this->assertEquals($this->_listOfVisit[$i], $visits[$i], "the name of the visit does not match");
        }

    }  

    function testVisitsProjects()
    {
        $visits = $this->_visitControler->getVisitsProject();
        for ($i = 0; $i < 6; $i++) {
        }
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
