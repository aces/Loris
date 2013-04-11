<?php
require_once 'LorisTest.php';

class TestOfFinalRadiologicalReview extends LorisTest {

    function testFRRLoggedOut() {
        $this->get($this->url . "/main.php?logout=true");
        $this->get($this->url . "/main.php?test_name=final_radiological_review");
        $this->assertPattern("/Password/", "Could access radiological menu logged out");
        $this->get($this->url . "/main.php?test_name=final_radiological_review&subtest=final_radiological_review");
        $this->assertPattern("/Password/", "Could access radiological form logged out");
        // Returns 200, but with the login page if not logged in
        //$this->assertResponse(403, "Could access new_profile while logged out");
    }

    function testGetPage() {
        $this->login("UnitTester", "4test4");
        $this->get($this->url . "/main.php?test_name=final_radiological_review");
        $this->assertResponse(200, "Could not access final_radiological_review menu as UnitTester");
        $this->assertPattern("/Final Radiological Review/", "Page does not appear to have Radiological Review header");
        $this->get($this->url . "/main.php?test_name=final_radiological_review&subtest=final_radiological_review");
        $this->assertResponse(200, "Could not access final_radiological_review form as UnitTester");
        $this->assertPattern("/Final Radiological Review/", "Page does not appear to have Final Radiological Review header");
    }

    function testPostMenuPage() {
        $this->login("UnitTester", "4test4");

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
        $this->assertNoPattern('/Nothing found/', "No data filtering for $this->CandID");
        // Make sure the closing <td> is there (and possibly whitespace) because
        // otherwise the filter form matches this.
        $this->assertPattern("/$this->CandID([ \t\n\r]*)<\/td>/", "Could not find $this->CandID with filter");

        $PostArray['Review_done'] = '0';
        $this->post($this->url . '/main.php', $PostArray);
        $this->assertBasicConditions();
        $this->assertNoPattern('/Nothing found/', "No data filtering for $this->CandID with review done set to No");
        // Make sure the closing <td> is there (and possibly whitespace) because
        // otherwise the filter form matches this.
        $this->assertPattern("/$this->CandID([ \t\n\r]*)<\/td>/", "Could not find $this->CandID with filters for review done and CandID");
        // Might not have found the row but have too many other
        // rows, so make sure there's only 1 row.
        // Make sure there's no 2 surrounded by whitespace in 
        // a table cell.
        $this->assertNoPattern("/>([ \t\n\r]*)2([ \t\n\r]*)<\/td>/", "Multiple rows returned for $this->CandID with filters for review done and CandID");

    }

}
?>
