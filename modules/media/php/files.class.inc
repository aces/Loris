<?php declare(strict_types=1);

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
     * @param \Psr\Http\Message\ServerRequestInterface $request The PSR15
     *                                                          Request being handled
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    #[\Override]
    public function handle(
        \Psr\Http\Message\ServerRequestInterface $request
    ) : \Psr\Http\Message\ResponseInterface {
        $user = \User::singleton();
        // @phan-suppress-next-line PhanUndeclaredMethod
        if (!$this->isAccessibleBy($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden("Permission Denied");
        }

        $url    = $request->getUri()->getPath();
        $prefix = $this->getEndpointPrefix();
        $idx    = strpos($url, $prefix);
        $file   = substr($url, $idx + strlen($prefix));

        $db  = $this->loris->getDatabaseConnection();
        $row = $db->pselectRow(
            "SELECT s.CenterID FROM media m
             JOIN session s ON m.session_id = s.ID
             WHERE m.file_name = :file",
            ['file' => $file]
        );

        if (!$row) {
            return new \LORIS\Http\Response\JSON\NotFound("File not found");
        }

        if (!$user->hasPermission('access_all_profiles')
            && !$user->hasCenter(new \CenterID(strval($row['CenterID'])))
        ) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                "Permission Denied for this site"
            );
        }

        return parent::handle($request);
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
