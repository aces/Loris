<?php
/**
 * This file contains the endpoint for Test field options.
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Battery_Manager
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
 * @author   Henri Rabalais <henri.rabalais@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class TestOptionsEndpoint extends \NDB_Page
{
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
        $method = $request->getMethod();

        switch($method) {
        case 'GET':
            return new \LORIS\Http\Response\JSON\OK($this->_getOptions());
        }

        return new \LORIS\Http\Response\JSON\BadRequest('Unspecified Request');
    }

    /**
     * Gets the field options for this module.
     *
     * @return array
     */
    private function _getOptions() : array
    {
        return array(
            'instruments' => \Utility::getAllInstruments(),
            'stages'      => $this->_getStageList(),
            'subprojects' => \Utility::getSubprojectList(null),
            'visits'      => \Utility::getVisitList(),
            'sites'       => \Utility::getSiteList(false),
            'firstVisit'  => $this->_getYesNoList(),
            'active'      => $this->_getYesNoList(),
        );
    }

    /**
     * Return associative array of stages.
     *
     * @return array
     */
    private function _getStageList() : array
    {
        return array(
            "Not Started"   => 'Not Started',
            "Screening"     => 'Screening',
            "Visit"         => 'Visit',
            "Approval"      => "Approval",
            "Subject"       => "Subject",
            "Recycling Bin" => "Recycling Bin",
        );
    }

    /**
     * Return associative array of yes and no values.
     *
     * @return array
     */
    private function _getYesNoList() : array
    {
        return array(
            'Y' => 'Yes',
            'N'  => 'No',
        );
    }
}

