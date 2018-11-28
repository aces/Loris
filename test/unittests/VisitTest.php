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
     * @var Visit
     */
    private $_visit;

    protected function setUp()
    {
        $this->factory = NDB_Factory::singleton();
        $this->factory->reset();
        $this->factory->setTesting(false);
        $this->config = $this->factory->Config(CONFIG_XML);
        $database = $this->config->getSetting('database');
        $this->DB  = Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            1
        ); 
        $this->_visitController = new \Loris\VisitController($this->DB);



        $v1 = new \Loris\Visit('V1',1);
        $v2 = new \Loris\Visit('V2',2);
        $v3 = new \Loris\Visit('V3',3);

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
