<?php declare(strict_types=1);
/**
 * File contains the PSR15 ResponseInterface implementation for
 * See Other responses.
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

use \LORIS\Http\Response\JsonResponse;
use \Psr\Http\Message\UriInterface;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specific for 303 See Other.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SeeOther extends JsonResponse
{
    /**
     * Create a Json response specific to 303 See Other.
     *
     * @param UriInterface $location The endpoint etag
     */
    public function __construct(UriInterface $location)
    {
        $headers = array('Location' => (string) $location);
        parent::__construct(null, 303, $headers);
    }
}
