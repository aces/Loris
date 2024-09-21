<?php
require_once __DIR__ . "/../../test/integrationtests/LorisIntegrationTest.class.inc";
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;

/**
 * Instrument_builder automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class TestInstrumentTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Inserting testing data.
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->DB->insert(
            "candidate",
            [
                'CandID'                => '900000',
                'PSCID'                 => 'TST0001',
                'RegistrationCenterID'  => 1,
                'RegistrationProjectID' => 1,
                'Active'                => 'Y',
                'UserID'                => 1,
                'Entity_type'           => 'Human',
                'Sex'                   => 'Female'
            ]
        );
        $this->DB->insert(
            'session',
            [
                'ID'            => '999999',
                'CandID'        => '900000',
                'Visit_label'   => 'V1',
                'CenterID'      => 1,
                'ProjectID'     => 1,
                'Current_stage' => 'Not Started',
            ]
        );
        $this->DB->insert(
            'test_names',
            [
                'ID'        => '999999',
                'Test_name' => 'testtest',
                'Full_name' => 'Test Test',
                'Sub_group' => 1,
            ]
        );
        $this->DB->insert(
            'flag',
            [
                'ID'         => '999999',
                'SessionID'  => '999999',
                'Data_entry' => 'In Progress',
                'TestID'     => '999999',
                'CommentID'  => '11111111111111111',
            ]
        );
        // Set up database wrapper and config
    }

    /**
     * Deleting testing data.
     *
     * @return void
     */
    public function tearDown(): void
    {
        $this->DB->delete("session", ['CandID' => '900000']);
        $this->DB->delete("candidate", ['CandID' => '900000']);
        $this->DB->delete("flag", ['ID' => '999999']);
        $this->DB->delete("test_names", ['ID' => '999999']);
        parent::tearDown();
    }

    /**
     * Testing $content appears in the body.
     *
     * @param string $content testing content
     *
     * @return void
     */
    private function _testContent($content)
    {
        $this->_landing();
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("#page"))
            ->getText();
        $this->assertStringContainsString($content, $bodyText);
    }
    /**
     * Testing instrument element appears in the body.
     *
     * @return void
     */
    function testAddElementsWithLorisForm()
    {

        // $this->form->addElement(
        //    'header',
        //    'instrument_title',
        //    "Test Instrument Title"
        // );
        $this->_testContent("Test Instrument Title");

        // $this->addCheckbox(
        //    'testCheckbox',
        //    'Check this checkbox default value is 1',
        //    array('value' => '1')
        // );
        $this->_testContent("Check this checkbox default value is 1");

        // $this->form->addElement(
        //    "text",
        //    'testText',
        //    "text_input",
        //    array("class" => "encrypt required")
        // );
        $this->_testContent("text_input");

        //$this->form->createElement("select","consent", "", $yesNo);
        $this->_testContent("Test selecting 'Yes' from the dropdown menu.");

        //add more test case
        // $this->_testContent("instrument element");
    }

    /**
     * Testing instrument element appears in the body.
     * After editing NDB_instrument php file, modify $instrument_element
     *
     * @return void
     */
    function testTextElement()
    {
        $this->_landing();
        $this->safeFindElement(
            WebDriverBy::Name("testText")
        )->sendKeys("Test Text successful");
        $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();
        $data =  $this->DB->pselectOne(
            'SELECT Data FROM flag
                    JOIN instrument_data ON (instrument_data.ID=flag.DataID)
                where SessionID = 999999',
            [],
        );
        $this->assertStringContainsString('Test Text successful', $data);
    }

    /**
     * Testing CheckBox Element appears in the body.
     *
     * @return void
     */
    function testCheckBoxElement()
    {
        $this->_landing();
        $this->safeFindElement(
            WebDriverBy::Name("testCheckbox")
        )->click();
        $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();
        $data =  $this->DB->pselectOne(
            'SELECT Data FROM flag
                    JOIN instrument_data ON (instrument_data.ID=flag.DataID)
                where SessionID = 999999',
            [],
        );
        $this->assertStringContainsString('"testCheckbox":"1"', $data);
    }

    /**
     * Testing Select Option Element appears in the body.
     *
     * @return void
     */
    function testSelectOptionElement()
    {
        // select 'Yes' option and check it.
        $this->_landing();
        $select  = $this->safeFindElement(
            WebDriverBy::cssSelector("select[name='consent']")
        );
        $element = new WebDriverSelect($select);
        sleep(1);
        $element->selectByVisibleText("Yes");

        $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();

        $data =  $this->DB->pselectOne(
            'SELECT Data FROM flag
                    JOIN instrument_data ON (instrument_data.ID=flag.DataID)
                where SessionID = 999999',
            [],
        );
        $this->assertStringContainsString('"consent":"yes"', $data);

        // select 'No' option and check it.
        $this->_landing();
        sleep(1);
        $select  = $this->safeFindElement(
            WebDriverBy::cssSelector("select[name='consent']")
        );
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("No");

        $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        )->click();

        $data =  $this->DB->pselectOne(
            'SELECT Data FROM flag
                    JOIN instrument_data ON (instrument_data.ID=flag.DataID)
                where SessionID = 999999',
            [],
        );
        $this->assertStringContainsString('"consent":"no"', $data);

    }

    /**
     * Get test instrument page.
     *
     * @return void
     */
    private function _landing()
    {
        $this->safeGet(
            $this->url .
            "/instruments/testtest/?commentID=11111111111111111"
            . "&sessionID=999999&candID=900000"
        );
    }
}

