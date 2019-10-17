<?php
/**
 * Module create_timepoint automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests"
    . "/LorisIntegrationTestWithCandidate.class.inc";

/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CreateTimepointTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * It does the setUp before running the tests
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
    }

    /**
     * It does the tearDown after running the tests
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointDoespageLoad()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/".
            "?candID=900000&identifier=900000&subprojectID=1"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Create Time Point", $bodyText);
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepoint()
    {
        $this->_createTimepoint('900000', '1', '1', '1');
        $bodyText = $this->webDriver->executescript(
            "return document.querySelector('h3').textContent"
        );
        $this->assertContains("Actions:", $bodyText);

    }

    /**
     * Create a timepoint with three parameters.
     *
     * @param string $canID      ID of candidate
     * @param string $subproject text of subproject
     * @param string $visit      text of visit label
     * @param string $project    text of project
     *
     * @return void
     */
    private function _createTimepoint($canID, $subproject, $visit, $project): void
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=" . $canID .
            "&identifier=" .$canID
        );
        $this->reactDropdownSendKey("#subproject", $subproject);
        $this->reactDropdownSendKey("#psc", $project);
        $this->reactDropdownSendKey("#visit", $visit);
        $this->webDriver->executescript(
            "document.querySelector('.col-sm-9 > .btn').click()"
        );
        sleep(1);
    }


    /**
     * Tests that, create a timepoint and input a empty subproject
     * get Error message
     *
     * @return void
     */
    function testCreateTimepointErrorEmptySubproject(): void
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $this->webDriver->findElement(WebDriverBy::Name("fire_away"))->click();
        $bodyText = $this->webDriver->getPageSource();
        $this->assertNotContains(
            "New time point successfully registered.",
            $bodyText
        );

    }
    /**
     * Tests that timepoint loads with the permission
     *
     * @return void
     */
    public function testCreateTimepointPermission(): void
    {
        $this->setupPermissions(array("data_entry"));
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();

        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Select a value in a react dropdown list
     *
     * @param string $ui    the result of React element (css selector)
     * @param string $value input a value
     *
     * @return void
     */
    function reactDropdownSendKey($ui,$value): void
    {
         $attempts = 0;
         $err      = null;
        do {
            try {
                $this->webDriver->executescript(
                    "input = document.querySelector('$ui');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
                );
            } catch (Exception $e) {
                //   echo 'Caught exception: ',  $e->getMessage(), "\n";
                        $err = $e;
                        $attempts++;
                        sleep(1);
                        continue;
            }
            break;
        } while ($attempts < 5);
        if ($err && $attempts > 4) {
            echo 'Caught exception: ',  $err->getMessage(), "\n";
        }

    }
}

