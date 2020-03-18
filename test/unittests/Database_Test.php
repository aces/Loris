<?php
/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
require_once __DIR__ . '/../../vendor/autoload.php';

/**
 * Contains a Fake PDO class used for setting up unit tests.
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
    ):void {
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
     * Helper function to return the list of functions from the Database class.
     *
     * @param array $methods A list of methods.
     *
     * @return array
     */
    function _getAllMethodsExcept($methods): array
    {
        $AllMethods = get_class_methods('Database');

        return array_diff($AllMethods, $methods);
    }

    /**
     * Tests that the setFakeDataTable works.
     *
     * @return void
     *
     * @covers Database::setFakeTableData
     */
    function testSetFakeData(): void
    {
        $client = new NDB_Client();
        $client->makeCommandLine();
        $client->initialize();

        $DB = Database::singleton();

        $DB->setFakeTableData(
            "Config",
            array(
                0 => array(
                    'ID'       => 99999,
                    'ConfigID' => '123456',
                    'Value'    => 'FKE1234',
                )
            )
        );

        $allCandidates = $DB->pselect("SELECT * FROM Config", array());

        $this->assertEquals(
            $allCandidates,
            array(
                0 => array(
                    'ID'       => 99999,
                    'ConfigID' => 123456,
                    'Value'    => 'FKE1234',
                )

            )
        );
    }

    /**
     * Ensures that update function escapes HTML.
     *
     * @return void
     *
     * @covers Database::update
     */
    function testUpdateEscapesHTML(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $stub           = $this->getMockBuilder('FakeDatabase')
            ->setMethods(
                $this->_getAllMethodsExcept(array('update'))
            )->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt       = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(
                array(
                    'set_field' => '&lt;b&gt;Hello&lt;/b&gt;'
                )
            )
        );

        $stub->_PDO->expects($this->once())->method("prepare")
            ->will($this->returnValue($stmt));
        $stub->update("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Ensures that unsafe update function does not escape HTML.
     *
     * @return void
     *
     * @covers Database::unsafeUpdate
     */
    function testUnsafeUpdateDoesntEscapeHTML(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $stub           = $this->getMockBuilder('FakeDatabase')
            ->setMethods(
                $this->_getAllMethodsExcept(
                    array('unsafeupdate')
                )
            )->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt       = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(
                array(
                    'set_field' => '<b>Hello</b>'
                )
            )
        );

        $stub->_PDO->expects($this->once())->method("prepare")
            ->will($this->returnValue($stmt));
        $stub->unsafeupdate("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Ensures that the insert function escapes HTML inputs.
     *
     * @return void
     *
     * @covers Database::insert
     */
    function testInsertEscapesHTML(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $stub           = $this->getMockBuilder('FakeDatabase')
            ->setMethods(
                $this->_getAllMethodsExcept(array('insert'))
            )->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt       = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(
                array(
                    'field' => '&lt;b&gt;Hello&lt;/b&gt;'
                )
            )
        );

        $stub->_PDO->expects($this->once())->method("prepare")->will(
            $this->returnValue($stmt)
        );
        $stub->insert("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Ensures that the unsafe insert function does not escape HTML inputs.
     *
     * @return void
     *
     * @covers Database::unsafeInsert
     */
    function testUnsafeInsertDoesntEscapeHTML(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $stub           = $this->getMockBuilder('FakeDatabase')
            ->setMethods(
                $this->_getAllMethodsExcept(
                    array('unsafeinsert')
                )
            )
            ->getMock();

        $stub->_PDO = $this->getMockBuilder('FakePDO')->getMock();
        $stmt       = $this->getMockBuilder('PDOStatement')->getMock();

        $stmt->expects($this->once())->method("execute")->with(
            $this->equalTo(
                array(
                    'field' => '<b>Hello</b>'
                )
            )
        );

        $stub->_PDO->expects($this->once())
            ->method("prepare")
            ->will($this->returnValue($stmt));
        $stub->unsafeinsert("test", array('field' => '<b>Hello</b>'), array());

    }

    /**
     * Tests the DB delete function with null inputs.
     *
     * @return void
     *
     * @covers Database::delete
     */
    function testDeleteWithIsNull(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ),
                1 => array(
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                )
            )
        );

        $DB->delete("ConfigSettings", array('Visible' => 1, 'Description' => null));
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings",
            array()
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID'          => '99991',
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                )
            )
        );

    }

    /**
     * Tests the DB update function with null inputs.
     *
     * @return void
     *
     * @covers Database::update
     */
    function testUpdateWithIsNull(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ),
                1 => array(
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                )
            )
        );
        $DB->update(
            "ConfigSettings",
            array(
                'Visible'     => null,
                'Description' => 'new description'
            ),
            array(
                'Description' => null
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings",
            array()
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ),
                1 => array(
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => 'new description',
                    'Visible'     => null
                )
            )
        );
    }

    /**
     * Tests the DB insert function with null inputs.
     *
     * @return void
     *
     * @covers Database::insert
     */
    function testInsertWithIsNull(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                )
            )
        );
        $DB->insert(
            "ConfigSettings",
            array(
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Visible'     => 1,
                'Description' => null
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings",
            array()
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                ),
                1 => array(
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                )
            )
        );
    }

    /**
     * Tests the DB replace function with null inputs.
     *
     * @return void
     *
     * @covers Database::replace
     */
    function testReplaceWithIsNull(): void
    {
        $this->_factory = NDB_Factory::singleton();
        $DB = Database::singleton();
        $DB->setFakeTableData(
            "ConfigSettings",
            array(
                0 => array(
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => 'permanent',
                    'Visible'     => '1'
                )
            )
        );
        $DB->replace(
            "ConfigSettings",
            array(
                'ID'          => 99991,
                'Name'        =>
                'test 1',
                'Visible'     => 1,
                'Description' => null
            )
        );
        $DB->replace(
            "ConfigSettings",
            array(
                'ID'          => 99992,
                'Name'        => 'test 2',
                'Visible'     => 1,
                'Description' => null
            )
        );
        $allSetting = $DB->pselect(
            "SELECT ID, Name, Description, Visible FROM ConfigSettings",
            array()
        );
        $DB->run("DROP TEMPORARY TABLE ConfigSettings");
        $this->assertEquals(
            $allSetting,
            array(
                0 => array(
                    'ID'          => 99991,
                    'Name'        => 'test 1',
                    'Description' => null,
                    'Visible'     => '1'
                ),
                1 => array(
                    'ID'          => 99992,
                    'Name'        => 'test 2',
                    'Description' => null,
                    'Visible'     => '1'
                )
            )
        );
    }
}
