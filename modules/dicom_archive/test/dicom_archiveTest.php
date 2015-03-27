<?php
/**
 * dicom_archive automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class dicomArchiveTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the dicom_archive module, some
     * text appears in the body.
     *
     * @return void
     */
    function testdicomArchiveDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=dicom_archive");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Dicom Archive", $bodyText);
    }

    /**
     * Tests that, when loading the dicom_archive module > viewDetails subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testdicomArchiveViewDetailsDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=dicom_archive&subtest=viewDetails");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("View Details", $bodyText);
    }
}
?>