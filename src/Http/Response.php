<?php
/**
* File contains the PSR15 ResponseInterface implementation that
* can be constructed with the "new" keyword.
*
* PHP Version 7
*
* @category PSR15
* @package  Http
* @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*
* @see https://www.php-fig.org/psr/psr-7/
* @see https://www.php-fig.org/psr/psr-15/
*/
namespace LORIS\Http;

/**
 * A LORIS Http Response is an implementation of the PSR15 ResponseInterface to use
 * in LORIS.
 *
 * It is intended to reduce our coupling to any particular PSR15 implementation.
 */
class Response 
    extends \Zend\Diactoros\Response 
    implements \Psr\Http\Message\ResponseInterface
{
}
