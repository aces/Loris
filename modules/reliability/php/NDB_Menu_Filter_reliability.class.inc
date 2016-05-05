<?php
require_once 'NDB_Menu_Filter.class.inc';
require_once 'Utility.class.inc';

/**
 * Class NDB_Menu_Filter_reliability
 *
 * @author Dave, Rida
 */
class NDB_Menu_Filter_reliability extends NDB_Menu_Filter
{

    var $centerIDMap;
    var $reliability_table;
    function _hasAccess()
    {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        if($user->hasPermission('access_all_profiles')
            || $user->hasPermission('reliability_edit_all')
        ) {
            return true;
        }
        return false;
    }


    function _setupVariables()
    {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // create the centerID map
        $db      =& Database::singleton();
        $pscRows = array();
        $pscRows = $db->pselect("SELECT CenterID, Name FROM psc", array());
        foreach($pscRows AS $row) {
            $this->centerIDMap[$row['CenterID']] = $row['Name'];
        }

        $this->_populate_reliability_table();

        $query = " FROM candidate, session, flag, reliability ".
            "WHERE reliability.CommentID=flag.CommentID ".
            "AND candidate.CandID=session.CandID AND session.ID=flag.SessionID";

        // only view their own profiles, unless they have permission to see all
        if (!($user->hasPermission('reliability_edit_all')
            || $user->hasPermission('access_all_profiles'))
        ) {
            $query .= " AND candidate.centerID = '".
                $user->getData('CenterID') . "' ";
        }
        $config      =&NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        // set the class variables
        $this->columns = array(
            'candidate.PSCID',
            'reliability.reliability_center_id AS Site',
            'session.SubprojectID as Cohort',
            'session.CandID AS DCCID',
            'candidate.Gender',
            'session.Visit_label',
        );

        if ($useProjects === "true") {
            $this->columns[] = 'candidate.ProjectID as Project';
        }
        $this->columns =array_merge(
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
        $this->order_by = 'reliability.Instrument, session.CandID, '.
            'session.Visit_label';
        $this->headers  = array(
            'PSCID',
            'reliability_center_id',
            'Cohort',
            'DCCID',
            'Gender',
            'Visit_label',
        );
        if ($useProjects === "true") {
            $this->headers[] = 'Project';
        }
        $this->headers      =array_merge(
            $this->headers,
            array(
                'Instrument',
                'reliability_score',
                'Reliable',
            )
        );
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


    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')
            || $user->hasPermission('reliability_edit_all')
        ) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList(false);
            if(Utility::isErrorX($list_of_sites)) {
                return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
            }
            if(is_array($list_of_sites)) {
                $new_list = array('' => 'All');
                foreach($list_of_sites as $key => $val) {
                    $new_list[$key] = $val;
                }
                $list_of_sites = $new_list;
            }
        }else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            //if ($site->isStudySite()) {
            $list_of_sites = array(
                $user->getData('CenterID') => $user->getData('Site'),
            );
            //}
        }

        /// hack for Visit Labels... maybe get all the real visit labels from DB?
        $list_of_visit_labels = array(null => 'All');
        $visitLabel           = Utility::getVisitList();
        foreach($visitLabel as $key => $value){
            $list_of_visit_labels[$key] = $value;
        }
        $list_of_visit_labels_only = $visitLabel;
        $projects         = Utility::getProjectList();
        $list_of_projects = array(null => 'All');
        foreach($projects as $key=>$value){
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
        $config =& NDB_Config::singleton();

        $db =& Database::singleton();
        $reliabilityInstruments = $db->pselect(
            "
            SELECT Test_name
            FROM reliability_instruments ri
              JOIN test_names t ON t.ID = ri.TestID",
            array()
        );

        foreach($reliabilityInstruments as $reliabilityInstrument){
            $list_of_instruments[$reliabilityInstrument['Test_name']]      = $reliabilityInstrument['Test_name'];
            $list_of_instruments_only[$reliabilityInstrument['Test_name']] = $reliabilityInstrument['Test_name'];
        }

        //$lock_options = array(null=>'','Locked'=>'Locked','Unlocked'=>'Unlocked');

        // Form Elements
        $this->addSelect(
            'SubprojectID',
            'Subproject:',
            $subproject_options
        );
        $this->addSelect(
            'CenterID',
            'Site:',
            $list_of_sites
        );
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
        $this->addSelect(
            'Gender',
            'Gender:',
            $gender_options
        );
        $this->addSelect(
            'Visit_label',
            'Visit Label:',
            $list_of_visit_labels
        );
        $this->addSelect(
            'Instrument',
            'Instrument:',
            $list_of_instruments
        );
        $this->addSelect(
            'Invalid',
            'Invalid Candidate:',
            array(
                ''    => 'All',
                'yes' => 'Yes',
                'no'  => 'No',
            )
        );
        // $this->form->addElement('select', 'Lock_record', 'Lock_record:', $lock_options);
        //$config=&NDB_Config::singleton();
        if($config->getSetting("useProjects")=="true") {
            $this->addSelect(
                'ProjectID',
                'Project:',
                $list_of_projects
            );
        }

        // For swapping candidates
        if ($user->hasPermission('reliability_swap_candidates')) {
            $this->tpl_data['reliability_swap_candidates'] = true;
            $this->addSelect(
                'Cand1Visit_label',
                'Visit Label:',
                $list_of_visit_labels_only
            );
            $this->addBasicText(
                'Cand1PSCID',
                'PSCID:'
            );
            $this->addSelect(
                'Cand2Visit_label',
                'Visit Label:',
                $list_of_visit_labels_only
            );
            $this->addBasicText(
                'Cand2PSCID',
                'PSCID:'
            );
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

        // Doing this here is a hack. Since this is a menu filter and not a Form, there's no
        // _process/_save functions automagically called. There should probably be something like
        // a Menu_Filter_Form base class for instances like this or the conflict resolver, but as
        // things stand you either need to work with the $_POST array/DB directly in a Menu_Filter,
        // or rewrite/imitate the Menu_Filter in an NDB_Form. -- Dave
        if($_POST['swap'] == 'Swap Candidates' || $_POST['swap'] == 'swap') {
            $message = $this->_swap_candidates();
            if(isset($message['error'])) {
                $this->form->addElement('static', 'error', $message['error']);
            }
            if(isset($message['message'])) {
                $this->form->addElement('static', 'message', $message['message']);
            }
        } else if($_POST['swap'] == "Add Candidate" || $_POST['swap'] == 'addnew') {
            $message = $this->_addCandidate();
            if(isset($message['error'])) {
                $this->form->addElement('static', 'error', $message['error']);
            }
            if(isset($message['message'])) {
                $this->form->addElement('static', 'message', $message['message']);
            }
        }
        return true;
    }


    function getThresholds()
    {

        $db =& Database::singleton();
        $list_of_thresholds = array();
        $thresholds         = $db->pselect(
            "
            SELECT Test_name, Threshold
            FROM reliability_instruments ri
                JOIN test_names t ON t.ID = ri.TestID",
            array()
        );
        foreach($thresholds as $row){
            $list_of_thresholds[$row['Test_name']] = $row['Threshold'];
        }
        return $list_of_thresholds;
    }

    function _setDataTableRows($count)
    {
        $projectlist =Utility::getProjectList();
        $threshold   = $this->getThresholds();
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            // $identifier = $item['Tracking_log_ID'];
            $comment_id    = $item['CommentID'];
            $site_id       = $item['Site'];
            $current_stage = $item['Current_stage'];
            $invalid       = $item['invalid'];
            $manual        = $item['Manual_Swap'];
            if($item['Manual_Swap'] == 'yes' && $item['invalid'] == 'yes') {
                continue;
            }
            foreach ($item as $key => $val) {

                // Confused about this line
                if ($key =='Tracking_log_ID') { continue;
                }
                if ($key == 'CommentID') { continue;
                }
                if ($key == 'Current_stage') { continue;
                }
                if ($key == 'invalid') { continue;
                }
                if ($key == 'Manual_Swap') { continue;
                }

                $this->tpl_data['items'][$x][$i]['name']  = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                if ($key == 'PSCID') {
                    $this->tpl_data['items'][$x][$i]['CommentID']     = $comment_id;
                    $this->tpl_data['items'][$x][$i]['SiteID']        = $item['Site'];
                    $this->tpl_data['items'][$x][$i]['Instrument']    = $item['Instrument'];
                    $this->tpl_data['items'][$x][$i]['Current_stage'] = $current_stage;
                    $this->tpl_data['items'][$x][$i]['invalid']       = $invalid;
                    $this->tpl_data['items'][$x][$i]['manual']        = $manual;
                }
                elseif ($key == 'Site') {
                    $this->tpl_data['items'][$x][$i]['value'] = $this->centerIDMap[$item['Site']];
                }
                elseif ($key=='Project') {
                    $this->tpl_data['items'][$x][$i]['value'] = $projectlist[$val];
                }
                elseif($key == 'Reliability_score') {
                    $this->tpl_data['items'][$x][$i+1]['name'] = 'Reliability';
                    if(is_null($val)) {
                        $reliable = null;
                    }
                    else if($val >= $threshold[$item['Instrument']]) {
                        $reliable = 'Yes';
                    }
                    else {
                        $reliable = 'No';
                    }
                    $this->tpl_data['items'][$x][$i+1]['value'] = $reliable;
                }

                $i++;
            }
            $x++;
        }

        return true;
    }

    function _populate_reliability_table()
    {
        $db =& Database::singleton();
        $this->reliability_table = $db->pselect("
              SELECT CommentID,
                  reliability_center_id
              FROM reliability");

        $this->reliability_table = $this->map_cIDs($this->reliability_table);

        $siteList = Utility::getSiteList();

        //$config =& NDB_Config::singleton();
        //$reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        //$reliabilityInstruments = $reliabilityConfig['Instrument'];
        $reliabilityInstruments = NDB_Menu_Filter_reliability::getReliabilityInstruments();

        foreach($siteList as $centreID => $site) {
            foreach ($reliabilityInstruments as $instr) {
                $instrument = NDB_Menu_Filter_reliability::getTestName($instr["TestID"]);
                if (is_null($instr["Visit_label"]) || $instr["Visit_label"] == "") {
                    // procedure for all visit labels
                    if (strtolower($instr["Target_scope"]) == "cross") {
                        $this->cross_site_flagging(
                            $instrument,
                            $instr["Reliability_ratio"],
                            array($centreID => $site),
                            $db,
                            $instr["ProjectID"],
                            $instr["Target_siteID"]
                        );
                    } else if (strtolower($instr["Target_scope"]) == "within") {
                        $this->within_site_flagging(
                            $instrument,
                            $instr["Reliability_ratio"],
                            array($centreID => $site),
                            $db,
                            $instr["ProjectID"]
                        );
                    }
                } else {
                    //procedure for specific visit labels
                    if (strtolower($instr["Target_scope"]) == "cross") {
                        $this->cross_site_flagging_per_visit(
                            $instrument,
                            $instr["Reliability_ratio"],
                            array($centreID => $site),
                            $db,
                            $instr["ProjectID"],
                            $instr["Visit_label"],
                            $instr["Target_siteID"]
                        );
                    } else if (strtolower($instr["Target_scope"]) == "within") {
                        $this->within_site_flagging_per_visit(
                            $instrument,
                            $instr["Reliability_ratio"],
                            array($centreID => $site),
                            $db,
                            $instr["ProjectID"],
                            $instr["Visit_label"]
                        );
                    }
                }
            }
        }

    }

    function within_site_flagging($instrument, $ratio, $current_site, $db, $project)
    {
        $params = array();
        $params['currentSite'] = reset($current_site);
        $params['instrument']  = $instrument;

        $extra_where ="";
        if (!is_null($project) && $project!='') {
            $extra_where =" AND c.ProjectID = $project ";
        }

        //TODO <>v18 in original query
        $instrument_records  = $db->pselect(
            "
                  SELECT f.CommentID
                  FROM flag as f
                        JOIN session as s ON (f.SessionID=s.ID)
                        JOIN candidate c ON (c.CandID=s.CandID)
                  WHERE f.Test_name=:instrument
                        AND s.Current_stage<>'Recycling Bin'
                        AND f.Data_entry='Complete'
                        AND f.CommentID LIKE CONCAT('%',:currentSite,'%')
                        AND f.CommentID NOT LIKE 'DDE%'
                        AND f.Administration <> 'None'
                        $extra_where
                  ORDER BY RIGHT(f.CommentID, 6)",
            $params
        );
        $total_records_count = count($instrument_records);

        $params['currentSite_id'] = key($current_site);
        $current_count            = $db->pselectOne(
            "
                  SELECT count(*)
                  FROM (SELECT DISTINCT r.CommentID
                        FROM reliability as r
                            JOIN flag as f ON (r.CommentID=f.CommentID)
                            JOIN session as s ON (s.ID=f.SessionID)
                            JOIN candidate c ON (c.CandID=s.CandID)
                        WHERE r.CommentID LIKE CONCAT('%', :currentSite ,'%')
                            AND r.Instrument=:instrument
                            $extra_where
                            AND r.reliability_center_id=:currentSite_id
                            AND r.invalid = 'no'
                            AND s.Current_stage<>'Recycling Bin') as t",
            $params
        );

        if ($ratio > 1) {
            //safeguard
            $max = $total_records_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }
        //TODO Limited to 50% of the instrument records (increments by 2) array... feature or bug ???
        for($i = 0; $i < $total_records_count && $current_count <= $max; $i += 2) {
            $commentID = $instrument_records[$i]["CommentID"];
            if(!$this->find_cID($commentID, $this->reliability_table)) {
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

    function cross_site_flagging($instrument, $ratio, $current_site, $db, $project, $targetID)
    {
        $siteList = Utility::getSiteList();
        $reliability_site_index = 0;
        //error_log("Could not load Loris module $test_name.");

        //check for a specific target ID
        //IF null shuffle through current study sites
        //ELSE use target only
        if (is_null($targetID) || $targetID=="") {
            // We want the site to be random, starting from 0 causes a bias towards the first entry
            // in $reliability_sites.. so shuffle the array to eliminate the bias
            unset($siteList[key($current_site)]);
            $reliability_sites_keys = array_keys($siteList);
            shuffle($reliability_sites_keys);

        } else {
            //TODO support for multiple site overrides
            $reliability_sites_keys = array($targetID);
        }

        $params = array();
        $params['currentSite'] = reset($current_site);
        $params['instrument']  = $instrument;

        $extra_where ="";
        if (!is_null($project) && $project!='') {
            $extra_where =" AND c.ProjectID = $project ";
        }

        $instrument_records  = $db->pselect(
            "
                  SELECT f.CommentID
                  FROM flag as f
                      JOIN session as s ON (f.sessionID=s.ID)
                      JOIN candidate c ON (c.CandID=s.CandID)
                  WHERE s.Current_stage<>'Recycling Bin'
                      AND f.Data_entry='Complete'
                      AND f.CommentID LIKE CONCAT('%', :currentSite,'%')
                      AND f.Test_name=:instrument
                      AND f.CommentID NOT LIKE 'DDE%'
                      AND f.Administration <> 'None'
                      $extra_where
                  ORDER BY RIGHT(f.CommentID, 6)",
            $params
        );
        $total_records_count = count($instrument_records);

        $params['currentSite_id'] = key($current_site);
        $current_count            = $db->pselectOne(
            "
                  SELECT count(*)
                  FROM (SELECT DISTINCT r.CommentID
                        FROM reliability as r
                            JOIN flag as f ON (r.CommentID=f.CommentID)
                            JOIN session as s ON (s.ID=f.SessionID)
                            JOIN candidate c ON (c.CandID=s.CandID)
                        WHERE r.CommentID LIKE CONCAT('%',:currentSite,'%')
                            AND r.Instrument=:instrument
                            $extra_where
                            AND r.reliability_center_id<>:currentSite_id
                            AND r.invalid = 'no'
                            AND s.Current_stage<>'Recycling Bin') as t",
            $params
        );

        if ($ratio > 1) {
            //safeguard
            $max = $total_records_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }

        for($i = 0; $i < $total_records_count && $current_count <= $max; $i += 2) {
            $commentID = $instrument_records[$i]["CommentID"];
            if(!$this->find_cID($commentID, $this->reliability_table)) {
                $db->insert(
                    'reliability',
                    array(
                        'CommentID'             => $instrument_records[$i]["CommentID"],
                        'reliability_center_id' => $reliability_sites_keys[$reliability_site_index],
                        'Instrument'            => $instrument,
                    )
                );
                $this->reliability_table[$instrument_records[$i]["CommentID"]] = $params['currentSite_id'];
                $current_count++;
            }
            $reliability_site_index = ($reliability_site_index + 1) % count($reliability_sites_keys);
        }
    }

    function within_site_flagging_per_visit($instrument, $ratio, $current_site, $db, $project, $visit)
    {
        $params = array();
        $params['currentSite'] = reset($current_site);
        $params['instrument']  = $instrument;
        $params['visit']       = $visit;

        $extra_where ="";
        if (!is_null($project) && $project!='') {
            $extra_where =" AND c.ProjectID = $project";
        }

        $instrument_records  = $db->pselect(
            "
                  SELECT f.CommentID
                  FROM flag as f
                        JOIN session as s ON (f.SessionID=s.ID)
                        JOIN candidate c ON (c.CandID=s.CandID)
                  WHERE f.Test_name=:instrument
                        AND s.Current_stage<>'Recycling Bin'
                        AND f.Data_entry='Complete'
                        AND f.CommentID LIKE CONCAT('%',:currentSite,'%')
                        AND f.CommentID NOT LIKE 'DDE%'
                        AND f.Administration <> 'None'
                        AND s.Visit_label=:visit
                        $extra_where
                  ORDER BY RIGHT(f.CommentID, 6)",
            $params
        );
        $total_records_count = count($instrument_records);

        $params['currentSite_id'] = key($current_site);
        $current_count            = $db->pselectOne(
            "
                  SELECT count(*)
                  FROM (SELECT DISTINCT r.CommentID
                        FROM reliability as r
                            JOIN flag as f ON (r.CommentID=f.CommentID)
                            JOIN session as s ON (s.ID=f.SessionID)
                            JOIN candidate c ON (c.CandID=s.CandID)
                        WHERE r.CommentID LIKE CONCAT('%', :currentSite ,'%')
                            AND r.Instrument=:instrument
                            AND s.Visit_label=:visit
                            $extra_where
                            AND r.reliability_center_id=:currentSite_id
                            AND r.invalid = 'no'
                            AND s.Current_stage<>'Recycling Bin') as t",
            $params
        );

        if ($ratio > 1) {
            //safeguard
            $max = $total_records_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }

        for($i = 0; $i < $total_records_count && $current_count <= $max; $i += 2) {
            $commentID = $instrument_records[$i]["CommentID"];
            if(!$this->find_cID($commentID, $this->reliability_table)) {
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

    function cross_site_flagging_per_visit($instrument, $ratio=0.1, $current_site, $db, $project, $visit, $targetID)
    {
        $siteList = Utility::getSiteList();
        $reliability_site_index = 0;

        //check for a specific target ID
        //IF null shuffle through current study sites
        //ELSE use target only
        if (is_null($targetID) || $targetID=="") {
            // We want the site to be random, starting from 0 causes a bias towards the first entry
            // in $reliability_sites.. so shuffle the array to eliminate the bias
            unset($siteList[key($current_site)]);
            $reliability_sites_keys = array_keys($siteList);
            shuffle($reliability_sites_keys);
        } else {
            //TODO support for multiple site overrides
            $reliability_sites_keys = array($targetID);
        }

        $params = array();
        $params['currentSite'] = reset($current_site);
        $params['instrument']  = $instrument;
        $params['visit']       = $visit;

        $extra_where ="";
        if (!is_null($project) && $project!='') {
            $extra_where =" AND c.ProjectID = $project ";
        }

        $instrument_records  = $db->pselect(
            "
                  SELECT f.CommentID
                  FROM flag as f
                      JOIN session as s ON (f.sessionID=s.ID)
                      JOIN candidate c ON (c.CandID=s.CandID)
                  WHERE s.Current_stage<>'Recycling Bin'
                      AND f.Data_entry='Complete'
                      AND f.CommentID LIKE CONCAT('%', :currentSite,'%')
                      AND f.Test_name=:instrument
                      AND f.CommentID NOT LIKE 'DDE%'
                      AND f.Administration <> 'None'
                      AND s.Visit_label=:visit
                      $extra_where
                  ORDER BY RIGHT(f.CommentID, 6)",
            $params
        );
        $total_records_count = count($instrument_records);

        $params['currentSite_id'] = key($current_site);
        $current_count            = $db->pselectOne(
            "
                  SELECT count(*)
                  FROM (SELECT DISTINCT r.CommentID
                        FROM reliability as r
                            JOIN flag as f ON (r.CommentID=f.CommentID)
                            JOIN session as s ON (s.ID=f.SessionID)
                            JOIN candidate c ON (c.CandID=s.CandID)
                        WHERE r.CommentID LIKE CONCAT('%',:currentSite,'%')
                            AND r.Instrument=:instrument
                            AND s.Visit_label=:visit
                            $extra_where
                            AND r.reliability_center_id<>:currentSite_id
                            AND r.invalid = 'no'
                            AND s.Current_stage<>'Recycling Bin') as t",
            $params
        );

        if ($ratio > 1) {
            //safeguard
            $max = $total_records_count;
        } else {
            $max = floor($ratio * $total_records_count);
        }

        for($i = 0; $i < $total_records_count && $current_count <= $max; $i += 2) {
            $commentID = $instrument_records[$i]["CommentID"];
            if(!$this->find_cID($commentID, $this->reliability_table)) {
                $db->insert(
                    'reliability',
                    array(
                        'CommentID'             => $instrument_records[$i]["CommentID"],
                        'reliability_center_id' => $reliability_sites_keys[$reliability_site_index],
                        'Instrument'            => $instrument,
                    )
                );
                $this->reliability_table[$instrument_records[$i]["CommentID"]] = $params['currentSite_id'];
                $current_count++;
            }
            $reliability_site_index = ($reliability_site_index + 1) % count($reliability_sites_keys);
        }
    }

    //TODO NOT USED ????
    /*
    function get_current_index($instrument, $current_site, $reliability_sites, $db){
        $site_name = array_flip($this->site_id);
        $params = array();
        $params['currentSite'] = $current_site;
        $params['instrument'] = $instrument;
        $params['currentSite_id']= NDB_Menu_Filter_reliability::getSiteID($current_site);
        $last_site = $db->pselectOne("
                        SELECT reliability_center_id
                        FROM reliability
                        WHERE ID=(SELECT max(ID)
                                  FROM reliability
                                  WHERE CommentID LIKE CONCAT('%',:currentSite,'%')
                                      AND Instrument=:instrument
                                      AND reliability_center_id<>:currentSite_id)",
            $params);
        if(empty($last_site)){
            return 0;
        }
        else{
            return (array_search($site_name[$last_site], $reliability_sites) + 1) % count($reliability_sites);
        }
    }
    */
    function _swap_candidates()
    {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        if (!($user->hasPermission('reliability_swap_candidates'))) {
            return array("error" => "You do not have permission to swap candidates");
        }
        $DB            =& Database::singleton();
        $params        = array();
        $params['pid'] = $_POST['Cand1PSCID'];
        $params['measure'] = $_POST['SwapInstrument'];
        $params['id_V']    = $_POST['Cand1Visit_label'];
        $params_new        = array();
        $params_new['id_Replace']  = $_POST['Cand2PSCID'];
        $params_new['id_replaceV'] = $_POST['Cand2Visit_label'];

        //get the candidate to swap out
        $query ="
              SELECT r.CommentID as OldID,
                  r.reliability_center_id as CenterID,
                  r.Reliability_score as Score,
                  c.CenterID as OldCenterID
              FROM candidate c
                  JOIN session s ON (s.CandID = c.CandID)
                  JOIN flag f ON (f.SessionID = s.ID)
                  JOIN reliability r ON ( r.CommentID=f.CommentID)
              WHERE c.PSCID=:pid
                  AND r.Instrument=:measure
                  AND s.Visit_label=:id_V
                  AND f.Data_entry IS NOT NULL
                  AND f.Data_entry <> 'None'";

        $CommentID = $DB->pselectRow($query, $params);
        //if candidate is not in table return an error
        if(!$CommentID) {
            return array(
                'error' => $params_new['id_Replace']."/".
                    $params_new['id_replaceV']." did not complete ".
                    $params['measure']." or data not entered. Cannot swap candidates.",
            );

        }
        $params_new['Instrument'] = $_POST['SwapInstrument'];
        //get candidate to swap in
        $query        ="
              SELECT f.CommentID as NewID,
                  c.CenterID as NewCenterID
              FROM session s
                  JOIN flag f ON (f.SessionID=s.ID)
                  JOIN candidate c ON (c.CandID=s.CandID)
              WHERE f.Test_name=:Instrument
              AND c.PSCID=:id_Replace
              AND s.Visit_label=:id_replaceV
              AND f.Data_entry IS NOT NULL
              AND f.Data_entry <> 'None'";
        $newCommentID = $DB->pselectRow($query, $params_new);
        //if candidate does not have entry for instrument return with error
        if(!$newCommentID) {
            $error_msg =    $params_new['id_Replace']."/".
                $params_new['id_replaceV']." did not complete ".
                $params_new['Instrument']." or data not entered. Cannot swap ".
                "candidates.";
            return array('error' => $error_msg);
        }
        //check if both candidates are from the same site
        //check if examiner is from the same site as candidates to swap
        if($newCommentID['NewCenterID'] !== $CommentID['OldCenterID']) {
            return array('error' => "Candidates are not from the same site. ".
                "Cannot swap candidates across sites.");
        }
        elseif($user->getCenterID() != $newCommentID['NewCenterID']) {
            $error_msg = $params_new['id_Replace'].
                "/".
                $params_new['id_replaceV'].
                " is from a different site than you. Can only swap candidates ".
                "from the same site.";
            return array('error' => $error_msg);
        }
        elseif($user->getCenterID() != $CommentID['OldCenterID']) {
            $error_msg = $params_new['id_Replace'].
                "/".
                $params_new['id_replaceV'].
                " is from a different site than you. Can only swap candidates ".
                "from the same site.";
            return array('error' => $error_msg);
        }
        $value            = array('NewID' => $newCommentID['NewID']);
        $replacementCheck = $DB->pselectRow(
            "
              SELECT CommentID
              FROM reliability
              WHERE CommentID=:NewID",
            $value
        );
        //check if the reliability table already has the candidate being swapped in
        if(!empty($replacementCheck)) {
            $error_msg = $params_new['id_Replace'].
                "/".
                $params_new['id_replaceV'].
                " already in reliability. Cannot swap ".
                $params['pid'].
                "/".
                $params['id_V'].
                " for it";
            return array('error' => $error_msg);
        }
        //check if a reliability score has already been given to the candidate being swapped out
        $CenterID = $CommentID['CenterID'];
        if(!empty($CommentID['Score'])) {
            return array(
                "error" => "Reliability score already exists for ".
                    $params['pid'].
                    "/".
                    $params['id_V'].
                    " Can not swap candidate.",
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
        $DB->update(
            'reliability',
            $values,
            $where_criteria
        );

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
            "message" => "Swapped candidate ".
                $params['pid'].
                " for ".
                $params_new['id_Replace'],
        );
    }

    function _addCandidate()
    {
        $user =& User::singleton();
        $DB   =& Database::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: " . $user->getMessage());
        }
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
            return array("error" => "You must specify a center for reliability testing");
        }

        $CommentID = $DB->pselectOne(
            "
            SELECT CommentID
            FROM flag f
                JOIN session s ON (s.ID=f.SessionID)
                JOIN candidate c USING (CandID)
            WHERE f.Test_name=:Instrument
                AND c.PSCID=:PSCID
                AND s.Visit_label=:Visit_label",
            $params
        );
        if (!$CommentID) {
            $error_msg = $params['PSCID'] .
                "/" .
                $params['Visit_label'] .
                " does not have data entered for " .
                $params['Instrument'];
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
            "message" => "Inserted new reliability candidate " .
                $params['PSCID'] .
                "/" .
                $params['Visit_label'],
        );
    }


    function map_cIDs($array)
    {
        $new_array = array();
        for($i = 0; $i < count($array); $i++){
            $element = $array[$i];
            $new_array[$element['CommentID']] = $element['reliability_center_id'];
        }
        return $new_array;
    }

    function find_cID($cID, $array)
    {
        if(empty($array)) {
            return false;
        }
        foreach($array as $key=>$value){
            if($key == $cID) {
                return true;
            }
        }
        return false;
    }
    static function getSiteID($site)
    {
        $siteList = Utility::getSiteList(false);
        foreach($siteList as $id=>$name){
            $site_id[$name] = $id;
        }
        $id = $site_id[$site];
        return $id;
    }
    /**
     * function getting the list of all instruments involved in the reliability module
     *
     * @return array rows of the reliability_instruments table
     */
    static function getReliabilityInstruments()
    {
        $DB =& Database::singleton();

        $query = "
            SELECT *
            FROM reliability_instruments ri
                JOIN test_names t ON t.ID = ri.TestID";

        $result = $DB->pselect($query, array());
        // fix the array

        return $result;
    }
    /**
     * function getting the test name associated with a test ID
     *
     * @param $testID Id of the test for which the name is wanted
     *
     * @return array rows of the reliability_instruments table
     */
    static function getTestName($testID)
    {
        $DB    =& Database::singleton();
        $query = "SELECT Test_name FROM test_names WHERE ID=:ID";

        $result = $DB->pselectOne($query, array('ID' => $testID));

        return $result;
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
            )
        );
    }
}
?>
