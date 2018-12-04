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
namespace LORIS\acknowledgements;

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

class Acknowledgements extends \NDB_Menu_Filter_Form
{
    public $skipTemplate = true;

    /**
     * Determine whether user should be granted access.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
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
        $user =& \User::singleton();
        if (!$user->hasPermission('acknowledgements_edit')) {
            return;
        }

        if (!is_array($values) || count($values) == 0) {
            return true;
        }

        $results = array();
        foreach ($values as $key => $value) {
            $results[substr($key, 3)] = $value;
        }
        $values = $results;

        $values['affiliations'] = implode(",", $values['affiliations']);
        $values['degrees']      = implode(",", $values['degrees']);
        $values['roles']        = implode(",", $values['roles']);

        $DB =& \Database::singleton();
        if (isset($_POST['fire_away'])) {

            if (empty($values['present'])) {
                $values['present'] = null;
            }

            if (empty($values['end_date'])) {
                $values['end_date'] = null;
            }

            if (empty($values['start_date'])) {
                $values['start_date'] = null;
            }

            if ($values['present'] == 'Yes') {
                $values['end_date'] = null;
            }

            $DB->insert('acknowledgements', $values);
            unset($values);
        }

        $this->tpl_data['success'] = true;
    }

    /**
     * Sets up all the class variables needed for the
     * acknowledgements menu filter
     *
     * @return void
     */
    function _setupVariables()
    {
        $config = \NDB_Config::singleton();

        $this->columns      = array(
                               'ordering',
                               'full_name',
                               'citation_name',
                               'affiliations',
                               'degrees',
                               'roles',
                               'start_date',
                               'end_date',
                               'present',
                              );
        $this->query        = " FROM acknowledgements WHERE 1=1";
        $this->group_by     = '';
        $this->order_by     = "ordering ASC";
        $this->validFilters = array(
                               'full_name',
                               'citation_name',
                               'start_date',
                               'end_date',
                               'present',
                              );
        $this->headers      = array(
                               'ordering',
                               'full_name',
                               'citation_name',
                               'affiliations',
                               'degrees',
                               'roles',
                               'start_date',
                               'end_date',
                               'present',
                              );
        $this->formToFilter = array(
                               'full_name'     => 'full_name',
                               'citation_name' => 'citation_name',
                               'start_date'    => 'start_date',
                               'end_date'      => 'end_date',
                               'present'       => 'present',
                              );

        $this->tpl_data['citation_policy'] = $config->getSetting('citation_policy');
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

        $config      = \NDB_Config::singleton();
        $startYear   = $config->getSetting('startYear');
        $endYear     = $config->getSetting('endYear');

        // enums should match with acknowledgements table
        $present = array(
                    'Yes' => 'Yes',
                    'No'  => 'No',
                   );

        $this->fieldOptions = array(
                                'presents' => $present,
                              );
        // add form elements
        $this->addBasicText('addordering', 'Ordering:');
        $this->addBasicText('addfull_name', 'Full Name:');
        $this->addBasicText('addcitation_name', 'Citation Name:');
        $dateOptions = array(
                        'language'       => 'en',
                        'format'         => 'YMd',
                        'addEmptyOption' => true,
                        'minYear'        => $startYear,
                        'maxYear'        => $endYear,
                       );
        $this->addBasicDate('addstart_date', 'Start Date:', $dateOptions);
        $this->addBasicDate('addend_date', 'End Date:', $dateOptions);
        $this->addSelect('addpresent', 'Present?', $present);
    }

    /**
     * Add dependency on default acknowledgements.js
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
             $baseurl . '/acknowledgements/js/acknowledgementsIndex.js',
            )
        );

    }

}


