<?php declare(strict_types=1);
/**
 * File contains the PSR7 ResponseInterface implementation for
 * OK responses.
 *
 * PHP Version 7
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 * @see https://www.php-fig.org/psr/psr-15/
 */
namespace LORIS\Http\Response\JSON;

use \LORIS\Http\Response\JsonResponse;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specifically for the 200 OK Response.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class OK extends JsonResponse
{
    /**
     * Create a Json response containing the 200 OK Response
     *
     * @param array $body Data to convert to JSON.
     * @param array $headers Array of headers to use at initialization.
     *
     * @return void
     */
    public function __construct(
        array $body = [],
        array $headers = []
    ) {
        parent::__construct($body, 200, $headers);
    }
}
