<?php
/**
 * This file contains the User Role Endpoint.
 *
 * PHP Version 8
 *
 * @category Module
 * @package  user_accounts
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\user_accounts;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This file contains the User Role Endpoint.
 *
 * PHP Version 8
 *
 * @category Module
 * @package  user_accounts
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UserRoleEndpoint extends \NDB_Page implements RequestHandlerInterface
{

    /**
     * The database connection
     *
     * @var \Database
     */
    protected $db;

    /**
     * The editor accessing the endpoint.
     *
     * @var \User
     */
    protected $user;

    /**
     * The user targeted by the viewing/modifications.
     *
     * @var \User
     */
    protected $target;

    /**
     * Returns true if editor has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(['roles_assign']);
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
        $this->db     = $this->loris->getDatabaseConnection();
        $this->target = $request->getAttribute('targetUser');
        $this->user   = $request->getAttribute('user');
        $method       = $request->getMethod();

        switch ($method) {
        case 'POST':
            return $this->_postInstance($request);
        }
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
        // get user and target user
        $users = json_decode($request->getBody()->getContents(), true);
        $this->target = \User::factory($users['target']);

        // load provisionner based on target
        $instances = (new \LORIS\Data\Table())
            ->withDataFrom(new UserRoleProvisioner($this->loris, $this->target))
            ->toArray($this->user);
        return new \LORIS\Http\Response\JSON\OK($instances);
    }
}

