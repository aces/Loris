<?php
/**
 * User accounts automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
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
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
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
    /**
     * Tests that, when loading the User accounts module, some
     * text appears in the body.
     *
     * @return void
     */
    function testUserAccountsDoespageLoad()
    {
        $this->safeGet($this->url . "/user_accounts/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("User Accounts", $bodyText);
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
    function testSearchForUsers()
    {
        $this->_assertSearchBy("userID", "my_nonexistent_user_ID", null);
        $this->_assertSearchBy("userID", "UnitTester", "UnitTester");
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
        $this->safeGet($this->url . "/user_accounts/");
        $this->safeClick(WebDriverBy::Name('button'));
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
     * @return void.
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
     * Performs a candidate search using the specified criteria and verifies
     * the candidates obtained.
     *
     * @param array  $elementName     name of the element.
     * @param string $testData        the testing data
     * @param string $expectedResults the result that should be returned.
     *
     * @return void.
     */
    private function _assertSearchBy($elementName,$testData,$expectedResults)
    {
        {
            $this->safeGet($this->url . "/user_accounts/");
            $element = $this->safeFindElement(
                WebDriverBy::Name($elementName)
            );
            $element->clear();
            $element->sendKeys($testData);
            }
            $this->safeClick(WebDriverBy::Name("filter"));

            $this->_assertUserReactTableContents($testData, $expectedResults);
    }
    /**
     * Compares the content of the candidate table with an expected content.
     *
     * @param string $className    class name of the HTML table.
     * @param string $expectedRows array of candidates that the table should contain.
     *
     * @return void
     */
    private function _assertUserTableContents($className, $expectedRows)
    {
        $dataTable = $this->safeFindElement(
            WebDriverBy::ClassName($className)
        );
        if (is_null($expectedRows)) {
            $this->assertContains('No users found', $dataTable->getText());
        } else {
            $actualRows = $dataTable->findElements(
                WebDriverBy::xpath('.//tbody//tr')
            );
            $this->assertEquals(
                count($actualRows),
                count($expectedRows),
                "Number of users returned should be "
                . count($expectedRows) . ", not " . count($actualRows)
            );
            for ($i=1; $i<=count($actualRows); $i++) {
                $elements      = $actualRows[$i-1]->findElements(
                    WebDriverBy::xpath('.//td')
                );
                $actualColumns = array();
                foreach ($elements as $e) {
                    $actualColumns[] = $e->getText();
                }
                $expectedColumns = $expectedRows[$i-1];
                array_unshift($expectedColumns, "$i");
                $this->assertEquals(
                    $actualColumns,
                    $expectedColumns,
                    "Users at row $i differ"
                );
            }
        }
    }
    /**
     * Compares the content of the candidate table with an expected content.
     *
     * @param string $testData     the test data
     * @param string $expectedRows array of candidates that the table
     *                                                       should contain.
     *
     * @return void
     */
    private function _assertUserReactTableContents($testData,$expectedRows)
    {
        $dataTable =  $this->safeGet($this->url . "/user_accounts/?format=json")
            ->getPageSource();
        if (is_null($expectedRows)) {
            $this->assertContains('"Data":[]', $dataTable);
        } else {

             $this->assertContains($testData, $dataTable);

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
?>
