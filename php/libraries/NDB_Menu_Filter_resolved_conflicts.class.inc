<?php
/**
 * This class over-rides the NDB_Menu_Filter class by including the functionality 
 * of saving/processing the form.
 *
 * PHP Version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Tara Campbell
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once 'NDB_Menu_Filter.class.inc';

/**
 * Menu_Filter_Form_conflicts_resolve Class
 *
 * This class over-rides the NDB_Menu_Filter class by including the functionality 
 * to save/process the form.
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Tara Campbell
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk    
*/

class NDB_Menu_Filter_resolved_conflicts extends NDB_Menu_Filter
{

    function _hasAccess()
    {    
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return ($user->hasPermission('conflict_resolver'));
    }

    function _setupVariables()
    {
        // set the class variables
        $this->columns = array(
            'conflicts_resolved.TableName',
            'session.CandID', 
            'candidate.PSCID', 
            'session.Visit_label',
            'conflicts_resolved.FieldName',
            'conflicts_resolved.NewValue',  
            'conflicts_resolved.OldValue1', 
            'conflicts_resolved.OldValue2', 
            'session.CenterID'
        );
        $this->query = " FROM conflicts_resolved LEFT JOIN flag ON (conflicts_resolved.CommentId1=flag.CommentID) LEFT JOIN session ON (flag.SessionID=session.ID) LEFT JOIN candidate ON (candidate.CandID=session.CandID) WHERE 1=1";
        $this->group_by = '';
        $this->order_by = 'conflicts_resolved.TableName, session.Visit_label';
        $this->validFilters = array(
                                    'conflicts_resolved.TableName', 
                                    'session.CenterID', 
                                    'session.Visit_label', 
                                    'candidate.PSCID', 
                                    'session.CandID'
        );
        $this->headers = array(
                                'TableName', 
                                'CandID', 
                                'PSCID', 
                                'Visit_label',
                                'FieldName', 
                                'NewValue'
        );
        $this->formToFilter = array(
                                    'Instrument' => 'conflicts_resolved.TableName',
                                    'site' => 'session.CenterID',
                                    'visit' => 'session.Visit_label',
                                    'CandID' => 'session.CandID',
                                    'PSCID' => 'candidate.PSCID'
        );
        return true;
    }

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

        // Get sites that the user has access to
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites =& Utility::getSiteList();
            if(Utility::isErrorX($sites)) {
                return PEAR::raiseError("DB Error: ". $sites->getMessage());
            }
            if(is_array($sites)) {
                $sites = array('' => 'All') + $sites;
            }
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        // Add form elements
        $this->addSelect('site', 'Site:', $sites);
        $this->addSelect('Instrument', 'Instrument:', $instruments);
        $this->addSelect('visit', 'Visit label:', $visits);
        $this->addBasicText('CandID', 'DCCID:', array("size"=>9, "maxlength"=>6));
        $this->addBasicText('PSCID', 'PSCID:', array("size"=>9, "maxlength"=>7));

        return true;
    }

    function _setDataTableRows($count)
    {
        $DB =& Database::singleton();
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key=='TableName' || $key=='CandID' || $key=='PSCID' || $key=='Visit_label' || $key=='FieldName') {
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }
                else if ($key=='NewValue') {
                    if ($item['NewValue'] == 1) {
                        $NewValue = $item['OldValue1'];
                    } 
                    elseif ($item['NewValue'] == 2) {
                        $NewValue = $item['OldValue2'];
                    }
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
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