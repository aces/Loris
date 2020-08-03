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

        $username = $this->webDriver->findElement(WebDriverBy::Name("username"));
        $this->assertEquals('', $username->getAttribute("value"));

        $password = $this->webDriver->findElement(WebDriverBy::Name("password"));
        $this->assertEquals('', $password->getAttribute("value"));

        $login = $this->webDriver->findElement(WebDriverBy::Name("login"));
        $this->assertEquals('submit', $login->getAttribute("type"));
        $this->assertEquals('Login', $login->getAttribute("value"));

        $username->sendKeys("UnitTester");
        $password->sendKeys("IJUSTMADETHISUP");

        $login->click();

        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Incorrect username or password", $bodyText);
    }

    /**
     * Ensures that login succeeds with valid credentials.
     *
     * @return void
     */
    function testLoginSuccess()
    {
        $this->webDriver->get($this->url . '/?logout=true');
        $username = $this->webDriver->findElement(WebDriverBy::Name("username"));
        $this->assertEquals('', $username->getAttribute("value"));

        $password = $this->webDriver->findElement(WebDriverBy::Name("password"));
        $this->assertEquals('', $password->getAttribute("value"));

        $login = $this->webDriver->findElement(WebDriverBy::Name("login"));
        $this->assertEquals('submit', $login->getAttribute("type"));
        $this->assertEquals('Login', $login->getAttribute("value"));

        $username->sendKeys("UnitTester");
        $password->sendKeys($this->validPassword);

        $login->click();

        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Welcome", $bodyText);
    }
}

