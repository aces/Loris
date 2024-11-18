<?php declare(strict_types=1);

/**
 * Provides access to the LORIS Biobank Module.
 *
 * This file contains the `Biobank` class, which extends `NDB_Menu_Filter` to
 * enable access to the Biobank module within LORIS.
 *
 * @category   Page
 * @package    LORIS
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;

/**
 * Class Biobank
 *
 * Extends `NDB_Menu_Filter` to enable access to the LORIS Biobank Module.
 * It includes methods to check user access permissions, set up variables,
 * and include additional CSS and JavaScript dependencies.
 *
 * @category   Page
 * @package    LORIS
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Biobank extends \NDB_Menu_Filter
{
    /**
     * Determines whether the user has permission to view this page.
     *
     * @param \User $user The user to be checked.
     *
     * @return bool True if the user has access, false otherwise.
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('biobank_specimen_view')
                || $user->hasPermission('biobank_container_view')
                || $user->hasPermission('biobank_pool_view');
    }

    /**
     * Sets up the variables required for the construction of the page.
     *
     * @return void
     */
    function _setupVariables()
    {
        $this->skipTemplate = true;
        $this->AjaxModule   = true;
    }

    /**
     * Includes additional CSS files required by the Biobank module.
     *
     * @return array An array of CSS files to be included.
     */
    function getCSSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/biobank/css/biobank.css"]
        );
    }

    /**
     * Includes additional JavaScript files required by the Biobank module.
     *
     * @return array An array of JavaScript files to be included.
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/biobank/js/biobankIndex.js"]
        );
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\BreadcrumbTrail
     */
    function getBreadcrumbs() : \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail();
    }
}
