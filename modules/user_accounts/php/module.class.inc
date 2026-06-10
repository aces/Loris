<?php declare(strict_types=1);

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
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Admin");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("user_accounts", "User Accounts");
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
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $baseURL = $factory->settings()->getBaseURL();

        switch ($type) {
        case "usertasks":
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    new \LORIS\GUI\LocalizableString(
                        "user_accounts",
                        "Pending account approval",
                        "Pending account approvals",
                    ),
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
        case "admin-stats":
            $registrations = iterator_to_array(
                $DB->pselect(
                    "SELECT
                        EXTRACT(YEAR FROM account_request_date) AS RequestYear,
                        EXTRACT(MONTH FROM account_request_date) AS RequestMonth,
                        COUNT(ID) AS RequestCount
                    FROM users
                    WHERE Pending_approval = 'N'
                    AND account_request_date IS NOT NULL
                    GROUP BY RequestYear, RequestMonth
                    ORDER BY RequestYear, RequestMonth",
                    []
                )
            );

            $registrationsData = [
                'labels'   => array_map(
                    fn(array $row) : string => sprintf(
                        '%02d-%04d',
                        intval($row['RequestMonth']),
                        intval($row['RequestYear'])
                    ),
                    $registrations,
                ),
                'datasets' => [
                    [
                        'name' => 'User Registrations',
                        'data' => array_map(
                            fn(array $row) : int => intval($row['RequestCount']),
                            $registrations,
                        ),
                    ],
                ],
            ];

            $uniqueLogins = iterator_to_array(
                $DB->pselect(
                    "SELECT
                        EXTRACT(YEAR FROM Login_timestamp) AS LoginYear,
                        EXTRACT(MONTH FROM Login_timestamp) AS LoginMonth,
                        COUNT(DISTINCT ulh.userID) AS UniqueLogins
                    FROM user_login_history AS ulh
                    JOIN users AS u USING(userID)
                    WHERE Fax IS NULL
                    GROUP BY LoginYear, LoginMonth
                    ORDER BY LoginYear, LoginMonth",
                    []
                )
            );

            $uniqueLoginsData = [
                'labels'   => array_map(
                    fn(array $row) : string => sprintf(
                        '%02d-%04d',
                        intval($row['LoginMonth']),
                        intval($row['LoginYear'])
                    ),
                    $uniqueLogins,
                ),
                'datasets' => [
                    [
                        'name' => 'Unique Monthly Logins',
                        'data' => array_map(
                            fn(array $row) : int => intval($row['UniqueLogins']),
                            $uniqueLogins,
                        ),
                    ],
                ],
            ];

            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        'statistics',
                        'User Registration',
                        'User Registrations'
                    ),
                    $registrationsData,
                    '',
                    'rgb(214, 235, 255)',
                ),
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        'statistics',
                        'Unique Monthly Login',
                        'Unique Monthly Logins'
                    ),
                    $uniqueLoginsData,
                    '',
                    'rgb(223, 245, 221)',
                ),
            ];
        }
        return [];
    }
}
