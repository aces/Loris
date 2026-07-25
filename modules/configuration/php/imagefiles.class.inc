<?php declare(strict_types=1);

namespace LORIS\configuration;

/**
 * Discovers public images and validates configuration image uploads.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ImageFiles
{
    private const UPLOAD_TYPES = [
        'image/gif'  => ['gif'],
        'image/jpeg' => ['jpeg', 'jpg'],
        'image/png'  => ['png'],
        'image/webp' => ['webp'],
    ];

    private string $webRoot;
    private string $imagesRoot;
    private string $uploadDirectory;

    /**
     * Create an image file service.
     *
     * @param string $lorisRoot       LORIS installation directory
     * @param string $uploadDirectory Configuration image upload directory
     */
    public function __construct(string $lorisRoot, string $uploadDirectory)
    {
        $webRoot         = realpath(\Utility::pathJoin($lorisRoot, 'htdocs'));
        $imagesRoot      = realpath(
            \Utility::pathJoin($lorisRoot, 'htdocs', 'images')
        );
        $uploadDirectory = realpath($uploadDirectory);

        if ($webRoot === false || $imagesRoot === false) {
            throw new \ConfigurationException(
                'The public images directory is not available'
            );
        }
        if ($uploadDirectory === false || !is_dir($uploadDirectory)) {
            throw new \ConfigurationException(
                'The configuration upload directory is not available'
            );
        }
        if (!str_starts_with($uploadDirectory . '/', $imagesRoot . '/')) {
            throw new \ConfigurationException(
                'The configuration upload directory must be under htdocs/images'
            );
        }

        $this->webRoot         = $webRoot;
        $this->imagesRoot      = $imagesRoot;
        $this->uploadDirectory = $uploadDirectory;
    }

    /**
     * Return public paths for image files beneath htdocs/images.
     *
     * @return string[]
     */
    public function getOptions(): array
    {
        $options = [];
        $files   = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator(
                $this->imagesRoot,
                \FilesystemIterator::SKIP_DOTS
            )
        );

        foreach ($files as $file) {
            if (!$file instanceof \SplFileInfo
                || !$file->isFile()
                || !$this->_isDisplayableImage($file->getPathname())
            ) {
                continue;
            }
            $options[] = $this->_getPublicPath($file->getPathname());
        }

        sort($options);
        return $options;
    }

    /**
     * Return the upload directory for FilesUploadHandler.
     *
     * @return \SplFileInfo
     */
    public function getUploadDirectory(): \SplFileInfo
    {
        return new \SplFileInfo($this->uploadDirectory);
    }

    /**
     * Check that an upload contains a supported image matching its extension.
     *
     * @param string $filename Client-provided filename
     * @param string $filePath Temporary uploaded file path
     *
     * @return bool
     */
    public function validateUpload(string $filename, string $filePath): bool
    {
        if (!$this->_validFilename($filename) || !is_file($filePath)) {
            return false;
        }

        $mime = mime_content_type($filePath);
        if ($mime === false) {
            return false;
        }

        $extensions = self::UPLOAD_TYPES[$mime] ?? [];
        $extension  = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return in_array($extension, $extensions, true);
    }

    /**
     * Return the public path for a file in the upload directory.
     *
     * @param string $filename Uploaded filename
     *
     * @return string
     */
    public function getUploadedPath(string $filename): string
    {
        if (!$this->_validFilename($filename)) {
            throw new \InvalidArgumentException('Invalid upload filename');
        }
        return $this->_getPublicPath(
            \Utility::pathJoin($this->uploadDirectory, $filename)
        );
    }

    /**
     * Check whether a client filename is safe and URL-friendly.
     *
     * @param string $filename Client-provided filename
     *
     * @return bool
     */
    private function _validFilename(string $filename): bool
    {
        return !str_contains($filename, '..')
            && preg_match('/^[[:alnum:]][[:alnum:]_.-]*$/', $filename) === 1;
    }

    /**
     * Check whether a file can be displayed as an image option.
     *
     * @param string $path Image path
     *
     * @return bool
     */
    private function _isDisplayableImage(string $path): bool
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if ($extension === 'svg') {
            $start = file_get_contents($path, false, null, 0, 8192);
            return $start !== false
                && preg_match('/<svg(?:\\s|>)/i', $start) === 1;
        }

        $mime = mime_content_type($path);
        if ($mime === false) {
            return false;
        }
        return in_array(
            $extension,
            self::UPLOAD_TYPES[$mime] ?? [],
            true
        );
    }

    /**
     * Convert a file beneath htdocs to a URL path.
     *
     * @param string $path File path
     *
     * @return string
     */
    private function _getPublicPath(string $path): string
    {
        $relative = ltrim(substr($path, strlen($this->webRoot)), '/');
        $parts    = array_map('rawurlencode', explode('/', $relative));
        return '/' . implode('/', $parts);
    }
}
