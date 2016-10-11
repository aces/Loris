<?php
/**
 * Mri_violations automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class MriViolationsTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Insert testing data
     *
     * @return void
     */     
    public function setUp()
    {
        parent::setUp();
         $window = new WebDriverWindow($this->webDriver);
         $size = new WebDriverDimension(1024,768);
         $window->setSize($size);
        $this->DB->insert(
            "psc",
            array(
             'CenterID' => '55',
             'Name' => 'TESTinPSC',
             'Alias' => 'tst',
             'MRI_alias' => 'test'
            )

        );
        $this->DB->insert(
            "candidate",
            array(
             'CandID'        => '999888',
             'CenterID'      => '55',
             'UserID'        => '1',
             'PSCID'         => '8888',
             'ProjectID'     => '7777'
            )
        );
        $this->DB->insert(
            "session",
            array(
             'CandID'        => '999888',
             'CenterID'      => '55',
             'UserID'        => '1',
             'MRIQCStatus'   => 'Pass',
             'SubprojectID'  => '6666'
            )
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
             'ID'            => '1001',
             'CandID'        => '999888',
             'PatientName'   => '[Test]PatientName',
             'time_run'      => '2009-06-29 04:00:44',
             'minc_location' => 'assembly/test/test/mri/test/test.mnc',
        'series_description' => 'Test Series Description',
                 'SeriesUID' => '5555'
            )
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
             'ID'            => '1002',
             'CandID'        => '999888',
             'PatientName'   => '[Test]PatientName',
             'time_run'      => '2008-06-29 04:00:44',
             'minc_location' => 'assembly/test2/test2/mri/test2/test2.mnc',
        'series_description' => 'Test Series Description',
                 'SeriesUID' => '5556'
            )
        );        
        $this->DB->insert(
            "violations_resolved",
            array(
             'ExtID'         => '1001',
             'hash'          => 'not null value',
             'TypeTable'     => 'mri_protocol_violated_scans',
             'Resolved'      => 'other'
            )
        );
        $this->DB->insert(
            "violations_resolved",
            array(
             'ExtID'         => '1002',
             'hash'          => 'not null value',
             'TypeTable'     => 'MRICandidateErrors',
             'Resolved'      => 'unresolved'
            )
        );
        $this->DB->insert(
            "MRICandidateErrors",
            array(
             'ID'         => '1002',
             'PatientName'      => '[Test]PatientName',
             'MincFile'       => 'assembly/test2/test2/mri/test2/test2.mnc',
             'SeriesUID'      => '5556'
            )
        );

    }
    //Delete the test data
    public function tearDown()
    {

        $this->DB->delete(
            "session",
            array('CandID' => '999888','CenterID' => '55')
        );
        $this->DB->delete(
            "candidate",
            array('CandID' => '999888','CenterID' => '55')
        );
        $this->DB->delete(
            "mri_protocol_violated_scans",
           array(
             'ID'            => '1001',
             'CandID'        => '999888'
            )
        );
        $this->DB->delete(
            "mri_protocol_violated_scans",
           array(
             'ID'            => '1002',
             'CandID'        => '999888'
            )
        );
        $this->DB->delete(
            "violations_resolved",
            array(
             'ExtID'         => '1001',
             'TypeTable'     => 'mri_protocol_violated_scans'
            )
        );
        $this->DB->delete(
            "MRICandidateErrors",
            array(
             'ID'         => '1002'
            )
        );
        $this->DB->delete(
            "violations_resolved",
            array(
             'ExtID'         => '1002',
             'TypeTable'     => 'mri_protocol_violated_scans'
            )
        );
        $this->DB->delete(
            "psc",
            array('CenterID' => '55', 'Name' => 'TESTinPSC')
        );
        parent::tearDown();
    }
    /**
     * Tests that, when loading the Mri_violations module, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriViolationsDoesPageLoad()
    {
        $this->safeGet($this->url . "/mri_violations/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
              ->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }
    /**
     * Tests that, when loading the Mri_violations module > mri_protocol_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolViolationsDoesPageLoad()
    {
        $this->safeGet($this->url . "/mri_violations/?submenu=mri_protocol_violations");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
              ->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }

    /**
     * Tests that, when loading the Mri_violations module > 
     * mri_protocol_check_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolCheckViolationsDoesPageLoad()
    {
        $this->safeGet($this->url . "/mri_violations/?submenu=mri_protocol_check_violations");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }

   /**
     *Tests landing the mri violation whit the permission 'violated_scans_view_allsites'
     *
     * @return void
     */
    function testLoginWithPermission()
    {
         $this->setupPermissions(array("violated_scans_view_allsites"));
         $this->safeGet($this->url . "/mri_violations/");
         $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertNotContains("You do not have access to this page.", $bodyText);
          $this->resetPermissions();
     }
   /**
     *Tests anding the mri violation whitout the permission
     *
     * @return void
     */
    function testLoginWithoutPermission()
    {
         $this->setupPermissions(array(""));
         $this->safeGet($this->url . "/mri_violations/");
         $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertContains("You do not have access to this page.", $bodyText);
          $this->resetPermissions();
    }


    /**
     * Tests landing the sub page which named resolved violations
     *
     * @return void
     */
    function testResolvedsubmenu()
    {
        $this->safeGet($this->url . "/mri_violations/?submenu=resolved_violations");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector
                ("#tabs > ul > li.statsTab.active > a"))->getText();
        $this->assertContains("Resolved", $bodyText);
    }
    /**
     * Tests clear button in the filter section, input some data, then click the clear button,
     * all of data in the filter section will be gone. 
     *
     * @return void
     */
    function testResolvedClearButton()
    {
        //testing the Patient Name
        $this->safeGet($this->url . "/mri_violations/?submenu=resolved_violations");
        $this->webDriver->findElement(WebDriverBy::Name("PatientName"))->sendKeys("test");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Name("PatientName"))
               ->getText();
        $this->assertEquals("", $bodyText);

        //testing the Description
        $this->webDriver->findElement(WebDriverBy::Name("Description"))->sendKeys("test");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Name("Description"))
               ->getText();
        $this->assertEquals("", $bodyText);

        //testing the MincFile
        $this->webDriver->findElement(WebDriverBy::Name("Filename"))->sendKeys("test");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Name("Filename"))
               ->getText();
        $this->assertEquals("", $bodyText);

        //testing the Site
        $siteElement =  $this->safeFindElement(WebDriverBy::Name("Site"));
        $site = new WebDriverSelect($siteElement);
        $site->selectByVisibleText("TESTinPSC");
        $this->safeClick(WebDriverBy::Name("reset"));
        $siteElement =  $this->safeFindElement(WebDriverBy::Name("Site"));
        $site = new WebDriverSelect($siteElement);
        $value = $site->getFirstSelectedOption()->getAttribute('value');
        $this->assertEquals("",$value);

        //testing the Series UID
        $this->webDriver->findElement(WebDriverBy::Name("SeriesUID"))->sendKeys
              ("test");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Name("SeriesUID"))
             ->getText();
        $this->assertEquals("", $bodyText);

    }
    /**
     * Tests that, input some data and click search button, check the results.
     *
     * @return void
     */
    function testResolvedSearchButton()
    {
        //testing search by PatientName
        $this->safeGet($this->url . "/mri_violations/?submenu=resolved_violations");
        $this->webDriver->findElement(WebDriverBy::Name("PatientName"))->sendKeys
             ("[Test]PatientName");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . 
                 "/mri_violations/?submenu=resolved_violations&format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("[Test]PatientName", $bodyText);

        //testing search by Filename
        $this->safeGet($this->url . "/mri_violations/?submenu=resolved_violations");
        $this->webDriver->findElement(WebDriverBy::Name("Filename"))
             ->sendKeys("assembly/test/test/mri/test/test.mnc");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . 
                 "/mri_violations/?submenu=resolved_violations&format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("[Test]PatientName", $bodyText);

        //testing search by Description
        $this->safeGet($this->url . "/mri_violations/?submenu=resolved_violations");
        $this->webDriver->findElement(WebDriverBy::Name("Description"))->sendKeys
             ("Test Series Description");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . 
                 "/mri_violations/?submenu=resolved_violations&format=json");
        $bodyText = $this->webDriver->getPageSource();        
        $this->assertContains("[Test]PatientName", $bodyText);

        //testing search by site
        $this->safeGet($this->url . "/mri_violations/?submenu=resolved_violations");
        $siteElement =  $this->safeFindElement(WebDriverBy::Name("Site"));
        $site = new WebDriverSelect($siteElement);
        $site->selectByVisibleText("TESTinPSC");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . 
                 "/mri_violations/?submenu=resolved_violations&format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("[Test]PatientName", $bodyText);

        //testing search by Description
        $this->safeGet($this->url . "/mri_violations/?submenu=resolved_violations");
        $this->webDriver->findElement(WebDriverBy::Name("SeriesUID"))->sendKeys("5555");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $this->safeGet($this->url . 
                 "/mri_violations/?submenu=resolved_violations&format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("[Test]PatientName", $bodyText);
    }

    /**
     * Tests that, input some data and click search button, check the results.
     *
     * @return void
     */
    function testNotResolvedSearchButton()
    {
        //testing search by PatientName
        $this->safeGet($this->url . "/mri_violations/");
        $this->webDriver->findElement(WebDriverBy::Name("PatientName"))->sendKeys
             ("[Test]PatientName");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Xpath(
             "//*[@id='violationsTable']/tbody/tr[1]/td[2]")
         )->getText();
        $this->assertEquals("[Test]PatientName", $bodyText);

        //testing search by Filename
        $this->webDriver->findElement(WebDriverBy::Name("Filename"))
             ->sendKeys("assembly/test2/test2/mri/test2/test2.mnc");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Xpath(
             "//*[@id='violationsTable']/tbody/tr[1]/td[2]")
         )->getText();
        $this->assertEquals("[Test]PatientName", $bodyText);

        //testing search by Description
        $this->webDriver->findElement(WebDriverBy::Name("Description"))->sendKeys
                ("Test Series Description");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Xpath(
             "//*[@id='violationsTable']/tbody/tr[1]/td[2]")
         )->getText();
        $this->assertEquals("[Test]PatientName", $bodyText);

        //testing search by site
        $siteElement =  $this->safeFindElement(WebDriverBy::Name("Site"));
        $site = new WebDriverSelect($siteElement);
        $site->selectByVisibleText("TESTinPSC");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Xpath(
             "//*[@id='violationsTable']/tbody/tr[1]/td[2]")
         )->getText();
        $this->assertEquals("[Test]PatientName", $bodyText);

        //testing search by Description
        $this->webDriver->findElement(WebDriverBy::Name("SeriesUID"))->sendKeys("5556");
        $this->webDriver->findElement(WebDriverBy::Name("filter"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::Xpath(
             "//*[@id='violationsTable']/tbody/tr[1]/td[2]")
         )->getText();
        $this->assertEquals("[Test]PatientName", $bodyText);
    }
    /**
     * Tests that,in the not resolved menu, change the Resolution status of the first row.
     * Save it and check it. 
     *
     * @return void
     */
    function testNotResolvedSaveButton()
    {

        $this->safeGet($this->url . "/mri_violations/");
        $resolutionElement =  $this->safeFindElement(WebDriverBy::Name
               ("resolvable[c57b919a921eaa1a43bb5e0c44cd4226]"));
        $resolution = new WebDriverSelect($resolutionElement);
        $resolution->selectByVisibleText("Inserted");
        $this->safeClick(WebDriverBy::Name("fire_away"));

        $resolutionElement = $this->safeFindElement(WebDriverBy::Name
               ("resolvable[c57b919a921eaa1a43bb5e0c44cd4226]"));
        $resolution = new WebDriverSelect($resolutionElement);

        $value = $resolution->getFirstSelectedOption()->getAttribute('value');
        $this->assertEquals("inserted",$value);
    }
}
?>
