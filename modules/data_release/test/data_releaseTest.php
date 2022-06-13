<?php
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * DataReleaseIntegrationTest
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataReleaseIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests the page loads with the view permission
     *
     * @return void
     */
    function testPageLoadsWithViewPermission(): void
    {
        $this->assertStringContainsString(
            "Data Release",
            $this->_loadWithPermission('data_release_view')
        );
        $this->resetPermissions();
    }

    /**
     * Tests the page loads with the edit permission
     *
     * @return void
     */
    function testPageLoadsWithEditPermission(): void
    {
        $this->assertStringContainsString(
            "Data Release",
            $this->_loadWithPermission('data_release_edit_file_access')
        );
        $this->resetPermissions();
    }

    /**
     * Tests the page loads with the upload permission
     *
     * @return void
     */
    function testPageLoadsWithUploadPermission(): void
    {
        $this->assertStringContainsString(
            "Data Release",
            $this->_loadWithPermission('data_release_upload')
        );
        $this->resetPermissions();
    }

    /**
     * Tests the page gives a forbidden message when loaded without any
     * permissions.
     *
     * @return void
     */
    function testPageDoesNotLoadWithoutPermission(): void
    {
        $this->assertStringContainsString(
            'You do not have access',
            $this->_loadWithPermission('')
        );
        $this->resetPermissions();
    }

    /**
     * Helper function to set up and load a page with a given permisison code.
     *
     * @param string $permission A valid permission code for the data_release
     *                           module.
     *
     * @return string The body text of the page loaded.
     */
    function _loadWithPermission(string $permission): string
    {
        $this->setupPermissions([$permission]);
        $this->safeGet($this->url . "/data_release/");
        return $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
    }
}

