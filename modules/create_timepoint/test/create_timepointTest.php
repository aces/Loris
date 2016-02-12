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

    function testCreateTimepointSelectSubproject()
    {
        $this->webDriver->get(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );

        $h3 = $this->webDriver->findElement(WebDriverBy::cssSelector("h3"));
        $this->assertContains("Create Time Point", $h3->getText());

        $subPS = $this->webDriver->findElement(WebDriverBy::Name("subprojectID"));
        $subPS->sendKeys("subprojet 2\r");

        $vl = $this->webDriver->findElement(WebDriverBy::Name("visitlabel"));
        $vl->sendKeys("V06");

        $ctp = $this->webDriver->findElement(WebDriverBy::Name("fire_away"));
        $ctp->click();

        $visitlabel = $this->webDriver->findElement(
            WebDriverBy::cssSelector(".col-sm-12~ .col-sm-12+ .col-sm-12 label")
        )->getText();
        $this->assertContains("Visit label", $visitlabel);
    }
     */
}
?>
