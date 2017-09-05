<?php
/**
 * Module create_timepoint automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests"
    . "/LorisIntegrationTestWithCandidate.class.inc";

/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CreateTimepointTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
     /**
     * It does the setUp before running the tests
     *
     * @return none
     */
    function setUp()
    {
        $this->login('admin','testpassword');
        parent::setUp();

    }

    /**
     * It does the tearDown after running the tests
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();

    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointDoespageLoad()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=300003&identifier=300003"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Create Time Point", $bodyText);
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.After create timepoint successful and 
     * test "Click here to continue." link to go back create_timepoint
     * page.
     *
     * @return void
     */
    function testCreateTimepointAndCheckLink()
    {
        $this->_createTimepoint('300003', 'Fresh', 'V2');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New time point successfully registered", $bodyText);
        // test link to go back create_timepoint module
        $this->webDriver->findElement(
            WebDriverBy::linkText("Click here to continue.")
        )->click();
        $this->webDriver->findElement(
            WebDriverBy::linkText("V2")
        )->click();
        // it should goto instrument_list page
        $text = $this->webDriver->executescript(
               "return document.querySelector('#bc2 > a:nth-child(3) > div').".
               "textContent"
        );
        $this->assertContains("Candidate Profile 300003 / MTL003", $text);
        
        
    }

    /**
     * Tests that, create a timepoint with duplicated data
     * and get error message.
     *
     * @return void
     */
    function testCreateTimepointErrorVisitLabel()
    {
        $this->_createTimepoint('300003', 'Fresh', 'V2');
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains(
            "This visit label is not unique.",
            $bodyText
        );

    }

    /**
     * Create a timepoint with three parameters.
     *
     * @param string $canID      ID of candidate
     * @param string $subproject text of subproject
     * @param string $visitlabel text of visit label
     *
     * @return void.
     */
    private function _createTimepoint($canID, $subproject, $visitlabel)
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=" . $canID .
            "&identifier=" .$canID
        );

        $select  = $this->safeFindElement(WebDriverBy::Name("subprojectID"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText($subproject);

        $this->webDriver->findElement(
            WebDriverBy::Name("visitLabel")
        )->sendKeys($visitlabel);
        $this->webDriver->findElement(
            WebDriverBy::Name("fire_away")
        )->click();

    }


    /**
     * Tests that, create a timepoint and input a empty subproject
     * get Error message
     *
     * @return void
     */
    function testCreateTimepointErrorEmptySubproject()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=300003&identifier=300003"
        );
        $this->webDriver->findElement(WebDriverBy::Name("fire_away"))->click();
        $bodyText = $this->webDriver->getPageSource();
        $this->assertNotContains(
            "New time point successfully registered.",
            $bodyText
        );

    }
    /**
      * Tests that timepoint loads with the permission
      *
      * @return void
      */
    public function testCreateTimepointPermission()
    {
         $this->setupPermissions(array("data_entry"));
         $this->safeGet(
             $this->url . "/create_timepoint/?candID=300003&identifier=300003"
         );
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();

         $this->assertNotContains("You do not have access to this page.", $bodyText);
         $this->resetPermissions();
    }
}
?>
