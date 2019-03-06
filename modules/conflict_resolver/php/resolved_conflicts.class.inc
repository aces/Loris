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
    public $skipTemplate = true;

    /**
     * Returns true if the user has permission to access
     * the conflict resolver module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
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

        $useProjects = $config->getSetting('useProjects');
        if ($useProjects === 'false') {
            $useProjects = false;
        }

        $this->columns = array(
                          'conflicts_resolved.TableName as instrument',
                          'session.CandID as candID',
                          'candidate.PSCID as pscid',
                          'session.Visit_label as visit_label',
                          'conflicts_resolved.ResolutionTimestamp as timestamp',
                         );

        if ($useProjects) {
            $this->columns[] = 'Project.Name as Project';
        }

        $this->columns = array_merge(
            $this->columns,
            array(
             'conflicts_resolved.FieldName as question',
             'conflicts_resolved.OldValue1 as correct_answer',
             'conflicts_resolved.NewValue  as new_value',
             'conflicts_resolved.OldValue2 as old_value2',
             'session.CenterID as CenterID',
             '(SELECT name FROM psc WHERE CenterID=session.CenterID) as site',
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
            $site_arr     = implode(',', $user->getCenterIDs());
            $this->query .= ' AND session.CenterID IN (' . $site_arr . ')';
        }

        $this->group_by = '';
        $this->order_by = 'conflicts_resolved.TableName, session.Visit_label';

        $this->headers = array(
                          'Instrument',
                          'CandID',
                          'PSCID',
                          'Visit Label',
                          'Resolution Timestamp',
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
             'Correct Answer',
             'New Value',
             'Old Value2',
             'CenterID',
             'Site',
            )
        );
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
            foreach ($sites as $key => $site) {
                unset($sites[$key]);
                $sites[$site] = $site;
            }
            if (is_array($sites)) {
                $sites = array('' => 'All') + $sites;
            }
        } else {
            // allow only to view own site data
            $sites = $user->getStudySites();
            foreach ($sites as $key => $site) {
                unset($sites[$key]);
                $sites[$site] = $site;
            }
            $sites = array('' => 'All User Sites') + $sites;
        }

        // Add form elements
        $this->addSelect('site', 'For Site:', $sites);
        $this->addSelect('instrument', 'Instrument:', $instruments);
        $this->addSelect('visitLabel', 'Visit label:', $visits);
        $this->addBasicText(
            'candID',
            'CandID:',
            array(
             'size'      => 9,
             'maxlength' => 6,
            )
        );
        $this->addBasicText(
            'pSCID',
            'PSCID:',
            array(
             'size'      => 9,
             'maxlength' => 7,
            )
        );
        $this->addBasicText('question', 'Question:');
        $this->addBasicText('resolutionTimestamp', 'Resolution Timestamp:');

        // Project list, if applicable
        if ($config->getSetting('useProjects')==='true') {
            $projectList      = \Utility::getProjectList();
            $list_of_projects = array('' => 'All') + $projectList;
            foreach ($projectList as $key => $value) {
                $list_of_projects[$value] = $value;
            }
            $this->addSelect('project', 'Project: ', $list_of_projects);
        }
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

        // add the base query
        $query  = '';
        $query .= $this->_getBaseQuery();

        $filterdetails = $this->_getBaseFilter();
        $query        .= $filterdetails['clause'];
        $qparams       = $filterdetails['params'];
        // apply ORDER BY filters
        $query .= ' ORDER BY ';
        if (!empty($this->filter['order'])) {
            $query .= $this->filter['order']['field']
                .' '.$this->filter['order']['fieldOrder'].', ';
        }
        $query .= $this->order_by;
        // get the list
        $result = $DB->pselect($query, $qparams);

        // OVERRIDE START
        foreach ($result as $k => $r) {
            if ($r['question'] === 'Examiner') {
                if (!empty($r['CorrectAnswer'])) {
                    $r['correct_answer'] = $DB->pselectOne(
                        'SELECT full_name 
                         FROM examiners 
                         WHERE examinerID=:eid',
                        array('eid' => $r['correct_answer'])
                    );
                }
                $result[$k] = $r;
            }
        }
        //OVERRIDE END

        return $result;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;

        return json_encode($result);
    }

    /**
     * Converts the data from the data table to an array suitable for JSON
     * serialization. Overrides the base class in order to enforce name regex
     * rules.
     *
     * @return array of data from conflict_resolver menu filter
     */
    function toArray()
    {
        $unanonymized = parent::toArray();
        $data         = array();

        foreach ($unanonymized['Data'] as &$row) {
            $data[] = $row;
        }
        return array(
                'Headers' => $unanonymized['Headers'],
                'Data'    => $data,
               );
    }

    /**
     * Gathers JS dependencies and merge them with the parent
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
             $baseURL . '/conflict_resolver/js/resolvedConflictsIndex.js',
            )
        );
    }
}
