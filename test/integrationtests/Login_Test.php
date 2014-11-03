<?php
require_once __DIR__ . '/../../vendor/autoload.php';

class Login_Test extends PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser('firefox');
        $this->setBrowserUrl('http://localhost/');
    }

    public function testLoginFailure()
    {
        //print_r($this->getAvailableDrivers());
        $this->url('/main.php');
        //assert username element exists and doesn't have any
        //data prepopulated.
        $username = $this->byName("username");
        $this->assertEquals('', $username->value());
        //assert password element exists and doesn't have any
        //data prepopulated.
        $password = $this->byName("password");
        $this->assertEquals('', $password->value());

        //ensure a login button exists
        $login = $this->byName("login");
        $this->assertEquals('submit', $login->attribute("type"));
        $this->assertEquals('login', $login->value());

        // Make up a fake username and password, click it, and make
        // sure the page has an "Incorrect username or password" message
        // somewhere on it.
        $username->value("admin");
        $this->assertEquals('admin', $username->value());
        $password->value("IJUSTMADETHISUP");
        $login->click();

        $this->assertContains("Incorrect username or password", $this->byCssSelector("body")->text());
    }

    public function testLoginSuccess()
    {
        $this->url('/main.php');
        $username = $this->byName("username");
        $password = $this->byName("password");

        $username->value("admin");
        $password->value("testpass");

        $login = $this->byName("login");
        $this->assertEquals('submit', $login->attribute("type"));
        $this->assertEquals('login', $login->value());

        $login->click();

        print $this->byCssSelector("body")->text();
        $this->assertContains("Welcome", $this->byCssSelector("body")->text());
    }
}
?>
