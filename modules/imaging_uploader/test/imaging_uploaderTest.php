<?php
/**
 * Imaging_uploader
 * 
 *
 * PHP Version 5
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Imaging
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    Loris License
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__ . 
           "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Imaging_uploader
 *
 * PHP Version 5
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Imaging
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    Loris License
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */

class imaging_uploaderTestIntegrationTest extends LorisIntegrationTest
{
    function testImagingUploaderDoespageLoad()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(
                        WebDriverBy::cssSelector("body")
                    )->getText();
        $this->assertContains("Imaging Upload", $bodyText);
    }
}
?>
