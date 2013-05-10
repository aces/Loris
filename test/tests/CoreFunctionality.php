<?php
require_once 'LorisTest.php';

class TestOfLoris extends LorisTest {

    // Test basic database connection works from config.xml
    function testDatabase() {
        $this->DB->select("SELECT 'x' FROM DUAL", $result);
        $this->assertTrue($result[0]['x'] == 'x');
        $this->assertFalse($result[0]['x'] == 'y');

        $this->DB->select("SELECT * FROM users WHERE UserID='UnitTester'", $result);
        $row = $result[0];
        $this->assertTrue($row['UserID'] == 'UnitTester');
        $salt = substr($row['Password_md5'], 0, 2);
        $this->assertTrue($row['Password_md5'] == ($salt . md5($salt . '4test4')));
        $this->assertFalse($row['Password_md5'] == User::md5_salt('notrealpassword'));
    }

    // Test that we can log in, and that accessing invalid pages
    // give a 404
    function testHomepage() {
        $response = $this->get($this->url . '/main.php');
        $this->assertResponse(200);
        $this->assertTitle($this->config->getSetting("title"));
        $this->assertNoPattern("/Welcome to the Database/");
        $this->login("UnitTester", "4test4");
        $this->assertResponse(200);
        //print_r($this);
        $this->assertPattern("/Welcome to the Database/");
        $this->get($this->url . "/main.php?test_name=doesntexist");
        $this->assertResponse(404);
    }

    // Test that tabs we don't have permission for give a permission denied error
    function testPermDenied() {
        // remove all permissions at the start of the test, then reinsert them at the end to restore the
        // state to what it was before
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));
        $this->login("UnitTester", "4test4");

        $Tabs = $this->config->getSetting("main_menu_tabs");
        foreach ($Tabs['tab'] as $Tab) {
            // Only test tabs that are in use
            if($Tab['visible'] == 0) continue;
            // FIXME: candidate_list permission is special because it depends on the studySite.
            // This should probably be tested separately by toggling the studySite bit,
            // but for now just exclude it.
            if($Tab['link'] == 'candidate_list') continue;
            // Only test things that have permissions required in the config file
            if(empty($Tab['permissions'])) continue;
            $url = $this->url . "/main.php?test_name=$Tab[link]";
            $this->get($url);
            $this->assertResponse(403, "Did not get denied for $url");
            $this->assertPattern("/You do not have access to this page./");
        }
        $this->DB->run("INSERT INTO user_perm_rel SELECT 999990, PermID FROM permissions");
    }

    // Test that none of the tabs have junk before the doctype
    function testTabs() {
        $this->login("UnitTester", "4test4");
        $Tabs = $this->config->getSetting("main_menu_tabs");
        foreach ($Tabs['tab'] as $Tab) {
            if($Tab['visible'] == 0) continue;
            $url = $this->url . "/main.php?test_name=$Tab[link]";
            $this->get($url);
            // The UnitTester created has all permissions, so it should always be 200 response code
            $this->assertResponse(200);
            $this->assertNoPattern("/The following errors occured/");
            $this->assertPattern('/^<!DOCTYPE/', "Leftover debugging messages returned on: " . $url);
            $this->assertNoApacheError("Error in Apache log on $url");
        }
    }

    // Helper function to randomly insert data into the form on the current page, then click Save Data. 
    function _testSave($AnswerStatus) {
        // SimpleTest doesn't have any way to get form elements, so we need to go through the raw data structure to get a list
        // of all the elements
        $FormElements = $this->getBrowser()->_page->getFormBySubmit(new SimpleByLabel("Save Data"))->_widgets;
        if(is_array($FormElements)) {
            foreach($FormElements as &$Element) {
                $name = $Element->getName();
                if($Element instanceof MultipleSelectionTag) {
                    // If it's multiple select, select element 0 and 1, just because
                    $this->setField($name, array(1, 0));
                } elseif($Element instanceof SimpleSelectionTag) {
                    // If it's a dropdown, select the second element (since the first one would be blank/null in most cases)
                    // If it's a _status, select blank/null instead of not answered.
                    if(preg_match("/.*_status/", $name)) {
                        $Choice = $Element->_options[$AnswerStatus];
                    } else { 
                        $Choice = $Element->_options[1];
                    }
                    $this->setField($name, $Choice->getValue());
                } else {
                    // Otherwise it's most likely a text element, so set the value to something arbitrary. 
                    // We use "1" since there might be a rule that the data needs to be numeric in some instruments
                    $this->setField($name, 1);
               }
            }
        }
        $this->clickSubmit("Save Data");
    }

    // Access each instrument to make sure there's no errors, 
    // if testModify is true, enter garbage data and make sure
    // there's no errors
    function testIntruments() {
        $DDE_instruments = $this->config->getSetting("DoubleDataEntryInstruments");
        if($this->CandID) {
            $this->DB->selectRow("SELECT *, s.ID as SessionID FROM session s JOIN candidate c using (CandID) WHERE c.CandID=" . $this->CandID, &$Candidate);

        } else {
            $this->DB->selectRow("select *, s.ID as SessionID from session s join candidate c using (CandID) where c.pscid not like 'dcc%' and c.pscid <> 'scanner' and s.Active='Y' and s.Visit_label='v06' AND s.CenterID = 1 order by s.ID desc limit 1 ", &$Candidate);
        }
        $this->DB->select("select * from test_battery where AgeMinDays <=180 and SubprojectID=" . $Candidate['SubprojectID'], &$Battery);

        $this->DB->select("select * from flag where SessionID=$Candidate[SessionID] AND CommentID NOT LIKE 'DDE%'", &$CommentIDs);
        
        //$this->assertEqual(count($Battery), count($CommentIDs), "Missing CommentIDs for $Candidate[CandID]");

        $this->login("UnitTester", "4test4");
        $this->assertPattern("/Welcome to the Database/");

        foreach($CommentIDs as $Flag) {
            if(isset($this->ignoreInstruments) && in_array($Flag['Test_name'], $this->ignoreInstruments)) {
                continue;
            }
            
            //print "Accessing $Flag[CommentID]\n";
            $url = $this->url .  "/main.php?test_name=$Flag[Test_name]&candID=$Candidate[CandID]&sessionID=$Flag[SessionID]&commentID=$Flag[CommentID]";
            $this->get($url);
            $this->assertResponse(200);

            // Since  the wrong error code is sometimes returned, also assert the following..
            $this->assertNoPattern("/The following errors occured/");
            // Make sure there's no debugging messages left behind
            $this->assertPattern('/^<!DOCTYPE/', "Leftover debugging messages returned for $Flag[Test_name], CommentID: $Flag[CommentID] URL: " . $url);

            if($this->RunDangerousTests === true) {
                // First test with _status fields equal to answered, then
                //print "Saving $Flag[CommentID] with _status answered\n";
                $this->_testSave(0);
                $this->assertNoPattern("/The following errors occured/");
                $this->assertPattern('/^<!DOCTYPE/', "Unhandled error while saving $Flag[Test_name], CommentID: $Flag[CommentID] URL: " . $url);
                // Then test with them equal to not answered
                $this->_testSave(1);
                //print "Saving $Flag[CommentID] with _status not_answered\n";
                $this->assertNoPattern("/The following errors occured/");
                $this->assertPattern('/^<!DOCTYPE/', "Unhandled error while saving $Flag[Test_name], CommentID: $Flag[CommentID] URL: " . $url);
                // TODO: Go through subpages of the instrument here.
            }


            // Also check DDE, if applicable.. but just access the pages, don't bother saving since it's already been tested above.
            if(in_array($Flag['Test_name'], $DDE_instruments)) {
                $this->get($this->url . "/main.php?test_name=$Flag[Test_name]&sessionID=$Flag[SessionID]&commentID=DDE_$Flag[CommentID]");
                $this->assertResponse(200);
                $this->assertPattern('/^<!DOCTYPE/', "Leftover debugging messages returned in DDE for $Flag[Test_name], CommentID: $Flag[CommentID]");
                $this->assertNoPattern("/The following errors occured/");
            }
        }

    }


}
?>
