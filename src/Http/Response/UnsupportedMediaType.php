<?php declare(strict_types=1);
/**
 * File contains the PSR15 ResponseInterface implementation for
 * Unsupported Media Type
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

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specific for 415 Unsupported Media Type.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UnsupportedMediaType extends JsonResponse
{
    /**
     * Create a Json response specific to 415 Unsupported Media Type
     *
     * @param string $msg The error message
     */
    public function __construct(string $msg = 'Unsupported Media Type')
    {
        $body = array('error' => $msg);
        parent::__construct($body, 415);
    }
}
