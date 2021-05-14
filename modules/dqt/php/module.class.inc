<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Query
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Query
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) && $user->hasPermission('dataquery_view');
    }

    /**
     * Handles requests to this endpoint by delegating to known paths or
     * default to its superclass handle function.
     *
     * @param ServerRequestInterface $request The request to handle
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path      = trim($request->getURI()->getPath(), "/");
        $pathparts = explode('/', $path);

        // Extract the first element of pathparts then delegate to subhandlers if
        // it is a known path. Default to Module superclass behaviour.
        $first = array_shift($pathparts);
        switch ($first) {
        case 'categories':
            $handler = new Endpoints\Categories();
            break;
        case 'queries':
            $handler = new Endpoints\Queries();
            break;
        default:
            return parent::handle($request);
        }

        // Update the request with the shortened pathparts.
        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process($newrequest, $handler);
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Reports";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Data Query Tool (Beta)";
    }

    /**
     * {@inheritDoc}
     *
     * @return bool Whether an api schema is available fro this module.
     */
    public function hasAPISpecification(): bool
    {
        return true;
    }
}
