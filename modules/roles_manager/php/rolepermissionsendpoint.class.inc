<?php
/**
 * This file contains the endpoint for Role field options.
 *
 * PHP Version 8
 *
 * @package Roles_Manager
 * @author  Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://www.github.com/aces/Loris/
 */
namespace LORIS\roles_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Main class for roles manager module corresponding to /role_manager/ URL
 * Admin section of the LorisMenu.
 *
 * Displays a list of roles and control panel to search them
 * Allows user to add entries in the role list
 *
 * PHP Version 8
 *
 * @package Roles_Manager
 * @author  Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://www.github.com/aces/Loris/
 */
class RolePermissionsEndpoint extends \NDB_Page
{
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
        $method = $request->getMethod();

        switch ($method) {
        case 'GET':
            return new \LORIS\Http\Response\JSON\OK(
                RolePermission::getAllPermissions($this->loris)
            );
        }

        return new \LORIS\Http\Response\JSON\BadRequest('Unspecified Request');
    }
}

