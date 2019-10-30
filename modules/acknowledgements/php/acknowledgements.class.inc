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
     * Validates the submitted form
     *
     * @param array $values Array of submitted values
     *
     * @return array An array of errors, possibly empty
     */
    function _validate($values): array
    {
        $errors = array();

        if ($values['addStartDate'] > $values['addEndDate']) {
            $errors['dates'] = "Start date cannot be greater than the end date.";
        }

        return $errors;
    }

    /**
     * Processes the submitted form
     *
     * @param array $values Array of submitted values
     *
     * @return boolean true if successful
     */
    function _process($values)
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $baseurl = $factory->settings()->getBaseURL();

        // create user object and check appropriate permission
        $user =& \User::singleton();
        if (!$user->hasPermission('acknowledgements_edit')) {
            return false;
        }
        if (!is_array($values) || count($values) == 0) {
            return false;
        }
        if (!isset($_POST['fire_away'])) {
            return false;
        } else {

            if ($values['addPresent'] === 'Yes') {
                $values['addEndDate'] = null;
            }
            $affiliations = is_array($values['addAffiliations']) ?
                implode(', ', $values['addAffiliations']) :
                $values['addAffiliations'];
            $degrees      = is_array($values['addDegrees']) ?
                implode(', ', $values['addDegrees']) :
                $values['addDegrees'];
            $roles        = is_array($values['addRoles']) ?
                implode(', ', $values['addRoles']) :
                $values['addRoles'];
            $results      = array(
                'ordering'      => $values['addOrdering'],
                'full_name'     => $values['addFullName'],
                'citation_name' => $values['addCitationName'],
                'affiliations'  => $affiliations,
                'degrees'       => $degrees,
                'roles'         => $roles,
                'start_date'    => $values['addStartDate'],
                'end_date'      => $values['addEndDate'],
                'present'       => $values['addPresent'],
            );

            $DB->insert('acknowledgements', $results);
            unset($values);

            header("Location: {$baseurl}/acknowledgements/", true, 303);
            return true;
        }
    }

    /**
     * Sets up all the class variables needed for the
     * acknowledgements menu filter
     *
     * @return void
     */
    function _setupVariables()
    {
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

        $present = array(
            'Yes' => 'Yes',
            'No'  => 'No',
        );

        $this->fieldOptions = array('presents' => $present);
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string JSON
     */
    function toJSON()
    {
        $config = \NDB_Config::singleton();

        // enums should match with acknowledgements table
        $result         = $this->toArray();
        $result['form'] = $this->form->form;

        $result['citation_policy'] = $config->getSetting('citation_policy');
        $result['minYear']         = $config->getSetting('startYear');
        $result['maxYear']         = $config->getSetting('endYear');

        return json_encode($result);
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
