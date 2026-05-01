<?php declare(strict_types=1);

/**
 * This file implements a FileStream, a simple wrapper which converts
 * a file into a PSR7 StreamInterface compatible with other PSR7
 * interfaces.
 *
 * @category PSR7
 * @package  Http
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 */
namespace LORIS\Http;

/**
 * A FileStream provides a simple wrapper over a file to convert
 * it to a \Psr\Http\Message\StreamInterface.
 *
 * @category PSR7
 * @package  Http
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class FileStream extends \Laminas\Diactoros\Stream implements \Psr\Http\Message\StreamInterface
{
    /**
     * @var bool Whether the file be deleted when the stream is closed, used for
     *           temporary files.
     */
    private bool $deleteOnClose;

    /**
     * Constructor
     *
     * @param string $stream        The path to the file or a stream resource
     * @param string $mode          The mode to open the stream with
     * @param bool   $deleteOnClose If true, delete the file when the stream is closed
     */
    public function __construct(
        string $stream,
        string $mode = 'r',
        bool $deleteOnClose = false,
    ) {
        parent::__construct($stream, $mode);
        $this->deleteOnClose = $deleteOnClose;
    }

    /**
     * {@inheritdoc}
     */
    public function close(): void
    {
        if ($this->deleteOnClose
            && is_string($this->resource)
            && file_exists($this->resource)
        ) {
            unlink($this->resource);
        }
    }
}
