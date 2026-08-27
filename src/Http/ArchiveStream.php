<?php declare(strict_types=1);

/**
 * This file implements an ArchiveStream, which creates a temporary tar archive
 * from a directory and provides it as a PSR7 StreamInterface.
 *
 * @category PSR7
 * @package  Http
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 */
namespace LORIS\Http;

/**
 * An ArchiveStream creates a temporary tar archive from a directory
 * and provides it as a PSR7 StreamInterface. The temporary archive file
 * is deleted when the stream is closed.
 *
 * @category PSR7
 * @package  Http
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ArchiveStream extends \Laminas\Diactoros\Stream implements \Psr\Http\Message\StreamInterface
{
    /**
     * The path to the temporary archive file
     *
     * @var string
     */
    private string $archivePath;

    /**
     * Constructor
     *
     * Creates a tar archive from the given directory and opens it as a stream.
     * The archive file is deleted when the stream is closed.
     *
     * @param string $directoryPath The path to the directory to archive
     *
     * @throws \Exception if archive creation fails
     */
    public function __construct(string $directoryPath)
    {
        $this->archivePath = sys_get_temp_dir() . '/' . uniqid() . '.tar';

        $phar = new \PharData($this->archivePath);
        $phar->buildFromDirectory($directoryPath);

        parent::__construct($this->archivePath, 'r');
    }

    /**
     * {@inheritdoc}
     */
    public function close(): void
    {
        parent::close();

        if (file_exists($this->archivePath)) {
            unlink($this->archivePath);
        }
    }
}
