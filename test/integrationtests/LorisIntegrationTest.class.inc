<?php
abstract class LorisIntegrationTest extends PHPUnit_Framework_TestCase
{
    protected $webDriver;

    public function setUp()
    {
        // Set up database wrapper and config
        $this->config = NDB_Config::singleton(__DIR__ . "/../../project/config.xml");
        $database = $this->config->getSetting('database');

        $this->DB = Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            1
        );

        // Create a UnitTester user with all permissions.
        $this->DB->delete("users", array("UserID" => 'UnitTester'));
        $this->DB->delete("users", array("ID"     => '999990'));
        $this->DB->delete("user_perm_rel", array("userID" => '999990'));


        try {
        $this->DB->insert(
            "users",
            array(
                'ID' => 999990,
                'UserID' => 'UnitTester',
                'Real_name' => 'Unit Tester',
                'First_name' => 'Unit',
                'Last_name' => 'Tester',
                'Email' => 'tester@example.com',
                'CenterID' => 1,
                'Privilege' => 0,
                'PSCPI' => 'N',
                'Active' => 'Y',
                'Examiner' => 'N',
                'Password_md5' => 'a601e42ba82bb37a68ca3c8b7752f2e222',
                'Password_hash' => null,
                'Password_expiry' => '2099-12-31',
                'Pending_approval' => 'N'
            )
        );
        } catch(DatabaseException $e) {
            print_r($e);
        }
        $this->DB->run(
            "INSERT INTO user_perm_rel SELECT 999990, PermID FROM permissions"
        );
        print_r($this->DB->pselect("SELECT * FROM users WHERE UserID='UnitTester'", array()));

        // Set up WebDriver implementation and login
        $capabilities = array(\WebDriverCapabilityType::BROWSER_NAME => 'firefox');
        $this->webDriver = RemoteWebDriver::create('http://localhost:4444/wd/hub', $capabilities);
        print_r($this->webDriver);

        $this->login("UnitTester", "4test4");

    }

    protected function login($username, $password) {
        $this->webDriver->get('http://localhost/main.php');
        print $this->webDriver->getPageSource();
        try {
            $usernameEl = $this->webDriver->findElement(WebDriverBy::Name("username"));
            $passwordEl = $this->webDriver->findElement(WebDriverBy::Name("password"));

            $usernameEl->sendKeys($username);
            $passwordEl->sendKeys($password);

            $login= $this->webDriver->findElement(WebDriverBy::Name("login"));

            $login->click();
        } catch(Exception $e) {
            print "This is a test?";
        }

    }
    public function tearDown()
    {

        // Delete the temporary user.
        $this->DB->delete("users", array("UserID" => 'UnitTester'));
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));
        // Close the browser and end the session
        if($this->webDriver) {
            $this->webDriver->quit();
        }
    }
}
?>
