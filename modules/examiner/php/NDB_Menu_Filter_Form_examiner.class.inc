<?php
/**
 * Examiner module
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris
 */

require_once 'NDB_Menu_Filter.class.inc';
require_once 'NDB_Form.class.inc';

/**
 * Examiner module
 *
 * PHP Version 5
 *
 * @category Clinical
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class NDB_Menu_Filter_Form_examiner extends NDB_Menu_Filter_Form
{
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        //return $user->hasPermission('examiner');
        return true;
    }

    function _setupVariables()
    {
        // the base query
        $query = " FROM examiners e LEFT JOIN psc ON (e.centerID=psc.CenterID)";


        // set the class variables
        $this->columns      = array('e.full_name as Examiner', 'psc.Name as Site',
                               'e.radiologist as Radiologist');
        $this->query        = $query;
        $this->headers      = array('Examiner','Site', 'Radiologist');
        $this->validFilters = array('e.full_name', 'psc.Name', 'e.radiologist');

        $this->formToFilter = array(
                'examiner' => 'e.full_name',
                'site' => 'psc.Name',
                'radiologist' => 'e.radiologist'
                );
        return true;
    }


    function _setFilterForm()
    {
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = Utility::getSiteList();
            if(Utility::isErrorX($sites)) {
                return PEAR::raiseError("DB Error: ".$sites->getMessage());
            }
            if(is_array($sites)) $sites = array('' => 'All') + $sites;
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

        $radiologist = array(null => 'All', 
            '1' => 'Yes', 
            '0' => 'No'
        );

        // add form elements
        $this->addBasicText('examiner', 'Examiner:');
        $this->addSelect('site', 'Site:', $sites);
        $this->addSelect('radiologist', 'Radiologist:', $radiologist);

        $this->addBasicText('addFirstName', 'Firstname');
        $this->addBasicText('addLastName', 'Lastname');
        $this->addSelect('addSite', 'Site', $sites);

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
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                $i++;
            }
            $x++;
        }

        return true;
    }

    function _process($values)
    {
        $DB =& Database::singleton();
        
        print_r($values);
        return true;
    }
}
?>