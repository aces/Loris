<?php
/**
 * This file contains the NDB_Menu_Filter_quality_control class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality Control
 * @author   Liza Levitis <lthomas.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
/**
 * Behavioural QC Class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality Control
 * @author   Leo Thomas <lthomas.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Menu_Filter_Quality_Control extends NDB_Menu_Filter
{	
	public $hasWritePermission = false;
	public $AjaxModule         = true;

	public $errors  = array(
						0 => "No MRI paramter form",
						1 => "T1 Scan done NOT Partial or Complete in MRI parameter form"
						);

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
		return $user->hasPermission('superuser');
	}
	/**
	 * Override default behaviour, since the page is loaded from qualityControlIndex.js
	 *
	 * @return void
	 * @access public
	 */
	function display()
	{
		return null;
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

        $user =& User::singleton();
        $db   = Database::singleton();

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

        $uploaderList =[];
        $uploaders = $db -> pselect(
        	"SELECT UploadedBy FROM mri_upload GROUP BY UploadedBy" , array());
        foreach($uploaders as $up){
        	$uploaderList[$up['UploadedBy']] = $up['UploadedBy'];
        }
        $namesList =[];
        $patientNames = $db->pselect(
        	"SELECT PatientName FROM tarchive GROUP BY PatientName", array());
        foreach($patientNames as $pn){
        	$namesList[$pn['PatientName']] = $pn['PatientName'];
        }

        // Form Elements

        $this->addSelect('error_message', 'Error Message', $this->errors);
        $this->addSelect('UploadedBy', 'Uploaded By', $uploaderList);
		$this->addSelect('PatientName', 'Patient ID', $namesList);
	    $this->addSelect('site', 'Site', $siteList);


       // $this->tpl_data["hasWritePermission"] = $this->hasWritePermission;


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
		
		$db =& Database::singleton();
		/*
		$query = "
			FROM mri_upload m 
			LEFT JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID) 
			LEFT JOIN flag f ON (f.SessionID = t.SessionID and f.CommentID not like 'DDE%') 
			WHERE f.CommentID NOT IN (SELECT CommentId FROM mri_parameter_form) 
			GROUP BY t.PatientName ,f.SessionID, UploadID, t.CenterName 
			UNION 
			SELECT m.UploadedBy, UploadDate, f.SessionID,t.PatientName, t.CenterName, (\"".$this->errors[1]."\") as message, (f.CommentID) as CommentID 
			FROM mri_upload m 
			LEFT JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID) 
			LEFT JOIN flag f ON (f.SessionID = t.SessionID and f.CommentID not like 'DDE%') 
			WHERE f.CommentID IN (
				SELECT CommentID 
				FROM mri_parameter_form mpf 
				WHERE (mpf.T1_Scan_done !='Complete' or mpf.T1_scan_done!= 'Partial')
				)";
		*/
		$query= "
			FROM mri_upload m 
			JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID) 
			JOIN flag f ON (f.SessionID = t.SessionID and f.CommentID not like 'DDE%') 
			WHERE f.CommentID IN (
				SELECT CommentID 
				FROM mri_parameter_form mpf 
				WHERE (mpf.T1_Scan_done !='Complete' OR mpf.T1_scan_done!= 'Partial')
				)";
		$this->query = $query;
		$this->columns = array("m.UploadedBy", "UploadDate", 't.PatientName', 't.CenterName', '("'.$this->errors[1].'") as message','(" ") as action',  'f.CommentID as CommentID');
		
		//$this->columns = array('m.UploadedBy', 'UploadDate', 'f.SessionID' , 't.PatientName', 't.CenterName', '("'.$this->errors[0].'") as message ', '(" ") as CommentID ');
		
		$this->group_by = 't.PatientName, f.SessionID, UploadID, t.CenterName, CommentID';

		$this->order_by = ' UploadDate ';
		
		$this->headers = ['Uploaded By', 'Upload Date', 'Patient Name', 'Location', 'Message', 'Action', 'CommentID'];

		
		$this->validFilters = array('m.UploadedBy','message');
		$this->formToFilter = array(
			'UploadedBy' => 'm.UploadedBy',
			'error_message' => 'message');
		
		//$this->tpl_data['hiddenHeaders'] = json_encode(['CommentID']);


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
