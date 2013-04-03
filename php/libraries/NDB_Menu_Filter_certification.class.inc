<?php
require_once 'NDB_Menu_Filter.class.inc';
require_once 'NDB_Form.class.inc';

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
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        return $user->hasPermission('certification');
    }

    function _setupVariables()
    {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // the base query
        $query = " FROM certification, examiners, psc, test_names WHERE certification.examinerID = examiners.examinerID AND examiners.centerID = psc.CenterID AND certification.testID = test_names.ID ";

        // only view their own profiles, unless they have permission to see all
        if (!$user->hasPermission('certification_multisite')) {
            //$query .= " AND examiners.centerID = '" . $user->getData('CenterID') . "' ";
            $query .= " AND examiners.centerID = '" . $user->getData('CenterID') . "' ";
        }

        // set the class variables
        $this->columns = array('certification.certID AS ID', 'psc.Name AS PSC', 'examiners.full_name as full_name', /*'date_cert AS date', 'MIN(pass) AS status',*/ 'test_names.Full_name as certification', 'certification.visit_label as visit', 'certification.pass as pass');
        $this->query = $query;
//        $this->group_by = 'certification.certID, test_names.Full_name';
        //        $this->order_by = 'Date DESC';
        $this->order_by = 'full_name';
        $this->headers = array('PSC', 'full_name', 'date', 'subject', /*'status',*/ 'certification');
        $this->validFilters = array('examiners.centerID', 'examiners.full_name', 'cert_events.date_cert', 'test_names.Full_name');

        $this->formToFilter = array(
                'centerID' => 'examiners.centerID',
                'full_name' => 'examiners.full_name',
                'date_cert' => 'cert_events.date_cert',
                'measure' => 'test_names.Full_name'
                );
        return true;
    }


    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // PSC
        if ($user->hasPermission('certification_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList();
            if(Utility::isErrorX($list_of_sites)) {
                return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
            }
            if(is_array($list_of_sites)) $list_of_sites = array('' => 'Any') + $list_of_sites;
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        // add form elements
        $this->form->addElement('select', 'centerID', 'Site:', $list_of_sites);
        $this->form->addElement('text', 'full_name', 'Examiner full name:');
        $this->form->addElement('text', 'date_cert', 'Date:');
        $this->form->addElement('text', 'measure', 'Measure:');

        return true;
    }

    function _setDataTableRows($count)
    {
        $IDs = array();
        $duplicates = array();
        $i = 0;

        foreach ($this->list as $li) {
            $id = $li['ID'];
            $certification = $li['certification'];

            $str = explode(' ', $certification);
            $certification = $str[0];

            if (preg_match('/Mullen/', $certification)) {
                $certification .= " " . $li['visit'];
            }
            if (array_key_exists($id, $IDs)) {
                if ($li['pass'] == 'certified') {
                    if ($IDs[$id] == 'none') {
                        $IDs[$id] = $certification;
                    }
                    else {
                        $IDs[$id] .= ", " . $certification;
                    }
                }
                array_push($duplicates, $i);
            }
            else {
                if ($li['pass'] == 'certified') {
                    $IDs[$id] = $certification;
                }
                else {
                    $IDs[$id] = "none";
//                    array_push($duplicates, $i);
                }
            }
            $i++;
           /* if ($i == (sizeof($this->list) - 1)) {
//                unset($duplicates);
            }*/
        }


        //create concatenated list of certifications for each examiner
        foreach ($this->list as &$l) {
            if (array_key_exists($l['ID'], $IDs)) {
                $l['certification'] = $IDs[$l['ID']];
            }
        }
        
          
        $list =& $this->list;
        foreach ($duplicates as $k=>$v) {
            unset($list[$v]);

        }

        $x = 0;
        foreach ($list as $item) {

            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $this->tpl_data['items'][$x][1]['value'] = $measures;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key == 'full_name') {
                    $this->tpl_data['items'][$x][$i]['ID'] = $item['ID'];
                }
                if ($key != 'visit' && $key != 'pass') {
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                    $i++;
                }
            }
            $x++;
        }

        return true;
    }
}
?>
