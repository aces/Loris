<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Automated integration tests for the api_docs module.
 *
 * @category Test
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class APIDocsTestIntegrationTest extends \LorisIntegrationTest
{
    /**
     * Tests that, when loading the api_docs module, the is available specs
     * in swagger-ui.
     *
     * @return void
     */
    function testAnonymousUserDoesPageLoad()
    {
        $this->setupPermissions([]);
        $this->safeGet($this->url . "/api_docs");
        $selectOptions = null;
        try {
            $selectOptions = $this->webDriver->findElement(
                WebDriverBy::cssSelector("select")
            );
        } catch (\Facebook\WebDriver\Exception\NoSuchElementException $e) {
            $content = $this->webDriver->findElement(
                WebDriverBy::id("lorisworkspace")
            );
            $this->fail('Can`t find select element. Found: ' . $content);
        }
        $this->assertNotEmpty($selectOptions);
    }
}
