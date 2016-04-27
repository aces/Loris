<?php
/**
 * data_integrity_flag automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class dataIntegrityFlagTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the data_integrity_flag module, some
     * text appears in the body.
     *
     * @return void
     */
 /**
     * Insert testing data into the database
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "data_integrity_flag",
            array(
             'dataflag_id'             => '9999999',
             'dataflag_visitlabel'     => 'V_test',
              'dataflag_instrument'    => 'mri_parameter_form',
              'dataflag_date'          => '2015-12-03',
              'dataflag_status'        => '4',
              'dataflag_comment'       => '33',
              'latest_entry'           => '1',
              'dataflag_fbcreated'     => '0',
              'dataflag_fbclosed'      => '0',
              'dataflag_fbcomment'     => '0',
              'dataflag_fbdeleted'     => '0',
              'dataflag_userid'        => 'test_user'
            )
        );
    }
    /**
     * Delete testing data from database
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete("data_integrity_flag", array('dataflag_id' => '9999999'));
    }

    
    function testDataIntegrityFlagDoespageLoad()
    {
        $this->safeGet($this->url . "/data_integrity_flag/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Data Integrity Flag", $bodyText);
    }
}
?>
