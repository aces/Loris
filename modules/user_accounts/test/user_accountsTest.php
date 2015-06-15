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
    /**
     * Tests that, when loading the User accounts module, some
     * text appears in the body.
     *
     * @return void
     */
    function testUserAccountsDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=user_accounts");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("User Accounts", $bodyText);
    }

    /**
     * Tests that, when loading the User accounts module > edit_user submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testUserAccountsEditUserDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=user_accounts&subtest=edit_user");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Edit User", $bodyText);

        $this->assertEquals(
            "password",
            $this->webDriver->findElement(WebDriverBy::Name("Password_md5"))->getAttribute("type")
        );
        $this->assertEquals(
            "checkbox",
            $this->webDriver->findElement(WebDriverBy::Name("NA_Password"))->getAttribute("type")
        );
        $this->assertEquals(
            "password",
            $this->webDriver->findElement(WebDriverBy::Name("__Confirm"))->getAttribute("type")
        );
    }

    /**
     * Tests that, when loading the User accounts module > my_preference submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testUserAccountsMyPreferencesDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=user_accounts&subtest=my_preferences");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("My Preferences", $bodyText);
    }
}
?>
