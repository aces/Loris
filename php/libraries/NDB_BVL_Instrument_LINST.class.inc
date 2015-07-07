<?php
/**
 * This file contains the base class for instruments in Loris
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace Loris\Behavioural;
require_once 'NDB_Page.class.inc';
require_once "PEAR.php";
require_once "HTML/QuickForm.php";
require_once 'HTML/QuickForm/Renderer/Array.php';
require_once 'NDB_BVL_InstrumentStatus_ControlPanel.class.inc';
require_once 'HTML/QuickForm/Renderer/Default.php';

/**
 * Base class for all NeuroDB behavioural instruments
 *
 * Throws PEAR errors. Also requires PEAR HTML_Quickform.
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Instrument_LINST extends \NDB_BVL_Instrument
{

    var $InstrumentType = 'LINST';

    var $LinstQuestions = array();

    /**
     * True if the page is being previewed from the instrument builder,
     * and not really loaded.
     */
    var $preview = false;

    /**
     * Sets up the variables required for a LINST instrument to load
     *
     * @param string $commentID The CommentID being loaded
     * @param string $page      The page being loaded
     *
     * @return none
     */
    function setup($commentID, $page)
    {
        $this->commentID = $commentID;
        $this->page      = $page;

        $this->form = new \HTML_Quickform('test_form');
    }
    /**
     * Adds metadata fields (such as Examiner and Date_taken) to the
     * current form
     *
     * @return void
     * @access private
     */
    function _addMetadataFields()
    {
        $config      =& \NDB_Config::singleton();
        $dateOptions = array(
                        'language'         => 'en',
                        'format'           => 'YMd',
                        'minYear'          => $config->getSetting('startYear'),
                        'maxYear'          => $config->getSetting('endYear'),
                        'addEmptyOption'   => true,
                        'emptyOptionValue' => null,
                       );

        $this->dateOptions = $dateOptions;

        $this->addBasicDate('Date_taken', 'Date of Administration', $dateOptions);

        if (strrpos($this->testName, '_proband') === false) {
            $this->addScoreColumn(
                'Candidate_Age',
                'Candidate Age (Months)',
                'Please enter date of administration and press Save'
            );
            $this->addScoreColumn(
                'Window_Difference',
                'Window Difference (+/- Days)',
                'Please enter date of administration and press Save'
            );
        }
        $examiners = $this->_getExaminerNames();
        $this->addSelect('Examiner', 'Examiner', $examiners);

        $this->addGroupRule(
            'Date_taken',
            'Date of Administration is required',
            'required'
        );

        $this->form->registerRule('checkdate', 'callback', '_checkDateTaken');
        $this->addRule(
            'Date_taken',
            'Date of Administration is invalid',
            'checkdate'
        );

        $this->addRule('Examiner', 'Examiner is required', 'required');
    }

    /**
     * Looks up the full name for the current instrument
     * TODO: Update this to parse from LINST file
     *
     * @return string the full name of the instrument
     */
    function getFullName()
    {
        $db =& Database::singleton();

        $success = $db->pselectOne(
            "SELECT Full_name FROM test_names WHERE Test_name=:TN",
            array('TN' => $this->testName)
        );
        return $success;
    }

    /**
     * Gets a list of subtests of the current instrument
     * TODO: Update this to parse from LINST file
     *
     * @return array
     * @throws PEAR::Error
     */
    function getSubtestList()
    {
        // get a database connection
        $db =& \Database::singleton();

        $query = "SELECT Subtest_name AS Name, Description
            FROM instrument_subtests
            WHERE Test_name=:TN
                ORDER BY Order_number";

        $results = $db->pselect($query, array('TN' => $this->testName));

        return $results;
    }


    /**
     * This runs the XIN rules on all the elements on the current page to ensure
     * that no rules were violated.
     *
     * @param array $elements The value of all the elements on the current page
     *                        to validate.
     *
     * @return associative array of errors (fieldname => errormessage) or true
     *         if no errors.
     */
    function XINValidate($elements)
    {
        unset($elements['key'], $elements['pageNum'], $elements['nextpage']);
        $this->XINDebug = false;  //Turn this on to see rules debuggin output

        $errors = array();
        foreach ($elements AS $elname => $elvalue) {
            //If the element is a group (and thus elvalue is an array)
            //trigger the Null Value default rule if ANY of the values
            //in the group are empty.
            $flag = true;
            if (is_array($elvalue)) {
                foreach ($elvalue AS $val) {
                    if ($val == "") {
                        $flag = false;
                    }
                }
            }

            // Run any rules that are dependent on the value of the current question,
            // ie if XINRegister was called as
            //      $this->XINRegisterRule(
            //          "q1",
            //          "q1{@}<={@}3",
            //          "Must be less than or equal to 3"
            //      );
            // These differ from 'required' rules in that they're run even if the
            // value isn't empty. Currently, this only supports simple, one value
            // comparisons (though XINRegister can be called multiple times and each
            // needs to be enforced independently), because the logic in
            // XINRunElementRules is confusing and modifying it could potentially
            // break existing XINRules.
            //
            // DINRunElementRules only runs a single rule, and returns false if it's
            // violated. It's much simpler than XINRules but should be expanded
            // later to support more complex logic.
            //
            // - Dave

            // Numeric data types min/max are enforced through PHP, not XINRules.
            // This is because if a user registers XINRules for the question, we
            // still want to enforce the min/max for the field. It also makes
            // dealing with _status==not_answered easier, because the rules for
            // enforcing range are independent of the rules for enforcing
            // required.
            if ($this->LinstQuestions[$elname]['type'] === 'numeric') {
                // Cast everything to a double so that < and > work as
                // expected
                $value = doubleval($elements[$elname]);
                $min   = doubleval(
                    $this->LinstQuestions[$elname]['options']['min']
                );
                $max   = doubleval(
                    $this->LinstQuestions[$elname]['options']['max']
                );

                // If the value is empty, XINRules handle required messages.
                // "0" is empty in PHP. If the user entered 0 we still want to
                // enforce the min/max.
                if (!empty($value) || $elements[$elname] === '0') {
                    if (!empty($min)) {
                        if ($value < $min) {
                            $errors[$elname . "_group"]
                                = "Must be greater than $min.";
                        }
                    }
                    if (!empty($max)) {
                        if ($value > $max) {
                            $errors[$elname . "_group"]
                                = "Must be less than $max.";
                        }
                    }
                }
            }
            if (!empty($this->XINRules[$elname])) {
                $registered_rules = $this->XINRules[$elname];
                if ($this->XINDebug) {
                    //debugging code
                    echo "<p><b>$elname</b><br> ";
                }
                foreach ($registered_rules as $registered) {
                    $rules = $registered['rules'];

                    foreach ($rules as $rule) {
                        //If this is an OR rule using two different controllers
                        //explode it at the pipe.
                        //ex: q_1{@}=={@}yes|q_2{@}=={@}yes
                        if (stristr(substr($rule, strpos($rule, "|")), "{@}")) {
                            $rules_array = explode("|", $rule);
                        } else {
                            //Otherwise its a regular rule.  ex: q_1{@}=={@}yes
                            $rules_array[] = $rule;
                        }
                        foreach ($rules_array as $rule) {
                            $rule_array = explode("{@}", $rule);
                            if ($rule_array[0] == $elname) {
                                $result = $this->DINRunElementRules(
                                    $elname,
                                    $elements,
                                    $registered
                                );
                                if ($result == false) {
                                    $el = $registered['group'] != ""
                                        ? $registered['group']
                                        : $elname;

                                    $errors[$el] = $registered['message'];
                                }
                            }
                        }
                    }
                }
            }

            //If the answer is empty (or its a group and one of answers in the
            //group is empty) then run the rules
            if ($elvalue=="" || $flag==false) {
                if ($this->XINDebug) {
                    //debugging code
                    echo "<p><b>$elname</b><br> ";
                }
                if (!empty($this->XINRules[$elname])) {
                    if ($this->InstrumentType === 'LINST') {
                        $registered_rules = $this->XINRules[$elname];
                        foreach ($registered_rules as $registered_rule) {
                            $result = $this->XINRunElementRules(
                                $elname,
                                $elements,
                                $registered_rule
                            );
                            if (is_array($result)) {
                                $errors += $result;
                            }
                        }
                    } else {
                        $result = $this->XINRunElementRules(
                            $elname,
                            $elements,
                            $this->XINRules[$elname]
                        );
                        if (is_array($result)) {
                            $errors += $result;
                        }
                    }
                } else if (substr($elname, -7) != "_status"
                    && !in_array($elname, array("page", "subtest"))
                ) {
                    $errors[$elname] = "Required.";
                    if ($this->XINDebug) {
                        echo "Required by default";
                    }
                } else {
                    if ($this->XINDebug) {
                        echo "Status' not required by default";
                    }
                }
            }
        }

        if (!empty($errors)) {
            return $errors;
        }
        return true;
    }

    /**
     * Run registered rules for $elname. Only used for instrument builder
     * instruments.
     *
     * @param string  $elname     The element to be validate
     * @param array   $elements   array of values from current page.
     * @param boolean $registered Array of all rules which have been
     *                            registered.
     *
     * @return boolean true if the element passes, false if it fails a rule.
     */
    function DINRunElementRules($elname, $elements, $registered)
    {
        foreach ($registered['rules'] AS $rule) {
            //Loop through the assigned rules (which is the array of formatted
            //statements passed in XINRegisterRule)
            $split        = explode('{@}', $rule);
            $userval      = $elements[$elname];
            $operator     = $split[1];
            $comparevalue = $split[2];

            // Special case for if the rule was registered
            // as "q{@}=={@}NEVER_REQUIRED"
            if ($comparevalue == 'NEVER_REQUIRED' && $operator == '==') {
                return true;
            }
            $compareFunction = create_function(
                '$a, $b',
                "return \$a $operator \$b;"
            );

            if (!($compareFunction($comparevalue, $userval)) ) {
                return false;
            }
        }
        // Nothing that was compared failed
        return true;
    }

    /**
    * Attaches a user defined rule (conditions) to a form element (grouped or not).
    *
    * @param string $elname  Name of element registering the rule
    * @param array  $rules   Array of rules to apply in an AND fashion.
    *                        Rules are written in rose ({@}) format
    *                        (ie. array('q_8{@}=={@}1_yes','q_8_a_status{@}=={@}').
    *                        ORs may be written within the same array value.
    * @param string $message Message to print upon rule violation
    * @param string $group   Empty if a non-grouped element is registering the rule.
    *                        Otherwise, name of the group registering the rule.
    *
    * @return none
    */
    function XINRegisterRule($elname, $rules, $message="", $group="")
    {
        // I'm not sure if these are logically the same. I think they should be, but
        // there was a bug introduced by the LINST changes to XINRules to old
        // instruments so I'm making sure that the old code is followed exactly
        // with this if block.
        // After everything's working, review this to see if we can get rid of one of
        // the if statement and use the same logic for "old" instruments and "new"
        // instruments
        //  -- Dave
        if (!is_array($rules)) {
            $rules_array[] = $rules;
        } else {
            $rules_array = $rules;
        }
        $rule = array(
                 'message' => $message,
                 'group'   => $group,
                 'rules'   => array(),
                );

        foreach ($rules_array AS $rule_cmd) {
            $rule['rules'][] = $rule_cmd;
        }
        $this->XINRules[$elname][] = $rule;
        return true;
    }

    /**
     * This does the work of parsing a Loris Instrument (.linst) file and
     * calling all the appropriate addElement functions to build the instrument
     * page for user data entry.
     *
     * @param string  $filename The filename to be loaded, or a base64 encoded
     *                          string of a .linst file to be interpreted.
     * @param boolean $base64   If true, read the filename as a base64 encoded
     *                          string of the file content, used for preview
     *                          when no file has yet been saved to the
     *                          instruments/ directory
     *
     * @return none, but as a side effect displays the Instrument page
     */
    function loadInstrumentFile($filename, $base64 = false)
    {
        if (file_exists($filename) || $base64 === true) {
            $this->InstrumentType = 'LINST';

            $db         = \Database::singleton();
            $this->form = new \HTML_Quickform('test_form');

            $this->dateTimeFields = array("Date_taken");
            $this->formType       = 'XIN';

            $this->form->addFormRule(array(&$this, 'XINValidate'));
            $fp = fopen($filename, "r");

            // Add elements is only true if we're parsing the current page,
            // otherwise we don't.. but even on other pages, we need to
            // parse the whole file for table{@} and other meta elements
            $addElements = true;
            if (!empty($this->page)) {
                $currentPage = $_REQUEST['subtest'];
                $addElements = false;
            } else {
                $currentPage = 'top';
                $addElements = true;
            }

            $parsingPage       = 'top';
            $firstSelectOfPage = true;

            $Group = array(
                      'Name'      => null,
                      'Elements'  => array(),
                      'Delimiter' => $this->_GUIDelimiter,
                     );

            while (($line = fgets($fp, 4096)) !== false) {
                $pieces = preg_split("/{@}/", $line);

                $type      = $pieces[0];
                $fieldname = isset($pieces[1]) ? $pieces[1] : null;
                if (strpos($fieldname, "_status") !== false) {
                    continue;
                }
                if ($fieldname == 'Date_taken'
                    || $fieldname == "Candidate_Age"
                    || $fieldname == "Window_Difference"
                    || $fieldname == "Examiner"
                ) {
                    continue;
                }
                switch($type) {
                case 'page':
                    $parsingPage = trim($pieces[2]);
                    $pageName    = $db->pselectOne(
                        "SELECT Subtest_name
                        FROM instrument_subtests
                        WHERE Test_name=:testinst AND Description=:parsing",
                        array(
                         'testinst' => $this->testName,
                         'parsing'  => $parsingPage,
                        )
                    );
                    if ($currentPage == $pageName) {
                        $addElements = true;
                    } else {
                        $addElements = false;
                    }
                    $firstSelectOfPage = true;
                    break;
                case 'table':
                    $this->testName = trim($pieces[1]);
                    $this->table    = trim($pieces[1]);
                    break;
                case 'title':
                    if ($addElements) {
                        $this->form->addElement(
                            'header',
                            'instrument_title',
                            $pieces[1]
                        );
                        $this->_addMetadataFields();
                    }
                    break;
                case 'begingroup':
                    if ($addElements) {
                        $Group['Name']      = $pieces[1] . '_group';
                        $Group['Delimiter'] = trim($pieces[2]);

                        if (empty($Group['Delimiter'])) {
                            $Group['Delimiter'] = $this->_GUIDelimiter;
                        }
                    }
                    break;
                case 'endgroup':
                    if ($addElements) {
                        $groupLabel = $pieces[2];
                        $this->addGroup(
                            $Group['Elements'],
                            $Group['Name'],
                            $groupLabel,
                            $Group['Delimiter'],
                            false
                        );

                        $Group['Name']     = null;
                        $Group['Elements'] = array();
                    }
                    break;

                case 'begintable':
                    if ($addElements) {
                        $this->form->addElement(
                            'static',
                            null,
                            "</td></tr></table><table><tr><td>&nbsp;",
                            ""
                        );
                    }
                    break;
                case 'endtable':
                    if ($addElements) {
                        $this->form->addElement(
                            'static',
                            null,
                            "</td></tr></table><table><tr><td>&nbsp;",
                            ""
                        );
                    }
                    break;
                case 'text':
                    if ($addElements) {
                        if ($Group['Name'] != null) {
                            $Group['Elements'][] = $this->createText(
                                $pieces[1],
                                $pieces[2]
                            );

                        } else {
                            $this->addTextElement($pieces[1], $pieces[2]);
                        }
                    }
                    $this->LinstQuestions[$pieces[1]] = array('type' => 'text');
                    break;
                case 'textarea':
                    $this->_doubleDataEntryDiffIgnoreColumns[] = $pieces[1];
                    if ($addElements) {
                        if ($Group['Name'] != null) {
                            $Group['Elements'][] = $this->createTextArea(
                                $pieces[1],
                                $pieces[2]
                            );
                        } else {
                            $this->addTextAreaElement($pieces[1], $pieces[2]);
                        }
                    }
                    $this->LinstQuestions[$pieces[1]] = array('type' => 'textarea');
                    break;
                case 'date':
                    if (strpos($pieces[1], "_date") !== false) {
                        $pieces[1] = substr(
                            $pieces[1],
                            0,
                            strpos($pieces[1], "_date")
                        );
                    }
                    if ($addElements) {
                        if ($pieces[3] == 1900 && $pieces[4] == 2100) {
                            $dateOptions = null;
                        } else {
                            $dateOptions = array(
                                            'language'         => 'en',
                                            'format'           => 'YMd',
                                            'minYear'          => $pieces[3],
                                            'maxYear'          => $pieces[4],
                                            'addEmptyOption'   => true,
                                            'emptyOptionValue' => null,
                                           );
                        }

                        $pieces[5] = trim($pieces[5]);
                        if ($pieces[5] === 'MonthYear') {
                            $this->addMonthYear(
                                $pieces[1],
                                $pieces[2],
                                $dateOptions
                            );
                        } else {
                            $this->addDateElement(
                                $pieces[1],
                                $pieces[2],
                                $dateOptions
                            );
                        }
                    }
                    $this->LinstQuestions[$pieces[1]] = array('type' => 'date');
                    break;
                case 'numeric':
                    if ($addElements) {
                        $options = array();
                        if (!empty($pieces[3])) {
                            $options['min'] = $pieces[3];
                        }
                        if (!empty($pieces[4])) {
                            $options['max'] = $pieces[4];
                        }
                        $this->addNumericElement($pieces[1], $pieces[2], $options);
                    }
                    $this->LinstQuestions[$pieces[1]]
                        = array(
                           'type'    => 'numeric',
                           'options' => $options,
                          );
                    break;

                case 'selectmultiple':
                    $type = 'multiple';
                    $this->_selectMultipleElements[] = $pieces[1];
                    // fall through and also execute select code below
                case 'select':
                    $options = preg_split("/{-}/", trim($pieces[3]));
                    $opt     = array();

                    foreach ($options as $o) {
                        $arr = explode("=>", $o);
                        $key = $arr[0];
                        $val = $arr[1];
                        if ($key[0] == "'" && $key[strlen($key)-1] == "'") {
                            $key = substr($key, 1, -1);
                        } else if ($key == 'NULL') {
                            $key ='';
                        }
                        if ($val[0] == "'" && $val[strlen($val)-1] == "'") {
                            $val = substr($val, 1, -1);
                        }
                        $opt[$key] = $val;
                    }

                    if ($addElements) {
                        if ($Group['Name'] != null) {
                            if ($type == 'multiple') {
                                $Group['Elements'][]
                                    = $this->form->createElement(
                                        'select',
                                        $pieces[1],
                                        $pieces[2],
                                        $opt,
                                        "multiple"
                                    );
                            } else {
                                $Group['Elements'][]
                                    = $this->form->createElement(
                                        'select',
                                        $pieces[1],
                                        $pieces[2],
                                        $opt
                                    );
                            }
                        } else {
                            if ($type == 'multiple') {
                                $this->form->addElement(
                                    'select',
                                    $pieces[1],
                                    $pieces[2],
                                    $opt,
                                    "multiple"
                                );
                            } else {
                                $this->form->addElement(
                                    'select',
                                    $pieces[1],
                                    $pieces[2],
                                    $opt
                                );
                            }

                        }
                    }
                    if ($firstSelectOfPage) {
                        $this->_requiredElements[] = $pieces[1];
                        $firstSelectOfPage         = false;
                    }
                    $this->LinstQuestions[$pieces[1]] = array('type' => 'select');
                    break;
                case 'header':
                    if ($addElements) {
                        $this->form->addElement('header', null, "$pieces[2]");
                    }
                    break;
                case 'static':
                    $this->_doubleDataEntryDiffIgnoreColumns[] = $pieces[1];
                    if ($addElements) {
                        if ($Group['Name'] != null) {
                            print "Creating $pieces[1] with label: $pieces[2]";
                            $Group['Elements'][]
                                = $this->form->createElement(
                                    'static',
                                    $pieces[1],
                                    null,
                                    $pieces[2]
                                );
                        } else {
                            $this->form->addElement(
                                'static',
                                $pieces[1],
                                $pieces[2]
                            );
                        }
                    }
                    $this->LinstQuestions[$pieces[1]] = array('type' => 'score');
                    break;
                default:
                    break;
                }
            }
            fclose($fp);
        }
    }

    /**
     * Load the rules for the instrument from $filename, which must be a file
     * in the Loris Instrument Rule file format inspired by XINRules.
     *
     * Rules are of the format:
     *   question{-}Error message if violated{-}XIN Rules to evaluate
     *
     * For example:
     *
     * family_other{-}Required if family_member is other{-}family_member{@}=={@}other
     *
     * @param string $filename Either the path to a file, or a base64 encoded
     *                         string which can be interpreted as a file by
     *                         PHP and fopen()
     * @param bool   $base64   If true, the "filename" is really a base64 encoded
     *                         data URL, so we shouldn't check that the file exists
     *                         on the filesystem. (Used by preview)
     *
     * @return null Registers all instrument rules as a side-effect.
     */
    function loadInstrumentRules($filename, $base64 = false)
    {
        if (file_exists($filename) || $base64 === true) {
            $fp = fopen($filename, "r");
            while (($line = fgets($fp, 4096)) !== false) {
                // Rules Uses {-} as delimiter, unlike linst files, because {@}
                // is part of the rules themselves
                $pieces   = explode("{-}", trim($line));
                $question = $pieces[0];
                $message  = $pieces[1];
                $rules    = array_slice($pieces, 2);

                if (isset($this->LinstQuestions[$question])) {
                    $q =& $this->LinstQuestions[$question];

                    if ($q['UserRules'] !== true) {
                        // Unregister the rules that were added by the wrapper
                        // for the group, because otherwise that'll override the
                        // user specified rules from the .rules file
                        unset($this->XINRules[$question]);
                    }
                    // Set a flag so that we know a user specified rule has been
                    // registered and we don't need to reset the rules, which means
                    // that now newly registered rules are ANDed together, instead
                    // of replaced.
                    $q['UserRules'] = true;

                    switch($q['type']) {
                    case 'select':
                        // Selects are the only type of rules that aren't part
                        // of a group, the rest include a _status element
                        $this->XINRegisterRule($question, $rules, $message);
                        break;
                    default:
                        $this->XINRegisterRule(
                            $question,
                            $rules,
                            $message,
                            $question . "_group"
                        );
                        break;
                    }
                }
            }
            fclose($fp);
        }
    }


}

?>
