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

class NDB_Form_dashboard extends NDB_Form {

    function _getTotalGender($gender) {
       $DB =& Database::singleton(); 
        $total = $DB->pselectOne(
                    "SELECT count(c.CandID) FROM candidate c WHERE c.Gender='$gender'", array()
        );
        return $total;
    }

    function _recruitmentBySite() {
        $DB =& Database::singleton();
        $recruitmentData = array();
        $recruitmentStartDate = $DB->pselectOne(
            "SELECT min(Date_registered) FROM candidate", array()
        );
        $recruitmentEndDate = $DB->pselectOne(
            "SELECT max(Date_registered) FROM candidate", array()
        );
        $recruitmentData['labels'] = $this->_createChartLabels($recruitmentStartDate, $recruitmentEndDate);
        $list_of_sites =& Utility::getSiteList();
        foreach ($list_of_sites as $dataset) {
            $recruitmentData['datasets'][] = array(
                "name" => $dataset,
                "data" => $this->_getRecruitmentData($dataset, $recruitmentData['labels'])
            );
        }
        $recruitmentDataJSON = json_encode($recruitmentData);
        return $recruitmentDataJSON;
    }

    function _getRecruitmentData($dataset, $labels) {
        $DB =& Database::singleton();
        $data = array();
        foreach ($labels as $label) {
            $month = (strlen($label) == 6) ? substr($label, 0, 1) : substr($label, 0, 2);
            $year = substr($label, -4, 4);
            $data[]= $DB->pselectOne("SELECT count(c.CandID) FROM candidate c LEFT JOIN psc ON (psc.CenterID=c.CenterID) WHERE psc.Name='$dataset' AND MONTH(Date_registered)=$month AND YEAR(Date_registered)=$year", array());
        }
        return $data;
    }

    function _scansBySite() {
        $DB =& Database::singleton();
        $scanData = array();
        $scanStartDate = $DB->pselectOne(
            "SELECT min(AcquisitionDate) FROM mri_acquisition_dates", array()
        );
        $scanEndDate = $DB->pselectOne(
            "SELECT max(AcquisitionDate) FROM mri_acquisition_dates", array()
        );
        $scanData['labels'] = $this->_createChartLabels($scanStartDate, $scanEndDate);
        $list_of_sites =& Utility::getSiteList();
        foreach ($list_of_sites as $dataset) {
            $scanData['datasets'][] = array(
                "name" => $dataset,
                "data" => $this->_getScanData($dataset, $scanData['labels'])
            );
        }
        $scanDataJSON = json_encode($scanData);
        print_r($scanDataJSON);
        return $scanDataJSON;
    }

    function _getScanData($dataset, $labels) {
        $DB =& Database::singleton();
        $data = array();
        foreach ($labels as $label) {
            $month = (strlen($label) == 6) ? substr($label, 0, 1) : substr($label, 0, 2);
            $year = substr($label, -4, 4);
            $data[]= $DB->pselectOne(
                "SELECT count(f.FileID) 
                FROM files f
                LEFT JOIN mri_acquisition_dates mad ON (mad.SessionID=f.SessionID)
                LEFT JOIN session s ON (s.ID=f.SessionID) 
                LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
                WHERE psc.Name='$dataset' 
                AND MONTH(mad.AcquisitionDate)=$month AND YEAR(mad.AcquisitionDate)=$year", array());
        }
        return $data;
    }

    function _createChartLabels($startDate, $endDate) {
        $startDateYear = substr($startDate, 0, 4);
        $endDateYear = substr($endDate, 0, 4);
        $startDateMonth = substr($startDate, 5, 2);
        $endDateMonth = substr($endDate, 5, 2);
        $labels = array();
        for ($year = (int)$startDateYear; $year <= (int)$endDateYear; $year++) {
            $startMonth = ($year == (int)$startDateYear) ? (int)$startDateMonth : 1;
            $endMonth = ($year == (int)$endDateYear) ? (int)$endDateMonth : 12;
            for ($month = $startMonth; $month <= $endMonth; $month++) {
                $labels[] = $month . "/" . $year;
            }
        }
        return $labels;
    }

	function dashboard() {
        $DB =& Database::singleton();
        $user =& User::singleton();
		$this->tpl_data = array();
		$config =& NDB_Config::singleton();

		// Welcome panel
		$this->tpl_data['username'] = $user->getFullname();
		$this->tpl_data['project_description'] = $config->getSetting('projectDescription');
		$dashboard_links = $config->getSetting('dashboardLinks');
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

        // Recruitment totals - need to have case where total is greater than target
        $recruitmentTarget = $config->getSetting('recruitmentTarget');
        $totalFemales = $this->_getTotalGender("female");
        $this->tpl_data['female_total'] = $totalFemales;
        $this->tpl_data['female_percent'] = $totalFemales/$recruitmentTarget*100;
        $totalMales = $this->_getTotalGender("male");
        $this->tpl_data['male_total'] = $totalMales;
        $this->tpl_data['male_percent'] = $totalMales/$recruitmentTarget*100;

        // Charts
        $this->tpl_data['recruitment_chart'] = $this->_recruitmentBySite();
        $this->tpl_data['scan_chart'] = $this->_scansBySite();

        // Tasks
        $this->tpl_data['new_scans'] = 10;
        $this->tpl_data['conflicts'] = $DB->pselectOne("SELECT count(*) FROM conflicts_unresolved", array());
        $this->tpl_data['uncompleted_forms'] = 10;
	}
	
}
?>