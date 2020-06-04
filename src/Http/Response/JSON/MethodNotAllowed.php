<?php declare(strict_types=1);
/**
 * File contains the PSR15 ResponseInterface implementation for
 * Method Not Allowed responses.
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
namespace LORIS\Http\Response\JSON;

use \LORIS\Http\Response\JsonResponse;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface
 * to use in LORIS specific for 405 Method Not Allowed.
 *
 * @category PSR15
 * @package  Http
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class MethodNotAllowed extends JsonResponse
{
    /**
     * The server MUST generate an Allow header field in a 405 response
     * containing a list of the target resource's currently supported methods.
     *
     * @param array  $allowedmethods The list of supported methods
     * @param string $msg            The error message
     *
     * @see RFC 7231, section 6.5.5: 405 Method Not Allowed
     */
    public function __construct(
        array $allowedmethods,
        string $msg = 'method not allowed'
    ) {
        $body    = array('error' => $msg);
        $headers = array('Allow' => $allowedmethods);
        parent::__construct($body, 405, $headers);
    }
}
