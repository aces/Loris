<?php declare(strict_types=1);

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
use Facebook\WebDriver\WebDriverBy;
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
    /**
     * Contents (columns) of the session table displayed when accessing
     * the time point list page for candidate TST0001.
     */
    private static $_TST0001_SESSION = [
        'Test',
        '',
        'DCC',
        'Pumpernickel',
        'Not Started',
        '-',
        '',
        '-',
        '',
        '',
        '',
    ];

    /**
     * Candidate ID for candidate TST0001.
     */
    private static $_TST0001_CANDID = 900000;

    /**
     * ID for candidate TST0001.
     */
    private static $_TST0001_CANDIDATEID = 1;


    /**
     * Tests that, when loading the timepoint_list module, some
     * text appears in the body.
     *
     * @return void
     */
    function testTimepointListPageLoad()
    {
        $this->safeGet($this->url . "/" . self::$_TST0001_CANDID . "/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Candidate Profile", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
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
        $sessionTable        = $this->webDriver->findElements(
            WebDriverBy::ClassName('dynamictable')
        );
        $actualSessions      = $sessionTable[1]->findElements(
            WebDriverBy::xpath('.//tbody//tr')
        );
        $numActualSessions   = count($actualSessions);
        $numExpectedSessions = count($expectedSessions);
        $this->assertEquals(
            $numActualSessions,
            $numExpectedSessions,
            "Number of visits should be " . $numExpectedSessions
            . ", not " . $numActualSessions
        );
        for ($i=0; $i<$numActualSessions; $i++) {
            $elements      = $actualSessions[$i]->findElements(
                WebDriverBy::xpath('.//td')
            );
            $actualSession = [];
            foreach ($elements as $e) {
                $actualSession[] = $e->getText();
            }
            $this->assertEquals(
                $expectedSessions[$i],
                $actualSession,
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
            [
                'ID'                    => 2,
                'CandID'                => '900001',
                'PSCID'                 => 'TST0002',
                'RegistrationCenterID'  => 1,
                'RegistrationProjectID' => 1,
                'Active'                => 'Y',
                'UserID'                => 1,
                'Entity_type'           => 'Human',
            ]
        );

        // Session for candidate TST0002: should not be listed on the page
        $this->DB->insert(
            'session',
            [
                'ID'          => '999998',
                'CandidateID' => 2,
                'Visit_label' => 'Test',
                'CenterID'    => 1,
                'ProjectID'   => 1,
            ]
        );

        // Inactive session for candidate TST0001: should not appear
        // on the page
        $this->DB->insert(
            'session',
            [
                'ID'          => '999997',
                'CandidateID' => 1,
                'Visit_label' => 'Test2',
                'CenterID'    => 1,
                'ProjectID'   => 1,
                'Active'      => 'N',
            ]
        );
        $this->safeGet(
            $this->url . "/" .  self::$_TST0001_CANDID . "/"
        );
        $this->_validateSessionTableContents([self::$_TST0001_SESSION]);
        $this->DB->delete('session', ['ID' => '999997']);
        $this->DB->delete('session', ['ID' => '999998']);
        $this->DB->delete('candidate', ['CandID' => 900001]);
    }
}

