<?php
/**
 * The welcome menu
 *
 * @package main
 */
class NDB_Form_statistics extends NDB_Form
{
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

    function render_stats_table($header, $subcats, $visits, $dropdown_name, $dropdown_opt, $dropdown_selected, $centres, $data, $Subsection="",$projectID=null)
    {
        $tpl_data = array();
        $tpl_data['test_name']  = $_REQUEST['test_name'];
        $tpl_data['Subsection'] = $Subsection;
        $tpl_data['Visits']     = $visits;
        $smarty = new Smarty_neurodb("statistics");
        $tpl_data['Header']           = $header;
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
                $tpl_data['data'][$vl][$subcat]           += $row['val'];
                $tpl_data['data'][$vl]['total']           += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$vl][$subcat] = $row['val'];
                $tpl_data['data']['Cat' . $subcat] += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$subcat] += $row['val'];
                $tpl_data['data']['C' . $center][$vl][$subcat]      += $row['val'];
                $tpl_data['data'][$subproj]['total']      += $row['val'];
                $tpl_data['data']['C' . $center][$subcat] += $row['val'];
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
        $DB =& Database::singleton();

        //if table is not in database handle by displaying error message
        $this->tpl_data['mri_table_exists'] = true;
        if (!$DB->tableExists('mri_parameter_form')) {
            $this->tpl_data['mri_table_exists'] = false;
            return;
        }

        $this->tpl_data['showTable'] = true;

        //PROJECTS
        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        $currentProject = null;
        if(isset($_REQUEST['DemographicProject']) && $_REQUEST['DemographicProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' .
                $_REQUEST['DemographicProject'] . ')';
            $currentProject        = $_REQUEST['DemographicProject'];
            $this->tpl_data['CurrentProject'] = array(
                'ID'   => $currentProject,
                'Name' => $projects[$currentProject],
            );
        } else {
            $ExtraProject_Criteria = '';
        }

        //SUBPROJECTS
        $subprojList ="";
        $subprojects = Utility::getSubprojectsForProject($currentProject);
        foreach($subprojects as $key=>$val) {
            $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);

        //SITES
        if(isset($_REQUEST['DemographicSite']) && $_REQUEST['DemographicSite'] != '') {
            $ExtraSite_Criteria = 'AND (c.CenterID=' .
                $_REQUEST['DemographicSite'] . ')';
        } else {
            $ExtraSite_Criteria = '';
        }
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
        $sites[null]="All sites";
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

        $this->tpl_data['Sites']   = $sites;
        $this->tpl_data['Projects'] = $projects;
        $this->tpl_data['Subprojects'] = $subprojects;
        $this->tpl_data['Visits'] = $Visits;


        //REGISTERED CANDIDATES ROW
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.CenterID <> '1'
                          AND c.PSCID <> 'scanner'
                          $ExtraSite_Criteria
                          $ExtraProject_Criteria
                      GROUP BY s.subprojectid",
            array()
        );

        foreach($result as $row) {
            $this->tpl_data['registered'][$row['rowid']] = $row['val'];
            $this->tpl_data['registered']['total'] += $row['val'];
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
                          $ExtraSite_Criteria
                          $ExtraProject_Criteria
                      GROUP BY s.subprojectid",
            array()
        );

        foreach($result as $row) {
            $this->tpl_data['ps_active'][$row['rowid']] = $row['val'];
            $this->tpl_data['ps_active']['total'] += $row['val'];
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
                          $ExtraSite_Criteria
                          $ExtraProject_Criteria
                      GROUP BY s.subprojectid",
            array()
        );

        foreach($result as $row) {
            $this->tpl_data['ps_inactive'][$row['rowid']] = $row['val'];
            $this->tpl_data['ps_inactive']['total'] += $row['val'];
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
                          $ExtraSite_Criteria
                          $ExtraProject_Criteria
                      GROUP BY s.subprojectid",
            array()
        );

        foreach($result as $row) {
            $this->tpl_data['gender_male'][$row['rowid']] = $row['val'];
            $this->tpl_data['gender_male']['total'] += $row['val'];
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
                          $ExtraSite_Criteria
                          $ExtraProject_Criteria
                      GROUP BY s.subprojectid",
            array()
        );

        foreach($result as $row) {
            $this->tpl_data['gender_female'][$row['rowid']] = $row['val'];
            $this->tpl_data['gender_female']['total'] += $row['val'];
        }

        //START BIG TABLE
        $instruments = array_merge(
            array( '' => 'Recruit Gender Breakdown'),
            Utility::getAllInstruments()
        );

        $this->tpl_data['all_instruments'] = Utility::getAllInstruments();
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
                    JOIN $_REQUEST[DemographicInstrument] i USING(CommentID)
                WHERE s.Active='Y'
                    AND c.CenterID <> '1'
                    AND f.Data_entry='Complete'
                    AND f.Administration='All'
                    AND f.CommentID NOT LIKE 'DDE%'
                    $ExtraProject_Criteria
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                UNION
                SELECT count(*) as val, 'Incomplete' as Subcat,
                    c.CenterID as CenterID,
                    s.SubprojectID as SubprojectID,
                    s.visit_label as VLabel
                FROM session s JOIN candidate c USING(CandID)
                    JOIN flag f ON (f.SessionID=s.ID)
                    JOIN $_REQUEST[DemographicInstrument] i USING(CommentID)
                WHERE s.Active='Y' AND s.CenterID <> 1
                    $ExtraProject_Criteria
                    AND f.CommentID NOT LIKE 'DDE%'
                    AND (f.Data_entry IS NULL OR f.Data_entry <> 'Complete')
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                ",
                array()
            );
            $this->tpl_data['RecruitsTable'] = $this->render_stats_table(
                "Data Entry Completion Status for $_REQUEST[DemographicInstrument]",
                $Subcategories,
                $Visits,
                "DemographicInstrument",
                $instruments,
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
                    AND s.SubprojectID IN ($subprojList))
                    AND COALESCE(s.Screening,'') NOT IN ('Failure', 'Withdrawal')
                    AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat",
                array()
            );
            $this->tpl_data['RecruitsTable'] = $this->render_stats_table(
                "Breakdown of Registered Candidates",
                $Subcategories,
                $Visits,
                "DemographicInstrument",
                $instruments,
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
        $DB =& Database::singleton();

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
        $this->tpl_data['Sites']   = array('' => 'All Sites');

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
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID='
                . $_REQUEST['BehaviouralProject'] . ')';
            $currentProject        = $_REQUEST['BehaviouralProject'];
            $this->tpl_data['CurrentProject'] = array(
                'ID'   => $currentProject,
                'Name' => $projects[$currentProject],
            );
        } else {
            $ExtraProject_Criteria = '';
        }
        $subprojects = Utility::getSubprojectsForProject($currentProject);

        $this->tpl_data['Subprojects'] = $subprojects;
        foreach($subprojects as $key=>$val) {
            $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);
        $config      = NDB_Config::singleton();

        $Visits = Utility::getExistingVisitLabels($currentProject);
        $this->tpl_data['Visits'] = $Visits;

        //---- BEHAVIORAL STATS -----
        $mri_data = array();
        $result   = $DB->pselect(
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
                GROUP by s.ID, s.CenterID, VLabel, f.Data_Entry",
            array()
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
                AND (f.Test_name NOT LIKE '%parameter%' 
                    AND f.Test_name NOT LIKE '%radiological%' 
                    AND f.Test_name NOT LIKE '%vineland%')
                $ExtraProject_Criteria
                GROUP BY s.CenterID, VLabel, f.Data_Entry ORDER BY c.PSCID;",
            array()
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
        $DB =& Database::singleton();

        //if table is not in database handle by displaying error message
        $this->tpl_data['mri_table_exists'] = true;
        if (!$DB->tableExists('mri_parameter_form')) {
            $this->tpl_data['mri_table_exists'] = false;
            return;
        }

        $this->tpl_data['showTable'] = true;

        //PROJECTS
        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        $currentProject = null;
        if(isset($_REQUEST['MRIProject']) && $_REQUEST['MRIProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' .
                $_REQUEST['MRIProject'] . ')';
            $currentProject        = $_REQUEST['MRIProject'];
            $this->tpl_data['CurrentProject'] = array(
                'ID'   => $currentProject,
                'Name' => $projects[$currentProject],
            );
        } else {
            $ExtraProject_Criteria = '';
        }

        //SUBPROJECTS
        $subprojList ="";
        $subprojects = Utility::getSubprojectsForProject($currentProject);
        foreach($subprojects as $key=>$val) {
            $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);

        //SITES
        if(isset($_REQUEST['MRIsite']) && $_REQUEST['MRIsite'] != '') {
            $ExtraSite_Criteria = 'AND (c.CenterID=' .
                $_REQUEST['MRIsite'] . ')';
        } else {
            $ExtraSite_Criteria = '';
        }
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
        $sites[null]="All sites";
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
        //TODO: IBIS
        $scan_types       = array(
            'T1'           => 'T1',
            'T2'           => 'T2',
            'DTI'          => 'DTI',
            'BOLD'         => 'BOLD',
            'Spectroscopy' => 'Spectroscopy',
        );
        $scans_selected=array();
        if(isset($_REQUEST['Scans']) && $_REQUEST['Scans'] != '')
        {
            $scans_selected = explode(",",$_REQUEST['Scans']);
        }
        if (empty($scans_selected))
        {
            $scans_selected=$scan_types;
        }

        $Visits = Utility::getExistingVisitLabels($currentProject);
        $this->tpl_data['scan_types'] = $scan_types;
        $this->tpl_data['Scans_selected'] = $scans_selected;
        $this->tpl_data['Sites']   = $sites;
        $this->tpl_data['Projects'] = $projects;
        $this->tpl_data['Subprojects'] = $subprojects;
        $this->tpl_data['Visits'] = $Visits;

        //START BIG TABLE
        $MRISubcategories = array(
            'Complete',
            'Partial Run',
            'No Scan',
        );

        //Check if a specific scan is requested otherwise display first
        //available scan
        if(!$_REQUEST['mri_type']) {
            $_REQUEST['mri_type'] = current($scan_types);
        }

        $MRI_Type       = $_REQUEST['mri_type'];
        $MRI_Type_Field = $_REQUEST['mri_type'] . "_Scan_Done";
        $MRIHeader      = "$MRI_Type Breakdown";
        $CaseStatement = "
                          CASE($MRI_Type_Field)
                          WHEN 'Partial' THEN 'Partial Run'
                          WHEN 'No' THEN 'No Scan'
                          ELSE $MRI_Type_Field
                          END";

        $result   = $DB->pselect(
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
              GROUP BY Subcat,
                    s.SubprojectID,
                    c.CenterID,
                    s.Visit_label",
            array()
        );

        $M_Visits = Utility::getExistingVisitLabels($currentProject);
        $this->tpl_data['MRI_Done_Table'] = $this->render_stats_table(
            $MRIHeader,
            $MRISubcategories,
            $M_Visits,
            "mri_type",
            $scan_types,
            $MRI_Type,
            $centers,
            $result,
            "mri",
            $currentProject
        );
        //END BIGTABLE


        //considers the naming convention of mri_parameter_form is "scanType_scan_done"
        $Scan_data_results=array();
        foreach ($scans_selected as $key => $scan) {
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
                    $ExtraSite_Criteria
                ",
                array()
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
                    $ExtraSite_Criteria
                GROUP BY s.SubprojectID",
                array()
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
                    $ExtraSite_Criteria
                ",
                array()
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
                    $ExtraSite_Criteria
                GROUP BY s.SubprojectID",
                array()
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
                    $ExtraSite_Criteria
                ",
                array()
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
                    AND s.SubprojectID IN ($subprojList)
                    $ExtraProject_Criteria
                    $ExtraSite_Criteria
                GROUP BY s.SubprojectID",
                array()
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
        $DB      =& Database::singleton();
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
        $this->tpl_data['Sites']   = array('' => 'All Sites');
        $projects[null]            = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        $this->tpl_data['Projects'] = $projects;
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if($_REQUEST['ReliabilitySite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array(
                    'ID'   => $row['NumericID'],
                    'Name' => $row['LongName'],
                );
            }
        }
        if(isset($_REQUEST['ReliabilityProject']) && $_REQUEST['ReliabilityProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' . $_REQUEST['ReliabilityProject'] . ')';
            $currentProject        = $_REQUEST['ReliabilityProject'];
            $this->tpl_data['CurrentProject'] = array(
                'ID'   => $currentProject,
                'Name' => $projects[$currentProject],
            );
        } else {
            $ExtraProject_Criteria = '';
        }

        if($_REQUEST['ReliabilityProject'] == $row['NumericID']) {
            $this->tpl_data['CurrentProject'] = array(
                'ID'   => $row['NumericID'],
                'Name' => $row['LongName'],
            );
        }
        $this->tpl_data['reliability_completion'] = $this->getReliabilityData();
    }

    function getReliabilityData()
    {
        // Whether something is reliable or not isn't stored in the database,
        // but calculated on the fly.
        // As a result, we need to manually calculate it and maintain for each
        // type of thing Tanya wants stats for here separately

        // Thresholds was copy/pasted from
        include_once __DIR__ . "/../../reliability/php/NDB_Menu_Filter_reliability.class.inc";
        $thresholds = NDB_Menu_Filter_Reliability::getThreshholds();

        $config      = NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $tests = array();

        foreach(Utility::toArray($reliabilityConfig) AS $reliabilityInstrument){
            $instrument_list = $reliabilityInstrument['Instrument'];
            foreach($instrument_list AS $instrument){
                $tests[$instrument['Testname']] = $instrument['Displayname'];
            }
        }

        $within_cross = array(
            'adi_r_subject',
            'ados_module1',
            'ados_module2',
            'aosi',
            'csbs',
        );

        $reliable        = array();
        //$within_reliable = array();
        //$across_reliable = array();
        foreach($tests as $inst => $name) {
            $reliable[] = $this->_getSingleReliabilityData(
                $name,
                $inst,
                $thresholds[$inst]
            );
        }

        //return array_merge($across_reliable, $within_reliable);
        return array_merge($reliable);
    }
    function _getSingleReliabilityData($name, $inst_name, $cutoff, $extra_where = '')
    {
        if(isset($_REQUEST['ReliabilitySite']) && $_REQUEST['ReliabilitySite'] != '') {
            $extra_where .= ' AND c.CenterID=' . $_REQUEST['ReliabilitySite'];
        }
        if(isset($_REQUEST['ReliabilityProject']) && $_REQUEST['ReliabilityProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' . $_REQUEST['ReliabilityProject'] . ')';
        } else {
            $ExtraProject_Criteria = '';
        }

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
                                              $extra_where
                                              $ExtraProject_Criteria",
            array()
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
                                              $extra_where
                                              $ExtraProject_Criteria",
            array()
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
                                              $extra_where
                                              $ExtraProject_Criteria",
            array()
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
