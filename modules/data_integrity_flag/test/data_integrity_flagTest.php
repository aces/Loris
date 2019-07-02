<?php
/**
 * Data_integrity_flag automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
      "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Data_integrity_flag automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DataIntegrityFlagTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Insert testing data into the database
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "data_integrity_flag",
            array(
             'dataflag_id'         => '9999999',
             'dataflag_visitlabel' => 'V_test',
             'dataflag_instrument' => 'test_instrument',
             'dataflag_date'       => '2015-12-03',
             'dataflag_status'     => '4',
             'dataflag_comment'    => '33',
             'latest_entry'        => '1',
             'dataflag_fbcreated'  => '0',
             'dataflag_fbclosed'   => '0',
             'dataflag_fbcomment'  => '0',
             'dataflag_fbdeleted'  => '0',
             'dataflag_userid'     => 'test_user',
            )
        );
    }

    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete(
            "data_integrity_flag",
            array('dataflag_id' => '9999999')
        );
    }

    /**
     * Testing load this page
     *
     * @return void
     */
    function testDataIntegrityFlagDoespageLoad()
    {
        $this->safeGet($this->url . "/data_integrity_flag/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Data Integrity Flag", $bodyText);
    }

    /**
     * Testing filter with Instrument
     *
     * @return void
     */
    function testDataIntegrityFlagFilterInstrument()
    {
        $this->safeGet(
            $this->url . "/data_integrity_flag/?format=json"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("test_user", $bodyText);
    }


    /**
     * Logining this page without permissions "data_integrity_flag"
     *
     * @return void
     */
    function testDataIntegrityFlagWithoutPermissions()
    {

         $this->setupPermissions(array());
          $this->safeGet($this->url . "/data_integrity_flag/");
          $bodyText = $this->webDriver->findElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertContains(
              "You do not have access to this page.",
              $bodyText
          );
          $this->resetPermissions();
    }
    /**
     * Testing filter with user
     *
     * @return void
     */
    function testDataIntegrityFlagFilterUser()
    {
        $this->safeGet(
            $this->url . "/data_integrity_flag/?format=json"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("test_instrument", $bodyText);
    }

    /**
     * Logining this page with permissions "data_integrity_flag"
     *
     * @return void
     */
    function testDataIntegrityFlagWithPermissions()
    {

         $this->setupPermissions(array("data_integrity_flag"));
          $this->safeGet($this->url . "/data_integrity_flag/");
          $bodyText = $this->webDriver->findElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertNotContains(
              "You do not have access to this page.",
              $bodyText
          );
          $this->resetPermissions();
    }
    /**
     * Testing filter with visit label
     *
     * @return void
     */
    function testDataIntegrityFlagFilterVisitlabel()
    {
        $this->safeGet(
            $this->url . "/data_integrity_flag/?format=json"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("test_user", $bodyText);
    }
}

