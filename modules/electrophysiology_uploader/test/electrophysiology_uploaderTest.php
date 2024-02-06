<?php
/**
 * Electrophysiology_uploader automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ .
      "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Electrophysiology_uploader automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ElectrophysiologyUploaderTestIntegrationTest extends LorisIntegrationTest
{
    // expect UIs for Browse Tab
    private $_loadingBrowseUI = [
        [
            "label"    => "Site",
            "selector" => "body",
        ]
    ];
    // expect UIs for Upload Tab
    private $_loadingUploadUI = [
        [
            "label"    => "Upload an electrophysiology recording session",
            "selector" => "#upload",
        ],
        [
            "label"    => "File to Upload",
            "selector" => "#upload",
        ],
        [
            "label"    => "CandID",
            "selector" => "#upload",
        ],
        [
            "label"    => "PSCID",
            "selector" => "#upload",
        ],
        [
            "label"    => "Visit Label",
            "selector" => "#upload",
        ],
    ];
    /**
     * Tests that, when loading the Electrophysiology_uploader module, some
     * text appears in the body.
     *
     * @return void
     */
    function testElectrophysiologyUploaderDoespageLoad()
    {
        $this->setupPermissions(
            ["electrophysiology_browser_view_allsites",
                "electrophysiology_browser_view_site"
            ]
        );
        $this->safeGet($this->url . '/electrophysiology_uploader/');
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#lorisworkspace")
        )->getText();
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
     * Tests that, when loading the Electrophysiology_uploader
     *  module without permission,
     * "You do not have access to this page." appears in the body.
     *
     * @return void
     */
    function testElectrophysiologyUploaderLoadWithoutPermission()
    {
        $this->setupPermissions([""]);
        $this->safeGet($this->url . '/electrophysiology_uploader/');
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
    }
    /**
     * Tests that, when loading the
     *   Electrophysiology_uploader module with permission,
     * "You do not have access to this page." not appears in the body.
     *
     * @return void
     */
    function testElectrophysiologyUploaderLoadWithPermission()
    {
        $this->setupPermissions(
            ["electrophysiology_browser_view_allsites",
                "electrophysiology_browser_view_site"
            ]
        );
        $this->safeGet($this->url . '/electrophysiology_uploader/');
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
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
        $this->setupPermissions(['superuser']);
        $this->_testPageUIs(
            "/electrophysiology_uploader/",
            $this->_loadingBrowseUI
        );
        // click upload tab
        $this->_testPageUIs(
            "/electrophysiology_uploader/#upload",
            $this->_loadingUploadUI
        );
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
        $this->safeGet($this->url . '/electrophysiology_uploader/');
        if ($url == "/electrophysiology_uploader/#upload") {
            $this->safeFindElement(
                WebDriverBy::ID("tab-upload")
            )->click();
        }

        foreach ($uis as $ui ) {
            $text = $this->safeFindElement(
                WebDriverBy::cssSelector($ui['selector'])
            )->getText();
            $this->assertStringContainsString($ui['label'], $text);
        }
    }
}

