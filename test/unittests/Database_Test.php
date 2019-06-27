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
require_once __DIR__ . '/../../php/libraries/Database.class.inc';

class FakePDO extends PDO
{
    public function __construct () {}
}

class FakeDatabase extends Database {
    protected function trackChanges(
        string $table, 
        array $set, 
        string $where, 
        string $type='U'
    ):void {
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
        $client = new \NDB_Client();
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
        $this->_factory   = \NDB_Factory::singleton();
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
        $this->_factory   = \NDB_Factory::singleton();
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
        $this->_factory   = \NDB_Factory::singleton();
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
        $this->_factory   = \NDB_Factory::singleton();
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

    function testDeleteWithIsNull() {
        $this->_factory   = \NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => null,
                    'Visible' => '1'
                )
            )
        );

        $DB->delete("ConfigSettings", array('Visible' => 1, 'Description' => null));
        $allSetting = $DB->pselect("SELECT ID, Name, Description, Visible FROM ConfigSettings", array());
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID' => '99991',
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                )
            )
        );

    } 

    function testUpdateWithIsNull() {
        $this->_factory   = \NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => null,
                    'Visible' => '1'
                )
            )
        );
        $DB->update("ConfigSettings", array('Visible' => null, 'Description' => 'new description'), array('Description' => null));
        $allSetting = $DB->pselect("SELECT ID, Name, Description, Visible FROM ConfigSettings", array());
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => 'new description',
                    'Visible' => null
                )
            )
        );
    }

    function testInsertWithIsNull() {
        $this->_factory   = \NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                )
            )
        );
        $DB->insert("ConfigSettings", array('ID' => 99992, 'Name' => 'test 2', 'Visible' => 1, 'Description' => null));
        $allSetting = $DB->pselect("SELECT ID, Name, Description, Visible FROM ConfigSettings", array());
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => null,
                    'Visible' => '1'
                )
            )
        );
    }

    function testReplaceWithIsNull() {
        $this->_factory   = \NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                )
            )
        );
        $DB->replace("ConfigSettings", array('ID' => 99991, 'Name' => 'test 1', 'Visible' => 1, 'Description' => null));
        $DB->replace("ConfigSettings", array('ID' => 99992, 'Name' => 'test 2', 'Visible' => 1, 'Description' => null));
        $allSetting = $DB->pselect("SELECT ID, Name, Description, Visible FROM ConfigSettings", array());
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => null,
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => null,
                    'Visible' => '1'
                )
            )
        );
    }
}
