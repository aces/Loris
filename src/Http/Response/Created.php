<?php declare(strict_types=1);
/**
 * File contains the PSR7 ResponseInterface implementation for
 * Created responses.
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
namespace LORIS\Http\Response;

use \LORIS\Http\Response\JsonResponse;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specifically for the 201 Created response.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Created extends JsonResponse
{
    /**
     * Create a Json response containing the 200 OK Response
     */
    public function __construct()
    {
        parent::__construct(new EmptyStream(), 201);
    }
}

