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

                                 'CandID'                 => '#imaging_filter>div>'.
                           'div:nth-child(1) > div > label',
                                 'PSCID'                  => '#imaging_filter>div>'.
                           ' div:nth-child(2) > div > label',
                                 'Visit Label'            => '#imaging_filter>div'.
                           ' > div:nth-child(3) > div > label',
                                 'Logs to display'        => '#log_panel>div>form>'.
                           'div> div:nth-child(1) > div > label',
          // expected_headers
                                 'No.'                    => '#dynamictable > thead',
                                 'UploadID'               => '#dynamictable > thead',
                                 'Progress'               => '#dynamictable > thead',
                                 'CandID'                 => '#dynamictable > thead',
                                 'PSCID'                  => '#dynamictable > thead',
                                 'Visit Label'            => '#dynamictable > thead',
                                 'UploadLocation'         => '#dynamictable > thead',
                                 'UploadDate'             => '#dynamictable > thead',
                                 'UploadedBy'             => '#dynamictable > thead',
                                 'Tarchive Info'          => '#dynamictable > thead',
                                 'Number Of MincCreated'  => '#dynamictable > thead',
                                 'Number Of MincInserted' => '#dynamictable > thead',
                                );
    // expect UIs for Upload Tab
    private $_loadingUploadUI = array(
                                 'Upload an imaging scan' => '#upload>div>div>h3',
                                 'Phantom Scans'          => '#upload > div > div >'.
                                 ' form > div > div:nth-child(1) > div > label',
                                 'CandID'                 => '#upload > div > div >'.
                                 ' form > div > div:nth-child(2) > div > label',
                                 'PSCID'                  => '#upload > div > div >'.
                                 'form > div > div:nth-child(3) > div > label',
                                 'Visit Label'            => '#upload > div > div >'.
                                 ' form > div > div:nth-child(4) > div > label',
                                 'File to Upload'         => '#upload > div > div >'.
                                 ' form > div > div:nth-child(5) > div > label',
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
      * @param string $ui  UI elements in each Tabs.
      *
      * @return void
      */
    function _testPageUIs($url,$ui)
    {

            $this->safeGet($this->url . '/imaging_uploader/');
        if ($url == "/imaging_uploader/#upload") {
            $this->webDriver->findElement(
                WebDriverBy::ID("tab-upload")
            )->click();
        }

        foreach ($ui as $label => $selector) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$selector').textContent"
            );
            $this->assertContains($label, $text);
        }
    }
}
?>
