<?php
require_once 'Utility.class.inc';
require_once 'NDB_Form.class.inc';
require_once 'NDB_Menu_Filter_reliability.class.inc';
require_once 'ProjectUtility.class.inc';

/**
 * The welcome menu
 * @package main
 */
class NDB_Form_statistics extends NDB_Form
{
    function _hasAccess() {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return $user->hasPermission('data_entry');
    }

    function _inCenter($centerID, $Centres) {
        foreach ($Centres as $Centre) {
            if($Centre['NumericID'] == $centerID) {
                return TRUE;
            }
        }
        return FALSE;
    }

    function render_stats_table($header, $subcats, $visits, $dropdown_name, $dropdown_opt, $dropdown_selected, $centres, $data, $Subsection="",$projectID=null) {
        $tpl_data = array();
        $tpl_data['test_name'] = $_REQUEST['test_name'];
        $tpl_data['Subsection'] = $Subsection;
        $tpl_data['Visits'] = $visits;
        $smarty = new Smarty_neurodb();
        $tpl_data['Header'] = $header;
        $tpl_data['Subcategories'] = $subcats;
        $tpl_data['Subprojects'] = Utility::getSubprojectsForProject($projectID);
        $tpl_data['DropdownName'] = $dropdown_name;
        $tpl_data['DropdownOptions'] = $dropdown_opt;
        $tpl_data['DropdownSelected'] = $dropdown_selected;
        $tpl_data['Centers'] = $centres;
        foreach($data as $row) {
            $subproj = $row['SubprojectID'];
            $vl = $row['VLabel'];
            $subcat = $row['Subcat'];
            $center = $row['CenterID'];


            if(array_search($vl, $visits) !== FALSE && array_search($subcat, $subcats) !== FALSE && $this->_inCenter($center, $centres) !== FALSE) {
                $tpl_data['data'][$subproj][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$subproj][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj][$subcat] += $row['val'];
                $tpl_data['data'][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$vl][$subcat] = $row['val'];
                $tpl_data['data']['Cat' . $subcat] += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$subcat] += $row['val'];
                $tpl_data['data']['C' . $center][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$subproj]['total'] += $row['val'];
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
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }
    }

    function stats_general()
    {
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }
    }

    function stats_behavioural()
    {
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }
        $DB->select("SELECT CONCAT('C', CenterID) as ID, CenterID as NumericID, PSCArea as LongName, Name as ShortName FROM psc WHERE CenterID IN (2, 3, 4, 5)", $centers);
        if(Utility::isErrorX($centers)) {
            return PEAR::raiseError("DB Error: ".$centers->getMessage());
        }
        $this->tpl_data['Centers'] = $centers;
        $this->tpl_data['Sites'] = array('' => 'All Sites');

        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key=>$value) {
           $projects[$key] = $value;    
        }
        $this->tpl_data['Projects'] = $projects;
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if($_REQUEST['BehaviouralSite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
            }

        }
        if(isset($_REQUEST['BehaviouralSite']) && $_REQUEST['BehaviouralSite'] != '') {
            foreach ($centers as $row) {
                if($_REQUEST['BehaviouralSite'] == $row['NumericID']) {
                    $this->tpl_data['CurrentSite'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
                }
            }
        }

        if(isset($_REQUEST['BehaviouralProject']) && $_REQUEST['BehaviouralProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' . $_REQUEST['BehaviouralProject'] . ')';
            $currentProject = $_REQUEST['BehaviouralProject'];
            $this->tpl_data['CurrentProject'] = array('ID' => $currentProject, 'Name' => $projects[$currentProject]);
        } else {
            $ExtraProject_Criteria = '';
         }
         $subprojects = Utility::getSubprojectsForProject($currentProject);

         $this->tpl_data['Subprojects'] = $subprojects;
         foreach($subprojects as $key=>$val) {
         $subprojList .= $key.",";
         }
         $subprojList = substr($subprojList, 0, -1);
         $config = NDB_Config::singleton();

        $Visits = array ('6 Month' => 'v06', '12 Month' => 'v12', '18 Month' => 'v18', '24 Month' => 'v24', '36 Month' => 'v36');
        $this->tpl_data['Visits'] = $Visits;

        //---- BEHAVIORAL STATS -----
        $sites = array('2' => 'sea', '3' => 'phi', '4' => 'stl', '5' => 'unc');
        $mri_data = array();
        $DB->select("SELECT s.CenterID,
                f.Data_Entry as Data_Entry,
                CASE s.visit_label
                WHEN '6mo' THEN 'v06'
                WHEN '12m' THEN 'v12'
                WHEN '18mo' THEN 'v18'
                WHEN '24mo' THEN 'v24'
                ELSE lower(s.visit_label) END as VLabel,
                COUNT(s.CandID) as val
                FROM session s JOIN candidate c ON (s.CandID=c.CandID)
                JOIN flag f ON (f.SessionID=s.ID)
                WHERE 
                s.Active='Y' AND c.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                AND f.CommentID NOT LIKE 'DDE%' 
                AND s.SubprojectID IN ($subprojList)
                $ExtraProject_Criteria
                GROUP by s.CenterID, VLabel, f.Data_Entry",
                $result);

        foreach($result as $row) {
            // Put some things into variables to make the lines shorter
            // so that they don't wrap. Note that "c"(enter array) needs to 
            // be a reference since we'll be modifying it.
            $center = $row['CenterID'];
            $vl = $row['VLabel'];
            $c =& $this->tpl_data['behaviour']['C' . $center];

            $c[$vl]['total'] += $row['val'];
            $c['all']['total'] += $row['val'];
            if($row['Data_Entry'] == 'Complete') {
                $c[$vl]['complete'] += $row['val'];
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
        $DB->select("SELECT s.CenterID, 
                f.Data_Entry as Data_Entry, 
                CASE s.visit_label
                WHEN '6mo' THEN 'v06'
                WHEN '12m' THEN 'v12'
                WHEN '18mo' THEN 'v18'
                WHEN '24mo' THEN 'v24'
                ELSE lower(s.visit_label) END as VLabel,
                COUNT(s.CandID) as val
                FROM session as s JOIN candidate as c ON (s.CandID=c.CandID) JOIN flag as f ON (f.SessionID=s.ID) 
                WHERE s.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                AND f.CommentID LIKE 'DDE%' 
                AND c.Active='Y' 
                AND (f.Test_name NOT LIKE '%parameter%' 
                    AND f.Test_name NOT LIKE '%radiological%' 
                    AND f.Test_name NOT LIKE '%vineland%')
                GROUP BY s.CenterID, VLabel, f.Data_Entry ORDER BY c.PSCID;",
                $result);
        foreach($result as $row) {
            $center = $row['CenterID'];
            $vl = $row['VLabel'];
            $c =& $this->tpl_data['dde']['C' . $center];

            $c[$vl]['total'] += $row['val'];
            $c['all']['total'] += $row['val'];
            if($row['Data_Entry'] == 'Complete') {
                $c[$vl]['complete'] += $row['val'];
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
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        if(isset($_REQUEST['site']) && $_REQUEST['site'] != '') {
            $ExtraSite_Criteria = 'AND (c.CenterID IS NULL OR c.CenterID=' . $_REQUEST['site'] . ')';
         } else {
            $ExtraSite_Criteria = '';
         }
         $currentProject = null;
         $this->tpl_data['showTable']= true;    
         if(isset($_REQUEST['MRIProject']) && $_REQUEST['MRIProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' . $_REQUEST['MRIProject'] . ')';
             $currentProject = $_REQUEST['MRIProject'];
             $this->tpl_data['CurrentProject'] = array('ID' => $currentProject, 'Name' => $projects[$currentProject]);
          } else {
             $ExtraProject_Criteria = '';
          }
          $subprojects = Utility::getSubprojectsForProject($currentProject);  
          $this->tpl_data['Subprojects'] = $subprojects;
          foreach($subprojects as $key=>$val) {
             $subprojList .= $key.",";
          }
          $subprojList = substr($subprojList, 0, -1); 
          $this->tpl_data['Projects'] = $projects;

        $this->tpl_data['Subprojects'] = $subprojects;
        $this->tpl_data['Projects'] = $projects;

        $DB->select("SELECT CONCAT('C', CenterID) as ID, CenterID as NumericID, PSCArea as LongName, Name as ShortName FROM psc WHERE CenterID IN (2, 3, 4, 5)", $centers);
                    if(Utility::isErrorX($centers)) {
                    return PEAR::raiseError("DB Error: ".$centers->getMessage());
                    }
                    $this->tpl_data['Centers'] = $centers;
                    $this->tpl_data['Sites'] = array('' => 'All Sites');
                    foreach ($centers as $row) {
                    $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
                    if($_REQUEST['site'] == $row['NumericID']) {
                    $this->tpl_data['CurrentSite'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
                    }

                    }
                    $this->tpl_data['Subprojects'] = Utility::getSubprojectList(); //array('1' => '6 Month Recruit', '2' => '12 Month Recruit', '3' => 'Control');
                    $Visits = array ('6 Month' => 'v06', '12 Month' => 'v12', '18 Month' => 'v18', '24 Month' => 'v24', '36 Month' => 'v36');
                    $this->tpl_data['Visits'] = $Visits;


                    $MRISubcategories = array('Complete', 'Partial Run', 'No Scan');
                    $MRIOptions = array('T1' => 'T1',
                            'T2' => 'T2',
                            'T1T2' => 'T1 and T2',
                            'DTI' => 'DTI',
                            'BOLD' => 'BOLD',
                            'Spectroscopy' => 'Spectroscopy'
                            );
                    if($_REQUEST['mri_type']) {
                        $MRI_Type = $_REQUEST['mri_type'];
                        $MRI_Type_Field = $_REQUEST['mri_type'] . "_Scan_Done";
                        $MRIHeader = "$MRI_Type Breakdown";
                        if($_REQUEST['mri_type'] == 'T1T2') {
                            $MRI_Type_Field = "T1_Scan_Done='Complete' and T2_Scan_Done='Complete'";
                            $MRIHeader = "T1 and T2 Complete Breakdown";
                            $CaseStatement = "
                                CASE($MRI_Type_Field)
                                WHEN True then 'Complete'
                                WHEN False Then 'Incomplete'
                                ELSE 'Incomplete'
                                END";
                            $MRISubcategories = array('Complete', 'Incomplete');
                        } else {
                            $CaseStatement = "
                                CASE($MRI_Type_Field)
                                WHEN 'Partial' THEN 'Partial Run'
                                WHEN 'No' THEN 'No Scan'
                                ELSE $MRI_Type_Field
                                END";
                        }
                    } else {
                        $MRI_Type_Field = 'T1_Scan_Done';
                        $MRI_Type = 'T1';
                        $MRIHeader = "T1 Scan Done Breakdown";
                        $CaseStatement = "
                            CASE($MRI_Type_Field)
                            WHEN 'Partial' THEN 'Partial Run'
                            WHEN 'No' THEN 'No Scan'
                            ELSE $MRI_Type_Field
                            END";
                    }
                    $DB->select("SELECT s.SubprojectID, 
                            c.CenterID, 
                            lower(s.Visit_label) as VLabel,
                            $CaseStatement as Subcat,
                            COUNT(*) as val 
                            FROM mri_parameter_form m JOIN flag f USING (CommentID) 
                            JOIN session s ON (f.SessionID=s.ID) 
                            JOIN candidate c ON (c.CandID=s.CandID) 
                            WHERE s.Current_stage <> 'Recycling Bin' 
                            AND f.Administration <> 'None'
                            AND s.Active='Y'
                            AND c.Active='Y'
                            AND f.CommentID NOT LIKE 'DDE%'
                            AND s.SubprojectID IN ($subprojList)
                            $ExtraProject_Criteria
                            GROUP BY Subcat, s.SubprojectID, c.CenterID, s.Visit_label", $result);
                    $M_Visits = array ('6 Month' => 'v06', '12 Month' => 'v12', '24 Month' => 'v24');
                    $this->tpl_data['MRI_Done_Table'] = $this->render_stats_table($MRIHeader, $MRISubcategories, $M_Visits, "mri_type", $MRIOptions, $MRI_Type, $centers, $result, "mri", $currentProject);

                    $DB->select("SELECT s.SubprojectID, 
                            c.CenterID, 
                            CASE s.visit_label
                            WHEN '6mo' THEN 'v06'
                            WHEN '12m' THEN 'v12'
                            WHEN '18mo' THEN 'v18'
                            WHEN '24mo' THEN 'v24'
                            ELSE lower(s.visit_label) END as VLabel,
                            COUNT(*) as val 
                            FROM mri_parameter_form m JOIN flag f USING (CommentID) 
                            JOIN session s ON (f.SessionID=s.ID) 
                            JOIN candidate c ON (c.CandID=s.CandID) 
                            WHERE T1_Scan_Done='Complete' 
                            AND s.Current_stage <> 'Recycling Bin' 
                            AND f.Administration <> 'None'
                            AND s.Active='Y'
                            AND f.CommentID NOT LIKE 'DDE%'
                            AND s.SubprojectID IN ($subprojList)
                            $ExtraProject_Criteria
                            GROUP BY s.SubprojectID, c.CenterID, s.Visit_label;",
                            $result);
                    foreach($result as $row) {
                        $center = $row['CenterID'];
                        $cohort = $row['SubprojectID'];
                        $vl = $row['VLabel'];
                        $c =& $this->tpl_data['mri_total'][$cohort]['C' . $center];

                        $c[$vl] += $row['val'];
                        $this->tpl_data['mri_total']['C' . $center][$vl]['total'] += $row['val'];
                        $this->tpl_data['mri_total'][$cohort]['total'] += $row['val'];
                        $this->tpl_data['mri_total']['total'] += $row['val'];

                    }
                    // MRI INTEGRITY STATS 
                    // MRI parameter form is completed, but nothing in tarchive
                    $DB->select("SELECT COUNT(distinct f.CommentID) as val, 
                            s.CenterID as CenterID
                            FROM flag f JOIN session s ON (f.SessionID=s.ID) 
                            LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
                            -- LEFT JOIN tarchive t ON (s.CandID=MID(t.PatientName, 9, 6))
                            LEFT JOIN tarchive t ON (s.CandID=MID(t.PatientName, 9, 6) AND MID(t.PatientName, 16, 3)=s.Visit_label)
                            LEFT JOIN candidate c ON (s.CandID=c.CandID)
                            WHERE f.CommentID NOT LIKE 'DDE%' 
                            AND f.Test_name='mri_parameter_form' 
                            and f.Administration <> 'None'
                            and t.TarchiveID IS NULL
                            AND s.Active='Y' 
                            AND t.TarchiveID IS NULL 
                            AND f.Data_entry='Complete'
                            AND f.CommentID NOT LIKE 'DDE%'
                            AND (m.T1_Scan_done IS NULL OR m.T1_Scan_done <> 'No')
                            AND s.SubprojectID IN ($subprojList)
                            GROUP BY s.CenterID;", $result);
                    foreach($result as $row) {
                        $this->tpl_data['mri_errors'][$row['CenterID']]['no_tarchive'] = $row['val'];
                    }

                    // MRI parameter form completed, but nothing in browser
                    $DB->select("SELECT s.CenterID as CenterID, 
                            COUNT(distinct f.CommentID) as val
                            FROM mri_parameter_form m LEFT JOIN flag f ON (f.CommentID=m.CommentID)
                            LEFT JOIN session s ON (s.ID=f.SessionID) 
                            LEFT JOIN files fi ON (fi.SessionID=f.SessionID) 
                            WHERE (m.DTI_Scan_done <> 'No' 
                                OR m.T2_Scan_done <> 'No' 
                                OR m.T1_Scan_done <> 'No') 
                            AND fi.FileID IS NULL 
                            AND f.Data_entry = 'Complete'
                            AND m.CommentID NOT LIKE 'DDE%'
                            AND s.Active='Y'
                            AND s.SubprojectID IN ($subprojList)
                            GROUP by s.CenterID;", $result);
                    foreach($result as $row) {
                        $this->tpl_data['mri_errors'][$row['CenterID']]['no_browser'] = $row['val'];
                    }

                    // MRI Browser populated, but no MRI parameter form completed.
                    $DB->select("SELECT s.CenterID as CenterID, COUNT(distinct s.ID) as val
                            FROM files LEFT JOIN session s ON (files.SessionID=s.ID)
                            LEFT JOIN flag f on (f.SessionID=s.ID
                                AND f.Test_name='mri_parameter_form' 
                                AND f.CommentID NOT LIKE 'DDE%') 
                            LEFT JOIN mri_parameter_form mpf ON (mpf.CommentID=f.CommentID)
                            LEFT JOIN candidate c ON (c.CandID=s.CandID)
                            WHERE s.Active='Y'
                            AND (f.ID IS NULL OR f.Data_entry <> 'Complete' OR f.Data_entry IS NULL) 
                            AND c.PSCID <> 'scanner'
                            AND mpf.CommentID NOT LIKE 'DDE%'
                            AND s.SubprojectID IN ($subprojList)
                            $ExtraProject_Criteria
                            GROUP BY s.CenterID", $result);
                    foreach($result as $row) {
                        $this->tpl_data['mri_errors'][$row['CenterID']]['no_parameter'] = $row['val'];
                    }
                    // TOP MRI TABLE

                    // Below this has not been optimized. It's kind of ugly.
                    foreach($centers as $center) {
                        $id = $center['NumericID'];
                        $name = $center['LongName'];
                        // -------- MRI STATS---------------
                        $DB->select("SELECT COUNT(distinct s.CandID, s.Visit_label) FROM tarchive as t, session as s WHERE MID(t.PatientName,9,6)=s.CandID AND s.SubprojectID IN ($subprojList) AND s.CenterID={$center['NumericID']};", $result23);
                        if (Utility::isErrorX($result23)) {
                            return PEAR::raiseError("DB Error: ".$result23->getMessage());
                        }
                        list(,$result23)=each($result23[0]);
                        $work_station_count = $result23;

                        $DB->select("SELECT COUNT(s.CandID) FROM session as s, psc as p, candidate as c WHERE c.CandID=s.CandID AND s.Active='Y' AND s.CenterID=p.CenterID  AND s.Scan_done='Y' AND s.SubprojectID IN ($subprojList) $ExtraProject_Criteria AND s.CenterID={$id} ORDER BY s.CandID;", $result24);
                        if (Utility::isErrorX($result24)) {
                            return PEAR::raiseError("DB Error: ".$result24->getMessage());
                        }
                        list(,$result24)=each($result24[0]);
                        $claimed_count = $result24;

                        $DB->select("SELECT COUNT(s.CandID) FROM mri_parameter_form as pf, session as s, flag as f, psc as p, candidate as c WHERE f.CommentID=pf.CommentID AND s.ID=f.SessionID AND c.CandID=s.CandID AND s.Active='Y' AND s.CenterID=p.CenterID AND pf.Data_entry_completion_status='Complete' AND s.CenterID={$id} AND s.SubprojectID IN ($subprojList) $ExtraProject_Criteria ORDER BY p.Name;", $result25);
                        if (Utility::isErrorX($result25)) {
                            return PEAR::raiseError("DB Error: ".$result25->getMessage());
                        }
                        list(,$result25)=each($result25[0]);
                        $forms_count = $result25;
                        $three_scans = $DB->selectOne("SELECT count(distinct CandID) FROM session v06  join flag f06 ON (f06.SessionID=v06.ID and Test_name='mri_parameter_form' AND CommentID NOT LIKE 'DDE%') join mri_parameter_form m06 ON (f06.CommentID=m06.CommentID) 
                                WHERE v06.Active='Y' AND v06.Visit_label='v06' and m06.T1_Scan_Done='Complete'
                                AND EXISTS (SELECT 'x' FROM session v12 join flag f12 ON (f12.SessionID=v12.ID and Test_name='mri_parameter_form' AND CommentID NOT LIKE 'DDE%') join mri_parameter_form m12 ON (f12.CommentID=m12.CommentID)
                                    WHERE v12.Active='Y' AND v12.Visit_label='v12' AND v06.CandID=v12.CandID AND m12.T1_Scan_Done='Complete') 
                                AND EXISTS (SELECT 'x' FROM session v24 join flag f24 ON (f24.SessionID=v24.ID and Test_name='mri_parameter_form' AND CommentID NOT LIKE 'DDE%') join mri_parameter_form m24 ON (f24.CommentID=m24.CommentID)
                                    WHERE v24.Active='Y' AND v24.Visit_label='v24' AND v06.CandID=v24.CandID and m24.T1_Scan_Done='Complete') 
                                AND v06.CenterID='{$id}' AND V06.SubprojectID IN ($subprojList) $ExtraProject_Criteria");

                        $mri_data[] = array('name' => $name,  'work_station_count' => $work_station_count, 'claimed_count' => $claimed_count, 'forms_count' => $forms_count, 'all_three_scans' => $three_scans);

                    }
                    $MultiTimepoint = $DB->pselect("SELECT psc.PSCArea as Center, SUM(Three_done) as T1, SUM(Three_T2_Done) as T2 , SUM(Three_DTI_Done) as DTI, SUM(Three_All_done) as Three_All_done FROM 
                            (SELECT c.CenterID, COUNT(DISTINCT c.CandID)," .
                             /* This essentially does COUNT(T1_Scan_done='Complete'), but because of the way COUNT(expr) works, 
                              * we need to make sure that anything that isn't 'Complete' is evaluated as NULL (not false), hence
                              * the crazy CASE statement. The different count statements Do v06, v06+v12, v06+v12+v24, all 3 for T2, all
                              * three for DTI, and all three for T1+T2+DTI. The outer select statement sums up all the groupings, to get
                              * a final scalar value.
                              */

                             "COUNT(DISTINCT CASE (COALESCE(mpf06.T1_Scan_done, 'No')='Complete') WHEN true THEN c.CandID ELSE null END) as v06_Done, 
                             COUNT(DISTINCT CASE (COALESCE(mpf12.T1_Scan_done, 'No')='Complete' AND COALESCE(mpf06.T1_Scan_done, 'No')='Complete' ) WHEN true THEN c.CandID ELSE null END) as Two_Done, 
                             COUNT(DISTINCT CASE (COALESCE(mpf12.T1_Scan_done, 'No')='Complete' AND COALESCE(mpf06.T1_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf24.T1_Scan_done, 'No')='Complete') WHEN true THEN c.CandID ELSE null END) as Three_done, 
                             COUNT(DISTINCT CASE (COALESCE(mpf12.T2_Scan_done, 'No')='Complete' AND COALESCE(mpf06.T2_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf24.T2_Scan_done, 'No')='Complete') WHEN true THEN c.CandID ELSE null END) as Three_T2_done, 
                             COUNT(DISTINCT CASE (COALESCE(mpf12.DTI_Scan_done, 'No')='Complete' AND COALESCE(mpf06.DTI_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf24.DTI_Scan_done, 'No')='Complete') WHEN true THEN c.CandID ELSE null END) as Three_DTI_done,
                             COUNT(DISTINCT 
                                 CASE (COALESCE(mpf12.T1_Scan_done, 'No')='Complete' AND COALESCE(mpf06.T1_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf24.T1_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf12.T2_Scan_done, 'No')='Complete' AND COALESCE(mpf06.T2_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf24.T2_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf12.DTI_Scan_done, 'No')='Complete' AND COALESCE(mpf06.DTI_Scan_done, 'No')='Complete' 
                                     AND COALESCE(mpf24.DTI_Scan_done, 'No')='Complete') WHEN true THEN c.CandID ELSE null END) as Three_All_done
                                 FROM candidate c JOIN session v06 ON (c.CandID=v06.CandID AND v06.Visit_label='v06' and v06.Active='Y' and v06.Current_stage <> 'Recycling Bin' AND v06.SubprojectID IN ($subprojectList)) 
                                 JOIN flag f06 ON (f06.SessionID=v06.ID and f06.Test_name='mri_parameter_form' AND f06.CommentID NOT LIKE 'DDE%') 
                                 JOIN mri_parameter_form mpf06 ON (f06.CommentID=mpf06.CommentID) 
                                 LEFT JOIN session v12 ON (c.CandID=v12.CandID and v12.Visit_label='v12' and v12.Current_stage <> 'Recycling Bin' ) 
                                 LEFT JOIN flag f12 ON (f12.SessionID=v12.ID AND f12.Test_name='mri_parameter_form' AND f12.CommentID NOT LIKE 'DDE%') 
                                 LEFT JOIN mri_parameter_form mpf12 ON (mpf12.CommentID=f12.CommentID) 
                                 LEFT JOIN session v24 ON (v24.CandID=c.CandID and v24.Visit_label='v24' and v24.Current_stage <> 'Recycling Bin' and v24.Active='Y' AND v24.SubprojectID IN ($subprojectList)) 
                                 LEFT JOIN flag f24 ON (f24.SessionID=v24.ID AND f24.Test_name='mri_parameter_form' AND f24.CommentID NOT LIKE 'DDE%') 
                                 LEFT JOIN mri_parameter_form mpf24 ON (mpf24.CommentID=f24.CommentID) WHERE 
                                 c.Active='Y' and c.PSCID  not like 'dcc%'  and c.PSCID <> 'scanner' 
                                 GROUP BY c.CenterID) breakdown JOIN psc ON (breakdown.CenterID=psc.CenterID) WHERE psc.CenterID <> 1 GROUP BY psc.Name ORDER BY psc.CenterID", array());
                    $total = array('Name' => 'Total', 'T1' => 0, 'T2' => 0, 'DTI' => 0, 'All' => 0);
                    foreach ($MultiTimepoint as $row) {
                        $this->tpl_data['mri_all_scans_done'][] = array(
                                'Name' => $row['Center'],
                                'T1' => $row['T1'],
                                'T2' => $row['T2'],
                                'DTI' => $row['DTI'],
                                'All' => $row['Three_All_done']
                                );
                        $total['T1'] += $row['T1'];
                        $total['T2'] += $row['T2'];
                        $total['DTI'] += $row['DTI'];
                        $total['All'] += $row['Three_All_done'];
                    }
                    $this->tpl_data['mri_all_scans_done'][] = $total;

                    $this->tpl_data['mri_data'] = $mri_data;
                    $this->tpl_data['reliability_completion'] = $this->getReliabilityData();

    } // End function


    function stats_reliability()
    {
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }
        $DB->select("SELECT CONCAT('C', CenterID) as ID, CenterID as NumericID, PSCArea as LongName, Name as ShortName FROM psc WHERE CenterID IN (2, 3, 4, 5)", $centers);
        if(Utility::isErrorX($centers)) {
            return PEAR::raiseError("DB Error: ".$centers->getMessage());
        }
        $this->tpl_data['Centers'] = $centers;
        $this->tpl_data['Sites'] = array('' => 'All Sites');
        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        $this->tpl_data['Projects'] = $projects;
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if($_REQUEST['ReliabilitySite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
            }
        }
        if(isset($_REQUEST['ReliabilityProject']) && $_REQUEST['ReliabilityProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' . $_REQUEST['ReliabilityProject'] . ')';
            $currentProject = $_REQUEST['ReliabilityProject'];
            $this->tpl_data['CurrentProject'] = array('ID' => $currentProject, 'Name' => $projects[$currentProject]);
         } else {
            $ExtraProject_Criteria = '';
         }

         if($_REQUEST['ReliabilityProject'] == $row['NumericID']) {
         $this->tpl_data['CurrentProject'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
         }
         $this->tpl_data['reliability_completion'] = $this->getReliabilityData();
    }

    function stats_scatter()
    {
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }
        $DB->select("SELECT CONCAT('C', CenterID) as ID, CenterID as NumericID, PSCArea as LongName, Name as ShortName FROM psc WHERE CenterID IN (2, 3, 4, 5)", $centers);
        if(Utility::isErrorX($centers)) {
            return PEAR::raiseError("DB Error: ".$centers->getMessage());
        }
        $this->tpl_data['Centers'] = $centers;
        $this->tpl_data['Sites'] = array('' => 'All Sites');
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if($_REQUEST['site'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
            }
        }
        $this->tpl_data['Subprojects'] = Utility::getSubprojectList(); //array('1' => '6 Month Recruit', '2' => '12 Month Recruit', '3' => 'Control');
        $Visits = array ('6 Month' => 'v06', '12 Month' => 'v12', '18 Month' => 'v18', '24 Month' => 'v24', '36 Month' => 'v36');
        $this->tpl_data['Visits'] = $Visits;

        $this->tpl_data['all_instruments'] = Utility::getAllInstruments();
        /*      foreach(Utility::getScoredInstruments() as $Instrument)
                {
                foreach(Utility::getScoreColsForInstrument($Instrument) as $Field)
                {
                print $Field;
                }
                }
         */
    }


    function stats_demographic()
    {
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $projects[null] = 'All Projects';
        foreach(Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        if(isset($_REQUEST['DemographicSite']) && $_REQUEST['DemographicSite'] != '') {
            $ExtraSite_Criteria = 'AND (c.CenterID IS NULL OR c.CenterID=' . $_REQUEST['DemographicSite'] . ')';
        }
        else {
            $ExtraSite_Criteria = '';
        }
        if(isset($_REQUEST['DemographicProject']) && $_REQUEST['DemographicProject'] != '') {
            $ExtraProject_Criteria .= ' AND c.ProjectID=' . $_REQUEST['DemographicProject'];
            $currentProject = $_REQUEST['DemographicProject'];
            $this->tpl_data['CurrentProject'] = array('ID' => $currentProject, 'Name' => $projects[$currentProject]);
        }
        $subprojects = Utility::getSubprojectsForProject($currentProject);
        foreach($subprojects as $key=>$val) {
        $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);

        $demographics_project_name = $projects["{$_REQUEST['DemographicProject']}"];
        $this->tpl_data['Subprojects'] = $subprojects;
        $this->tpl_data['Projects'] = $projects;
        $DB->select("SELECT s.subprojectid as rowid, 
            COUNT(DISTINCT(c.PSCID)) as val 
            FROM candidate as c LEFT JOIN session s ON (s.CandID=c.CandID) 
            WHERE s.active='Y' AND s.CenterID <> '1'        
            AND c.Active='Y'
            AND (s.Current_stage IN ('Visit', 'Screening')) 
            AND COALESCE(s.Screening,'') NOT IN ('Failure', 'Withdrawal')
            AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')
            $ExtraSite_Criteria $ExtraProject_Criteria
            GROUP BY s.subprojectid", $result);
        foreach($result as $row) {
            $this->tpl_data['registered'][$row['rowid']]['visit'] = $row['val'];
            $this->tpl_data['registered']['visittotal'] += $row['val'];



            $DB->select("SELECT s.subprojectid as rowid, count(DISTINCT(c.PSCID)) as val from candidate as c left join session s ON (s.CandID=c.CandID) WHERE coalesce(s.active, 'Y')='Y' AND c.CenterID <> '1' and c.PSCID <> 'scanner' and coalesce(s.visit_label, 'v06') in ('v06', 'v12', 'v18', 'v24', 'v36') AND c.Active='Y' $ExtraSite_Criteria $ExtraProject_Criteria group by s.subprojectid", $result);
            foreach($result as $row) {
                $this->tpl_data['registered'][$row['rowid']]['total'] = $row['val'];
                $this->tpl_data['registered']['total'] += $row['val'];
            }

            // Total, explicitly calculated instead of added in the loop to ensure there's no one double registered in 2 different cohorts
            $DB->select("SELECT count(distinct(c.PSCID)) from candidate as c WHERE c.PSCID<>'scanner' AND c.CenterID<>'1' AND c.Active='Y' $ExtraSite_Criteria $ExtraProject_Criteria", $total);
            if (Utility::isErrorX($total)) {
                return PEAR::raiseError("DB Error: ".$total->getMessage());
            }
            list(,$total)=each($total[0]);
            $Total_candidates = $total;
            $this->tpl_data['Total_candidates'] = $Total_candidates;

            // Number of visits.
            // This is based on the EDI completion status, since the EDI
            // is done by every cohort at every visit
            $DB->select("SELECT count(DISTINCT c.PSCID) as val, s.SubprojectID as rowid FROM flag f join session s ON (s.ID=f.SessionID) join candidate c ON (c.CandID=s.CandID)  where f.Test_name IN 
                ('edi', 'mri_parameter_form', 'vineland_subject') 
                AND COALESCE(s.Screening,'') NOT IN ('Failure', 'Withdrawal')
                AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')
                AND s.Active='Y'
                AND c.Active='Y'
                AND (f.Administration = 'All' OR f.Administration='Partial')
                AND s.Current_stage <> 'Recycling Bin'
                $ExtraSite_Criteria $ExtraProject_Criteria
                GROUP BY s.SubprojectID", $result);
            foreach($result as $row) {
                $this->tpl_data['edi'][$row['rowid']]['complete'] = $row['val'];
                $this->tpl_data['edi']['complete'] += $row['val'];
            }

            // Number of T1 candidates scanned
            $DB->select("SELECT count(DISTINCT c.PSCID) as val, s.SubprojectID as rowid FROM flag f JOIN mri_parameter_form mp USING(CommentID) join session s ON (s.ID=f.SessionID) join candidate c ON (c.CandID=s.CandID) WHERE f.Test_name='mri_parameter_form'
                AND COALESCE(s.Screening,'') NOT IN ('Failure', 'Withdrawal')
                AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')
                AND s.Active='Y'
                AND c.Active='Y'
                AND f.Administration <> 'None'
                AND mp.T1_Scan_done='Complete'
                AND s.Current_stage <> 'Recycling Bin'
                $ExtraSite_Criteria $ExtraProject_Criteria
                GROUP BY s.SubprojectID", $result);
            foreach($result as $row) {
                $this->tpl_data['scanned'][$row['rowid']]['complete'] = $row['val'];
                $this->tpl_data['scanned']['complete'] += $row['val'];
            }
        }
        // NUMBER OF CANDIDATES STATS TABLE


        // Adds a C to the start of the centerid, because that's how the
        // template is looking for it. Exclude DCC and UofA
        $DB->select("SELECT CONCAT('C', CenterID) as ID, CenterID as NumericID, PSCArea as LongName, Name as ShortName FROM psc WHERE CenterID IN (2, 3, 4, 5)", $centers);
        if(Utility::isErrorX($centers)) {
            return PEAR::raiseError("DB Error: ".$centers->getMessage());
        }
        $this->tpl_data['Centers'] = $centers;
        $this->tpl_data['Sites'] = array('' => 'All Sites');
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if($_REQUEST['DemographicSite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
            }

        }
       // $this->tpl_data['Subprojects'] = Utility::getSubprojectList(); //array('1' => '6 Month Recruit', '2' => '12 Month Recruit', '3' => 'Control');
        $Visits = array ('6 Month' => 'v06', '12 Month' => 'v12', '18 Month' => 'v18', '24 Month' => 'v24', '36 Month' => 'v36');
        $this->tpl_data['Visits'] = $Visits;

        $instruments  = array_merge(
            array( '' => 'Recruit Gender Breakdown'),
            Utility::getAllInstruments()
        );
        $this->tpl_data['scored_instruments'] = ProjectUtility::getScoredInstruments();
        $this->tpl_data['all_instruments'] = Utility::getAllInstruments();
        if(isset($_REQUEST['DemographicInstrument']) && $_REQUEST['DemographicInstrument'] != '') {
            $Subcategories = array('Complete', 'Incomplete');
            $DB->select("SELECT count(*) as val, 
                f.Data_entry as Subcat, 
                c.CenterID as CenterID, 
                s.SubprojectID as SubprojectID,
                CASE s.visit_label
                WHEN 'v6' THEN 'v06'
                WHEN '6mo' THEN 'v06'
                WHEN '12m' THEN 'v12'
                WHEN '18mo' THEN 'v18'
                WHEN '24mo' THEN 'v24'
                ELSE lower(s.visit_label) END as VLabel
                FROM session s JOIN candidate c ON (s.CandID=c.CandID)
                JOIN flag f ON (f.SessionID=s.ID)
                JOIN $_REQUEST[DemographicInstrument] i USING(CommentID)
                WHERE s.Active='Y' AND
                c.CenterID <> '1' AND f.Data_entry='Complete' AND
                f.Administration='All' AND
                f.CommentID NOT LIKE 'DDE%'
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                UNION
                SELECT count(*) as val, 'Incomplete' as Subcat, 
                c.CenterID as CenterID, 
                s.SubprojectID as SubprojectID,
                CASE s.visit_label
                WHEN '6mo' THEN 'v06'
                WHEN '12m' THEN 'v12'
                WHEN '18mo' THEN 'v18'
                WHEN '24mo' THEN 'v24'
                ELSE lower(s.visit_label) END as VLabel
                FROM session s JOIN candidate c USING(CandID) 
                JOIN flag f ON (f.SessionID=s.ID) 
                JOIN $_REQUEST[DemographicInstrument] i USING(CommentID)
                WHERE s.Active='Y' and s.CenterID <> 1
                AND f.CommentID NOT LIKE 'DDE%' AND (f.Data_entry IS NULL OR f.Data_entry <> 'Complete')
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                ", $result);
            $this->tpl_data['RecruitsTable'] = $this->render_stats_table("Data Entry Completion Status for $_REQUEST[DemographicInstrument]", $Subcategories, $Visits, "DemographicInstrument", $instruments, $_REQUEST['DemographicInstrument'], $centers, $result, "demographics",$currentProject);
        } else {
            $Subcategories = array('Male', 'Female');
            $DB->select("SELECT c.CenterID as CenterID, 
                s.SubprojectID as SubprojectID, 
                CASE s.visit_label
                WHEN '6mo' THEN 'v06'
                WHEN '12m' THEN 'v12'
                WHEN '18mo' THEN 'v18'
                WHEN '24mo' THEN 'v24'
                ELSE lower(s.visit_label) END as VLabel,
                    c.gender as Subcat,
                    count(s.CandID) as val
                    FROM session s JOIN candidate c ON (s.CandID=c.CandID) 
                    WHERE s.active='Y' AND s.CenterID <> '1'
                    AND ((s.Current_stage IN ('Visit', 'Screening')
                    AND s.SubprojectID IN (1, 2)) OR s.SubprojectID=3) 
                    AND COALESCE(s.Screening,'') NOT IN ('Failure', 'Withdrawal')
                    AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')
                    GROUP BY c.CenterID, SubprojectID, VLabel, Subcat", $result);
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }
            $this->tpl_data['RecruitsTable'] = $this->render_stats_table("Breakdown of Registered Candidates", $Subcategories, $Visits, "DemographicInstrument", $instruments, '', $centers, $result, "demographics", $currentProject);

        }
    }



    static function getEnrollmentData($siteID= null, $projID= null){
        $DB =& Database::singleton(); 
        $enroll_data = array();
        $params = array();
        $Extra_Where = '';
        if(!empty($siteID)) {
            $Extra_Where .= " AND sn.CenterID = :site"; //$_REQUEST['site'];
            $params['site'] = $siteID; 
        }
        if(!empty($projID)) {
            $Extra_Where .= " AND  cad.ProjectID = :project"; //$_REQUEST['site'];
            $params['project'] = $projID;
        }
        $ethnic_categories = array("hispanic","non_hispanic","not_answered");
        $ethnic_name = array("Hispanic or Latino", "Not Hispanic or Latino", 
                "Unknown (individuals not reporting ethnicity");
        $cat_count = 0;
        $cat_total = array('Female' =>0, 'Male' =>0, 'Unknown' =>0);
        foreach($ethnic_categories as $ethnic_cat){
            $gender = array('Female' => 0, 'Male' => 0, 'Unknown' => 0);
            $results = $DB->pselect("SELECT ProjectID, COALESCE(Gender, 'Unknown') as Gender, COUNT( DISTINCT cad.CandID) as val FROM candidate cad 
                    JOIN session sn on cad.CandID= sn.CandID 
                    JOIN flag fg on sn.ID = fg.SessionID
                    JOIN tsi ti on fg.CommentID = ti.CommentID 
                    WHERE ti.child_ethnicity = '$ethnic_cat' 
                    AND fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' 
                    AND cad.Active='Y' AND fg.Data_Entry='Complete' $Extra_Where AND fg.Administration <> 'None' GROUP BY Gender", $params);
            if(is_null($results)){
            }else{
                foreach($results as $row){
                    $Gender = $row['Gender'];
                    $Count = $row['val'];
                    //$total_count += $Count;
                    if(is_null($Gender)) {
                        $gender['Unknown'] = $Count;
                    } else {
                        $gender[$Gender] = $Count;
                        $cat_total[$Gender] += $Count;
                    }

                }}
            $enroll_data[] = array('ethnic_cat' => $ethnic_name[$cat_count],'female_count' => $gender['Female'],'male_count' => $gender['Male'],'unknown_count' => $gender['Unknown'],'total_count' =>array_sum($gender) );
            $cat_count++;
        }
        $enroll_data_total[] = array('total_name' =>" Ethnic Category: Total of All Subjects",'total_female'=>$cat_total['Female'],'total_male'=>$cat_total['Male'],'total_unknown'=> $cat_total['Unknown'],'total_total'=> array_sum($cat_total)); 

        $enroll_data_race = array();

        $race_categories = array("american_indian_alaska_native","asian","native_hawaiian_pacific_islander","black_african_american","white","more_than_one_race","unknown_not_reported");
        $race_name = array("American Indian/Alaska Native", "Asian", "Native Hawaiian or Other Pacific Islander","Black or African American","White"," More Than One Race","Unknown or Not Reported");
        $race_count = 0;
        $race_total = array('Female' =>0, 'Male' =>0, 'Unknown' =>0);
        $gender = array('Female' => 0, 'Male' => 0, 'Unknown' => 0);

        foreach($race_categories as $race_cat){
            $gender = array('Female' => 0, 'Male' => 0, 'Unknown' => 0);

            if($race_cat === "more_than_one_race"){
                $race_cat = '%'.$race_cat.'%';
                $results = $DB->pselect("SELECT COALESCE(Gender, 'Unknown') as Gender, COUNT( DISTINCT cad.CandID) as val FROM candidate cad
                        JOIN session sn on cad.CandID= sn.CandID
                        LEFT JOIN flag fg on sn.ID = fg.SessionID
                        LEFT JOIN tsi ti on fg.CommentID = ti.CommentID WHERE ( ti.candidate_race LIKE  '$race_cat' OR ti.candidate_race LIKE '%{@}%' ) AND fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' AND cad.Active='Y' AND fg.Data_Entry='Complete' $Extra_Where AND fg.Administration <> 'None' AND fg.Test_name='tsi' GROUP BY Gender" , $params);
            }
            else if($race_cat === "unknown_not_reported"){
                $results = $DB->pselect("SELECT COALESCE(Gender, 'Unknown') as Gender, COUNT( DISTINCT cad.CandID) as val FROM candidate cad
                        JOIN session sn on cad.CandID= sn.CandID
                        LEFT JOIN flag fg on sn.ID = fg.SessionID
                        LEFT JOIN tsi ti on fg.CommentID = ti.CommentID WHERE (ti.candidate_race LIKE  '$race_cat'OR ti.candidate_race IS NULL) AND fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' AND cad.Active='Y' AND fg.Data_Entry='Complete' $Extra_Where AND fg.Administration <> 'None' AND fg.Test_name='tsi' GROUP BY Gender" ,$params);

            }else{

                $results = $DB->pselect("SELECT COALESCE(Gender, 'Unknown') as Gender, COUNT( DISTINCT cad.CandID) as val FROM candidate cad
                        JOIN session sn on cad.CandID= sn.CandID
                        LEFT JOIN flag fg on sn.ID = fg.SessionID
                        LEFT JOIN tsi ti on fg.CommentID = ti.CommentID WHERE ti.candidate_race LIKE  '$race_cat' AND fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' AND cad.Active='Y' AND fg.Data_Entry='Complete' $Extra_Where AND fg.Administration <> 'None' AND fg.Test_name='tsi' GROUP BY Gender" , $params);
            }      

            $Count = 0;
            foreach($results as $row){
                $Gender = $row['Gender'];
                $Count = $row['val'];
                if(is_null($Count)){
                    $Count = 0;
                }
                //$total_count += $Count;
                if(is_null($Gender)) {
                    $gender['Unknown'] = $Count;
                } else {
                    $gender[$Gender] = $Count;
                    $race_total[$Gender] += $Count;
                }

            }


            $enroll_data_race[] = array('race_cat' => $race_name[$race_count],'female_count' => $gender['Female'],'male_count' => $gender['Male'],'unknown_count' => $gender['Unknown'],'total_count' => array_sum($gender));
            $race_count++;

        }
        $enroll_data_racetotal[] = array('total_name' =>" Racial Categories: Total of All Subjects",'total_female'=>$race_total['Female'],'total_male'=>$race_total['Male'],'total_unknown'=> $race_total['Unknown'],'total_total'=> array_sum($race_total));


        $enroll_data_hispanic = array();
        $hispanic_race_count = 0;
        $hispanic_total = array('Female' =>0, 'Male' =>0, 'Unknown' =>0);
        $gender = array('Female' => 0, 'Male' => 0, 'Unknown' => 0);

        foreach($race_categories as $race_cat){
            $gender = array('Female' => 0, 'Male' => 0, 'Unknown' => 0);
            if($race_cat === "more_than_one_race"){
                $race_cat = '%'.$race_cat.'%';
                $results = $DB->pselect("SELECT COALESCE(Gender, 'Unknown') as Gender, COUNT( DISTINCT cad.CandID) as val FROM candidate cad
                        JOIN session sn on cad.CandID= sn.CandID
                        LEFT JOIN flag fg on sn.ID = fg.SessionID
                        LEFT JOIN tsi ti on fg.CommentID = ti.CommentID WHERE ( ti.candidate_race LIKE  '$race_cat' OR ti.candidate_race LIKE '%{@}%' ) AND ti.child_ethnicity='hispanic' AND fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' AND cad.Active='Y' AND fg.Data_Entry='Complete' $Extra_Where AND fg.Administration <> 'None' AND fg.Test_name='tsi' GROUP BY Gender" , $params);
            }         
            else if($race_cat === "unknown_not_reported"){
                $results = $DB->pselect("SELECT COALESCE(Gender,'Unknown') as Gender ,COUNT( DISTINCT cad.CandID) as val FROM candidate cad
                        JOIN session sn on cad.CandID= sn.CandID
                        LEFT JOIN flag fg on sn.ID = fg.SessionID
                        LEFT JOIN tsi ti on fg.CommentID = ti.CommentID WHERE (ti.candidate_race LIKE '$race_cat' OR ti.candidate_race IS NULL) AND ti.child_ethnicity='hispanic' AND fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' AND cad.Active='Y' AND fg.Data_Entry='Complete' $Extra_Where  AND fg.Administration <> 'None' AND fg.Test_name='tsi' GROUP BY Gender" , $params);
            }else{
                $results = $DB->pselect("SELECT COALESCE(Gender, 'Unknown') as Gender,COUNT( DISTINCT cad.CandID) as val FROM candidate cad
                        JOIN session sn on cad.CandID= sn.CandID
                        LEFT JOIN flag fg on sn.ID = fg.SessionID
                        LEFT JOIN tsi ti on fg.CommentID = ti.CommentID WHERE ti.candidate_race LIKE '$race_cat' AND ti.child_ethnicity='hispanic' AND fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' AND cad.Active='Y' AND fg.Data_Entry='Complete'  $Extra_Where  AND fg.Administration <> 'None' AND fg.Test_name='tsi' GROUP BY Gender" , $params);
            }    

            foreach($results as $row){
                $Gender = $row['Gender'];
                $Count = $row['val'];
                if(is_null($Count)){
                    $Count = 0;
                }
                //$total_count += $Count;
                $gender[$Gender] = $Count;
                $hispanic_total[$Gender] += $Count;


            }

            $enroll_data_hispanic[] = array('race_cat' => $race_name[$hispanic_race_count],'female_count' => $gender['Female'],'male_count' => $gender['Male'],'unknown_count' => $gender['Unknown'],'total_count' => array_sum($gender));
            $hispanic_race_count++;

        }
        $enroll_data_hispanictotal[] = array('total_name' =>" Racial Categories: Total of Hispanic or Latinos",'total_female'=>$hispanic_total['Female'],'total_male'=>$hispanic_total['Male'],'total_unknown'=> $hispanic_total['Unknown'],'total_total'=> array_sum($hispanic_total));

        $withdraw = $DB->pselectOne("SELECT COUNT( DISTINCT cad.CandID) as val FROM candidate cad
                JOIN session sn on cad.CandID= sn.CandID
                LEFT JOIN flag fg on sn.ID = fg.SessionID
                LEFT JOIN tsi ti on fg.CommentID = ti.CommentID WHERE fg.CommentID NOT LIKE 'DDE%' AND sn.CenterID <> '1' AND sn.Active='Y' AND cad.Active='Y' AND fg.Data_Entry='Complete'  $Extra_Where  AND fg.Administration <> 'None' AND (sn.Screening IN ('Failure','Withdrawal') OR sn.Visit IN ('Withdrawal','Failure') ) " , $params);


        $enroll_results = array('enroll_data'=> $enroll_data,'enroll_data_total'=> $enroll_data_total,'enroll_data_race'=> $enroll_data_race,'enroll_data_racetotal'=>$enroll_data_racetotal,'enroll_data_hispanic'=>$enroll_data_hispanic,'enroll_data_hispanictotal'=> $enroll_data_hispanictotal , 'withdraw' => $withdraw);

        return $enroll_results; 

    } 



    function _getCrossSiteReliabilityData($name, $inst_name, $cutoff, $extra_where="") {
        $data = $this->_getSingleReliabilityData($name, $inst_name, $cutoff,
                " $extra_where AND CommentID NOT LIKE CONCAT('%', CASE reliability_center_id WHEN 1 THEN 'dcc' WHEN 2 THEN 'SEA' WHEN 3 THEN 'PHI' WHEN 4 THEN 'STL' WHEN 5 THEN 'UNC' WHEN 6 THEN 'UofA' END, '%')");
        $data['name'] = $name . ' (Cross Site)';
        return $data;
    }
    function _getWithinSiteReliabilityData($name, $inst_name, $cutoff, $extra_where = "") {
        $data = $this->_getSingleReliabilityData($name, $inst_name, $cutoff,
                " $extra_where AND CommentID like CONCAT('%', CASE reliability_center_id WHEN 1 THEN 'dcc' WHEN 2 THEN 'SEA' WHEN 3 THEN 'PHI' WHEN 4 THEN 'STL' WHEN 5 THEN 'UNC' WHEN 6 THEN 'UofA' END, '%')");
        $data['name'] = $name . ' (Within Site)';
        return $data;
    }
    function _getSingleReliabilityData($name, $inst_name, $cutoff, $extra_where = '') {
        if(isset($_REQUEST['ReliabilitySite']) && $_REQUEST['ReliabilitySite'] != '') {
            $extra_where .= ' AND c.CenterID=' . $_REQUEST['ReliabilitySite'];
        }
        if(isset($_REQUEST['ReliabilityProject']) && $_REQUEST['ReliabilityProject'] != '') {
            $ExtraProject_Criteria = ' AND (c.ProjectID IS NULL OR c.ProjectID=' . $_REQUEST['ReliabilityProject'] . ')';
        } else {
            $ExtraProject_Criteria = '';
        }

        $db = Database::singleton();
        $ret = array();
        $ret['name'] = $name;
        $ret['complete'] = $db->selectOne("SELECT count(*) from reliability r JOIN flag f USING(CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c ON (c.CandID=s.CandID) where Instrument='$inst_name' and Invalid <> 'yes' and Reliability_score IS NOT NULL AND c.CenterID <> 1 $extra_where $ExtraProject_Criteria");
        $ret['reliable'] = $db->selectOne("SELECT count(*) from reliability r JOIN flag f USING(CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c ON (c.CandID=s.CandID)where Instrument='$inst_name' and Invalid <> 'yes' and Reliability_score IS NOT NULL and Reliability_score > $cutoff AND c.CenterID <> 1 $extra_where $ExtraProject_Criteria");
        $ret['total'] = $db->selectOne("SELECT count(*) from reliability r JOIN flag f USING(CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c ON (c.CandID=s.CandID) where Instrument='$inst_name' and Invalid <> 'yes' AND c.CenterID <> 1 $extra_where $ExtraProject_Criteria");
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

    function getReliabilityData() {
        // Whether something is reliable or not isn't stored in the database,
        // but calculated on the fly. 
        // As a result, we need to manually calculate it and maintain for each
        // type of thing Tanya wants stats for here separately

        // Thresholds was copy/pasted from 
        $thresholds = NDB_Menu_Filter_Reliability::getThreshholds();
        
        $tests = array(
                'adi_r_proband' => 'ADI-R (Proband)',
                'adi_r_subject' => 'ADI-R (Subject)',
                'aosi' => 'AOSI',
                'ados_module1' => 'ADOS (Module 1)',
                'ados_module2' => 'ADOS (Module 2)',
                'csbs' => 'CSBS'

                );
        $within_cross = array('adi_r_subject', 'ados_module1', 'ados_module2', 'aosi', 'csbs');

        $reliable = array();
        $within_reliable = array();
        $across_reliable = array();
        foreach($tests as $inst => $name) {
            if(in_array($inst, $within_cross)) {
                if($inst == 'aosi') {
                    $within_reliable[] = $this->_getWithinSiteReliabilityData(
                            $name . " v06", 
                            $inst, $thresholds[$inst], 
                            " AND EXISTS (SELECT 'x' FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE f.CommentID=r.CommentID and lower(s.Visit_label)='v06')");
                    $across_reliable[] = $this->_getCrossSiteReliabilityData(
                            $name . " v06", 
                            $inst, $thresholds[$inst], 
                            " AND EXISTS (SELECT 'x' FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE f.CommentID=r.CommentID and lower(s.Visit_label)='v06')");
                    $within_reliable[] = $this->_getWithinSiteReliabilityData(
                            $name . " v12", 
                            $inst, $thresholds[$inst], 
                            " AND EXISTS (SELECT 'x' FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE f.CommentID=r.CommentID and lower(s.Visit_label)='v12')");
                    $across_reliable[] = $this->_getCrossSiteReliabilityData(
                            $name . " v12", 
                            $inst, $thresholds[$inst], 
                            " AND EXISTS (SELECT 'x' FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE f.CommentID=r.CommentID and lower(s.Visit_label)='v12')");
                } else {
                    $within_reliable[] = $this->_getWithinSiteReliabilityData($name, 
                            $inst, $thresholds[$inst]);
                    $across_reliable[] = $this->_getCrossSiteReliabilityData($name, 
                            $inst, $thresholds[$inst]);
                }
            } else {
                $within_reliable[] = $this->_getSingleReliabilityData($name, 
                        $inst, $thresholds[$inst]);
            }
        }

        return array_merge($across_reliable, $within_reliable);
    }
} // End class
?>
