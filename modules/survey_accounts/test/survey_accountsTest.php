<?php
/**
 * Survey accounts automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen  <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class survey_accountsTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Insert testing data
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
         $window = new WebDriverWindow($this->webDriver);
         $size = new WebDriverDimension(1024,768);
         $window->setSize($size);
         $this->DB->insert(
            "psc",
            array(
             'CenterID' => '55',
             'Name' => 'TESTinPSC',
             'Alias' => 'test',
             'MRI_alias' => 'test'
            )
        );
          $this->DB->insert(
            "candidate",
            array(
             'CandID'        => '999888',
             'CenterID'      => '55',
             'UserID'        => '1',
             'PSCID'         => '8888',
             'ProjectID'     => '7777'
            )
        );
        $this->DB->insert(
            "session",
            array(
             'ID'            => '111111',
             'CandID'        => '999888',
             'CenterID'      => '55',
             'UserID'        => '1',
             'MRIQCStatus'   => 'Pass',
             'SubprojectID'  => '6666',
             'Visit'         => 'In Progress'
            )
        ); 
          $this->DB->insert(
            "candidate",
            array(
             'CandID'        => '999999',
             'CenterID'      => '55',
             'UserID'        => '1',
             'PSCID'         => '8889',
             'ProjectID'     => '7777'
            )
        );
        $this->DB->insert(
            "session",
            array(
             'ID'            => '111112',
             'CandID'        => '999999',
             'CenterID'      => '55',
             'UserID'        => '1',
             'MRIQCStatus'   => 'Pass',
             'SubprojectID'  => '6666',
             'Visit'         => 'In Progress'
            )
        );  
        $this->DB->insert(
            "participant_accounts",
            array(
             'SessionID'     => '111111',
             'Email'         => 'TestTestTest@gmail.com',
             'Test_name'     => 'Test',
             'Status'        => 'In Progress',
             'OneTimePassword' => 'Test'
            )
        );
     }
 //Delete the test data
    public function tearDown()
    {
        $this->DB->delete(
            "participant_accounts",
            array('SessionID'=>'111111')
        );
      
        $this->DB->delete(
            "session",
            array('CandID' => '999888')
        );
        $this->DB->delete(
            "candidate",
            array('CandID' => '999888')
        );
        $this->DB->delete(
            "session",
            array('CandID' => '999999')
        );
        $this->DB->delete(
            "candidate",
            array('CandID' => '999999')
        );
        $this->DB->delete(
            "psc",
            array('CenterID'=>'55')
        );
        parent::tearDown();
     }
    /**
     * Tests that, when loading the Survey accounts module, some
     * text appears in the body.
     *
     * @return void
     */
    function testSurveyAccountsDoespageLoad()
    {
        $this->setupPermissions(array("user_accounts"));
        $this->safeGet($this->url . "/survey_accounts/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Survey Accounts", $bodyText);
         $this->resetPermissions();
    }

    /**
     * Tests that, when loading the Survey accounts module > add_survey submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testSurveyAccountsAddSurveyDoespageLoad()
    {
        $this->safeGet($this->url . "/survey_accounts/add_survey/");     
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Add Survey", $bodyText);
    }
    /**
     * Tests that, when loading the Survey without right permission, some
     * text appears in the body.
     *
     * @return void
     */
    function testSurveyAccountsWithoutPermission()
    {
          $this->setupPermissions(array(""));
          $this->safeGet($this->url . "/survey_accounts/");
          $bodyText = $this->safeFindElement(
               WebDriverBy::cssSelector("body")
           )->getText();
           $this->assertContains("You do not have access to this page.", $bodyText);
           $this->resetPermissions();
    }

    /**
     * Tests that, when add a survey without visit tag
     * it should appear the error message
     *
     * @return void
     */
    function testSurveyAccountsAddSurvey()
    {
          $this->safeGet($this->url . "/survey_accounts/");
          $this->safeFindElement(
               WebDriverBy::Name("button")
           )->click();
          $this->safeFindElement(
               WebDriverBy::Name("CandID")
           )->sendKeys("999999");
          $this->safeFindElement(
               WebDriverBy::Name("PSCID")
           )->sendKeys("8889"); 
          $this->safeFindElement(
               WebDriverBy::Name("fire_away")
           )->click();           
           $bodyText =  $this->safeFindElement(
               WebDriverBy::cssSelector(".error")
           )->getText();
           $this->assertContains("Visit does not exist for given candidate", $bodyText);
    }

//to do search

//clear





}
?>
