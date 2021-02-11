<?php
/**
 * Survey accounts automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Survey accounts automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen  <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Survey_AccountsTestIntegrationTest extends LorisIntegrationTest
{
    // UI location on the page
    static $pscid      = 'input[name="pscid"]';
    static $visit      = 'select[name="visit"]';
    static $email      = 'input[name="email"]';
    static $instrument = 'select[name="instrument"]';
    // clear filter button
    static $clearFilter = ".nav-tabs a";
    static $add         = "div:nth-child(2) > .btn:nth-child(1)";
    // header of the table
    static $table = ".table-header > .row > div > div:nth-child(1)";
    /**
     * Insert testing data
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->DB->insert(
            "psc",
            [
                'CenterID'  => '55',
                'Name'      => 'TESTinPSC',
                'Alias'     => 'tst',
                'MRI_alias' => 'test',
            ]
        );
        $this->DB->insert(
            "Project",
            [
                'ProjectID' => '7777',
                'Name'      => 'TESTinProject',
            ]
        );
        $this->DB->insert(
            "subproject",
            [
                'SubprojectID' => '55',
                'title'        => 'TESTinSubproject',
            ]
        );
        $this->DB->insert(
            "candidate",
            [
                'CandID'                => '999888',
                'RegistrationCenterID'  => '1',
                'UserID'                => '1',
                'PSCID'                 => '8888',
                'RegistrationProjectID' => '1',
            ]
        );
        $this->DB->insert(
            "session",
            [
                'ID'           => '111111',
                'CandID'       => '999888',
                'CenterID'     => '1',
                'ProjectID'    => '1',
                'UserID'       => '1',
                'MRIQCStatus'  => 'Pass',
                'SubprojectID' => '55',
                'Visit'        => 'In Progress',
            ]
        );
        $this->DB->insert(
            "candidate",
            [
                'CandID'                => '999999',
                'RegistrationCenterID'  => '55',
                'UserID'                => '1',
                'PSCID'                 => '8889',
                'RegistrationProjectID' => '7777',
            ]
        );
        $this->DB->insert(
            "session",
            [
                'ID'           => '111112',
                'CandID'       => '999999',
                'CenterID'     => '1',
                'ProjectID'    => '1',
                'UserID'       => '1',
                'MRIQCStatus'  => 'Pass',
                'SubprojectID' => '55',
                'Visit'        => 'In Progress',
            ]
        );
        $this->DB->insert(
            "participant_accounts",
            [
                'SessionID'       => '111111',
                'Email'           => 'TestTestTest@example.com',
                'Test_name'       => 'Test',
                'Status'          => 'In Progress',
                'OneTimePassword' => 'Test',
            ]
        );
    }

    /**
     * Deleting test data
     *
     * @return void
     */
    public function tearDown(): void
    {
        $this->DB->delete(
            "participant_accounts",
            ['SessionID' => '111111']
        );
        $this->DB->delete(
            "session",
            ['CandID' => '999888']
        );
        $this->DB->delete(
            "candidate",
            ['CandID' => '999888']
        );
        $this->DB->delete(
            "session",
            ['CandID' => '999999']
        );
        $this->DB->delete(
            "candidate",
            ['CandID' => '999999']
        );
        $this->DB->delete(
            "subproject",
            ['SubprojectID' => '55']
        );
        $this->DB->delete(
            "psc",
            ['CenterID' => '55']
        );
        $this->DB->delete(
            "Project",
            [
                'ProjectID' => '7777',
                'Name'      => 'TESTinProject',
            ]
        );
        parent::tearDown();
    }
    /**
     * Tests that, when loading the Survey accounts module, some
     * text appears in the body.
     *
     * @return void
     */
    function testSurveyAccountsDoespageLoad()
    {
        $this->setupPermissions(["survey_accounts_view"]);
        $this->safeGet($this->url . "/survey_accounts/");
        $bodyText
            = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString("Survey Accounts", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, when loading the Survey without right permission, some
     * text appears in the body.
     *
     * @return void
     */
    function testSurveyAccountsWithoutPermission()
    {
        $this->setupPermissions([""]);
        $this->safeGet($this->url . "/survey_accounts/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that errors are correctly displayed when the user enters incorrect
     * or invalid values.
     * The error messages used in this function come from the file
     * modules/survey_accounts/php/addsurvey.class.inc
     *
     * @return void
     */
    function testSurveyAccountsAddSurvey()
    {
        $visitLabel = 'V1';
        $instrument = 'bmi';

        // Ensure that an instrument must be supplied.
        $this->safeGet($this->url . "/survey_accounts/");
        $btn = self::$add;
        $this->safeFindElement(WebDriverBy::cssSelector($btn))->click();
        $this->safeFindElement(
            WebDriverBy::Name("CandID")
        )->sendKeys("999999");
        $this->safeFindElement(
            WebDriverBy::Name("PSCID")
        )->sendKeys("8889");
        $this->safeFindElement(
            WebDriverBy::Name("VL")
        )->sendKeys($visitLabel);
        $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();
        $bodyText =  $this->safeFindElement(
            WebDriverBy::cssSelector(".error")
        )->getText();
        $this->assertStringContainsString(
            "Please choose an instrument.",
            $bodyText
        );

        // Ensure visit label exists for a candidate.
        $this->safeGet($this->url . "/survey_accounts/");
        $btn = self::$add;
        $this->safeFindElement(WebDriverBy::cssSelector($btn))->click();
        $this->safeFindElement(
            WebDriverBy::Name("CandID")
        )->sendKeys("999999");
        $this->safeFindElement(
            WebDriverBy::Name("PSCID")
        )->sendKeys("8889");
        $visitField  = $this->safeFindElement(
            WebDriverBy::Name("VL")
        );
        $visitOption = new WebDriverSelect($visitField);
        $visitOption->selectByValue($visitLabel);
        $this->safeFindElement(
            WebDriverBy::Name("Test_name")
        )->sendKeys($instrument);
        $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();
        $bodyText =  $this->safeFindElement(
            WebDriverBy::cssSelector(".error")
        )->getText();
        $this->assertStringContainsString(
            "Visit $visitLabel does not exist for given candidate",
            $bodyText
        );

        //PSCID and DCC ID do not match or candidate does not exist.
        $this->safeFindElement(
            WebDriverBy::Name("CandID")
        )->sendKeys("888888");
        $this->safeFindElement(
            WebDriverBy::Name("PSCID")
        )->sendKeys("8889");
        $this->safeFindElement(
            WebDriverBy::Name("Test_name")
        )->sendKeys($instrument);
        $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();
        $bodyText =  $this->safeFindElement(
            WebDriverBy::cssSelector(".error")
        )->getText();
        $this->assertStringContainsString(
            "PSCID and CandID do not match or candidate does not exist",
            $bodyText
        );
    }
    // todo add a survey successful.
    /**
     * Tests that, input some data and click search button, check the results.
     *
     * @return void
     */
    function testSurveyAccountsSearchButton()
    {
        //testing search by PSCID
        $this->safeGet($this->url . "/survey_accounts/");
        //testing data from RBdata.sql
        $this-> _testFilter(
            self::$email,
            self::$table,
            "1 rows",
            "TestTestTest@example.com"
        );
        $this-> _testFilter(self::$pscid, self::$table, "1 rows", "8888");
        $this-> _testFilter(self::$pscid, self::$table, "0 rows", "test");
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element The input element loaction
     * @param string $table   The first row location in the table
     * @param string $records The records number in the table
     * @param string $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$table,$records,$value)
    {
        // get element from the page
        if (strpos($element, "select") === false) {
            $this->safeFindElement(WebDriverBy::cssSelector($element));
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);
                "
            );
            $bodyText = $this->webDriver->executescript(
                "return document.querySelector('$table').textContent"
            );
            $this->assertStringContainsString($records, $bodyText);
        } else {
            $this->safeFindElement(WebDriverBy::cssSelector($element));
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
            $bodyText = $this->webDriver->executescript(
                "return document.querySelector('$table').textContent"
            );
            $this->assertStringContainsString($records, $bodyText);
        }
        //test clear filter
        $btn = self::$clearFilter;
        $this->webDriver->executescript(
            "document.querySelector('$btn').click();"
        );
        $inputText = $this->webDriver->executescript(
            "return document.querySelector('$element').value"
        );
        $this->assertEquals("", $inputText);
    }
}
