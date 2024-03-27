<?php
/**
 * Publication automated integration tests
 *
 * PHP Version 8
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
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class PublicaitonTest extends LorisIntegrationTest
{
    private $_loadingBrowseUI  = [
        [
            "label"    => "Title",
            "selector" => "#publications_filter_form>div>div:nth-child(1)>div>label",
        ],
    ];
    private $_loadingproposeUI = [
        [
            "label"    => "Title*",
            "selector" => "#propose>div>div>form>div>div:nth-child(1)>div>div>label",
        ],
    ];
    private $_loadingViewUI    = [
        [
            "label"    => "Lead Investigator Email",
            "selector" =>
        "#lorisworkspace > div > div > div > div > div > form",
        ],
    ];

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
     * This function could test UI elements in each Tabs.
     *
     * @return void
     */
    function testLoadingUIS()
    {
        $this->_testPageUIs("/publication", $this->_loadingBrowseUI);
        $this->_testPageUIs("/publication/#propose", $this->_loadingproposeUI);
        $this->_testPageUIs("/publication/view_project?id=1", $this->_loadingViewUI);

    }
    /**
     * This function could test UI elements in each Tabs.
     *
     * @param string $url this is for the url which needs to be tested.
     * @param array  $uis UI elements in each Tabs.
     *
     * @return void
     */
    function _testPageUIs($url,$uis)
    {
        $this->safeGet($this->url . $url);
        foreach ($uis as $ui ) {
            $text = $this->safeFindElement(
                WebDriverBy::cssSelector($ui['selector'])
            )->getText();
            $this->assertStringContainsString($ui['label'], $text);
        }
    }
}

