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
            "candidate",
            array(
                0 => array(
                'CandID' => '123456',
                'PSCID'  => 'FKE1234',
                'DoB'    => '1900-01-01',
                'Testdate' => '2015-04-15 11:32:34'
            )
            )
        );

        $allCandidates = $DB->pselect("SELECT * FROM candidate", array());

        $this->assertEquals(
            $allCandidates,
            array(
                0 => array(
                    'ID' => 1568,
                    'CandID' => 123456,
                    'PSCID' => 'FKE1234',
                    'ExternalID' => '',
                    'DoB' => '1900-01-01',
                    'EDC' => '',
                    'Gender' => '',
                    'CenterID' => 0,
                    'ProjectID' => '',
                    'Ethnicity' => '',
                    'Active' => 'Y',
                    'Date_active' =>  '',
                    'Cancelled' => 'N',
                    'Date_cancelled' => '',
                    'RegisteredBy' => '',
                    'UserID' => '',
                    'Date_registered' => '',
                    'Testdate' => '2015-04-15 11:32:34',
                    'Entity_type' => 'Human',
                    'IBISId' => '',
                    'CandidateGUID' => '',
                    'ProbandGUID' => '',
                    'EARLIId' =>  '',
                    'ProbandGender' => '',
                    'ProbandDoB' => '',
                    'flagged_caveatemptor' => 'false',
                    'flagged_info' => '',
                    'flagged_other' => '',
                    'flagged_other_status' => '',
                    'flagged_reason' => ''
                )

            )
        );

    }
}
?>
