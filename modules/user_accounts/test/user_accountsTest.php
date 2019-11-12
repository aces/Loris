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
    private const FILEPATH_EDITUSER      = 'user_accounts';
    private const FILEPATH_MYPREFERENCES = 'user_accounts/my_preferences';
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


    private static $_UNITTESTER = array(
        'Data Coordinating Center',
        'UnitTester',
        'Unit Tester',
        'tester@example.com',
        'Y',
        'N',
    );
    private static $_ADMIN      = array(
        'Data Coordinating Center',
        'admin',
        'Admin account',
        'admin@example.com',
        'Y',
        'N',
    );
    private $_name        = "#userAccounts_filter".
                                " > div > div > fieldset > div:nth-child(3)".
                                " > div > div > input";
    private $_site        = "#userAccounts_filter".
                                " > div > div > fieldset > div:nth-child(2)".
                                " > div > div > select";
    private $_clearFilter = ".col-sm-9 > .btn";
    private $_table       = "#dynamictable > tbody > tr:nth-child(1)";
    private $_addUserBtn  = "#default-panel > div > div > div.table-header >".
                            " div > div > div:nth-child(2) > button:nth-child(1)";
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
        $this->assertContains("Edit User", $bodyText);
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
     * Tests that, when loading the User accounts module > my_preference submodule
     * some text appears in the body.
     *
     * @return void
     */
    function testUserAccountsMyPreferencesDoespageLoad()
    {
        $this->safeGet($this->url . "/user_accounts/my_preferences/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("My Preferences", $bodyText);
    }
    /**
     * Tests that searching for users using thei user IDs works
     *
     * @return void
     */
    function testUserAccountsFilterClearBtn()
    {
        $this->safeGet($this->url . "/user_accounts/");
        //testing data from RBdata.sql
        $this-> _testFilter($this->_name, $this->_table, null, "UnitTester");
        $this-> _testFilter($this->_site, $this->_table, "1 rows", "3");
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element The input element location
     * @param string $table   The first row location in the table
     * @param string $records The records number in the table
     * @param string $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$table,$records,$value)
    {
        // get element from the page
        if (strpos($element, "select") == false) {
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
            $this->assertContains($value, $bodyText);
        } else {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
                    $bodyText = $this->webDriver->executescript(
                        "return document.querySelector('#default-panel".
                        " > div > div > div.table-header > div > div >".
                        " div:nth-child(1)').textContent"
                    );
                    // 4 means there are 4 records under this site.
                    $this->assertContains($records, $bodyText);
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
            'user_accounts',
            'UnitTester',
            'First_name',
            'NewFirst'
        );
        // Test changing last name
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'Last_name',
            'NewLast'
        );
        // Test changing 'Active' status
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'Active',
            'No'
        );
        // Test changing Email
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'Email',
            'newemail@example.com'
        );
        // Test changing Approval status
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'Pending_approval',
            'No'
        );
    }
    /**
     * Tests various My Preference page edit operations.
     *
     * @return void
     */
    function testMyPreferencesEdits()
    {
        $this->_verifyUserModification(
            'user_accounts/my_preferences',
            'UnitTester',
            'First_name',
            'NewFirst'
        );
        $this->_verifyUserModification(
            'user_accounts/my_preferences',
            'UnitTester',
            'Last_name',
            'NewFirst'
        );
        $this->_verifyUserModification(
            'user_accounts/my_preferences',
            'UnitTester',
            'Email',
            'newemail@example.com'
        );
    }

    /**
     * Ensure that password errors are successfully triggered on the
     * My Preferences page.
     *
     * @return void
     */
    function testMyPreferencesPasswordErrors()
    {
        $this->_verifyPasswordErrors(
            self::FILEPATH_MYPREFERENCES,
            self::UNITTESTER_USERNAME
        );
    }

    /**
     * Ensure that password errors are successfully triggered on the Edit User
     * page.
     *
     * @return void
     */
    function testEditUserPasswordErrors()
    {
        $this->_verifyPasswordErrors(
            self::FILEPATH_EDITUSER,
            self::UNITTESTER_USERNAME
        );
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
        $this->webDriver->executescript(
            "document.querySelector('$btn').click();"
        );
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
        $this->safeClick(WebDriverBy::Name('SendEmail'));
        $sitesElement = $this->safeFindElement(WebDriverBy::Name('CenterIDs[]'));
        $sitesOption  = new WebDriverSelect($sitesElement);
        $sitesOption->selectByValue("1");
        $projectsElement = $this->safeFindElement(WebDriverBy::Name('ProjectIDs[]'));
        $projectsOption  = new WebDriverSelect($projectsElement);
        $projectsOption->selectByValue("1");
        $this->safeClick(WebDriverBy::Name('fire_away'));
        $this->_accessUser('user_accounts', 'userid');
        $field = $this->safeFindElement(WebDriverBy::Name('First_name'));
        $this->assertEquals($field->getAttribute('value'), 'first');
        $field = $this->safeFindElement(WebDriverBy::Name('Last_name'));
        $this->assertEquals($field->getAttribute('value'), 'last');
        $field = $this->safeFindElement(WebDriverBy::Name('Email'));
        $this->assertEquals($field->getAttribute('value'), 'email@example.com');
    }

    /**
     * Modifies a field on either the user account or my preferences page
     * and checks that the modification was updated on the front-end.
     *
     * @param string $page      either 'user_accounts' or
                                'user_accounts/my_preferences'.
     * @param string $userId    ID of the user to modify.
     * @param string $fieldName name of the field (on the HTML page) that should
     *                          be modified.
     * @param string $newValue  new field value.
     *
     * @return void
     */
    function _verifyUserModification($page, $userId, $fieldName, $newValue)
    {
        // Load the page
        $this->_accessUser($page, $userId);

        // Set the value and submit the changes
        $this->setValue($fieldName, $newValue);
        $this->submit($page, $userId);

        // Reload 
        $this->_accessUser($page, $userId);

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
     * @param string $page   The page to submit to.
     * @param string $userId ID of the user to modify.
     *
     * @return void
     */
    function submit($page, $userId): void
    {
        // if working on edit_user, select at least one site
        if (strpos($page, 'my_preferences') === false) {
            $sitesElement = $this->safeFindElement(WebDriverBy::Name('CenterIDs[]'));
            $sitesOption  = new WebDriverSelect($sitesElement);
            $sitesOption->selectByValue("1");

            $projectsElement = $this->safeFindElement(
                WebDriverBy::Name('ProjectIDs[]')
            );
            $projectsOption  = new WebDriverSelect($projectsElement);
            $projectsOption->selectByValue("1");
        }
        // 'fire_away' is the name of the Submit button on the form.
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
     * Runs all of the password tests for a page.
     *
     * @param string $page   The page to submit to.
     * @param string $userId The user to edit
     *
     * @return void
     */
    function _verifyPasswordErrors($page, $userId): void
    {
        $this->_verifyPasswordMustNotEqualEmail($page, $userId);
        $this->_verifyPasswordAndConfirmPasswordMustMatch($page, $userId);
        $this->_verifyNewPasswordMustBeDifferent($page, $userId);
    }

    /**
     * Ensures that the user cannot set their password to be the same value
     * as their email address.
     *
     * @param string $page   The page to submit to.
     * @param string $userId The user to edit
     *
     * @return void
     */
    function _verifyPasswordMustNotEqualEmail($page, $userId): void
    {
        // Make sure the user's email is set to a known value
        $this->_verifyUserModification(
            $page,
            'UnitTester',
            'Email',
            self::UNITTESTER_EMAIL_NEW
        );
        // Try changing the password to the same value.
        $this->_sendPasswordValues($page, $userId, self::UNITTESTER_EMAIL_NEW);
        // This text comes from the class constants in Edit User/My Preferences
        assertContains('cannot be your email', $this->getBody());
    }

    /**
     * Ensures that the module checks that the password and confirm password
     * field match.
     *
     * @param string $page   The page to submit to.
     * @param string $userId The user to edit
     *
     * @return void
     */
    function _verifyPasswordAndConfirmPasswordMustMatch($page, $userId): void
    {
        // Send two different random strings to the password and confirm
        // password values.
        $this->_sendPasswordValues(
            $page,
            $userId,
            \Utility::randomString(),
            \Utility::randomString()
        );
        // This text comes from the class constants in Edit User/My Preferences
        assertContains('do not match', $this->getBody());
    }

    /**
     * Ensures that the module checks that the password and confirm password
     * field match.
     *
     * @param string $page   The page to submit to.
     * @param string $userId The user to edit
     *
     * @return void
     */
    function _verifyNewPasswordMustBeDifferent($page, $userId): void
    {
        $newPassword = \Utility::randomString();
        // Change the user's password to $newPassword
        $this->_sendPasswordValues(
            $page,
            $userId,
            $newPassword
        );
        // Change the password again using the same value. This should cause
        // and error.
        $this->_sendPasswordValues(
            $page,
            $userId,
            $newPassword
        );
        // This text comes from the class constants in Edit User/My Preferences
        assertContains('New and old passwords are identical', $this->getBody());
    }

    /**
     * Loads a module, sets the password and confirm password value, submits
     * the form, and reloads the page.
     *
     * @param string $page            The module to load
     * @param string $userId          The user to edit.
     * @param string $password        The plaintext password to use
     * @param string $confirmPassword The plaintext password to use. Will be
     *                                set equal to $password by default.
     *
     * @return void
     */
    function _sendPasswordValues(
        string $page,
        string $userId,
        string $password,
        string $confirmPassword = ''
    ): void {
        // Go to page
        $this->_accessUser($page, $userId);
        // Set Password and Confirm Password form values to be equal to the
        // user's email.
        $this->setValue(
            self::FORM_FIELD_PASSWORD,
            self::UNITTESTER_EMAIL_NEW
        );
        $this->setValue(
            self::FORM_FIELD_CONFIRMPASSWORD,
            ($confirmPassword === '') ? $password : $confirmPassword
        );
        $this->submit(
            $page,
            $userId
        );

        // Reload
        $this->_accessUser($page, $userId);
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
     * Does one of two things: either accesses the My Preferences page of the
     * current user of the user account page for the user whose ID is passed
     * as argument.
     *
     * @param string $page   either 'user_accounts' or
                             'user_accounts/my_preferences'
     * @param string $userId ID of the user whose page should be accessed.
     *
     * @return void
     */
    function _accessUser($page, $userId)
    {
        $this->safeGet($this->url . "/$page/");
        if ($page == 'user_accounts') {
            //     $this->safeClick(WebDriverBy::LinkText($userId));
            $this->safeGet(
                $this->url . "/user_accounts/edit_user/?identifier="
                ."$userId"
            );
        }
    }
    /**
     * Performed after every test.
     *
     * @return void
     */
    function tearDown()
    {
        $this->DB->delete("users", array("UserID" => 'userid'));
        parent::tearDown();
    }
}

