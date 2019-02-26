<?php declare(strict_types=1);
/**
* File contains the PSR18 HTTP Client implementation that
* can be constructed with the "new" keyword.
*
* PHP Version 7
*
* @category PSR18
* @package  Http
* @author   John Saigle <john.saigle@mcin.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*
* @see https://www.php-fig.org/psr/psr-18/
*/
namespace LORIS\Http;

use \Http\Adapter\Guzzle6\Client as GuzzleClient;

/**
 * A LORIS Http Response is an implementation of the PSR18 ResponseInterface to use
 * in LORIS.
 *
 * It is intended to reduce our coupling to any particular PSR18 implementation.
 */
class Client 
{

    /**
     * Private to prevent from creating this object on its own since it's just
     * a wrapper for Guzzle at this time.
     */
    private function __construct() {
    }

    /**
     * Guzzle's Client class is final and so cannot be extended directly. This
     * function acts as a wrapper for this function and serves as a workaround.
     */
    public static function createWithConfig(array $config): GuzzleClient {
        return \Http\Adapter\Guzzle6\Client::createWithConfig($config);
    }
}
