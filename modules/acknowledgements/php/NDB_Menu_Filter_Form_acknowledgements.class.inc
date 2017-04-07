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

 require_once(__DIR__ . "/../model/require_once.php");
 
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
        $user    = User::singleton();
        $user_id = $user->userInfo["ID"];
        
        if (!isset($_GET["center_id"])) {
            return AcknowledgementPermission::CanViewForAtLeastOneCenter(
                $user_id
            );
        }
        
        $center_id = $_GET["center_id"];
        if (!is_string($center_id) || !preg_match("/^\d+$/", $center_id)) {
            return false;
        }
        
        return AcknowledgementPermission::CanViewForCenter($user_id, $center_id);
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
        $user    = User::singleton();
        $user_id = $user->userInfo["ID"];
        
        if (!isset($_POST["center_id"])) {
            return false;
        }
        
        $center_id = $_POST["center_id"];
        if (!is_string($center_id) || !preg_match("/^\d+$/", $center_id)) {
            return false;
        }
        
        if (!AcknowledgementPermission::CanInsertForCenter($user_id, $center_id)) {
            return false;
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

        $DB =& Database::singleton();
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
        $config = NDB_Config::singleton();

        /*$this->columns      = array(
                               'full_name',
                               'citation_name',
                               "(
                                    SELECT
                                        GROUP_CONCAT(c.title SEPARATOR ', ')
                                    FROM
                                        acknowledgement_affiliation r
                                    JOIN
                                        ack_center_affiliation c
                                    ON
                                        c.id = r.affiliation_id
                                    WHERE
                                        r.acknowledgement_id = a.id
                               ) AS affiliations",
                               "(
                                    SELECT
                                        GROUP_CONCAT(c.title SEPARATOR ', ')
                                    FROM
                                        acknowledgement_degree r
                                    JOIN
                                        ack_center_degree c
                                    ON
                                        c.id = r.degree_id
                                    WHERE
                                        r.acknowledgement_id = a.id
                               ) AS degrees",
                               "(
                                    SELECT
                                        GROUP_CONCAT(c.title SEPARATOR ', ')
                                    FROM
                                        acknowledgement_role r
                                    JOIN
                                        ack_center_role c
                                    ON
                                        c.id = r.role_id
                                    WHERE
                                        r.acknowledgement_id = a.id
                               ) AS roles",
                               'start_date',
                               'end_date',
                               '(end_date IS NULL OR end_date > NOW()) AS present',
                               'id'
                              );
        $this->query        = " FROM acknowledgement a WHERE 1=1";
        $this->group_by     = '';
        $this->order_by     = "
            start_date ASC,
            (end_date IS NOT NULL) ASC,
            end_date ASC
        ";*/
        $this->query = " FROM acknowledgement WHERE FALSE";
        $this->validFilters = array(
                               'full_name',
                               'citation_name',
                               'start_date',
                               'end_date',
                               //'present',
                              );
        /*$this->headers      = array(
                               'full_name',
                               'citation_name',
                               'affiliations',
                               'degrees',
                               'roles',
                               'start_date',
                               'end_date',
                               'present',
                               'id'
                              );*/
        $this->formToFilter = array(
                               'full_name'     => 'full_name',
                               'citation_name' => 'citation_name',
                               'start_date'    => 'start_date',
                               'end_date'      => 'end_date',
                               //'present'       => 'present',
                              );

        $this->tpl_data['citation_policy'] = $config->getSetting('citation_policy');

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
        $present = array(
                    ''    => '',
                    'Yes' => 'Yes',
                    'No'  => 'No',
                   );

        // add filter elements
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
        $this->addSelect('present', 'Present?', $present);

        // add form elements
        $this->addBasicText('addordering', 'Ordering:');
        $this->addBasicText('addfull_name', 'Full Name:');
        $this->addBasicText('addcitation_name', 'Citation Name:');
        
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
        $this->addBasicDate('addstart_date', 'Start Date:', $dateOptions);
        $this->addBasicDate('addend_date', 'End Date:', $dateOptions);
        $this->addSelect('addpresent', 'Present?', $present);
        
        $this->addBasicDate('start_date', 'Start Date:', $dateOptions);
        $this->addBasicDate('end_date', 'End Date:', $dateOptions);
        $this->addSelect('present', 'Present?', $present);

        $this->tpl_data["min_year"] = $startYear;
        $this->tpl_data["max_year"] = $endYear;
        
        return true;
    }

    /**
     * Add dependency on default acknowledgements.js
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps
            
        );

    }

}

?>
