<?php declare(strict_types=1);
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrohysiology
 * @author     Cécile Madjar <cecile.madjar2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\electrophysiology_browser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electophysiology
 * @author     Cécile Madjar <cecile.madjar2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
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
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'electrophysiology_browser_view_allsites',
                    'electrophysiology_browser_view_site'
                ]
            );
    }

    /**
    * Overrides the default handler in order to delegate custom endpoints.
    *
    * @param ServerRequestInterface $request The incoming PSR7 request
    *
    * @return ResponseInterface The outgoing PSR15 response
    */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path        = trim($request->getURI()->getPath(), "/");
        $pathparts   = explode('/', $path);
        $handlername = array_shift($pathparts);

        switch ($handlername) {
        case 'pipelinearchive':
            $handler = new \PipelineArchive($this->loris);
            $request = $request->withAttribute('pathparts', $pathparts);
            return $handler->process($request, $handler);
        default:
            return parent::handle($request);
        }
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Electrophysiology";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Electrophysiology Browser";
    }
}