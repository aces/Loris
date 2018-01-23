<?php
/**
 * The welcome menu
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\statistics;

/**
 * The welcome menu
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Stats_Demographic extends \NDB_Form
{
    /**
     * Checking user's permission
     *
     * @return bool
     */
    function _hasAccess()
    {
        $user =& \User::singleton();
        return $user->hasPermission('data_entry');
    }
    /**
     * InCenter function
     *
     * @param string $centerID the value of centreID
     * @param string $Centres  the value of Centres
     *
     * @return bool
     */
    function _inCenter($centerID, $Centres)
    {
        foreach ($Centres as $Centre) {
            if ($Centre['NumericID'] == $centerID) {
                return true;
            }
        }
        return false;
    }
    /**
     * RenderStatsTable function
     *
     * @param string $sectionHeader     the value of sectionHeader
     * @param string $tableHeader       the value of tableHeader
     * @param string $subcats           the value of subcats
     * @param string $visits            the value of visits
     * @param string $dropdown_name     the value of dropdown_name
     * @param string $dropdown_opt      the value of dropdown_opt
     * @param string $dropdown_selected the value of dropdown_selected
     * @param string $centres           the value of centres
     * @param string $data              the value of data
     * @param string $Subsection        the value of Subsection=''
     * @param string $disclamer         the value of disclamer=''
     * @param string $projectID         the value of projectID is null
     *
     * @return string
     */
    function renderStatsTable($sectionHeader,
        $tableHeader,
        $subcats,
        $visits,
        $dropdown_name,
        $dropdown_opt,
        $dropdown_selected,
        $centres,
        $data,
        $Subsection="",
        $disclamer='',
        $projectID=null
    ) {

        $tpl_data = array();
        $tpl_data['test_name']  = htmlspecialchars($_REQUEST['test_name']);
        $tpl_data['Subsection'] = $Subsection;
        $tpl_data['Visits']     = $visits;
        $smarty = new \Smarty_neurodb("statistics");
        $tpl_data['SectionHeader'] = $sectionHeader;
        $tpl_data['TableHeader']   = $tableHeader;
        $tpl_data['Disclamer']     = $disclamer;
        $tpl_data['Subcategories'] = $subcats;
        $tpl_var = \Utility::getSubprojectsForProject($projectID);
        $tpl_data['Subprojects']      = $tpl_var;
        $tpl_data['DropdownName']     = $dropdown_name;
        $tpl_data['DropdownOptions']  = $dropdown_opt;
        $tpl_data['DropdownSelected'] = $dropdown_selected;
        $tpl_data['Centers']          = $centres;
        foreach ($data as $row) {
            $subproj = $row['SubprojectID'];
            $vl      = $row['VLabel'];
            $subcat  = $row['Subcat'];
            $center  = $row['CenterID'];

            if (in_array($vl, $visits)
                && in_array($subcat, $subcats)
                && $this->_inCenter($center, $centres)
            ) {
                $C = 'C' . $center;
                $tpl_data['data'][$subproj][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$subproj][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj][$subcat]      += $row['val'];
                $tpl_data['data'][$subproj]['total']      += $row['val'];
                $tpl_data['data'][$vl][$subcat]           += $row['val'];
                $tpl_data['data'][$vl]['total']           += $row['val'];
                $tpl_data['data'][$subproj][$C][$vl][$subcat]  = $row['val'];
                $tpl_data['data'][$subproj][$C][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj][$C][$subcat]      += $row['val'];
                $tpl_data['data'][$subproj][$C]['total']      += $row['val'];
                $tpl_data['data'][$C][$vl][$subcat]           += $row['val'];
                $tpl_data['data'][$C][$vl]['total']           += $row['val'];
                $tpl_data['data'][$C][$subcat] += $row['val'];
                $tpl_data['data'][$C]['total'] += $row['val'];
                $tpl_data['data'][$subcat]     += $row['val'];
                $tpl_data['data']['total']     += $row['val'];
            }

        }
        $smarty->assign($tpl_data);
        $html = $smarty->fetch("table_statistics.tpl");
        return $html;

    }

    /**
     * Stats_demographic function
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this     page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return void
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $DB          =& \Database::singleton();
        $config      = \NDB_Config::singleton();
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
        foreach (\Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }
        $currentProject = null;
        if ($_REQUEST['DemographicProject'] ?? ''
        ) {
            $currentProject = htmlspecialchars($_REQUEST['DemographicProject']);
            $this->tpl_data['CurrentProject']
                = array(
                   'ID'   => $currentProject,
                   'Name' => $projects[$currentProject],
                  );
            $Param_Project       ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid'] = htmlspecialchars($_REQUEST['DemographicProject']);
        } else {
            $Param_Project ='';
        }

        //SUBPROJECTS
        $subprojList ="";
        $subprojects = \Utility::getSubprojectsForProject($currentProject);
        foreach ($subprojects as $key=>$val) {
            $subprojList .= $key.",";
        }
        $subprojList = substr($subprojList, 0, -1);
        if (!empty($subprojList)) {
            $suproject_query ="AND s.SubprojectID IN ($subprojList)";
        } else {
            $suproject_query ='';
        }

        //SITES
        if ($_REQUEST['DemographicSite'] ?? ''
        ) {
            $Param_Site          ='AND (c.CenterID IS NULL OR c.CenterID=:sid) ';
            $this->params['sid'] = htmlspecialchars($_REQUEST['DemographicSite']);
        } else {
            $Param_Site = '';
        }
        $centers     = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    IFNULL(PSCArea,Name) as LongName,
                    Name as ShortName
              FROM psc
              WHERE CenterID <> '1'
                AND Study_site = 'Y'",
            array()
        );
        $sites[null] ="All sites";
        foreach ($centers as $row) {
            $sites[$row['NumericID']] = $row['ShortName'];
            if ($_REQUEST['DemographicSite'] == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array(
                                                  'ID'   => $row['NumericID'],
                                                  'Name' => $row['LongName'],
                                                 );
            }
        }

        $Visits = \Utility::getExistingVisitLabels($currentProject);

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
                          AND c.Entity_type != 'Scanner'
                          AND c.Active = 'Y'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach ($result as $row) {
            $this->tpl_data['registered'][$row['rowid']] = $row['val'];
            $this->tpl_data['registered']['total']      += $row['val'];
        }

        //PARTICIPANT STATUS ACTIVE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND (ps.participant_status=1
                               OR ps.participant_status IS NULL)
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach ($result as $row) {
            $this->tpl_data['ps_active'][$row['rowid']] = $row['val'];
            $this->tpl_data['ps_active']['total']      += $row['val'];
        }

        //PARTICIPANT STATUS INACTIVE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND ps.participant_status=5
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach ($result as $row) {
            $this->tpl_data['ps_inactive'][$row['rowid']] = $row['val'];
            $this->tpl_data['ps_inactive']['total']      += $row['val'];
        }

        //MALE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND (ps.participant_status=1 OR
                               ps.participant_status IS NULL)
                          AND c.Gender='Male'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach ($result as $row) {
            $this->tpl_data['gender_male'][$row['rowid']] = $row['val'];
            $this->tpl_data['gender_male']['total']      += $row['val'];
        }
        //FEMALE
        $result = $DB->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND (ps.participant_status=1
                               OR ps.participant_status IS NULL)
                          AND c.Gender='Female'
                          $Param_Project
                          $Param_Site
                      GROUP BY s.subprojectid",
            $this->params
        );

        foreach ($result as $row) {
            $this->tpl_data['gender_female'][$row['rowid']] = $row['val'];
            $this->tpl_data['gender_female']['total']      += $row['val'];
        }

        //AGE AVERAGE
        $result = $DB->pselect(
            "SELECT rowid, AVG(DATEDIFF(dr,dob)) as age
              FROM
              (SELECT DISTINCT c.CandID, s.subprojectid as rowid,
                          c.Date_registered as dr,c.DoB as dob
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND (ps.participant_status=1
                          OR ps.participant_status IS NULL)
                          AND c.Active='Y'
                          $Param_Project
                          $Param_Site) 
                                as res
              GROUP BY rowid",
            $this->params
        );

        foreach ($result as $row) {
            $this->tpl_data['age_avg'][$row['rowid']] = round($row['age']*12/365, 2);
        }

        //START BIG TABLE
        $inst_dropdown   = array_merge(
            array( '' => 'Recruit Breakdown by Sex'),
            \Utility::getAllInstruments()
        );
        $instrument_list = \Utility::getAllInstruments();
        $this->tpl_data['all_instruments'] = $instrument_list;
        if ($_REQUEST['DemographicInstrument'] ?? ''
        ) {
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
                    JOIN ".$DB->escape($_REQUEST['DemographicInstrument']).
                    " i USING(CommentID)
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
                    JOIN ".$DB->escape($_REQUEST['DemographicInstrument']).
                    " i USING(CommentID)
                WHERE s.Active='Y' AND s.CenterID <> 1
                    $Param_Project
                    AND f.CommentID NOT LIKE 'DDE%'
                    AND (f.Data_entry IS NULL OR f.Data_entry <> 'Complete')
                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                ",
                $this->params
            );
            $this->tpl_data['RecruitsTable'] = $this->renderStatsTable(
                "Breakdown of Registered Candidates",
                "Data Entry Completion Status for ".
                      $instrument_list[$_REQUEST['DemographicInstrument']],
                $Subcategories,
                $Visits,
                "DemographicInstrument",
                $inst_dropdown,
                $_REQUEST['DemographicInstrument'],
                $centers,
                $result,
                "demographics",
                '',
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
            $this->tpl_data['RecruitsTable'] = $this->renderStatsTable(
                "Breakdown of Registered Candidates",
                "Breakdown by Sex",
                $Subcategories,
                $Visits,
                "DemographicInstrument",
                $inst_dropdown,
                '',
                $centers,
                $result,
                "demographics",
                '',
                $currentProject
            );
        }
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the statistics menu
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
             $baseURL . "/statistics/js/table_statistics.js",
             $baseURL . "/statistics/js/form_stats_demographic.js",
            )
        );
    }
    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/statistics/css/statistics.css")
        );
    }

}

