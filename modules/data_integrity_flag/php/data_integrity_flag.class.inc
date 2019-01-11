<?php
/**
 * This file contains the Data_Integrity_Flag class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Data_Integrity_Flag
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
namespace LORIS\data_integrity_flag;

/**
 * Main class for data_integrity_flag module
 * corresponding to /data_integrity_flag/ URL
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Data_Integrity_Flag
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Data_Integrity_Flag extends \NDB_Menu_Filter
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_integrity_flag');
    }

    /**
     * Displays the menu page
     *
     * @return string
     */
    function display()
    {
        // If POST request received, process it as a form submission
        if ($_SERVER['REQUEST_METHOD'] === "POST") {
            $stdin = file_get_contents('php://input');
            $req   = json_decode($stdin, true);
            $this->_insertDataFlag($req);
        }

        return parent::display();
    }

    /**
     * Inserts form data in the database
     *
     * @param object $req HTTP request data
     *
     * @return void
     * @access private
     */
    function _insertDataFlag($req)
    {
        $user =& \User::singleton();
        $db   =& \Database::singleton();

        if (!isset($req['instrument'])
            || !isset($req['visitLabel'])
            || !isset($req['comment'])
            || !isset($req['date'])
            || !isset($req['flagStatus'])
        ) {
            return "Error";
        }

        $db->update(
            'data_integrity_flag',
            ['latest_entry' => 0],
            [
             'dataflag_instrument' => $req['instrument'],
             'dataflag_visitlabel' => $req['visitLabel'],
            ]
        );
        $db->insert(
            "data_integrity_flag",
            [
             'dataflag_instrument' => $req['instrument'],
             'dataflag_visitlabel' => $req['visitLabel'],
             'dataflag_comment'    => $req['comment'],
             'dataflag_date'       => $req['date'],
             'dataflag_status'     => $req['flagStatus'],
             'latest_entry'        => 1,
             'dataflag_userid'     => $user->getUsername(),
            ]
        );
    }

    /**
     * Build a list of media to display in Data Table
     *
     * @return void
     * @throws \DatabaseException
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns = [
                          'dataflag_id',
                          'dataflag_visitlabel',
                          'dataflag_instrument',
                          'dataflag_date',
                          'dataflag_status',
                          'dataflag_comment',
                          'dataflag_userid',
                         ];

        $this->query        = " FROM data_integrity_flag WHERE 1=1";
        $this->group_by     = '';
        $this->order_by     = 'dataflag_date desc';
        $this->validFilters = [];
        $this->formToFilter = [];
        $flagStatusList     = [
                               '1' => '1 - Ready For Review',
                               '2' => '2 - Review Completed',
                               '3' => '3 - Feedbacks Closed',
                               '4' => '4 - Finalization',
                              ];
        $this->fieldOptions = [
                               'visits'         => \Utility::getVisitList(),
                               'instruments'    => \Utility::getAllInstruments(),
                               'users'          => ['admin' => 'admin'],
                               'flagStatusList' => $flagStatusList,
                              ];
    }

    /**
     * Include additional JS files:
     *  1. columnFormatter.js required to set links to Edit and Download file
     *  2. uploadForm.js - reactified form to upload files
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
            [$baseURL . "/data_integrity_flag/js/dataIntegrityFlagIndex.js"]
        );
    }
}

