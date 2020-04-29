<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Core
 * @package    Main
 * @subpackage Login
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\login;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Core
 * @package    Main
 * @subpackage Login
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{

    /**
     * The login module must be accessible publicly, so that non-logged in
     * users can login.
     *
     * @return true
     */
    public function isPublicModule()
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Login";
    }

    /**
     * Check whether a user is logined or not, if yes, redirect to the base URL
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute("user");
        if (!($user instanceof \LORIS\AnonymousUser)) {
            return (new \LORIS\Http\Response())
                ->withStatus(307)
                ->withHeader(
                    'Location',
                    \NDB_Factory::singleton()->settings()->getBaseURL()
                );
        }
        return parent::handle($request);
    }
}
