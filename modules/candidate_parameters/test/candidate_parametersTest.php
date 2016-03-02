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

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
class candidateParametersTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * Tests that, when loading the candidate_parameters module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersDoesPageLoad()
    {
        $this->safeGet($this->url . "/candidate_parameters/?candID=900000&identifier=900000");
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
        $this->safeGet($this->url . "/candidate_parameters/add_family/?candID=900000&identifier=900000");
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
        $this->safeGet($this->url . "/candidate_parameters/update_participant_status/?candID=900000&identifier=900000");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Update Participant Status", $bodyText);
    }

    /**
     * Tests that, when loading the candidate_parameters module > update_candidate_info subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testCandidateParametersUpdateCandidateInfoDoespageLoad()
    {
        $this->safeGet($this->url . "/candidate_parameters/update_candidate_info/?candID=900000&identifier=900000");
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
        $this->safeGet($this->url . "/candidate_parameters/update_proband_info/?candID=900000&identifier=900000");
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
        $this->safeGet($this->url . "/candidate_parameters/update_consent_info/?candID=900000&identifier=900000");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Update Consent Info", $bodyText);
    }
}
?>
