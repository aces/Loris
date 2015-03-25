<?php
/**
 * help_editor automated integration tests
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
class helpEditorTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the help_editor module, some
     * text appears in the body.
     *
     * @return void
     */
    function testHelpEditorDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=help_editor");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Help Editor", $bodyText);
    }
    /**
     * Tests that, when loading the help_editor module > edit help submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testHelpEditorEditHelpContentDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=help_editor&subtest=edit_help_content");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Edit Help Content", $bodyText);
    }
}
?>