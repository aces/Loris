<?php
/**
 * Test the functionality of the Radiological Review module.
 *
 * Currently only the menu filter tests are implemented.
 *
 * PHP Version 5.
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 *
 */
require_once 'LorisTest.php';

/**
 * Test cases for Final Radiological Review module
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 */
class TestOfFinalRadiologicalReview extends LorisTest
{

    /**
     * Ensure that the module can not be accessed while logged out
     *
     * @return null
     */
    function testFRRLoggedOut()
    {
        $this->get($this->url . "/main.php?logout=true");
        $this->get($this->url . "/main.php?test_name=final_radiological_review");
        $this->assertPattern(
            "/Password/", 
            "Could access radiological menu logged out"
        );
        $this->get(
            $this->url 
            . '/main.php'
            . '?test_name=final_radiological_review'
            . '&subtest=final_radiological_review'
        );
        $this->assertPattern(
            "/Password/", 
            "Could access radiological form logged out"
        );
        // Returns 200, but with the login page if not logged in
        //$this->assertResponse(403, "Could access new_profile while logged out");
    }

    /**
     * Get the menu page while logged in and ensure it is well formed.
     *
     * @return null
     */
    function testGetPage()
    {
        $this->login("UnitTester", "4test4");
        $this->get($this->url . "/main.php?test_name=final_radiological_review");
        $this->assertResponse(
            200, 
            "Could not access final_radiological_review menu as UnitTester"
        );
        $this->assertPattern(
            "/Final Radiological Review/", 
            "Page does not appear to have Radiological Review header"
        );
        $this->get(
            $this->url 
            . "/main.php"
            . '?test_name=final_radiological_review'
            . '&subtest=final_radiological_review'
        );
        $this->assertResponse(
            200, 
            "Could not access final_radiological_review form as UnitTester"
        );
        $this->assertPattern(
            "/Final Radiological Review/",
            "Page does not appear to have Final Radiological Review header"
        );
    }

    /**
     * Test submitting a form entry to the menu page.
     *
     * Try various combinations of filters.
     *
     * Currently the CandID and Review_done are tested, both
     * separately and in combination.
     *
     * @return null
     */
    function testPostMenuPage()
    {
        $this->login("UnitTester", "4test4");

        $this->DB->insert("flag",
            array('CommentID' => 'TestCommentID',
            'Data_entry' => 'Complete',
            'Administration' => 'Partial',
            'Test_name' => 'radiology_review',
            'SessionID' => $this->SessionID
        ));
        $this->DB->insert("radiology_review",
            array(
                'CommentID' => 'TestCommentID'
            )
        );

        $this->get($this->url . "/main.php?test_name=final_radiological_review");
        $PostArray = array(
            'test_name'            => 'final_radiological_review',
            'site'                 => '',
            'Conflict1'            => '',
            'Conflict2'            => '',
            'pscid'                => '',
            'dccid'                => '',
            'Visit_label'          => '',
            'Review_done'          => '',
            'SAS'                  => '',
            'PVS'                  => '',
            'Final_Review_Results' => '',
            'Exclusionary_Status'  => '',
            'Finalized'            => '',
            'filter'               => 'Show Data'
        );

        $this->post($this->url . '/main.php', $PostArray);
        $this->assertBasicConditions();
        $this->assertNoPattern('/Nothing found/', 'Nothing found with empty filter');

        // TODO:  Make sure the data for this CandID is actually in the database
        //        programmatically instead of assuming.
        //        (Call setUp/tearDown.)
        $PostArray['dccid'] = $this->CandID;
        $this->post($this->url . '/main.php', $PostArray);
        $this->assertBasicConditions();
        $this->assertNoPattern(
            '/Nothing found/', 
            "No data filtering for $this->CandID"
        );
        // Make sure the closing <td> is there (and possibly whitespace) because
        // otherwise the filter form matches this.
        $this->assertPattern(
            "/$this->CandID([ \t\n\r]*)<\/td>/", 
            "Could not find $this->CandID with filter"
        );

        $PostArray['Review_done'] = 'no';
        $this->post($this->url . '/main.php', $PostArray);
        $this->assertBasicConditions();
        $this->assertNoPattern(
            '/Nothing found/', 
            "No data filtering for $this->CandID with review done set to No"
        );
        // Make sure the closing <td> is there (and possibly whitespace) because
        // otherwise the filter form matches this.
        $this->assertPattern(
            "/$this->CandID([ \t\n\r]*)<\/td>/",
            "Could not find $this->CandID with filters for review done and CandID"
        );
        // Might not have found the row but have too many other
        // rows, so make sure there's only 1 row.
        // Make sure there's no 2 surrounded by whitespace in 
        // a table cell.
        $this->assertNoPattern(
            "/>([ \t\n\r]*)2([ \t\n\r]*)<\/td>/", 
            "Multiple rows returned for $this->CandID with filters "
            . "for review done and CandID"
        );

        $this->DB->delete("radiology_review", array('CommentID' => 'TestCommentID'));
        $this->DB->delete("flag", array('CommentID' => 'TestCommentID'));
    }

}
?>
