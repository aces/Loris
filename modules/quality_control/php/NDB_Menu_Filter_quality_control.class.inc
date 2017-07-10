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
 * @author   Liza Levitis <lthomas.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Menu_Filter_Quality_Control extends NDB_Menu_Filter
{	
	public $hasWritePermission = false;
	public $AjaxModule         = true;

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
		return $user->hasPermission('data_team_helper');
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


        // Form Elements

        $this->addSelect('visitLabels', 'Visit Label', $visitList);
        $this->addSelect('instruments', 'Instruments', $instrumentList);
        $this->addBasicText('DCCID', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('site', 'Site', $siteList);
        $this->addSelect('project', 'Project',$projectList);


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

		$query= 
		" FROM mri_upload m LEFT JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID) LEFT JOIN flag f ON (f.SessionID = t.SessionID AND f.CommentID not like 'DDE%')";

		$where = " WHERE f.CommentID NOT IN (SELECT CommentId FROM mri_parameter_form) OR f.CommentID IN (SELECT CommentID from mri_parameter_form mpf where (mpf.T1_Scan_done !='Complete' or mpf.T1_scan_done!= 'Partial'))";
		
		$this->query = $query.$where;
		error_log($this->query);

		$this->columns = array('UploadID', 'UploadedBy', 'UploadDate', 'f.SessionID' , 'CenterName', 't.PatientName', 'ArchiveLocation');

		$this->group_by = 't.PatientName, f.SessionID, UploadID, ArchiveLocation, t.CenterName';
		//$this->order_by = '';
		$this->headers = ['UploadID','Uploaded By', 'Upload Date', 'SessionID', 'Center Name', 'PatientName', 'Archive Location'];

		$this->validFilters = array('CenterName');
		$this->formToFilter = array('for_site' => 'CenterName');

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
