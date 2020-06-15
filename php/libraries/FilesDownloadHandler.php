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

    const ERROR_EMPTY_FILENAME = 'Invalid filename: cannot be empty';
    const ERROR_FILE_NOT_FILE = 'File requested is not a file';
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
        if (! $downloadDirectory->isDir()) {
            throw new \LorisException(
                sprintf(
                    "Download directory %s is not a directory",
                    htmlentities($downloadDirectory->getPathname())
                )
            );
        }

        if (! $downloadDirectory->isReadable()) {
            throw new \LorisException(
                sprintf(
                    "Download directory %s is not readable",
                    htmlentities($downloadDirectory->getPathname())
                )
            );
        }
        $this->downloadDirectory = $downloadDirectory;
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
        if ($request->getMethod() != "GET") {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['GET']
            );
        }
        //Use basename to remove path traversal characters.
        $filename = basename($request->getAttribute('filename'));

        if (empty($filename)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                self::ERROR_EMPTY_FILENAME
            );
        }

        $targetPath = \Utility::appendForwardSlash(
            $this->downloadDirectory->getPathname()
        ) . $filename;

        if (!file_exists($targetPath)) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        if (!is_readable($targetPath)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        if (!is_file($targetPath)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                self::ERROR_FILE_NOT_FILE
            );
        }

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
            ->withBody(new \LORIS\Http\FileStream($targetPath));
    }
}

