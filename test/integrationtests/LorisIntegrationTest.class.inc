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
use PHPUnit\Framework\TestCase;
/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class LorisIntegrationTest extends TestCase
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
    $NUM_OF_ATTEMPTS    = 5;
    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return void
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
             'Privilege'        => 0,
             'PSCPI'            => 'N',
             'Active'           => 'Y',
             'Password_hash'    => password_hash("4test4", PASSWORD_DEFAULT),
             'Password_expiry'  => '2099-12-31',
             'Pending_approval' => 'N',
            )
        );

        $this->DB->insert(
            "user_psc_rel",
            array(
             'UserID'   => 999990,
             'CenterID' => 1,
            )
        );

        $this->resetPermissions();

        $user = User::factory('UnitTester');
        $user->updatePassword('4test4');

        $dev          = $this->config->getSettingFromXML('dev');
        $selenium_url = isset($dev['selenium_url']) ? $dev['selenium_url'] : 'http://localhost:4444/wd/hub';

        $capabilities = array(
                         WebDriverCapabilityType::BROWSER_NAME       => 'firefox',
                         WebDriverCapabilityType::JAVASCRIPT_ENABLED => true,
                        );

        $this->webDriver = RemoteWebDriver::create(
            $selenium_url,
            $capabilities
        );

        $this->login("UnitTester", "4test4");

        if (extension_loaded('xdebug') && function_exists("xdebug_start_code_coverage")) {
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
     * @return void but side-effect logs in active webDriver
     */
    protected function login($username, $password)
    {
        $this->safeGet($this->url);
        /*
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Name("username")
            )
        );
        */
        $usernameEl = $this->webDriver->findElement(WebDriverBy::Name("username"));
        $passwordEl = $this->webDriver->findElement(WebDriverBy::Name("password"));

        $usernameEl->sendKeys($username);
        $passwordEl->sendKeys($password);

        $login = $this->webDriver->findElement(WebDriverBy::Name("login"));
        $login->click();

        // Explicitly wait until the page is loaded.
        // Wait up to a minute, because sometimes when multiple tests
        // are run one will fail due to the login taking too long?
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::xpath("//div[@id='page'] | //input[@name='username']")
            )
        );
    }

    /**
     * Cleans up this test by deleting the temporary user that was created and all
     * its permissions. user_login_history also must be purged as it contains a
     * foreign key to users
     *
     * @return void
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
     * @return void
     */
    function setupConfigSetting($configName, $value)
    {
        /*  if (isset($this->_oldConfig[$configName])) {
            throw new LorisException(
                "Attempted to change already changed config setting"
            );
        }*/

        $configID = $this->DB->pselectOne(
            "SELECT ID FROM ConfigSettings WHERE Name=:configName",
            array("configName" => $configName)
        );

        if (is_array($configID) && empty($configID)) {
            throw new LorisException(
                "Attempting to update Config setting not in database"
            );
        }
        $oldVal = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:confID",
            array("confID" => $configID)
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
     * @return void
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
     * @return void
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
     * @return void
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
     * @return void
     */
    function changeStudySite()
    {
        $this->DB->insert("psc", array("CenterID" => 99, "Alias" => "BBQ"));
        $this->DB->update("user_psc_rel", array("CenterID" => 99), array("UserID" => 999990));
    }

    /**
     * Helper function to reset the users Study Site
     *
     * @return void
     */
    function resetStudySite()
    {
        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->update("user_psc_rel", array("CenterID" => 1), array("UserID" => 999990));
        $this->DB->delete("psc", array("CenterID" => 99));
        $this->DB->run('SET foreign_key_checks =1');
    }

    /**
     * Helper function to create a subproject
     *
     * @param string $title Name of the subproject
     *
     * @return void
     */
    function createSubproject($SubprojectID,$title)
    {
        $this->DB->insert(
            "subproject",
            array(
             "SubprojectID"      => $SubprojectID,
             "title"             => $title,
             "WindowDifference"  => "optimal",
             "RecruitmentTarget" => "100",
            )
        );
    }

    /**
     * Helper function to delete a subproject
     *
     * @param string $title Name of the subproject
     *
     * @return void
     */
    function deleteSubproject($title)
    {
        $this->DB->delete(
            "subproject",
            array(
             "title"             => $title,
             "WindowDifference"  => "optimal",
             "RecruitmentTarget" => "100",
            )
        );
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
     * Helper function to delete candidate
     *
     * @param string $pscid The PSCID of teh candiate to delete
     *
     * @return void
     */
    function deleteCandidate($pscid)
    {
        $this->DB->delete("candidate", array("PSCID" => $pscid));
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
        $remoteWebElement = null;

        $clickable->click();
        try {
            while (true) {
                $remoteWebElement = $clickable->isDisplayed();
            }
        } catch (StaleElementReferenceException $e) {
            return $remoteWebElement;
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
        $newWebDriver = null;

        // keep a reference from the actual page
        $oldBody = $this->safeFindElement(
            WebDriverBy::xPath(
                "
                //body
                "
            )
        );

        try {
            // Load the new page
            $newWebDriver = $this->webDriver->get($url);

            // Use the old page reference until it detaches from the DOM
            while (true) {
                $oldBody->isDisplayed();
            }
        } catch (StaleElementReferenceException $e) {
            return $newWebDriver;
        }
    }

    /**
     * Wrapper method for WebDriver->findElement. It will wait until the element
     * is located on the page before issuing the actual finElement method
     * call.
     *
     * @param WebDriverBy $by         Criteria used to find the element on the page.
     * @param int         $waitPeriod After this amount of seconds, the wait period
     *                                finishes and an exception is thrown.
     *
     * @throws NoSuchElementException if the element cannot be found after the
     *                                wait period.
     *
     * @return WebDriverElement the element found.
     */
    function safeFindElement(WebDriverBy $by, $waitPeriod=15)
    {
        $wait = new WebDriverWait($this->webDriver, $waitPeriod);
        $wait->until(
            WebDriverExpectedCondition::presenceOfElementLocated($by)
        );

        return $this->webDriver->findElement($by);
    }

    /**
     * Safely click on a page element, even if not yet visible. The click is done
     * by issuing a sendKeys method call on the element, passing as argument either
     * a SPACE or a RETURN key (HTML input field will receive a SPACE whereas all
     * others will receive a RETURN).
     *
     * @param WebDriverBy $by                   Criteria used to find the element
     *                                          on the page.
     * @param int         $waitPeriod           After this amount of seconds, the
     *                                          wait period finishes and an
     *                                          exception is thrown.
     * @param boolean     $allowJavascriptClick true if a click on the element
     *                                          should be done using a Javascript
     *                                          method call when the element is not
     *                                          visible. False otherwise.
     *
     * @throws NoSuchElementException     if the element cannot be found after the
     *                                    wait period.
     * @throws ElementNotVisibleException if $allowJavascriptClick is false and the
     *                                    element cannot be clicked on because it is
     *                                    not visible.
     * @throws StaleElementReferenceException if $allowJavascriptClick is false and
     *                                        the element cannot be clicked on
     *                                        because the DOM was updated since the
     *                                        element was found.
     *
     * @return void
     */
    function safeClick(WebDriverBy $by, $waitPeriod=15, $allowJavascriptClick=true)
    {
        $webElement = $this->safeFindElement($by, $waitPeriod);

        try {
            $webElement->click();
            $clickException = null;
        } catch(ElementNotVisibleException $e) {
            $clickException = $e;
        } catch(StaleElementReferenceException $e) {
            $clickException = $e;
        }

        if (!is_null($clickException)) {
            if (!$allowJavascriptClick) {
                throw $e;
            }

            $this->webDriver->executeScript(
                "arguments[0].click();",
                array($webElement)
            );
        }
    }
    /**
     * Get the content of a React Element
     *
     * @param  string $ui the location of this ui (css selector)
     * @return string
     */
    function getReactElementContent($ui)
    {
        $attempts = 0;
        do {
            try {
                return $this->webDriver->executescript(
                    "return document.querySelector('$ui').textContent"
                );
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
                        $attempts++;
                        sleep(1);
                        continue;
            }
              break;
        } while($attempts < $NUM_OF_ATTEMPTS);
    }
    /**
     * Click a React Element
     *
     * @param  string $ui the location of this ui (css selector)
     * @return void
     */
    function clickReactElement($ui)
    {
          $attempts = 0;
        do {
            try {
                $this->webDriver->executescript(
                    "document.querySelector('$ui').click()"
                );
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
                        $attempts++;
                        sleep(1);
                        continue;
            }
            break;
        } while($attempts < $NUM_OF_ATTEMPTS);
    }
    /**
     * Get rows of the React table, ? rows displayed of ?
     *
     * @param  string $ui the result of React table (css selector)
     * @return string
     */
    function getReactTableRows($ui)
    {
        $attempts = 0;
        do {
            try {
                $res = $this->webDriver->executescript(
                    "return document.querySelector('$ui').textContent"
                );
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
                        $attempts++;
                        sleep(1);
                        continue;
            }
              break;
        } while($attempts < $NUM_OF_ATTEMPTS);
        $array =explode('rows', $res);
        return trim($array[0]);
    }
    /**
     * Input a value into a text react element
     *
     * @param  string $ui    the result of React element (css selector)
     * @param  string $value input a value
     * @return void
     */
    function reactTextSendKey($ui,$value)
    {
         $attempts = 0;
        do {
            try {
                $this->webDriver->executescript(
                    "input = document.querySelector('$ui');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);"
                );
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
                        $attempts++;
                        sleep(1);
                        continue;
            }
            break;
        } while($attempts < $NUM_OF_ATTEMPTS);
    }
    /**
     * Select a value in a react dropdown list
     *
     * @param  string $ui    the result of React element (css selector)
     * @param  string $value input a value
     * @return void
     */
    function reactDropdownSendKey($ui,$value)
    {
         $attempts = 0;
        do {
            try {
                $this->webDriver->executescript(
                    "input = document.querySelector('$ui');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
                );
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
                        $attempts++;
                        sleep(1);
                        continue;
            }
            break;
        } while($attempts < $NUM_OF_ATTEMPTS);
    }
}

