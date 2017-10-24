<?php
/**
 * NDB_Menu_Filter_Reliability
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  MRI
 * @author   WangShen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
//@codingStandardsIgnoreStart
function map_cIDs($array){
    $new_array;
    for($i = 0; $i < count($array); $i++){
        $element = $array[$i];
        $new_array[$element['CommentID']] = $element['reliability_center_id'];
    }
    return $new_array;
}
function find_cID($cID, $array)
{
    if (empty($array)) {
        return false;
    }
    foreach ($array as $key=>$value){
        if ($key == $cID) {
            return true;
        }
    }
    return false;
}

function array_remove($item, $array)
{
    $index = array_search($item, $array);
    if ($index === false) {
        return $array;
    } else {
        unset($array[$index]);
        return array_values($array);
    }
}

class NDB_Menu_Filter_Reliability extends NDB_Menu_Filter
{

    var $centerIDMap;
    var $reliability_table;
    function _hasAccess()
    {
        $user =& User::singleton();
        if ($user->hasPermission('access_all_profiles') || $user->hasPermission('reliability_edit_all')) {
            return true;
        }
        return false;
    }
//@codingStandardsIgnoreEnd
    /**
     * GetSiteID Load
     *
     * @param string $site the value of site
     *
     * @return void
     */
    static function getSiteID($site)
    {
        $siteList = Utility::getSiteList();
        foreach ($siteList as $id=>$name) {
            $site_id[$name] = $id;
        }
        $id = $site_id[$site];
        return $id;
    }
    /**
     * _SetupVariables function
     *
     * @return string
     */
//@codingStandardsIgnoreStart
    function _setupVariables()
    {
        $user =& User::singleton();

        // create the centerID map
        $db =& Database::singleton();

        $pscRows = $db->pselect("SELECT CenterID, Name FROM psc", array());
        foreach ($pscRows as $row) {
            $this->centerIDMap[$row['CenterID']] = $row['Name'];
        }

        $this->_populate_reliability_table();

        $query = " FROM reliability ".
                "LEFT JOIN psc p ON (reliability.reliability_center_id=p.CenterID) ".
                "LEFT JOIN flag ON (reliability.CommentID=flag.CommentID), ".
            "candidate " .
                "LEFT JOIN Project pr ON (candidate.ProjectID=pr.ProjectID) ".
                "LEFT JOIN session ON (candidate.CandID=session.CandID) ".
            "WHERE ".
                "session.ID=flag.SessionID";

        // only view their own profiles, unless they have permission to see all
        if (!($user->hasPermission('reliability_edit_all') || $user->hasPermission('access_all_profiles'))) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND candidate.CenterID IN (" . $site_arr . ")";
        }

        $config      =&NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        // set the class variables
        $this->columns = array(
                          'candidate.PSCID',
                          'reliability.reliability_center_id',
                          'p.name as site',
                          'session.SubprojectID as Cohort',
                          'session.CandID AS DCCID',
                          'candidate.Gender',
                          'session.Visit_label',
                         );
        if ($useProjects === "true") {
            $this->columns[] = 'pr.Name as Project';
        }
        $this->columns  =array_merge(
            $this->columns,
            array(
             'reliability.CommentID',
             'reliability.Instrument',
             'reliability.Reliability_score',
             'session.Current_stage',
             'reliability.invalid',
             'reliability.Manual_Swap',
            )
        );
        $this->query    = $query;
        $this->group_by = '';
        $this->order_by = 'reliability.Instrument, session.CandID, session.Visit_label';
        $this->headers  = array(
                           'PSCID',
                           'SiteID',
                           'Site of Reliability Test',
                           'Cohort',
                           'DCCID',
                           'Gender',
                           'Visit_label',
                          );
        if ($useProjects === "true") {
            $this->headers[] = 'Project';
        }
        $this->headers =array_merge($this->headers, array('CommentID', 'Instrument', 'reliability_score', 'Current Stage', 'Invalid', 'Manual Swap', 'Reliable'));

        // Set header as hidden from the data table
        $this->tpl_data['hiddenHeaders'] = json_encode(['SiteID', 'CommentID', 'Current Stage', 'Invalid', 'Manual Swap']);

        $this->validFilters = array(
                               'reliability.CommentID',
                               'reliability.reliability_center_id',
                               'session.SubprojectID',
                               'candidate.CenterID',
                               'session.CandID',
                               'candidate.PSCID',
                               'candidate.Gender',
                               'session.Visit_label',
                               'candidate.ProjectID',
                               'reliability.Instrument',
                               'reliability.Reliability_score',
                               'session.Current_stage',
                               'reliability.invalid',
                               'candidate.CandID',
                              );

        $this->formToFilter = array(
                               'SubprojectID'          => 'session.SubprojectID',
                               'CenterID'              => 'candidate.CenterID',
                               'reliability_center_id' => 'reliability.reliability_center_id',
                               'DCCID'                 => 'candidate.CandID',
                               'PSCID'                 => 'candidate.PSCID',
                               'Gender'                => 'candidate.Gender',
                               'Visit_label'           => 'session.Visit_label',
                               'Instrument'            => 'reliability.Instrument',
                               'reliability_score'     => 'reliability.Reliability_score',
                               'Current_stage'         => 'session.Current_stage',
                               'Invalid'               => 'reliability.invalid',
                               'ProjectID'             => 'candidate.ProjectID',
                                    // 'Lock_record' => 'session.Lock_record'
                              );
        return true;
    }
//@codingStandardsIgnoreEnd
    /**
     * _SetFilterForm function
     *
     * @return string
     */
    function _setFilterForm()
    {
        // create user object
        $user          =& User::singleton();
        $list_of_sites = array();

        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')
            || $user->hasPermission('reliability_edit_all')
        ) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList(false);
            if (is_array($list_of_sites)) {
                $new_list = array('' => 'All');
                foreach ($list_of_sites as $key => $val) {
                    $new_list[$key] = $val;
                }
                $list_of_sites = $new_list;
            }
        } else {
            // this else loop is never entered as _hasAccess
            // would have returned false
            // allow only to view own site data
            $site_arr = $user->getData('CenterIDs');
            foreach ($site_arr as $key=>$val) {
                $site[$key] = Site::singleton($val);
                //    if ($site[$key]->isStudySite()) {
                    $list_of_sites[$key] = $site[$key]->getCenterName();
                //    }
            }
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        // hack for Visit Labels... maybe get all the real visit labels from DB?
        $list_of_visit_labels = array(null => 'All');
        $visitLabel           = Utility::getVisitList();
        foreach ($visitLabel as $key => $value) {
            $list_of_visit_labels[$key] = $value;
        }
        $list_of_visit_labels_only = $visitLabel;
        $projects         = Utility::getProjectList();
        $list_of_projects = array(null => 'All');
        foreach ($projects as $key=>$value) {
             $list_of_projects[$key] = $value;
        }
        $subproject_options = Utility::getSubprojectList();

        $subproject_options  = array('' => 'All') + $subproject_options;
        $gender_options      = array(
                                null     => 'All',
                                'Male'   => 'Male',
                                'Female' => 'Female',
                               );
        $list_of_instruments = array(null => 'All');
        $config            =& NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $reliabilityInstruments = $reliabilityConfig['Instrument'];
        foreach (Utility::toArray($reliabilityInstruments)
                   AS $reliabilityInstrument) {
            $list_of_instruments[$reliabilityInstrument['Testname']]      = $reliabilityInstrument['Displayname'];// @codingStandardsIgnoreLine
            $list_of_instruments_only[$reliabilityInstrument['Testname']] = $reliabilityInstrument['Displayname'];// @codingStandardsIgnoreLine
        }

        $lock_options = array(
                         null       => '',
                         'Locked'   => 'Locked',
                         'Unlocked' => 'Unlocked',
                        );

        // Form Elements
        $this->addSelect('SubprojectID', 'Subproject:', $subproject_options);
        $this->addSelect('CenterID', 'Site:', $list_of_sites);
        $this->addSelect(
            'reliability_center_id',
            'Site of Reliability:',
            $list_of_sites
        );
        $this->addBasicText(
            'DCCID',
            'DCCID:',
            array(
             "size"      => 9,
             "maxlength" => 6,
            )
        );
        $this->addBasicText(
            'PSCID',
            'PSCID:',
            array(
             "size"      => 9,
             "maxlength" => 7,
            )
        );
        $this->addSelect('Gender', 'Gender:', $gender_options);
        $this->addSelect('Visit_label', 'Visit Label:', $list_of_visit_labels);
        $this->addSelect('Instrument', 'Instrument:', $list_of_instruments);
        $this->addSelect(
            'Invalid',
            'Invalid Candidate:',
            array(
             ''    => 'All',
             'yes' => 'Yes',
             'no'  => 'No',
            )
        );
        // $this->form->addElement('select', 'Lock_record',
        //'Lock_record:', $lock_options);
        //$config=&NDB_Config::singleton();
        if ($config->getSetting("useProjects")=="true") {
            $this->addSelect('ProjectID', 'Project:', $list_of_projects);
        }

        // For swapping candidates
        if ($user->hasPermission('reliability_swap_candidates')) {
            $this->tpl_data['reliability_swap_candidates'] = true;
            $this->addSelect(
                'Cand1Visit_label',
                'Visit Label:',
                $list_of_visit_labels_only
            );
            $this->addBasicText('Cand1PSCID', 'PSCID:');
            $this->addSelect(
                'Cand2Visit_label',
                'Visit Label:',
                $list_of_visit_labels_only
            );
            $this->addBasicText('Cand2PSCID', 'PSCID:');
            $this->addSelect(
                'SwapInstrument',
                'Instrument:',
                $list_of_instruments_only
            );
        } else {
            $this->tpl_data['reliability_swap_candidates'] = false;
        }

        if ($user->hasPermission('data_entry')) {
            $this->tpl_data['IBIS_Access'] = true;
        } else {
            $this->tpl_data['IBIS_Access'] = false;
        }

        // Doing this here is a hack. Since this is a menu filter
        // and not a Form, there's no
        // _process/_save functions automagically called.
        // There should probably be something like
        // a Menu_Filter_Form base class for instances like this or
        // the conflict resolver, but as
        // things stand you either need to work with the $_POST
        // array/DB directly in a Menu_Filter,
        // or rewrite/imitate the Menu_Filter in an NDB_Form. -- Dave
        if (isset($_POST['swap'])
            && ($_POST['swap'] == 'Swap Candidates' || $_POST['swap'] == 'swap')
        ) {
            $message = $this->_swap_candidates();
            if (isset($message['error'])) {
                $this->form->addElement('static', 'error', $message['error']);
            }
            if (isset($message['message'])) {
                $this->form->addElement('static', 'message', $message['message']);
            }
        } else if (isset($_POST['swap'])
            && ($_POST['swap'] == "Add Candidate" || $_POST['swap'] == 'addnew')
        ) {
            $message = $this->_addCandidate();
            if (isset($message['error'])) {
                $this->form->addElement('static', 'error', $message['error']);
            }
            if (isset($message['message'])) {
                $this->form->addElement('static', 'message', $message['message']);
            }
        }
        return true;
    }
    /**
 * GetThreshholds function
     *
     * @return string
     */
    function getThreshholds()
    {
        // This is used both by setDataTableRows, and reliability statistics
        $config            =& NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $reliabilityInstruments = $reliabilityConfig['Instrument'];
        foreach (Utility::toArray($reliabilityInstruments)
                     AS $reliabilityInstrument) {
            $list_of_thresholds[$reliabilityInstrument['Testname']] = $reliabilityInstrument['Threshold'];// @codingStandardsIgnoreLine
        }
        return $list_of_thresholds;
    }
    /**
 * _Populate_reliability_table function
     *
     * @return string
     */
//@codingStandardsIgnoreStart

    function _populate_reliability_table()
    {
        $db =& Database::singleton();
        $this->reliability_table = $db->pselect("SELECT CommentID, reliability_center_id FROM reliability", array());

        $this->reliability_table = map_cIDs($this->reliability_table);

        // WITHIN SITE
        $siteList = Utility::getSiteList();
        foreach($siteList as $name=>$id){
            $site_list[$name] = $id;
        }
        $config            =& NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $reliabilityInstruments = $reliabilityConfig['Instrument'];

        foreach($site_list as $site) {
            foreach(Utility::toArray($reliabilityInstruments) AS $reliabilityInstrument) {
                $this->within_site_flagging($reliabilityInstrument['Testname'], $reliabilityInstrument['Threshold'], $site, $db);
            }
        }

        foreach($site_list as $site) {
            foreach(Utility::toArray($reliabilityInstruments) AS $reliabilityInstrument) {
                $this->cross_site_flagging($reliabilityInstrument['Testname'], $site, array_remove($site, $site_list), $db);
            }
        }

    }
//@codingStandardsIgnoreEnd
//@codingStandardsIgnoreStart

    /**
 * Within_site_flagging function
     *
     * @return string
     */
    function within_site_flagging($instrument, $ratio, $current_site, $db)
    {
        $params = array();
        $params['currentSite']    = $current_site;
        $params['instrument']     = $instrument;
        $instrument_records       = $db->pselect("SELECT f.CommentID FROM flag as f JOIN session as s ON (f.SessionID=s.ID) WHERE f.Test_name=:instrument AND s.Current_stage<>'Recycling Bin' AND f.Data_entry='Complete' AND f.CommentID LIKE CONCAT('%',:currentSite,'%')  AND f.CommentID NOT LIKE 'DDE%' AND f.Administration <> 'None' ORDER BY RIGHT(f.CommentID, 6)", $params);
        $total_records_count      = count($instrument_records);
        $params['currentSite_id'] = NDB_Menu_Filter_reliability::getSiteID($current_site);
        $current_count            = $db->pselectOne("SELECT count(*) FROM (SELECT DISTINCT r.CommentID FROM reliability as r JOIN flag as f ON (r.CommentID=f.CommentID) JOIN session as s ON (s.ID=f.SessionID) WHERE r.CommentID LIKE CONCAT('%', :currentSite ,'%') AND r.Instrument=:instrument AND r.reliability_center_id=:currentSite_id AND r.invalid = 'no' AND s.Current_stage<>'Recycling Bin') as t", $params);
        $total_count = count($instrument_records);
        if ($ratio*$total_records_count >= $total_count) {
            $max = $total_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }
        for($i = 0; $i < count($instrument_records) && $current_count + 1 <= $max; $i += 2) {
            $commentID = $instrument_records[$i]["CommentID"];
            if (!find_cID($commentID, $this->reliability_table)) {
                $db->insert(
                    'reliability',
                    array(
                     'CommentID'             => $instrument_records[$i]["CommentID"],
                     'reliability_center_id' => $params['currentSite_id'],
                     'Instrument'            => $instrument,
                    )
                );
                $this->reliability_table[$instrument_records[$i]["CommentID"]] = $params['currentSite_id'];
                $current_count++;
            }
        }
    }
//@codingStandardsIgnoreEnd
    /**
 * Cross_site_flagging function
     *
     * @return string
     */
//@codingStandardsIgnoreStart
    function cross_site_flagging($instrument, $current_site, $reliability_sites, $db)
    {
        $ratio = 0.1;
        $reliability_site_index = 0;
        // We want the site to be random, starting from 0 causes a bias towards the first entry
        // in $reliability_sites.. so shuffle the array to eliminate the bias
        shuffle($reliability_sites);

        $params = array();
        $params['currentSite'] = $current_site;
        $params['instrument']  = $instrument;

        $instrument_records       = $db->pselect("SELECT f.CommentID FROM flag as f JOIN session as s ON (f.sessionID=s.ID) WHERE s.Current_stage<>'Recycling Bin' AND f.Data_entry='Complete' AND f.CommentID NOT LIKE CONCAT('%', :currentSite,'%') AND f.Test_name=:instrument AND f.CommentID NOT LIKE 'DDE%'  AND f.Administration <> 'None' ORDER BY RIGHT(f.CommentID, 6)", $params);
        $total_records_count      = count($instrument_records);
        $params['currentSite_id'] = NDB_Menu_Filter_reliability::getSiteID($current_site);
         $current_count           = $db->pselectOne("SELECT count(*) FROM (SELECT DISTINCT r.CommentID FROM reliability as r JOIN flag as f ON (r.CommentID=f.CommentID) JOIN session as s ON (s.ID=f.SessionID) WHERE r.CommentID LIKE CONCAT('%',:currentSite,'%') AND r.Instrument=:instrument AND r.reliability_center_id<>:currentSite_id AND r.invalid = 'no' AND s.Current_stage<>'Recycling Bin') as t", $params);
        $total_count = count($instrument_records);
        if ($ratio*$total_records_count >= $total_count) {
            $max = $total_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }

        for($i = 0; $i < count($instrument_records) && $current_count + 1 <= $max; $i += 2) {
            $commentID = $instrument_records[$i]["CommentID"];
            if (!find_cID($commentID, $this->reliability_table)) {
                $db->insert(
                    'reliability',
                    array(
                     'CommentID'             => $instrument_records[$i]["CommentID"],
                     'reliability_center_id' => $params['currentSite_id'],
                     'Instrument'            => $instrument,
                    )
                );
                $this->reliability_table[$instrument_records[$i]["CommentID"]] = $params['currentSite_id'];
                $current_count++;
            }
            $reliability_site_index = ($reliability_site_index + 1) % count($reliability_sites);
        }
    }
//@codingStandardsIgnoreEnd
    /**
     * Get_current_index function
     *
     * @return array
     */
//@codingStandardsIgnoreStart
    function get_current_index($instrument, $current_site, $reliability_sites, $db)
    {
        $site_name = array_flip($this->site_id);
        $params    = array();
        $params['currentSite']    = $current_site;
        $params['instrument']     = $instrument;
        $params['currentSite_id'] = NDB_Menu_Filter_reliability::getSiteID($current_site);
        $last_site = $db->pselectOne(
            "SELECT reliability_center_id".
            " FROM reliability where ID=(select max(ID)".
                          " FROM reliability".
                          " WHERE CommentID LIKE CONCAT('%',:currentSite,'%')".
                          " AND Instrument=:instrument".
                          " AND reliability_center_id<>:currentSite_id)",
            $params
        );
        $res       = (array_search($site_name[$last_site], $reliability_sites) + 1);
        if (empty($last_site)) {
            return 0;
        } else {
            return $res % count($reliability_sites);
        }
    }
//@codingStandardsIgnoreEnd
    /**
     * Swap candidates function
     *
     * @return array
     */
//@codingStandardsIgnoreStart
    function _swap_candidates()
    {
        $user =& User::singleton();
        if (!($user->hasPermission('reliability_swap_candidates'))) {
            return array(
                    "error" => "You do not have permission".
                                " to swap candidates",
                   );
        }
        $DB            =& Database::singleton();
        $params        = array();
        $params['pid'] = $_POST['Cand1PSCID'];
        $params['measure'] = $_POST['SwapInstrument'];
        $params['id_V']    = $_POST['Cand1Visit_label'];
        $params_new        = array();
        $params_new['id_Replace']  = $_POST['Cand2PSCID'];
        $params_new['id_replaceV'] = $_POST['Cand2Visit_label'];

        $query ="SELECT reliability.CommentID as OldID,".
                " reliability.reliability_center_id as CenterID,".
                " reliability.Reliability_score as Score,".
                " candidate.CenterID as OldCenterID ".
                " FROM candidate JOIN session ON ".
                "(session.CandID = candidate.CandID) ".
                "JOIN flag ON (flag.SessionID = session.ID) ".
                "JOIN reliability ON ( reliability.CommentID=flag.CommentID)".
                " WHERE candidate.PSCID=:pid AND".
                " reliability.Instrument=:measure and ".
                "session.Visit_label=:id_V AND flag.Data_entry ".
                "IS NOT NULL and flag.Data_entry <> 'None'";

        $CommentID = $DB->pselectRow($query, $params);
        if (!$CommentID) {
            return array(
                    'error' => $params_new['id_Replace']."/".
                       $params_new['id_replaceV']." did not complete".
                       $params['measure'].
                       " or data not entered. Cannot swap candidates.",
                   );

        }
        $params_new['Instrument'] = $_POST['SwapInstrument'];
        $query        ="SELECT f.CommentID as NewID, c.CenterID as NewCenterID".
                       " FROM session s join flag f ON (f.SessionID=s.ID)".
                       " JOIN candidate c ON (c.CandID=s.CandID)".
                       " WHERE f.Test_name=:Instrument and c.PSCID=:id_Replace".
                       " AND s.Visit_label=:id_replaceV AND".
                       " f.Data_entry IS NOT NULL and f.Data_entry <> 'None'";
        $newCommentID = $DB->pselectRow($query, $params_new);
        if (!$newCommentID) {
            $error_msg = $params_new['id_Replace']."/".
                         $params_new['id_replaceV']." did not complete".
                         $params_new['Instrument'].
                         " or data not entered. Cannot swap candidates.";
            return array('error' => $error_msg);
        }
        if ($newCommentID['NewCenterID'] !== $CommentID['OldCenterID']) {
            return array(
                    'error' => "Candidates are not from the same site.".
                          " Cannot swap candidates across sites.",
                   );
        } elseif (!in_array($newCommentID['NewCenterID'], $user->getCenterIDs())) {
            $error_msg = $params_new['id_Replace']."/".
                         $params_new['id_replaceV'].
                         " is from a different site than you.".
                         " Can only swap candidates from the same site.";
            return array('error' => $error_msg);
        } elseif (!in_array($CommentID['OldCenterID'], $user->getCenterIDs())) {
            $error_msg = $params_new['id_Replace']."/".
                  $params_new['id_replaceV'].
                  " is from a different site than you.".
                  " Can only swap candidates from the same site.";
            return array('error' => $error_msg);

        }
        $value            = array('NewID' => $newCommentID['NewID']);
        $replacementCheck = $DB->pselectRow(
            "SELECT CommentID FROM reliability WHERE CommentID=:NewID",
            $value
        );
        if (!empty($replacementCheck)) {
            $error_msg = $params_new['id_Replace']."/".
                  $params_new['id_replaceV'].
                  " already in reliability. Cannot swap".
                  $params['pid']."/".$params['id_V']."for it";
            return array('error' => $error_msg);
        }

        $CenterID = $CommentID['CenterID'];
        if (!empty($CommentID['Score'])) {
            return array(
                    "error" => "Reliability score already exists for".
                         $params['pid']."/".$params['id_V'].
                         "Can not swap candidate.",
                   );
        }
        $where_criteria = array(
                           'CommentID'  => $CommentID['OldID'],
                           'Instrument' => $params['measure'],
                          );
        $values         = array(
                           'invalid'     => 'yes',
                           'manual_swap' => 'yes',
                          );
        $DB->update('reliability', $values, $where_criteria);
        $DB->insert(
            'reliability',
            array(
             'CommentID'             => $newCommentID['NewID'],
             'reliability_center_id' => $CenterID,
             'Instrument'            => $params['measure'],
             'Manual_Swap'           => 'yes',
            )
        );

        return array(
                "message" => "Swapped candidate".$params['pid'].
                  " for".$params_new['id_Replace'],
               );
    }
//@codingStandardsIgnoreEnd
    /**
 * Add Candidate function
     *
     * @return array
     */
    function _addCandidate()
    {
        $user   =& User::singleton();
        $DB     =& Database::singleton();
        $params = array();
        $params['Instrument']  = $_POST['AddInstrument'];
        $params['Visit_label'] = $_POST['AddVisit_label'];
        $params['PSCID']       = $_POST['AddPSCID'];
        if (!$params['Visit_label']) {
            return array("error" => "You must specify a visit label");
        }

        if (!$params['Instrument']) {
            return array("error" => "You must specify an instrument");
        }
        if (!$params['CenterID']) {
            return array(
                    "error" => "You must specify a center for".
                         " reliability testing",
                   );
        }

        $CommentID = $DB->pselectOne(
            "SELECT CommentID FROM flag f".
            " JOIN session s ON (s.ID=f.SessionID) JOIN candidate".
                    " c USING (CandID) WHERE f.Test_name=:Instrument".
                    " AND c.PSCID=:PSCID AND s.Visit_label=:Visit_label",
            $params
        );
        if (!$CommentID) {
            $error_msg = $params['PSCID']."/".$params['Visit_label'].
                " does not have data entered for".$params['Instrument'];
            return array("error" => $error_msg);

        }
        $params['CenterID'] = $_POST['AddReliabilityCenter'];
        $DB->insert(
            'reliability',
            array(
             'CommentID'             => $CommentID,
             'reliability_center_id' => $params['CenterID'],
             'Instrument'            => $params['Instrument'],
             'Manual_Swap'           => 'no',
            )
        );
        return array(
                "message" => "Inserted new reliability candidate".
                    $params['PSCID']."/".$params['Visit_label'],
               );
    }

    /**
     * Override toJSON to append a calculated field to the default JSON object
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $tableData = $this->toArray();
        $threshold = $this->getThreshholds();
        $cohort    = Utility::getSubprojectList();

        foreach ($tableData['Data'] as $key => $record) {

            // Calculate and set `Reliable` column
            $instrumentThreshold = isset($record[9], $threshold[$record[9]]) ?
                $threshold[$record[9]] :
                null;
            $instrumentScore     = $record[10];

            // Map cohort id to a string value
            $record[3] = $cohort[$record[3]];

            if ($instrumentScore == null) {
                $isReliable = "";
            } else if ($instrumentScore >= $instrumentThreshold) {
                $isReliable = "Yes";
            } else {
                $isReliable = "No";
            }

            $record[] = $isReliable;

            $tableData['Data'][$key] = $record;
        }

        return json_encode($tableData);
    }

     /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
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
             $baseURL . "/reliability/js/reliability_helper.js",
             $baseURL . "/reliability/js/columnFormatter.js",
            )
        );
    }
}
?>
