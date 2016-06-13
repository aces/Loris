<?php
/**
 * Final_radiological_review automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
 "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class finalRadiologicalReviewTestIntegrationTest extends LorisIntegrationTest
{
/**
 * Final_radiological_review automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
    public function setUp()
    {

        parent::setUp();
        /**
    * Insert testing data
    *
    * @return void
    */
        $this->DB->insert(
            'test_names',
            array(
             'Test_name' => 'testname99',
             'Full_name' => 'testname99',
            )
        );
        $this->DB->insert(
            'psc',
            array(
             'CenterID'  => '99',
             'Name'      => 'DAC',
             'PSCArea'   => 'DAC',
             'StateID'   => 0,
             'Alias'     => 'DAC',
             'MRI_alias' => 'DAC',
            )
        );
        $this->DB->insert(
            'candidate',
            array(
             'CandID'   => '111222',
             'PSCID'    => '111222',
             'CenterID' => '99',
             'DoB'      => '2005-08-16',
            )
        );
        $this->DB->insert(
            'session',
            array(
             'ID'       => '7777',
             'CandID'   => '111222',
             'CenterID' => '99',
            )
        );
        $this->DB->insert(
            'flag',
            array(
             'SessionID'      => '7777',
             'Test_name'      => 'testname99',
             'CommentID'      => 'testcid',
             'Administration' => 'All',
             'Data_entry'     => 'Complete',
            )
        );
        $this->DB->insert(
            'final_radiological_review',
            array(
             'CommentID'            => 'testcid',
             'Final_Review_Results' => 'normal',
             'Final_Exclusionary'   => 'non_exclusionary',
             'SAS'                  => '1',
             'PVS'                  => '1',
            )
        );
        $this->DB->insert(
            'radiology_review',
            array('CommentID' => 'testcid')
        );

    }
    /**
    * Delete testing data
    *
    * @return void
    */
    public function tearDown()
    {
       $this->DB->delete(
           "radiology_review",
            array('CommentID' => 'testcid')
        );

        $this->DB->delete(
            "final_radiological_review",
            array('CommentID' => 'testcid')
        );
        $this->DB->delete(
            "flag",
            array('CommentID' => '111222')
        );
        $this->DB->delete(
            "session",
            array('ID' => '7777')
        );
        $this->DB->delete(
            "candidate",
            array('CandID' => '111222')
        );
        $this->DB->delete(
            "psc",
            array('CenterID' => '99')
        );
        $this->DB->delete(
            "test_names",
            array('Test_name' => 'testname99')
        );

         parent::tearDown();
    }

    /**
     * Tests that the final Radiological Review loads if the user has the correct
     * permissions (edit_final_radiological_review or view_final_radiological_review)
     * It should only be able to see the menu item.
     *
     * @return void
     */
    function testFinalRadiologicalReviewLoadsWithPermission()
    {
        $this->setupPermissions(array("edit_final_radiological_review"));
        $this->safeGet($this->url . "/final_radiological_review/");

        // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "#example-navbar-collapse > ".
                "ul:nth-child(1) > li:nth-child(1) > a"
            )
        )->getText();
        $this->assertContains("Imaging", $bodyText);

        $this->resetPermissions();
    }
    /**
     * Tests that the final Radiological Review loads if the user has the correct
     * permissions (view_final_radiological_review)
     * It should find filter section
     *
     * @return void
     */
    function testPermissionWithViewFinalRadiologicalReview()
    {
        $this->setupPermissions(array("view_final_radiological_review"));
        $this->safeGet($this->url . "/final_radiological_review/");

        // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Selection Filter", $bodyText);

        $this->resetPermissions();
    }
    /**
     * Tests filter section, input some data which database doesn't have
     * and search it, it shows no data is found.
     *
     * @return void
     */
    function testFinalRadiologicalReviewFilterWithNullResult()
    {
        $this->safeGet($this->url . "/final_radiological_review/");

        // search a null data, get nothing found.
        $this->webDriver->findElement(
            WebDriverBy::Name("keyword")
        )->sendKeys("hello test");
        $this->webDriver->findElement(
            WebDriverBy::Name("filter")
        )->click();
        $bodyText =  $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Nothing found", $bodyText);

    }

    /**
     * Tests filter section, input data which database exists
     * and search it, it shows the data.
     *
     * @return void
     */
    function testFinalRadiologicalReviewFilterWithResult()
    {
        $this->safeGet($this->url . "/final_radiological_review/");

        // search a testing data by PSCID, get the result.
        $this->webDriver->findElement(
            WebDriverBy::Name("pscid")
        )->sendKeys("111222");
        $this->webDriver->findElement(
            WebDriverBy::Name("filter")
        )->click();
        $bodyText =  $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "#datatable > div > div > div > ".
                "table > tbody > tr > td:nth-child(3)"
            )
        )->getText();
        $this->assertContains("111222", $bodyText);

        // search a testing data by DCCID, get the result.
        $this->webDriver->findElement(
            WebDriverBy::Name("dccid")
        )->sendKeys("111222");
        $this->webDriver->findElement(
            WebDriverBy::Name("filter")
        )->click();
        $bodyText =  $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "#datatable > div > div > div > ".
                "table > tbody > tr > td:nth-child(3)"
            )
        )->getText();
        $this->assertContains("111222", $bodyText);

    }

    /**
     * Tests filter section,clear button.
     *
     * @return void
     */
    function testFinalRadiologicalReviewFilterClearBtn()
    {
        $this->safeGet($this->url . "/final_radiological_review/");

        $this->webDriver->findElement(
            WebDriverBy::Name("pscid")
        )->sendKeys("111222");
        $this->webDriver->findElement(
            WebDriverBy::Name("reset")
        )->click();
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::Name("pscid")
        )->getText();
        $this->assertEquals("", $bodyText);

    }

}
?>
