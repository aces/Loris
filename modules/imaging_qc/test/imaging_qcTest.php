<?php declare(strict_types=1);
/**
 * ImagingQCIntegrationTest automated integration tests
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

 require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

class ImagingQCIntegrationTest extends LorisIntegrationTest
{
    /**
     * Ensures that the module loads if and only if the user has one of the
     * module permissions codes.
     *
     * @return void
     */
    public function testPermissions(): void
    {
        $this->checkPagePermissions(
            '/imaging_qc/',
            array(
                'imaging_quality_control_view',
            ),
            "Imaging Quality Control"
        );
    }
}
