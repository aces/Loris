<?php
/**
 * Test the functionality of the timepoint_list menu filter in Loris
 *
 * PHP Version 5
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     http://www.loris.ca
 *
 */

require_once 'LorisTest.php';

/**
 * Class which implements testing of timepoint_list page in Loris
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     http://www.loris.ca
 */
class TestOfTimepointList extends LorisTest
{
    /**
     * Test that the timepoint_list page is not accessible if
     * the user is not logged in
     *
     * @return null
     */
    function testTPLLoggedOut()
    {
        $this->get(
            $this->url . "/main.php?test_name=timepoint_list&candID="
            . $this->CandID
        );
        $this->assertPattern("/Password/", "Could access candidate_list logged out");
    }

    /**
     * Test the timepoint_list page. This checks that the timepoint_list
     * page is accessible, and that it contains all the visits for the
     * candidate specified for testing in the config.xml.
     *
     * It also checks that there's at least 1 session for that candidate,
     * since otherwise it's a useless test.
     *
     * @return null
     */
    function testTPLGetPage()
    {
        $main_link = "$this->url" . "/main.php?test_name=timepoint_list&candID=" .  $this->CandID;
        $this->login("UnitTester", "4test4");
        $this->get($main_link);
        $this->assertBasicConditions();
        $this->assertResponse(200, "Could not access timepoint_list as UnitTester");
        $this->assertPattern(
            "/Candidate Profile/", 
            "Page does not appear to have header"
        );
        $this->assertNoPattern("/Password/", "Unexpectedly got login page");

        $this->assertNoPattern(
            "/Visit Label \(Click to Open\)/",
            "Table appears to be missing"
        );
        $sessions = $this->DB->pselect(
            "SELECT Visit_label, ID FROM session
             WHERE CandID=:CaID AND Active='Y'",
            array('CaID' => $this->CandID)
        );
        $this->assertTrue(
            count($sessions) > 0, 
            "Candidate does not have any sessions"
        );
        foreach ($sessions as $row) {
            $vl = $row['Visit_label'];
            $sid = $row['ID'];
            $this->assertLink(
                $vl,
                true,
                "Missing link for Visit Label $vl at $main_link"
            );
        }
    }
}
?>
