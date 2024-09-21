<?php
/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../vendor/autoload.php';

/**
 * Contains a Fake PDO class used for setting up unit tests.
 *
 * Phan has an issue with the FakeDatabase->trackChanges function. It appears
 * that this function exists only to prevent an unnecessary call during unit
 * tests so we don't need phan to bother us.
 *
 * @phan-file-suppress PhanUnusedProtectedMethodParameter
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class FakePDO extends PDO
{
    /**
     * Override default constructor.
     */
    public function __construct()
    {
    }
}

/**
 * Contains a Fake class used for setting up unit tests.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class FakeDatabase extends Database
{
    /**
     * {@inheritDoc}
     *
     * @param string $table the table into which to insert the row
     * @param array  $set   the values with which to fill the new row
     * @param string $where the selection filter, joined as a boolean and
     * @param string $type  The type of change being tracked (*I*nsert,
     *                      *U*pdate or *D*elete)
     *
     * @return void
     */
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
    protected $factory;
    protected $DB;

    private $_PDO;

    protected \NDB_Config $config;

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
        $this->config = $this->factory->Config(CONFIG_XML);
        $this->DB     = $this->factory->database();
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
        $this->DB->run("DROP TEMPORARY TABLE IF EXISTS ConfigSettings");
    }

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
        /*
        $client = new NDB_Client();
        $client->makeCommandLine();
        $client->initialize();
        */

        $this->DB->setFakeTableData(
            "Config",
            [
                0 => [
                    'ID'       => 99999,
                    'ConfigID' => '123456',
                    'Value'    => 'FKE1234',
                ]
            ]
        );

        $allCandidates = $this->DB->pselect("SELECT * FROM Config", []);

        $this->assertEquals(
            iterator_to_array($allCandidates),
            [
                0 => [
                    'ID'       => 99999,
                    'ConfigID' => 123456,
                    'Value'    => 'FKE1234',
                ]

            ]
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
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['update']))->getMock();

        $PDO  = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(['set_field' => '&lt;b&gt;Hello&lt;/b&gt;'])
        )->will($this->returnValue(true));

        $PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->update("test", ['field' => '<b>Hello</b>'], []);

    }

    /**
     * Test that unsafeupdate does not escape HTML when called intead of update
     *
     * @return void
     * @covers Database::unsafeupdate
     */
    function testUnsafeUpdateDoesntEscapeHTML()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['unsafeupdate']))
            ->getMock();

        $PDO  = $this->getMockBuilder('FakePDO')->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(['set_field' => '<b>Hello</b>'])
        )->will($this->returnValue(true));

        $PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->unsafeupdate("test", ['field' => '<b>Hello</b>'], []);

    }

    /**
     * Test that insert automatically escapes any HTML in the data for security
     *
     * @return void
     * @covers Database::insert
     */
    function testInsertEscapesHTML()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['insert']))->getMock();

        $PDO  = $this->getMockBuilder('FakePDO')
            ->onlyMethods(['lastInsertId'])->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(['field' => '&lt;b&gt;Hello&lt;/b&gt;'])
        )->will($this->returnValue(true));

        $PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->insert("test", ['field' => '<b>Hello</b>'], []);

    }

    /**
     * Test that unsafeinsert does not escape HTML when called intead of insert
     *
     * @return void
     * @covers Database::unsafeinsert
     */
    function testUnsafeInsertDoesntEscapeHTML()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['unsafeinsert']))
            ->getMock();

        $PDO  = $this->getMockBuilder('FakePDO')
            ->onlyMethods(['lastInsertId'])->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(['field' => '<b>Hello</b>'])
        )->will($this->returnValue(true));

        $PDO->expects($this->once())->method("prepare")
            ->will($this->returnValue($stmt));

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->unsafeinsert("test", ['field' => '<b>Hello</b>'], []);

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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                ]
            ]
        );

        $this->DB->delete(
            "ConfigSettings",
            ['Visible' => 1, 'Description' => null]
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => '99991',
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => '99991',
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'deleting',
                    'Visible'     => '1'
                ]
            ]
        );

        $this->DB->delete(
            "ConfigSettings",
            ['Visible' => 1, 'Description' => 'deleting']
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => '99991',
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->update(
            "ConfigSettings",
            ['Visible' => null, 'Description' => 'new description'],
            ['Description' => null]
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'new description',
                    'Visible'     => null
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'first description',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->update(
            "ConfigSettings",
            ['Visible' => null, 'Description' => 'new description'],
            ['Description' => 'first description']
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'new description',
                    'Visible'     => null
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->insert(
            "ConfigSettings",
            [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Visible'     => 1,
                'Description' => null
            ]
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->insert(
            "ConfigSettings",
            [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Visible'     => 1,
                'Description' => 'test description'
            ]
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'test description',
                    'Visible'     => '1'
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->replace(
            "ConfigSettings",
            [
                'ID'          => '99991',
                'Name'        => 'test 1',
                'Visible'     => '1',
                'Description' => null
            ]
        );
        $this->DB->replace(
            "ConfigSettings",
            [
                'ID'          => '99992',
                'Name'        => 'test 2',
                'Visible'     =>  '1',
                'Description' => null
            ]
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => null,
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->replace(
            "ConfigSettings",
            [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Visible'     => 1,
                'Description' => 'description 1'
            ]
        );
        $this->DB->replace(
            "ConfigSettings",
            [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Visible'     => 1,
                'Description' => 'description 2'
            ]
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'description 1',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'description 2',
                    'Visible'     => '1'
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->insertOnDuplicateUpdate(
            "ConfigSettings",
            [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Visible'     => 1,
                'Description' => 'description 2'
            ]
        );
        $this->DB->insertOnDuplicateUpdate(
            "ConfigSettings",
            [
                'ID'          => 99991,
                'Name'        => 'test 1 updated',
                'Visible'     => 1,
                'Description' => 'description updated'
            ]
        );
        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1 updated',
                    'Description' => 'description updated',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'description 2',
                    'Visible'     => '1'
                ]
            ]
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
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods(
                $this->_getAllMethodsExcept(['insertOnDuplicateUpdate'])
            )
            ->getMock();

        $PDO  = $this->getMockBuilder('FakePDO')
            ->onlyMethods(['lastInsertId'])->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(['field' => '&lt;b&gt;Hello&lt;/b&gt;'])
        )->will($this->returnValue(true));

        $PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->insertOnDuplicateUpdate(
            "test",
            ['field' => '<b>Hello</b>'],
            []
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
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods(
                $this->_getAllMethodsExcept(['unsafeInsertOnDuplicateUpdate'])
            )
            ->getMock();

        $PDO  = $this->getMockBuilder('FakePDO')
            ->onlyMethods(['lastInsertId'])->getMock();
        $stmt = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(['field' => '<b>Hello</b>'])
        )->will($this->returnValue(true));

        $PDO->expects($this->once())
            ->method("prepare")->will($this->returnValue($stmt));

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->unsafeInsertOnDuplicateUpdate(
            "test",
            ['field' => '<b>Hello</b>'],
            []
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->DB->insert(
            "ConfigSettings",
            [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Visible'     => 1,
                'Description' => 'test description'
            ]
        );
        $lastInsertId = $this->DB->getLastInsertId();
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
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
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['run']))->getMock();

        $PDO = $this->getMockBuilder('FakePDO')
            ->onlyMethods(['lastInsertId'])->getMock();

        $PDO->expects($this->once())
            ->method("exec")->with($this->equalTo("SHOW TABLES"));

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
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
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['prepare']))->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();

        $PDO->expects($this->once())
            ->method("prepare")
            ->with($this->equalTo("SHOW TABLES"))
            ->willReturn(new PDOStatement());

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                1 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'permanent 2',
                    'Visible'     => '1'
                ]
            ]
        );
        $statement  = $this->DB->prepare(
            'SELECT ID, Name, Description, Visible
            FROM ConfigSettings WHERE ID=:id AND Name=:name'
        );
        $allSetting = $this->DB->execute(
            $statement,
            [':id' => 99992, 'name' => 'test 2']
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                0 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'permanent 2',
                    'Visible'     => '1'
                ]
            ]
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
        $this->DB->setFakeTableData(
            "ConfigSettings",
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $statement  = $this->DB->prepare(
            "UPDATE ConfigSettings SET Name=:name WHERE ID=:id"
        );
        $allSetting = $this->DB->execute(
            $statement,
            [':id' => 99991, ':name' => 'new name'],
            ['nofetch' => "true"]
        );
        $check      = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $check,
            [
                0 => [
                    'ID'          => 99991,
                    'Name'        => 'new name',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
        $this->assertEquals($allSetting, []);
    }

    /**
     * Test that pselect returns the proper information
     *
     * @return void
     * @covers Database::pselect
     */
    function testPselectReturnsCorrectArray()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $allSetting = iterator_to_array(
            $this->DB->pselect(
                "SELECT ID, Name, Description, Visible FROM ConfigSettings",
                []
            )
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals($allSetting, $data);
    }

    /**
     * Test that pselectRow calls the prepare function
     * and adds "LIMIT 2" to the query
     *
     * @return void
     * @covers Database::pselectRow
     */
    function testPselectRowCallsPrepare()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['pselectRow']))
            ->getMock();

        $query  = "SELECT ID, Name, Description, Visible FROM ConfigSettings";
        $params = ['test' => 'test'];
        $stub->expects($this->once())->method("pselect")
            ->with(
                $this->equalTo($query . " LIMIT 2"),
                $params
            );

        '@phan-var \Database $stub';
        $stub->pselectRow(
            $query,
            $params
        );
    }

    /**
     * Test that pselectRow returns the correct data for a given query
     *
     * @return void
     * @covers Database::pselectRow
     */
    function testPselectRowReturnsData()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $allSetting = $this->DB->pselectRow(
            "SELECT ID, Name, Description, Visible 
            FROM ConfigSettings WHERE ID=99992",
            []
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");

        $this->assertEquals(
            $allSetting,
            [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        );
    }

    /**
     * Test that pselectRow throws a DomainException if the query
     * returns more than one row
     *
     * @return void
     * @covers Database::pselectRow
     */
    function testPselectRowThrowsException()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $this->expectException("DomainException");
        $this->DB->pselectRow(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings",
            []
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
    }

    /**
     * Test that pselectCol returns the proper data
     *
     * @return void
     * @covers Database::pselectCol
     */
    function testPselectColReturnsData()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $allSetting = $this->DB
            ->pselectCol("SELECT Name FROM ConfigSettings", []);
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");

        $this->assertEquals($allSetting, [0 => 'test 1', 1 => 'test 2']);
    }

    /**
     * Test that pselectCol throws a DatabaseException if the query
     * asks for more than one column
     *
     * @return void
     * @covers Database::pselectCol
     */
    function testPselectColThrowsException()
    {
        $this->expectException("DatabaseException");
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $this->DB->pselectCol("SELECT ID, Name FROM ConfigSettings", []);
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
    }

    /**
     * Test that pselectOne returns just one value
     *
     * @return void
     * @covers Database::pselectOne
     */
    function testPselectOne()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $allSetting = $this->DB->pselectOne(
            "SELECT ID, Name FROM ConfigSettings WHERE ID=99991",
            []
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");

        $this->assertEquals($allSetting, '99991');
    }

    /**
     * Tests that tableExists returns true if a table exists in the database
     *
     * @return void
     * @covers Database::tableExists
     */
    function testTableExists()
    {
        $exists = $this->DB->tableExists("ConfigSettings");
        $this->assertEquals(true, $exists);
    }

    /**
     * Tests that tableExists returns false if a table doesn't exist in the database
     *
     * @return void
     * @covers Database::tableExists
     */
    function testTableDoesNotExist()
    {
        $exists = $this->DB->tableExists("TestTable");
        $this->assertEquals(false, $exists);
    }

    /**
     * Tests that columnExists returns true if a column exists in a table
     *
     * @return void
     * @covers Database::tableExists
     */
    function testColumnExists()
    {
        $exists = $this->DB->columnExists("ConfigSettings", "Name");
        $this->assertEquals(true, $exists);
    }

    /**
     * Tests that columnExists returns false if a column does not exist in a table
     *
     * @return void
     * @covers Database::tableExists
     */
    function testColumnDoesNotExist()
    {
        $exists = $this->DB->columnExists("ConfigSettings", "TestCol");
        $this->assertEquals(false, $exists);
    }

    /**
     * Test that insertIgnore calls _realInsert with ignore set to true
     *
     * @return void
     * @covers Database::insertIgnore
     */
    function testInsertIgnore()
    {
        $this->markTestIncomplete(
            "This test calls a private method, making it fail for now"
        );
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['insertIgnore']))
            ->getMock();

        $table = "ConfigSettings";
        $set   = ['ID' => 99991];

        $stub->expects($this->once())
            ->method("_realinsert")->with($this->equalTo($table), $set, true, true);

        '@phan-var \Database $stub';
        $stub->insertIgnore($table, $set);
    }

    /**
     * Test that pselectWithIndexKey re-indexes the results in terms
     * of given index key
     *
     * @return void
     * @covers Database::pselectWithIndexKey
     */
    function testPselectWithIndexKey()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $allSetting = $this->DB->pselectWithIndexKey(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings",
            [],
            "ID"
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            [
                99991 => [
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ],
                99992 => [
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ]
            ]
        );
    }

    /**
     * Test that pselectWithIndexKey throws a LorisException if the
     * given index key is null/empty
     *
     * @return void
     * @covers Database::pselectWithIndexKey
     */
    function testPselectWithIndexKeyThrowsLorisException()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);
        $this->expectException("LorisException");
        $this->DB->pselectWithIndexKey(
            "SELECT ID, Name FROM ConfigSettings",
            [],
            ""
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
    }

    /**
     * Test that pselectWithIndexKey throws a DatabaseException if the
     * index key provided does not exist in the row
     *
     * @return void
     * @covers Database::pselectWithIndexKey
     */
    function testPselectWithIndexKeyThrowsDbException()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);
        $this->expectException("DatabaseException");
        $this->DB->pselectWithIndexKey(
            "SELECT ID, Name FROM ConfigSettings",
            [],
            "Test"
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
    }

    /**
     * Test that pselectColWithIndexKey returns the correct data that is indexed
     * with the correct index key
     *
     * @return void
     * @covers Database::pselectColWithIndexKey
     */
    function testPselectColWithIndexKey()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $allSetting = $this->DB->pselectColWithIndexKey(
            "SELECT ID, Name FROM ConfigSettings",
            [],
            "ID"
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");

        $this->assertEquals(
            $allSetting,
            [99991 => 'test 1', 99992 => 'test 2']
        );
    }

    /**
     * Test that pselectColWithIndexKey throws a LorisException if the index key
     * is null/emptu
     *
     * @return void
     * @covers Database::pselectColWithIndexKey
     */
    function testPselectColWithIndexKeyThrowsLorisException()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $this->expectException("LorisException");
        $this->DB->pselectColWithIndexKey(
            "SELECT ID, Name FROM ConfigSettings",
            [],
            ""
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
    }

    /**
     * Test that pselectColWithIndexKey returns a DatabaseException if the
     * index key is not included in the SELECT query
     *
     * @return void
     * @covers Database::pselectColWithIndexKey
     */
    function testPselectColWithIndexKeyThrowsDbExceptionOne()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $this->expectException("DatabaseException");
        $this->DB->pselectColWithIndexKey(
            "SELECT Name FROM ConfigSettings",
            [],
            "ID"
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
    }

    /**
     * Test that pselectColWithIndexKey throws a DatabaseException if the index key
     * given is not a unique key
     *
     * @return void
     * @covers Database::pselectColWithIndexKey
     */
    function testPselectColWithIndexKeyThrowsDbExceptionTwo()
    {
        $data = [
            0 => [
                'ID'          => 99991,
                'Name'        => 'test 1',
                'Description' => 'permanent',
                'Visible'     => '1'
            ],
            1 => [
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Description' => 'permanent',
                'Visible'     => '1'
            ]
        ];
        $this->DB->setFakeTableData("ConfigSettings", $data);

        $this->expectException("DatabaseException");
        $this->DB->pselectColWithIndexKey(
            "SELECT Visible, Name FROM ConfigSettings",
            [],
            "Visible"
        );
        $this->DB->run("DROP TEMPORARY TABLE ConfigSettings");
    }

    /**
     * Tests that quote calls the PDO::quote function
     *
     * @return void
     * @covers Database::quote
     */
    function testQuote()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['quote']))->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();

        $string = "Co'mpl''ex \"st'\"ring";
        $PDO->expects($this->once())->method("quote")
            ->willReturn("Complex string");

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->quote($string);
    }

    /**
     * Test that escape properly escapes a string and adds backticks
     *
     * @return void
     * @covers Database::escape
     */
    function testEscape()
    {
        $allSetting = $this->DB->escape("'`\\TableName\0\n\r\x1a`'");
        $this->assertEquals($allSetting, "`\\'\\`\\\\TableName\\0\\n\\r\\Z\\`\\'`");
    }

    /**
     * Tests that inTransaction calls the PDO::inTransaction function
     *
     * @return void
     * @covers Database::inTransaction
     */
    function testInTransaction()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['inTransaction']))
            ->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();

        $PDO->expects($this->once())->method("inTransaction")
            ->willReturn(true);

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->inTransaction();
    }

    /**
     * Test that beginTransaction calls PDO::beginTransaction
     * if inTransaction is false
     *
     * @return void
     * @covers Database::beginTransaction
     */
    function testBeginTransaction()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['beginTransaction']))
            ->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();

        $stub->expects($this->once())->method("inTransaction")->willReturn(false);
        $PDO->expects($this->once())->method("beginTransaction")
            ->willReturn(true);

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;

        $stub->beginTransaction();
    }

    /**
     * Test that beginTransaction throws a DatabaseException if inTransaction true
     *
     * @return void
     * @covers Database::beginTransaction
     */
    function testBeginTransactionThrowsException()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['beginTransaction']))
            ->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();

        $stub->expects($this->once())->method("inTransaction")->willReturn(true);
        $this->expectException("DatabaseException");

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->beginTransaction();
    }

    /**
     * Test that rollBack calls PDO::rollBack if inTransaction is true
     *
     * @return void
     * @covers Database::rollBack
     */
    function testRollback()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['rollBack']))->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();

        $stub->expects($this->once())->method("inTransaction")->willReturn(true);
        $PDO->expects($this->once())->method("rollBack")->willReturn(true);

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->rollBack();
    }

    /**
     * Test that rollBack throws a DatabaseException if inTransaction is false
     *
     * @return void
     * @covers Database::rollBack
     */
    function testRollbackThrowsException()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['rollBack']))->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();

        $stub->expects($this->once())->method("inTransaction")->willReturn(false);
        $this->expectException("DatabaseException");

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->rollBack();
    }

    /**
     * Test that commit calls PDO::commit if inTransaction is true
     *
     * @return void
     * @covers Database::commit
     */
    function testCommit()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['commit']))->getMock();

        $PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stub->expects($this->once())->method("inTransaction")->willReturn(true);
        $PDO->expects($this->once())->method("commit")->willReturn(true);

        '@phan-var \Database $stub';
        '@phan-var \PDO $PDO';
        $stub->_PDO = $PDO;
        $stub->commit();
    }

    /**
     * Test that commit throws a DatabaseException if inTransaction is false
     *
     * @return void
     * @covers Database::commit
     */
    function testCommitThrowsException()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['commit']))->getMock();

        $stub->expects($this->once())->method("inTransaction")->willReturn(false);
        $this->expectException("DatabaseException");

        '@phan-var \Database $stub';
        $PDO = $this->getMockBuilder('FakePDO')->getMock();
        '@phan-var \PDO $PDO';

        $stub->_PDO = $PDO;
        $stub->commit();
    }

    /**
     * Test that isConnected returns false if the PDO is not setup
     *
     * @return void
     * @covers Database::isConnected
     */
    function testIsConnectedNoPDO()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['isConnected']))
            ->getMock();

        '@phan-var \Database $stub';
        $val = $stub->isConnected();
        $this->assertEquals($val, false);
    }

    /**
     * Test that isConnected returns true if the PDO is setup
     *
     * @return void
     * @covers Database::isConnected
     */
    function testIsConnectedWithPDO()
    {
        $stub = $this->getMockBuilder('FakeDatabase')
            ->onlyMethods($this->_getAllMethodsExcept(['isConnected']))
            ->getMock();
        '@phan-var \Database $stub';

        $PDO = $this->getMockBuilder('FakePDO')
            ->onlyMethods(['query'])->getMock();

        $PDO->expects($this->once())
            ->method("query")
            ->willReturn("1");

        '@phan-var \FakePDO $PDO';

        $stub->_PDO = $PDO;
        $val        = $stub->isConnected();
        $this->assertEquals($val, true);
    }
}
