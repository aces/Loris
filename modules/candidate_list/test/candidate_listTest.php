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
                                '"Active"',
                                '',
                                '',
                                '',
                                '',
                                '1',
                                'Not Started',
                                'None',
                               );
    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();
        $this->setupConfigSetting("useEDC", "true");
    }
    /**
     * Restore the values backed up in the setUp function
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
        $this->restoreConfigSetting("useEDC");
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
            WebDriverBy::Name("scan_done")
        );
        $this->assertEquals("select", $scanDoneOptions->getTagName());
        $participantsStatusOptions = $this->webDriver->findElement(
            WebDriverBy::Name("Participant_Status")
        );
        $this->assertEquals("select", $participantsStatusOptions->getTagName());
        $dobOptions = $this->webDriver->findElement(WebDriverBy::Name("dob"));
        $this->assertEquals("input", $dobOptions->getTagName());
        // Not currently done
        //$this->assertEquals("date",$dobOptions->getAttribute("type"));
        $genderOptions = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $this->assertEquals("select", $genderOptions->getTagName());
        $numVisits = $this->webDriver->findElement(WebDriverBy::Name("Visit_Count"));
        $this->assertEquals("input", $dobOptions->getTagName());
        // Not currently done in Loris.
        //$this->assertEquals("number",$dobOptions->getAttribute("type"));
        //$this->assertEquals("0",$dobOptions->getAttribute("min"));
        $edcOptions = $this->webDriver->findElement(WebDriverBy::Name("edc"));
        $this->assertEquals("input", $edcOptions->getTagName());
        // Not currently done
        //$this->assertEquals("date",$edcOptions->getAttribute("type"));
        $latestVisitOptions = $this->webDriver->findElement(
            WebDriverBy::Name("Latest_Visit_Status")
        );
        $this->assertEquals("select", $latestVisitOptions->getTagName());
        $feedbackOptions = $this->webDriver->findElement(
            WebDriverBy::Name("Feedback")
        );
        $this->assertEquals("select", $feedbackOptions->getTagName());
    }
    /**
     * Performs various searches by PSCID (and PSCID only).
     *
     * @return void.
     */
    function testFilterByPscid()
    {
        $this->markTestSkipped(
            'Skipped until Travis and React work well together'
        );

        $this->safeGet($this->url . "/candidate_list/");
        // Enter something that does not even make sense in the PSCID field
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('PSCID' => 'PSCID that does not exist'),
            null
        );
        // Search using a PSCID that does not exist
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('PSCID' => 'TST0003'),
            null
        );
        // Search using PSCID TST0001
        // Verify that only one candidate is returned: TST0001
        $this->_assertSearchBy(
            array('PSCID' => 'TST0001'),
            array(self::$_TST0001)
        );
        // Search for candidate with PSCID tst0001
        // Verify that candidate TST0001 is returned (checks that searches
        // are case-insensitive)
        $this->_assertSearchBy(
            array('PSCID' => 'tst0001'),
            array(self::$_TST0001)
        );
        // Search for PSCID that contains string t0
        // Verify that candidate TST0001 is returned
        $this->_assertSearchBy(
            array('PSCID' => 't0'),
            array(self::$_TST0001)
        );
    }
    /**
     * Performs various searches by DCCID (and DCCID only).
     *
     * @return void.
     */
    function testFilterByDccId()
    {
        $this->markTestSkipped(
            'Skipped until Travis and React work well together'
        );

        $this->safeGet($this->url . "/candidate_list/");
        // Search using an invalid DCCID
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('DCCID' => 'Not even a DCCID'),
            null
        );
        // Search using a valid DCCID that does not exist
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('DCCID' => '666666'),
            null
        );
        // Search using a valid DCCID substring that does not exist
        // Verify that no candidates are returned
        $this->_assertSearchBy(
            array('DCCID' => '800'),
            null
        );
        // Search for candidate with a DCCID substring that exists
        // Verify that candidate TST0001 is returned
        $this->_assertSearchBy(
            array('DCCID' => '0'),
            array(self::$_TST0001)
        );
    }
    /**
     * Performs a candidate search using the specified criteria and verifies
     * the candidates obtained.
     *
     * @param array  $criteria        criteria for the search.
     * @param string $expectedResults the candidates that should be returned.
     *
     * @return void.
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
                throw Exception(
                    'Element type ' . $element->getTagName() . ' not supported'
                );
            }
        }
        $showDataButton = $this->webDriver->findElement(
            WebDriverBy::Id("showdata_advanced_options")
        );
        $showDataButton->click();
        $this->_assertCandidateTableContents('datatable', $expectedResults);
    }
    /**
     * Compares the content of the candidate table with an expected content.
     *
     * @param string $tableName    name of the HTML table.
     * @param string $expectedRows array of candidates that the table should contain.
     *
     * @return void
     */
    private function _assertCandidateTableContents($tableName, $expectedRows)
    {
        if (is_null($expectedRows)) {
            $wait = new WebDriverWait($this->webDriver, 15);
            $wait->until(
                WebDriverExpectedCondition::presenceOfElementLocated(
                    WebDriverBy::ClassName('no-result-found-panel')
                )
            );
            $element = $this->webDriver->findElement(
                WebDriverBy::ClassName('no-result-found-panel')
            );
            $this->assertContains('No result found', $element->getText());
        } else {
            $wait = new WebDriverWait($this->webDriver, 15);
            $wait->until(
                WebDriverExpectedCondition::presenceOfElementLocated(
                    WebDriverBy::Id('dynamictable')
                )
            );
            $dataTable  = $this->webDriver->findElement(
                WebDriverBy::Id('dynamictable')
            );
            $actualRows = $dataTable->findElements(
                WebDriverBy::xpath('.//tbody//tr')
            );
            $this->assertEquals(
                count($actualRows),
                count($expectedRows),
                "Number of candidates returned should be "
                . count($expectedRows) . ", not " . count($actualRows)
            );
            for ($i=0; $i<count($actualRows); $i++) {
                $elements      = $actualRows[$i]->findElements(
                    WebDriverBy::xpath('.//td')
                );
                $actualColumns = array();
                foreach ($elements as $e) {
                    $actualColumns[] = $e->getText();
                }
                $expectedColumns = $expectedRows[$i];
                $this->assertEquals(
                    $actualColumns,
                    $expectedColumns,
                    "Candidates at row $i differ"
                );
            }
        }
    }
}
?>