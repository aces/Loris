<?php declare(strict_types=1);

namespace LORIS;

use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * This class handles files being downloaded from LORIS. It should
 * serve as the ONLY way that files are downloaded so that all file downloading
 * functionality can occur on a well-tested foundation.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class FilesDownloadHandler implements RequestHandlerInterface
{

    /**
     * The target download directory.
     *
     * @var \SplFileInfo
     */
    protected $downloadDirectory;

    /**
     * Create new instance of a File Downloader.
     *
     * @param \SplFileInfo $downloadDirectory The target download directory
     */
    public function __construct(\SplFileInfo $downloadDirectory)
    {
        $this->downloadDirectory = $downloadDirectory;

        if (! $this->downloadDirectory->isDir()) {
            throw new \LorisException(
                'Download directory is not a directory'
            );
        }

        if (! $this->downloadDirectory->isReadable()) {
            throw new \LorisException(
                'Download directory is not readable'
            );
        }
    }

    /**
     * Given an HTTP request, serve the file to the client.
     *
     * All files uploaded will get the same permissions.
     *
     * If the overwrite property is set to true, existing files will be
     * overwritten.
     *
     * @param ServerRequestInterface $request An HTTP Request that contains files.
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $filename = $request->getAttribute('filename');
        if (is_null($filename)) {
            throw new \LorisException(
                'Must supply "filename" as a parameter'
            );
        }

        //Use basename to remove path traversal characters.
        $targetPath = $this->downloadDirectory->getPathname() . '/' . basename(
            $filename
        );

        /* If file exists, set response code to 'Conflict' unless the
         * calling code wants to overwrite the file.
         */
        if (!file_exists($targetPath)) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        if (!is_readable($targetPath)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        // Serve the file. If configured, the X-Sendfile header will serve
        // the file directly from the filesystem instead of first loading it
        // into PHP's memory. This allows LORIS to serve very large files more
        // reliably.
        $mime = mime_content_type($targetPath);
        return (new \LORIS\Http\Response\JSON\OK())
            ->withHeader(
                'Content-Disposition',
                'attachment; filename=' . $filename
            )
            ->withHeader(
                'Content-Type',
                $mime !== false ? $mime : 'application/octet-stream'
            )
            ->withHeader('X-Sendfile', $targetPath)
            ->withBody(new \LORIS\Http\FileStream($targetPath));
    }
}

