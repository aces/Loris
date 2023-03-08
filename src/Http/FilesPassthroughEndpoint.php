<?php
namespace LORIS\Http;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Creates the form for NDB_Form_media
 *
 * @category Loris
 * @package  Media
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
abstract class FilesPassthroughEndpoint extends Endpoint
{
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
                $this->doNotification($file);
                $handler = new \LORIS\FilesDownloadHandler(
                    $this->getDownloadDirectory($this->loris->getConfiguration())
                );
                return $handler->handle($request->withAttribute("filename", $file));
                // FIXME: This should handle POST/PUT using the FilesUploadHandler
            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }
    }

    //abstract public function _hasAccess(\User $user) : bool;
    abstract protected function getDownloadDirectory(\NDB_Config $config): \SplFileInfo;

    abstract protected function getEndpointPrefix() : string;

    public function loadResources(
        \User $user,
        ServerRequestInterface $request
    ) : void {
    }

    protected function doNotification($file)
    {
        $downloadNotifier = new \NDB_Notifier(
            $this->Module->getName(),
            "download",
            ["file" => $file]
        );
        $downloadNotifier->notify();
    }
}
