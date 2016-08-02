<?php
/**
 * The welcome menu
 *
 * @package main
 */
class NDB_Form_statistics extends NDB_Form
{
    var $params = array();

    function _hasAccess()
    {
        $user =& User::singleton();
        return $user->hasPermission('data_entry');
    }

    function _inCenter($centerID, $Centres)
    {
        foreach ($Centres as $Centre) {
            if($Centre['NumericID'] == $centerID) {
                return true;
            }
        }
        return false;
    }

    function render_stats_table($sectionHeader, $tableHeader, $disclamer='', $subcats, $visits, $dropdown_name, $dropdown_opt, $dropdown_selected, $centres, $data, $Subsection="",$projectID=null)
    {
        $tpl_data = array();
        $tpl_data['test_name']  = $_REQUEST['test_name'];
        $tpl_data['Subsection'] = $Subsection;
        $tpl_data['Visits']     = $visits;
        $smarty = new Smarty_neurodb("statistics");
        $tpl_data['SectionHeader']    = $sectionHeader;
        $tpl_data['TableHeader']      = $tableHeader;
        $tpl_data['Disclamer']        = $disclamer;
        $tpl_data['Subcategories']    = $subcats;
        $tpl_data['Subprojects']      = Utility::getSubprojectsForProject($projectID);
        $tpl_data['DropdownName']     = $dropdown_name;
        $tpl_data['DropdownOptions']  = $dropdown_opt;
        $tpl_data['DropdownSelected'] = $dropdown_selected;
        $tpl_data['Centers']          = $centres;
        foreach($data as $row) {
            $subproj = $row['SubprojectID'];
            $vl      = $row['VLabel'];
            $subcat  = $row['Subcat'];
            $center  = $row['CenterID'];

            if(array_search($vl, $visits) !== false
                && array_search($subcat, $subcats) !== false
                && $this->_inCenter($center, $centres) !== false
            ) {
                $tpl_data['data'][$subproj][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$subproj][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj][$subcat]      += $row['val'];
                $tpl_data['data'][$subproj]['total']      += $row['val'];
                $tpl_data['data'][$vl][$subcat]           += $row['val'];
                $tpl_data['data'][$vl]['total']           += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$vl][$subcat]  = $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$subcat]      += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center]['total']      += $row['val'];
                $tpl_data['data']['C' . $center][$vl][$subcat]           += $row['val'];
                $tpl_data['data']['C' . $center][$vl]['total']           += $row['val'];
                $tpl_data['data']['C' . $center][$subcat] += $row['val'];
                $tpl_data['data']['C' . $center]['total'] += $row['val'];
                $tpl_data['data'][$subcat] += $row['val'];
                $tpl_data['data']['total'] += $row['val'];
            }

        }
        $smarty->assign($tpl_data);
        $html = $smarty->fetch("table_statistics.tpl");
        return $html;

    }

    function statistics()
    {
        $DB =& Database::singleton();
        $this->tpl_data['StatsTabs'] = $DB->pselect(
            "SELECT ModuleName, SubModuleName, Description
                 FROM StatisticsTabs
                 ORDER BY OrderNo",
            array()
        );

    }

    function stats_general()
    {
        //$DB =& Database::singleton();
    }

    function stats_demographic()
    {
        $DB          =& Database::singleton();
        $config      = NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        $this->tpl_data['useProjects'] = $useProjects;
        //This boolean is for optional use by project if the demographics table
        // queries any information from the mri_parameter_form table
        $this->tpl_data['mri_table_exists'] = true;
        if (!$DB->tableExists('mri_parameter_form')) {
            $this->tpl_data['mri_table_exists'] = false;
            //return;
        }

        $this->tpl_data['showTable'] = true;

        //PROJECTS
        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        $currentProject = null;
        if(isset($_REQUEST['DemographicProject']) && $_REQUEST['DemographicProject'] != '') {
            $currentProject = $_REQUEST['DemographicProject'];
            $this->tpl_data['CurrentProject'] = array(
                                                 'ID'   => $currentProject,
                                                 'Name' => $projects[$currentProject],
                                                );
            $Param_Project       ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid'] =$_REQUEST['DemographicProject'];
        } else {
            $Param_Project ='';
        }

        //SUBPROJECTS
        $subprojList ="";
        $subprojects = Utility::getSubprojectsForProject($currentProject);
        foreach($subprojects as $key=>$val) {
            $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);
        if(!empty($subprojList)) {
            $suproject_query ="AND s.SubprojectID IN ($subprojList)";
        } else {
            $suproject_query ='';
        }

        //SITES
        if(isset($_REQUEST['DemographicSite']) && $_REQUEST['DemographicSite'] != '') {
            $Param_Site          ='AND (c.CenterID IS NULL OR c.CenterID=:sid) ';
            $this->params['sid'] =$_REQUEST['DemographicSite'];
        } else {
            $Param_Site = '';
        }
        $centers     = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    PSCArea as LongName,
                    Name as ShortName
              FROM psc
              WHERE CenterID <> '1'
                AND Study_site = 'Y'",
            array()
        );
        $sites[null] ="All sites";
        foreach ($centers as $row) {
            $sites[$row['NumericID']] = $row['ShortName'];
            if($_REQUEST['DemographicSite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array(
                                                  'ID'   => $row['NumericID'],
                                                  'Name' => $row['LongName'],
                                                 );
            }
        }

        $Visits = Utility::getExistingVisitLabels($currentProject);

        $this->tpl_data['Sites']       = $sites;
        $this->tpl_data['Projects']    = $projects;
        $this->tpl_data['Subprojects'] = $subprojects;
        $this->tpl_data['Visits']      = $Visits;

        //REGISTERED CANDIDATES ROW
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.CenterID <> '1'
                          AND c.PSCID <> 'scanner'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach($result as $row) {
            $this->tpl_data['registered'][$row['rowid']] = $row['val'];
            $this->tpl_data['registered']['total']      += $row['val'];
        }

        //PARTICIPANT STATUS ACTIVE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.CenterID <> '1'
                          AND c.PSCID <> 'scanner'
                          AND c.Active='Y'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach($result as $row) {
            $this->tpl_data['ps_active'][$row['rowid']] = $row['val'];
            $this->tpl_data['ps_active']['total']      += $row['val'];
        }

        //PARTICIPANT STATUS INACTIVE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.CenterID <> '1'
                          AND c.PSCID <> 'scanner'
                          AND c.Active<>'Y'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach($result as $row) {
            $this->tpl_data['ps_inactive'][$row['rowid']] = $row['val'];
            $this->tpl_data['ps_inactive']['total']      += $row['val'];
        }

        //MALE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.CenterID <> '1'
                          AND c.PSCID <> 'scanner'
                          AND c.Active='Y'
                          AND c.Gender='Male'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach($result as $row) {
            $this->tpl_data['gender_male'][$row['rowid']] = $row['val'];
            $this->tpl_data['gender_male']['total']      += $row['val'];
        }
        //FEMALE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.CenterID <> '1'
                          AND c.PSCID <> 'scanner'
                          AND c.Active='Y'
                          AND c.Gender='Female'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach($result as $row) {
            $this->tpl_data['gender_female'][$row['rowid']] = $row['val'];
            $this->tpl_data['gender_female']['total']      += $row['val'];
        }

        //AGE AVERAGE
        $result = $DB->pselect(
            "SELECT DISTINCT
                          s.subprojectid as rowid,
                          AVG(DATEDIFF(c.Date_registered,c.DoB)) as age
                      FROM candidate as c
                          JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.CenterID <> '1'
                          AND c.PSCID <> 'scanner'
                          AND c.Active='Y'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach($result as $row) {
            $this->tpl_data['age_avg'][$row['rowid']] = round($row['age']*12/365, 2);
        }

        //START BIG TABLE
        $inst_dropdown   = array_merge(
            array( '' => 'Recruit Breakdown by Sex'),
            Utility::getAllInstruments()
        );
        $instrument_list = Utility::getAllInstruments();
        $this->tpl_data['all_instruments'] = $instrument_list;
        if(isset($_REQUEST['DemographicInstrument']) && $_REQUEST['DemographicInstrument'] != '') {
            $Subcategories = array(
                              'Complete',
                              'Incomplete',
                             );
            $result        = $DB->pselect(
                "SELECT count(*) as val,
                    f.Data_entry as Subcat,
                    c.CenterID as CenterID,
                    s.SubprojectID as SubprojectID,
                    s.visit_label as VLabel
                FROM session s JOIN candidate c ON (s.CandID=c.CandID)
                    JOIN flag f ON (f.SessionID=s.ID)
                    JOIN ".$DB->escape($_REQUEST[DemographicInstrument])." i USING(CommentID)
                WHERE s.Active='Y'
                    AND c.CenterID <> '1'
                    AND f.Data_entry='Complete'
                    AND f.Administration='All'
                    AND f.CommentID NOT LIKE 'DDE%'
                    $Param_Project
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                UNION
                SELECT count(*) as val, 'Incomplete' as Subcat,
                    c.CenterID as CenterID,
                    s.SubprojectID as SubprojectID,
                    s.visit_label as VLabel
                FROM session s JOIN candidate c USING(CandID)
                    JOIN flag f ON (f.SessionID=s.ID)
                    JOIN ".$DB->escape($_REQUEST[DemographicInstrument])." i USING(CommentID)
                WHERE s.Active='Y' AND s.CenterID <> 1
                    $Param_Project
                    AND f.CommentID NOT LIKE 'DDE%'
                    AND (f.Data_entry IS NULL OR f.Data_entry <> 'Complete')
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                ",
                $this->params
            );
            $this->tpl_data['RecruitsTable'] = $this->render_stats_table(
                "Breakdown of Registered Candidates",
                "Data Entry Completion Status for ". $instrument_list[$_REQUEST['DemographicInstrument']],
                '',
                $Subcategories,
                $Visits,
                "DemographicInstrument",
                $inst_dropdown,
                $_REQUEST['DemographicInstrument'],
                $centers,
                $result,
                "demographics",
                $currentProject
            );
        } else {
            $Subcategories = array(
                              'Male',
                              'Female',
                             );
            $result        = $DB->pselect(
                "SELECT c.CenterID as CenterID,
                    s.SubprojectID as SubprojectID,
                    s.visit_label as VLabel,
                    c.gender as Subcat,
                    count(s.CandID) as val
                FROM session s JOIN candidate c ON (s.CandID=c.CandID)
                WHERE s.active='Y' AND s.CenterID <> '1'
                    AND (s.Current_stage IN ('Visit', 'Screening', 'Approval')
                    $suproject_query)
                    AND COALESCE(s.Screening,'') NOT IN ('Failure', 'Withdrawal')
                    AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat",
                array()
            );
            $this->tpl_data['RecruitsTable'] = $this->render_stats_table(
                "Breakdown of Registered Candidates",
                "Breakdown by Sex",
                '',
                $Subcategories,
                $Visits,
                "DemographicInstrument",
                $inst_dropdown,
                '',
                $centers,
                $result,
                "demographics",
                $currentProject
            );
        }
    }

    function stats_behavioural()
    {
        $DB          =& Database::singleton();
        $config      = NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        $this->tpl_data['useProjects'] = $useProjects;
        $subprojList ="";

        $centers = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    PSCArea as LongName,
                    Name as ShortName
              FROM psc
              WHERE CenterID <> '1'
                    AND Study_site = 'Y'",
            array()
        );

        $this->tpl_data['Centers'] = $centers;

        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key=>$value) {
            $projects[$key] = $value;
        }
        $this->tpl_data['Projects'] = $projects;
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if($_REQUEST['site'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array(
                                                  'ID'   => $row['NumericID'],
                                                  'Name' => $row['LongName'],
                                                 );
            }

        }

        if(isset($_REQUEST['BehaviouralProject'])
            && $_REQUEST['BehaviouralProject'] != ''
        ) {
            $currentProject = $_REQUEST['BehaviouralProject'];
            $this->tpl_data['CurrentProject'] = array(
                                                 'ID'   => $currentProject,
                                                 'Name' => $projects[$currentProject],
                                                );
            $Param_Project       ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid'] =$_REQUEST['BehaviouralProject'];
        } else {
            $Param_Project = '';
        }
        $subprojects = Utility::getSubprojectsForProject($currentProject);

        $this->tpl_data['Subprojects'] = $subprojects;
        foreach($subprojects as $key=>$val) {
            $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);
        if(!empty($subprojList)) {
            $suproject_query ="AND s.SubprojectID IN ($subprojList)";
        } else {
            $suproject_query ='';
        }

        $Visits = Utility::getExistingVisitLabels($currentProject);
        $this->tpl_data['Visits'] = $Visits;

        //---- BEHAVIORAL STATS -----
        $result = $DB->pselect(
            "SELECT s.CenterID,
                    f.Data_Entry as Data_Entry,
                    s.visit_label as VLabel,
                    COUNT(s.CandID) as val
                FROM session s JOIN candidate c ON (s.CandID=c.CandID)
                    JOIN flag f ON (f.SessionID=s.ID)
                WHERE 
                    s.Active='Y' AND c.Active='Y'
                    AND s.Current_stage <> 'Recycling Bin'
                    AND f.CommentID NOT LIKE 'DDE%'
                    $suproject_query
                    $Param_Project
                GROUP by s.ID, s.CenterID, VLabel, f.Data_Entry",
            $this->params
        );

        foreach($result as $row) {
            // Put some things into variables to make the lines shorter
            // so that they don't wrap. Note that "c"(enter array) needs to
            // be a reference since we'll be modifying it.
            $center = $row['CenterID'];
            $vl     = $row['VLabel'];
            $c      =& $this->tpl_data['behaviour']['C' . $center];

            $c[$vl]['total']   += $row['val'];
            $c['all']['total'] += $row['val'];
            if($row['Data_Entry'] == 'Complete') {
                $c[$vl]['complete']   += $row['val'];
                $c['all']['complete'] += $row['val'];
            }
            if($c[$vl]['total'] != 0) {
                $c[$vl]['percent'] =
                    floor($c[$vl]['complete'] / $c[$vl]['total']*100);
            }
            if($c['all']['total'] != 0) {
                $c['all']['percent'] =
                    floor($c['all']['complete'] / $c['all']['total']*100);
            }
        }
        // DDE STATS
        $result = $DB->pselect(
            "SELECT s.CenterID, 
                f.Data_Entry as Data_Entry, 
                s.visit_label as VLabel,
                COUNT(s.CandID) as val
                FROM session as s
                    JOIN candidate as c ON (s.CandID=c.CandID)
                    JOIN flag as f ON (f.SessionID=s.ID)
                WHERE s.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                AND f.CommentID LIKE 'DDE%' 
                AND c.Active='Y'
                $suproject_query
                $Param_Project
                GROUP BY s.CenterID, VLabel, f.Data_Entry ORDER BY c.PSCID;",
            $this->params
        );
        foreach($result as $row) {
            $center = $row['CenterID'];
            $vl     = $row['VLabel'];
            $c      =& $this->tpl_data['dde']['C' . $center];

            $c[$vl]['total']   += $row['val'];
            $c['all']['total'] += $row['val'];
            if($row['Data_Entry'] == 'Complete') {
                $c[$vl]['complete']   += $row['val'];
                $c['all']['complete'] += $row['val'];
            }
            if($c[$vl]['total'] != 0) {
                $c[$vl]['percent'] =
                    floor($c[$vl]['complete'] / $c[$vl]['total']*100);
            }
            if($c['all']['total'] != 0) {
                $c['all']['percent'] =
                    floor($c['all']['complete'] / $c['all']['total']*100);
            }
        }
    }

    function stats_MRI()
    {
        $DB          =& Database::singleton();
        $config      = NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        $this->tpl_data['useProjects'] = $useProjects;
        $bigTable_params =array();


        $this->tpl_data['showTable'] = true;

        //PROJECTS
        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        $currentProject = null;
        if(isset($_REQUEST['MRIProject']) && $_REQUEST['MRIProject'] != '') {
            $currentProject = $_REQUEST['MRIProject'];
            $this->tpl_data['CurrentProject'] = array(
                                                 'ID'   => $currentProject,
                                                 'Name' => $projects[$currentProject],
                                                );
            $Param_Project          ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid']    =$_REQUEST['MRIProject'];
            $bigTable_params['pid'] =$_REQUEST['MRIProject'];
        } else {
            $Param_Project = '';
        }

        //SUBPROJECTS
        $subprojList ="";
        $subprojects = Utility::getSubprojectsForProject($currentProject);
        foreach($subprojects as $key=>$val) {
            $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);
        if(!empty($subprojList)) {
            $suproject_query ="AND s.SubprojectID IN ($subprojList)";
        } else {
            $suproject_query ='';
        }
        //SITES
        if(isset($_REQUEST['MRIsite']) && $_REQUEST['MRIsite'] != '') {
            $Param_Site          ='AND (c.CenterID IS NULL OR c.CenterID=:sid) ';
            $this->params['sid'] =$_REQUEST['MRIsite'];
        } else {
            $Param_Site = '';
        }
        $centers     = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    PSCArea as LongName,
                    Name as ShortName
              FROM psc
              WHERE CenterID <> '1'
                AND Study_site = 'Y'",
            array()
        );
        $sites[null] ="All sites";
        foreach ($centers as $row) {
            $sites[$row['NumericID']] = $row['ShortName'];
            if($_REQUEST['MRIsite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array(
                                                  'ID'   => $row['NumericID'],
                                                  'Name' => $row['LongName'],
                                                 );
            }
        }

        //GET SCAN TYPES
        $Scan_type_results = $DB->pselect(
            "SELECT mst.ID, mst.Scan_type
              FROM mri_scan_type mst
                JOIN mri_protocol mp ON (mst.ID=mp.Scan_type)",
            array()
        );

        foreach ($Scan_type_results as $row) {
            $scan_types[$row['ID']] = $row['Scan_type'];
        }

        $scans_selected =array();
        if(isset($_REQUEST['Scans']) && $_REQUEST['Scans'] != '') {
            $scans_selected_input = explode(",", $_REQUEST['Scans']);
        }
        if (empty($scans_selected_input)) {
            $scans_selected =$scan_types;
        } else {
            foreach($scans_selected_input as $key => $scid)
            {
                $scans_selected[$scid] =$scan_types[$scid];
            }
        }

        $Visits = Utility::getExistingVisitLabels($currentProject);
        $this->tpl_data['scan_types']     = $scan_types;
        $this->tpl_data['Scans_sel_box']  = array_keys($scans_selected);
        $this->tpl_data['Scans_selected'] = $scans_selected;
        $this->tpl_data['Sites']          = $sites;
        $this->tpl_data['Projects']       = $projects;
        $this->tpl_data['Subprojects']    = $subprojects;
        $this->tpl_data['Visits']         = $Visits;

        //START BIG TABLE
        //if table is not in database handle by displaying error message
        $this->tpl_data['mri_table_exists'] = true;
        if (!$DB->tableExists('mri_parameter_form')) {
            $this->tpl_data['mri_table_exists'] = false;
            return;
        }
        $MRISubcategories = array(
                             'Complete',
                             'Partial Run',
                             'No Scan',
                            );

        //Check if a specific scan is requested otherwise display first
        //available scan
        if(!$_REQUEST['mri_type']) {
            $MRI_Type = current($scan_types);
        } else {
            $MRI_Type = $scan_types[$_REQUEST['mri_type']];
        }
        //TODO IBIS
        if ($MRI_Type==='t1w') {
            $MRI_Type ='T1';
        } elseif ($MRI_Type=='t2w') {
            $MRI_Type ='T2';
        } elseif ($MRI_Type=='dti') {
            $MRI_Type ='DTI';
        } elseif ($MRI_Type=='ep2d_bold') {
            $MRI_Type ='BOLD';
        } elseif ($MRI_Type=='DTI65' || $MRI_Type=='DTI65_B1000' ) {
            $MRI_Type ='Spectroscopy';
        }

        $MRI_Type_Field = $MRI_Type . "_Scan_Done";
        $MRIHeader      = "$MRI_Type Breakdown";
        $CaseStatement  = "
                          CASE($MRI_Type_Field)
                          WHEN 'Partial' THEN 'Partial Run'
                          WHEN 'No' THEN 'No Scan'
                          ELSE $MRI_Type_Field
                          END";

        $result = $DB->pselect(
            "SELECT s.SubprojectID,
                    c.CenterID,
                    s.Visit_label as VLabel,
                    $CaseStatement as Subcat,
                    COUNT(*) as val
              FROM mri_parameter_form m
                    JOIN flag f USING (CommentID)
                    JOIN session s ON (f.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
              WHERE s.Current_stage <> 'Recycling Bin'
                    AND f.Administration <> 'None'
                    AND s.Active='Y'
                    AND c.Active='Y'
                    AND f.CommentID NOT LIKE 'DDE%'
                    $suproject_query
                    $Param_Project
              GROUP BY Subcat,
                    s.SubprojectID,
                    c.CenterID,
                    s.Visit_label",
            $bigTable_params
        );

        $M_Visits = Utility::getExistingVisitLabels($currentProject);
        $this->tpl_data['MRI_Done_Table'] = $this->render_stats_table(
            "Breakdown By Scan Type",
            $MRIHeader,
            "",
            $MRISubcategories,
            $M_Visits,
            "mri_type",
            $scan_types,
            $_REQUEST['mri_type'],
            $centers,
            $result,
            "mri",
            $currentProject
        );
        //END BIGTABLE

        //considers the naming convention of mri_parameter_form is "scanType_scan_done"
        $Scan_data_results =array();
        foreach ($scans_selected as $key => $scan) {
            $scan_params = array_merge(array('scan' => $scan), $this->params);

            //INSERT COUNT TOTAL
            $Scan_data_results[$key]['insert_count']['total'] = $DB->pselectOne(
                "SELECT COUNT(*)
                FROM files fi
                    JOIN session s ON (fi.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                WHERE s.Current_stage <> 'Recycling Bin'
                    AND s.Active='Y'
                    AND c.Active='Y'
                    AND fi.FileType='mnc'
                    AND fi.File LIKE CONCAT('%_', :scan, '_%')
                    $suproject_query
                    $Param_Project
                    $Param_Site
                ",
                $scan_params
            );
            //INSERT COUNT Values
            $count_data = $DB->pselect(
                "SELECT s.SubprojectID as subID, COUNT(*) as cnt
                FROM files fi
                    JOIN session s ON (fi.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                WHERE s.Current_stage <> 'Recycling Bin'
                    AND s.Active='Y'
                    AND c.Active='Y'
                    AND fi.FileType='mnc'
                    AND fi.File LIKE CONCAT('%_', :scan, '_%')
                    $suproject_query
                    $Param_Project
                    $Param_Site
                GROUP BY s.SubprojectID",
                $scan_params
            );
            foreach ($count_data as $row){
                $Scan_data_results[$key]['insert_count'][$row['subID']] = $row['cnt'];
                //no_qc_count is computed by the difference between insertions
                // and the sum of passed qc and failed qc
                $Scan_data_results[$key]['no_qc_count'][$row['subID']] = $row['cnt'];
            }

            //QC STATUS: PASSED TOTAL
            $Scan_data_results[$key]['qc_pass_count']['total'] = $DB->pselectOne(
                "SELECT COUNT(*)
                FROM files_qcstatus fqc
                	JOIN files fi on (fi.FileID=fqc.FileID)
                    JOIN session s ON (fi.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                WHERE s.Current_stage <> 'Recycling Bin'
                    AND fqc.FileId IS NOT NULL
                    AND s.Active='Y'
                    AND c.Active='Y'
                    AND fqc.QCStatus='Pass'
                    AND fi.File LIKE CONCAT('%_', :scan, '_%')
                    $suproject_query
                    $Param_Project
                    $Param_Site
                ",
                $scan_params
            );
            //QC STATUS: PASSED values
            $count_data = $DB->pselect(
                "SELECT s.SubprojectID as subID, COUNT(*) as cnt
                FROM files_qcstatus fqc
                	JOIN files fi on (fi.FileID=fqc.FileID)
                    JOIN session s ON (fi.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                WHERE s.Current_stage <> 'Recycling Bin'
                    AND fqc.FileId IS NOT NULL
                    AND s.Active='Y'
                    AND c.Active='Y'
                    AND fqc.QCStatus='Pass'
                    AND fi.File LIKE CONCAT('%_', :scan, '_%')
                    $suproject_query
                    $Param_Project
                    $Param_Site
                GROUP BY s.SubprojectID",
                $scan_params
            );
            foreach ($count_data as $row){
                $Scan_data_results[$key]['qc_pass_count'][$row['subID']] = $row['cnt'];
                //no_qc_count is computed by the difference between insertions
                // and the sum of passed qc and failed qc
                $Scan_data_results[$key]['no_qc_count'][$row['subID']] =
                    $Scan_data_results[$key]['no_qc_count'][$row['subID']]-$row['cnt'];
            }

            //QC STATUS: FAILED TOTAL
            $Scan_data_results[$key]['qc_fail_count']['total'] = $DB->pselectOne(
                "SELECT COUNT(*)
                FROM files_qcstatus fqc
                	JOIN files fi on (fi.FileID=fqc.FileID)
                    JOIN session s ON (fi.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                WHERE s.Current_stage <> 'Recycling Bin'
                    AND fqc.FileId IS NOT NULL
                    AND s.Active='Y'
                    AND c.Active='Y'
                    AND fqc.QCStatus='Fail'
                    AND fi.File LIKE CONCAT('%_', :scan, '_%')
                    $suproject_query
                    $Param_Project
                    $Param_Site
                ",
                $scan_params
            );
            //QC STATUS: FAILED values
            $count_data = $DB->pselect(
                "SELECT s.SubprojectID as subID, COUNT(*) as cnt
                FROM files_qcstatus fqc
                	JOIN files fi on (fi.FileID=fqc.FileID)
                    JOIN session s ON (fi.SessionID=s.ID)
                    JOIN candidate c ON (c.CandID=s.CandID)
                WHERE s.Current_stage <> 'Recycling Bin'
                    AND fqc.FileId IS NOT NULL
                    AND s.Active='Y'
                    AND c.Active='Y'
                    AND fqc.QCStatus='Fail'
                    AND fi.File LIKE CONCAT('%_', :scan, '_%')
                    $suproject_query
                    $Param_Project
                    $Param_Site
                GROUP BY s.SubprojectID",
                $scan_params
            );
            foreach ($count_data as $row){
                $Scan_data_results[$key]['qc_fail_count'][$row['subID']] = $row['cnt'];
                //no_qc_count is computed by the difference between insertions
                // and the sum of passed qc and failed qc
                $Scan_data_results[$key]['no_qc_count'][$row['subID']] =
                    $Scan_data_results[$key]['no_qc_count'][$row['subID']]-$row['cnt'];
            }

            $Scan_data_results[$key]['no_qc_count']['total'] =
                $Scan_data_results[$key]['insert_count']['total'] -
                $Scan_data_results[$key]['qc_pass_count']['total'] -
                $Scan_data_results[$key]['qc_fail_count']['total'];
        }
        $this->tpl_data['scan_data_results'] = $Scan_data_results;

    } // End function



    //RELIABILITY
    function stats_reliability()
    {
        $DB          =& Database::singleton();
        $config      = NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        $this->tpl_data['useProjects'] = $useProjects;
        //PROJECTS
        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }

        if(isset($_REQUEST['ReliabilityProject']) && $_REQUEST['ReliabilityProject'] != '') {
            $currentProject = $_REQUEST['ReliabilityProject'];
            $this->tpl_data['CurrentProject'] = array(
                                                 'ID'   => $currentProject,
                                                 'Name' => $projects[$currentProject],
                                                );
            $Param_Project       ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid'] =$_REQUEST['ReliabilityProject'];
        } else {
            $Param_Project ='';
        }

        //SITES
        if(isset($_REQUEST['ReliabilitySite']) && $_REQUEST['ReliabilitySite'] != '') {
            $Param_Site          ='AND (c.CenterID IS NULL OR c.CenterID=:sid) ';
            $this->params['sid'] =$_REQUEST['ReliabilitySite'];
        } else {
            $Param_Site = '';
        }
        $centers     = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    PSCArea as LongName,
                    Name as ShortName
              FROM psc
              WHERE CenterID <> '1'
                AND Study_site = 'Y'",
            array()
        );
        $sites[null] ="All sites";
        foreach ($centers as $row) {
            $sites[$row['NumericID']] = $row['ShortName'];
            if($_REQUEST['ReliabilitySite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array(
                                                  'ID'   => $row['NumericID'],
                                                  'Name' => $row['LongName'],
                                                 );
            }
        }

        $this->tpl_data['Centers']  = $centers;
        $this->tpl_data['Projects'] = $projects;
        $this->tpl_data['Sites']    = $sites;

        $this->tpl_data['reliability_completion'] = $this->getReliabilityData($Param_Project, $Param_Site);
    }

    function getReliabilityData($Param_Project, $Param_Site)
    {
        // Whether something is reliable or not isn't stored in the database,
        // but calculated on the fly.
        // As a result, we need to manually calculate it and maintain for each
        // type of thing Tanya wants stats for here separately

        // Thresholds was copy/pasted from
        include_once __DIR__ . "/../../reliability/php/NDB_Menu_Filter_reliability.class.inc";
        $thresholds = NDB_Menu_Filter_Reliability::getThreshholds();

        $config            = NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $tests = array();

        foreach(Utility::toArray($reliabilityConfig) AS $reliabilityInstrument){
            $instrument_list = $reliabilityInstrument['Instrument'];
            foreach($instrument_list AS $instrument){
                $tests[$instrument['Testname']] = $instrument['Displayname'];
            }
        }

        $reliable = array();
        foreach($tests as $inst => $name) {
            $reliable[] = $this->_getSingleReliabilityData(
                $Param_Project,
                $Param_Site,
                $name,
                $inst,
                $thresholds[$inst]
            );
        }

        return array_merge($reliable);
    }
    function _getSingleReliabilityData($Param_Project, $Param_Site, $name, $inst_name, $cutoff)
    {
        $db          = Database::singleton();
        $ret         = array();
        $ret['name'] = $name;
        $ret['complete'] = $db->pselectOne(
            "SELECT count(*)
                                          FROM reliability r
                                              JOIN flag f USING(CommentID)
                                              JOIN session s ON (s.ID=f.SessionID)
                                              JOIN candidate c ON (c.CandID=s.CandID)
                                          WHERE Instrument='$inst_name'
                                              AND Invalid <> 'yes'
                                              AND Reliability_score IS NOT NULL
                                              AND c.CenterID <> 1
                                              $Param_Project
                                              $Param_Site",
            $this->params
        );

        $ret['reliable'] = $db->pselectOne(
            "SELECT count(*)
                                          FROM reliability r
                                              JOIN flag f USING(CommentID) JOIN session s ON (s.ID=f.SessionID)
                                              JOIN candidate c ON (c.CandID=s.CandID)
                                          WHERE Instrument='$inst_name'
                                              AND Invalid <> 'yes'
                                              AND Reliability_score IS NOT NULL
                                              AND Reliability_score > $cutoff
                                              AND c.CenterID <> 1
                                              $Param_Project
                                              $Param_Site",
            $this->params
        );

        $ret['total'] = $db->pselectOne(
            "SELECT count(*)
                                          FROM reliability r
                                              JOIN flag f USING(CommentID)
                                              JOIN session s ON (s.ID=f.SessionID)
                                              JOIN candidate c ON (c.CandID=s.CandID)
                                          WHERE Instrument='$inst_name'
                                              AND Invalid <> 'yes'
                                              AND c.CenterID <> 1
                                              $Param_Project
                                              $Param_Site",
            $this->params
        );

        if($ret['total'] == 0) {
            // These should probably be indeterminate instead of 0, but 0
            // looks cleaner.
            $ret['percent_complete'] = '0';
            $ret['percent_reliable'] = '0';
        } else {
            $ret['percent_complete'] = round($ret['complete'] / $ret['total'] * 100);
            $ret['percent_reliable'] = round($ret['reliable'] / $ret['total'] * 100);
        }
        return $ret;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the statistics menu
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
             $baseURL . "/statistics/js/table_statistics.js",
             $baseURL . "/statistics/js/statistics.js",
             $baseURL . "/statistics/js/form_stats_behavioural.js",
             $baseURL . "/statistics/js/form_stats_reliability.js",
             $baseURL . "/statistics/js/form_stats_MRI.js",
             $baseURL . "/statistics/js/form_stats_demographic.js",
            )
        );
    }
} // End class
?>
