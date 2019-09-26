<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category LORIS_Module
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\genomic_browser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category LORIS_Module
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
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
        switch ($path) {
        case 'Profiles':
            $handler = new endpoints\Profiles();
            break;
        case 'CvnBrowser':
            $handler = new endpoints\CnvBrowser();
            break;
        case 'Methylation':
            $handler = new endpoints\Methylation();
            break;
        case 'FileManager':
            $handler = new endpoints\FileManager();
            break;
        case 'SnpBrowser':
            $handler = new endpoints\SnpBrowser();
            break;
        case 'GwasBrowser':
            $handler = new endpoints\GwasBrowser();
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
}
