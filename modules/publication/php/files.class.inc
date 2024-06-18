<?php

// @phan-file-suppress PhanUnusedProtectedMethodParameter
// Suppressed due to false-positive for doDownloadNotification function
// Unused parameter $file required to match parent signature

namespace LORIS\publication;

/**
 * Handles managing files through the /files/* endpoint of the publication
 * module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Files extends \LORIS\Http\FilesPassthroughEndpoint
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user accessing the file.
     *
     * @return bool
     */
    function _hasAccess(\User $user): bool
    {
        return $user->hasAnyPermission(
            [
                'publication_view',
                'publication_propose',
                'publication_approve',
            ]
        );
    }

    /**
     * {@inheritDoc}
     *
     * @param \NDB_Config $config the LORIS configuration object to retrieve
     *                            settings from.
     *
     * @return \SplFileInfo
     */
    protected function getDownloadDirectory(\NDB_Config $config): \SplFileInfo
    {
        return new \SplFileInfo($config->getSetting("publication_uploads"));
    }

    /**
     * {@inheritDoc}
     *
     * @return string
     */
    protected function getEndpointPrefix(): string
    {
        return "/files/";
    }

    /**
     * Send a notification for the download.
     *
     * @param string $file The filename being downloaded
     *
     * @return void
     */
    protected function doDownloadNotification($file)
    {
        // Not implemented for this module
    }
}
