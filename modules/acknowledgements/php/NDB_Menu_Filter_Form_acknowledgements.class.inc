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

    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object and check appropriate permission
        $user =& User::singleton();
        return ($user->hasPermission('acknowledgements_view'));
    }

    /**
     * Processes the submitted form
     *
     * @param array $values Array of submitted values
     *
     * @return boolean
     */
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

        $values['affiliations'] = implode(",",$values['affiliations']);
        $values['degrees'] = implode(",",$values['degrees']);
        $values['roles'] = implode(",",$values['roles']);

        $DB =& Database::singleton();
        if (isset($_POST['fire_away'])) {
            $values['start_date'] = sprintf(
                "%04d-%02d-%02d",
                $values['start_date']['Y'],
                $values['start_date']['M'],
                $values['start_date']['d']
            );
            $values['end_date']   = sprintf(
                "%04d-%02d-%02d",
                $values['end_date']['Y'],
                $values['end_date']['M'],
                $values['end_date']['d']
            );
            $DB->insert('acknowledgements', $values);
            unset($values);
        }

        $this->tpl_data['success'] = true;
    }

    /**
     * Sets up all the class variables needed for the
     * acknowledgements menu filter
     *
     * @return true on success
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns      = array(
                               'ordering',
                               'full_name',
                               'citation_name',
                               'title',
                               'affiliations',
                               'degrees',
                               'roles',
                               'start_date',
                               'end_date',
                              );
        $this->query        = " FROM acknowledgements WHERE 1=1";
        $this->group_by     = '';
        $this->order_by     = "ordering ASC";
        $this->validFilters = array(
                               'full_name',
                               'citation_name',
                               'title',
                               'start_date',
                               'end_date',
                              );
        $this->headers      = array(
                               'ordering',
                               'full_name',
                               'citation_name',
                               'title',
                               'affiliations',
                               'degrees',
                               'roles',
                               'start_date',
                               'end_date',
                              );
        $this->formToFilter = array(
                               'full_name'     => 'full_name',
                               'citation_name' => 'citation_name',
                               'title'         => 'title',
                               'start_date'    => 'start_date',
                               'end_date'      => 'end_date',
                              );

        return true;
    }

    /**
     * Create the form for the acknowledgements menu page
     *
     * @return true
     */
    function _setFilterForm()
    {
        // enums should match with acknowledgements table
        $titles = array(
                   ''                 => '',
                  );

        // add form elements
        $this->addSelect('title', 'Title:', $titles);
        $this->addBasicText('ordering', 'Ordering:');
        $this->addBasicText('full_name', 'Full Name:');
        $this->addBasicText('citation_name', 'Citation Name:');
        $config      =& NDB_Config::singleton();
        $startYear   = $config->getSetting('startYear');
        $endYear     = $config->getSetting('endYear');
        $dateOptions = array(
                        'language'       => 'en',
                        'format'         => 'YMd',
                        'addEmptyOption' => true,
                        'minYear'        => $startYear,
                        'maxYear'        => $endYear,
                       );
        $this->addBasicDate('start_date', 'Start Date:', $dateOptions);
        $this->addBasicDate('end_date', 'End Date:', $dateOptions);

        return true;
    }

}

?>
