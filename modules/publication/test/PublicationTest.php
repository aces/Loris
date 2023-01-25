<?php
/**
 * Publication automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Publication automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class PublicaitonTest extends LorisIntegrationTest
{

    /**
     * Insert testing data into the database
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown(): void
    {
        parent::tearDown();
        $this->DB->delete("issues", ['issueID' => '999999']);
        $this->DB->delete("users", ['ID' => '999998']);
        $this->DB->delete("psc", ['CenterID' => '55']);
    }

    /**
     * Tests that, when loading the Publication module, some
     * text appears in the body.
     *
     * @return void
     */
    function testPublicationDoespageLoad()
    {
        $this->safeGet($this->url . "/publication/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Publications", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
    }

    /**
     * Tests that publicaiton loads with permission
     *
     * @return void
     */
    function testPublicaitonDoespageLoadWithPermissionView()
    {
        $this->setupPermissions(["publication_view"]);
        $this->safeGet($this->url . "/publication/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Publications", $bodyText);
            $this->assertStringNotContainsString(
                "You do not have access to this page.",
                $bodyText
            );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that publicaiton loads with permission
     *
     * @return void
     */
    function testPublicaitonDoespageLoadWithPermissionPropose()
    {
        $this->setupPermissions(["publication_propose"]);
        $this->safeGet($this->url . "/publication/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Publications", $bodyText);
                $this->assertStringNotContainsString(
                    "You do not have access to this page.",
                    $bodyText
                );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that publicaiton loads with permission
     *
     * @return void
     */
    function testPublicaitonDoespageLoadWithPermissionProposeApprove()
    {
        $this->setupPermissions(["publication_approve"]);
        $this->safeGet($this->url . "/publication/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Publications", $bodyText);
                $this->assertStringNotContainsString(
                    "You do not have access to this page.",
                    $bodyText
                );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
        $this->resetPermissions();
    }


    /**
     * Tests that publicaiton create a new publicaiton
     *
     * @return void
     */
    function testCreatePublicaiton()
    {
        $this->safeGet($this->url . "/publication/#propose");
        $this->safeFindElement(
            WebDriverBy::Name("title")
        )->sendKeys("Test title");
        $this->safeFindElement(
            WebDriverBy::Name("description")
        )->sendKeys("Test description");
        $this->safeFindElement(
            WebDriverBy::Name("leadInvestigator")
        )->sendKeys("Test leadInvestigator");
        $this->safeFindElement(
            WebDriverBy::Name("leadInvestigatorEmail")
        )->sendKeys("testleadInvestigator@test.com");
        $submit ="#propose > div > div > form > div > div:nth-child(2) > div >".
        " div:nth-child(11) > div > button";
        $this->safeClick(WebDriverBy::cssSelector($submit));
        $modal    ="body > div.swal2-container.swal2-center.swal2-shown > div";
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector($modal)
        )->getText();
        $this->assertStringContainsString("OK", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
    }

}

