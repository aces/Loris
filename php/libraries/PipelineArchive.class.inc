<?php declare(strict_types=1);

use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \LORIS\Http\Endpoint;

/**
 * This class handles pipeline archives downlaod. It should
 * serve as the ONLY way that files are downloaded so that all file downloading
 * functionality can occur on a well-tested foundation.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class PipelineArchive extends Endpoint
{
    const ERROR_EMPTY_FILENAME = 'Invalid filename: cannot be empty';
    const ERROR_FILE_NOT_FOUND = 'File requested cannot be found';

    /**
     * Given an HTTP request, serve the file to the client.
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

        $filename = strval($request->getQueryParams()["filename"]);
        if (empty($filename)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                self::ERROR_EMPTY_FILENAME
            );
        }

        $pipeline = strval($request->getQueryParams()["pipeline"]);
        $version = strval($request->getQueryParams()["version"]);

        $path_parts = pathinfo($filename);
        $ext = $path_parts['extension'];
        switch ($ext) {
            case 'zip':
                $mime = "application/x-zip";
                break;
            case 'tar.gz':
                $mime = "application/x-gtar";
                break;
            case 'tar':
                $mime = 'application/x-tar';
                break;
            default:
                $mime = 'application/octet-stream';
                break;
            }

        $data_path = \NDB_Config::singleton()->getSetting('dataDirBasepath');
        $fullpath = $data_path . "/" . $request->getQueryParams()["filename"];

        if (!file_exists($fullpath)) {
            $package_path = \NDB_Config::singleton()->getSetting('prePackagedDownloadPath');
            $fullpath = $package_path . "/" . $pipeline .  ($version ? "/" . $version : "") . "/" . $request->getQueryParams()["filename"];
        }

        if (!file_exists($fullpath)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                self::ERROR_FILE_NOT_FOUND
            );
        }

        return (new \LORIS\Http\Response\JSON\OK())
            ->withHeader(
                'Content-Disposition',
                'attachment;filename=' . $filename
            )
            ->withHeader('Content-Type', $mime)
            ->withBody(new \LORIS\Http\FileStream($fullpath));
    }
}