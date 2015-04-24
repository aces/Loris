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
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Database_Test extends PHPUnit_Framework_TestCase
{
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
}
?>
