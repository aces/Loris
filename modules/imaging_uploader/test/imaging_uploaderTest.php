<?php
/**
 * Imaging_uploader automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ .
      "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Imaging_uploader automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ImagingUploaderTestIntegrationTest extends LorisIntegrationTest
{
    // expect UIs for Browse Tab
    private $_loadingBrowseUI = [
        [
            "label"    => "CandID",
            "selector" => "#imaging_filter>div",
        ],
        [
            "label"    => "PSCID",
            "selector" => "#imaging_filter>div",
        ],
        [
            "label"    => "Visit Label",
            "selector" => "#imaging_filter>div",
        ],
        [
            "label"    => "Logs to display",
            "selector" => "#log_panel>div>form>div",
        ],
                                 // expected_headers
        [
            "label"    => "No.",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "UploadID",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Progress",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "CandID",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "PSCID",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Visit Label",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "UploadLocation",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "UploadDate",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "UploadedBy",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Tarchive Info",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Number Of MincCreated",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Number Of MincInserted",
            "selector" => "#dynamictable > thead",
        ],
    ];
    // expect UIs for Upload Tab
    private $_loadingUploadUI = [
        [
            "label"    => "Upload an imaging scan",
            "selector" => "#upload",
        ],
        [
            "label"    => "Phantom Scans",
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
        [
            "label"    => "File to Upload",
            "selector" => "#upload",
        ],
    ];

    /**
     * Tests that, when loading the Imaging_uploader module, some
     * text appears in the body.
     *
     * @return void
     */
    function testImagingUploaderDoespageLoad()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Upload", $bodyText);
    }
    /**
     * Tests that, when loading the Imaging_uploader module without permission,
     * "You do not have access to this page." appears in the body.
     *
     * @return void
     */
    function testImagingUploaderLoadWithoutPermission()
    {
        $this->setupPermissions([""]);
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
    }
    /**
     * Tests that, when loading the Imaging_uploader module with permission,
     * "You do not have access to this page." not appears in the body.
     *
     * @return void
     */
    function testImagingUploaderLoadWithPermission()
    {
        $this->setupPermissions(["imaging_uploader"]);
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, inputing some data into filter,then clicking the
     * [clear form] button, make sure that all of filter form should be
     * empty.
     *
     * @return void
     */
    function testImagingUploaderFilterClearForm()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");

        $this->safeGet($this->url . '/imaging_uploader/');

        $this->webDriver->findElement(
            WebDriverBy::name("CandID")
        )->sendKeys("test");

        $this->webDriver->findElement(
            WebDriverBy::name("PSCID")
        )->sendKeys("test");

        $this->webDriver->findElement(
            WebDriverBy::name("reset")
        )->click();

        $bodyText1 = $this->webDriver->findElement(
            WebDriverBy::name("CandID")
        )->getText();
        $bodyText2 = $this->webDriver->findElement(
            WebDriverBy::name("PSCID")
        )->getText();

         $this->assertEquals('', $bodyText1);
         $this->assertEquals('', $bodyText2);
    }
    /**
     * This function could test UI elements in each Tabs.
     *
     * @return void
     */
    function testLoadingUIS()
    {
        $this->_testPageUIs("/imaging_uploader/", $this->_loadingBrowseUI);
        // click upload tab
        $this->_testPageUIs("/imaging_uploader/#upload", $this->_loadingUploadUI);
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
            $this->markTestSkipped("This method isn't working properly on travis.");
            $this->safeGet($this->url . '/imaging_uploader/');
        if ($url == "/imaging_uploader/#upload") {
            $this->webDriver->findElement(
                WebDriverBy::ID("tab-upload")
            )->click();
        }

        foreach ($uis as $ui ) {
            $location = $ui['selector'];
            $text     = $this->webDriver->executescript(
                "return document.querySelector('$location').textContent"
            );
            $this->assertContains($ui['label'], $text);
        }
    }
}

