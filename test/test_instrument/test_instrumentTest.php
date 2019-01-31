<?php
/**
 * Instrument_builder automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../test/integrationtests/LorisIntegrationTest.class.inc";
class TestInstrumentTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Instrument builder module, some
     * text appears in the body.
     *
     * @return void
     */
    /**
     * 
     * Inserting testing data.
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $this->DB->insert("candidate", array(
            'CandID'               => '900000',
            'PSCID'                => 'TST0001',
            'RegistrationCenterID' => 1,
            'Active'               => 'Y',
            'UserID'               => 1,
            'Entity_type'          => 'Human'
        ));
        $this->DB->insert('session', array(
            'ID' => '999999',
            'CandID' => '900000',
            'Visit_label' => 'V1',
            'CenterID' => 1,
            'Current_stage'   => 'Not Started',
        ));
        $this->DB->insert('flag', array(
            'ID' => '999999',
            'SessionID' => '999999',
            'Test_name' => 'testtest',
            'CommentID' => '11111111111111111',
        ));
        // Set up database wrapper and config
    }
    /**
     * 
     * Deleting testing data.
     *
     * @return void
     */
    public function tearDown() {
        $this->DB->delete("session", array('CandID' => '900000'));
        $this->DB->delete("candidate", array('CandID' => '900000'));
        $this->DB->delete("flag", array('ID' => '999999'));
        parent::tearDown();
    }
    /**
     * 
     * Testing $content appears in the body.
     *
     * @param string  $content      testing content
     *
     * @return void
     */
    private function _testContent($content)
    {
      $this->_landing();
      $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
      $this->assertContains($content, $bodyText);
    }
    /**
     * Testing instrument element appears in the body.
     *
     * @return void
     */
    function testAddElementsWithLorisForm()
    {

       // $this->form->addElement('header', 'instrument_title', "Test Instrument Title");
        $this->_testContent("Test Instrument Title");

       // $this->addCheckbox('testCheckbox', 'Check this checkbox default value is 1', array('value' => '1'));
        $this->_testContent("Check this checkbox default value is 1");

       // $this->form->addElement("text", 'testText', "text_input", array("class" => "encrypt required"));
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
//    function testInstrumentWithLorisForm()
//    {

//         $this->_testContent("$instrument_element");

//    }
   function testTextElement()
   {
      $this->_landing();
      $textElement = $this->webDriver->findElement(
             WebDriverBy::Name("testText")
      )->sendKeys("Test Text successful"); 
      $this->webDriver->findElement(
             WebDriverBy::Name("fire_away")
      )->click();
      $data =  $this->DB->pselectOne(
        'SELECT Data FROM flag where SessionID = 999999',array()
        );
      $this->assertContains('Test Text successful',$data); 
    } 


   function testCheckBoxElement()
   {
      $this->_landing();
      $textElement = $this->webDriver->findElement(
             WebDriverBy::Name("testCheckbox")
      )->click();
      $this->webDriver->findElement(
             WebDriverBy::Name("fire_away")
      )->click();
      $data =  $this->DB->pselectOne(
        'SELECT Data FROM flag where SessionID = 999999',array()
        );
      $this->assertContains('"testCheckbox":"1"',$data);
    }

   function testSelectOptionElement()
   {
      // select 'Yes' option and check it.
      $this->_landing();
      $select  = $this->safeFindElement(WebDriverBy::Name("consent"));
      $element = new WebDriverSelect($select);
      $element->selectByVisibleText("Yes");

      $this->webDriver->findElement(
             WebDriverBy::Name("fire_away")
      )->click();

      $data =  $this->DB->pselectOne(
        'SELECT Data FROM flag where SessionID = 999999',array()
        );
      $this->assertContains('"consent":"yes"',$data);

      // select 'No' option and check it.
      $this->_landing();
      $select  = $this->safeFindElement(WebDriverBy::Name("consent"));
      $element = new WebDriverSelect($select);
      $element->selectByVisibleText("No");
      
      $this->webDriver->findElement(
             WebDriverBy::Name("fire_away")
      )->click();

      $data =  $this->DB->pselectOne(
        'SELECT Data FROM flag where SessionID = 999999',array()
        );
      $this->assertContains('"consent":"no"',$data);

    }

    private function _landing(){
      $this->safeGet($this->url .
        "/instruments/testtest/?commentID=11111111111111111&sessionID=999999&candID=900000"
      );
    } 
}
?>
