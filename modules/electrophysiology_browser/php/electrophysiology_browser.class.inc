<?php

/**
 * This class features the code for the menu portion of the LORIS
 * electrophysiology browser module.
 *
 * PHP version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */
namespace LORIS\electrophysiology_browser;
/**
 * Provides the PHP code for the menu filter for the electrophysiology browser
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */

class Electrophysiology_Browser extends \NDB_Menu_Filter {

    public $AjaxModule   = true; // stops from running the query twice
    public $skipTemplate = true; // stops from looking for a smarty template

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user hass access
     */
    function _hasAccess()
    {
        $user =& \User::singleton();

        return ($user->hasPermission('electrophysiology_browser_view_allsites')
            || ($user->hasPermission('electrophysiology_browser_view_site')
                && $user->hasStudySite()
            )
        );
    }

    /**
     * Set up the variables required by NDB_Menu_Filter class for
     * constructing a query
     *
     * @return void
     */
    function setup ()
    {
        parent::setup();

        // create user object
        $user =& \User::singleton();

        // grep the sites available to the user
        $list_of_sites = array();
        if ($user->hasPermission('electrophysiology_browser_view_allsites')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList(false);
            // Index sites using their names (used to filter react tables)
            foreach ($list_of_sites as $key => $site) {
                unset($list_of_sites[$key]);
                $list_of_sites[$site] = $site;
            }
        } else {
            // allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            // Index sites using their names (used to filter react tables)
            foreach ($siteIDs as $val) {
                $site =& \Site::singleton($val);
                if ($site->isStudySite()) {
                    $list_of_sites[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }

        // grep the file types from ImagingFileType
        $DB             = \Database::singleton();
        $file_type_list = $DB->pselect(
            "SELECT type FROM ImagingFileTypes WHERE Description LIKE '%(EEG)'",
            array()
        );

        // Form Elements
        $this->addBasicText('pSCID', 'PSCID');
        $this->addBasicText('dCCID', 'DCCID');
        $this->addBasicText('visitLabel', 'Visit Label');
        $this->addSelect('site', 'Site', $list_of_sites);

        return true;
    }

    function _setupVariables () // setup the data table structure
    {

        // create database and user objects
        $DB   = \Database::singleton();
        $user = \User::singleton();

        // select all imaging file types for EEG and concatenate them into an
        // SQL string to be used later in the select query for the data table
        $file_type_arr = $DB->pselect(
            "SELECT type FROM ImagingFileTypes WHERE Description LIKE '%(EEG)'",
            array()
        );
        $file_types = '(';
        foreach ($file_type_arr as &$arr_val) {
            $file_types .= ($file_types == '(') ? '' : ', ';
            $file_types .= "'" . $arr_val['type'] . "'";
        }
        $file_types .= ')';

        // set the header column name of the data table to be displayed
        $this->headers = array(
            'Site', 'PSCID', 'DCCID', 'Visit Label', 'First Acquisition',
            'First Insertion', 'Links', 'Session ID'
        );

        // set the field names of the MySQL tables
        $this->columns = array(
            "psc.Name AS site",
            "c.PSCID AS pscid",
            "c.CandID AS dccid",
            "s.Visit_label AS visit_label",
            "MIN(pf.AcquisitionTime) AS acquisition_time",
            "FROM_UNIXTIME(MIN(pf.InsertTime), '%Y-%m-%d') AS insert_time",
            "GROUP_CONCAT(DISTINCT pot.OutputType) AS links",
            "s.ID AS session_id",
        );

        // create the base query
        $base_query = " FROM physiological_file pf"
            . " LEFT JOIN session s ON s.ID=pf.SessionID"
            . " LEFT JOIN candidate c USING (CandID)"
            . " LEFT JOIN psc ON s.CenterID=psc.CenterID"
            . " LEFT JOIN physiological_output_type pot USING"
            . " (PhysiologicalOutputTypeID)";
        $where = " WHERE s.Active = 'Y' AND pf.FileType IN " . $file_types;
        $this->query = $base_query . $where;

        // check which sites the user has access to if not to all sites
        if (!$user->hasPermission('electrophysiology_browser_view_allsites')) {
            $site_arr = implode(",", $user->getCenterIDs());
            $this->query .= " AND (c.CenterID IN (" . $site_arr . ")
                              AND s.CenterID IN (" . $site_arr . "))";
        }

        // set the group by and order by of the query
        $this->group_by = " SessionID";
        $this->order_by = " c.PSCID";

        return true;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        return json_encode($result);
    }

    /**
     * Include additional JS files
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . '/electrophysiology_browser/js/electrophysiology_browser.js',
                $baseURL . '/electrophysiology_browser/js/columnFormatter.js',
            )
        );
    }

}