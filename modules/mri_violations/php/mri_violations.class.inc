<?php
/**
 * This page implements a front end which is used to unify all
 * of the different MRI violation types (could not identify scan,
 * header violation in the scan after identifying scan type, mislabeled
 * scan, etc) and link to the appropriate module to further investigate
 * why a scan was excluded by the imaging pipeline scripts.
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
        $this->tpl_data['violated_scans_modifications']
            = $user->hasPermission('violated_scans_edit');
        return ($user->hasPermission('violated_scans_view_allsites'));
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
        if (!is_array($values) || count($values) ==0) {
            return true;
        }
        $DB   =& \Database::singleton();
        $user =& \User::singleton();
        foreach ($values['resolvable'] AS $key=>$val) {
            $hash = $key;
            $row  = $DB->pselectRow(
                "SELECT * FROM violations_resolved
                    WHERE hash = :hash",
                array('hash' => $hash)
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
                            $setArray   = array(
                                           'Resolved'   => (string)$val,
                                           'ChangeDate' => date("Y-m-d H:i:s"),
                                          );
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
                //if row is not found no resolve status was assigned,
                // if selection<>0, then insert new row.
                // no need to insert to DB for Unresolved value.
                if ($val=='unresolved') {
                    continue;
                }
                $newlyResolved         = array();
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
                    array('hash' => $key)
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
                    array('hash' => $key)
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
        // set the class variables
        $this->columns = array(
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
                         );

        $this->headers = array(
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
                         );

        $this->tpl_data['hiddenHeaders'] = json_encode(
            [
             'SeriesUID',
             'Hash',
             'JoinID',
            ]
        );

        // Recreating the path (MincFileViolated field) to the minc file
        // for the table mri_violations_log is more complicated
        // because of the 3 cases that can occur as we pull the data
        // from the db.
        //   1. if the Mincfile starts with "assembly" then we need to
        //      add the directory path in front of it.
        //   2. if the word "assembly" is there but not at the beginning,
        //      then uses it as is, the path is correct.
        //   3. if it is not in the assembly dir, then it is in the trashbin,
        //      so we fix the path with that in mind.
        $this->query    = " FROM (
            SELECT PatientName as PatientName,
                time_run as TimeRun,
                c.ProjectID as Project,
                s.SubprojectID as Subproject,
                minc_location as MincFile,
                series_description as Series_Description,
                'Could not identify scan type' as Problem,
                SeriesUID,
                md5(concat_WS(':',minc_location,PatientName,SeriesUID,time_run))
                  as hash,
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
            WHERE Resolved is NULL"
            . " UNION " .
            "SELECT PatientName,
                TimeRun,
                c.ProjectID as Project,
                s.SubprojectID as Subproject,
                MincFile,
                mri_scan_type.Scan_type,
                'Protocol Violation',
                SeriesUID,
                md5(concat_WS(':',
                              MincFile,
                              PatientName,
                              SeriesUID,
                              TimeRun
                   )
                ) as hash,
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
            ON (mrl.Visit_label = s.Visit_label AND mrl.CandID=s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = s.CenterID)
            WHERE Resolved is NULL"
            . " UNION " .
            "SELECT PatientName,
                TimeRun,
                null,
                null,
                MincFile,
                null,
                Reason,
                SeriesUID,
                md5(concat_WS(':',
                              MincFile,
                              PatientName,
                              SeriesUID,
                              TimeRun
                   )
                ) as hash,
                MRICandidateErrors.ID as join_id,
                null,
                violations_resolved.Resolved as Resolved
            FROM MRICandidateErrors
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=MRICandidateErrors.ID 
            AND violations_resolved.TypeTable='MRICandidateErrors')
            WHERE Resolved is NULL)
            as v LEFT JOIN psc site ON (site.CenterID = v.Site) 
            LEFT JOIN Project as pjct ON (v.Project = pjct.ProjectID)
            LEFT JOIN subproject as subpjct
                ON (v.Subproject = subpjct.SubprojectID)
            WHERE 1=1";
        $this->order_by = 'v.TimeRun DESC';

        $this->formToFilter = array(
                               'PatientName' => 'v.PatientName',
                               'Project'     => 'v.Project',
                               'Subproject'  => 'v.Subproject',
                               'TimeRun'     => 'v.TimeRun',
                               'ProblemType' => 'v.Problem',
                               'Filename'    => 'v.MincFile',
                               'Description' => 'v.Series_Description',
                               'SeriesUID'   => 'v.SeriesUID',
                               'Site'        => 'v.Site',
                              );

        $this->validFilters = array(
                               'v.PatientName',
                               'v.Project',
                               'v.Subproject',
                               'v.TimeRun',
                               'v.MincFile',
                               'v.Problem',
                               'v.Series_Description',
                               'v.SeriesUID',
                               'v.Site',
                              );

        $this->EqualityFilters[] = 'v.Site';
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

        $dateOptions = array(
                        'language'       => 'en',
                        'format'         => 'YMd',
                        'addEmptyOption' => true,
                        'minYear'        => $minYear,
                        'maxYear'        => $maxYear,
                       );

        $problemOptions = ['' => 'Any'];

        // Build a list of existing problem types based on data in db
        $problemTypes = $db->pselect(
            "SELECT DISTINCT MRICandidateErrors.Reason FROM MRICandidateErrors
            UNION 
            SELECT DISTINCT 'Could not identify scan type' 
            FROM mri_protocol_violated_scans
            UNION
            SELECT DISTINCT 'Protocol Violation' FROM mri_violations_log",
            array()
        );
        foreach ($problemTypes as $problem) {
            $problemOptions[$problem['Reason']] = $problem['Reason'];
        }

        $this->addBasicText('PatientName', 'Patient Name');
        $this->addBasicText('Description', 'Series Description or Scan Type');
        $this->addBasicDate('TimeRun', 'Time Run', $dateOptions);
        $this->addBasicText('Filename', 'MincFile');
        $this->addBasicText('SeriesUID', 'Series UID');
        $this->addSelect("ProblemType", "Type of problem", $problemOptions);

        // project
        $list_of_projects = array('' => 'Any') + \Utility::getProjectList();
        $this->addSelect(
            'Project',
            'Project',
            $list_of_projects
        );

        // Subproject
        $list_of_subprojects = array('' => 'Any') +
            \Utility::getSubprojectList();
        $this->addSelect(
            'Subproject',
            'Subproject',
            $list_of_subprojects
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
        $baseurl = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseurl . "/mri_violations/js/columnFormatterUnresolved.js",
            )
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
            array($baseURL . "/mri_violations/css/mri_violations.css")
        );
    }
}

