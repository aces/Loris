<?php
require_once 'LorisIntegrationTest.class.inc';
class LorisLoginTest extends LorisIntegrationTest
{
    protected $webDriver;

    /*
    public function setUp()
    {
       $capabilities = array(\WebDriverCapabilityType::BROWSER_NAME => 'firefox');
       $this->webDriver = RemoteWebDriver::create('http://localhost:4444/wd/hub', $capabilities);

       $this->webDriver->get('http://localhost/main.php');

       //print "Page source: " . $this->webDriver->getPageSource();

    }
     */

    function testLoginFailure()
    {

       $username = $this->webDriver->findElement(WebDriverBy::Name("username"));
       $this->assertEquals('', $username->getAttribute("value"));

       $password = $this->webDriver->findElement(WebDriverBy::Name("password"));
       $this->assertEquals('', $password->getAttribute("value"));


       $login= $this->webDriver->findElement(WebDriverBy::Name("login"));
       $this->assertEquals('submit', $login->getAttribute("type"));
       $this->assertEquals('login', $login->getAttribute("value"));

       $username->sendKeys("UnitTester");
       $password->sendKeys("IJUSTMADETHISUP");

       $login->click();

       $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
       $this->assertContains("Incorrect username or password", $bodyText);
    }

    function testLoginSuccess()
    {
       $username = $this->webDriver->findElement(WebDriverBy::Name("username"));
       $this->assertEquals('', $username->getAttribute("value"));

       $password = $this->webDriver->findElement(WebDriverBy::Name("password"));
       $this->assertEquals('', $password->getAttribute("value"));


       $login= $this->webDriver->findElement(WebDriverBy::Name("login"));
       $this->assertEquals('submit', $login->getAttribute("type"));
       $this->assertEquals('login', $login->getAttribute("value"));

       $username->sendKeys("UnitTester");
       $password->sendKeys("4test4");

       $login->click();

       print "LOGIN SUCCESS??Page source: " . $this->webDriver->getPageSource();
       $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
       $this->assertContains("Welcome", $bodyText);
    }

    /*
    public function tearDown() {
        $this->webDriver->quit();
    }
     */
}
?>
