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
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
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
    static $examnier = 'input[name="examiner"]';
    //General locations
    static $display     = '.table-header > div > div > div:nth-child(1)';
    static $clearFilter = '.nav-tabs a';

    /**
     * Insert testing data
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
    }
    /**
     * Delete testing data
     *
     * @return void
     */
    public function tearDown(): void
    {
        $this->DB->delete(
            "examiners",
            ['full_name' => 'Test_Examiner']
        );

        $this->DB->delete(
            "psc",
            ['Name' => 'TEST_Site']
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
        $this->setupPermissions(["examiner_view"]);
        $this->safeGet($this->url . "/examiner/?format=json");

        // Check the table column headers
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Examiner", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
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
        $this->setupPermissions([]);
        $this->safeGet($this->url . "/examiner/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
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
        $this->setupPermissions(['superuser']);
        $this->safeGet($this->url . "/examiner/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
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
        $this->safeFindElement(
            WebDriverBy::Name("examiner")
        )->sendKeys("XXXX");
        $this->safeFindElement(
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
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#default-panel > div > div > div.table-header ".
                "> div > div > div:nth-child(2) > button:nth-child(1)"
            )
        );
        $this->safeFindElement(
            WebDriverBy::Name("addName")
        )->sendKeys("Test_Examiner");
        $select  = $this->safeFindElement(WebDriverBy::Name("addSite"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("Montreal");
        $this->safeClick(
            WebDriverBy::Name("fire_away")
        );
        $this->safeGet($this->url . "/examiner/");
        $this->_filterTest(
            self::$examnier,
            self::$display,
            self::$clearFilter,
            'Test_Examiner',
            '1 row'
        );
    }

}

