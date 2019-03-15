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
    //elements location on create timepoint page
    static $DCCID      = ".form-control-static";
    static $Subproject = "#subproject, [select]";
    static $VisitLabel = "#visit, [select]";
    static $createBtn  = ".col-sm-9 > .btn";
    // after successfully create a timepoint, it will show a message and link.
    static $successMsg  = "h3";
    static $successLink = "#lorisworkspace a";

    /**
     * It does the setUp before running the tests
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();

        $this->createSubproject(1, "subprojet 1");
        $this->createSubproject(2, "subprojet 2");
    }

    /**
     * It does the tearDown after running the tests
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();

        $this->deleteSubproject("subprojet 1");
        $this->deleteSubproject("subprojet 2");
    }
    /**
     * Tests that, when loading the create_timepoint module and creating a timepoint
     * as a superuser.
     *
     * @return void
     */
    function testCreateTimepointDoespageLoad()
    {
        $this->setupPermissions(array("superuser"));
        $this->safeGet(
            $this->url . "/create_timepoint/".
            "?candID=900000&identifier=900000&subprojectID=1"
        );
        $btn = self::$createBtn;
         $this->webDriver->executescript(
             "document.querySelector('$btn').click()"
         );
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("New time point successfully", $bodyText);
         $this->resetPermissions();
    }

    /**
     * Tests that, creating a timepoint twice with same visit label
     *
     * @return void
     */
    function testCreateTimepoint()
    {
        $this->_createTimepoint('900000', '1', '1');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New time point successfully registered", $bodyText);
        // insert the same visit label again
        $this->_createTimepoint('900000', '1', '1');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("This visit label is not unique", $bodyText);

    }
    /**
     * Create a timepoint with three parameters.
     *
     * @param string $candID     ID of candidate
     * @param string $subproject index of subproject
     * @param string $visitlabel index of visit label
     *
     * @return void
     */
    private function _createTimepoint($candID, $subproject, $visitlabel)
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=" . $candID .
            "&identifier=" .$candID ."subprojectID=".$subproject
        );
         $project = self::$Subproject;
         $visit   = self::$VisitLabel;
         $btn     = self::$createBtn;
         $value   = $subproject;
         $this->webDriver->executescript(
             "input = document.querySelector('$project');
                 input.selectedIndex = '$value';
                "
         );
         $value = $visitlabel;
         $this->webDriver->executescript(
             "input = document.querySelector('$visit');
                 input.selectedIndex = '$value';
                "
         );
         $this->webDriver->executescript(
             "document.querySelector('$btn').click()"
         );sleep(1);
    }

    /**
     * Tests that, create a timepoint and test the success link
     *
     * @return void
     */
    function testCreateTimepointSuccessLink()
    {
        $this->_createTimepoint('900000', '1', '1');
        $btn = self::$successLink;
        $this->webDriver->executescript(
            "document.querySelector('$btn').click()"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("List of Visits (Time Points)", $bodyText);

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
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();

        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
}

