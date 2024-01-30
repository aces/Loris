<?php
/**
 * This file contains the Role Endpoint.
 *
 * PHP Version 8
 *
 * @category Module
 * @package  Roles_Manager
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\roles_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Main class for managing Role Instances
 *
 * Handles requests for retrieving and saving Role Instances.
 * Allows users to add entries in the role table.
 *
 * PHP Version 8
 *
 * @category Module
 * @package  Roles_Manager
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RoleEndpoint extends \NDB_Page implements RequestHandlerInterface
{

    /**
     * The database connection
     *
     * @var \Database
     */
    protected $db;

    /**
     * The user accessing the endpoint
     *
     * @var \User
     */
    protected $user;

    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * This function passes the request to the handler. This is necessary since
     * the Endpoint bypass the Module class.
     *
     * XXX: This function should be extracted to a parent class.
     *
     * @param ServerRequestInterface  $request The PSR7 request.
     * @param RequestHandlerInterface $handler The request handler.
     *
     * @return ResponseInterface The outgoing PSR7 response.
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

    /**
     * This function can be overridden in a module's page to load the necessary
     * resources to check the permissions of a user.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {
    }

    /**
     * This acts as an Ajax enpoint that handles all action requests from the
     * Battery Manager Module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->db   = $this->loris->getDatabaseConnection();
        $this->user = $request->getAttribute('user');
        $method     = $request->getMethod();

        switch ($method) {
        case 'GET':
            return $this->_getInstances();
        case 'POST':
            return $this->_postInstance($request);
        case 'PUT':
            return $this->_putInstance($request);
        }
    }

    /**
     * Gets the data source for roles.
     *
     * @return \LORIS\Data\Provisioner
     */
    private function _getDataProvisioner() : \LORIS\Data\Provisioner
    {
        // $provisioner = new RoleProvisioner($this->loris);

        // if ($this->user->hasPermission('access_all_profiles') == false) {
        //     $provisioner = $provisioner->filter(
        //         new \LORIS\Data\Filters\UserSiteMatch()
        //     );
        // }

        // return $provisioner;

        return new RoleProvisioner($this->loris);
    }

    /**
     * Puts a role in the database.
     *
     * @param ServerRequestInterface $request Role to be saved
     *
     * @return ResponseInterface response
     */
    private function _putInstance(ServerRequestInterface $request)
    {
        $roleArray = json_decode($request->getBody()->getContents(), true);
        $role      = new Role($this->loris, $roleArray);
        return $this->_saveInstance($role);
    }

    /**
     * Posts a new role in the database.
     * Generates a new Code for this entry.
     *
     * @param ServerRequestInterface $request Role to be posted
     *
     * @return ResponseInterface response
     */
    private function _postInstance(ServerRequestInterface $request)
    {
        $roleArray = json_decode($request->getBody()->getContents(), true);
        $role      = new Role($this->loris, $roleArray);
        // generate new code
        $role->row['Code'] = Role::generateCodeFromName($roleArray['Name']);
        return $this->_saveInstance($role);
    }

    /**
     * Generic save function for Role Instances.
     *
     * @param Role $role The Role Instance to be saved.
     *
     * @return ResponseInterface response
     */
    private function _saveInstance(Role $role)
    {
        if (!$this->user->hasPermission('roles_edit')) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                'Role Edit Permission Denied'
            );
        }

        // validate instance
        $errors = $this->_validateInstance($role);
        if (!empty($errors)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                implode(' ', $errors)
            );
        }

        // check if instance is duplicate
        if ($this->_isDuplicate($role)) {
            return new \LORIS\Http\Response\JSON\Conflict(
                'This Role already exists in the database'
            );
        }

        // get the current role permissions
        $currentRolePermissions = array_map(
            fn($v) => $v['permissionCode'],
            array_filter(
                $role->getPermissions(),
                fn($v) => $v['hasPermission']
            )
        );

        // new permissions from front-end
        $newRolePermissions = array_map(
            fn($v) => $v['permissionCode'],
            array_filter(
                $role->row['permissions'],
                fn($v) => $v['hasPermission']
            )
        );

        // permission codes to grant and revoke
        $permissionsToGrant  = array_diff(
            $newRolePermissions,
            $currentRolePermissions
        );
        $permissionsToRevoke = array_diff(
            $currentRolePermissions,
            $newRolePermissions
        );

        error_log("=========================================== GRANT/REVOKE");
        error_log('GRANT');
        error_log(print_r($permissionsToGrant, true));
        error_log('REVOKE');
        error_log(print_r($permissionsToRevoke, true));

        try {
            // update role
            $this->db->insertOnDuplicateUpdate('roles', $role->toSQL());

            // is it a new role?
            $isNewRole = !$role->hasId();

            // refresh role data (a new role object does not have ID)
            if ($isNewRole) {
                $lastId = $this->db->getLastInsertId();
                // update the RoleID in the current object
                $role->row['RoleID'] = $lastId;
            }

            // update associated permissions
            $role->updateRolePermissions();

            // update users permissions
            $role->updateUserPermissions(
                $permissionsToGrant,
                $permissionsToRevoke
            );

            return new \LORIS\Http\Response\JSON\OK();
        } catch (\DatabaseException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                'Could not add entry'
            );
        }
    }

    /**
     * Checks if a role with the same code already exists.
     *
     * @param Role $role Role to be checked.
     *
     * @return bool
     */
    private function _isDuplicate(Role $role) : bool
    {
        // Build SQL query based on values entered by user
        $query = "SELECT
                    RoleID,
                    Code,
                    Name,
                    Description
                FROM roles";
        // Select duplicate entry from Roles
        $entries = $this->db->pselect($query, []);

        $roleArray = $role->toSQL();
        foreach ($entries as $entry) {
            if ($roleArray['RoleID'] != $entry['RoleID']
                && $roleArray['Code'] == $entry['Code']
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Converts the results of this menu filter to a JSON format.
     *
     * @return ResponseInterface The outgoing PSR7 with a string of json
     *                           encoded roles as the body.
     */
    private function _getInstances() : ResponseInterface
    {
        $instances = (new \LORIS\Data\Table())
            ->withDataFrom($this->_getDataProvisioner())
            ->toArray($this->user);
        return new \LORIS\Http\Response\JSON\OK($instances);
    }

    /**
     * Validates the Role Instance and collects in errors in an array.
     *
     * @param Role $role The Role instance to be validated
     *
     * @return array $errors An array string errors.
     */
    private function _validateInstance(Role $role) : array
    {
        $errors = [];
        if (!isset($role->row['Name'])) {
            $errors[] = 'Role Name is a required field.';
        }
        if (!isset($role->row['Description'])) {
            $errors[] = 'Role Description is a required field.';
        }
        return $errors;
    }
}

