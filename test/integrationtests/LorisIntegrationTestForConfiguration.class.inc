<?php

require_once __DIR__ . "/LorisIntegrationTest.class.inc";

/**
 * This contains an abstract class for Loris tests to extend.
 * It sets up the database handler, creates a user, creates a
 * webDriver instance, and logs in so that tests can focus on
 * the module being tested and not the overhead of logging in
 * to Loris.
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/LorisIntegrationTest.class.inc";
/**
 * Implementation of LorisIntegrationTest for configuration class.
 *
 * @category Test
 * @package  Test
 * @author   Wang Shen <wangshen.mcin@gmail.com> 
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class LorisIntegrationTestForConfiguration extends LorisIntegrationTest
{

    /**
     * Add a method for testing the link. After click the link,the page
     * shows particular content.
     * @param1 webDriver: find the link and click.
     * @param2 webDriver: find the text showing on the page.
     * @param3 text: put the text that should be shown in the assert.
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
