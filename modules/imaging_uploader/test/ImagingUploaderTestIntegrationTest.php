<?php declare(strict_types=1);

/**
 * Imaging_uploader automated integration tests
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
 * Imaging_uploader automated integration tests
 *
 * PHP Version 8
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
            "label"    => "DCCID",
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
            "label"    => "Upload ID",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Progress",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "DCCID",
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
            "label"    => "Upload Location",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Upload Date",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Uploaded By",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Tarchive Info",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Number Of Files Created",
            "selector" => "#dynamictable > thead",
        ],
        [
            "label"    => "Number Of Files Inserted",
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
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#breadcrumbs")
        )->getText();
        $this->assertStringContainsString(
            "Imaging Upload",
            $bodyText
        );
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
     * Tests that, when loading the Imaging_uploader module without permission,
     * "You do not have access to this page." appears in the body.
     *
     * @return void
     */
    function testImagingUploaderLoadWithoutPermission()
    {
        $this->setupPermissions([""]);
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
    }

    /**
     * Tests that, when loading the Imaging_uploader module with permission,
     * "You do not have access to this page." not appears in the body.
     *
     * @return void
     */
    function testImagingUploaderLoadWithPermission()
    {
        $this->setupPermissions(["imaging_uploader_allsites"]);
        $this->safeGet($this->url . '/imaging_uploader/');
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
     * Tests that, inputing some data into filter,then clicking the
     * [clear form] button, make sure that all of filter form should be
     * empty.
     *
     * @return void
     */
    function testImagingUploaderFilterClearForm()
    {
        $this->safeGet($this->url . '/imaging_uploader/');

        $this->safeFindElement(
            WebDriverBy::name("candID")
        )->sendKeys("test");

        $this->safeFindElement(
            WebDriverBy::name("pSCID")
        )->sendKeys("test");

        $this->webDriver->navigate()->refresh();

        $bodyText1 = $this->safeFindElement(
            WebDriverBy::name("candID")
        )->getText();
        $bodyText2 = $this->safeFindElement(
            WebDriverBy::name("pSCID")
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
        $this->safeGet($this->url . '/imaging_uploader/');
        if ($url == "/imaging_uploader/#upload") {
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

