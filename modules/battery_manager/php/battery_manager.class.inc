<?php
/**
 * This file contains the NDB_Menu_Filter_battery_manager class
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\battery_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Main class for battery manager module corresponding to /battery_manager/ URL
 * Admin section of the LorisMenu.
 *
 * Displays a list of records in the test battery and control panel to search them
 * Allows user to add, activate, and deactivate entries in the test battery
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Battery_Manager extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Returns true if user has access to this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('battery_manager_view') ||
               $user->hasPermission('battery_manager_edit');
    }

    /**
     * This acts as an Ajax enpoint that handles all action requests from the
     * Battery Manager Module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $resp = parent::handle($request);
        switch ($resp->getStatusCode()) {
        case 200:
            break;
        default:
            return $resp;
        }
        $this->setup();
        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display()));
    }

    /**
     * Include additional JS files.
     *
     * @return array of javascript to be inserted
     */
    public function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/battery_manager/js/batteryManagerIndex.js",
            )
        );
    }
}

