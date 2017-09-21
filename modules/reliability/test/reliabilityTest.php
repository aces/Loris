<?php
/**
 * Reliability automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   WangShen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
     "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Reliability automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   WangShen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ReliabilityTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Reliability module, some
     * text appears in the body.
     *
     * @return void
     */

    /**
     * Insert testing data
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
         $window = new WebDriverWindow($this->webDriver);
         $size   = new WebDriverDimension(1280, 720);
         $window->setSize($size);
        $this->DB->insert(
            "psc",
            array(
             'CenterID'  => '55',
             'Name'      => 'TESTinPSC',
             'Alias'     => 'tst',
             'MRI_alias' => 'test',
            )
        );

        $this->DB->insert(
            "candidate",
            array(
             'CandID'    => '999888',
             'CenterID'  => '55',
             'UserID'    => '1',
             'PSCID'     => '8888',
             'ProjectID' => '7777',
             'Gender'    => 'Male',
            )
        );
        $this->DB->insert(
            "candidate",
            array(
             'CandID'    => '999889',
             'CenterID'  => '55',
             'UserID'    => '1',
             'PSCID'     => '8889',
             'ProjectID' => '7777',
             'Gender'    => 'Female',
            )
        );
         $this->DB->insert(
             "session",
             array(
              'ID'           => '111111',
              'CandID'       => '999888',
              'CenterID'     => '55',
              'UserID'       => '1',
              'MRIQCStatus'  => 'Pass',
              'SubprojectID' => '6666',
             )
         );
         $this->DB->insert(
             "session",
             array(
              'ID'           => '111112',
              'CandID'       => '999889',
              'CenterID'     => '55',
              'UserID'       => '1',
              'MRIQCStatus'  => 'Pass',
              'SubprojectID' => '6666',
             )
         );
         $this->DB->insert(
             "reliability",
             array(
              'ID'         => '111111112',
              'CommentID'  => 'testCommentID1',
              'Instrument' => 'testInstrument',
             )
         );
         $this->DB->insert(
             "reliability",
             array(
              'ID'         => '111111113',
              'CommentID'  => 'testCommentID2',
              'Instrument' => 'testInstrument',
             )
         );
         $this->DB->insert(
             "test_names",
             array(
              'ID'        => '111111113',
              'Test_name' => 'test_name',
             )
         );
         $this->DB->insert(
             "flag",
             array(
              'ID'        => '111111111',
              'SessionID' => '111111',
              'CommentID' => 'testCommentID1',
              'Test_name' => 'test_name',
             )
         );
         $this->DB->insert(
             "flag",
             array(
              'ID'        => '111111112',
              'SessionID' => '111112',
              'CommentID' => 'testCommentID2',
              'Test_name' => 'test_name',
             )
         );

    }
    //Delete the test data
     /**
      * Deleting the testing data
      *
      * @return void
      */
    public function tearDown()
    {

        $this->DB->delete(
            "session",
            array(
             'CandID'   => '999888',
             'CenterID' => '55',
            )
        );
        $this->DB->delete(
            "session",
            array(
             'CandID'   => '999889',
             'CenterID' => '55',
            )
        );
        $this->DB->delete(
            "candidate",
            array(
             'CandID'   => '999888',
             'CenterID' => '55',
            )
        );
        $this->DB->delete(
            "candidate",
            array(
             'CandID'   => '999889',
             'CenterID' => '55',
            )
        );
        $this->DB->delete(
            "reliability",
            array('ID' => '111111112')
        );
        $this->DB->delete(
            "reliability",
            array('ID' => '111111113')
        );
        $this->DB->delete(
            "flag",
            array('ID' => '111111111')
        );
        $this->DB->delete(
            "flag",
            array('ID' => '111111112')
        );
        $this->DB->delete(
            "psc",
            array(
             'CenterID' => '55',
             'Name'     => 'TESTinPSC',
            )
        );
        $this->DB->delete(
            "test_names",
            array('ID' => '111111113')
        );
        parent::tearDown();
    }
     /**
      * Testing Reliability Load
      *
      * @return void
      */
    function testReliabilityDoespageLoad()
    {
        $this->safeGet($this->url . "/reliability/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("reliability", $bodyText);
    }

    /**
     *Tests landing the Reliability with the permission
     * 'access_all_profiles' or 'reliability_edit_all'
     *
     * @return void
     */
    function testLoginWithPermission()
    {
         $this->setupPermissions(array("access_all_profiles"));
         $this->safeGet($this->url . "/reliability/");
         $bodyText = $this->safeFindElement(
             WebDriverBy::cssSelector("body")
         )->getText();
          $this->assertNotContains(
              "You do not have access to this page.",
              $bodyText
          );
          $this->resetPermissions();

          $this->setupPermissions(array("reliability_edit_all"));
          $this->safeGet($this->url . "/reliability/");
          $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertNotContains(
              "You do not have access to this page.",
              $bodyText
          );
          $this->resetPermissions();

    }
    /**
     * Tests that, input some data and click search button, check the results.
     *
     * @return void
     */
    function testReliabilityShowDataButton()
    {
        //testing search by PSCID
        $this->safeGet($this->url . "/reliability/");
        $this->webDriver->findElement(
            WebDriverBy::Name("PSCID")
        )->sendKeys("8888");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . "/reliability/?format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("8888", $bodyText);

        //testing search by DCCID
        $this->safeGet($this->url . "/reliability/?reset=true");
        $this->webDriver->findElement(
            WebDriverBy::Name("DCCID")
        )->sendKeys("999888");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . "/reliability/?format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("8888", $bodyText);

        //testing search by Gender
        $this->safeGet($this->url . "/reliability/?reset=true");
        $genderElement =  $this->safeFindElement(WebDriverBy::Name("Gender"));
        $gender        = new WebDriverSelect($genderElement);
        $gender->selectByVisibleText("Male");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . "/reliability/?format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("8888", $bodyText);
    }
    /**
     * Tests that, input some data and click click clear button,
     * check the results.
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testReliabilityClearFormButton()
    {
        //testing search by PSCID
        $this->safeGet($this->url . "/reliability/");
        $this->webDriver->findElement(
            WebDriverBy::Name("PSCID")
        )->sendKeys("8888");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Name("PSCID"))
            ->getText();
        $this->assertEquals("", $bodyText);

        //testing search by DCCID
        $this->safeGet($this->url . "/reliability/");
        $this->webDriver->findElement(
            WebDriverBy::Name("DCCID")
        )->sendKeys("8888");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Name("PSCID"))
            ->getText();
        $this->assertEquals("", $bodyText);

        //testing search by Gender
        $this->safeGet($this->url . "/reliability/");
        $genderElement =  $this->safeFindElement(WebDriverBy::Name("Gender"));
        $gender        = new WebDriverSelect($genderElement);
        $gender->selectByVisibleText("Male");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $genderElement =  $this->safeFindElement(WebDriverBy::Name("Gender"));
        $gender        = new WebDriverSelect($genderElement);
        $value         = $gender->getFirstSelectedOption()->getAttribute('value');
        $this->assertEquals("", $value);

    }

}
?>
