<?php
/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\statistics;

/**
 * The module to display study statistics
 *
 * PHP Version 7
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
     * The default params
     */
    protected $params = null;

    /**
     * Checking user's permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_entry');
    }

    /**
     * InCenter function
     *
     * @param string $centerID the value of centerID
     * @param array  $centers  the value of Centers
     *
     * @return bool
     */
    function _inCenter($centerID, $centers)
    {
        foreach ($centers as $center) {
            if ($center['NumericID'] == $centerID) {
                return true;
            }
        }
        return false;
    }
    /**
     * RenderStatsTable function
     *
     * @param string $sectionHeader    the value of sectionHeader
     * @param string $tableHeader      the value of tableHeader
     * @param string $subcats          the value of subcats
     * @param string $visits           the value of visits
     * @param string $dropdownName     the value of dropdownName
     * @param string $dropdownOpt      the value of dropdownOpt
     * @param string $dropdownSelected the value of dropdownSelected
     * @param array  $centers          the value of centers
     * @param array  $data             the value of data
     * @param string $subsection       the value of subsection=''
     * @param string $disclamer        the value of disclamer=''
     * @param string $projectID        the value of projectID is null
     *
     * @return string
     */
    function renderStatsTable($sectionHeader,
        $tableHeader,
        $subcats,
        $visits,
        $dropdownName,
        $dropdownOpt,
        $dropdownSelected,
        $centers,
        $data,
        $subsection='',
        $disclamer='',
        $projectID=null
    ) {
        // This line replaces the empty $projectID string with null
        // `$projectID ?? null` would retain empty strings.
        $projectID = empty($projectID) ? null : $projectID;
        $tpl_data  = array();
        $tpl_data['test_name']  = isset($_REQUEST['test_name']) ?
            htmlspecialchars($_REQUEST['test_name']) : '';
        $tpl_data['Subsection'] = $subsection;
        $tpl_data['Visits']     = $visits;
        $smarty = new \Smarty_neurodb('statistics');
        $tpl_data['SectionHeader'] = $sectionHeader;
        $tpl_data['TableHeader']   = $tableHeader;
        $tpl_data['Disclamer']     = $disclamer;
        $tpl_data['Subcategories'] = $subcats;
        $tpl_var = \Utility::getSubprojectsForProject(intval($projectID));
        $tpl_data['Subprojects']      = $tpl_var;
        $tpl_data['DropdownName']     = $dropdownName;
        $tpl_data['DropdownOptions']  = $dropdownOpt;
        $tpl_data['DropdownSelected'] = $dropdownSelected;
        $tpl_data['Centers']          = $centers ?? array();
        foreach ($data as $row) {
            $subproj = $row['SubprojectID'];
            $vl      = $row['VLabel'];
            $subcat  = $row['Subcat'];
            $center  = $row['CenterID'];

            if (in_array($vl, $visits)
                && in_array($subcat, $subcats)
                && $this->_inCenter($center, $centers)
            ) {
                $C = 'C' . $center;
                $tpl_data['data'][$subproj][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$subproj][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj][$subcat]      += $row['val'];
                $tpl_data['data'][$subproj]['total']      += $row['val'];
                $tpl_data['data'][$vl][$subcat]           += $row['val'];
                $tpl_data['data'][$vl]['total']           += $row['val'];
                $tpl_data['data'][$subproj][$C][$vl][$subcat] += $row['val'];
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
        $html = $smarty->fetch('table_statistics.tpl');
        return $html;

    }

    /**
     * Stats_demographic function
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        //FIXME visits is never initialized properly though it is used in
        //functions below. This declaration was added to satisfy phan but work
        //should be done to properly populate this value. Until then there is
        //the possibility of errors arising in the demographic stats.
        $visits = array();
        $db     = \Database::singleton();
        //This boolean is for optional use by project if the demographics table
        // queries any information from the mri_parameter_form table
        $this->tpl_data['mri_table_exists'] = true;
        if (!$db->tableExists('mri_parameter_form')) {
            $this->tpl_data['mri_table_exists'] = false;
            //return;
        }

        $this->tpl_data['showTable'] = true;

        //PROJECTS
        $projects[null] = 'All Projects';
        foreach (\Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }

        $demographicProject = $_REQUEST['DemographicProject'] ?? '';
        $paramProject       = '';

        if (!empty($demographicProject)) {
            $demographicProject = htmlspecialchars($demographicProject);
            $this->tpl_data['CurrentProject']
                = array(
                   'ID'   => $demographicProject,
                   'Name' => $projects[$demographicProject] ?? '',
                  );
            $paramProject        ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid'] = $demographicProject;
        }

        //SUBPROJECTS
        $subprojectQuery = '';
        // Only search for subprojects if $demographicProject is a positive int.
        if (is_numeric($demographicProject) && intval($demographicProject) >= 0) {
            $subprojList ="";
            $subprojects = \Utility::getSubprojectsForProject($demographicProject);
            foreach ($subprojects as $key=>$val) {
                $subprojList .= $key.",";
            }
            $subprojList = substr($subprojList, 0, -1);
            if (!empty($subprojList)) {
                $subprojectQuery ="AND s.SubprojectID IN ($subprojList)";
            }
        }

        //SITES
        $demographicSite = $_REQUEST['DemographicSite'] ?? '';
        $paramSite       = '';

        if (!empty($demographicSite)) {
            $paramSite           = 'AND (s.CenterID IS NULL OR s.CenterID=:sid) ';
            $demographicSite     = htmlspecialchars($demographicSite);
            $this->params['sid'] = $demographicSite;
        }

        $centers = $db->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    IFNULL(PSCArea,Name) as LongName,
                    Name as ShortName
            FROM psc
            WHERE CenterID <> '1'
            AND Study_site = 'Y'",
            array()
        );

        $sites[null] ='All sites';

        if (!empty($centers)) {
            foreach ($centers as $row) {
                $sites[$row['NumericID']] = $row['ShortName'];
                if ($demographicSite == $row['NumericID']) {
                    $this->tpl_data['CurrentSite'] = array(
                                                      'ID'   => $row['NumericID'],
                                                      'Name' => $row['LongName'],
                                                     );
                }
            }
        }

        $this->tpl_data['Sites']       = $sites;
        $this->tpl_data['Projects']    = $projects;
        $this->tpl_data['Subprojects'] = $subprojects;
        $this->tpl_data['Visits']      = $visits;

        /**
         * REGISTERED CANDIDATES ROW
         * $paramProject and $paramSite are hardcoded strings,
         * and should be safe from SQL injection
        **/
        $result = $db->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.RegistrationCenterID <> '1'
                          AND s.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active = 'Y'
                          $paramProject
                          $paramSite
                      GROUP BY s.subprojectid",
            $this->params ?? array()
        );

        $this->tpl_data['registered']['total'] = 0;
        foreach ($result as $row) {
            $this->tpl_data['registered'][$row['rowid']] = $row['val'];
            if (isset($this->tpl_data['registered']['total'])) {
                $this->tpl_data['registered']['total'] += $row['val'];
            } else {
                $this->tpl_data['registered']['total'] = $row['val'];
            }
        }

        //PARTICIPANT STATUS ACTIVE
        $result = $db->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.RegistrationCenterID <> '1'
                          AND s.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND (ps.participant_status=1
                               OR ps.participant_status IS NULL)
                          $paramProject
                          $paramSite
                      GROUP BY s.subprojectid",
            $this->params ?? array()
        );

        $this->tpl_data['ps_active']['total'] = 0;
        foreach ($result as $row) {
            $this->tpl_data['ps_active'][$row['rowid']] = $row['val'];
            if (isset($this->tpl_data['ps_active']['total'])) {
                $this->tpl_data['ps_active']['total'] += $row['val'];
            } else {
                $this->tpl_data['ps_active']['total'] = $row['val'];
            }
        }

        //PARTICIPANT STATUS INACTIVE
        $result = $db->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE c.RegistrationCenterID <> '1'
                          AND s.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND ps.participant_status=5
                          $paramProject
                          $paramSite
                      GROUP BY s.subprojectid",
            $this->params ?? array()
        );

        $this->tpl_data['ps_inactive']['total'] = 0;
        foreach ($result as $row) {
            $this->tpl_data['ps_inactive'][$row['rowid']] = $row['val'];
            $this->tpl_data['ps_inactive']['total']      += $row['val'];
        }

        //MALE
        $result = $db->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.RegistrationCenterID <> '1'
                          AND s.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND (ps.participant_status=1 OR
                               ps.participant_status IS NULL)
                          AND c.Sex='Male'
                          $paramProject
                          $paramSite
                      GROUP BY s.subprojectid",
            $this->params ?? array()
        );

        $this->tpl_data['sex_male']['total'] = 0;
        foreach ($result as $row) {
            $this->tpl_data['sex_male'][$row['rowid']] = $row['val'];
            if (isset($this->tpl_data['sex_male']['total'])) {
                $this->tpl_data['sex_male']['total'] += $row['val'];
            } else {
                $this->tpl_data['sex_male']['total'] = $row['val'];
            }
        }

        //FEMALE
        $result = $db->pselect(
            "SELECT s.subprojectid as rowid,
                          count(DISTINCT(c.PSCID)) as val
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.RegistrationCenterID <> '1'
                          AND s.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND c.Active='Y'
                          AND (ps.participant_status=1
                               OR ps.participant_status IS NULL)
                          AND c.Sex='Female'
                          $paramProject
                          $paramSite
                      GROUP BY s.subprojectid",
            $this->params ?? array()
        );

        $this->tpl_data['sex_female']['total'] = 0;
        foreach ($result as $row) {
            $this->tpl_data['sex_female'][$row['rowid']] = $row['val'];
            if (isset($this->tpl_data['sex_female']['total'])) {
                $this->tpl_data['sex_female']['total'] += $row['val'];
            } else {
                $this->tpl_data['sex_female']['total'] = $row['val'];
            }
        }

        //AGE AVERAGE
        $result = $db->pselect(
            "SELECT rowid, AVG(DATEDIFF(dr,dob)) as age
              FROM
              (SELECT DISTINCT c.CandID, s.subprojectid as rowid,
                          c.Date_registered as dr,c.DoB as dob
                      FROM candidate as c
                      	  LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                          LEFT JOIN session s ON (s.CandID=c.CandID)
                      WHERE coalesce(s.active, 'Y')='Y'
                          AND c.RegistrationCenterID <> '1'
                          AND s.CenterID <> '1'
                          AND c.Entity_type != 'Scanner'
                          AND (ps.participant_status=1
                          OR ps.participant_status IS NULL)
                          AND c.Active='Y'
                          $paramProject
                          $paramSite) 
                                as res
              GROUP BY rowid",
            $this->params ?? array()
        );

        foreach ($result as $row) {
            $this->tpl_data['age_avg'][$row['rowid']] = round($row['age']*12/365, 2);
        }

        //START BIG TABLE
        $instrumentList = \Utility::getAllInstruments();
        $instDropdown   = array_merge(
            array( '' => 'Recruit Breakdown by Sex'),
            $instrumentList
        );
        $this->tpl_data['all_instruments'] = $instrumentList;
        $demographicInstrument = $_REQUEST['DemographicInstrument'] ?? '';
        if (!empty($demographicInstrument)) {
            $demographicInstrument = htmlspecialchars($demographicInstrument);
            $subcategories         = array(
                                      'Complete',
                                      'Incomplete',
                                     );
            $result = $db->pselect(
                "SELECT count(*) as val,
                        f.Data_entry as Subcat,
                        c.RegistrationCenterID as CenterID,
                        s.SubprojectID as SubprojectID,
                        s.visit_label as VLabel
                FROM session s
                JOIN candidate c ON (s.CandID=c.CandID)
                JOIN flag f ON (f.SessionID=s.ID)
                JOIN ".$db->escape($demographicInstrument).
                     " i USING(CommentID)
                WHERE s.Active='Y'
                AND c.RegistrationCenterID <> '1'
                AND s.CenterID <> '1'
                AND f.Data_entry='Complete'
                AND f.Administration='All'
                AND f.CommentID NOT LIKE 'DDE%'
                $paramProject
                GROUP BY c.RegistrationCenterID, SubprojectID, VLabel, Subcat
                UNION
                SELECT count(*) as val,
                       'Incomplete' as Subcat,
                       c.RegistrationCenterID as CenterID,
                       s.SubprojectID as SubprojectID,
                       s.visit_label as VLabel
                FROM session s
                JOIN candidate c USING(CandID)
                JOIN flag f ON (f.SessionID=s.ID)
                JOIN ".$db->escape($demographicInstrument).
                     " i USING(CommentID)
                WHERE s.Active='Y' 
                    AND c.RegistrationCenterID <> '1'
                    AND s.CenterID <> '1'
                    $paramProject
                    AND f.CommentID NOT LIKE 'DDE%'
                    AND (f.Data_entry IS NULL OR f.Data_entry <> 'Complete')
                GROUP BY c.RegistrationCenterID, SubprojectID, VLabel, Subcat
                ",
                $this->params ?? array()
            );
            $this->tpl_data['RecruitsTable'] = $this->renderStatsTable(
                'Breakdown of Registered Candidates',
                'Data Entry Completion Status for '.
                    $instrumentList[$demographicInstrument],
                $subcategories,
                $visits,
                'DemographicInstrument',
                $instDropdown,
                $demographicInstrument,
                $centers,
                $result,
                'demographics',
                '',
                $demographicProject
            );
        } else {
            $subcategories = array(
                              'Male',
                              'Female',
                             );
            $result        = $db->pselect(
                "SELECT s.CenterID as CenterID,
                        s.SubprojectID as SubprojectID,
                        s.visit_label as VLabel,
                        c.sex as Subcat,
                        count(s.CandID) as val
                FROM session s
                JOIN candidate c ON (s.CandID=c.CandID)
                WHERE s.active='Y' AND s.CenterID <> '1' 
                AND c.RegistrationCenterID <> '1'
                AND (s.Current_stage IN ('Visit', 'Screening', 'Approval')
                $subprojectQuery)
                AND COALESCE(s.Screening,'') NOT IN ('Failure', 'Withdrawal')
                AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')
                GROUP BY s.CenterID, SubprojectID, VLabel, Subcat",
                array()
            );
            $this->tpl_data['RecruitsTable'] = $this->renderStatsTable(
                'Breakdown of Registered Candidates',
                'Breakdown by Sex',
                $subcategories,
                $visits,
                'DemographicInstrument',
                $instDropdown,
                '',
                $centers,
                $result,
                'demographics',
                '',
                $demographicProject
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
             $baseURL . '/statistics/js/table_statistics.js',
             $baseURL . '/statistics/js/form_stats_demographic.js',
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
            array($baseURL . '/statistics/css/statistics.css')
        );
    }

}

