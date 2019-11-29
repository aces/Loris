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
     * UI elements and locations
     * Breadcrumb - 'Examiner'
     * Button
     * Table headers
     */
    private $_loadingUI
        =  array(
            'Examiner'         => '#bc2 > a:nth-child(2) > div',
            'Selection Filter' => '#lorisworkspace > div.row > '.
                                  'div.col-sm-12.col-md-7 > div > div.panel-heading',
            'Add Examiner'     => '#lorisworkspace > div > div:nth-child(1) > '.
                                  'div > div:nth-child(1)',
            'Add'              => '#examiner > div:nth-child(3) > div > button',
        );

    /**
     * Insert testing data
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
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
     * Tests that examiner page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testExaminerDoesLoadWithoutSuperuser()
    {
        $this->setupPermissions(array('superuser'));
        $this->safeGet($this->url . "/examiner/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
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
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better'
        );
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
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better'
        );
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
        $element->selectByVisibleText("Montreal");
        $bodyText = $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();
        $this->safeGet($this->url . "/examiner/");
        //search the examiner which inserted
        $this->webDriver->findElement(
            WebDriverBy::Name("examiner")
        )->sendKeys("Test_Examiner");
        $this->webDriver->findElement(
            WebDriverBy::Name("filter") // Filter button removed in
        )->click();                     // Reactified menu filter
        $text = $this->webDriver->executescript(
            "return document.querySelector".
                "('#dynamictable > tbody > tr:nth-child(1) > td:nth-child(2) > a')".
                ".textContent"
        );
        $this->assertContains("Test_Examiner", $text);
    }
    /**
     * Testing UI elements when page loads
     *
     * @return void
     */
    function testPageUIs()
    {
        $this->markTestSkipped(
            'Skipped tests until Travis and React get along better'
        );
        $this->safeGet($this->url . "/examiner/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        foreach ($this->_loadingUI as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertContains($key, $text);
        }
    }


}

