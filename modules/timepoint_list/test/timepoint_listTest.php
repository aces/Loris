<?php
/**
 * Timepoint_list automated integration tests
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
 * TimepointListIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class TimepointListIntegrationTest extends LorisIntegrationTestWithCandidate
{
    private static $_TEST_SESSION = array(
                                     'Test',
                                     '',
                                     '',
                                     '',
                                     '',
                                     '-',
                                     '',
                                     '-',
                                     '',
                                     '',
                                     '',
                                    );
    /**
     * Tests that, when loading the timepoint_list module, some
     * text appears in the body.
     *
     * @return void
     */
    function testTimepointListPageLoad()
    {
        $this->safeGet($this->url . "/timepoint_list/?candID=000000");
        $this->_validateSessionTableContents(array(self::$_TEST_SESSION));
    }
    /**
     * Checks the contents of the session table and compares it against an expected
     * result.
     *
     * @param array $expectedSessions list of all the expected sessions.
     *
     * @return void
     */
    private function _validateSessionTableContents($expectedSessions)
    {
        $sessionTable   = $this->webDriver->findElements(
            WebDriverBy::ClassName('dynamictable')
        );
        $actualSessions = $sessionTable[1]->findElements(
            WebDriverBy::xpath('.//tbody//tr')
        );
        $this->assertEquals(
            count($actualSessions),
            count($expectedSessions),
            "Number of visits should be " . count($expectedSessions)
            . ", not " . count($actualSessions)
        );
        for ($i=0; $i<count($actualSessions); $i++) {
            $elements      = $actualSessions[$i]->findElements(
                WebDriverBy::xpath('.//td')
            );
            $actualSession = array();
            foreach ($elements as $e) {
                $actualSession[] = $e->getText();
            }
            $this->assertEquals(
                $actualSession,
                $expectedSessions[$i],
                "Sessions at row $i differ"
            );
        }
    }
    /**
     * Tests that the correct sessions are retrieved from the
     * database and displayed on the page for the given candidate.
     *
     * @return void
     */
    function testTimepointFilteringRules()
    {
        // Candidate TST0002
        $this->DB->insert(
            "candidate",
            array(
             'CandID'      => '000001',
             'PSCID'       => 'TST0002',
             'CenterID'    => 1,
             'Active'      => 'Y',
             'UserID'      => 1,
             'Entity_type' => 'Human',
            )
        );
        // Session for candidate TST0002: should not be listed on the page
        $this->DB->insert(
            'session',
            array(
             'ID'          => '999998',
             'CandID'      => '000001',
             'Visit_label' => 'Test',
             'CenterID'    => 1,
            )
        );
        // Inactive session for candidate TST0001: should not appear
        // on the page
        $this->DB->insert(
            'session',
            array(
             'ID'          => '999997',
             'CandID'      => '000000',
             'Visit_label' => 'Test2',
             'CenterID'    => 1,
             'Active'      => 'N',
            )
        );
        $this->safeGet($this->url . "/timepoint_list/?candID=000000");
        $this->_validateSessionTableContents(array(self::$_TEST_SESSION));
        $this->DB->delete('session', array('ID' => '999997'));
        $this->DB->delete('session', array('ID' => '999998'));
        $this->DB->delete('candidate', array('CandID' => 1));
    }
}
?>