<?php declare(strict_types=1);
/**
 * File contains the Users Accounts class.
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
namespace LORIS\user_accounts;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The modules class handles requests to module_manager/useraccounts/$username
 * to retrieve or update information about a specific module.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class UserAccounts extends \NDB_Page
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is to be verified
     *
     * @return bool whether access is granted
     *
     * @note Can not have public access modifier explicitly specified to
     *       avoid conflicting with PEAR standard enforced on parent class
     *       in php/libraries
     */
    function _hasAccess(\User $user) : bool
    {
        return parent::_hasAccess($user) &&
             $user->hasPermission('user_accounts');
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
        if (strpos($request->getUri()->getPath(), "/edit_user/") === 0) {
            $page = $this->loadPage("edit_user");
                return $page->process($request, $page);
        }
        return parent::handle($request);
    }
}
