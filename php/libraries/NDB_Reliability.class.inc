<?php
/**
 * This file contains the base class for creating reliability tests.
 * Reliability instruments extend this in a way that is analogous to
 * NDB_BVL_Instrument, and implement their comparison of calculation
 * of reliability scores.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Unknown(Samir?) <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once "NDB_Form.class.inc";
require_once'RequiredIf.inc';

/**
 * The class that implements base functionality for Reliability checking.
 *
 * @category Main
 * @package  Loris
 * @author   Unknown(Samir?) <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Reliability extends NDB_Form
{
    /**
     * Class name
     * @var    string
     * @access private
     */
    var $reliability_center_id;


    /**
     * Generates a new form instance and runs the appropriate method
     *
     * @param string  $name                  Identifies the form
     * @param string  $page                  Identifies the page to show
     * @param string  $identifier            CommentID to load data from
     * @param integer $reliability_center_id The CenterID doing reliability
     *
     * @return void
     */
    static function &factory($name, $page, $identifier, $reliability_center_id)
    {
        // check that the form class exists
        if (class_exists("NDB_Reliability_$name")) {
            $class = "NDB_Reliability_$name";
        } else {
            return PEAR::raiseError("The form class ($name) is not defined.");
        }

        // create a form instance
        $obj = new $class;

        // set the local variables
        $obj->_setupPage($name, $page, $identifier, null, 'test_form');

        $obj->reliability_center_id = $reliability_center_id;

        $access = $obj->_hasAccess();
        if (Utility::isErrorX($access)) {
            return PEAR::raiseError(
                "NDB_Form::factory() access: ".$access->getMessage()
            );
        }

        // check that user has access
        if ($access == false) {
            return PEAR::raiseError("You do not have access to this page.");
        }

        if (method_exists($obj, $page)) {
            $success = $obj->$page();
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError(
                    "NDB_Form::factory() page: ".$success->getMessage()
                );
            }
            $obj->template = $page;
        } elseif (method_exists($obj, $name)) {
            $success = $obj->$name();
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError(
                    "NDB_Form::factory() name: ".$success->getMessage()
                );
            }
            $obj->template = $name;
        } else {
            return PEAR::raiseError("Form does not exist: $name $page");
        }

        return $obj;
    }



    /**
     * Displays the form
     *
     * @return void
     * @access public
     */
    function display()
    {
        if ($_REQUEST['blind'] == '1') {
            $this->addHidden('blind', $_REQUEST['blind']);
        }
        if (!$this->form->isFrozen()) {
            // hidden values
            $this->addHidden('test_name', $this->name);
            $this->addHidden('subtest', $this->page);
            $this->addHidden('identifier', $this->identifier);
        }

        // get the defaults
        $localDefaults = $this->_getDefaults();
        if (Utility::isErrorX($localDefaults)) {
            return PEAR::raiseError(
                "NDB_Form::display(): ".$localDefaults->getMessage()
            );
        }
        if (!is_array($localDefaults)) {
            $localDefaults = array();
        }
        // set the quickform object defaults
        $this->form->setDefaults(array_merge($this->defaults, $localDefaults));

        // trim all values
        $this->form->applyFilter('__ALL__', 'trim');

        // display the HTML_Quickform object
        $smarty   = new Smarty_neurodb;
        $renderer = new HTML_QuickForm_Renderer_ArraySmarty($smarty);
        $this->form->accept($renderer);
        $smarty->assign('form', $renderer->toArray());
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("form_$this->template.tpl");
        return $html;
    }

    /**
     * Saves the form
     *
     * Attempts to validate the form (using the defined rules) and
     * saves the validated data into the database
     *
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function save()
    {
        if ($this->form->validate()) {
            $success = $this->form->process(array(&$this, "_save"), false);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("NDB_Form::save(): ".$success->getMessage());
            }
        }
    }


    /**
     * Preprocesses the array of values to be saved into the database
     *
     * @param array $values The array of values ready to be passed to
     *                      a Database::replace call as the set array
     *
     * @return void
     */
    function _save($values)
    {
        unset(
            $values['test_name'],
            $values['subtest'],
            $values['identifier'],
            $values['fire_away'],
            $values['blind']
        );

        // clear any fields starting with __
        foreach (array_keys($values) AS $key) {
            if (strpos($key, '__') === 0) {
                unset($values[$key]);
            }
        }

        $success = $this->_process($values);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("NDB_Form::_save(): ".$success->getMessage());
        }
    }

    /**
     * Adds a date element and status to the form for this reliability
     * instrument
     *
     * @param string $name  The element name
     * @param string $label The label to attach to this element
     *
     * @return none
     */
    function addDateElement($name, $label)
    {
        $group[] = $this->createDate(
            $name . "_date",
            null,
            $this->dateOptions
        );
        $group[] = $this->createSelect(
            $name . "_date_status",
            null,
            array(
             null           => "",
             'not_answered' => "Not Answered",
            )
        );

        $this->dateTimeFields[] = $name . "_date"; //add to array of dates and times.

        $this->addGroup(
            $group,
            $name . "_date_group",
            $label,
            $this->_GUIDelimiter,
            false
        );
        unset($group);
        $this->XINRegisterRule(
            $name . "_date",
            array($name . "_date_status{@}=={@}"),
            "A Date, or Not Answered is required.",
            $name . "_date_group"
        );

    }

    /**
     * Registers a XIN Rule for this reliability instrument
     *
     * @param string $elname  The element name that has the rule
     * @param array  $rules   Array of rules in XIN format
     * @param string $message The message if this rule fails
     * @param string $group   The group that should display the error
     *
     * @return none
     */
    function XINRegisterRule($elname, $rules, $message="", $group="")
    {
        if (!is_array($rules)) {
            $rules_array[] =$rules;
        } else {
            $rules_array =$rules;
        }
            $this->XINRules[$elname]['message'] =$message;
            $this->XINRules[$elname]['group']   =$group;

        foreach ($rules_array as $rule) {
            $this->XINRules[$elname]['rules'][] =$rule;
        }
            return true;
    }

    /**
     * Adds a text field with an accompanying status field
     *
     * @param string $field        The database field
     * @param string $label        The label to attach to the form element
     * @param array  $rules        An array of XIN rules
     * @param string $rule_message The error message if a rule is violated
     * @param array  $refusals     List of options to include in the _status
     *                             dropdown
     *
     * @return none
     */
    function addTextElement(
        $field,
        $label,
        $rules = array(),
        $rule_message = 'This field is required.',
        $refusals = array(
                     ''             => '',
                     'not_answered' => 'Not Answered',
                    )
    ) {
        $group[] =&$this->createText($field);
        $group[] =&$this->createSelect($field."_status", "", $refusals);
        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array =array_merge(array($field.'_status{@}=={@}'), $rules);
        $this->XINRegisterRule($field, $rules_array, $rule_message, $field.'_group');
    }

     /**
      * Wrapper to create a text area field, with an accompanying status field.
      *
      * @param string $field        The database field in which the response
      *                             will be stored
      * @param string $label        The question text to display
      * @param array  $rules        {@} delimited rules
      * @param string $rule_message rule message to display upon rule violation
      *
      * @return none
      */
    function addTextAreaElement(
        $field,
        $label,
        $rules = array(),
        $rule_message = 'This field is required.'
    ) {
        $group[] =& $this->form->createElement(
            "textarea",
            $field,
            null,
            array(
             'cols' => 25,
             'rows' => 4,
            )
        );
        $group[] =& $this->createSelect(
            $field."_status",
            "",
            array(
             null           => '',
             'not_answered' => 'Not Answered',
            )
        );
        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array =array_merge(array($field.'_status{@}=={@}'), $rules);
        $this->XINRegisterRule($field, $rules_array, $rule_message, $field.'_group');
    }

    /**
     * This does nothing. The stub is left in case a reliability instrument
     * somewhere depends on it.
     *
     * @param string $field        The Fieldname
     * @param string $label        The label to attach to the field
     * @param array  $rules        A collection of XIN rules
     * @param string $rule_message The error message to display if a rule is
     *                             violated.
     *
     * @return none
     */
    function addLargeTextAreaElement(
        $field,
        $label        = "&nbsp;&nbsp;&nbsp;&nbsp;Describe:",
        $rules        = array(),
        $rule_message = 'This field must be completed or marked as not answered.'
    ) {
        //removed all free form comment text boxes.
        return;
    }

    /**
     * Adds standard meta data fields (ie. Examiner, Date_taken
     * to the form object.
     *
     * @return none
     */
    function _addMetadataFields()
    {
          $config      =& NDB_Config::singleton();
          $dateOptions = array(
                          'language'         => 'en',
                          'format'           => 'YMd',
                          'minYear'          => $config->getSetting('startYear'),
                          'maxYear'          => $config->getSetting('endYear'),
                          'addEmptyOption'   => true,
                          'emptyOptionValue' => null,
                         );

          $this->addBasicDate('Date_taken', 'Date of Administration', $dateOptions);

          $examiners = $this->_getExaminerNames();
          $this->addSelect('Examiner', 'Reliability Coder', $examiners);

          $this->form->registerRule('checkdate', 'callback', '_checkDate');

          $this->addSelect(
              'invalid',
              '<font color="red">Mark as invalid</font>',
              array(
               "no"  => "No",
               "yes" => "YES",
              )
          );
          $this->addRule('invalid', 'Invalid flag is required.', 'required');

          $this->addRule(
              'Date_taken',
              'Date of Administration is invalid',
              'checkdate'
          );
    }

    /**
     * Get a list of examiner names for the site of the current reliability
     * candidate.
     *
     * @return array of examiner names (as strings)
     */
    function _getExaminerNames()
    {
         $db       =& Database::singleton();
         $user     =& User::singleton();
         $centerID = $user->getCenterID();

         // UofA is a special case--they never enter their own data.
         // So the available examiners are either the ones at the logged
         // in user's site, or UofA
         $results = $db->pselect(
             "SELECT examinerID, full_name
                 FROM examiners
             WHERE centerID IN (:CentID, 6)
                 ORDER BY full_name",
             array('CentID' => $centerID)
         );
        if ($db->isError($results)) {
            return $this->raiseError(
                "Could not get examiner names: ".$results->getMessage()
            );
        }

            $examiners = array('' => '');
        if (is_array($results) && !empty($results)) {
            foreach ($results AS $row) {
                $examiners[$row['examinerID']] = $row['full_name'];
            }
        }
            return $examiners;
    }

    /**
     * Converts a QuickForm date to a MySQL formatted database
     * date
     *
     * @param array $formDateValue Date in the array format returned
     *                             by QuickForm
     *
     * @return MySQL formatted string
     */
    function _getDatabaseDate($formDateValue)
    {
        if (!empty($formDateValue)) {
            if (count($formDateValue)==2) {
                //handle time (HH:MM:SS)
                $databaseValue = "$formDateValue[H]:$formDateValue[i]";
            } else {
                //handle date (YYYY/MM/DD)
                $databaseValue
                    = "$formDateValue[Y]-$formDateValue[M]-$formDateValue[d]";
            }
        }
         return $databaseValue;
    }

}
?>
