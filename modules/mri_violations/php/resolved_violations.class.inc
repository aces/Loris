<?php
/**
 * This page displays the list of Resolved violations which have been
 * marked as resolved by one of the following methods: Reran,
 * Emailed site/pending,
 * Inserted, Rejected, Inserted with flag, Other.
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\mri_violations;
/**
 * Implement the menu filter for searching through resolved violations
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Resolved_Violations extends \NDB_Menu_Filter_Form
{
    var $AjaxModule = true;

    /**
     * Check if user should be allowed to see this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if the user is permitted to see violated scans
     */
    function _hasAccess(\User $user) : bool
    {
        $this->tpl_data['violated_scans_modifications']
            = $user->hasPermission('violated_scans_edit');
        return ($user->hasPermission('violated_scans_view_allsites'));
    }

    /**
     * Process function
     *
     * @param array $values the value of values
     *
     * @return bool true if the user is permitted to see violated scans
     */
    function _process($values)
    {
        if (!is_array($values) || count($values) ==0) {
            return true;
        }
        $DB   =& \Database::singleton();
        $user =& \User::singleton();

        foreach ($values AS $key=>$val) {
            $hash = $key;
            $row  = $DB->pselectRow(
                "SELECT * FROM violations_resolved WHERE hash = :hash",
                array('hash' => $hash)
            );
            //if row is found, check value and update if needed
            if (!empty($row)) {
                foreach ($row as $key2 => $val2) {
                    //found matching
                    if ($key2 == 'Resolved') {
                        // user input matches DB content, so do nothing.
                        if ($val==$val2) {
                            break;
                        } else { // user input doesn't match DB,
                                 // so we update the DB
                            $setArray   = array('Resolved' => (string)$val2);
                            $whereArray = array('hash' => $hash);
                            $DB->update(
                                'violations_resolved',
                                $setArray,
                                $whereArray
                            );
                        }
                    }
                }
            } else {
                //if row is not found, and selection<>0, then insert new row.
                // no need to insert to DB for Unresolved value.
                if ($val==0) {
                    continue;
                }
                $newlyResolved         = array();
                $newlyResolved['hash'] = $key;
                $newlyResolved['Resolved']   = (string)$val;
                $newlyResolved['User']       = $user->getUsername();
                $newlyResolved['ChangeDate'] = date("Y-m-d H:i:s");

                // Table 1
                $sqlSelectOne = "SELECT ID".
                                " FROM mri_protocol_violated_scans".
                                " WHERE (:hash = md5(concat_WS(':',".
                                "minc_location,PatientName,".
                                "SeriesUID,time_run)))";
                $ID_mri_protocol_violated_scans = $DB->pselectOne(
                    $sqlSelectOne,
                    array('hash' => $key)
                );
                if (!empty($ID_mri_protocol_violated_scans)) {
                    $newlyResolved['TypeTable'] = 'mri_protocol_violated_scans';
                    $newlyResolved['ExtID']     = $ID_mri_protocol_violated_scans;
                }
                // Table 2
                $sqlSelectOne          = "SELECT LogID".
                                " FROM mri_violations_log".
                                " WHERE (:hash = md5(concat_WS(':',".
                                "MincFile,PatientName,SeriesUID,TimeRun)))";
                $ID_mri_violations_log = $DB->pselectOne(
                    $sqlSelectOne,
                    array('hash' => $key)
                );
                if (!empty($ID_mri_violations_log)) {
                    $newlyResolved['TypeTable'] = 'mri_violations_log';
                    $newlyResolved['ExtID']     = $ID_mri_violations_log;
                }

                // Table 3
                $sqlSelectOne          = "SELECT ID".
                                " FROM MRICandidateErrors".
                                " WHERE (:hash = md5(concat_WS(':',".
                                "MincFile,PatientName,SeriesUID,TimeRun)))";
                $ID_MRICandidateErrors = $DB->pselectOne(
                    $sqlSelectOne,
                    array('hash' => $key)
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
        $this->columns = array(
                          'v.Resolved as Resolution_status',
                          'pjct.Name as Project',
                          'subpjct.title as Subproject',
                          'v.PatientName as PatientName',
                          'site.Name as Site',
                          'v.TimeRun as TimeRun',
                          'v.MincFile as MincFile',
                          'v.Series_Description as Series_Description_Or_Scan_Type',
                          'v.Problem as Problem',
                          'v.SeriesUID as SeriesUID',
                          'v.hash as Hash',
                          'v.join_id as JoinID',
                          'v.Site as SiteID',
                         );
        $this->headers = array(
                          'Resolution_status',
                          'Project',
                          'Subproject',
                          'PatientName',
                          'Site',
                          'TimeRun',
                          'MincFile',
                          'Series_Description_Or_Scan_Type',
                          'Problem',
                          'SeriesUID',
                          'Hash',
                          'JoinID',
                          'SiteID',
                         );

        $this->tpl_data['hiddenHeaders'] = json_encode(
            [
             'SeriesUID',
             'Hash',
             'JoinID',
             'SiteID',
            ]
        );

        $this->query    = " FROM (
            SELECT PatientName as PatientName,
                time_run as TimeRun,
                s.ProjectID as Project,
                s.SubprojectID as Subproject,
                minc_location as MincFile,
                series_description as Series_Description,
                'Could not identify scan type' as Problem, 
                SeriesUID,
                md5(concat_WS(':',
                              minc_location,
                              PatientName,
                              SeriesUID,
                              time_run
                   )
                ) as hash,
                mpvs.ID as join_id,                
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM mri_protocol_violated_scans AS mpvs
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mpvs.ID 
            AND violations_resolved.TypeTable='mri_protocol_violated_scans')
            LEFT JOIN candidate c
            ON (mpvs.CandID = c.CandID)
            LEFT JOIN session s
            ON (SUBSTRING_INDEX(mpvs.PatientName,'_',-1) = s.Visit_label 
                AND mpvs.CandID = s.CandID
            )
            LEFT JOIN psc p
            ON (p.CenterID = s.CenterID)
            WHERE Resolved <> '0'"
            . " UNION " .
            "SELECT PatientName,
                TimeRun,
                s.ProjectID as Project,
                s.SubprojectID as Subproject,
                MincFile,
                mri_scan_type.Scan_type,
                'Protocol Violation',
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun))
                   as hash,
                mrl.LogID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM mri_violations_log AS mrl
            LEFT JOIN mri_scan_type 
            ON (mri_scan_type.ID=mrl.Scan_type)
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mrl.LogID 
            AND violations_resolved.TypeTable='mri_violations_log')
            LEFT JOIN candidate c
            ON (mrl.CandID=c.CandID)
            LEFT JOIN session s
            ON (mrl.Visit_label = s.Visit_label AND mrl.CandID = s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = s.CenterID)
            WHERE Resolved <> '0'"
            . " UNION " .
            "SELECT PatientName,
                TimeRun,
                null,
                null,
                MincFile,
                null,
                Reason, 
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun))
                   as hash,
                MRICandidateErrors.ID as join_id,
                null,
                violations_resolved.Resolved as Resolved
            FROM MRICandidateErrors
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=MRICandidateErrors.ID 
            AND violations_resolved.TypeTable='MRICandidateErrors')
            WHERE Resolved <> '0')
            as v LEFT JOIN psc site ON (site.CenterID = v.Site) 
            LEFT JOIN Project as pjct ON (v.Project = pjct.ProjectID)
            LEFT JOIN subproject as subpjct
                 ON (v.Subproject = subpjct.SubprojectID)
            WHERE 1=1";
        $this->order_by = 'v.TimeRun DESC';

        $this->formToFilter = array(
                               'PatientName' => 'v.PatientName',
                               'Site'        => 'v.Site',
                               'TimeRun'     => 'v.TimeRun',
                               'Project'     => 'v.Project',
                               'Subproject'  => 'v.Subproject',
                               'ProblemType' => 'v.Problem',
                               'Filename'    => 'v.MincFile',
                               'Description' => 'v.Series_Description',
                               'SeriesUID'   => 'v.SeriesUID',
                               'Resolved'    => 'v.Resolved',
                              );
        $this->validFilters = array(
                               'v.PatientName',
                               'v.Site',
                               'v.TimeRun',
                               'v.Project',
                               'v.Subproject',
                               'v.MincFile',
                               'v.Problem',
                               'v.Series_Description',
                               'v.SeriesUID',
                               'v.Resolved',
                              );
        return;
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
        $user        =&        \User::singleton();
        $config      =&        \NDB_Config::singleton();
        $minYear     = $config->getSetting('startYear')
            - $config->getSetting('ageMax');
        $maxYear     = $config->getSetting('endYear');
        $dateOptions = array(
                        'language'       => 'en',
                        'format'         => 'YMd',
                        'addEmptyOption' => true,
                        'minYear'        => $minYear,
                        'maxYear'        => $maxYear,
                       );
        $this->addBasicText('PatientName', 'Patient Name');
        $this->addBasicText('Description', 'Series Description or Scan Type');
        $this->addBasicDate('TimeRun', 'Time Run', $dateOptions);
        $this->addBasicText('Filename', 'MincFile');
        $this->addBasicText('SeriesUID', 'Series UID');
        $notMatchString = "CandID and PSCID do not match database";
        $this->addSelect(
            "ProblemType",
            "Type of problem",
            array(
             ''                             => 'Any',
             $notMatchString                => 'Candidate Mismatch',
             'Could not identify scan type' => 'Could not identify scan type',
             'Protocol Violation'           => 'MRI Protocol Check violation',
            )
        );
        // violation resolved
        $this->addSelect(
            'Resolved',
            'Violation resolved',
            array(
             ''              => 'Any',
             'reran'         => 'Reran',
             'emailed'       => 'Emailed site/pending',
             'inserted'      => 'Inserted',
             'rejected'      => 'Rejected',
             'inserted_flag' => 'Inserted with flag',
             'other'         => 'Other',
            )
        );
        // project
        $list_of_projects = \Utility::getProjectList();
        $this->addSelect(
            'Project',
            'Project',
            array('' => 'All') + $list_of_projects
        );

        // Subproject
        $list_of_subprojects = \Utility::getSubprojectList();
        $this->addSelect(
            'Subproject',
            'Subproject',
            array('' => 'All') + $list_of_subprojects
        );

        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = \Utility::getSiteList();
            if (is_array($sites)) {
                $sites = array('' => 'All') + $sites;
            }
        } else {
            // allow only to view own site data
            $sites = $user->getStudySites();
            $sites = array('' => 'All User Sites') + $sites;
        }
        $this->addSelect('Site', 'Site', $sites);

        return true;
    }
    /**
     * Gathers JS dependecies and merge them with the parent
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
            array($baseURL . "/mri_violations/js/columnFormatter.js")
        );
    }
}

