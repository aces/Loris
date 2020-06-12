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

/**
 * Phan has an issue with the FakeDatabase->trackChanges function. It appears
 * that this function exists only to prevent an unnecessary call during unit
 * tests so we don't need phan to bother us.
 *
 * @phan-file-suppress PhanUnusedProtectedMethodParameter
 */
class FakePDO extends PDO
{
    public function __construct()
    {
    }
}

class FakeDatabase extends Database
{
    protected function trackChanges(
        string $table, 
        array $set, 
        string $where, 
        string $type='U'
    ) : void {
    }
}

use PHPUnit\Framework\TestCase;
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
class Database_Test extends TestCase
{
    /**
     * Helper function to get all Database class methods except the one specified
     *
     * @param array $methods Array of method names to exclude
     *
     * @return array
     */
    function _getAllMethodsExcept($methods)
    {
        $AllMethods = get_class_methods('Database');

        return array_diff($AllMethods, $methods);
    }

    /**
     * Test that setFakeTableData creates a table with the specified data
     * in the mock DB
     *
     * @return void
     * @covers Database::setFakeTableData
     */
    function testSetFakeData()
    {
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

    /**
     * Test that update automatically escapes any HTML in the data for security
     *
     * @return void
     * @covers Database::update
     */
    function testUpdateEscapesHTML()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods($this->_getAllMethodsExcept(array('update')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array('set_field' => '&lt;b&gt;Hello&lt;/b&gt;'))
        );

        $stub->_PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));
        $stub->update("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Test that unsafeupdate does not escape HTML when called intead of update
     *
     * @return void
     * @covers Database::unsafeupdate
     */
    function testUnsafeUpdateDoesntEscapeHTML()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods($this->_getAllMethodsExcept(array('unsafeupdate')))
            ->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array('set_field' => '<b>Hello</b>'))
        );

        $stub->_PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));
        $stub->unsafeupdate("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Test that insert automatically escapes any HTML in the data for security
     *
     * @return void
     * @covers Database::insert
     */
    function testInsertEscapesHTML()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods($this->_getAllMethodsExcept(array('insert')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array('field' => '&lt;b&gt;Hello&lt;/b&gt;'))
        );

        $stub->_PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));
        $stub->insert("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Test that unsafeinsert does not escape HTML when called intead of insert
     *
     * @return void
     * @covers Database::unsafeinsert
     */
    function testUnsafeInsertDoesntEscapeHTML()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods($this->_getAllMethodsExcept(array('unsafeinsert')))
            ->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array('field' => '<b>Hello</b>'))
        );

        $stub->_PDO->expects($this->once())->method("prepare")
            ->will($this->returnValue($stmt));
        $stub->unsafeinsert("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Test that delete deletes a row from a specified table
     * when provided null values
     *
     * @return void
     * @covers Database::delete
     */
    function testDeleteWithIsNull()
    {
        $this->_factory   = NDB_Factory::singleton();
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
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
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

    /**
     * Test that delete deletes a specified row from a specified table
     *
     * @return void
     * @covers Database::delete
     */
    function testDelete()
    {
        $this->_factory   = NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID' => '99991',
                    'Name' => 'test 1',
                    'Description' => 'permanent',
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => 'deleting',
                    'Visible' => '1'
                )
            )
        );

        $DB->delete(
            "ConfigSettings", array('Visible' => 1, 'Description' => 'deleting')
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
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


    /**
     * Test that update updates a specified row in a specified table
     * when given null values
     *
     * @return void
     * @covers Database::update
     */
    function testUpdateWithIsNull()
    {
        $this->_factory   = NDB_Factory::singleton();
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
        $DB->update(
            "ConfigSettings", 
            array('Visible' => null, 'Description' => 'new description'),
            array('Description' => null)
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
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


    /**
     * Test that update correctly alters a specified row from a specified table
     *
     * @return void
     * @covers Database::update
     */
    function testUpdate()
    {
        $this->_factory   = NDB_Factory::singleton();
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
                    'Description' => 'first description',
                    'Visible' => '1'
                )
            )
        );
        $DB->update(
            "ConfigSettings", 
            array('Visible' => null, 'Description' => 'new description'), 
            array('Description' => 'first description')
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
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


    /**
     * Test that insert correctly inserts a specified row into a table
     * when given null values
     *
     * @return void
     * @covers Database::insert
     */
    function testInsertWithIsNull()
    {
        $this->_factory   = NDB_Factory::singleton();
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
        $DB->insert(
            "ConfigSettings",
            array(
                'ID' => 99992,
                'Name' => 'test 2',
                'Visible' => 1,
                'Description' => null
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
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


    /**
     * Test that insert correctly adds a specified row to a specified table
     *
     * @return void
     * @covers Database::insert
     */
    function testInsert()
    {
        $this->_factory   = NDB_Factory::singleton();
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
        $DB->insert(
            "ConfigSettings",
            array(
                'ID' => 99992,
                'Name' => 'test 2',
                'Visible' => 1,
                'Description' => 'test description'
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
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
                    'Description' => 'test description',
                    'Visible' => '1'
                )
            )
        );
    }


    /**
     * Test that replace correctly replaces a given row and adds a row
     * to a table when given null values
     *
     * @return void
     * @covers Database::replace
     */
    function testReplaceWithIsNull()
    {
        $this->_factory   = NDB_Factory::singleton();
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
        $DB->replace(
            "ConfigSettings",
            array(
                'ID' => 99991,
                'Name' => 'test 1',
                'Visible' => 1,
                'Description' => null
            )
        );
        $DB->replace(
            "ConfigSettings",
            array(
                'ID' => 99992,
                'Name' => 'test 2',
                'Visible' =>  1,
                'Description' => null
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
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


    /**
     * Test that replace correctly replaces and adds rows to  a specified table
     *
     * @return void
     * @covers Database::replace
     */
    function testReplace()
    {
        $this->_factory   = NDB_Factory::singleton();
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
        $DB->replace(
            "ConfigSettings",
            array(
                'ID' => 99991,
                'Name' => 'test 1',
                'Visible' => 1,
                'Description' => 'description 1'
            )
        );
        $DB->replace(
            "ConfigSettings",
            array(
                'ID' => 99992,
                'Name' => 'test 2',
                'Visible' => 1,
                'Description' => 'description 2'
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1',
                    'Description' => 'description 1',
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => 'description 2',
                    'Visible' => '1'
                )
            )
        );
    }

    /**
     * Test that insertOnDuplicateUpdate either inserts or updates an entry
     * if the entry already exists in the DB table
     *
     * @return void
     * @covers Database::insertOnDuplicateUpdate
     */
    function testInsertOnDuplicateUpdate()
    {
        $this->_factory = NDB_Factory::singleton();
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
        $DB->insertOnDuplicateUpdate(
            "ConfigSettings",
            array(
                'ID' => 99992,
                'Name' => 'test 2',
                'Visible' => 1,
                'Description' => 'description 2'
            )
        );
        $DB->insertOnDuplicateUpdate(
            "ConfigSettings",
            array(
                'ID' => 99991,
                'Name' => 'test 1 updated',
                'Visible' => 1, 
                'Description' => 'description updated'
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'test 1 updated',
                    'Description' => 'description updated',
                    'Visible' => '1'
                ),
                1 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => 'description 2',
                    'Visible' => '1'
                )
            )
        );
    }

    /**
     * Test that insertOnDuplicateUpdate automatically escapes any HTML
     * in the data for security
     *
     * @return void
     * @covers Database::insertOnDuplicateUpdate
     */
    function testInsertOnDuplicateUpdateEscapesHTML()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods(
                $this->_getAllMethodsExcept(array('insertOnDuplicateUpdate'))
            )
            ->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();


        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array('field' => '&lt;b&gt;Hello&lt;/b&gt;'))
        );

        $stub->_PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));
        $stub->insertOnDuplicateUpdate(
            "test", array('field' => '<b>Hello</b>'), array()
        );
    }

    /**
     * Test that unsafeInsertOnDuplicateUpdate does not escape HTML
     *
     * @return void
     * @covers Database::unsafeInsertOnDuplicateUpdate
     */
    function testUnsafeInsertOnDuplicateUpdateDoesntEscapeHTML()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods(
                $this->_getAllMethodsExcept(array('unsafeInsertOnDuplicateUpdate'))
            )
            ->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(array('field' => '<b>Hello</b>'))
        );

        $stub->_PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));
        $stub->unsafeInsertOnDuplicateUpdate(
            "test", array('field' => '<b>Hello</b>'), array()
        );
    }

    /**
     * Tests that getLastInsertId gets the ID of the row just inserted
     *
     * @return void
     * @covers Database::getLastInsertId
     */
    function testGetLastInsertId()
    {
        $this->_factory   = NDB_Factory::singleton();
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
        $DB->insert(
            "ConfigSettings",
            array(
                'ID' => 99992,
                'Name' => 'test 2',
                'Visible' => 1,
                'Description' => 'test description'
            )
        );
        $lastInsertId = $DB->getLastInsertId();
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals($lastInsertId, '99992');
    }

    /**
     * Test that run calls the exec function on the PDO with the given query
     *
     * @return void
     * @covers Database::run
     */
    function testRun()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods($this->_getAllMethodsExcept(array('run')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stub->_PDO->expects($this->once())
            ->method("exec")->with($this->equalTo("SHOW TABLES"));
        $stub->run("SHOW TABLES");
    }

    /**
     * Test that prepare calls the prepare function on the PDO with the given query
     *
     * @return void
     * @covers Database::prepare
     */
    function testPrepare()
    {
        $this->_factory   = NDB_Factory::singleton();
        $stub = $this->getMockBuilder('FakeDatabase')
            ->setMethods($this->_getAllMethodsExcept(array('prepare')))->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stub->_PDO->expects($this->once())
            ->method("prepare")->with($this->equalTo("SHOW TABLES"));
        $stub->prepare("SHOW TABLES");
    }

    /**
     * Test that execute returns the proper array when a SELECT query is given
     *
     * @return void
     * @covers Database::execute
     */
    function testExecuteNoOptions()
    {
        $this->_factory   = NDB_Factory::singleton();
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
                    'Description' => 'permanent 2',
                    'Visible' => '1'
                )
            )
        );
        $statement = $DB->prepare(
            'SELECT ID, Name, Description, Visible
            FROM ConfigSettings WHERE ID=:id AND Name=:name'
        );
        $allSetting = $DB->execute(
            $statement,
            array(':id' => 99992, 'name' => 'test 2')
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID' => 99992,
                    'Name' => 'test 2',
                    'Description' => 'permanent 2',
                    'Visible' => '1'
                )
            )
        );
    }

    /**
     * Tests that execute returns an empty array when the option
     * 'nofetch' is set to true. Also tests that execute updates the table correctly
     *
     * @return void
     * @covers Database::execute
     */
    function testExecuteWithOptions()
    {
        $this->_factory = NDB_Factory::singleton();
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
        $statement = $DB->prepare(
            "UPDATE ConfigSettings SET Name=:name WHERE ID=:id"
        );
        $allSetting = $DB->execute(
            $statement,
            array(':id' => 99991, ':name' => 'new name'),
            array('nofetch' => true)
        );
        $check = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings", array()
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $check,
            array(
                0 => array(
                    'ID' => 99991,
                    'Name' => 'new name',
                    'Description' => 'permanent',
                    'Visible' => '1'
                )
            )
        );
        $this->assertEquals($allSetting, array());
    }

}
