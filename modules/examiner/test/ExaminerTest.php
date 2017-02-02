<?php
/**
 * Examiner module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Examiner module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ExaminerTest extends LorisIntegrationTest
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
         $size   = new WebDriverDimension(1024, 1768);
         $window->setSize($size);
        $this->DB->insert(
            "psc",
            array(
             'CenterID'   => '99',
             'Name'       => 'TEST_Site',
             'Study_site' => 'Y',
             'StateID'    => '0',
             'Alias'      => 'DDD',
             'MRI_alias'  => 'TEST',
            )
        );
    }
    /**
    * Delete testing data
    *
    * @return void
    */
    public function tearDown()
    {
        $this->DB->delete(
            "examiners",
            array('full_name' => 'Test_Examiner')
        );

        $this->DB->delete(
            "psc",
            array('Name' => 'TEST_Site')
        );
         parent::tearDown();
    }

    /**
     * Tests that the breadcrumb loads, which it should regardless of the user's
     * permissions
     *
     * @return void
     */
    public function testBreadcrumbLoads()
    {
        $this->safeGet($this->url . "/examiner/");
        $breadcrumbText = $this->webDriver
            ->findElement(WebDriverBy::id("breadcrumbs"))->getText();
        $this->assertContains("Examiner", $breadcrumbText);
    }

    /**
     * Tests that the selection filter loads if the user has the correct permission
     *
     * @return void
     */
    function testSelectionFilterLoadsWithPermission()
    {
        $this->setupPermissions(array("examiner_view"));
        $this->safeGet($this->url . "/examiner/");

        // Test that the selection filter appears
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::id("lorisworkspace")
        )->getText();
        $this->assertContains("Selection Filter", $bodyText);

        // Check the examiner input
        $examinerInput = $this->webDriver->findElement(
            WebDriverBy::Name("examiner")
        );
        $this->assertEquals("input", $examinerInput->getTagName());

        // Check the site input
        $siteInput = $this->webDriver->findElement(
            WebDriverBy::Name("site")
        );
        $this->assertEquals("select", $siteInput->getTagName());

        // Check the radiologist input
        $radiologistInput = $this->webDriver->findElement(
            WebDriverBy::Name("radiologist")
        );
        $this->assertEquals("select", $radiologistInput->getTagName());

        // Check the filter button
        $filterButton = $this->webDriver->findElement(
            WebDriverBy::Name("filter")
        );
        $this->assertEquals("submit", $filterButton->getAttribute("type"));

        // Check the reset button
        $resetButton = $this->webDriver->findElement(
            WebDriverBy::Name("reset")
        );
        $this->assertEquals("button", $resetButton->getAttribute("type"));

        $this->resetPermissions();
    }
    /**
     * Tests that the Add Examiner form loads if the user has the correct permission
     *
     * @return void
     */
    function testAddExaminerFormLoadsWithPermission()
    {
        $this->setupPermissions(array("examiner_view"));
        $this->safeGet($this->url . "/examiner/");

        // Test that the selection filter appears
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::id("lorisworkspace")
        )->getText();
        $this->assertContains("Add Examiner", $bodyText);

        // Check the name input
        $nameInput = $this->webDriver->findElement(
            WebDriverBy::Name("addName")
        );
        $this->assertEquals("input", $nameInput->getTagName());

        // Check the radiologist input
        $radiologistInput = $this->webDriver->findElement(
            WebDriverBy::Name("addRadiologist")
        );
        $this->assertEquals("input", $radiologistInput->getTagName());

        // Check the site input
        $siteInput = $this->webDriver->findElement(
            WebDriverBy::Name("addSite")
        );
        $this->assertEquals("select", $siteInput->getTagName());

        $this->resetPermissions();
    }

    /**
     * Tests that the examiner table loads if the user has the correct permission
     *
     * @return void
     */
    function testResultTableLoadsWithPermission()
    {
        $this->setupPermissions(array("examiner_view"));
        $this->safeGet($this->url . "/examiner/?format=json");

        // Check the table column headers
        $tableText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Examiner", $tableText);
        $this->assertContains("Site", $tableText);
        $this->assertContains("Radiologist", $tableText);

        $this->resetPermissions();
    }
    /**
     * Tests that the certification column loads if EnableCertification is set in
     * the config
     *
     * @return void
     */
    function testExaminerLoadsCertificationElements()
    {
        $this->markTestIncomplete("Test not implemented!");
        /*$this->setupConfigSetting('EnableCertification', '1');
        $this->safeGet($this->url . "/examiner/");

        // Check that the certification column appears
        $tableText = $this->webDriver->findElement(
            WebDriverBy::cssSelector(".table-responsive")
        )->getText();
        $this->assertContains("Certification", $tableText);

        $this->restoreConfigSetting("EnableCertification");*/
    }

    /**
     * Tests that the certification column does not load if EnableCertification
     * is not set in the config
     *
     * @return void
     */
    function testExaminerDoesNotLoadCertificationElements()
    {
        $this->markTestIncomplete("Test not implemented!");
        /*$this->setupConfigSetting('EnableCertification', '0');
        $this->safeGet($this->url . "/examiner/");

        // Check that the certification column does not appear
        $tableText = $this->webDriver->findElement(
            WebDriverBy::cssSelector(".table-responsive")
        )->getText();
        $this->assertNotContains("Certification", $bodyText);

        $this->restoreConfigSetting("EnableCertification");*/
    }

    /**
     * Tests that examiner page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testExaminerDoesNotLoadWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/examiner/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that examiner selection filter, search a Examiner name
     * and click clear form, the input data should disappear.
     *
     * @return void
     */
    function testExaminerFilterClearForm()
    {
        $this->safeGet($this->url . "/examiner/");
        $this->webDriver->findElement(
            WebDriverBy::Name("examiner")
        )->sendKeys("XXXX");
        $this->webDriver->findElement(
            WebDriverBy::Name("reset")
        )->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::Name("examiner")
        )->getText();
        $this->assertEquals("", $bodyText);
    }
    /**
     * Tests that Add examiner section, insert an Examiner and find it.
     *
     * @return void
     */
    function testExaminerAddExaminer()
    {
        //insert a new exmainer with name "Test_Examiner" and radiologist
        //in the TEST_Site.
        $this->safeGet($this->url . "/examiner/");
        $this->safeFindElement(
            WebDriverBy::Name("addName")
        )->sendKeys("Test_Examiner");
        $this->safeFindElement(
            WebDriverBy::Name("addRadiologist")
        )->click();
        $select  = $this->safeFindElement(WebDriverBy::Name("addSite"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("TEST_Site");
        $bodyText = $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();
        sleep(5);
        //search the examiner which inserted
        $this->webDriver->findElement(
            WebDriverBy::Name("examiner")
        )->sendKeys("Test_Examiner");
        $this->webDriver->findElement(
            WebDriverBy::Name("filter")
        )->click();

        $this->safeGet($this->url . "/examiner/?format=json");

        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Test_Examiner", $bodyText);

    }

}
?>
