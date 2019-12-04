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
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Automated integration tests for the meta_docs module.
 *
 * @category Test
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class MetaDocsTestIntegrationTest extends \LorisIntegrationTest
{
    /**
     * Tests that, when loading the meta_docs module, the is available specs
     * in swagger-ui.
     *
     * @return void
     */
    function testAnonymousUserDoesPageLoad()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/meta_docs");
        $selectOptions = $this->webDriver->findElement(
            WebDriverBy::Id("select")
        );
        $this->assertNotEmpty($selectOptions);
    }
}
