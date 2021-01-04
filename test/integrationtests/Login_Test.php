<?php
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ . '/LorisIntegrationTest.class.inc';

/**
 * {{@inheritDoc}}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class LorisLoginTest extends LorisIntegrationTest
{
    /**
     * Ensures that login fails with invalid credentials.
     *
     * @return void
     */
    function testLoginFailure(): void
    {
        $this->webDriver->get($this->url . '/?logout=true');

        $invalidPassword = 'Just Make This Up';
        $this->login("UnitTester", $invalidPassword);

        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "Incorrect username or password",
            $bodyText
        );
    }

    /**
     * Ensures that login succeeds with valid credentials.
     *
     * @return void
     */
    function testLoginSuccess()
    {
        $this->webDriver->get($this->url . '/?logout=true');
        $this->login("UnitTester", $this->validPassword);
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Welcome", $bodyText);
    }
}

