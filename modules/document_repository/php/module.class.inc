<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Document_Repository
 * @package    Main
 * @subpackage Study
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\document_repository;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Document_Repository
 * @package    Main
 * @subpackage Study
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
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
            $user->hasPermission('document_repository_view');
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Tools";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Document Repository";
    }

    public function getWidgets(string $type, \User $user) {
        switch($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB = $factory->database();

            $last_login = $user->getLastLogin($DB);

            $docs= $DB->pselect(
                "SELECT File_name, Date_uploaded, Data_dir FROM document_repository
                 ORDER BY Date_uploaded DESC LIMIT 4",
                array()
            );
            for ($i=0; $i < sizeof($docs); $i++) {
                if ($docs[$i]['Date_uploaded'] > $last_login) {
                    $docs[$i]['new'] = true;
                } else {
                    $docs[$i]['new'] = false;
                }
            }

            return [
                new \LORIS\dashboard\Widget(
                    "Document Repository Notifications",
                    $this->renderTemplate(
                        "docnotifications.tpl",
                        [
                            'baseURL' => $baseURL,
                            'notifications' => $docs
                        ],
                    ),
                    "small",
                    3
                ),
            ];
        }
        return [];
    }

}
