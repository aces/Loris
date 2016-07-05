<?php
/**
 * Module create_timepoint automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
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
        parent::setUp();

        $this->createSubproject("subprojet 1");
        $this->createSubproject("subprojet 2");
    }

    /**
     * It does the tearDown after running the tests
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();

        $this->deleteSubproject("subprojet 1");
        $this->deleteSubproject("subprojet 2");
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointDoespageLoad()
    {
        $this->safeGet($this->url . "/create_timepoint/?candID=900000&identifier=900000");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Create Time Point", $bodyText);
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepoint()
    {
        //input a unique visit label and create it successfully.
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Create Time Point", $bodyText);

        $select = $this->safeFindElement(WebDriverBy::Name("subprojectID"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("Experimental");

        $this->webDriver->findElement(WebDriverBy::Name("visitLabel"))->sendKeys("V2");
        $this->webDriver->findElement(WebDriverBy::Name("fire_away"))->click();

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("New time point successfully registered", $bodyText);

      // Test input a duplicate visit tag and get error message
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $select = $this->safeFindElement(WebDriverBy::Name("subprojectID"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("Control");

        $this->webDriver->findElement(WebDriverBy::Name("visitLabel"))->sendKeys("V2");
        $this->webDriver->findElement(WebDriverBy::Name("fire_away"))->click();
        $this->assertContains("This visit label is not unique.", $bodyText);

    }
    /**
     * Tests that, when loading the create_timepoint module and input a delicate visit tag,
     * some error text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointWithError()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );

        $select = $this->safeFindElement(WebDriverBy::Name("subprojectID"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("Experimental");

        $this->webDriver->findElement(WebDriverBy::Name("visitLabel"))->sendKeys("V2");
        $this->webDriver->findElement(WebDriverBy::Name("fire_away"))->click();
         sleep(20);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("This visit label is not unique.", $bodyText);

    }

}
?>
                 
