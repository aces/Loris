<?php
require_once __DIR__ . '/LorisIntegrationTest.class.inc';
class LorisLoginTest extends LorisIntegrationTest
{
    function testLoginFailure()
    {
       $this->webDriver->get($this->url . '/main.php?logout=true');

       $username = $this->webDriver->findElement(WebDriverBy::Name("username"));
       $this->assertEquals('', $username->getAttribute("value"));

       $password = $this->webDriver->findElement(WebDriverBy::Name("password"));
       $this->assertEquals('', $password->getAttribute("value"));


       $login= $this->webDriver->findElement(WebDriverBy::Name("login"));
       $this->assertEquals('submit', $login->getAttribute("type"));
       $this->assertEquals('Login', $login->getAttribute("value"));

       $username->sendKeys("UnitTester");
       $password->sendKeys("IJUSTMADETHISUP");

       $login->click();

       $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
       $this->assertContains("Incorrect email or password", $bodyText);
    }

    function testLoginSuccess()
    {
       $this->webDriver->get($this->url . '/main.php?logout=true');
       $username = $this->webDriver->findElement(WebDriverBy::Name("username"));
       $this->assertEquals('', $username->getAttribute("value"));

       $password = $this->webDriver->findElement(WebDriverBy::Name("password"));
       $this->assertEquals('', $password->getAttribute("value"));


       $login= $this->webDriver->findElement(WebDriverBy::Name("login"));
       $this->assertEquals('submit', $login->getAttribute("type"));
       $this->assertEquals('Login', $login->getAttribute("value"));

       $username->sendKeys("UnitTester");
       $password->sendKeys("4test4");

       $login->click();

       $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
       $this->assertContains("Welcome", $bodyText);
    }
}
?>
