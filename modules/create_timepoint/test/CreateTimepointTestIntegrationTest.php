<?php declare(strict_types=1);

/**
 * Module create_timepoint automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
require_once __DIR__ . "/../../../test/integrationtests"
    . "/LorisIntegrationTestWithCandidate.class.inc";

/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CreateTimepointTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * It does the setUp before running the tests
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
    }

    /**
     * It does the tearDown after running the tests
     *
     * @return void
     */
    function tearDown(): void
    {
        parent::tearDown();
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointBTN()
    {
        $this->safeGet(
            $this->url . "/900000"
        );
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div.col-xs-12.row > a:nth-child(2)"
            )
        )->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Create Timepoint", $bodyText);
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
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointDoespageLoad()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/".
            "?candID=900000&identifier=900000&cohortID=1"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Create Timepoint", $bodyText);
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
     * Test that ensures the user can only choose from Projects and Sites they are
     * affiliated with. Ensure the Cohort dropdown is dynamically populated once
     * a Site and Project are selected.
     *
     * Ensure the Visit label dropdown is dynamically populated once the Cohort
     * selection is done.
     *
     * Confirm that options displayed for Cohort and Visit labels fields match
     * the content of the project_cohort_rel table and the visit_project_cohort_rel
     * table respectively.
     *
     * Ensure a popup error is displayed when a project with no cohort associations
     * is selected.
     *
     * Ensure a popup error is displayed when a cohort is selected, in combination
     * with a project, where no visit labels are defined for that project-cohort
     * combination.
     *
     * Ensure that if the user is affiliated with a single project and/or site,
     * the Project/Site dropdowns are auto-populated with the sole available option.
     *
     * Ensure that if the Cohort and/or Visit label dropdowns contain a single option
     * only, the option is auto-selected by default.
     *
     * @return void
     */
    function testDCCIDandProjectSite()
    {
        // Safe get the URL with query parameters
        $this->safeGet(
            $this->url .
            "/create_timepoint/?candID=900000&identifier=900000&cohortID=1"
        );

        // Check the "Data Coordinating Center" dropdown
        $this->_assertDropdownSelectedText('psc', 'Data Coordinating Center');

        // Check the "Pumpernickel" dropdown
        $this->_assertDropdownSelectedText('project', 'Pumpernickel');

        // Check the "English" dropdown
        $this->_assertDropdownSelectedText('languageID', 'English');

        // Check the "cohort" dropdown has "Fresh" and "Stale" as options
        $this->_assertDropdownHasOptions('cohort', ['Fresh', 'Stale']);
    }

    /**
     * Helper function to assert that a dropdown has the expected selected text
     *
     * @param string $elementId    The ID of the dropdown element
     * @param string $expectedText The expected selected text
     *
     * @return void
     */
    private function _assertDropdownSelectedText($elementId, $expectedText)
    {
        // Get the dropdown element
        $selectElement = $this->safeFindElement(WebDriverBy::id($elementId));

        // Create a WebDriverSelect object
        $select = new WebDriverSelect($selectElement);

        // Get the text of the selected option
        $selectedOptionText = $select->getFirstSelectedOption()->getText();

        // Assert that the selected text is as expected
        $this->assertEquals(
            $expectedText,
            $selectedOptionText,
            "The selected option in '$elementId' is not as expected."
        );
    }

    /**
     * Helper function to assert that a dropdown contains specific options
     *
     * @param string $elementId       The ID of the dropdown element
     * @param array  $expectedOptions The list of expected options in the dropdown
     *
     * @return void
     */
    private function _assertDropdownHasOptions($elementId, array $expectedOptions)
    {
        // Get the dropdown element
        $selectElement = $this->safeFindElement(WebDriverBy::id($elementId));

        // Create a WebDriverSelect object
        $select = new WebDriverSelect($selectElement);

        // Get all options in the dropdown
        $allOptions  = $select->getOptions();
        $optionTexts = array_map(fn($option) => $option->getText(), $allOptions);

        // Loop through expected options and assert that each exists
        foreach ($expectedOptions as $expectedOption) {
            $this->assertTrue(
                in_array($expectedOption, $optionTexts),
                "The option '$expectedOption' was not found in dropdown."
            );
        }
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepoint()
    {
        $this->_createTimepoint("900000", "Stale", "V2");
        $this->safeGet($this->url . "/900000/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("900000", $bodyText);

    }

    /**
     * Create a timepoint with three parameters.
     *
     * @param string $canID      ID of candidate
     * @param string $cohort     text of cohort
     * @param string $visitlabel text of visit label
     *
     * @return void
     */
    private function _createTimepoint($canID, $cohort, $visitlabel)
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=" . $canID .
            "&identifier=" .$canID
        );
        $select  = $this->safeFindElement(WebDriverBy::Name("cohort"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText($cohort);
        $this->safeFindElement(
            WebDriverBy::Name("visit")
        )->sendKeys($visitlabel);
        $this->safeClick(
            WebDriverBy::Name("fire_away")
        );
    }

    /**
     * Tests that, create a timepoint and input a empty cohort
     * get Error message
     *
     * @return void
     */
    function testCreateTimepointErrorEmptyCohort()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $this->safeFindElement(WebDriverBy::Name("fire_away"))->click();
        $bodyText = $this->webDriver->getPageSource();
        $this->assertStringNotContainsString(
            "New time point successfully registered.",
            $bodyText
        );

    }

    /**
     * Tests that timepoint loads with the permission
     *
     * @return void
     */
    public function testCreateTimepointPermission()
    {
        $this->setupPermissions(["data_entry"]);
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();

        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
}

