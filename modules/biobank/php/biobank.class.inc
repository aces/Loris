<?php declare(strict_types=1);
/**
 * This class features the code that enables access to the LORIS Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Page
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This class features the code that enables access to the LORIS Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Page
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
class Biobank extends \NDB_Menu_Filter
{
    /**
     * Determine whether the user has permission to view this page.
     *
     * @param User $user to be checked.
     *
     * @return bool whether the user has access.
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('biobank_access');
    }

    /**
     * Set up the variables required by for construction of page
     *
     * @return void
     */
    function _setupVariables()
    {
        $this->skipTemplate = true;
        $this->AjaxModule   = true;
    }

    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
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
     * Include additional JS files
     *
     * @return array of javascript to be inserted
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
}

