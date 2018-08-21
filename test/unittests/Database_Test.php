<?php
/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../vendor/autoload.php';

class FakePDO extends PDO
{
    public function __construct () {}
}

class FakeDatabase extends Database {
    protected function trackChanges($table, $set, $where, $type='U') {
    }
}

/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use PHPUnit\Framework\TestCase;
class Database_Test extends TestCase
{
    function _getAllMethodsExcept($methods) {
        $AllMethods = get_class_methods('Database');

        return array_diff($AllMethods, $methods);
    }

    function testSetFakeData() {
        $client = new NDB_Client();
        $client->makeCommandLine();
        $client->initialize();


        $DB = Database::singleton();

        $DB->setFakeTableData(
            "Config",
            array(
                0 => array(
                    'ID' => 99999,
                'ConfigID' => '123456',
                'Value'  => 'FKE1234',
            )
            )
        );

        $allCandidates = $DB->pselect("SELECT * FROM Config", array());

        $this->assertEquals(
            $allCandidates,
            array(
                0 => array(
                    'ID' => 99999,
                    'ConfigID' => 123456,
                    'Value' => 'FKE1234',
                )

            )
        );

    }


    function testUpdateEscapesHTML() {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')->setMethods($this->_getAllMethodsExcept(array('update')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array(
                'set_field' => '&lt;b&gt;Hello&lt;/b&gt;'
            )
            )
        );

        $stub->_PDO->expects($this->once())->method("prepare")->will($this->returnValue($stmt));
        $stub->update("test", array('field' => '<b>Hello</b>'), array());

    }

    function testUnsafeUpdateDoesntEscapeHTML() {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')->setMethods($this->_getAllMethodsExcept(array('unsafeupdate')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array(
                'set_field' => '<b>Hello</b>'
            )
            )
        );

        $stub->_PDO->expects($this->once())->method("prepare")->will($this->returnValue($stmt));
        $stub->unsafeupdate("test", array('field' => '<b>Hello</b>'), array());

    }
    function testInsertEscapesHTML() {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')->setMethods($this->_getAllMethodsExcept(array('insert')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array(
                'field' => '&lt;b&gt;Hello&lt;/b&gt;'
            )
            )
        );

        $stub->_PDO->expects($this->once())->method("prepare")->will($this->returnValue($stmt));
        $stub->insert("test", array('field' => '<b>Hello</b>'), array());

    }

    function testUnsafeInsertDoesntEscapeHTML() {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')->setMethods($this->_getAllMethodsExcept(array('unsafeinsert')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array(
                'field' => '<b>Hello</b>'
            )
            )
        );

        $stub->_PDO->expects($this->once())->method("prepare")->will($this->returnValue($stmt));
        $stub->unsafeinsert("test", array('field' => '<b>Hello</b>'), array());

    }
}


?>
