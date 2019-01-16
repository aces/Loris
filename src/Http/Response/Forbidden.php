<?php declare(strict_types=1);
/**
* File contains the PSR15 ResponseInterface implementation for
* Forbidden responses.
*
* PHP Version 7
*
* @category PSR15
* @package  Http
* @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/
namespace LORIS\Http\Response;

use \LORIS\Http\Response\JsonResponse;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specific for 403 Forbidden.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Forbidden extends JsonResponse
{
    /**
     * Create a Json response specific to 403 Forbidden
     *
     * @param string $msg The error message
     */
    public function __construct(string $msg='forbidden')
    {
        $body = array('error' => $msg);
        parent::__construct($body, 403);
    }
}

