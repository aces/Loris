<?php
require_once 'LorisTest.php';

class TestOfCandidateList extends LorisTest
{

    /**
     * Test that the page is not accessible when not logged in
     *
     * @return null
     */
    function testCLLoggedOut()
    {
        $this->get($this->url . "/main.php?logout=true");
        $this->get($this->url . "/main.php?test_name=candidate_list");
        // Returns 200, but with the login page if not logged in
        $this->assertPattern("/Password/", "Could access candidate_list logged out");
    }

    /**
     * Test that the page, when accessed through GET with no parameters
     * appears to have the right structure.
     *
     * @return null
     */
    function testCLGetPage()
    {
        $this->login("UnitTester", "4test4");
        $this->get($this->url . "/main.php?test_name=candidate_list");
        $this->assertResponse(200, "Could not access candidate_list as UnitTester");
        $this->assertPattern(
            "/Access Profile/", "Page does not appear to have Access Profile header"
        );
    }

    /**
     * Test various aspects of posting to the page while logged in.
     * In particular, ensure that:
     *  1. The page loads
     *  2. Results are returned when the filters are empty
     *  3. No results are returned when the filters have junk data
     *  4. Results are returned when the filter has valid data.
     *
     *  Right now, only the DCCID filter is tested.
     *
     *  @return null
     */
    function testCLPostPage()
    {
        $this->login("UnitTester", "4test4");
        $this->get($this->url . "/main.php?test_name=candidate_list");
        $this->assertBasicConditions();
        $this->assertPattern(
            "/Open Profile/", "Open profile header appears to be missing"
        );
        $PostArray = array(
            'test_name'           => 'candidate_list',
            'centerID'            => '',
            'SubprojectID'        => '',
            'DCCID'               => '',
            'PSCID'               => '',
            'Gender'              => '',
            'DoB'                 => '',
            'Latest_Visit_Status' => '',
            'Visit_Count'         => '',
            'Feedback'            => '',
            'ProjectID'           => '',
            'edc'                 => '',
            'filter'              => 'Show Data'
        );
        $this->post($this->url . '/main.php', $PostArray);
        $this->assertBasicConditions();
        $this->assertNoPattern(
            "/No candidates found/", "No candidates found with empty filter"
        );

        $PostArray['DCCID'] = $this->CandID;
        $this->post($this->url . '/main.php', $PostArray);
        $this->assertBasicConditions();
        $this->assertNoPattern(
            "/No candidates found/",
            "No candidates when searching candidate_list for $this->CandID"
        );
        $this->assertPattern(
            "/$this->CandID/", "Did not find $this->CandID in results"
        );

        $PostArray['DCCID'] = "IAmInvalid";
        $this->post($this->url . '/main.php?test_name=candidate_list', $PostArray);
        $this->assertBasicConditions();
        $this->assertPattern(
            "/No candidates found/", "Returned results with invalid DCCID in filter"
        );
    }
}
?>
