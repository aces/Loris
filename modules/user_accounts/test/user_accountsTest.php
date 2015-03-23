<?php
/**
 * User accounts automated integration tests
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
class user_accountsTestIntegrationTest extends LorisIntegrationTest
{
    protected $url = 'http://localhost/main.php?test_name=user_accounts';

    /**
     * Tests that, when loading the User accounts module, some
     * text appears in the body.
     *
     * @return void
     */
    function testUserAccountsDoespageLoad()
    {
        $this->webDriver->get($this->url);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("user_accounts", $bodyText);
    }
}
?>