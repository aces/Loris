<?php
/**
 * candidate_parameters automated integration tests
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
class candidateParametersTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the candidate_parameters module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_parameters");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Candidate Parameters", $bodyText);
    }

    /**
     * Tests that, when loading the candidate_parameters module > add_family subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersAddFamilyDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_parameters&subtest=add_family");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Add Family", $bodyText);
    }

    /**
     * Tests that, when loading the candidate_parameters module > update_participant_status subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersUpdateParticipantStatusDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_parameters&subtest=update_participant_status");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains(" Update Participant Status", $bodyText);
    }

    /**
     * Tests that, when loading the candidate_parameters module > update_candidate_info subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersUpdateCandidateInfoDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_parameters&subtest=update_candidate_info");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Update Candidate Info", $bodyText);
    }

    /**
     * Tests that, when loading the candidate_parameters module > update_proband_info subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersUpdateProbandInfoDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_parameters&subtest=update_proband_info");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Update Proband Info", $bodyText);
    }

    /**
     * Tests that, when loading the candidate_parameters module > update_consent_info subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersUpdateConsentInfoDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_parameters&subtest=update_consent_info");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Update Consent Info", $bodyText);
    }
}
?>