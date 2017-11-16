<?php
/**
 * Imaging Browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Imaging Browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ImagingBrowserTestIntegrationTest extends LorisIntegrationTest
{

    /**
     * Tests that, when loading the imaging_browser module, some
     * text appears in the body.
     *
     * @return void
     */
    function testImagingBrowserDoespageLoad()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Browser", $breadcrumbText);
    }

    /******** A ********/

    /**
     * Step 1
     * Tests that the imaging_browser module loads with "view_site"
     * and "view_allsites" permissions
     *
     * @return void
     */
    function testImagingBrowserDoespageLoadWithoutPermissions()
    {
        // Without permissions
        $this->setupPermissions(array(''));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $errorText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "You do not have access to this page.",
            $errorText
        );

    }
    /**
     * Tests that the imaging_browser module loads with
     * "imaging_browser_phantom_ownsite" permissions
     *
     * @return void
     */
    function testImagingBrowserDoespageLoadWithPermissionsSite()
    {
        // With permission imaging_browser_phantom_ownsite
        $this->setupPermissions(array('imaging_browser_phantom_ownsite'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Browser", $breadcrumbText);
    }
    /**
     * Tests that the imaging_browser module loads with
     * "imaging_browser_view_allsites" permissions
     *
     * @return void
     */
    function testImagingBrowserDoespageLoadWithPermissionsAllSites()
    {
        // With permission imaging_browser_view_allsites
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Browser", $breadcrumbText);
    }
    /**
     * Tests that the imaging_browser module loads with
     * "maging_browser_phantom_allsites" permissions
     *
     * @return void
     */
    function testImagingBrowserDoespageLoadWithPermissionsPhontomAllSites()
    {
        // With permission imaging_browser_phantom_allsites
        $this->setupPermissions(array('imaging_browser_phantom_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Browser", $breadcrumbText);
    }

    /**
     * Step 2
     * Tests that users can see only own site datasets if permission
     * is "view_onsite" and all data sets if "view_allsites" permissions
     *
     * @return void
    */
    function testImagingBrowserViewDatasetDependingOnPermissions()
    {
        // With permission imaging_browser_view_site: 0 subjects found from DCC site
        $this->setupPermissions(array('imaging_browser_view_site'));
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $value = "#datatable > div > div.table-header.panel-heading > div > div";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("3 rows displayed", $text);

        // With permission imaging_browser_view_allsites:
        // 2 subjects with imaging data found
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $value = "#datatable > div > div.table-header.panel-heading > div > div";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("20 rows displayed of 22", $text);
    }

    /**
     * Step 3a & 4 combined
     * Tests that Filters (tested for PSCID here)
     * and that Show Data and Clear Form work
     *
     * @return void
    */
    function testImagingBrowserFiltersAndShowClearButtons()
    {
        // Testing for PSCID
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $PSCIDOptions = $this->webDriver->findElement(
            WebDriverBy::Name("pscid")
        );
        $PSCIDOptions ->sendKeys("MTL002");

        $ShowData = $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "div.col-sm-2:nth-child(3) > input:nth-child(1)"
            )
        );
        $ShowData->click();

        $value = "#datatable > div > div.table-header.panel-heading > div > div";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("1 rows displayed of 1", $text);

        // Now reset using clear button and confirm site
        // set back to all and 2 subjects found
        $ClearForm = $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "div.col-sm-2:nth-child(4) > input:nth-child(1)"
            )
        );
        $ClearForm->click();

        $PSCIDCleared = $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "div.row:nth-child(1) > div:nth-child(1) > " .
                "div:nth-child(2) > input:nth-child(1)"
            )
        )->getText();
        $this->assertEquals("", $PSCIDCleared);

        $ShowData = $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "div.col-sm-2:nth-child(3) > input:nth-child(1)"
            )
        );
        $ShowData->click();
        $value = "#datatable > div > div.table-header.panel-heading > div > div";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("20 rows displayed of 22", $text);

    }

    /**
     * Step 3b
     * Tests that the Site field is populate with own site if permission
     * is "view_onsite" and "All" if "view_allsites" permissions
     *
     * @return void
     */
    function testImagingBrowserSiteDependingOnPermissions()
    {
        // With permission imaging_browser_view_site
        $this->setupPermissions(array('imaging_browser_phantom_ownsite'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
                $bodyText       = $this->webDriver->findElement(
                    WebDriverBy::cssSelector("body")
                )->getText();
                $SiteFilterText = $this->webDriver->findElement(
                    WebDriverBy::Name("SiteID")
                )->getText();
                $this->assertContains("All User Sites", $SiteFilterText);

                // With permission imaging_browser_view_allsites
                $this->setupPermissions(array('imaging_browser_view_allsites'));
                $this->webDriver->navigate()->refresh();
                $this->safeGet(
                    $this->url . "/imaging_browser/"
                );

                $SiteFilterText = $this->webDriver->findElement(
                    WebDriverBy::Name("SiteID")
                )->getText();
                $this->assertContains("All", $SiteFilterText);
    }

    /**
     * Step 5
     * Tests that column headers are sortable: Will check PSCID only
     *
     * @return void
     */
    function testImagingBrowserSortableByTableHeader()
    {
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // Location of No. element in react table
        $noLocation = "#dynamictable > thead > tr > th:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$noLocation').click()"
        );
        $value = "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(1)";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("22", $text);

    }

    /**
     * Step 6
     * Tests that links to native work
     *
     * @return void
    */
    function testViewSessionLinksNative()
    {
        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) >".
                 " td:nth-child(11) > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        sleep(1);
        $bodyText = $this->webDriver->getPageSource();
        $value    = "#bc2 > a:nth-child(3) > div";
        $text     = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("View Session", $text);
        // Selected link tested in the next test
    }

    /******** B ********/

    /**
     * Steps 1 & 2
     * Tests that the links on the sidebar work
     * in 3 functions for the 3 headers: Navigation, Links, VolumeViewer
     *
     * @return void
     */
    function testViewSessionNavigation()
    {

        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // Go to first item in the imaging browser list of candidates
        // to view buttons: Back to List and Next, then we can check Prev

        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) >".
                 " td:nth-child(11) > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        //click Next Button
        $this->safeClick(
            WebDriverBy::cssSelector(
                '#sidebar-content > ul:nth-child(2) > a > span'
            )
        );

        // checking Previous Button exists
        $value = "#sidebar-content > ul:nth-child(2) > li:nth-child(2) >".
                 " a:nth-child(1) > span";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("Previous", $text);

        //click Previous Button
        $value = "#sidebar-content > ul:nth-child(2) > li:nth-child(2) >".
                 " a:nth-child(1) > span > span";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        // checking Next Button exists
        $value = "#sidebar-content > ul:nth-child(2) > a > span";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("Next", $text);
        //click Back to list Button
        $value = "#sidebar-content > ul:nth-child(2) > li > a > span";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        sleep(1);
        $bodyText = $this->webDriver->getPageSource();
        $value    = "#bc2 > a:nth-child(2) > div";
        $text     = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains(" Imaging  Browser", $text);
    }

    /**
     * Tests the links under "Links"
     *
     * @return void
     */
    function testViewSessionLinks()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) >".
                 " td:nth-child(11) > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        $value = "#sidebar-content > ul:nth-child(7) > li > a";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("Radiology Review", $text);
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("radiology_review", $bodyText);
    }

    /**
     * Tests that Volume Viewer buttons work
     *
     * @return void
     */
    function testViewSessionVolumeViewer()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) >".
                 " td:nth-child(11) > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
         $this->safeFindElement(
             WebDriverBy::cssSelector(
                 "#image-2 > div > div >".
                 " div.panel-heading.clearfix > input"
             )
         )->click();
         sleep(1);
         $this->safeFindElement(
             WebDriverBy::ID("bbonly")
         )->click();
         sleep(1);
         $window    = $this->webDriver->getWindowHandles();
         $newWindow = $this->webDriver->switchTo()->window($window[1]);
         //breadcrumbs contains "Brainbrowser"
         $value = "#bc2 > a:nth-child(2) > div";
         $text  = $newWindow->executescript(
             "return document.querySelector('$value').textContent"
         );
         $this->assertContains(" Brainbrowser", $text);
    }

    /**
     * Steps 3 through 7
     * Visit level feedback
     *
     * @return void
    */
    function testViewSessionVisitLevelFeedback()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) >".
                 " td:nth-child(11) > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        //click Vist Level Feedback
        $value      = "#sidebar-content > div.visit-level-feedback > a";
        $oldWindows = $this->webDriver->getWindowHandle();
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        $window    = $this->webDriver->getWindowHandles();
        $newWindow = $this->webDriver->switchTo()->window($window[1]);
        $value     = "body > div > form > textarea";
        $newWindow->executescript(
            "document.querySelector('$value').value='test feedback'"
        );

        $newWindow->findElement(
            WebDriverBy::name("fire_away")
        )->click();
        //click close window button
        $newWindow->findElement(
            WebDriverBy::cssSelector("body > p > a")
        )->click();
        $value = "#sidebar-content > div.visit-level-feedback > a";
        $this->webDriver->switchTo()->window($oldWindows)->executescript(
            "document.querySelector('$value').click()"
        );
        //click Vist Level Feedback
        $value = "#sidebar-content > div.visit-level-feedback > a";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        $window    = $this->webDriver->getWindowHandles();
        $newWindow = $this->webDriver->switchTo()->window($window[1]);
        $value     = "body > div > form > textarea";
        $text      = $newWindow->executescript(
            "return document.querySelector('$value').value"
        );
        $this->assertContains("test feedback", $text);

    }

    /**
     * Step 8
     * Tests Breadcrumb back to imaging browser
     *
     * @return void
    */
    function testViewSessionBreadCrumb()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) >".
                 " td:nth-child(11) > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        sleep(1);
        $body  = $this->webDriver->getPageSource();
        $value = "#bc2 > a:nth-child(2) > div";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        sleep(1);
        $body = $this->webDriver->getPageSource();
        //var_dump($body);
        $value           = "#lorisworkspace > div.row > div >".
                           " div > div.panel-heading";
        $SelectionFilter = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("Selection Filter", $SelectionFilter);
    }

    /******** C ********/

    /**
     * Step 1
     * Scan-Level QC Flags viewable and editabled depending on permission
     *
     * @return void
    */
    function testScanLevelQCFlags()
    {
        // select elements location by selector
        $QC_Status       = "#sidebar-content > div.div-controlpanel-bottom >".
                     " div > select:nth-child(2)";
        $QC_Pending      = "#sidebar-content > div.div-controlpanel-bottom >".
                     " div > select:nth-child(5)";
        $visit_caveat    = "#sidebar-content > div.div-controlpanel-bottom >".
                     " div > select:nth-child(8)";
        $QC_Status_panel = "#image-2 > div > div > div.panel-body >".
                     " div:nth-child(1)".
                     ">div.col-xs-3.mri-right-panel>div > div:nth-child(1) > select";
        $Selected        ="#image-2 > div > div > div.panel-body > div:nth-child(1)".
                     " >div.col-xs-3.mri-right-panel >div>div:nth-child(2)>select";
        $SNR = "#image-2 > div > div > div.panel-body > div:nth-child(1) >".
                 " div.col-xs-3.mri-right-panel > div > div:nth-child(3) > select";

        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click selected link
        $value = "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(11)".
                 " > a:nth-child(2)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        sleep(1);
        $this->_testQCpanelWithValues($QC_Status, "Pass");
        $this->_testQCpanelWithValues($QC_Status, "Fail");
        $this->_testQCpanelWithValues($QC_Status, "Unrated");
        $this->_testQCpanelWithValues($QC_Pending, "Y");
        $this->_testQCpanelWithValues($QC_Pending, "N");
        $this->_testQCpanelWithValues($visit_caveat, "false");
        $this->_testQCpanelWithValues($visit_caveat, "true");
        $this->_testQCpanelWithValues($SNR, "0");
        $this->_testQCpanelWithValues($SNR, "1");
        sleep(1);
        $this->_testQCpanelWithValues($QC_Status_panel, "Fail");
        $this->_testQCpanelWithValues($QC_Status_panel, "Pass");
        $this->_testQCpanelWithValues($Selected, "true");
        $this->_testQCpanelWithValues($Selected, "false");
        $this->_testQCpanelWithValues($Selected, "");

    }
    /**
     * Check the link of Caveat
     *
     * @return void
    */
    function testCaveatLink()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(11)".
                 " > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        sleep(1);
        $bodyText = $this->webDriver->getPageSource();
        var_dump($bodyText);
        print_r("===================================");
        // test Caveat link
        $link = "#image-2 > div > div > div.panel-body > div:nth-child(1)>".
                " div.col-xs-3.mri-right-panel > div > div:nth-child(3) > label > a";
        $this->webDriver->executescript(
            "document.querySelector('$link').click()"
        );
        sleep(1);
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains(" Mri  Violations", $bodyText);

    }
    /**
     * This function could help testing data and ui
     *
     * @param string $ui   the ui selector location
     * @param string $data the testing data
     *
     * @return void
    */
    function _testQCpanelWithValues($ui,$data)
    {
        $this->webDriver->executescript(
            "document.querySelector('$ui').value='$data'"
        );
        //click save button
        $this->webDriver->executescript(
            "document.querySelector('#sidebar-content >".
             " div.div-controlpanel-bottom > div > input').click()"
        );
        sleep(1);
        $body = $this->webDriver->getPageSource();
        $text = $this->webDriver->executescript(
            "return document.querySelector('$ui').value"
        );
        $this->assertEquals("$data", $text);
    }
    /**
     * Step 5
     * Link to comments launches window
     * Input test data into launches window
     *
     * @return void
    */
    function testCommentsWindowLaunchAndEditable()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        // click native link
        $value = "#dynamictable > tbody > tr:nth-child(1) >".
                 " td:nth-child(11) > a:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        $oldWindow = $this->webDriver->getWindowHandle();
        // click QC Comments button
        $value = "#image-2 > div > div > div.panel-body > div.row.mri-second".
              "-row-panel.col-xs-12 > a:nth-child(1) > span > span.hidden-xs";
        $this->webDriver->executescript(
            "document.querySelector('$value').click()"
        );
        $window    = $this->webDriver->getWindowHandles();
        $newWindow = $this->webDriver->switchTo()->window($window[1]);
        //Inputing test data into QC comment panel "Geometric distortion" with 'Good'
        $value1 = "body > div > form > h3:nth-child(1) > select";
        $newWindow->executescript(
            "document.querySelector('$value1').value='Good'"
        );
        //click save button
        $newWindow->findElement(
            WebDriverBy::Name("fire_away")
        )->click();
        //        $newWindow->executescript(
        //            "document.querySelector('$save').click()"
        //        );
        // click close this window button
        $value = "body > p > a";
        $newWindow->executescript(
            "document.querySelector('$value').click()"
        );
        // click QC comment button again
        $value = ".mri-second-row-panel > a:nth-child(1) > span:nth-child(1)".
                 " > span:nth-child(2)";
        $this->webDriver->switchTo()->window($oldWindow)->executescript(
            "document.querySelector('$value').click()"
        );

        // check the result
        $window    = $this->webDriver->getWindowHandles();
        $newWindow = $this->webDriver->switchTo()->window($window[1]);
        $select    = $newWindow->findElement(
            WebDriverBy::Xpath("/html/body/div/form/h3[1]/select/option[2]")
        )->getAttribute("selected");

        $this->assertEquals("true", $select);
    }

}
?>
