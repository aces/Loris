<?php
/**
 * imaging_browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ 
	. "/../../../test/integrationtests/LorisIntegrationTest.class.inc";


class imagingBrowserTestIntegrationTest extends LorisIntegrationTest
{

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in, and creating a candidate
     * with a session
     *
     * @return none
     */

   public function setUp()
    {

        parent::setUp();

        // Create tests-specific data

        $this->DB->insert("psc", array(
            'CenterID' => '253',
            'Name'  => 'Test Site AOL',
            'Alias' => 'AOL',
            'MRI_alias' => 'Y',
        ));

        $this->DB->insert("psc", array(
            'CenterID' => '254',
            'Name'  => 'Test Site BOL',
            'Alias' => 'BOL',
            'MRI_alias' => 'Y',
        ));


        // Create test-specific data
        $this->DB->insert("candidate", array(
            'CandID' => '000001',
            'PSCID'  => 'DCC0001',
            'CenterID' => 1,
            'Active' => 'Y',
            'Entity_type' => 'Human',
        ));

        $this->DB->insert("candidate", array(
            'CandID' => '000002',
            'PSCID'  => 'AOL0002',
            'CenterID' => 253,
            'Active' => 'Y',
            'Entity_type' => 'Human',
        ));

        $this->DB->insert("candidate", array(
            'CandID' => 000003,
            'PSCID'  => 'BOL0003',
            'CenterID' => 254,
            'Active' => 'Y',
            'Entity_type' => 'Human',
        ));

        $this->DB->insert('session', array(
            'ID' => 999997,
            'CandID' => 000001,
            'Visit_label' => 'Test0',
            'CenterID' => 1,
            'Scan_done' => 'Y',
            'Current_stage' => 'Visit',
            'Visit' => 'In Progress',
        ));

        $this->DB->insert('session', array(
            'ID' => 999998,
            'CandID' => 000002,
            'Visit_label' => 'Test1',
            'CenterID' => 253,
            'Scan_done' => 'Y',
            'Current_stage' => 'Visit',
            'Visit' => 'In Progress',
        ));

        $this->DB->insert('session', array(
            'ID' => 999999,
            'CandID' => 000003,
            'Visit_label' => 'Test2',
            'CenterID' => 254,
            'Scan_done' => 'Y',
            'Current_stage' => 'Visit',
            'Visit' => 'In Progress',
        ));

        // Add imaging data

        $this->DB->insert('mri_processing_protocol', array(
             'ProcessProtocolID' => 1,
             'ProtocolFile' => 'None1',
             'FileType' => NULL,
             'Tool' => 'None1',
             'InsertTime' => 0,
             'md5sum' => NULL,
        ));

        $this->DB->insert('mri_processing_protocol', array(
             'ProcessProtocolID' => 2,
             'ProtocolFile' => 'None2',
             'FileType' => NULL,
             'Tool' => 'None2',
             'InsertTime' => 0,
             'md5sum' => NULL,
        ));


        $this->DB->insert('files', array(
             'FileID' => 1,
             'SessionID' => 999998,
             'File' => 'assembly/506145/V1/mri/native/loris-MRI_506145_V1_t2_001.mnc',
             'SeriesUID'=> '1.3.12.2.1107.5.2.32.35049.2014021711090977356751313.0.0.0',
             'EchoTime' => 0.011,
             'CoordinateSpace' => 'native',
             'OutputType' => 'native',
             'AcquisitionProtocolID' => 45,
             'FileType' => 'mnc',
             'PendingStaging' => 0,
             'InsertedByUserID' => 'lorisadmin',
             'InsertTime' => 1454951768,
             'SourcePipeline' => NULL,
             'PipelineDate' => NULL,
             'SourceFileID' => 1,
             'ProcessProtocolID' => 1,
             'Caveat' => 0,
             'TarchiveSource' => 263,
        ));

        $this->DB->insert('files', array(
             'FileID' => 2,
             'SessionID' => 999999,
             'File' => 'assembly/506145/V1/mri/native/loris-MRI_506145_V1_t1_001.mnc',
             'SeriesUID'=> '1.3.12.2.1107.5.2.32.35049.2014021711090977356751313.0.0.0',
             'EchoTime' => 0.011,
             'CoordinateSpace' => 'native',
             'OutputType' => 'native',
             'AcquisitionProtocolID' => 44,
             'FileType' => 'mnc',
             'PendingStaging' => 0,
             'InsertedByUserID' => 'lorisadmin',
             'InsertTime' => 1454951768,
             'SourcePipeline' => NULL,
             'PipelineDate' => NULL,
             'SourceFileID' => 2,
             'ProcessProtocolID' => 2,
             'Caveat' => 0,
             'TarchiveSource' => 263,
        ));

        $this->DB->insert('parameter_type', array(
             'ParameterTypeID' => 1,
             'Name' => 'Selected',
             'Type' => NULL,
             'Description' => NULL,
             'RangeMin' => NULL,
             'RangeMax' => NULL,
             'SourceField' => NULL,
             'SourceFrom' => NULL,
             'SourceCondition' => NULL,
             'CurrentGUITable' => NULL,
             'Queryable' => 1,
             'IsFile' => 0,
        ));

        $this->DB->insert('parameter_file', array(
             'ParameterFileID' => 10,
             'FileID' => 1,
             'ParameterTypeID' => 1,
             'Value' => 't2',
             'InsertTime' => 0,
        ));


        $this->DB->insert('parameter_file', array(
             'ParameterFileID' => 11,
             'FileID' => 2,
             'ParameterTypeID' => 1,
             'Value' => 't1',
             'InsertTime' => 0,
        ));


	$this->DB->insert('mri_acquisition_dates',array(
	      'SessionID' => 999998,
	      'AcquisitionDate' => '2014-02-17',
        ));

	$this->DB->insert('mri_acquisition_dates',array(
	      'SessionID' => 999999,
	      'AcquisitionDate' => '2014-02-17',
        ));

        $this->DB->insert('files_qcstatus', array(
             'FileQCID' => 1,
             'FileID' => 1,
             'SeriesUID'=> '1.3.12.2.1107.5.2.32.35049.2014021711090977356751313.0.0.0',
             'EchoTime' => 0.011,
	     'QCStatus' => NULL,
	     'QCFirstChangeTime' => 1455040145,
	     'QCLastChangeTime' => 1455040145,
	));

        $this->DB->insert('files_qcstatus', array(
             'FileQCID' => 2,
             'FileID' => 2,
             'SeriesUID'=> '1.3.12.2.1107.5.2.32.35049.2014021711090977356751313.0.0.0',
             'EchoTime' => 0.011,
	     'QCStatus' => NULL,
	     'QCFirstChangeTime' => 1455040145,
	     'QCLastChangeTime' => 1455040145,
	));

    }

    /**
     * Tests that, when loading the imaging_browser module, some
     * text appears in the body.
     *
     * @return void
    function testImagingBrowserDoespageLoad()
    {
        $this->webDriver->get(
	    $this->url . "/imaging_browser/"
	);

        $breadcrumbText = $this->webDriver->findElement(
	    WebDriverBy::cssSelector("body")
	)->getText();
        $this->assertContains("Imaging Browser", $breadcrumbText);
    }
     */

/******** A ********/

    /**
     * Step 1
     * Tests that the imaging_browser module loads with "view_site"
     * and "view_allsites" permissions
     *
     * @return void

    function testImagingBrowserDoespageLoadPermissions()
    {

        // Without permissions
        $this->setupPermissions(array(''));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get(
	    $this->url . "/imaging_browser/");

        $errorText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();

        $this->assertContains(
            "You do not have access to this page.",
            $errorText
        );

        // With permission imaging_browser_view_site
        $this->setupPermissions(array('imaging_browser_view_site'));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Browser", $breadcrumbText);

        // With permission imaging_browser_view_allsites
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Browser", $breadcrumbText);

    }    

    */

    /**
     * Step 2
     * Tests that users can see only own site datasets if permission
     * is "view_onsite" and all data sets if "view_allsites" permissions
     *
     * @return void

    function testImagingBrowserViewDatasetDependingOnPermissions()
    {
        // With permission imaging_browser_view_site
        $this->setupPermissions(array('imaging_browser_view_site'));
        $this->webDriver->navigate()->refresh();

sleep(10);

        // With permission imaging_browser_view_allsites
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
sleep(10);

    }
     */

     


    /**
     * Step 3a: TODO
     * Tests that all filters work
     *
     * @return void
     */

    /**
     * Step 3b
     * Tests that the Site field is populate with own site if permission
     * is "view_onsite" and "All" if "view_allsites" permissions
     *
     * @return void


    function testImagingBrowserSiteDependingOnPermissions()
    {

        // With permission imaging_browser_view_site
        $this->setupPermissions(array('imaging_browser_view_site'));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );
        $SiteTopMenuTextAll = $this->webDriver->findElement(
            WebDriverBy::cssSelector(".navbar-text")
        )->getText();
	$SiteTopMenuText = explode(":", $SiteTopMenuTextAll);


        $SiteFilterText = $this->webDriver->findElement(
            WebDriverBy::Name("SiteID")
        )->getText();
        $this->assertEquals(trim($SiteTopMenuText[1]), $SiteFilterText);

        // With permission imaging_browser_view_allsites
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );
        $SiteTopMenuTextAll = $this->webDriver->findElement(
            WebDriverBy::cssSelector(".navbar-text")
        )->getText();

        $SiteFilterText = $this->webDriver->findElement(
            WebDriverBy::Name("SiteID")
        )->getText();
        $this->assertContains("All", $SiteFilterText);

    }
    */


    /**
     * Step 4: TODO
     * Tests that Clear and Show data Buttons work
     *
     * @return void
     */

    /**
     * Step 5: TODO
     * Tests that column headers are sortable
     *
     * @return void
     */


    /** Step 6
     * Tests that links to native work
     *
     * @return void
     *

    function testViewSessionLinksNative()
    {
	// Setting permissions to view all sites to view all datasets
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="lorisworkspace"]/div[2]/div/div/table/tbody/tr/td[12]/a')
        );

	$NativeLink->click();
	sleep(5);

        $bodyText = $this->webDriver->findElement(
	    WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("View Session", $bodyText);
    }

    **/

/******** B ********/

    /**
     * Step 1
     * Tests that the links on the sidebar work
     * It is done manually, a FOR loop is a better idea
     *
     * @return void
    **/


    function testViewSessionSidebarLinks()
    {
	// Setting permissions to view all sites to view all datasets
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();

	// NAVIGATION MENU FIRST //
	// Go to first item in the imaging browser list of candidates
	// to view buttons: Back to List and Next, then we can check Prev

	//Back to List Button
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="lorisworkspace"]/div[2]/div/div/table/tbody/tr/td[12]/a')
        );

	$NativeLink->click();
	sleep(5);

        $BackToListButton = $this->webDriver->findElement(
	    WebDriverBy::xPath('//*[@id="sidebar-content"]/ul[1]/li[1]/a/span/span')
	);

        $BackToListButton->click();
	sleep(5);

        $SelectionFilter = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="lorisworkspace"]/div[1]/div/div/div[1]')
        )->getText();
	
        $this->assertContains("Selection Filter", $SelectionFilter);

	//Next Button
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="lorisworkspace"]/div[2]/div/div/table/tbody/tr/td[12]/a')
        );

	$NativeLink->click();
	sleep(5);

        $NextButton = $this->webDriver->findElement(
	    WebDriverBy::xPath('//*[@id="sidebar-content"]/ul[1]/li[2]/a/span/span')
	);

        $NextButton->click();
	sleep(5);

        $SiteText2= $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="table-header-left"]/tbody/tr/td[5]')
        )->getText();
	
        $this->assertContains("Test Site BOL", $SiteText2);

	//Previous Button

        $PrevButton = $this->webDriver->findElement(
	    WebDriverBy::xPath('//*[@id="sidebar-content"]/ul[1]/li[2]/a[1]/span/span')
	);
        $PrevButton->click();
	sleep(5);

        $SiteText1= $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="table-header-left"]/tbody/tr/td[5]')
        )->getText();
	
        $this->assertContains("Test Site AOL", $SiteText1);

	// VOLUME VIEWER MENU NEXT //
	// Currently awaiting redmine 9385 //
/*
	// select an image first then click on 3DOnly

        $ImageCheckbox = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="image-200"]/div/div/div[1]/input')
        );

	$ImageCheckbox->click();
	sleep(5);

        $ThreeDOnly = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="bbonly"]')
        );

	$ThreeDOnly->click();
	sleep(5);

        $BreadCrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="page"]/div/div[1]/a/label')
        )->getText();
        $this->assertContains("Brainbrowser", $BreadCrumbText);
*/

	// LINKS NEXT //

//	Test that Links: MRI Parameter form & Radiology review work

//*[@id="sidebar-content"]/ul[2]/li[1]/a
//*[@id="sidebar-content"]/ul[2]/li[2]/a

//*[@id="test_form"]/div/div[1]/div/h3 MRI Parameter Form

//*[@id="test_form"]/div/div[1]/div/h3 Radiology Review Form

    }

    /**
     * Step 8
     * Tests Breadcrumb back to imaging browser
     * 
     *
     * @return void
    **/


    function testViewSessionBreadCrumb()
    {
	// Setting permissions to view all sites to view all datasets
        $this->setupPermissions(array('imaging_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();

	// BreadCrumb //
	// Go to first item in the imaging browser list of candidates
	// to view buttons: get first native link to launch view session
	// then perform the breadcrumb test

	//Back to List Button
        $this->webDriver->get(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="lorisworkspace"]/div[2]/div/div/table/tbody/tr/td[12]/a')
        );

	$NativeLink->click();
	sleep(5);

        $BreadCrumbLink = $this->webDriver->findElement(
	    WebDriverBy::xPath('//*[@id="page-content-wrapper"]/div/div[1]/a[1]/label')
	);

        $BreadCrumbLink->click();
	sleep(5);

        $SelectionFilter = $this->webDriver->findElement(
            WebDriverBy::xPath('//*[@id="lorisworkspace"]/div[1]/div/div/div[1]')
        )->getText();
	
        $this->assertContains("Selection Filter", $SelectionFilter);
    }

    public function tearDown() {

        parent::tearDown();

        // tear down test-specific dataset

        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->delete("files", array('FileID' => '1'));
        $this->DB->delete("files", array('FileID' => '2'));
        $this->DB->delete("mri_processing_protocol", array('ProcessProtocolID' => '1'));
        $this->DB->delete("mri_processing_protocol", array('ProcessProtocolID' => '2'));
        $this->DB->delete("parameter_file", array('ParameterFileID' => '10'));
        $this->DB->delete("parameter_file", array('ParameterFileID' => '11'));
        $this->DB->delete("parameter_type", array('ParameterTypeID' => '1'));
        $this->DB->delete("mri_acquisition_dates", array('SessionID' => '999998'));
        $this->DB->delete("mri_acquisition_dates", array('SessionID' => '999999'));
        $this->DB->delete("files_qcstatus", array('FileID' => '1'));
        $this->DB->delete("files_qcstatus", array('FileID' => '2'));
        $this->DB->delete("session", array('ID' => '999997'));
        $this->DB->delete("session", array('ID' => '999998'));
        $this->DB->delete("session", array('ID' => '999999'));
        $this->DB->delete("candidate", array('CandID' => '000001'));
        $this->DB->delete("candidate", array('CandID' => '000002'));
        $this->DB->delete("candidate", array('CandID' => '000003'));
        $this->DB->delete("psc", array('CenterID' => '253'));
        $this->DB->delete("psc", array('CenterID' => '254'));
        $this->DB->run('SET foreign_key_checks =1');

    }

}
?>
