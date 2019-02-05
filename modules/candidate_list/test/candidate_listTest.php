<?php
/**
 * Candidate_list automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
/**
 * CandidateListTestIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CandidateListTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * The expected result when searches successfully retrieve candidate
     *  TST0001.
     *  All items represent the text of each column in the displayed HTML
     *  candidate table.
     */
    private static $_TST0001 = array(
                                '1',
                                'Data Coordinating Center',
                                '900000',
                                'TST0001',
                                '',
                                'Active',
                                '',
                                '',
                                '',
                                '',
                                '1',
                                'Not Started',
                                'None',
                               );
    /**
     * UI elements and locations
     * breadcrumb - 'Access Profile'
     * Table headers
     */
    private $_loadingUI
        =  array(
            'Access Profile'      => '#bc2 > a:nth-child(2) > div',
            'Site'                => '#dynamictable > thead > tr > th:nth-child(2)',
            'PSCID'               => '#PSCID',
            'Sex'                 => '#dynamictable > thead>tr>th.dynamictableNext',
            'Entity Type'         => '#dynamictable > thead > tr > th:nth-child(6)',
            'Participant Status'  => '#dynamictable > thead > tr > th:nth-child(7)',
            'Subproject'          => '#dynamictable > thead > tr > th:nth-child(8)',
            'DoB'                 => '#dynamictable > thead > tr > th:nth-child(9)',
            'Scan Done'           => '#dynamictable > thead > tr > th:nth-child(10)',
            'EDC'                 => '#dynamictable > thead > tr > th:nth-child(11)',
            'Visit Count'         => '#dynamictable > thead > tr > th:nth-child(12)',
            'Latest Visit Status' => '#dynamictable > thead > tr > th:nth-child(13)',
            'Feedback'            => '#dynamictable > thead > tr > th:nth-child(14)',
           );

    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->setupConfigSetting("useEDC", "true");
    }

    /**
     * Restore the values backed up in the setUp function
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
        $this->restoreConfigSetting("useEDC");
    }
    /**
     * Tests that, the homepage should not have "You do not have access
     * to this page." on the page with permission.
     *
     * @return void
     */
    function testPageLoadsWithoutPermissionsAccessAllProfiles()
    {
        $this->setupPermissions(array("access_all_profiles"));
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that, the homepage should not have "You do not
     * have access to this page." on the page with permission.
     *
     * @return void
     */
    function testPageLoadsWithPermissionsDataEntry()
    {
        $this->setupPermissions(array("data_entry"));
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that, when loading the candidate_list module, the breadcrumb
     * appears and the default filters are set to "Basic" mode.
     *
     * @return void
     */
    function testCandidateListPageLoads()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        // Ensure that the default is basic mode (which means the button
        // says "Advanced")
        $this->assertEquals("Advanced", $basicButton->getAttribute("value"));
    }
    /**
     * Tests that, after clicking the "Advanced" button, all of the
     * advanced filters appear on the page and are the correct element type.
     *
     * @return void
     */
    function testCandidateListAdvancedOptionsAppear()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);
        // Switch to Advanced mode
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        $basicButton->click();
        // Go through each element and ensure it's on the page after clicking
        // advanced
        $scanDoneOptions = $this->webDriver->findElement(
            WebDriverBy::Name("scanDone")
        );
        $this->assertEquals("select", $scanDoneOptions->getTagName());
        $participantsStatusOptions = $this->webDriver->findElement(
            WebDriverBy::Name("participantStatus")
        );
        $this->assertEquals("select", $participantsStatusOptions->getTagName());
        $dobOptions = $this->webDriver->findElement(WebDriverBy::Name("DoB"));
        $this->assertEquals("input", $dobOptions->getTagName());
        // Not currently done
        //$this->assertEquals("date",$dobOptions->getAttribute("type"));
        $sexOptions = $this->webDriver->findElement(WebDriverBy::Name("sex"));
        $this->assertEquals("select", $sexOptions->getTagName());
        $numVisits = $this->webDriver->findElement(WebDriverBy::Name("visitCount"));
        $this->assertEquals("input", $dobOptions->getTagName());
        // Not currently done in Loris.
        //$this->assertEquals("number",$dobOptions->getAttribute("type"));
        //$this->assertEquals("0",$dobOptions->getAttribute("min"));
        $edcOptions = $this->webDriver->findElement(WebDriverBy::Name("edc"));
        $this->assertEquals("input", $edcOptions->getTagName());
        // Not currently done
        //$this->assertEquals("date",$edcOptions->getAttribute("type"));
        $latestVisitOptions = $this->webDriver->findElement(
            WebDriverBy::Name("latestVisitStatus")
        );
        $this->assertEquals("select", $latestVisitOptions->getTagName());
        $feedbackOptions = $this->webDriver->findElement(
            WebDriverBy::Name("feedback")
        );
        $this->assertEquals("select", $feedbackOptions->getTagName());
    }
    /**
     * Performs various searches by PSCID (and PSCID only).
     *
     * @return void
     */
    function testFilterByPscid()
    {
        $this->safeGet($this->url . "/candidate_list/");
        // Search using PSCID TST0001
        // Verify that only one candidate is returned: TST0001
        $this->_assertSearchBy(
            array('pscid' => 'TST0001'),
            'TST0001'
        );
        // Enter something that does not even make sense in the PSCID field
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('pscid' => 'PSCID that does not exist'),
            null
        );
        // Search using a PSCID that does not exist
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('pscid' => 'TST0003'),
            null
        );
        // Search for candidate with PSCID tst0001
        // Verify that candidate TST0001 is returned (checks that searches
        // are case-insensitive)
        $this->_assertSearchBy(
            array('pscid' => 'tst0001'),
            'TST0001'
        );
        // Search for PSCID that contains string t0
        // Verify that candidate TST0001 is returned
        $this->_assertSearchBy(
            array('pscid' => 't0'),
            'TST0001'
        );
    }
    /**
     * Performs various searches by DCCID (and DCCID only).
     *
     * @return void
     */
    function testFilterByDccId()
    {
        $this->safeGet($this->url . "/candidate_list/");
        // Search using an invalid DCCID
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('dccid' => 'Not even a DCCID'),
            null
        );
        // Search using a valid DCCID that does not exist
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('dccid' => '666666'),
            null
        );
        // Search using a valid DCCID substring that does not exist
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('dccid' => '800'),
            null
        );
        // Search for candidate with a DCCID substring that exists
        // Verify that candidate TST0001 is returned
        $this->_assertSearchBy(
            array('dccid' => '300001'),
            '300001'
        );
    }
    /**
     * Performs a candidate search using the specified criteria and verifies
     * the candidates obtained.
     *
     * @param array  $criteria        criteria for the search.
     * @param string $expectedResults the candidates that should be returned.
     *
     * @return void
     */
    private function _assertSearchBy(array $criteria, $expectedResults)
    {
        foreach ($criteria as $elementName => $elementValue) {
            $element = $this->webDriver->findElement(
                WebDriverBy::Name($elementName)
            );
            switch ($element->getTagName()) {
            case 'input':
                $element->clear();
                $element->sendKeys($elementValue);
                break;
            case 'select':
                $selectElement = new WebDriverSelect($element);
                $selectElement->selectByVisibleText($elementValue);
                break;
            default:
                throw new Exception(
                    'Element type ' . $element->getTagName() . ' not supported'
                );
            }
        }
        $showDataButton = $this->webDriver->findElement(
            WebDriverBy::Id("showdata_advanced_options")
        );
        $showDataButton->click();
        $this->_assertCandidateTableContents($expectedResults);
    }
    /**
     * Compares the content of the candidate table with an expected content.
     *
     * @param string $expectedRows array of candidates that the table should contain.
     *
     * @return void
     */
    private function _assertCandidateTableContents($expectedRows)
    {
        if (!is_null($expectedRows)) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('#dynamictable > tbody').textContent"
            );
             $this->assertContains($expectedRows, $text);

        } else {
             $text = $this->webDriver->executescript(
                 "return document.querySelector".
                 "('#datatable > div > strong').textContent"
             );
             $this->assertContains("No result found.", $text);

        }

    }
    /**
      * Testing UI elements when page loads
      *
      * @return void
      */
    function testPageUIs()
    {
        $this->safeGet($this->url . "/candidate_list/");
        foreach ($this->_loadingUI as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertContains($key, $text);
        }
    }
}
