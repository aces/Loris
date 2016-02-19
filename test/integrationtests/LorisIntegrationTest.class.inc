<?php
/**
 * This contains an abstract class for Loris tests to extend.
 * It sets up the database handler, creates a user, creates a
 * webDriver instance, and logs in so that tests can focus on
 * the module being tested and not the overhead of logging in
 * to Loris.
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class LorisIntegrationTest extends PHPUnit_Framework_TestCase
{
    /**
     * A reference to the Selenium WebDriver object for the test
     * to use to script a web browser.
     */
    protected $webDriver;
    protected $config;
    protected $DB;
    protected $url;
    protected $factory;

    private $_oldConfig = array();

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return none
     */
    public function setUp()
    {
        // Set up database wrapper and config
        $this->factory = NDB_Factory::singleton();
        $this->factory->reset();
        $this->factory->setTesting(false);

        $this->config = $this->factory->Config(CONFIG_XML);

        $database = $this->config->getSetting('database');

        $this->DB  = Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            1
        );
        $this->url = $this->config->getSetting("url");

        $this->DB->insert(
            "users",
            array(
             'ID'               => 999990,
             'UserID'           => 'UnitTester',
             'Real_name'        => 'Unit Tester',
             'First_name'       => 'Unit',
             'Last_name'        => 'Tester',
             'Email'            => 'tester@example.com',
             'CenterID'         => 1,
             'Privilege'        => 0,
             'PSCPI'            => 'N',
             'Active'           => 'Y',
             'Password_md5'     => 'a601e42ba82bb37a68ca3c8b7752f2e222',
             'Password_hash'    => null,
             'Password_expiry'  => '2099-12-31',
             'Pending_approval' => 'N',
            )
        );

        $this->resetPermissions();

        $user = User::factory('UnitTester');
        $user->updatePassword('4test4');
        // Set up WebDriver implementation and login

        $capabilities = array(
            \WebDriverCapabilityType::BROWSER_NAME => 'firefox',
            \WebDriverCapabilityType::VERSION => '44.0',
            \WebDriverCapabilityType::JAVASCRIPT_ENABLED => 'true'
        );

        $this->webDriver = RemoteWebDriver::create(
            'http://localhost:4444/wd/hub',
            $capabilities
        );

        $this->login("UnitTester", "4test4");

        if (extension_loaded('xdebug')) {
            xdebug_start_code_coverage(XDEBUG_CC_UNUSED | XDEBUG_CC_DEAD_CODE);
        }

    }

    /**
     * Helper function to login to the loris instance which is being pointed to by
     * this test.
     *
     * @param string $username The username to log in as
     * @param string $password The (plain text) password to login as.
     *
     * @return none, side-effect logs in active webDriver
     */
    protected function login($username, $password)
    {
        $this->webDriver->get($this->url);
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Name("username")
            )
        );

        $usernameEl = $this->webDriver->findElement(WebDriverBy::Name("username"));
        $passwordEl = $this->webDriver->findElement(WebDriverBy::Name("password"));

        $usernameEl->sendKeys($username);
        $passwordEl->sendKeys($password);

        $login = $this->webDriver->findElement(WebDriverBy::Name("login"));
        $this->clickToLoadNewPage($login);

        // Explicitly wait until the page is loaded.
        // Wait up to a minute, because sometimes when multiple tests
        // are run one will fail due to the login taking too long?
        /*
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::xpath("//div[@id='page'] | //input[@name='username']")
            )
        );
        */
    }

    /**
     * Cleans up this test by deleting the temporary user that was created and all
     * its permissions. user_login_history also must be purged as it contains a
     * foreign key to users
     *
     * @return none
     */
    public function tearDown()
    {
        if (extension_loaded('xdebug')) {
            $data = xdebug_get_code_coverage();
            xdebug_stop_code_coverage(false);
        }

        // Delete the temporary user.
        $this->DB->delete("user_login_history", array('userID' => 'UnitTester'));
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));
        $this->DB->delete("users", array("UserID" => 'UnitTester'));
        // Close the browser and end the session
        if ($this->webDriver) {
            $this->webDriver->quit();
        }

        $this->factory->reset();
    }

    /**
     * Set a config setting to a new value and store the previous value
     * in the oldConfig instance variable.
     *
     * @param string $configName The config name
     * @param mixed  $value      The new value for that config
     *
     * @throws LorisException
     *
     * @return none
     */
    function setupConfigSetting($configName, $value)
    {
        if (isset($this->_oldConfig[$configName])) {
            throw new LorisException(
                "Attempted to change already changed config setting"
            );
        }

        $configID = $this->DB->pselectOne(
            "SELECT ID FROM ConfigSettings WHERE Name=:configName",
            array(":configName" => $configName)
        );

        if (is_array($configID) && empty($configID)) {
            throw new LorisException(
                "Attempting to update Config setting not in database"
            );
        }
        $oldVal = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:confID",
            array(":confID" => $configID)
        );

        $this->_oldConfig[$configName] = array(
                                          'ConfigID' => $configID,
                                          'OldValue' => $oldVal,
                                         );

        $this->DB->update(
            "Config",
            array("Value" => $value),
            array("ConfigID" => $configID)
        );
    }


    /**
     * Restores a config to its saved (previous) value.
     *
     * @param string $configName The name of the config to restore
     *
     * @throws LorisException
     *
     * @return none
     */
    function restoreConfigSetting($configName)
    {
        /*
        if(!isset($this->_oldConfig[$configName])) {
            throw new LorisException("Attempted to restore unsaved config setting");
        }
         */
        if (isset($this->_oldConfig[$configName])) {
            $this->DB->update(
                "Config",
                array("Value" => $this->_oldConfig[$configName]['OldValue']),
                array("ConfigID" => $this->_oldConfig[$configName]['ConfigID'])
            );
        }
    }

    /**
     * Helper function to set user permissions. The function works by deleting
     * all current permissions for the user then adding the specified permissions
     * to the TestUser.
     *
     * @param array $permissions List of permissions codes to add TestUser
     *
     * @return none
     */
    function setupPermissions($permissions)
    {
        $this->DB->delete("user_perm_rel", array("UserID" => '999990'));
        $prepare = $this->DB->prepare(
            "INSERT INTO user_perm_rel
                SELECT 999990, PermID
                    FROM permissions
                    WHERE code=:perm"
        );
        foreach ($permissions as $value) {
            $this->DB->execute(
                $prepare,
                array("perm" => $value),
                array('nofetch' => true)
            );
        }
    }

    /**
     * Helper function to reset user permissions. The function works by adding
     * all permissions to the TestUser.
     *
     * @return none
     */
    function resetPermissions()
    {
        $this->DB->run(
            "INSERT IGNORE INTO user_perm_rel SELECT 999990, PermID FROM permissions"
        );
    }

    /**
     * Helper function to change the users Study Site
     *
     * @return none
     */
    function changeStudySite()
    {
        $this->DB->insert("psc", array("CenterID" => 999));
        $this->DB->update("users", array("CenterID" => 999), array("ID" => 999990));
    }

    /**
     * Helper function to reset the users Study Site
     *
     * @return none
     */
    function resetStudySite()
    {
        $this->DB->update("users", array("CenterID" => 1), array("ID" => 999990));
        $this->DB->delete("psc", array("CenterID" => 999));
    }

    /**
     * Helper function to determine if a menu item is prensent
     * under a given category.
     *
     * Note: By giving and empty string in any parameter will act as a joker.
     *   ex: assertMenuItemPresent('', 'Configuration') will return true if
     *       one or more menu item 'Configuration' exist under any category.
     *   ex: assertMenuItemPresent('Admin', '') will return true is any
     *       category 'Admin' has at least one  menu item.
     *
     * @param string $category The parent Label of the menu item
     * @param string $menu     The label of the menu item
     *
     * @return boolean true    If the menu item exists under the category.
     */
    function isMenuItemPresent($category, $menu)
    {
        $configMenu = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //ul[@class='nav navbar-nav']
                //a[contains(text(), '$category')]
                /..
                /ul[@class='dropdown-menu']
                //a[contains(text(), '$menu')]
                "
            )
        );
        return count($configMenu) > 0;
    }

    /**
     * Helper function to click on a element and wait for the new page to be loaded.
     * When the DOM is reloaded, the elements of the previous page become stale.
     * Selenium will raise an exception when a function (like getText) are called on
     * those elements.
     *
     * Note: If the page don't reload, this will produce an infinite loop.
     *
     * @param webDriverElement $clickable The element to be clicked
     *
     * @return void Once the element is stale.
     */
    public function clickToLoadNewPage($clickable)
    {
        $clickable->click();
        try {
            while (true) {
                $clickable->getText();
            }
        } catch (StaleElementReferenceException $e) {
            return;
        }
    }

    /**
     * Helper function to decorate the webdriver->get function so it
     * ensure that the new page is load before it returns.
     *
     * @param string $url The url to get.
     *
     * @return void
     */
    function safeGet($url)
    {
        // keep a reference from the actual page
        $elementFromOldPage = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@class='navbar-header']/a
                "
            )
        );

        try {
            // Load the new page
            $this->webDriver->get($url);

            // Use the old page reference util it detach from the DOM
            while (true) {
                $elementFromOldPage->getText();
            }
        } catch (StaleElementReferenceException $e) {
            return;
        }
    }
}
?>
