<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Contains the File_Reader class used for electrophysiological browser
 *
 * PHP Version 7
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class File_Reader extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Handle how to operate all the files.
     * GET method gets a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config       = \NDB_Factory::singleton()->config();
        $downloadpath = \Utility::appendForwardSlash(
            $config->getSetting("dataDirBasepath")
        );
        switch ($request->getMethod()) {
        case "GET":
            $file     = $request->getQueryParams()['file'] ?? null;
            $filename = urldecode(basename($file));
            $path     = $downloadpath . dirname($file);
            $fileinfo = new \SPLFileInfo($path);

            if (!$fileinfo->isDir()) {
                return new \LORIS\Http\Response\JSON\NotFound();
            }

            $downloader = new \LORIS\FilesDownloadHandler($fileinfo);

            return $downloader->handle(
                $request->withAttribute('filename', $filename)
            );
        default:
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ["GET"]
            ));
        }
    }
}
