<?php
/**
 * This file contains the NDB_Menu_Filter_media class
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Quality_Control
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
namespace LORIS\quality_control;

/**
 * Main class for quality control module corresponding to /quality_control/ URL
 * Tools section of the LorisMenu.
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Quality_Control
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Quality_Control_Behavioral extends \NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $AjaxModule         = true;
    public $fieldOptions;

    /**
     * Check user permissions
     *
     * @param \User $user UserID
     *
     * @return bool
     * @throws \ConfigurationException
     */
    function _hasAccess(\User $user) : bool
    {
        //create user object
        return $user->hasPermission('data_team_helper');
    }


    /**
     * Build a list of behavioural QC to display in Data Table
     *
     * @return void
     * @throws \DatabaseException
     */
    function _setupVariables(): void
    {
        $db = \Database::singleton();
        $this->skipTemplate = true;
        $config         =& \NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
        if (gettype($ddeInstruments) == "string") {
            $ddeInstruments = array($db->quote($ddeInstruments));
        } else {
            for ($i=0; $i<count($ddeInstruments); ++$i) {
                $ddeInstruments[$i] = $db->quote($ddeInstruments[$i]);
            }
        }
        $query = " FROM session s JOIN flag f ON (f.sessionid = s.id)".
            " JOIN candidate c ON (c.candid = s.candid)".
            " JOIN test_names t ON (t.Test_name = f.Test_name)".
            " JOIN psc ON (s.CenterID = psc.CenterID)";
        $where = " WHERE s.Active = 'Y' AND c.Active = 'Y'".
            " AND coalesce(f.data_entry,'In Progress') = 'In Progress'".
            " AND psc.Centerid!= '1' AND c.Entity_type != 'Scanner'";
        if (count($ddeInstruments) > 0) {
            $ddeInstruments = implode(",", $ddeInstruments);
            $where         .= "
                AND (f.test_name IN ($ddeInstruments) OR
                f.commentid NOT LIKE 'DDE_%')
            ";
        } else {
            $where .= "
                AND (f.commentid NOT LIKE 'DDE_%')
            ";
        }

        $user      = \User::singleton();
        $siteList  = array();
        $visitList = \Utility::getVisitList();
        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            $siteList = \Utility::getSiteList(false);
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            // allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site = &Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }
        $instrumentList   = array();
        $instrumentsQuery = $db->pselect(
            "SELECT Test_name, Full_name FROM test_names ORDER BY Test_name",
            array()
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Full_name']] = $instrument['Full_name'];
        }
        $projectList = \Utility::getProjectList();

        $this->fieldOptions = [
                               'visits'     => $visitList,
                               'instrument' => $instrumentList,
                               'site'       => $siteList,
                               'projects'   => $projectList,
                              ];

        $this->columns = [
                          's.Visit_label as visit_label',
                          's.CandID as cand_id',
                          'c.PSCID as pscid',
                          't.Full_name as instrument',
                         ];
        $query         = $query . $where;
        $this->query   = $query;

        $this->order_by = 'f.commentid';
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
            array(
             $baseURL . "/quality_control/js/qualityControlIndex.js",
            )
        );
    }
}
