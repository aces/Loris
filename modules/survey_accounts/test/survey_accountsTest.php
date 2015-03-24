<?php
/**
 * Survey accounts automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class survey_accountsTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Survey accounts module, some
     * text appears in the body.
     *
     * @return void
     */
    function testSurveyAccountsDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=survey_accounts");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Survey Accounts", $bodyText);
    }

    /**
     * Tests that, when loading the Survey accounts module > add_survey submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testSurveyAccountsAddSurveyDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=survey_accounts&subtest=add_survey");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Add Survey", $bodyText);
    }
}
?>