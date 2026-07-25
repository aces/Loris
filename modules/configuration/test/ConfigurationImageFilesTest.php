<?php declare(strict_types=1);

use LORIS\configuration\ImageFiles;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../php/imagefiles.class.inc';

/**
 * Tests image discovery and validation for configuration uploads.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ConfigurationImageFilesTest extends TestCase
{
    private string $root;
    private string $images;
    private string $uploads;

    /**
     * Create an isolated public image directory.
     *
     * @return void
     */
    protected function setUp(): void
    {
        $this->root    = sys_get_temp_dir() . '/loris-config-images-'
            . bin2hex(random_bytes(8));
        $this->images  = $this->root . '/htdocs/images';
        $this->uploads = $this->images . '/configuration';

        mkdir($this->uploads, 0770, true);
    }

    /**
     * Remove the isolated directory.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(
                $this->root,
                FilesystemIterator::SKIP_DOTS
            ),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($files as $file) {
            if ($file->isDir()) {
                rmdir($file->getPathname());
            } else {
                unlink($file->getPathname());
            }
        }
        rmdir($this->root);
    }

    /**
     * Only image files beneath htdocs/images are offered as logo options.
     *
     * @return void
     */
    public function testGetOptionsReturnsPublicImagePaths(): void
    {
        file_put_contents($this->images . '/logo.png', $this->_png());
        file_put_contents(
            $this->images . '/icon.svg',
            '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
        );
        file_put_contents($this->images . '/not-an-image.jpg', 'not an image');
        file_put_contents($this->images . '/notes.txt', 'notes');
        file_put_contents($this->uploads . '/study logo.png', $this->_png());

        $images = new ImageFiles($this->root, $this->uploads);

        $this->assertSame(
            [
                '/images/configuration/study%20logo.png',
                '/images/icon.svg',
                '/images/logo.png',
            ],
            $images->getOptions()
        );
    }

    /**
     * Uploaded files must contain a supported image matching their extension.
     *
     * @return void
     */
    public function testValidateUploadMatchesImageTypeAndExtension(): void
    {
        $png = $this->root . '/upload';
        file_put_contents($png, $this->_png());

        $images = new ImageFiles($this->root, $this->uploads);

        $this->assertTrue($images->validateUpload('study-logo.png', $png));
        $this->assertFalse($images->validateUpload('study-logo.jpg', $png));
        $this->assertFalse($images->validateUpload('../study-logo.png', $png));
        $this->assertFalse($images->validateUpload('study logo.png', $png));
        $this->assertFalse($images->validateUpload('study-logo.svg', $png));
    }

    /**
     * Uploaded files receive a public URL beneath htdocs.
     *
     * @return void
     */
    public function testGetUploadedPathReturnsPublicURL(): void
    {
        $images = new ImageFiles($this->root, $this->uploads);

        $this->assertSame(
            '/images/configuration/study-logo.png',
            $images->getUploadedPath('study-logo.png')
        );
    }

    /**
     * Uploads must stay beneath the public images directory.
     *
     * @return void
     */
    public function testRejectsUploadDirectoryOutsidePublicImages(): void
    {
        $outside = $this->root . '/uploads';
        mkdir($outside);

        $this->expectException(ConfigurationException::class);
        new ImageFiles($this->root, $outside);
    }

    /**
     * Return a valid one-pixel PNG.
     *
     * @return string
     */
    private function _png(): string
    {
        return (string) base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lE'
            . 'QVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
            true
        );
    }
}
