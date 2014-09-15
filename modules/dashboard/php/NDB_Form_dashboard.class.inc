<?php
/**
 * This file contains code to create the Dashboard
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once "NDB_Form.class.inc";
require_once "Utility.class.inc";

/**
 * This file contains code to create the Dashboard
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class NDB_Form_dashboard extends NDB_Form
{

    function _getTotalGender($gender)
    {
        $DB =& Database::singleton(); 
        $total = $DB->pselectOne(
            "SELECT count(c.CandID) FROM candidate c WHERE c.Gender=:Gender", 
            array('Gender' => $gender)
        );
        return $total;
    }

    function _recruitmentBySite()
    {
        $DB =& Database::singleton();
        $recruitmentData = array();
        $recruitmentStartDate = $DB->pselectOne(
            "SELECT min(Date_registered) FROM candidate", array()
        );
        $recruitmentEndDate = $DB->pselectOne(
            "SELECT max(Date_registered) FROM candidate", array()
        );
        $recruitmentData['labels'] 
            = $this->_createChartLabels($recruitmentStartDate, $recruitmentEndDate);
        $list_of_sites =& Utility::getSiteList();
        foreach ($list_of_sites as $dataset) {
            $recruitmentData['datasets'][] = array(
                "name" => $dataset,
                "data" => $this->_getRecruitmentData(
                    $dataset, $recruitmentData['labels']
                )
            );
        }
        $recruitmentDataJSON = json_encode($recruitmentData);
        return $recruitmentDataJSON;
    }

    function _getRecruitmentData($dataset, $labels)
    {
        $DB =& Database::singleton();
        $data = array();
        foreach ($labels as $label) {
            $month = (strlen($label) == 6) 
                ? substr($label, 0, 1) : substr($label, 0, 2);
            $year = substr($label, -4, 4);
            $data[]= $DB->pselectOne(
                "SELECT count(c.CandID) FROM candidate c 
                LEFT JOIN psc ON (psc.CenterID=c.CenterID) 
                WHERE psc.Name=:Dataset AND MONTH(Date_registered)=$month 
                AND YEAR(Date_registered)=:Year", 
                array('Dataset' => $dataset, 'Year' => $year)
            );
        }
        return $data;
    }

    function _scansBySite()
    {
        $DB =& Database::singleton();
        $scanData = array();
        $scanStartDate = $DB->pselectOne(
            "SELECT min(AcquisitionDate) FROM mri_acquisition_dates", array()
        );
        $scanEndDate = $DB->pselectOne(
            "SELECT max(AcquisitionDate) FROM mri_acquisition_dates", array()
        );
        $scanData['labels'] 
            = $this->_createChartLabels($scanStartDate, $scanEndDate);
        $list_of_sites =& Utility::getSiteList();
        foreach ($list_of_sites as $dataset) {
            $scanData['datasets'][] = array(
                "name" => $dataset,
                "data" => $this->_getScanData($dataset, $scanData['labels'])
            );
        }
        $scanDataJSON = json_encode($scanData);
        return $scanDataJSON;
    }

    function _getScanData($dataset, $labels)
    {
        $DB =& Database::singleton();
        $data = array();
        foreach ($labels as $label) {
            $month = (strlen($label) == 6) 
                ? substr($label, 0, 1) : substr($label, 0, 2);
            $year = substr($label, -4, 4);
            $data[]= $DB->pselectOne(
                "SELECT count(f.FileID) 
                FROM files f
                LEFT JOIN mri_acquisition_dates mad ON (mad.SessionID=f.SessionID)
                LEFT JOIN session s ON (s.ID=f.SessionID) 
                LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                WHERE psc.Name=:Dataset 
                AND MONTH(mad.AcquisitionDate)=:Month 
                AND YEAR(mad.AcquisitionDate)=:Year", 
                array('Dataset' => $dataset, 'Month' => $month, 'Year' => $year)
            );
        }
        return $data;
    }

    function _createChartLabels($startDate, $endDate)
    {
        $startDateYear = substr($startDate, 0, 4);
        $endDateYear = substr($endDate, 0, 4);
        $startDateMonth = substr($startDate, 5, 2);
        $endDateMonth = substr($endDate, 5, 2);
        $labels = array();
        for ($year = (int)$startDateYear; $year <= (int)$endDateYear; $year++) {
            $startMonth = ($year == (int)$startDateYear) ? (int)$startDateMonth : 1;
            $endMonth = ($year == (int)$endDateYear) ? (int)$endDateMonth : 12;
            for ($month = $startMonth; $month <= $endMonth; $month++) {
                $labels[] = $month . "-" . $year;
            }
        }
        return $labels;
    }

    function dashboard()
    {
        $DB =& Database::singleton();
        $user =& User::singleton();
        $this->tpl_data = array();
        $config =& NDB_Config::singleton();
        $site = $user->getSiteName();
        $siteID = $DB->pselectOne(
            "SELECT CenterID FROM psc WHERE Name=:Site", array('Site' => $site)
        );
        $userID = $user->getUsername();
        $last_login = $DB->pselectOne(
            "SELECT max(Login_timestamp) 
            FROM user_login_history 
            WHERE userID=:UserID AND Success='Y'", array('UserID' => $userID)
        );
        $this->tpl_data['user_site'] = $siteID;

        // Welcome panel
        $this->tpl_data['username'] = $user->getFullname();
        $this->tpl_data['last_login'] = $last_login;
        $this->tpl_data['project_description'] 
            = $config->getSetting('projectDescription');
        $dashboard_links = $config->getSetting('dashboardLinks');
        if (!empty($dashboard_links)) {
            foreach (Utility::toArray($dashboard_links['link']) AS $link) {
                $LinkArgs = '';
                $BaseURL = $link['@']['url'];
                if (isset($link['@']['args'])) {
                    $LinkArgs = $link_args[$link['@']['args']];
                }
                $LinkLabel = $link['#'];
                $WindowName = md5($link['@']['url']);
                $this->tpl_data['dashboard_links'][] = array(
                        'url'        => $BaseURL . $LinkArgs,
                        'label'      => $LinkLabel,
                        'windowName' => $WindowName
                );
            }
        }

        // Recruitment totals
        $totalRecruitment = $DB->pselectOne(
            "SELECT count(*) FROM candidate c", array()
        );
        $this->tpl_data['total_recruitment'] = $totalRecruitment;

        $recruitmentTarget = $config->getSetting('recruitmentTarget');

        if (!empty($recruitmentTarget)) {
            $this->tpl_data['recruitment_target'] = $recruitmentTarget;
            $totalFemales = $this->_getTotalGender("female");
            $this->tpl_data['female_total'] = $totalFemales;
            $this->tpl_data['female_percent'] 
                = round($totalFemales/$recruitmentTarget*100);
            $totalMales = $this->_getTotalGender("male");
            $this->tpl_data['male_total'] = $totalMales;
            $this->tpl_data['male_percent'] 
                = round($totalMales/$recruitmentTarget*100);
            if ($totalRecruitment > $recruitmentTarget) {
                $this->tpl_data['surpassed_recruitment'] = "true";
                $this->tpl_data['female_full_percent'] 
                    = round($totalFemales/$totalRecruitment*100);
                $this->tpl_data['male_full_percent'] 
                    = round($totalMales/$totalRecruitment*100);
            }
        }

        // Charts
        $this->tpl_data['total_scans'] = $DB->pselectOne(
            "SELECT count(*) FROM files f", array()
        );
        $this->tpl_data['recruitment_chart'] = $this->_recruitmentBySite();
        $this->tpl_data['scan_chart'] = $this->_scansBySite();

        // Tasks
        if ($user->hasPermission('mri_feedback')) {
            $this->tpl_data['new_scans'] = $DB->pselectOne(
                "SELECT count(*) FROM files f 
                LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID) 
                WHERE fqc.QCStatus IS NULL", array()
            );
            $this->tpl_data['new_scans_site'] = 'Site: all';
        }
        if ($user->hasPermission('conflict_resolver')) {
            if ($user->hasPermission('access_all_profiles')) {
                $this->tpl_data['conflicts'] = $DB->pselectOne(
                    "SELECT count(*) FROM conflicts_unresolved", array()
                );
                $this->tpl_data['conflicts_site'] = 'Site: all';
            } else {
                $this->tpl_data['conflicts'] = $DB->pselectOne(
                    "SELECT count(*) FROM conflicts_unresolved cu 
                    LEFT JOIN flag ON (cu.CommentId1=flag.CommentID) 
                    LEFT JOIN session s ON (flag.SessionID=s.ID) 
                    LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                    WHERE psc.Name=:Site", array('Site' => $site)
                );
                $this->tpl_data['conflicts_site'] = 'Site: ' . $site;
            }
        }
        if ($user->hasPermission('data_entry')) {
            if ($user->hasPermission('access_all_profiles')) {
                $this->tpl_data['incomplete_forms'] = $DB->pselectOne(
                    "SELECT count(*) FROM flag WHERE Data_entry='In Progress'", 
                    array()
                );
                $this->tpl_data['incomplete_forms_site'] = 'Site: all';
            } else {
                $this->tpl_data['incomplete_forms'] = $DB->pselectOne(
                    "SELECT count(*) FROM flag 
                    LEFT JOIN session s ON (flag.SessionID=s.ID) 
                    LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                    WHERE Data_entry='In Progress' AND psc.Name=:Site", 
                    array('Site' => $site)
                );
                $this->tpl_data['incomplete_forms_site'] = 'Site: ' . $site;
            }
        }
        if ($user->hasPermission('edit_final_radiological_review')) {
            $this->tpl_data['radiology_review'] = $DB->pselectOne(
                "SELECT count(*) FROM final_radiological_review f 
                WHERE Review_Done IS NULL", array()
            );
            $this->tpl_data['radiology_review_site'] = 'Site: all';
        }

        if ($user->hasPermission('user_accounts_multisite')) {
            $this->tpl_data['pending_users'] = $DB->pselectOne(
                "SELECT count(*) FROM users WHERE Pending_approval='Y'", array()
            );
            $this->tpl_data['pending_users_site'] = 'Site: all';
        } elseif ($user->hasPermission('user_accounts')) {
            $this->tpl_data['pending_users'] = $DB->pselectOne(
                "SELECT count(*) FROM users 
                WHERE Pending_approval='Y' AND CenterID=$siteID", array()
            );
            $this->tpl_data['pending_users_site'] = 'Site: ' . $site;
        }

        if ($user->hasPermission('violated_scans')) {
            $this->tpl_data['violated_scans'] = $DB->pselectOne(
                "SELECT count(*) FROM mri_protocol_violated_scans", array()
            );
            $this->tpl_data['violated_scans_site'] = 'Site: all';
        }

        // Document Repository
        if ($user->hasPermission('file_upload')) {
            $document_repository = $DB->pselect(
                "SELECT File_name, Date_uploaded FROM document_repository 
                ORDER BY Date_uploaded DESC LIMIT 4", array()
            );
            for ($i=0; $i < sizeof($document_repository); $i++) {
                if ($document_repository[$i]['Date_uploaded'] > $last_login) {
                    $document_repository[$i]['new'] = 1;
                } else {
                    $document_repository[$i]['new'] = 0;
                }
            }
            $this->tpl_data['document_repository_notifications'] 
                = $document_repository;
        }
    }
}
?>