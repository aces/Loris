<?php
/**
 * Candidate_list automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
/**
 * CandidateListTestIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CandidateListTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * The expected result when searches successfully retrieve candidate
     *  TST0001.
     *  All items represent the text of each column in the displayed HTML
     *  candidate table.
     */
    private static $_TST0001 = array(
                                '1',
                                'Data Coordinating Center',
                                '900000',
                                'TST0001',
                                '',
                                'Active',
                                '',
                                '',
                                '',
                                '',
                                '1',
                                'Not Started',
                                'None',
                               );
    /**
     * UI elements and locations
     * breadcrumb - 'Access Profile'
     * Table headers
     */
    private $_loadingUI
        =  array(
            'Access Profile'      => '#bc2 > a:nth-child(2) > div',
            'Site'                => '#dynamictable > thead > tr > th:nth-child(2)',
            'PSCID'               => '#PSCID',
            'Gender'              => '#dynamictable > thead>tr>th.dynamictableNext',
            'Entity Type'         => '#dynamictable > thead > tr > th:nth-child(6)',
            'Participant Status'  => '#dynamictable > thead > tr > th:nth-child(7)',
            'Subproject'          => '#dynamictable > thead > tr > th:nth-child(8)',
            'DoB'                 => '#dynamictable > thead > tr > th:nth-child(9)',
            'Scan Done'           => '#dynamictable > thead > tr > th:nth-child(10)',
            'EDC'                 => '#dynamictable > thead > tr > th:nth-child(11)',
            'Visit Count'         => '#dynamictable > thead > tr > th:nth-child(12)',
            'Latest Visit Status' => '#dynamictable > thead > tr > th:nth-child(13)',
            'Feedback'            => '#dynamictable > thead > tr > th:nth-child(14)',
           );
    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();
        $this->setupConfigSetting("useEDC", "true");
    }
    /**
     * Restore the values backed up in the setUp function
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
        $this->restoreConfigSetting("useEDC");
    }
    /**
      * Testing UI elements when page loads
      *
      * @return void
      */
    private function _testPageUIs()
    {
        $this->safeGet($this->url . "/candidate_list/");
        foreach ($this->_loadingUI as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertContains($key, $text);
        }
    }
    /**
      * Testing link of PSCID
      *
      * @return void
      */
    function tests()
    {
      $this->_testPageUIs();
    }
}
?>
