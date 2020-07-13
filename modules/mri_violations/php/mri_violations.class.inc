<?php
/**
 * This page implements a front end which is used to unify all
 * of the different MRI violation types (could not identify scan,
 * header violation in the scan after identifying scan type, mislabeled
 * scan, etc) and link to the appropriate module to further investigate
 * why a scan was excluded by the imaging pipeline scripts.
 *
 * PHP Version 7
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\mri_violations;
/**
 * Implement the menu filter for searching through all violated scans
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Mri_Violations extends \NDB_Menu_Filter_Form
{
    var $AjaxModule = true;

    /**
     * Check if user should be allowed to see this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if the user is permitted to see violated scans
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite'
            ]
        );
    }
    /**
     * Process function
     *
     * @param array $values the values being processed
     *
     * @return bool true if the user is permitted to see violated scans
     */
    function _process($values)
    {
        if (!is_array($values) || count($values) == 0) {
            return true;
        }
        $DB   = \Database::singleton();
        $user = \User::singleton();
        foreach ($values['resolvable'] AS $key=>$val) {
            $hash = $key;
            $row  = $DB->pselectRow(
                "SELECT * FROM violations_resolved
                    WHERE hash = :hash",
                ['hash' => $hash]
            );

            //if row is found it means that resolve status was previously assigned,
            // check the value and update if needed, else break.
            if (!empty($row)) {
                foreach ($row as $key2 => $val2) {
                    //found matching
                    if ($key2 == 'Resolved') {
                        // user input matches DB content, so do nothing.
                        if ($val==$val2) {
                            break;
                        } else {
                            // user input doesn't match DB, so we update the DB
                            $setArray   = [
                                'Resolved'   => (string)$val,
                                'ChangeDate' => date("Y-m-d H:i:s"),
                            ];
                            $whereArray = ['hash' => $hash];
                            $DB->update(
                                'violations_resolved',
                                $setArray,
                                $whereArray
                            );
                        }
                    }
                }
            } else {
                //if row is not found no resolve status was assigned,
                // if selection<>0, then insert new row.
                // no need to insert to DB for Unresolved value.
                if ($val=='unresolved') {
                    continue;
                }
                $newlyResolved         = [];
                $newlyResolved['hash'] = $key;
                $newlyResolved['Resolved']   = (string)$val;
                $newlyResolved['User']       = $user->getUsername();
                $newlyResolved['ChangeDate'] = date("Y-m-d H:i:s");

                // Table 1: mri_protocol_violated_scans
                $ID_mri_protocol_violated_scans = $DB->pselectOne(
                    "SELECT ID
                    FROM mri_protocol_violated_scans
                    WHERE (:hash = md5(concat_WS(
                              ':',minc_location,PatientName,SeriesUID,time_run)
                                   )
                    )",
                    ['hash' => $key]
                );
                if (!empty($ID_mri_protocol_violated_scans)) {
                    $newlyResolved['TypeTable'] = 'mri_protocol_violated_scans';
                    $newlyResolved['ExtID']     = $ID_mri_protocol_violated_scans;
                }

                // Table 2: mri_violations_log
                $ID_mri_violations_log = $DB->pselectOne(
                    "SELECT LogID
                    FROM mri_violations_log
                    WHERE (:hash = md5(concat_WS(
                                    ':',MincFile,PatientName,SeriesUID,TimeRun)
                                   )
                    )",
                    ['hash' => $key]
                );

                if (!empty($ID_mri_violations_log)) {
                    $newlyResolved['TypeTable'] = 'mri_violations_log';
                    $newlyResolved['ExtID']     = $ID_mri_violations_log;
                }

                // Table 3: MRICandidateErrors
                $ID_MRICandidateErrors = $DB->pselectOne(
                    "SELECT ID
                    FROM MRICandidateErrors
                    WHERE (:hash = md5(concat_WS(
                                    ':',MincFile,PatientName,SeriesUID,TimeRun)
                                   )
                    )",
                    ['hash' => $key]
                );

                if (!empty($ID_MRICandidateErrors)) {
                    $newlyResolved['TypeTable'] = 'MRICandidateErrors';
                    $newlyResolved['ExtID']     = $ID_MRICandidateErrors;
                }
                $DB->insert('violations_resolved', $newlyResolved);
            }
        }

        $this->tpl_data['success'] = true;
    }
    /**
     * Set up the class and smarty variables to use for the menu filter to
     * generate the proper query for the menu filter
     *
     * @return void
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns = [
            'v.PatientName',
            'pjct.Name as Project',
            'subpjct.title as Subproject',
            'site.Name as Site',
            'v.TimeRun',
            'v.MincFile',
            'v.Series_Description as Series_Description_Or_Scan_Type',
            'v.Problem',
            'v.SeriesUID',
            'v.hash',
            'v.join_id',
            'v.Resolved',
            'v.TarchiveID',
            'v.CandID',
            'v.PSCID'
        ];

        $this->headers = [
            'PatientName',
            'Project',
            'Subproject',
            'Site',
            'TimeRun',
            'MincFile',
            'Series_Description_Or_Scan_Type',
            'Problem',
            'SeriesUID',
            'Hash',
            'JoinID',
            'Resolution_status',
            'TarchiveID',
            'CandID',
            'PSCID'
        ];

        $this->tpl_data['hiddenHeaders'] = json_encode(
            [
                'SeriesUID',
                'Hash',
                'JoinID',
                'TarchiveID',
                'CandID',
                'PSCID'
            ]
        );

        $this->query = \LORIS\mri_violations\Module::getMriViolatedScanQuery();

        $this->order_by = 'v.TimeRun DESC';

        $this->formToFilter = [
            'PatientName' => 'v.PatientName',
            'Project'     => 'v.Project',
            'Subproject'  => 'v.Subproject',
            'TimeRun'     => 'v.TimeRun',
            'ProblemType' => 'v.Problem',
            'Filename'    => 'v.MincFile',
            'Description' => 'v.Series_Description',
            'SeriesUID'   => 'v.SeriesUID',
            'Site'        => 'v.Site',
        ];

        $this->validFilters = [
            'v.PatientName',
            'v.Project',
            'v.Subproject',
            'v.TimeRun',
            'v.MincFile',
            'v.Problem',
            'v.Series_Description',
            'v.SeriesUID',
            'v.Site',
        ];

        $this->EqualityFilters[] = 'v.Site';
    }

    /**
     * Updates the array of query parameters (if needed) for a given field.
     *
     * @param array  $qparams      array of query parameters.
     * @param string $field        field that appears in the query.
     * @param string $prepared_key string to use as a placeholder in the query
     *                             for the field.
     * @param string $val          field value.
     *
     * @return void
     *
     * @override
     */
    function _addQueryParam(&$qparams, $field, $prepared_key, $val)
    {
        // No parameter should be added for the prepared statement if
        // 'Unknown' or 'AllKnown' were selected in the site drop-down
        if ($field != 'v.Site' || ($val != 'Unknown' && $val != 'AllKnown')) {
            parent::_addQueryParam($qparams, $field, $prepared_key, $val);
        }
    }

    /**
     * Adds filters
     *
     * @param string $prepared_key filter key
     * @param string $field        filter field
     * @param string $val          filter value
     *
     * @return string ($query)
     *
     * @override
     */
    function _addValidFilters($prepared_key, $field, $val)
    {
        // The added AND clause differs from the one returned by
        // parent::__addValidFilter when 'Unknown' or 'AllKnown' are
        // selected in the sites drop-down
        if ($field == 'v.Site' && ($val == 'Unknown' || $val == 'AllKnown')) {
            return $val == 'Unknown'
                ? ' AND v.Site IS NULL'
                : ' AND v.Site IS NOT NULL';
        }

        // Standard behaviour for cases other than the above
        return parent::_addValidFilters($prepared_key, $field, $val);
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        // create user object
        $user    =& \User::singleton();
        $config  =& \NDB_Config::singleton();
        $db      =& \Database::singleton();
        $minYear = $config->getSetting('startYear') - $config->getSetting('ageMax');
        $maxYear = $config->getSetting('endYear');

        $dateOptions = [
            'language'       => 'en',
            'format'         => 'YMd',
            'addEmptyOption' => true,
            'minYear'        => $minYear,
            'maxYear'        => $maxYear,
        ];

        $problemOptions = ['' => 'Any'];

        // Build a list of existing problem types based on data in db
        $problemTypes = $db->pselect(
            "SELECT DISTINCT MRICandidateErrors.Reason FROM MRICandidateErrors
            UNION
            SELECT DISTINCT 'Could not identify scan type'
            FROM mri_protocol_violated_scans
            UNION
            SELECT DISTINCT 'Protocol Violation' FROM mri_violations_log",
            []
        );

        // Searches for reasons containing newlines will fail so we strip
        // those characters from all the entries in list
        foreach ($problemTypes as $problem) {
            $problemOptions[trim($problem['Reason'])] = trim($problem['Reason']);
        }

        $this->addBasicText('PatientName', 'Patient Name');
        $this->addBasicText('Description', 'Series Description or Scan Type');
        $this->addBasicDate('TimeRun', 'Time Run', $dateOptions);
        $this->addBasicText('Filename', 'MincFile');
        $this->addBasicText('SeriesUID', 'Series UID');
        $this->addSelect("ProblemType", "Type of problem", $problemOptions);

        // get list of projects
        $list_of_projects = ['' => 'Any'];
        $userProjectsIDs  = $user->getProjectIDs();
        foreach ($userProjectsIDs as $projectID) {
            $projectName = \Project::getProjectFromID($projectID)->getName();
            $list_of_projects[$projectID] = $projectName;
        }

        $this->addSelect(
            'Project',
            'Project',
            $list_of_projects
        );

        // Subproject
        $list_of_subprojects = ['' => 'Any'];
        foreach ($userProjectsIDs as $projectID) {
            $subprojects = \Project::getProjectFromID($projectID)->getSubprojects();
            foreach ($subprojects as $subproject) {
                $subprojectId = $subproject->subprojectId;
                if (!isset($list_of_subprojects[$subprojectId])) {
                    $subprojectName = $subproject->title;
                    $list_of_subprojects[$subprojectId] = $subprojectName;
                }
            }
        }
        $this->addSelect(
            'Subproject',
            'Subproject',
            $list_of_subprojects
        );

        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites  = [
                ''         => 'All (including unknown)',
                'AllKnown' => 'All (excluding unknown)',
                'Unknown'  => 'Unknown'
            ];
            $sites += \Utility::getSiteList();
        } else {
            // allow only to view own site data
            $sites  = [
                ''         => 'All user sites (including unknown)',
                'AllKnown' => 'All user sites (excluding unknown)',
                'Unknown'  => 'Unknown'
            ];
            $sites +=  $user->getStudySites();
        }
        $this->addSelect('Site', 'Site', $sites);
    }

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseurl . "/mri_violations/js/columnFormatterUnresolved.js",
            ]
        );
    }

    /**
     * Include additional CSS files
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/mri_violations/css/mri_violations.css"]
        );
    }
}

