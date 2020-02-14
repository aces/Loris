<?php declare(strict_types=1);
/**
 * File contains the Modules class.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\module_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The modules class handles requests to module_manager/modules/$modulename
 * to retrieve or update information about a specific module.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Modules extends \NDB_Page
{
    /**
     * Edit access is required because the modules endpoint only handles
     * PATCH requests.
     *
     * @param \User $user The user whose access is to be verified
     *
     * @return bool
     *
     * @note Can not have public access modifier explicitly specified to
     *       avoid conflicting with PEAR standard enforced on parent class
     *       in php/libraries
     */
    function _hasAccess(\User $user) : bool
    {
        return parent::_hasAccess($user) &&
             $user->hasPermission('module_manager_edit');
    }

    /**
     * The modules class overrides the default behaviour to handle PATCH
     * requests for module_manager/modules/$modulename.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute("user");
        if ($user === null && !($user instanceof \User)) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "No valid user"
            );
        }
        if (!($this->_hasAccess($user))) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        switch ($request->getMethod()) {
        case 'PATCH':
            return $this->_handlePatch($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                array('PATCH')
            );
        }
    }

    /**
     * Helper to specifically handle PATCH HTTP methods to the endpoint.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePATCH(
        ServerRequestInterface $request
    ) : ResponseInterface {
        $path = $request->getURI()->getPath();

        $matches  = [];
        $urlmatch = preg_match("#/modules/(.*)$#", $path, $matches);
        if ($urlmatch === false) {
            // Something went wrong evaluating the regex
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } else if ($urlmatch === 0) {
            // Pattern did not match.
            return new \LORIS\Http\Response\JSON\BadRequest();
        }

        $modulename = $matches[1];
        if (strpos($modulename, "/") !== false) {
            // Request was trying to patch a sub-resource of module,
            // which isn't supported.
            return new \LORIS\Http\Response\JSON\BadRequest();
        }

        // Active status is the only thing that can be patched.
        $vals = json_decode($request->getBody()->__toString(), true);
        if (!isset($vals['Active'])) {
            return new \LORIS\Http\Response\JSON\BadRequest();
        }

        \NDB_Factory::singleton()->database()->update(
            'modules',
            ['Active' => $vals['Active']],
            ['Name' => $modulename]
        );
        return (new \LORIS\Http\Response())->withStatus(205);
    }
}

