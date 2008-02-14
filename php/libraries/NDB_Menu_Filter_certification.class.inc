<?php
require_once 'NDB_Menu_Filter.class.inc';

/**
 * The menu for certification
 * @package behavioural
 */
class NDB_Menu_Filter_certification extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        return $user->hasPermission('certification');
    }

    function _setupVariables()
    {
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // the base query
        $query = " FROM cert_events, examiners, psc LEFT JOIN cert_details ON cert_events.certID = cert_details.certID WHERE cert_events.examinerID = examiners.examinerID AND examiners.centerID = psc.CenterID ";

        // only view their own profiles, unless they have permission to see all
        if (!$user->hasPermission('certification_multisite')) {
            $query .= " AND examiners.centerID = '" . $user->getData('CenterID') . "' ";
        }

        // set the class variables
        $this->columns = array('cert_events.certID AS ID', 'psc.Name AS PSC', 'full_name', 'date_cert AS date', 'candID AS subject', 'MIN(pass) AS status');
        $this->query = $query;
        $this->group_by = 'cert_events.certID';
        $this->order_by = 'Date DESC';
        $this->headers = array('PSC', 'full_name', 'date', 'subject', 'status');
        $this->validFilters = array('examiners.centerID', 'examiners.full_name', 'cert_events.date_cert', 'cert_events.candID');

        $this->formToFilter = array(
                                    'centerID' => 'examiners.centerID',
                                    'full_name' => 'examiners.full_name',
                                    'date_cert' => 'cert_events.date_cert',
                                    'subject' => 'cert_events.candID',
                                    );
        return true;
    }


    function _setFilterForm()
    {
    	// create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // PSC
        if ($user->hasPermission('certification_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList();
            if(PEAR::isError($list_of_sites)) {
                return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
            }
            if(is_array($list_of_sites)) $list_of_sites = array('' => 'Any') + $list_of_sites;
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (PEAR::isError($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        // add form elements
        $this->form->addElement('select', 'centerID', 'Site:', $list_of_sites);
        $this->form->addElement('text', 'full_name', 'Full name:');
        $this->form->addElement('text', 'date_cert', 'Date:');
        $this->form->addElement('text', 'subject', 'DCCID:');

        return true;
    }

    function _setDataTableRows($count)
    {
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key == 'full_name') {
                    $this->tpl_data['items'][$x][$i]['ID'] = $item['ID'];
                }
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                $i++;
            }
            $x++;
        }

        return true;
    }
}
?>
