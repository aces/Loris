<?php
/**
 * Configuration module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Configuration module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ConfigurationTest extends LorisIntegrationTest
{

    /**
     * Tests that, when loading the Configuration module, the word
     * "Configuration" appears somewhere on the page
     *
     * @return void
     */
    public function testConfigurationPageLoads()
    {
        $this->webDriver->get($this->url . "?test_name=configuration");

        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "Configuration",
            $bodyText,
            "Configuration does'nt appear in body text"
        );
    }

    /**
     * Verify that Config module appears in Admin main menu only
     * if the user has permission "config".
     *
     * @return void
     */
    public function testConfigurationMenuDisplayWithPermission()
    {
        $configMenu = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //ul[@class='nav navbar-nav']
                //a[contains(text(), 'Admin')]
                /..
                /ul[@class='dropdown-menu']
                //a[contains(text(), 'Configuration')]
                "
            )
        );
        $this->assertCount(
            1,
            $configMenu,
            "There must be exacly 1 configuration menu when the user have permission"
        );
    }

    /**
     * Verify that Config module does not appears in Admin main
     * menu if the user don't have the 'config' permission.
     *
     * @return void
     */
    public function testConfigurationMenuDontDisplayWithoutPermission()
    {
        // Create a new user that don't have the 'config' permission.
        $this->DB->insert(
            "users",
            array(
             'ID'               => 888880,
             'UserID'           => 'UnitTester2',
             'Real_name'        => 'Unit Tester 2',
             'First_name'       => 'Unit',
             'Last_name'        => 'Tester 2',
             'Email'            => 'tester2@example.com',
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

        $this->DB->run(
            "INSERT IGNORE INTO user_perm_rel
                 SELECT 888880, PermID
                 FROM permissions
                 WHERE code <> 'config' AND code <> 'superuser'"
        );

        // Logout
        $this->webDriver->get($this->url . "?logout=true");
        $loginButton = $this->webDriver
            ->findElement(WebDriverBy::Name("login"))->getAttribute("value");
        $this->assertContains("login", $loginButton);

        // Login
        $this->login("UnitTester2", "4test4");

        $configMenu = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "  
                //ul[@class='nav navbar-nav']
                //a[contains(text(), 'Admin')]
                /..
                /ul[@class='dropdown-menu']
                //a[contains(text(), 'Configuration')]
                "
            )
        );
        $this->assertCount(
            0,
            $configMenu,
            ".
             No configuration menu should appear when the user don't have
             permission. Because this test failed, you will need to delete
             the UserTester2 and his permissions youself.
             Use:
             \tDELETE FROM LorisTest.user_perm_rel WHERE userID = 888880;
             \tDELETE FROM LorisTest.users WHERE ID = 888880;
            "
        );

        // Verify that the configuration module wont load.
        $this->webDriver->get($this->url . "?test_name=configuration");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();

        $this->assertContains(
            "Configuration",
            $bodyText,
            "The page doesn't show 'Configuration'"
        );

        $this->assertContains(
            "You do not have access to this page",
            $bodyText,
            "Error message don't fit"
        );

        // Remove the user
        $this->DB->run(
            "DELETE FROM user_perm_rel WHERE userID = 888880"
        );
        $this->DB->run(
            "DELETE FROM users WHERE ID = 888880"
        );
    }

    /**
     * Click on all the drop down arrows to see if they expand sections properly.
     *
     * @return void
     */
    public function testConfigurationDropdownDisplay()
    {
        $dbTabList = array();
        $this->DB->select(
            "SELECT
                ID,
                Label
            FROM
                LorisTest.ConfigSettings
            WHERE
                Visible = 1 AND
                Parent IS NULL
            ORDER BY
                OrderNumber",
            $dbTabList
        );
        $dbTabCount = count($dbTabList);

        $this->webDriver->get($this->url . "?test_name=configuration");
        $tabList  = $this->webDriver->findElements(
            WebDriverBy::cssSelector(".nav-pills > li > a")
        );
        $tabCount = count($tabList);

        $this->assertEquals(
            $dbTabCount,
            $tabCount,
            "The number of displayed tabs don't match database"
        );

        for ($i = 0; $i < $tabCount; $i++) {
            $this->assertEquals(
                $dbTabList[$i]["Label"],
                $tabList[$i]->getText(),
                "Tab and config labels don't match"
            );

            $tabList[$i]->click();
            $activeTabLabel = $this->webDriver->findElement(
                WebDriverBy::cssSelector(".tab-content > .active > h3")
            )->getText();
            $this->assertEquals(
                $dbTabList[$i]["Label"],
                $activeTabLabel,
                "The right panel do not display the same label"
            );

            $dbConfigSettings = $this->DB->pselect(
                "SELECT
                    Label
                FROM
                    LorisTest.ConfigSettings
                WHERE
                    Visible = 1 AND
                    Parent = :ID
                ORDER BY
                    OrderNumber",
                array( ":ID" => $dbTabList[$i]["ID"])
            );

            $configSettings = $this->webDriver->findElements(
                WebDriverBy::cssSelector(
                    "
                    #lorisworkspace > div > div > .active
                    > div > form > div
                    "
                )
            );
            $submitDiv      = $this->webDriver->findElements(
                WebDriverBy::cssSelector(
                    "
                    #lorisworkspace > div > div > .active
                    > div > form > div > .submit-area
                    "
                )
            );
            $this->assertCount(
                1,
                $submitDiv,
                "Submit div missing for the " . $dbTabList[$i]["Label"] . "tab"
            );

            $configSettingsCount   = count($configSettings) - count($submitDiv);
            $dbConfigSettingsCount = count($dbConfigSettings);
            $this->assertEquals(
                $configSettingsCount,
                $dbConfigSettingsCount,
                "ConfigSettingsCount don't match"
            );

            for ($j = 0; $j <$dbConfigSettingsCount; $j++) {
                if (!$submitDiv[0]->equals($configSettings[$j])) {
                    $labelTag = $configSettings[$j]->findElement(
                        WebDriverBy::cssSelector("div label")
                    );
                }
                if (isset($labelTag)) {
                    $this->assertEquals(
                        $labelTag->getText(),
                        $dbConfigSettings[$j]['Label'],
                        "Leaf and config labels don't match"
                    );
                }
            }
        }
    }

    /**
     * Check that each leaf field has a form area to edit the configuration
     * value. If there is no form area, check that there is at least a button
     * to add a field.
     *
     * @note this should use dataprovider.
     *
     * @return void
     */
    public function testConfigurationInputAvailableAndFits()
    {
        $this->webDriver->get($this->url . "?test_name=configuration");

        $dbConfigs = array();
        $this->DB->select(
            "SELECT
                cs.ID as ID,
                cs.Name,
                cs.AllowMultiple,
                cs.DataType,
                c.ID as ConfigID,
                c.Value
            FROM
                ConfigSettings cs
            JOIN Config c
                ON (c.ConfigID = cs.ID)
            WHERE
                Visible = 1 AND
                Parent IS NOT NULL
            ORDER BY
                cs.ID",
            $dbConfigs
        );

        foreach ($dbConfigs as $dbConfig) {
            $configDiv = $this->webDriver->findElement(
                //WebDriverBy::xPath("//div[@id='" . $dbConfig['ID'] . "']")
                WebDriverBy::id($dbConfig['ID'])
            );
            switch ($dbConfig['DataType']) {
            case 'boolean':
                $inputs = $configDiv->findElements(
                    WebDriverBy::xPath("./label/input")
                );
                $this->assertCount(
                    2,
                    $inputs,
                    "Input count should be 2 under config: " . $dbConfig['Name']
                );

                // Verify configSettings ID
                $idInput0 = $inputs[0]->getAttribute("name");
                $idInput1 = $inputs[1]->getAttribute("name");
                $this->assertEquals(
                    $idInput0,
                    $idInput1,
                    "Input ID differ for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    $idInput0,
                    $dbConfig['ConfigID'],
                    "Input ID don't match database for config :" . $dbConfig['Name']
                );

                // Verify checked value.
                $checked = $configDiv->findElement(
                    WebDriverBy::xPath("./label/input[@type='radio' and @checked]")
                );
                $this->assertEquals(
                    $checked->getAttribute("value"),
                    $dbConfig['Value'],
                    "Value don't match database for config :" . $dbConfig['Name']
                );

                // Verify database value for AllowMultiple
                $this->assertEquals(
                    0,
                    $dbConfig['AllowMultiple'],
                    "AllowMultiple value error for config :" . $dbConfig['Name']
                );
                break;
            case 'email':
                $inputs = $configDiv->findElements(
                    WebDriverBy::xPath("./input[@type='email']")
                );
                $this->assertCount(
                    1,
                    $inputs,
                    "Input email count for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    $inputs[0]->getAttribute("name"),
                    $dbConfig['ConfigID'],
                    "Input ID don't match database for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    $inputs[0]->getAttribute("value"),
                    $dbConfig['Value'],
                    "Value don't match database for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    0,
                    $dbConfig['AllowMultiple'],
                    "AllowMultiple value error for config :" . $dbConfig['Name']
                );
                break;
            case 'instrument':
                /*
                // TODO :: to finalyze
                // My two cents : Those inputs field should be checkboxes.

                // Verify group entry
                $selectedOptions = $configDiv->findElements(
                     WebDriverBy::xPath("./select/option[@selected]")
                );

                // Verify Add and Remove buttons
                $removeButtons = $configDiv->findElements(
                     WebDriverBy::xPath(
                         "
                         .
                         /div[@class='input-group entry']
                         /div
                         /button[@class=matches('btn-remove')]
                         "
                     )
                );
                var_dump($removeButtons);
                // Verify database value for AllowMultiple
                */
                $this->assertEquals(
                    1,
                    $dbConfig['AllowMultiple'],
                    "AllowMultiple value error for config :" . $dbConfig['Name']
                );
                break;
            case 'text':
                $inputs = $configDiv->findElements(
                    WebDriverBy::xPath("./input")
                );
                $this->assertCount(
                    1,
                    $inputs,
                    "Input text count for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    $inputs[0]->getAttribute("name"),
                    $dbConfig['ConfigID'],
                    "Input ID don't match database for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    $inputs[0]->getAttribute("value"),
                    $dbConfig['Value'],
                    "Value don't match database for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    0,
                    $dbConfig['AllowMultiple'],
                    "AllowMultiple value error for config :" . $dbConfig['Name']
                );
                break;
            case 'textarea':
                $inputs = $configDiv->findElements(
                    WebDriverBy::xPath("./textarea")
                );
                $this->assertCount(
                    1,
                    $inputs,
                    "Input textarea count for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    $inputs[0]->getAttribute("name"),
                    $dbConfig['ConfigID'],
                    "Input ID don't match database for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    $inputs[0]->getAttribute("value"),
                    $dbConfig['Value'],
                    "Value don't match database for config :" . $dbConfig['Name']
                );

                $this->assertEquals(
                    0,
                    $dbConfig['AllowMultiple'],
                    "AllowMultiple value error for config :" . $dbConfig['Name']
                );
                break;
            default:
                $dataType = $dbConfig['DataType'];
                $config   = $dbConfig['Name'];
                $this->fail(
                    "Unsupported DataType '" . $dataType . "'; config :" . $config
                );
                break;
            }
        }
    }

    /**
     * Go through each field in the configuration module. For each field, try
     * changing the value and submit. There should be a "submited" confirmation.
     * Try to see if the change actually affected LORIS in some way.
     * For example, for the project description in the dashboard settings, go to
     * the dashboard to see if the project description actually changed.
     *
     * @note this should use dataprovider.
     *
     * @group gloabal_LORIS_test
     *
     * @depends testConfigurationInputAvailableAndFits
     *
     * @return void
     */
    public function testConfigurationValueChangeEffects()
    {
        $this->markTestSkipped("Can't be tested. Database limitation");
        $this->webDriver->get($this->url . "?test_name=configuration");

        $dbConfigs = array();
        $this->DB->select(
            "SELECT
                cs.ID as ID,
                cs.Name as Name,
                cs.AllowMultiple as AllowMultiple,
                cs.DataType as DataType,
                c.ID as ConfigID,
                c.Value as Value
            FROM
                ConfigSettings cs
            JOIN Config c
                ON (c.ConfigID = cs.ID)
            WHERE
                Visible = 1 AND
                Parent IS NOT NULL
            ORDER BY
                cs.ID",
            $dbConfigs
        );
        foreach ($dbConfigs as $dbConfig) {
            switch ($dbConfig['Name']) {
            default:
                break;
            }
        }
    }

    /**
     * Verify that Help section shows ans contains a title,
     * content, edit button and a close button.
     *
     * @note : remaining test to code
     *   -  buttons click.
     *
     * @return void
     */
    public function testHelpContent()
    {
        $this->markTestSkipped("Travis don't display the Help div");

        $this->webDriver->get($this->url . "?test_name=configuration");
        $helpLink = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //*[contains(@class, 'help-button')]
                "
            )
        );
        $this->assertCount(
            2,
            $helpLink,
            "There must be exactly 2 help buttons"
        );

        // $helpLink[0] is the button for mobile display
        $helpLink[1]->click();

        $page = $this->webDriver->findElement(
            WebDriverBy::id('page')
        );
        $help = $page->findElements(
            WebDriverBy::xPath("./div[contains(@class, 'help-content')]")
        );
        $this->assertCount(
            1,
            $help,
            "help content don't appears"
        );

        $headers = $help[0]->findElements(
            WebDriverBy::xPath(
                ".//h3[contains(text(), 'Configuration')]"
            )
        );
        $this->assertCount(
            1,
            $headers,
            "There must be exacly 1 configuration header in help content"
        );

        $editButton = $help[0]->findElements(
            WebDriverBy::xPath(
                "./button[@id='helpedit']"
            )
        );
        $this->assertCount(
            1,
            $editButton,
            "There must be exacly 1 edit button in help content"
        );

        $closeButton = $help[0]->findElements(
            WebDriverBy::xPath(
                "./button[@id='helpclose']"
            )
        );
        $this->assertCount(
            1,
            $closeButton,
            "There must be exacly 1 close button in help content"
        );

        $helpTextContent = $help[0]->findElements(
            WebDriverBy::xPath(
                "./pre/*"
            )
        );
        $this->assertGreaterThan(
            0,
            strlen($helpTextContent[0]->getText()),
            "There is no help text"
        );
    }

    /**
     * This should test something about the subproject page.
     *
     * @return void
     */
    public function testSubproject()
    {
        $this->markTestSkipped("Not yet implemented");
    }
}
?>
