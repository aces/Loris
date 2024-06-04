<?php
namespace LORIS\media;

/**
 * Handles managing files through the /files/* endpoint of the media
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
        return $user->hasPermission('media_read');
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
        return new \SplFileInfo($config->getSetting("mediaPath"));
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
}
