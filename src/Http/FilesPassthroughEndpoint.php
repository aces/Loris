<?php
namespace LORIS\Http;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A FilesPassthroughEndpoint is a helper class for endpoints that
 * need to handle accessing files from the filesystem thhrough a
 * REST endpoint such as /modulename/files/abc.txt.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
abstract class FilesPassthroughEndpoint extends Endpoint
{
    /**
     * Construct a FilesPassthroughEndpoint.
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        protected \Module $Module
    ) {
        parent::__construct($loris);
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $url    = $request->getURI()->getPath();
        $prefix = $this->getEndpointPrefix();
        $idx    = strpos($url, $prefix);
        $file   = substr($url, $idx + strlen($prefix));
        switch ($request->getMethod()) {
            case 'GET':
                $this->doDownloadNotification($file);
                $handler = new \LORIS\FilesDownloadHandler(
                    $this->getDownloadDirectory($this->loris->getConfiguration())
                );
                return $handler->handle($request->withAttribute("filename", $file));
                // FIXME: This should handle POST/PUT using the FilesUploadHandler
            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }
    }

    /**
     * Return the download directory on the server's filesystem which the
     * files are stored relative to. This is generally a configuration
     * variable from LORIS.
     *
     * @param \NDB_Config $config The LORIS config object
     * @return \SplFileInfo
     */
    abstract protected function getDownloadDirectory(\NDB_Config $config): \SplFileInfo;

    /**
     * getEndpointPrefix returns the portion of the endpoint (relative to the module)
     * that must be stripped from the URL to get the filename.
     *
     * @return string
     */
    abstract protected function getEndpointPrefix() : string;

    /**
     * Define a stub loadResources so that we don't crash when the module
     * handler calls it.
     */
    public function loadResources(
        \User $user,
        ServerRequestInterface $request
    ) : void {
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
        $downloadNotifier = new \NDB_Notifier(
            $this->Module->getName(),
            "download",
            ["file" => $file]
        );
        $downloadNotifier->notify();
    }
}
