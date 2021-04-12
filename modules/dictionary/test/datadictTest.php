<?php
/**
 * Datadict automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;
require_once __DIR__ .
             "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Datadict automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DictionaryTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * UI elements and locations
     * breadcrumb - 'Access Profile'
     * Table headers
     */
    protected $loadingUI = [
        'Data Dictionary'    => '#bc2 > a:nth-child(2) > div',
        'Source From'        => '#dynamictable > thead > tr > th:nth-child(2)',
        'Name'               => '#dynamictable > thead > tr > th:nth-child(3)',
        'Source Field'       => '#dynamictable > thead > tr > th:nth-child(4)',
        'Description'        => '#dynamictable > thead > tr > th:nth-child(5)',
        'Description Status' => '#dynamictable > thead > tr > th:nth-child(6)',
    ];

    /**
     * Inserting testing data
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "parameter_type",
            [
                'Name'        => 'TestParameterNotRealMAGICNUMBER335',
                'Type'        => 'varchar(255)',
                'Description' => 'I am a fake description used only for testing'.
                                      ' you should not see me. MAGICNUMBER335',
                'SourceFrom'  => 'nowhere',
                'SourceField' => 'imaginary',
                'Queryable'   => true,
                'IsFile'      => 0,
            ]
        );
    }
    /**
     * Deleting testing data
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete(
            'parameter_type',
            ['Name' => 'TestParameterNotRealMAGICNUMBER335']
        );
    }
    /**
     * Tests that, when loading the datadict module, some
     * text appears in the body.
     *
     * @return void
     */
    function testDictionaryDoespageLoad()
    {
        $this->webDriver->get($this->url . "/dictionary/");

                $this->webDriver->wait(120, 1000)->until(
                    WebDriverExpectedCondition::presenceOfElementLocated(
                        WebDriverBy::Name("Name")
                    )
                );

                $bodyText = $this->webDriver->findElement(
                    WebDriverBy::cssSelector("body")
                )->getText();
                $this->assertContains("Data Dictionary", $bodyText);
    }
    /**
     * Testing UI elements when page loads
     *
     * @return void
     */
    function testPageUIs()
    {
        $this->safeGet($this->url . "/dictionary/");
        foreach ($this->_loadingUI as $key => $value) {
            $text = $this->safeFindElement(
                WebDriverBy::cssSelector($value)
            )->getText();
            $this->assertContains($key, $text);
        }
    }
}

