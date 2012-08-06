<?php
require_once 'LorisTest.php';

class TestOfCandidateList extends LorisTest {

    function testCLLoggedOut() {
        $this->get($this->url . "/main.php?logout=true");
        $this->get($this->url . "/main.php?test_name=candidate_list");
        // Returns 200, but with the login page if not logged in
        //$this->assertResponse(403, "Could access new_profile while logged out");
        $this->assertPattern("/Password/", "Could access candidate_list logged out");
    }

    function testCLGetPage() {
        $this->login("UnitTester", "4test4");
        $this->get($this->url . "/main.php?test_name=candidate_list");
        $this->assertBasicConditions();
        $this->assertResponse(200, "Could not access candidate_list as UnitTester");
        $this->assertPattern("/Access Profile/", "Page does not appear to have Access Profile header");
        $this->assertNoPattern("/Password/", "lolwhat");
    }

    /*
    function testPostPage() {
        $this->login("UnitTester", "4test4");
        // If any of these are buggy, data could be created..
        if($this->RunDangerousTests) {
        }
    }*/

}
?>
