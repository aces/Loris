<?php declare(strict_types=1);
/**
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
 * to use in LORIS specific for 202 Accepted.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Accepted extends JsonResponse
{
    /**
     * Create a Json response specific to 202 Accepted
     *
     * @param array|null $body The error message
     */
    public function __construct(?array $body)
    {
        parent::__construct($body, 202);
    }
}
