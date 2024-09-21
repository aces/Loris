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
            $user->hasAnyPermission(
                [
                    'document_repository_view',
                    'document_repository_delete',
                    'document_repository_upload_edit'
                ]
            );
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
    public function getWidgets(string $type, \User $user, array $options)
    {
        switch ($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();

            $last_login = $user->getLastLogin($DB);

            $docs         = iterator_to_array(
                $DB->pselect(
                    "SELECT File_name,
                        Date_uploaded,
                        CONCAT(uploaded_by, '/', File_name) AS Data_dir
                 FROM document_repository
                 ORDER BY Date_uploaded DESC LIMIT 4",
                    []
                )
            );
            $numberOfDocs = sizeof($docs);
            for ($i=0; $i < $numberOfDocs; $i++) {
                if (new \DateTime($docs[$i]['Date_uploaded']) > $last_login) {
                    $docs[$i]['new'] = true;
                } else {
                    $docs[$i]['new'] = false;
                }
            }

            return [
                new \LORIS\dashboard\Widget(
                    new \LORIS\dashboard\WidgetContent(
                        "Document Repository Notifications",
                        $this->renderTemplate(
                            "docnotifications.tpl",
                            [
                                'baseURL'       => $baseURL,
                                'notifications' => $docs
                            ],
                        ),
                        ""
                    ),
                    new \LORIS\dashboard\WidgetDisplayProps("small", 3)
                ),
            ];
        }
        return [];
    }

}
