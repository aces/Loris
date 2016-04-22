<?php

require_once __DIR__ . "/LorisIntegrationTest.class.inc";
/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LorisIntegrationTestConfiguration extends LorisIntegrationTest
{

    /**
     * Add a method for testing the link. After click the link,the page
     * shows particular content.
     * @param1 webDriver: find the link and click.
     * @param2 webDriver: find the text showing on the page.
     * @param3 text: put the text in the assert.
     */
     function linkTest(WebDriverBy $by, WebDriverBy $byForContent, $testContent)
    {
        $webElement = $this->safeFindElement($by)->click();
       
        $bodyText = $this->safeFindElement(
             $byForContent
         )->getText();
        $this->assertContains($testContent, $bodyText);

    }
}
?>
