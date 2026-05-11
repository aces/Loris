<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\mri_violations;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
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
                    'violated_scans_view_allsites',
                    'violated_scans_view_ownsite'
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
        return \LORIS\GUI\MenuCategory::singleton("Imaging");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("mri_violations", "MRI Violated Scans");
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
            $link    = $factory->settings()->getBaseURL() . '/' . $this->getName()
                       . '/?resolutionStatus=unresolved';

            if (!class_exists('Provisioner')) {
                self::registerAutoloader();
            }
            $provisioner = new Provisioner($this->loris);

            if ($user->hasPermission('violated_scans_view_allsites')) {
                $siteLabel = dgettext("dashboard", 'Site: All');
            } else {
                $siteLabel   = dgettext("dashboard", 'Site: All User Sites');
                $provisioner = $provisioner->filter(new UserCenterMatchOrNull())
                    ->filter(new UserProjectMatchOrNull());
            }

            $violations = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($user);
            $number     = 0;
            foreach ($violations as $violation) {
                if ($violation['Resolution_status'] == 'unresolved') {
                    $number += 1;
                }
            }

            $label = dngettext(
                "mri_violations",
                "Violated scan",
                "Violated scans",
                $number
            );

            $widget = new \LORIS\dashboard\TaskWidget(
                $label,
                $number,
                $link,
                'mri_violations',
                $siteLabel
            );

            return [ $widget ];
        }

        return [];
    }
}
