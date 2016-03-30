<?php
/**
 * datadict automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class datadictTestIntegrationTest extends LorisIntegrationTest
{
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "parameter_type",
            array(
             'Name'        => 'TestParameterNotRealMAGICNUMBER335',
             'Type'        => 'varchar(255)',
             'Description' => 'I am a fake description used only for testing you should not see me. MAGICNUMBER335',
             'SourceFrom'  => 'nowhere',
             'SourceField' => 'imaginary',
             'Queryable'   => true,
             'IsFile'      => 0,
            )
        );
    }
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete('parameter_type', array('Name' => 'TestParameterNotRealMAGICNUMBER335'));
    }
    /**
     * Tests that, when loading the datadict module, some
     * text appears in the body.
     *
     * @return void
     */

    function testDatadictDoespageLoad()
    {
        $this->webDriver->get($this->url . "/datadict/");
                $this->webDriver->wait(120, 1000)->until(
                    WebDriverExpectedCondition::presenceOfElementLocated(
                        WebDriverBy::Name("keyword")
                    )
                );

                $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
                $this->assertContains("Data Dictionary", $bodyText);
    }

    function testDataDictSearchKeywordFilters()
    {
        $this->webDriver->get($this->url . "/datadict/");
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Name("keyword")
            )
        );

        $searchKey = $this->webDriver->findElements(WebDriverBy::Name("keyword"));

        switch (count($searchKey)) {
        case 1:
            break;
        case 0:
            $this->fail("Could not find search keyword field");
            return;
        default:
            $this->fail("Too many search keyword fields.");
            return;
        }

        $searchKey[0]->sendKeys("NotRealMAGICNUMBER335");
        $searchButton = $this->webDriver->findElement(WebDriverBy::Name("filter"));

        $searchButton->click();

        $this->markTestSkipped("Data Dict test not yet updated for React");
        /*
		try {
            while (true) {
                $oldBody->isDisplayed();
        }
		} catch(Exception $e) {
			$this->webDriver->executescript("document.documentElement.outerHTML");

		}
         */

        $rows = $this->webDriver->findElements(WebDriverBy::cssSelector("table tbody tr"));

        $this->assertTrue(count($rows) == 1, "Incorrect number of rows returned when filtering for keyword on datadict" . print_r($rows, true));

        $cols = $this->webDriver->findElements(WebDriverBy::cssSelector("table tbody tr td"));

        // Rownumber
        $this->assertEquals($cols[0]->getText(), "1");
        // SourceFrom
        $this->assertEquals($cols[1]->getText(), "nowhere");
        // Name
        $this->assertEquals($cols[2]->getText(), "TestParameterNotRealMAGICNUMBER335");
        // SourceField
        $this->assertEquals($cols[3]->getText(), "imaginary");
        // Description
        $this->assertEquals($cols[4]->getText(), "I am a fake description used only for testing you should not see me. MAGICNUMBER335");
    }
}
?>
