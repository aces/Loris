<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\publication;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
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
                    'publication_view',
                    'publication_propose',
                    'publication_approve'
                ]
            );
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Reports");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("publication", "Publications");
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
        case 'study-progression':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();

            $query   = "SELECT
                    pr.ProjectID,
                    COUNT(*) AS count,
                    CONCAT('$baseURL/publication/?project=', pr.Name) AS url,
                    pr.Name AS ProjectName
                FROM publication p
                JOIN Project pr ON (p.project=pr.ProjectID)";
            $params = [];

            if (!($user->hasPermission('publication_view')
                || $user->hasPermission('publication_propose')
                || $user->hasPermission('publication_approve'))
            ) {
                $query           .= "
                JOIN publication_users_edit_perm_rel puepr
                    ON (puepr.PublicationID=p.PublicationID)
                WHERE puepr.UserID=:userID";
                $params['userID'] = $user->getId();
            }

            $query .= "
                GROUP BY pr.ProjectID, pr.Name";

            $data = $DB->pselectWithIndexKey(
                $query,
                $params,
                'ProjectID'
            );

            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "publication",
                        "Publication",
                        "Publications"
                    ),
                    $data,
                    "",
                    'rgb(209, 195, 255)',
                )
            ];
        }

        return [];
    }
}
