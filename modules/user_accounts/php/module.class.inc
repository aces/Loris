<?php
namespace LORIS\user_accounts;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
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
        return parent::hasAccess($user) && $user->hasAnyPermission(
            ['user_accounts', 'user_accounts_multisite']
        );
    }

     /**
      * The edit_user page overrides the default handler in order to delegate
      * edit_user/$identifier to the edit_user page.
      *
      * @param ServerRequestInterface $request The incoming PSR7 request
      *
      * @return ResponseInterface The outgoing PSR15 response
      */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if (strpos($request->getUri()->getPath(), "/edit_user/") === 0) {
            $loris = $request->getAttribute("loris");
            $page  = $this->loadPage($loris, "edit_user");
            return $page->process($request, $page);
        }
        return parent::handle($request);
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Admin";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "User Accounts";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        switch ($type) {
        case "usertasks":
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $baseURL = $factory->settings()->getBaseURL();
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "Pending account approval",
                    $DB,
                    "SELECT COUNT(DISTINCT users.UserID) FROM users
                        LEFT JOIN user_psc_rel as upr ON (upr.UserID=users.ID)
                        LEFT JOIN user_project_rel upr2 ON (upr2.UserID=users.ID)
                    WHERE users.Pending_approval='Y'",
                    'user_accounts_multisite',
                    'upr.CenterID',
                    'upr2.ProjectID',
                    $baseURL . "/user_accounts/?pendingApproval=Y",
                    "pending-accounts"
                )
            ];
        }
        return [];
    }
}
