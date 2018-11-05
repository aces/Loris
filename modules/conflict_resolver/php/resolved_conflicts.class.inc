<?php
/**
 * This class provides the php code to create the menu filter to display resolved
 * conflicts as part of the conflict resolver
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
namespace LORIS\conflict_resolver;

/**
 * Menu_Filter_Form_resolved_conflicts Class
 *
 * This class provides the php code to create the menu filter to display resolved
 * conflicts as part of the conflict resolver
 *
 * @category Behavioural
 * @package  Main
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Resolved_Conflicts extends \NDB_Menu_Filter
{

    /**
     * Determine whether the user should have access to this submodule
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('conflict_resolver'));
    }


    /**
     * Sets up the query for the resolved_conflicts submodule
     *
     * @return void
     */
    function _setupVariables()
    {
        // set the class variables
        $config =& \NDB_Config::singleton();

        $useProjects = $config->getSetting("useProjects");
        if ($useProjects === "false") {
            $useProjects = false;
        }

        $this->columns = array(
                          'conflicts_resolved.TableName as Instrument',
                          'session.CandID as CandID',
                          'candidate.PSCID as PSCID',
                          'session.Visit_label as Visit_Label',
                          'conflicts_resolved.ResolutionTimestamp as Timestamp',
                         );

        if ($useProjects) {
            $this->columns[] = 'Project.Name as Project';
        }

        $this->columns = array_merge(
            $this->columns,
            array(
             'conflicts_resolved.FieldName as Question',
             'conflicts_resolved.OldValue1 as CorrectAnswer',
             'conflicts_resolved.NewValue  as New_Value',
             'conflicts_resolved.OldValue2 as OldValue2',
             'session.CenterID as CenterID',
            )
        );
        $this->query   = " FROM conflicts_resolved
            LEFT JOIN flag ON (conflicts_resolved.CommentId1=flag.CommentID)
            LEFT JOIN session ON (flag.SessionID=session.ID)
            LEFT JOIN candidate ON (candidate.CandID=session.CandID)
            LEFT JOIN Project ON (candidate.ProjectID=Project.ProjectID )
            WHERE session.Active='Y' AND candidate.Active ='Y'";

        $user = \User::singleton();
        if (!$user->hasPermission('access_all_profiles')) {
            // restrict data to own site
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND session.CenterID IN (" . $site_arr . ")";
        }

        $this->group_by     = '';
        $this->order_by     = 'conflicts_resolved.TableName, session.Visit_label';
        $this->validFilters = array(
                               'conflicts_resolved.TableName',
                               'session.CenterID',
                               'session.Visit_label',
                               'conflicts_resolved.ResolutionTimestamp',
                              );

        if ($useProjects) {
            $this->validFilters[] = 'candidate.ProjectID';
        }

        $this->validFilters = array_merge(
            $this->validFilters,
            array(
             'candidate.PSCID',
             'session.CandID',
             'conflicts_resolved.Fieldname',
            )
        );

        $this->headers = array(
                          'Instrument',
                          'CandID',
                          'PSCID',
                          'Visit_label',
                          'Resolution_Timestamp',
                         );

        if ($useProjects) {
            $this->headers = array_merge(
                $this->headers,
                array('Project')
            );
        }
        $this->headers =array_merge(
            $this->headers,
            array(
             'Question',
             'Correct_Answer',
             'New_Value',
             'OldValue2',
             'CenterID',
            )
        );
        $this->tpl_data['hiddenHeaders'] = json_encode(
            [
             'New Value',
             'OldValue2',
             'CenterID',
            ]
        );
        $con = "conflicts_resolved";

        $this->formToFilter = array(
                               'Instrument'          => "$con.TableName",
                               'site'                => 'session.CenterID',
                               'visit'               => 'session.Visit_label',
                               'ResolutionTimestamp' => "$con.ResolutionTimestamp",
                              );

        if ($useProjects) {
            $this->formToFilter = array_merge(
                $this->formToFilter,
                array('Project' => 'candidate.ProjectID')
            );
        }

        $this->formToFilter = array_merge(
            $this->formToFilter,
            array(
             'CandID'   => 'session.CandID',
             'PSCID'    => 'candidate.PSCID',
             'Question' => 'conflicts_resolved.Fieldname',
            )
        );
        return true;
    }

    /**
     * Adds the form elements required for the filter
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        // Create user object
        $user   =& \User::singleton();
        $config =& \NDB_Config::singleton();

        // Get instruments
        $instruments = \Utility::getAllInstruments();
        $instruments = array_merge(array('' => 'All Instruments'), $instruments);

        // Get visits
        $visits = \Utility::getVisitList();
        $visits = array_merge(array('' => 'All'), $visits);

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

        // Add form elements
        $this->addSelect('site', 'Site:', $sites);
        $this->addSelect('Instrument', 'Instrument:', $instruments);
        $this->addSelect('visit', 'Visit label:', $visits);
        $this->addBasicText(
            'CandID',
            'DCCID:',
            array(
             "size"      => 9,
             "maxlength" => 6,
            )
        );
        $this->addBasicText(
            'PSCID',
            'PSCID:',
            array(
             "size"      => 9,
             "maxlength" => 7,
            )
        );
        $this->addBasicText('Question', 'Search keyword:');
        $this->addBasicText('ResolutionTimestamp', 'Resolution Timestamp:');

        // Project list, if applicable
        if ($config->getSetting("useProjects")==="true") {
            $list_of_projects = array(null => 'All');
            $projectList      = \Utility::getProjectList();
            foreach ($projectList as $key => $value) {
                $list_of_projects[$key] = $value;
            }
            $this->addSelect('Project', 'Project: ', $list_of_projects);
        }

        return true;
    }

    /**
     * Returns a list of candidates, users, etc.
     * Need override for when Examiner field is conflicting,
     * need Examiner's full name
     *
     * @return array
     * @access private
     */
    function _getFullList()
    {
        // create DB object
        $DB =& \Database::singleton();

        $qparams = array();
        // add the base query
        $query  = '';
        $query .= $this->_getBaseQuery();

        $filterdetails = $this->_getBaseFilter();
        $query        .= $filterdetails['clause'];
        $qparams       = $filterdetails['params'];
        // apply ORDER BY filters
        $query .= " ORDER BY ";
        if (!empty($this->filter['order'])) {
            $query .= $this->filter['order']['field']
                ." ".$this->filter['order']['fieldOrder'].", ";
        }
        $query .= $this->order_by;
        // get the list
        $result = $DB->pselect($query, $qparams);

        // OVERRIDE START
        foreach ($result as $k => $r) {
            if ($r['Question'] === 'Examiner') {
                if (!empty($r['CorrectAnswer'])) {
                    $r['CorrectAnswer'] = $DB->pselectOne(
                        'SELECT full_name 
                         FROM examiners 
                         WHERE examinerID=:eid',
                        array('eid' => $r['CorrectAnswer'])
                    );
                }
                $result[$k] = $r;
            }
        }
        //OVERRIDE END

        return $result;
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
        $urls    = "/conflict_resolver/js/resolved_conflicts_columnFormatter.js";
        return array_merge(
            $deps,
            array($baseURL . $urls)
        );
    }
}
