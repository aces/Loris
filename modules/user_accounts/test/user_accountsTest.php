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
    private static $_UNIT_TESTER = array(
                                    'Data Coordinating Center',
                                    'UnitTester',
                                    'Unit Tester',
                                    'tester@example.com',
                                    'Y',
                                    'N',
                                   );
    private static $_ADMIN       = array(
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
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'First_name',
            'NewFirst'
        );
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'Last_name',
            'NewLast'
        );
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'Active',
            'No'
        );
        $this->_verifyUserModification(
            'user_accounts',
            'UnitTester',
            'Email',
            'newemail@example.com'
        );
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
     * and checks that the modification was recorded in the database.
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
        $this->_accessUser($page, $userId);
        $field = $this->safeFindElement(WebDriverBy::Name($fieldName));
        if ($field->getTagName() == 'input') {
            $field->clear();
            $field->sendKeys($newValue);
        } else {
            $selectField = new WebDriverSelect($field);
            $selectField->selectByVisibleText($newValue);
        }

        // if working on edit_user, select at least one site
        if (strpos($page, 'my_preferences') === false) {
            $sitesElement = $this->safeFindElement(WebDriverBy::Name('CenterIDs[]'));
            $sitesOption  = new WebDriverSelect($sitesElement);
            $sitesOption->selectByValue("1");
        }
        $this->safeClick(WebDriverBy::Name('fire_away'));

        $this->_accessUser($page, $userId);
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

