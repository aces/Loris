<?php
/**
 * Mri_violations automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class MriViolationsTestIntegrationTest extends LorisIntegrationTest
{

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return none
     */
    public function setUp(){
        parent::setUp();

        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
                'ID' => 1,
                'CandID' => 894226,
                'PSCID' => 654336,
                'time_run' => '2015-05-24 16:54:55',
                'series_description' => 'MPRAGE_ipat2',
                'minc_location' => '/tmp/TarLoad-16-41-4h1dt6/654336_894226_v1_20140520_095422_2_mri.mnc',
                'PatientName' => '654336_894226_V1',
                'TR_range' => 2300,
                'TE_range' => 2.98,
                'TI_range' => 900,
                'slice_thickness_range' => 1,
                'xspace_range' => 192,
                'yspace_range' => 256,
                'zspace_range' => 256,
                'xstep_range' => -0.999999999999984,
                'ystep_range' => -1.,
                'zstep_range' => -1.,
                'time_range' => NULL,
                'SeriesUID' => '1.3.12.2.1107.5.2.32.35056.2014052010013588535519445.0.0.0',
            )
        );

        $this->DB->insert(
            "violations_resolved",
            array(
                'ID' => 51,
                'hash' => '999ce2ad956ffecf03c1f33963de2c1b',
                'ExtID' => 3,
                'TypeTable' => 'mri_protocol_violated_scans',
                'User' => 'admin',
                'ChangeDate' => '2015-07-27 16:24:05',
                'Resolved' => 'rejected',
            )
        );

        $this->DB->insert(
            "candidate",
            array(
                'ID' => 58,
                'CandID' => 176648,
                'PSCID' => 'LCS0002',
                'ExternalID' => NULL,
                'DoB' => '2006-12-06',
                'EDC' => NULL,
                'Gender' => 'Female',
                'CenterID' => 2,
                'ProjectID' => 1,
                'Ethnicity' => NULL,
                'Active' => 'Y',
                'Date_active' => '2016-01-20',
                'RegisteredBy' => 'admin',
                'UserID' => 'admin',
                'Date_registered' => '2016-01-20',
                'flagged_caveatemptor' => 'false',
                'flagged_reason' => NULL,
                'flagged_other' => NULL,
                'flagged_other_status' => NULL,
                'Testdate' => '2016-01-20 11:51:27',
                'Entity_type' => 'Human',
                'ProbandGender' => NULL,
                'ProbandDoB' => NULL,
            )
        );

        $this->DB->insert(
            "mri_scan_type",
            array(
                'ID' => 40,
                'Scan_type' => 'fMRI',
            )
        );
        $this->DB->insert(
            "mri_scan_type",
            array(
                'ID' => 41,
                'Scan_type' => 'flair',
                )
        );

        $this->DB->insert(
            "session",
            array(
                'ID' => 39,
                'CandID' => 690316,
                'CenterID' => 2,
                'VisitNo' => 1,
                'Visit_label' => 'Initial_Assessment_Screening',
                'SubprojectID' => 7,
                'Submitted' => 'N',
                'Current_stage' => 'Visit',
                'Date_stage_change' => '2016-01-18',
                'Screening' => NULL,
                'Date_screening' => NULL,
                'Visit' => 'In Progress',
                'Date_visit' => '2016-01-01',
                'Approval' => NULL,
                'Date_approval' => NULL,
                'Active' => 'Y',
                'Date_active' => '2016-01-18',
                'RegisteredBy' => 'admin',
                'UserID' => 'admin',
                'Date_registered' => '2016-01-18',
                'Testdate' => '2016-01-18 15:54:16',
                'Hardcopy_request' => '-',
                'BVLQCStatus' => NULL,
                'BVLQCType' => NULL,
                'BVLQCExclusion' => NULL,
                'QCd' => NULL,
                'Scan_done' => 'Y',
                'MRIQCStatus' => '',
                'MRIQCPending' => 'N',
                'MRIQCFirstChangeTime' => NULL,
                'MRIQCLastChangeTime' => NULL,
            )
        );

        $this->DB->insert(
            "psc",
            array(
                'CenterID' => 1,
                'Name' => 'Data Coordinating Center',
                'StateID' => 0,
                'Alias' => 'DCC',
                'MRI_alias' => 'DCC',
                'Study_site' => 'Y',
            )
        );

        $this->DB->insert(
            "MRICandidateErrors",
            array(
                'ID'=> 1,
                'TimeRun' => '2015-03-18 11:37:32',
                'SeriesUID' => '1.3.12.2.1107.5.2.32.35049.2014021711090977356751313.0.0.0',
                'TarchiveID' => 2,
                'MincFile' => '/tmp/TarLoad-11-39-Kx4DGC/2222_506145_v1_20140217_100438_7e1_mri.mnc',
                'PatientName' => '2222_506145_V1',
                'Reason' => 'Visit label does not exist',
            )
        );

        $this->assertContains("hello", "hello");
    }

    /**
     * Tests that, when loading the Mri_violations module, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriViolationsDoesPageLoad()
    {
        $this->webDriver->get($this->url . "/mri_violations/");
        sleep(2);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }

    /**
     * Tests that, when loading the Mri_violations module > mri_protocol_check_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolCheckViolationsDoesPageLoad()
    {
        $this->webDriver->get($this->url . "/mri_violations/mri_protocol_check_violations/");
        sleep(2);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText,
            "Mri Violations module page did not load as expected.");
    }

    /**
     * Verify that MRI Violations module appears in Admin main menu only
     * if the user has permission "violated_scans_view_allsites".
     *
     * @return void
     */
    public function testMriViolationsMenuDisplayWithPermission()
    {
        $this->setupPermissions(array('violated_scans_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->assertTrue(
            $this->isMenuItemPresent('Imaging', 'MRI Violated Scans'),
            "MRI Violations menu must be there if the user has permission"
        );
    }

    /**
     * Verify that MRI Violations module DOES NOT appear in Imaging menu
     * if the user doesn't have permission "violated_scans_view_allsites".
     *
     * @return void
     */
    public function testMriViolationsMenuDisplayWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->webDriver->navigate()->refresh();
        $this->assertFalse(
            $this->isMenuItemPresent('Imaging', 'MRI Violated Scans'),
            "MRI Violations menu must not be there if the user does not ".
            "have permission"
        );
    }

    /**
     * Verify that MRI Violations module
     *
     * @return void
     */
    public function testMriViolationsFilterResults()
    {
        $this->webDriver->get($this->url . "/mri_violations/");
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Name("filter")
            )
        );
        $this->assertContains("Show Data", $this->webDriver->getPageSource());
        $showDataButton = $this->webDriver
            ->findElement(WebDriverBy::Name("filter"));
        //$showDataButton = $this->webDriver
        //    ->findElement(WebDriverBy::cssSelector("input.col-xs-12.btn-primary.btn-sm.btn[value='Show Data'][name='filter'][type='submit']"));

        $showDataButton->click();
        sleep(3);
        $assertText = $this->webDriver->findElement(WebDriverBy::xPath('//*[@id="page"]/div/div[1]/a/label'))->getText();
        $this->assertContains("Mri Violations", $assertText,
            "MRI Violations menu filter did not reload page as expected.");
    }
    /**
     * Cleans up this test by deleting the temporary user that was created and all
     * its permissions. user_login_history also must be purged as it contains a
     * foreign key to users
     *
     * @return none
     */
    public function tearDown()
    {
        parent::setUp();

        // Delete the temporary user.
        $this->DB->delete("mri_protocol_violated_scans", array('ID' => 1));
        $this->DB->delete("violations_resolved", array('ID' => 51));
        $this->DB->delete("candidate", array('ID' => 58));
        $this->DB->delete("mri_scan_type", array('ID' => 40));
        $this->DB->delete("mri_scan_type", array('ID' => 41));
        $this->DB->delete("session", array('ID' => 39));
        $this->DB->delete("psc", array('CenterID' => 1));
        $this->DB->delete("MRICandidateErrors", array('ID' => 1));

        if ($this->webDriver) {
            $this->webDriver->quit();
        }

        $this->factory->reset();
    }

}
?>