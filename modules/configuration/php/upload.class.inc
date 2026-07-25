<?php declare(strict_types=1);

namespace LORIS\configuration;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Uploads images used by configuration settings.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Upload extends \LORIS\Http\Endpoint
{
    /**
     * Restrict configuration uploads to configuration administrators.
     *
     * @param \User $user The user accessing the endpoint
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user): bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Validate and store a configuration image.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if ($request->getMethod() !== 'POST') {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
        }

        $file = $request->getUploadedFiles()['file'] ?? null;
        if ($file === null || is_array($file)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Select one image to upload'
            );
        }
        if ($file->getError() !== UPLOAD_ERR_OK) {
            $message = (new \UploadException($file->getError()))->getMessage();
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "Upload error: $message"
            );
        }

        $filename = $file->getClientFilename();
        $tempPath = $file->getStream()->getMetadata('uri');
        if (!is_string($filename) || !is_string($tempPath)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The uploaded image is invalid'
            );
        }

        $config = $this->loris->getConfiguration();
        try {
            $lorisRoot       = $config->getSetting('base');
            $uploadDirectory = $config->getSetting('config_upload_path');
            if (!is_string($lorisRoot) || !is_string($uploadDirectory)) {
                throw new \ConfigurationException(
                    'The configuration image paths are invalid'
                );
            }
            $images = new ImageFiles($lorisRoot, $uploadDirectory);
        } catch (\ConfigurationException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        if (!$images->validateUpload($filename, $tempPath)) {
            return new \LORIS\Http\Response\JSON\UnsupportedMediaType(
                'Upload a PNG, JPEG, GIF, or WebP image with a safe filename'
            );
        }

        try {
            $uploader = new \LORIS\FilesUploadHandler(
                $images->getUploadDirectory()
            );
        } catch (\ConfigurationException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        $response = $uploader->handle(
            $request->withUploadedFiles(['file' => $file])
        );
        if ($response->getStatusCode() !== 201) {
            return $response;
        }

        return new \LORIS\Http\Response\JSON\Created(
            [
                'message' => 'Image uploaded successfully',
                'path'    => $images->getUploadedPath($filename),
            ]
        );
    }
}
