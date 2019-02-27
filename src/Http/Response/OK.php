<?php declare(strict_types=1);
/**
 * File contains the PSR7 ResponseInterface implementation for OK responses.
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
 * to use in LORIS specific for 200 OK.
 *
 * @category PSR15
 * @package  Http
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class OK extends JsonResponse
{
    /**
     * Create a Json response specific to 200 OK.
     *
     * @param array $msg The response message.
     */
    public function __construct(array $msg)
    {
        parent::__construct($msg, 200);
    }
}

