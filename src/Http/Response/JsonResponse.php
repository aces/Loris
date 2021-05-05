<?php declare(strict_types=1);
/**
 * File contains the PSR15 ResponseInterface implementation for
 * Json response
 *
 * PHP Version 7
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 * @see https://www.php-fig.org/psr/psr-15/
 */
namespace LORIS\Http\Response;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specific for Json repsonse.
 *
 * It is intended to reduce our coupling to any particular PSR15 implementation.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class JsonResponse extends \Laminas\Diactoros\Response\JsonResponse implements \Psr\Http\Message\ResponseInterface
{
    /**
     * Overrides the constructor to change the default JSON encoding options.
     *
     * @param mixed $data Data to convert to JSON.
     * @param int $status Integer status code for the response; 200 by default.
     * @param array $headers Array of headers to use at initialization.
     * @param int $encodingOptions JSON encoding options to use.
     * @throws Exception\InvalidArgumentException if unable to encode the $data to JSON.
     */
    public function __construct(
        $data,
        int $status = 200,
        array $headers = [],
        int $encodingOptions = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    ) {
        parent::__construct(
            $data,
            $status,
            $headers = [],
            $encodingOptions
        );
    }
}
