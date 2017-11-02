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

    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object and check appropriate permission
        $user =& \User::singleton();
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
     * @return true on success
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

        return true;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        // enums should match with acknowledgements table
        $present = array(
                    ''    => '',
                    'Yes' => 'Yes',
                    'No'  => 'No',
                   );

        // add filter elements
        $this->addBasicText('ordering', 'Ordering:');
        $this->addBasicText('full_name', 'Full Name:');
        $this->addBasicText('citation_name', 'Citation Name:');
        $config      =& \NDB_Config::singleton();
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
        $this->addSelect('present', 'Present?', $present);

        // add form elements
        $this->addBasicText('addordering', 'Ordering:');
        $this->addBasicText('addfull_name', 'Full Name:');
        $this->addBasicText('addcitation_name', 'Citation Name:');
        $config      =& \NDB_Config::singleton();
        $startYear   = $config->getSetting('startYear');
        $endYear     = $config->getSetting('endYear');
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

        return true;
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
             $baseurl . '/acknowledgements/js/acknowledgements_helper.js',
            )
        );

    }

}

?>
