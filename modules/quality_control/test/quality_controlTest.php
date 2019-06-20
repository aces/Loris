<?php
/**
 * AcknowledgementsIntegrationTest automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
 require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * AcknowledgementsIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class QualityControlIntegrationTest extends LorisIntegrationTest
{
    /**
     * Insert testing data into the database
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
    }
    /**
     * Delete test data
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
    }
    /**
     * Tests that, the homepage should have "Quality Control" on the page.
     *
     * @return void
     */
    function testPageLoads()
    {
        $this->safeGet($this->url . "/quality_control/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Quality Control", $bodyText);
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertNotContains("An error occurred", $bodyText);

    }
}
