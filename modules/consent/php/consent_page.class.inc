<?php
/**
 * Implements the eConsent form page
 *
 * PHP version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Consent
 * @author     Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\consent;

/**
 * Implements the eConsent form page
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Consent
 * @author     Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Consent_Page extends \NDB_Page
{

    public $skipTemplate = true;

    /**
     * Determine whether the user has permission to view this page
     * This module is public so all users have access
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user): bool
    {
        return true;
    }

    /**
     * Include additional CSS files:
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/consent/css/consent.css")
        );
    }

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = parent::getJSDependencies();

        return array_merge(
            $depends,
            array(
                $baseurl . "/consent/js/consentEntry.js"
            )
        );
    }
}

