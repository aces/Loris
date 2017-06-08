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
class FinalRadiologicalReviewTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Setup the testing data
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        //Insert two violation scan
        $this->DB->insert(
            "psc",
            array(
             'CenterID'  => '55',
             'Name'      => 'TESTinPSC',
             'Alias'     => 'tst',
             'MRI_alias' => 'test',
            )
        );
        $this->DB->insert(
            "candidate",
            array(
             'CandID'      => '999888',
             'CenterID'    => '55',
             'UserID'      => '1',
             'PSCID'       => '8888',
             'ProjectID'   => '7777',
             'Entity_type' => 'Human',
             'Active'      => 'Y',
            )
        );
        $this->DB->insert(
            "session",
            array(
             'ID'           => '222222',
             'CandID'       => '999888',
             'CenterID'     => '55',
             'UserID'       => '1',
             'MRIQCStatus'  => 'Pass',
             'SubprojectID' => '6666',
             'Active'       => 'Y',
            )
        );
         $this->DB->insert(
             "flag",
             array(
              'ID'         => '111111',
              'SessionID'  => '222222',
              'Test_name'  => 'TestName11111111111',
              'CommentID'  => 'commentID111',
              'Data_entry' => 'In Progress',
             )
         );
          $this->DB->insert(
              "final_radiological_review",
              array(
               'CommentID'            => 'CommentID111',
               'Final_Review_Results' => 'not_answered',
              )
          );
    }
    /**
     * Delete the test data
     *
     * @return void
     */
    public function tearDown()
    {
        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->delete(
            "issues",
            array('issueID' => '999999')
        );
        $this->DB->delete(
            "final_radiological_review",
            array('CommentID' => 'CommentID111')
        );
        $this->DB->delete(
            "session",
            array('ID' => '222222')
        );
        $this->DB->delete(
            "candidate",
            array(
             'CandID'   => '999888',
             'CenterID' => '55',
            )
        );
        $this->DB->delete(
            "psc",
            array(
             'CenterID' => '55',
             'Name'     => 'TESTinPSC',
            )
        );
        $this->DB->delete(
            "flag",
            array('CommentID' => 'commentID111')
        );
        $this->DB->run('SET foreign_key_checks =1');
        parent::tearDown();
    }
    /**
     * Tests that the final Radiological Review loads if the user has the correct
     * permissions (edit_final_radiological_review or
     * view_final_radiological_review)
     * It should only be able to see the menu item.
     *
     * @return void
     */
    function testFinalRadiologicalReviewLoadsWithPermission()
    {
        $this->setupPermissions(array("view_final_radiological_review"));
        $this->safeGet($this->url . "/final_radiological_review/");

        // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);

        $this->resetPermissions();
    }
    /**
     * Tests that the final Radiological Review loads if the user has the correct
     * permissions (edit_final_radiological_review or view_final_radiological_review)
     * It should only be able to see the menu item.
     * @return void
     */
    function testFinalRadiologicalReviewLoadsWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/final_radiological_review/");

    // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);

        $this->resetPermissions();
    }



}
?>
