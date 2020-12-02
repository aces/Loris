<?php
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * My Preferences integration tests.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class MyPreferencesIntegrationTest extends LorisIntegrationTest
{
    // The paths to the pages to which the form must submit.
    private const FILEPATH_MYPREFERENCES = 'my_preferences';
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

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return void
     */
    public function setUp() : void
    {
        parent::setUp();
        $password = new \Password($this->validPassword);
        $this->DB->insert(
            "users",
            [
                'ID'               => 999995,
                'UserID'           => 'UnitTesterTwo',
                'Real_name'        => 'Unit Tester 2',
                'First_name'       => 'Unit 2',
                'Last_name'        => 'Tester 2',
                'Email'            => 'tester2@example.com',
                'Privilege'        => 0,
                'PSCPI'            => 'N',
                'Active'           => 'Y',
                'Password_hash'    => $password,
                'Password_expiry'  => '2099-12-31',
                'Pending_approval' => 'N',
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
     * Modifies a field on the my preferences page
     * and checks that the modification was updated on the front-end.
     *
     * @param string $page      either 'user_accounts' or
     *                          'user_accounts/my_preferences'.
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
        // Make sure the user's email is set to a known value. This will also
        // load the page.
        $this->_verifyUserModification(
            $page,
            'UnitTester',
            'Email',
            self::UNITTESTER_EMAIL_NEW
        );

        // Try changing the password to the same value.
        $this->_sendPasswordValues($page, $userId, self::UNITTESTER_EMAIL_NEW);
        // This text comes from the class constants in Edit User/My Preferences
        $this->assertStringContainsString('cannot be your email', $this->getBody());
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
        $this->assertStringContainsString('do not match', $this->getBody());
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
        $this->assertStringContainsString(
            'New and old passwords are identical',
            $this->getBody()
        );
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
        $this->setValue(
            self::FORM_FIELD_PASSWORD,
            $password
        );
        $this->setValue(
            self::FORM_FIELD_CONFIRMPASSWORD,
            ($confirmPassword === '') ? $password : $confirmPassword
        );
        $this->submit(
            $page,
            $userId
        );
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
     * Performed after every test.
     *
     * @return void
     */
    function tearDown() : void
    {
        $this->DB->delete("users", ["UserID" => 'userid']);
        $this->DB->delete("user_psc_rel", ["UserID" => 999995]);
        $this->DB->delete("user_project_rel", ["UserID" => 999995]);
        $this->DB->delete("users", ["UserID" => 'UnitTesterTwo']);
        parent::tearDown();
    }
}

