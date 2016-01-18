<?php
/**
 * This class provides the code to create the menu filter form that allows
 * for data entry of entities that should be acknowledged in publications
 *
 * PHP Version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Justin Kat <justin.kat@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once 'NDB_Menu_Filter_Form.class.inc';

/**
 * This class provides the code to create the menu filter form that allows
 * for data entry of entities that should be acknowledged in publications   
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Justin Kat <justin.kat@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris      
 */

class NDB_Menu_Filter_Form_Acknowledgements extends NDB_Menu_Filter_Form
{

    function _hasAccess()
    {    
        // create user object and check appropriate permission
        $user =& User::singleton();
        return ($user->hasPermission('acknowledgements_view'));
    }

    function _process($values)
    {
        // create user object and check appropriate permission
        $user =& User::singleton();
        if (!$user->hasPermission('acknowledgements_edit')) {
            return;
        }

        if (!is_array($values) || count($values) == 0) {
            return true;
        }
        
        $DB =& Database::singleton();
        if (isset($_POST['fire_away'])) {
            $values['start_date'] = sprintf("%04d-%02d-%02d", $values['start_date']['Y'], $values['start_date']['M'], $values['start_date']['d']);
            $values['end_date'] = sprintf("%04d-%02d-%02d", $values['end_date']['Y'], $values['end_date']['M'], $values['end_date']['d']);
            $DB->insert('acknowledgements', $values);
            unset($values);
        }

        $this->tpl_data['success'] = true;
    }

    function _setupVariables()
    {
        // set the class variables
        $this->columns = array(
            'first_name',
            'middle_name',
            'last_name',
            'title',
            'start_date',
            'end_date'
        );
        $this->query = " FROM acknowledgements WHERE 1=1";
        $this->group_by = '';
        $this->validFilters = array(
            'first_name',
            'middle_name',
            'last_name',
            'title',
            'start_date',
            'end_date'
        );
        $this->headers = array(
            'first_name', 
            'middle_name',
            'last_name', 
            'title',
            'start_date', 
            'end_date'
        );
        $this->formToFilter = array(
            'first_name' => 'first_name',
            'middle_name' => 'middle_name',
            'last_name' => 'last_name',
            'title' => 'title',
            'start_date' => 'start_date',
            'end_date' => 'end_date'
        );

        return true;
    }

    function _setFilterForm()
    {
        // gather titles, this should match enum in acknowledgements table
        $titles = array('' => '', 'bac' => 'Bachelors', 'doc' => 'Doctor', 'mas' => 'Masters', 'phd' => 'PHD', 'pos' => 'Postdoctoral', 'rn' => 'Registered Nurse');

        // add form elements
        $this->addSelect('title', 'Title:', $titles);
        $this->addBasicText('first_name', 'First Name:');
        $this->addBasicText('middle_name', 'Middle Name:');
        $this->addBasicText('last_name', 'Last Name:');
        $config =& NDB_Config::singleton();
        $study = $config->getSetting('study');
        $dateOptions = array(
                             'language'        => 'en',
                             'format'          => 'YMd',
                             'addEmptyOption'  => true,
                             'minYear'         => $study['startYear'] - $study['ageMax'],
                             'maxYear'         => $study['endYear'] - $study['ageMin']
                             );
        $this->addBasicDate('start_date', 'Start Date:', $dateOptions);
        $this->addBasicDate('end_date', 'End Date:', $dateOptions);

        return true;
    }

}

?>
