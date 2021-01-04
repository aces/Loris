<?php
/**
 * User accounts automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
use Facebook\WebDriver\WebDriverKeys;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * UserAccountsIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class UserAccountsIntegrationTest extends LorisIntegrationTest
{
    // The paths to the pages to which the form must submit.
    private const FILEPATH_EDITUSER = 'user_accounts';
    // The names of the form elements for the Password and Confirm Password
    // fields.
    private const FORM_FIELD_PASSWORD        = 'Password_hash';
    private const FORM_FIELD_CONFIRMPASSWORD = '__Confirm';
    // Regular (non-admin) user details
    private const UNITTESTER_USERNAME  = 'UnitTester';
    private const UNITTESTER_REALNAME  = 'Unit Tester';
    private const UNITTESTER_EMAIL     = 'tester@example.com';
    private const UNITTESTER_EMAIL_NEW = 'newemail@example.com';
    // Admin user details
    private const ADMIN_USERNAME  = 'admin';
    private const ADMIN_REALNAME  = 'Admin account';
    private const ADMIN_EMAIL     = 'admin@example.com';
    private const ADMIN_EMAIL_NEW = 'tester@example.com';

    private $_name        = 'input[name="username"]';
    private $_site        = 'select[name="site"]';
    private $_clearFilter = ".nav-tabs a";
    private $_table       = "#dynamictable > tbody > tr";
    private $_addUserBtn  = "div:nth-child(2) > .btn:nth-child(1)";

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $password = new \Password($this->validPassword);
        $this->DB->insert(
            "users",
            [
                'ID'                     => 999995,
                'UserID'                 => 'UnitTesterTwo',
                'Real_name'              => 'Unit Tester 2',
                'First_name'             => 'Unit 2',
                'Last_name'              => 'Tester 2',
                'Email'                  => 'tester2@example.com',
                'Privilege'              => 0,
                'PSCPI'                  => 'N',
                'Active'                 => 'Y',
                'Password_hash'          => $password,
                'PasswordChangeRequired' => false,
                'Pending_approval'       => 'N'
            ]
        );

        $this->DB->insert(
            "user_psc_rel",
            [
                'UserID'   => 999995,
                'CenterID' => 1,
            ]
        );

        $this->DB->insert(
            "user_project_rel",
            [
                'UserID'    => 999995,
                'ProjectID' => 1,
            ]
        );
    }

    /**
     * Tests that, when loading the User accounts module > edit_user submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testUserAccountsEditUserDoespageLoad()
    {
        $this->safeGet($this->url . "/user_accounts/edit_user/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Edit User", $bodyText);
        $this->assertEquals(
            "password",
            $this->safeFindElement(
                WebDriverBy::Name("Password_hash")
            )->getAttribute("type")
        );
        $this->assertEquals(
            "checkbox",
            $this->safeFindElement(
                WebDriverBy::Name("NA_Password")
            )->getAttribute("type")
        );
        $this->assertEquals(
            "password",
            $this->safeFindElement(
                WebDriverBy::Name("__Confirm")
            )->getAttribute("type")
        );
    }
    /**
     * Tests that searching for users using thei user IDs works
     *
     * @return void
     */
    function testUserAccountsFilterClearBtn()
    {
        $this->safeGet($this->url . "/user_accounts/");
        $this-> _testFilter($this->_name, $this->_table, null, "UnitTester");
        $this-> _testFilter($this->_site, $this->_table, "1 rows", "3");
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string  $element The input element location
     * @param string  $table   The first row location in the table
     * @param ?string $records The records number in the table
     * @param string  $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$table,$records,$value)
    {
        // get element from the page
        if (strpos($element, "select") === false) {
            $this->safeFindElement(WebDriverBy::cssSelector($element));
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);
                "
            );
            $bodyText = $this->webDriver->executescript(
                "return document.querySelector('$table').textContent"
            );
            $this->assertStringContainsString($value, $bodyText);
        } else {
            $this->safeFindElement(WebDriverBy::cssSelector($element));
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
            $row      = "#default-panel".
                        " > div > div > div.table-header > div > div >".
                        " div:nth-child(1)";
            $bodyText = $this->safeFindElement(
                WebDriverBy::cssSelector($row)
            )->getText();
                    // 4 means there are 4 records under this site.
                    $this->assertStringContainsString($records, $bodyText);
        }
        //test clear filter
        $btn = $this->_clearFilter;
        $this->webDriver->executescript(
            "document.querySelector('$btn').click();"
        );
        $inputText = $this->webDriver->executescript(
            "return document.querySelector('$element').value"
        );
        $this->assertEquals("", $inputText);
    }


    /**
     * Tests various user account edit operations.
     *
     * @return void
     */
    function testUserAccountEdits()
    {
        // Test changing first name
        $this->_verifyUserModification(
            'UnitTester',
            'First_name',
            'NewFirst'
        );
        // Test changing last name
        $this->_verifyUserModification(
            'UnitTester',
            'Last_name',
            'NewLast'
        );
        // Test changing 'Active' status
        $this->_verifyUserModification(
            'UnitTesterTwo',
            'Active',
            'No'
        );
        // Test changing Email
        $this->_verifyUserModification(
            'UnitTester',
            'Email',
            'newemail@example.com'
        );
        // Test changing Approval status
        $this->_verifyUserModification(
            'UnitTesterTwo',
            'Pending_approval',
            'No'
        );
        //TODO:add test case to ensure pending_approval
        //DOES NOT show up on UnitTester since logged in user is UnitTester
    }

    /**
     * Tests that the creation of a new user works.
     *
     * @return void
     */
    function testAddNewUser()
    {
        // adding a new user for react test
        $this->safeGet($this->url . "/user_accounts/");
        $btn = $this->_addUserBtn;
        $this->safeClick(WebDriverBy::cssSelector($btn));

        $field = $this->safeFindElement(WebDriverBy::Name('UserID'));
        $field->clear();
        $field->sendKeys('userid');

        // Click somehow does not work but this should be
        // equivalent
        $element = $this->safeFindElement(WebDriverBy::Name('NA_Password'));
        $element->sendKeys(WebDriverKeys::SPACE);

        $field = $this->safeFindElement(WebDriverBy::Name('First_name'));
        $field->clear();
        $field->sendKeys('first');
        $field = $this->safeFindElement(WebDriverBy::Name('Last_name'));
        $field->clear();
        $field->sendKeys('last');
        $field = $this->safeFindElement(WebDriverBy::Name('Email'));
        $field->clear();
        $field->sendKeys('email@example.com');
        $field = $this->safeFindElement(WebDriverBy::Name('__ConfirmEmail'));
        $field->clear();
        $field->sendKeys('email@example.com');
        $sitesElement = $this->safeFindElement(WebDriverBy::Name('CenterIDs[]'));
        $sitesOption  = new WebDriverSelect($sitesElement);
        $sitesOption->selectByValue("1");
        $projectsElement = $this->safeFindElement(WebDriverBy::Name('ProjectIDs[]'));
        $projectsOption  = new WebDriverSelect($projectsElement);
        $projectsOption->selectByValue("1");
        $this->safeClick(WebDriverBy::Name('fire_away'));
        $this->_accessUser('userid');
        $field = $this->safeFindElement(WebDriverBy::Name('First_name'));
        $this->assertEquals($field->getAttribute('value'), 'first');
        $field = $this->safeFindElement(WebDriverBy::Name('Last_name'));
        $this->assertEquals($field->getAttribute('value'), 'last');
        $field = $this->safeFindElement(WebDriverBy::Name('Email'));
        $this->assertEquals($field->getAttribute('value'), 'email@example.com');
    }

    /**
     * Modifies a field on either the user account
     * and checks that the modification was updated on the front-end.
     *
     * @param string $userId    ID of the user to modify.
     * @param string $fieldName name of the field (on the HTML page) that should
     *                          be modified.
     * @param string $newValue  new field value.
     *
     * @return void
     */
    function _verifyUserModification($userId, $fieldName, $newValue)
    {
        // Load the page
        $this->_accessUser($userId);

        // Set the value and submit the changes
        $this->setValue($fieldName, $newValue);
        $this->submit();

        // Reload
        $this->_accessUser($userId);

        // Verify changes appear on the page
        $field = $this->safeFindElement(WebDriverBy::Name($fieldName));
        if ($field->getTagName() == 'input') {
            $this->assertEquals($field->getAttribute('value'), $newValue);
        } else {
            $selectField = new WebDriverSelect($field);
            $this->assertEquals(
                $selectField->getFirstSelectedOption()->getText(),
                $newValue
            );
        }
    }

    /**
     * Submit user data to the form specified by $page.
     *
     * @return void
     */
    function submit(): void
    {
        $sitesElement = $this->safeFindElement(WebDriverBy::Name('CenterIDs[]'));
        $sitesOption  = new WebDriverSelect($sitesElement);
        $sitesOption->selectByValue("1");

        $projectsElement = $this->safeFindElement(
            WebDriverBy::Name('ProjectIDs[]')
        );
        $projectsOption  = new WebDriverSelect($projectsElement);
        $projectsOption->selectByValue("1");
        $this->safeClick(WebDriverBy::Name('fire_away'));
    }

    /**
     * Finds a field on the page and changes its value.
     * This function should be followed by a submission of a form in order
     * to actually take effect.
     *
     * @param string $fieldName The CSS name of the field.
     * @param string $newValue  The new value for that field.
     *
     * @return void
     */
    function setValue($fieldName, $newValue): void
    {
        $field = $this->safeFindElement(WebDriverBy::Name($fieldName));
        if ($field->getTagName() == 'input') {
            $field->clear();
            $field->sendKeys($newValue);
        } else {
            $selectField = new WebDriverSelect($field);
            $selectField->selectByVisibleText($newValue);
        }
    }

    /**
     * Ensures that the user cannot set their password to be the same value
     * as their email address.
     *
     * @return void
     */
    function testPasswordMustNotEqualEmail(): void
    {
        // Make sure the user's email is set to a known value. This will also
        // load the page.
        $this->_verifyUserModification(
            self::UNITTESTER_USERNAME,
            'Email',
            self::UNITTESTER_EMAIL_NEW
        );

        // Try changing the password to the same value.
        $this->_sendPasswordValues(
            self::UNITTESTER_USERNAME,
            self::UNITTESTER_EMAIL_NEW
        );
        // This text comes from the class constants in Edit User
        $this->assertStringContainsString('cannot be your email', $this->getBody());
    }

    /**
     * Ensures that the module checks that the password and confirm password
     * field match.
     *
     * @return void
     */
    function testPasswordAndConfirmPasswordMustMatch(): void
    {
        // Send two different random strings to the password and confirm
        // password values.
        $this->_sendPasswordValues(
            self::UNITTESTER_USERNAME,
            \Utility::randomString(),
            \Utility::randomString()
        );
        // This text comes from the class constants in Edit User
        $this->assertStringContainsString('do not match', $this->getBody());
    }

    /**
     * Ensures that the module checks that the password and confirm password
     * field match.
     *
     * @return void
     */
    function testNewPasswordMustBeDifferent(): void
    {
        $newPassword = \Utility::randomString();
        // Change the user's password to $newPassword
        $this->_sendPasswordValues(
            self::UNITTESTER_USERNAME,
            $newPassword
        );
        // Change the password again using the same value. This should cause
        // and error.
        $this->_sendPasswordValues(
            self::UNITTESTER_USERNAME,
            $newPassword
        );
        // This text comes from the class constants in Edit User
        $this->assertStringContainsString(
            'New and old passwords are identical',
            $this->getBody()
        );
    }

    /**
     * Loads a module, sets the password and confirm password value, submits
     * the form, and reloads the page.
     *
     * @param string $userId          The user to edit.
     * @param string $password        The plaintext password to use
     * @param string $confirmPassword The plaintext password to use. Will be
     *                                set equal to $password by default.
     *
     * @return void
     */
    function _sendPasswordValues(
        string $userId,
        string $password,
        string $confirmPassword = ''
    ): void {
        // Go to page
        $this->_accessUser($userId);
        $this->setValue(
            self::FORM_FIELD_PASSWORD,
            $password
        );
        $this->setValue(
            self::FORM_FIELD_CONFIRMPASSWORD,
            ($confirmPassword === '') ? $password : $confirmPassword
        );
        $this->submit();
    }

    /**
     * Returns the body text of the page.
     *
     * @return string The HTML body.
     */
    function getBody(): string
    {
        return $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
    }

    /**
     * Accesses the current user.
     *
     * @param string $userId ID of the user whose page should be accessed.
     *
     * @return void
     */
    function _accessUser($userId)
    {
        $this->safeGet(
            $this->url . "/user_accounts/edit_user/?identifier=$userId"
        );
    }
    /**
     * Performed after every test.
     *
     * @return void
     */
    function tearDown(): void
    {
        $this->DB->delete("users", ["UserID" => 'userid']);
        $this->DB->delete("user_psc_rel", ["UserID" => 999995]);
        $this->DB->delete("user_project_rel", ["UserID" => 999995]);
        $this->DB->delete("users", ["UserID" => 'UnitTesterTwo']);
        parent::tearDown();
    }
}

