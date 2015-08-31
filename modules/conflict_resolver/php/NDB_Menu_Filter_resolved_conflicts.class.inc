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

require_once 'NDB_Menu_Filter.class.inc';

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

class NDB_Menu_Filter_Resolved_Conflicts extends NDB_Menu_Filter
{

    /**
     * Determine whether the user should have access to this submodule
     *
     * @return boolean true if the user has access
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        return ($user->hasPermission('conflict_resolver'));
    }


    /**
     * Sets up the query for the resolved_conflicts submodule
     *
     * @return none
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns      = array(
                               'conflicts_resolved.TableName',
                               'session.CandID',
                               'candidate.PSCID',
                               'session.Visit_label',
                               'conflicts_resolved.FieldName',
                               'conflicts_resolved.NewValue',
                               'conflicts_resolved.OldValue1',
                               'conflicts_resolved.OldValue2',
                               'session.CenterID',
                              );
        $this->query        = " FROM conflicts_resolved
            LEFT JOIN flag ON (conflicts_resolved.CommentId1=flag.CommentID)
            LEFT JOIN session ON (flag.SessionID=session.ID)
            LEFT JOIN candidate ON (candidate.CandID=session.CandID) WHERE 1=1";
        $this->group_by     = '';
        $this->order_by     = 'conflicts_resolved.TableName, session.Visit_label';
        $this->validFilters = array(
                               'conflicts_resolved.TableName',
                               'session.CenterID',
                               'session.Visit_label',
                               'candidate.PSCID',
                               'session.CandID',
                               'conflicts_resolved.Fieldname',
                              );
        $this->headers      = array(
                               'TableName',
                               'CandID',
                               'PSCID',
                               'Visit_label',
                               'FieldName',
                              );
        $this->formToFilter = array(
                               'Instrument' => 'conflicts_resolved.TableName',
                               'site'       => 'session.CenterID',
                               'visit'      => 'session.Visit_label',
                               'CandID'     => 'session.CandID',
                               'PSCID'      => 'candidate.PSCID',
                               'Question'   => 'conflicts_resolved.Fieldname',
                              );
        return true;
    }

    /**
     * Adds the form elements required for the filter
     *
     * @return none
     */
    function _setFilterForm()
    {
        // Create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // Get instruments
        $instruments = Utility::getAllInstruments();
        $instruments = array_merge(array('' => 'All Instruments'), $instruments);

        // Get visits
        $visits = Utility::getVisitList();
        $visits = array_merge(array('' => 'All'), $visits);

        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = Utility::getSiteList();
            if (is_array($sites)) {
                $sites = array('' => 'All') + $sites;
            }
        } else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
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

        return true;
    }

    /**
     * Overrides the default setDataTableRows in order to not
     * show the elements that are only selected to add them to
     * a form, but aren't part of the table itself.
     *
     * @param integer $count The number of rows
     *
     * @return none
     */
    function _setDataTableRows($count)
    {
        $DB =& Database::singleton();
        $x  = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key=='TableName'
                    || $key=='CandID'
                    || $key=='PSCID'
                    || $key=='Visit_label'
                    || $key=='FieldName'
                ) {
                    $this->tpl_data['items'][$x][$i]['name']  = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                } else if ($key=='NewValue') {
                    if ($item['NewValue'] == 1) {
                        $NewValue = $item['OldValue1'];
                    } elseif ($item['NewValue'] == 2) {
                        $NewValue = $item['OldValue2'];
                    }
                    $this->tpl_data['items'][$x][$i]['name']  = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $NewValue;
                }

                $i++;
            }

            $x++;
        }

        return true;
    }
}
?>
