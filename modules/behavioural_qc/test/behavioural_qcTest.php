<<<<<<< 121fe1ea319ff7def685e706b9f4aa349ad8bb14
<?php
/**
 * Behavioural_QC automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
=======
<?php declare(strict_types=1);
>>>>>>> Cleanup QC integration tests
require_once __DIR__ .
        "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Behavioural_QC automated integration tests
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Behavioural_QCTest extends LorisIntegrationTest
{
    /**
<<<<<<< 121fe1ea319ff7def685e706b9f4aa349ad8bb14
     * Tests that, when loading the behavioural_qc module, some
     * text appears in the body.
     *
     * @return void
     */
    function testBehaviouralQCDoespageLoad()
    {
        $this->safeGet($this->url . "/behavioural_qc/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Behavioural Quality Control", $bodyText);
    }
     /**
      * Tests that behavioural_qc does not load with the permission
      *
      * @return void
      */
    function testBehaviouralQCWithoutPermission()
    {
         $this->setupPermissions([]);
         $this->safeGet($this->url . "/behavioural_qc/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "You do not have access to this page.",
            $bodyText
        );
         $this->resetPermissions();
    }
    /**
     * Tests that help editor loads with the permission
=======
     * Ensures that the module loads if and only if the user has one of the
     * module permissions codes.
>>>>>>> Cleanup QC integration tests
     *
     * @return void
     */
    public function testPermissions(): void
    {
<<<<<<< 121fe1ea319ff7def685e706b9f4aa349ad8bb14
<<<<<<< 95f40eb6a80aa506b5375353c3934bbc0b158ba9
         $this->setupPermissions(["behavioural_quality_control_view"]);
=======
         $this->setupPermissions(array("behavioural_quality_control_view"));
>>>>>>> Apply suggestions from code review
         $this->safeGet($this->url . "/behavioural_qc/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
=======
        $this->checkPagePermissions(
            '/behavioural_qc/',
            array(
                'behavioural_quality_control_view',
            ),
            "Behavioural Quality Control"
>>>>>>> Cleanup QC integration tests
        );
    }
}
