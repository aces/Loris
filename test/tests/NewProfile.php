<?php
require_once 'LorisTest.php';

class TestOfNewProfile extends LorisTest {

    function testNPLoggedOut() {
        $this->get($this->url . "/main.php?logout=true");
        $this->get($this->url . "/main.php?test_name=new_profile");
        // Returns 200, but with the login page if not logged in
        //$this->assertResponse(403, "Could access new_profile while logged out");
        $this->assertPattern("/Password/", "Could access new_profile logged out");
    }

    function testNPGetPage() {
        $this->login("UnitTester", "4test4");
        $this->get($this->url . "/main.php?test_name=new_profile");
        $this->assertResponse(200, "Could not access new_profile as UnitTester");
        $this->assertPattern("/New Profile/", "Page does not appear to have New Profile header");
    }

    function testNPPostPage() {
        $this->login("UnitTester", "4test4");
        // If any of these are buggy, data could be created..
        if($this->RunDangerousTests) {
            $this->post($this->url . '/main.php', array(
                'test_name' => 'new_profile'
            ));
            $this->assertPattern("/Date of Birth is required/", "Not enforcing DoB requirement");

            $this->post($this->url . '/main.php', array(
                'test_name' => 'new_profile',
                'dob1' => array('Y' => 2009, 'M' => 5, 'd' => 1)
            ));
            $this->assertNoPattern("/Date of Birth is required/", "Not enforcing DoB requirement");

            $this->post($this->url . '/main.php', array(
                'test_name' => 'new_profile',
                'dob1' => array('Y' => 2009, 'M' => 5, 'd' => 1),
                'dob2' => array('Y' => 2008, 'M' => 5, 'd' => 1)
            ));
            $this->assertPattern("/Date of Birth fields must match/", "Not enforcing DoB matching");

            $this->post($this->url . '/main.php', array(
                'test_name' => 'new_profile',
                'dob1' => array('Y' => 2009, 'M' => 5, 'd' => 1),
                'dob2' => array('Y' => 2009, 'M' => 5, 'd' => 1),
            ));
            $this->assertNoPattern("/Date of Birth fields must match/", "Incorrectly enforcing DoB matching");
            $this->assertPattern("/Gender is required/", "Not checking gender input");

            $this->post($this->url . '/main.php', array(
                'test_name' => 'new_profile',
                'dob1' => array('Y' => 2009, 'M' => 5, 'd' => 1),
                'dob2' => array('Y' => 2009, 'M' => 5, 'd' => 1),
                'gender' => 'Male'
            ));
            $this->assertPattern("/New candidate created/", "Candidate not created properly when all input given");

            // Delete permission, make sure we get permission denied
            $this->DB->delete("user_perm_rel", array("UserID" => '999990'));
            $this->post($this->url . '/main.php', array(
                'test_name' => 'new_profile',
                'dob1' => array('Y' => 2009, 'M' => 5, 'd' => 1),
                'dob2' => array('Y' => 2009, 'M' => 5, 'd' => 1),
                'gender' => 'Male'
            ));
            $this->assertNoPattern("/New candidate created/", "Candidate created when missing permission");
            $this->assertResponse(403, "Did not get 403 when missing permission");

            // Clean up created candidates 
            $this->DB->delete("candidate", array("UserID" => 'UnitTester'));
        }
    }

}
?>
