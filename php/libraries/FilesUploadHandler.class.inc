<?php declare(strict_types=1);

/**
 * Class to upload files in a safe way.
 *
 * This class uploads files being uploaded to LORIS. It should
 * serve as the ONLY way that files are uploaded so that all file uploading
 * functionality can occur on a well-tested foundation.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
namespace LORIS;

use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * Class to validate file uploads to LORIS.
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class FilesUploadHandler implements RequestHandlerInterface
{

    /**
     * The target upload directory.
     *
     * @var \SplFileInfo
     */
    protected $uploadDirectory;

    /**
     * A whitelist of all MIME types to accept.
     *
     * @var string[]
     */
    protected $permittedMIMETypes = array();

    /**
     * A UNIX permissions octet.
     *
     * @var int
     */
    protected $permissions = 0644;

    /**
     * Whether existing files should be overwritten.
     *
     * @var bool
     */
    protected $overwrite = false;

    /**
     * Create new instance of a File Uploader.
     *
     * @param \SplFileInfo $uploadDirectory The target upload directory
     */
    public function __construct(\SplFileInfo $uploadDirectory)
    {
        $this->uploadDirectory = $uploadDirectory;
        $this->overwrite       = false;

        if (! $this->uploadDirectory->isDir()) {
            throw new \LorisException(
                'Upload directory is not a directory'
            );
        }

        if (! $this->uploadDirectory->isWritable()) {
            throw new \LorisException(
                'Upload directory is not writable'
            );
        }
    }

    /**
     * Generates a new FilesUploadHandler with customized permissions
     *
     * @param int $permissions The new UNIX permissions octet
     *
     * @return FilesUploadHandler
     */
    public function withPermissions(int $permissions): FilesUploadHandler
    {
        $new = clone($this);
        $new->permissions = $permissions;
        return $new;
    }

    /**
     * Generates a new FilesUploadHandler with customized permitted MIME Types
     *
     * @param string ...$mimetypes A variadic amount of strings
     *
     * @return FilesUploadHandler
     */
    public function withPermittedMIMETypes(string ...$mimetypes): FilesUploadHandler
    {
        $new = clone($this);
        $new->permittedMIMETypes = $mimetypes;
        return $new;
    }

    /**
     * Generates a new FilesUploadHandler with customized overwrite value
     *
     * @param bool $overwrite Whether existing files should be overwritten.
     *
     * @return FilesUploadHandler
     */
    public function withOverwrite(bool $overwrite): FilesUploadHandler
    {
        $new            = clone($this);
        $new->overwrite = $overwrite;
        return $new;
    }

    /**
     * Given an HTTP request, upload all the files to the server in the
     * same uploadDirectory.
     *
     * All files uploaded will get the same permissions.
     *
     * If the overwrite property is set to true, existing files will be
     * overwritten.
     *
     * If the files need different permissions on need to go in different
     * directories, the file must be split in different request an passed to a
     * FileUploadHandler with the correct variables.
     *
     * @param ServerRequestInterface $request An HTTP Request that contains files.
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $files = $request->getUploadedFiles();

        foreach ($files as $file) {
            if ($file->getError() !== \UPLOAD_ERR_OK) {
                $message = (new \LORIS\UploadException($file->getError()))
                    ->getMessage();

                return (new \LORIS\Http\Response())
                    ->withStatus(500)
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode(
                                array('error' => $message)
                            )
                        )
                    );
            }

            /* basename() is used here to prevent path traversal characters
             * from being used.
             */
            $targetPath = $this->uploadDirectory->getPathname() . '/' . basename(
                $file->getClientFilename()
            );

            /* If file exists, set response code to 'Conflict' unless the
             * calling code wants to overwrite the file.
             */
            if (file_exists($targetPath) && $this->overwrite !== true) {
                return new \LORIS\Http\Response\Conflict(
                    'This file has already been uploaded.'
                );
            }

            // Validate that the MIME type of the file is allowed
            if (!empty($this->permittedMIMETypes)) {
                if (!in_array(
                    $file->getClientMediaType(),
                    $this->permittedMIMETypes,
                    true
                )
                ) {
                    return (new \LORIS\Http\Response())
                        ->withStatus(403)
                        ->withBody(
                            new \LORIS\Http\StringStream(
                                json_encode(
                                    array('error' => 'File type not allowed')
                                )
                            )
                        );
                }
            }

            // Move the file to $targetPath
            try {
                $file->moveTo($targetPath);
            } catch (\Exception $e) {
                error_log(
                    'Could not upload file: ' . $e->getMessage()
                );
                return (new \LORIS\Http\Response())
                    ->withStatus(500)
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode(
                                array('error' => 'Could not upload file')
                            )
                        )
                    );
            }
            chmod($targetPath, $this->permissions);
        }

        return (new \LORIS\Http\Response())
                    ->withStatus(201);
    }
}

