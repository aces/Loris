<?php declare(strict_types=1);

/**
 * The configuration module is used to manage the configuration of Loris.
 *
 * PHP version 8
 *
 * @category Behavioural
 * @package  Main
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\configuration;

/**
 * Candidate_Identifier_Types Class
 *
 * This class is used to configure candidate identifier types.
 *
 * @category Behavioural
 * @package  Main
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Candidate_Identifier_Types extends \NDB_Form
{
    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Loads the candidate identifier types page.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $factory    = \NDB_Factory::singleton();
        $controller = new \LORIS\IdentifierTypeController(
            $factory->database()
        );

        $this->tpl_data['identifierTypes']
            = $controller->getAllIdentifierTypes();

        $this->tpl_data['projects'] = \Utility::getProjectList();
    }

    /**
     * Include additional CSS files:
     *  1. configuration
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/configuration/css/configuration.css"]
        );
    }
}