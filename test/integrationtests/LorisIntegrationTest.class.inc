<?php
/**
 * This contains an abstract class for Loris tests to extend.
 * It sets up the database handler, creates a user, creates a
 * webDriver instance, and logs in so that tests can focus on
 * the module being tested and not the overhead of logging in
 * to Loris.
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use PHPUnit\Framework\TestCase;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverWait;
use Facebook\WebDriver\WebDriverElement;
use Facebook\WebDriver\WebDriverExpectedCondition;
use Facebook\WebDriver\WebDriverSelect;
use Facebook\WebDriver\Exception\StaleElementReferenceException;
use Facebook\WebDriver\Exception\ElementNotVisibleException;
use Facebook\WebDriver\Exception\NoSuchElementException;
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
    /**
     * A valid password to use for login tests.
     */
    protected $validPassword = 'sufficient length and complexity';

    private $_oldConfig = [];

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return void
     */
    public function setUp() : void
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
        $this->url = getenv('DOCKER_WEB_SERVER');
        $password  = new \Password($this->validPassword);

        $this->DB->insert(
            "users",
            [
                'ID'               => 999990,
                'UserID'           => 'UnitTester',
                'Real_name'        => 'Unit Tester',
                'First_name'       => 'Unit',
                'Last_name'        => 'Tester',
                'Email'            => 'tester@example.com',
                'Privilege'        => 0,
                'PSCPI'            => 'N',
                'Active'           => 'Y',
                'Password_hash'    => $password,
                'Pending_approval' => 'N'
            ]
        );

        $this->DB->insert(
            "user_psc_rel",
            [
                'UserID'   => 999990,
                'CenterID' => 1,
            ]
        );

        $this->DB->insert(
            "user_project_rel",
            [
                'UserID'    => 999990,
                'ProjectID' => 1,
            ]
        );

        $this->resetPermissions();

        $user = User::factory('UnitTester');
        $user->updatePassword($password);

        $dev          = $this->config->getSettingFromXML('dev');
        $selenium_url = $dev['selenium_url'] ?? 'http://localhost:4444/wd/hub';
        $desired_capabilities = DesiredCapabilities::firefox();
        $desired_capabilities->setCapability('acceptSslCerts', false);

        // running headless model in Travis
        if (getenv('HEADLESS')) {
            $desired_capabilities->setCapability(
                'moz:firefoxOptions',
                ['args' => ['-headless']]
            );
        }

        $this->webDriver = RemoteWebDriver::create(
            $selenium_url,
            $desired_capabilities
        );

        $this->login("UnitTester", $this->validPassword);

        if (extension_loaded('xdebug')
            && function_exists("xdebug_start_code_coverage")
        ) {
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
        $usernameEl = $this->safeFindElement(
            WebDriverBy::Name("username")
        );
        $passwordEl = $this->safeFindElement(
            WebDriverBy::Name("password")
        );

        $usernameEl->sendKeys($username);
        $passwordEl->sendKeys($password);

        $login = $this->safeFindElement(WebDriverBy::Name("login"));
        $login->click();

        // Explicitly wait until the page is loaded.
        // Wait up to a minute, because sometimes when multiple tests
        // are run one will fail due to the login taking too long?
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::visibilityOfElementLocated(
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
    public function tearDown() : void
    {
        if (extension_loaded('xdebug')) {
            $data = xdebug_get_code_coverage();
            xdebug_stop_code_coverage(false);
        }

        // Delete the temporary user.
        $this->DB->delete("user_login_history", ['userID' => 'UnitTester']);
        $this->DB->delete("user_perm_rel", ["UserID" => '999990']);
        $this->DB->delete("users", ["UserID" => 'UnitTester']);
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
        $configID = $this->DB->pselectOne(
            "SELECT ID FROM ConfigSettings WHERE Name=:configName",
            ["configName" => $configName]
        );

        if (is_array($configID) && empty($configID)) {
            throw new LorisException(
                "Attempting to update Config setting not in database"
            );
        }
        $oldVal = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:confID",
            ["confID" => $configID]
        );

        $this->_oldConfig[$configName] = [
            'ConfigID' => $configID,
            'OldValue' => $oldVal,
        ];

        $this->DB->update(
            "Config",
            ["Value" => $value],
            ["ConfigID" => $configID]
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
        if (isset($this->_oldConfig[$configName])) {
            $this->DB->update(
                "Config",
                ["Value" => $this->_oldConfig[$configName]['OldValue']],
                ["ConfigID" => $this->_oldConfig[$configName]['ConfigID']]
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
        $this->DB->delete("user_perm_rel", ["UserID" => '999990']);
        $prepare = $this->DB->prepare(
            "INSERT INTO user_perm_rel
                SELECT 999990, PermID
                    FROM permissions
                    WHERE code=:perm"
        );
        foreach ($permissions as $value) {
            $this->DB->execute(
                $prepare,
                ["perm" => $value],
                ['nofetch' => true]
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
        $this->DB->insert("psc", ["CenterID" => 99, "Alias" => "BBQ"]);
        $this->DB->update(
            "user_psc_rel",
            ["CenterID" => 99],
            ["UserID" => 999990]
        );
    }

    /**
     * Helper function to reset the users Study Site
     *
     * @return void
     */
    function resetStudySite()
    {
        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->update(
            "user_psc_rel",
            ["CenterID" => 1],
            ["UserID" => 999990]
        );
        $this->DB->delete("psc", ["CenterID" => 99]);
        $this->DB->run('SET foreign_key_checks =1');
    }

    /**
     * Helper function to change the users Project
     *
     * @return void
     */
    function changeUserProject()
    {
        $this->DB->insert("Project", ["ProjectID" => 99, "Alias" => "BBQ"]);
        $this->DB->update(
            "user_project_rel",
            ["ProjectID" => 99],
            ["UserID" => 999990]
        );
    }

    /**
     * Helper function to reset the users Project
     *
     * @return void
     */
    function resetUserProject()
    {
        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->update(
            "user_project_rel",
            ["ProjectID" => 1],
            ["UserID" => 999990]
        );
        $this->DB->delete("Project", ["ProjectID" => 99]);
        $this->DB->run('SET foreign_key_checks =1');
    }

    /**
     * Helper function to create a subproject
     *
     * @param string $SubprojectID Name of the subproject
     * @param string $title        Name of the subproject
     *
     * @return void
     */
    function createSubproject($SubprojectID, $title)
    {
        $this->DB->insert(
            "subproject",
            [
                "SubprojectID"      => $SubprojectID,
                "title"             => $title,
                "WindowDifference"  => "optimal",
                "RecruitmentTarget" => "100",
            ]
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
            [
                "title"             => $title,
                "WindowDifference"  => "optimal",
                "RecruitmentTarget" => "100",
            ]
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
        $this->DB->delete("candidate", ["PSCID" => $pscid]);
    }

    /**
     * Helper function to click on a element and wait for the new page to be
     * loaded.
     * When the DOM is reloaded, the elements of the previous page become stale.
     * Selenium will raise an exception when a function (like getText) are
     * called on those elements.
     *
     * Note: If the page don't reload, this will produce an infinite loop.
     *
     * @param webDriverElement $clickable The element to be clicked
     *
     * @return ?bool
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
     * @param string $url        The url to get.
     * @param int    $waitPeriod After this amount of seconds, the wait period
     *                           finishes and an exception is thrown.
     *
     * @return \Facebook\WebDriver\Remote\RemoteWebDriver
     */
    function safeGet($url,$waitPeriod=15)
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
            // Load the new page
        $newWebDriver = $this->webDriver->get($url);
        $wait         = new WebDriverWait($newWebDriver, $waitPeriod);
        $wait->until(
            WebDriverExpectedCondition::stalenessOf($oldBody)
        );
        return $newWebDriver;
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
     * @throws Facebook\WebDriver\Exception\NoSuchElementException
     *          if the element cannot be found after the
     *                                wait period.
     *
     * @return Facebook\WebDriver\Remote\RemoteWebElement the element found.
     */
    function safeFindElement(WebDriverBy $by, $waitPeriod=15)
    {
        $wait = new WebDriverWait($this->webDriver, $waitPeriod, 500);
        $wait->until(
            WebDriverExpectedCondition::visibilityOfElementLocated($by)
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
                [$webElement]
            );
        }
    }

    /**
     * Ensures that the module loads if and only if the user has the correct
     * permissions.
     *
     * @param string   $path            The path to the module. Usually the same
     *                                  name as the folder containing the module.
     * @param string[] $permissionCodes An array of permission codes
     *                                  corresponding to the module. Should
     *                                  match the permission codes used in the
     *                                  hasAccess() method of the module.
     * @param string   $successMessage  Indicates that the module has
     *                                  loaded successfully, i.e.
     *                                  that the user has permission
     *                                  to access the module. Usually
     *                                  the name of the module, e.g.
     *                                  "Data Release" for the
     *                                  data_release module.
     * @param string   $failureMessage  Indicates the user does not have
     *                                  permission to view the module.
     *                                  Defaults to the 403 message
     *                                  served by
     *                                  src/Middleware/AuthMiddleware.php.
     *
     * @return void
     */
    public function checkPagePermissions(
        string $path,
        array $permissionCodes,
        string $successMessage,
        string $failureMessage = 'You do not have access to this page'
    ): void {
        // Ensure a forbidden message is delivered when the user does not
        // have any permissions set.
        $this->_verifyPermission(
            $failureMessage,
            $this->_loadWithPermission($path)
        );

        // Validate that each permission code on its own is enough to load
        // the module.
        foreach ($permissionCodes as $code) {
            $this->_verifyPermission(
                $successMessage,
                $this->_loadWithPermission($path, $code)
            );
        }
    }

    /**
     * Asserts that a message appears in the HTML body of the page.
     * Resets the permissions checked to cleanup before further tests.
     *
     * @param string $needle   This string should be in $haystack.
     * @param string $haystack The HTML body of the page.
     * @param string $jsError  React render error message.
     *
     * @return void
     */
    private function _verifyPermission(
        string $needle,
        string $haystack,
        string $jsError= "An error occured while loading the page."
    ): void {
        $this->assertStringContainsString($needle, $haystack);
        $this->assertStringNotContainsString(
            $jsError,
            $haystack
        );
        $this->resetPermissions();
    }

    /**
     * Helper function to set up and load a page with a given permission code.
     *
     * @param string $path       The path to the module. Usually the same name as
     *                           the folder containing the module.
     * @param string $permission A valid permission code for the data_release
     *                           module.
     *
     * @return string The body text of the page loaded.
     */
    private function _loadWithPermission(
        string $path,
        string $permission = ''
    ): string {
        $this->setupPermissions([$permission]);
        $this->safeGet($this->url . $path);
        return $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element        The input element loaction (css selector)
     * @param string $row            React Table row number
     * @param string $btn            clear filter button
     * @param string $test_value     The test value
     * @param string $expect_records The records number in the table
     *
     * @return void
     */
    function _filterTest($element,$row,$btn,$test_value, $expect_records): void
    {
        // get element from the page

        if (strpos($element, "select") === false) {
            $el = $this->safeFindElement(WebDriverBy::cssSelector("$element"));
            $el->sendKeys($test_value);
        } else {
            $el_dropdown = new WebDriverSelect(
                $this->safeFindElement(WebDriverBy::cssSelector("$element"))
            );
            $el_dropdown->selectByVisibleText($test_value);
        }
            $bodyText = $this->safeFindElement(
                WebDriverBy::cssSelector("$row")
            )->getText();
            // 4 means there are 4 records under this site.
            $this->assertStringContainsString($expect_records, $bodyText);
            //test clear filter
            $this->safeFindElement(WebDriverBy::cssSelector("$btn"))->click();
    }

    /**
     * Utility method for classes that register widgets on the dashboard: ensure that
     * the task panel has the expected content.
     *
     * @param string $className class Name of widget in the task panel
     * @param string $value     the total count displayed for that widget
     * @param string $label     label for that widget
     *
     * @return void
     */
    function _testMytaskPanelAndLink($className, $value, $label): void
    {
        $this->safeGet($this->url . '/dashboard/');
        $link     =$this->safeFindElement(WebDriverBy::cssSelector($className));
        $bodyText = $link->findElement(WebDriverBy::cssSelector(".huge"))->getText();
        $this->assertStringContainsString($value, $bodyText);
        $this->safeClick(WebDriverBy::cssSelector($className));
        $this->webDriver->wait(3, 500)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Id('lorisworkspace')
            )
        );
        $pageSource = $this->webDriver->getPageSource();
        $this->assertStringContainsString($label, $pageSource);
    }
}
