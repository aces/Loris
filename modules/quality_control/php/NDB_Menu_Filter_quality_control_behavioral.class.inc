<?php
/**
 * This file contains the NDB_Menu_Filter_quality_control class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality_Control
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
/**
 * Behavioural QC Class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality_Control
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Menu_Filter_Quality_Control_Behavioral extends NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $AjaxModule         = true;
    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& User::singleton();
        return $user->hasPermission('data_team_helper');
    }
    
    /**
     * Create a form to filter behavioral QC by various criteria
     *
     * @return bool
     * @throws ConfigurationException
     * @throws DatabaseException
     * @throws Exception
     */
    function _setFilterForm()
    {
        $user      =& User::singleton();
        $db        = Database::singleton();
        $siteList  = array();
        $visitList = Utility::getVisitList();
        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            $siteList = Utility::getSiteList(false);
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
        $instrumentList   = [];
        $instrumentsQuery = $db->pselect(
            "SELECT Test_name, Full_name FROM test_names ORDER BY Test_name",
            []
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Full_name']] = $instrument['Full_name'];
        }
        $projectList = Utility::getProjectList();
        // Form Elements
        $this->addSelect('visitLabel', 'Visit Label', $visitList);
        $this->addSelect('instrument', 'Instruments', $instrumentList);
        $this->addBasicText('candId', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('site', 'Site', $siteList);
        $this->addSelect('project', 'Project', $projectList);
        return true;
    }
    /**
     * Build a list of behavioural QC to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {  
        $this->skipTemplate = true;
        $user           =& User::singleton();
        $config         =& NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
        for ($i=0; $i<count($ddeInstruments); ++$i) {
            $ddeInstruments[$i] = Database::singleton()->quote($ddeInstruments[$i]);
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
        $this->columns  = [
                           's.Visit_label as visit_label',
                           's.CandID as cand_id',
                           'c.PSCID as pscid',
                           't.Full_name as instrument',
                           's.ID',
                           'f.SessionID',
                           'f.data_entry',
                           'f.commentid',
                           'f.test_name',
                          ];
        $query          = $query . $where;
        $this->query    = $query;
        $this->order_by = 'f.commentid';
        $this->headers  = [
                           'Visit Label',
                           'DCCID',
                           'PSCID',
                           'Instrument',
                          ];
        return true;
    }
    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
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
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
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
