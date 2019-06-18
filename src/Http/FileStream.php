<?php
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
class FileStream extends \Zend\Diactoros\Stream implements \Psr\Http\Message\StreamInterface
{
}
