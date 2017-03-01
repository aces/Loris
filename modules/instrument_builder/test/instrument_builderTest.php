<?php
/**
 * Instrument_builder automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class instrumentBuilderTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Instrument builder module, some
     * text appears in the body.
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $this->DB->insert("candidate", array(
            'CandID' => '900000',
            'PSCID'  => 'TST0001',
            'CenterID' => 1,
            'Active' => 'Y',
            'UserID' => 1,
            'Entity_type' => 'Human'
        ));
        $this->DB->insert('session', array(
            'ID' => '999999',
            'CandID' => '900000',
            'Visit_label' => 'V1',
            'CenterID' => 1,
            'Current_stage'   => 'Not Started',
        ));
        // Set up database wrapper and config
    }
    public function tearDown() {
        $this->DB->delete("session", array('CandID' => '900000'));
        $this->DB->delete("candidate", array('CandID' => '900000'));
        parent::tearDown();
    }
    function testInstrumentBuilderDoespageLoad()
    {
        $this->safeGet($this->url . "/instrument_builder/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
        $this->assertContains("Instrument Builder", $bodyText);
    }
    /**
     * Tests that, when loading the Instrument builder module with permission, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentBuilderDoespageLoadWithPermission()
    {
        $this->setupPermissions(array("instrument_builder"));
        $this->safeGet($this->url . "/instrument_builder/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
        $this->assertContains("Instrument Builder", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, when loading the Instrument builder module without permisson, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentBuilderDoespageLoadWithoutPermission()
    {
        $this->setupPermissions(array(""));
        $this->safeGet($this->url . "/instrument_builder/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * 
     * Testing $content appears in the body.
     *
     * @param string   testing content
     *
     * @return void
     */
    private function _testContent($content)
    {
      $this->safeGet($this->url . "/testtest/?candID=900000&sessionID=999999");
      $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
      $this->assertContains($content, $bodyText);
    }
    /**
     * Testing instrument element appears in the body.
     *
     * @return void
     */
    function testInstrumentWithLorisForm()
    {
        $this->_testContent("IBIS Environment Residential History");

        //add more test case 
        // $this->_testContent("instrument element");
    }
}
?>
