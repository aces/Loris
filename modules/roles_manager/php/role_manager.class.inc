<?php
namespace LORIS\roles_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Main class for roles manager module corresponding to /roles_manager/ URL
 * Admin section of the LorisMenu.
 *
 * Displays a list of roles and control panel to search them
 * Allows user to add roles in the roles table
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Roles_Manager
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Roles_Manager extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Returns true if user has access to this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'roles_view',
                'roles_edit',
            ]
        );
    }

    /**
     * This acts as an Ajax enpoint that handles all action requests from the
     * Roles Manager Module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $resp = parent::handle($request);
        switch ($resp->getStatusCode()) {
        case 200:
            break;
        default:
            return $resp;
        }
        $this->setup();
        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display()));
    }

    /**
     * Include additional JS files.
     *
     * @return array of javascript to be inserted
     */
    public function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/roles_manager/js/rolesManagerIndex.js",
            ]
        );
    }
}