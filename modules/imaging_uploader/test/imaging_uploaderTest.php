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
    private $_loadingBrowseUI = array(
        array(
            "label"    => "CandID",
            "selector" => "#imaging_filter>div",
        ),
        array(
            "label"    => "PSCID",
            "selector" => "#imaging_filter>div",
        ),
        array(
            "label"    => "Visit Label",
            "selector" => "#imaging_filter>div",
        ),
        array(
            "label"    => "Logs to display",
            "selector" => "#log_panel>div>form>div",
        ),
                                 // expected_headers
        array(
            "label"    => "No.",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "UploadID",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "Progress",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "CandID",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "PSCID",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "Visit Label",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "UploadLocation",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "UploadDate",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "UploadedBy",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "Tarchive Info",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "Number Of MincCreated",
            "selector" => "#dynamictable > thead",
        ),
        array(
            "label"    => "Number Of MincInserted",
            "selector" => "#dynamictable > thead",
        ),
    );
    // expect UIs for Upload Tab
    private $_loadingUploadUI = array(
        array(
            "label"    => "Upload an imaging scan",
            "selector" => "#upload",
        ),
        array(
            "label"    => "Phantom Scans",
            "selector" => "#upload",
        ),
        array(
            "label"    => "CandID",
            "selector" => "#upload",
        ),
        array(
            "label"    => "PSCID",
            "selector" => "#upload",
        ),
        array(
            "label"    => "Visit Label",
            "selector" => "#upload",
        ),
        array(
            "label"    => "File to Upload",
            "selector" => "#upload",
        ),
    );

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
        $this->setupPermissions(array(""));
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
        $this->setupPermissions(array("imaging_uploader"));
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

