<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This sets specific bahaviours or the redcap module and provides
 * the initial request routing.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    /**
     * This needs to be true since redcap wont authenticate.
     *
     * @return bool True
     */
    public function isPublicModule() : bool
    {
        return true;
    }

    /**
     * Return the long name of this module.
     *
     * @return string
     */
    public function getLongName() : string
    {
        return "REDCap";
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory The menu category for this module
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Tools");
    }

    /**
     * Perform routing for this module's endpoints.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        //
        $path = trim($request->getURI()->getPath(), "/");
        switch ($path) {
        case 'notifications':
            $handler = new Endpoints\Notifications(
                $request->getAttribute('loris'),
            );
            break;
        // case 'dev_test':
        //     $body = (new Notifications\RedcapNotificationHandler(
        //         $request->getAttribute('loris')
        //     ))->test();
        //     return new \LORIS\Http\Response(new \LORIS\Http\StringStream($body));
        default:
            return parent::handle($request);
        }

        return $handler->process($request, $handler);
    }
}
