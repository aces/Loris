<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Loris
 * @package    DQT
 * @subpackage Query
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @author     Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\dataquery;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Query
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @author     Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * The default handler for a module routes to a page of the first component of
     * the URL's name, or the same name as the module if serving the root of the
     * module.
     *
     * Modules extend PrefixRouter, so that the parent handler knows that the
     * css, static, and js routes should be routed through the file system to
     * retrieve the files before trying to load any specific pages.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path = trim($request->getURI()->getPath(), '/');
        // When GET request we strip the QueryParams.
        if ($path && strpos($path, '&') !== false) {
            $path = substr($path, 0, strpos($path, '&'));
        }
        switch ($path) {
        case 'GetDocument':
            \Module::factory('api');
            $handler = new endpoints\Documents();
            break;
        default:
            return parent::handle($request);
        }
        $user = $request->getAttribute('user');
        if (!$handler->_hasAccess($user)) {
            return new \LORIS\Http\Response\Forbidden();
        }
        return $handler->process($request, $handler);
    }

    /**
     * @inheritDoc
     */
    function getLongName(): string
    {
        return 'Data Query Tool';
    }
}
