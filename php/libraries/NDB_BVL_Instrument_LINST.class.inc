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
use \LORIS\instruments\DictionaryItem;
use \LORIS\Data\Scope;
use \LORIS\Data\Cardinality;

use \LORIS\Data\Types\StringType;
use \LORIS\Data\Types\IntegerType;
use \LORIS\Data\Types\Enumeration;
use \LORIS\Data\Types\DateType;

/**
 * Base class for all NeuroDB behavioural instruments
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Instrument_LINST extends \NDB_BVL_Instrument
{
    public $InstrumentType = 'LINST';

    public $LinstQuestions = [];

    public $LinstLines = [];

    protected $subtests = [];
    protected $fullName;
    protected $dictionary = [];

    // array of the format "field_name" => "group_name"
    protected $GroupElements = [];

    /**
     * Do not require rules by default.
     */
    private $skipRules = false;

    /**
     * Sets up the variables required for a LINST instrument to load
     *
     * @param string|null $commentID The CommentID being loaded
     * @param string|null $page      The page being loaded
     *
     * @return void
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->commentID = $commentID;
        $this->page      = $page;

        $this->form = new \LorisForm();
    }

    /**
     * This runs the XIN rules on all the elements on the current page to ensure
     * that no rules were violated.
     *
     * @param array $elements The value of all the elements on the current page
     *                        to validate.
     *
     * @return array|true associative array of errors (fieldname => errormessage)
     *         or true if no errors.
     */
    function XINValidate(array $elements)
    {
        unset($elements['key'], $elements['pageNum'], $elements['nextpage']);
        $this->XINDebug = false;  //Turn this on to see rules debuggin output

        $errors = [];
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
            if (isset($this->LinstQuestions[$elname])
                && $this->LinstQuestions[$elname]['type'] === 'numeric'
            ) {
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
                '@phan-var array $registered_rules';
                if ($this->XINDebug) {
                    //debugging code
                    echo "<p><b>$elname</b><br> ";
                }
                $rules_array = [];
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
                    && !in_array($elname, ["page", "subtest"])
                ) {
                    // Check if element part of a group.
                    // If so, the error should be on the group to show up
                    $errorEl          = $this->GroupElements[$elname] ?? $elname;
                    $errors[$errorEl] = "$elname is required.";

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
     * @param string $elname     The element to be validate
     * @param array  $elements   array of values from current page.
     * @param array  $registered Array of all rules which have been registered.
     *                           registered.
     *
     * @return boolean true if the element passes, false if it fails a rule.
     */
    function DINRunElementRules(
        string $elname,
        array $elements,
        array $registered
    ): bool {
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
            switch ($operator) {
            case '==':
                if ($comparevalue != $userval) {
                    return false;
                }
                break;
            case '!=':
                if ($comparevalue == $userval) {
                    return false;
                }
                break;
            default:
                throw new \LorisException(
                    "Unsupported operator ($operator) for XIN Rule."
                     . " If this used to work, please file a bug report."
                );
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
     * @return void
     */
    function XINRegisterRule(
        string $elname,
        array $rules,
        string $message="",
        string $group=""
    ): void {
        // I'm not sure if these are logically the same. I think they should be, but
        // there was a bug introduced by the LINST changes to XINRules to old
        // instruments so I'm making sure that the old code is followed exactly
        // with this if block.
        // After everything's working, review this to see if we can get rid of one of
        // the if statement and use the same logic for "old" instruments and "new"
        // instruments
        //  -- Dave
        $rule = [
            'message' => $message,
            'group'   => $group,
            'rules'   => [],
        ];

        foreach ($rules AS $rule_cmd) {
            $rule['rules'][] = $rule_cmd;
        }
        $this->XINRules[$elname][] = $rule;
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
     * @return void (but as a side effect displays the Instrument page)
     */
    function loadInstrumentFile(string $filename, bool $base64 = false): void
    {
        $scope = new Scope(Scope::SESSION);

        if (file_exists($filename) || $base64 === true) {
            $this->InstrumentType = 'LINST';

            if (!isset($this->form)) {
                $this->form = new \LorisForm();
            }
            $this->formType = 'XIN';

            if (!$this->skipRules) {
                $this->form->addFormRule([&$this, 'XINValidate']);
            }
            $fp = fopen($filename, "r");

            // Add elements is only true if we're parsing the current page,
            // otherwise we don't.. but even on other pages, we need to
            // parse the whole file for table{@} and other meta elements
            if (!empty($this->page)) {
                $currentPage = $this->page;
                $addElements = false;
            } else {
                $currentPage = 'top';
                $addElements = true;
            }
            $subtestCount = 1;

            $firstFieldOfPage = true;

            $Group = [
                'Name'      => null,
                'Elements'  => [],
                'Delimiter' => $this->_GUIDelimiter,
            ];

            while (($line = fgets($fp, 4096)) !== false) {
                $pieces = preg_split("/{@}/", $line);
                $this->LinstLines[] = $pieces;

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
                    if ($firstFieldOfPage) {
                        $this->_requiredElements[] = $fieldname;
                        $firstFieldOfPage          = false;
                    }
                    continue;
                }
                switch ($type) {
                case 'page':
                    $pageDescription  = trim($pieces[2]);
                    $pageName         = "page_$subtestCount";
                    $this->subtests[] = [
                        'Name'        => $pageName,
                        'Description' => $pageDescription
                    ];

                    if ($currentPage == $pageName) {
                        $addElements = true;
                    } else {
                        $addElements = false;
                    }
                    $firstFieldOfPage = true;
                    $subtestCount++;
                    break;
                case 'table':
                    // The 'test' and 'table' variables of the .meta file
                    // take precedence over this variable in the .linst file.
                    // The lines below offer backwards compatibility until
                    // the feature is completely deprecated.
                    $this->testName = $this->testName ?? trim($pieces[1]);
                    $this->table    = $this->table ?? trim($pieces[1]);
                    break;
                case 'title':
                    $this->fullName = trim($pieces[1]);
                    if ($addElements) {
                        $this->form->addElement(
                            'header',
                            'instrument_title',
                            $pieces[1]
                        );
                        if ($this->DataEntryType!=="DirectEntry") {
                            $this->_addMetadataFields();
                        }
                    }
                    $this->dictionary = array_merge(
                        $this->dictionary,
                        [
                            new DictionaryItem(
                                $this->testName.'_Date_taken',
                                'Date of Administration',
                                $scope,
                                new \LORIS\Data\Types\DateType(),
                                new Cardinality(Cardinality::SINGLE),
                                'Date_taken',
                            ),
                        ]
                    );
                    if (strrpos($this->testName ?? '', '_proband') === false) {
                        if (!$this->postMortem) {
                            $this->dictionary = array_merge(
                                $this->dictionary,
                                [
                                    new DictionaryItem(
                                        $this->testName.'_Candidate_Age',
                                        'Candidate Age (Months)',
                                        $scope,
                                        new \LORIS\Data\Types\Duration(),
                                        new Cardinality(Cardinality::SINGLE),
                                        'Candidate_Age',
                                    ),
                                ]
                            );
                        } else {
                            $this->dictionary = array_merge(
                                $this->dictionary,
                                [
                                    new DictionaryItem(
                                        $this->testName.'_Candidate_Age',
                                        'Candidate Age at Death (Months)',
                                        $scope,
                                        new \LORIS\Data\Types\Duration(),
                                        new Cardinality(Cardinality::SINGLE),
                                        'Candidate_Age',
                                    ),
                                ]
                            );
                        }
                        $this->dictionary = array_merge(
                            $this->dictionary,
                            [
                                new DictionaryItem(
                                    $this->testName.'_Window_Difference',
                                    'Window difference from test battery (days)',
                                    $scope,
                                    new \LORIS\Data\Types\Duration(),
                                    new Cardinality(Cardinality::SINGLE),
                                    'Window_Difference',
                                ),
                            ]
                        );
                    }
                    $this->dictionary = array_merge(
                        $this->dictionary,
                        [
                            new DictionaryItem(
                                $this->testName.'_Examiner',
                                'Examiner',
                                $scope,
                                // This should be an enum of examiners, but
                                // getExaminerNames currently returns an empty
                                // array if CommentID is not set.
                                new StringType(255),
                                new Cardinality(Cardinality::SINGLE),
                                'Examiner',
                            ),
                        ]
                    );
                    break;
                case 'begingroup':
                    if ($addElements) {
                        $Group['Name']      = trim($pieces[1]) . '_group';
                        $Group['Delimiter'] = isset($pieces[2])
                            ? trim($pieces[2]) : $this->_GUIDelimiter;
                    }
                    break;
                case 'endgroup':
                    if ($addElements) {
                        $groupLabel = isset($pieces[2]) ? trim($pieces[2]) : null;
                        $this->addGroup(
                            $Group['Elements'],
                            $Group['Name'] ?? '',
                            $groupLabel,
                            $Group['Delimiter'],
                        );

                        // Track elements and their groups for XIN errors proper
                        // higlighting in the browser
                        foreach ($Group['Elements'] as $el) {
                            if (isset($el['name'])) {
                                $this->GroupElements[$el['name']] = $Group['Name'];
                            }
                        }

                        $Group['Name']     = null;
                        $Group['Elements'] = [];
                    }
                    break;
                case 'begintable':
                case 'endtable':
                    error_log(
                        "DEPRECATION MESSAGE: `begintable` and `endtable` elements ".
                        "are deprecated. $this->testName instrument should be ".
                        "modified to remove these elements as they will be ".
                        "completely removed in a future version of LORIS."
                    );
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
                    $this->dictionary[] = new DictionaryItem(
                        $this->testName."_".$pieces[1],
                        $pieces[2],
                        $scope,
                        new StringType(255),
                        new Cardinality(Cardinality::SINGLE),
                        $pieces[1],
                    );
                    if ($firstFieldOfPage) {
                        $this->_requiredElements[] = $fieldname;
                        $firstFieldOfPage          = false;
                    }
                    $this->LinstQuestions[$pieces[1]] = ['type' => 'text'];
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
                    $this->dictionary[] = new DictionaryItem(
                        $this->testName."_".$pieces[1],
                        $pieces[2],
                        $scope,
                        new StringType(),
                        new Cardinality(Cardinality::SINGLE),
                        $pieces[1],
                    );
                    if ($firstFieldOfPage) {
                        $this->_requiredElements[] = $fieldname;
                        $firstFieldOfPage          = false;
                    }
                    $this->LinstQuestions[$pieces[1]] = ['type' => 'textarea'];
                    break;
                case 'date':
                    if ($addElements) {
                        if ($pieces[3] == 1900 && $pieces[4] == 2100) {
                            $dateOptions = [];
                        } else {
                            $dateOptions = [
                                'language'         => 'en',
                                'format'           => 'YMd',
                                'minYear'          => $pieces[3],
                                'maxYear'          => $pieces[4],
                                'addEmptyOption'   => true,
                                'emptyOptionValue' => null,
                            ];
                        }

                        // Set date format
                        $dateFormat = isset($pieces[5]) ? trim($pieces[5]) : "";

                        // The question should be added to the LinstQuestions in this
                        // order, before the _date is stripped below for standard
                        // dates to allow XINValidation to recognize the field name
                        $this->LinstQuestions[$pieces[1]] = [
                            'type'       => 'date',
                            'dateFormat' => $dateFormat,
                        ];

                        if ($dateFormat === 'MonthYear') {
                            // Shows date without day of month
                            $this->addMonthYear(
                                $pieces[1],
                                $pieces[2],
                                $dateOptions
                            );
                        } elseif ($dateFormat === 'BasicDate') {
                            // Shows date without not answered dropdown
                            $this->addBasicDate(
                                $pieces[1],
                                $pieces[2],
                                $dateOptions
                            );
                        } elseif ($dateFormat === 'Date' || $dateFormat === "") {
                            // The dateformat for a standard date should be
                            // explicitly set to `Date` but for backwards
                            // compatibility we support a null/empty dateformat and
                            // default to standard date

                            // Check that the field name ENDS with `_date` as it
                            // should for standard dates. Then strip the `_date` so
                            // it is not duplicated by the addDateElement function
                            if (substr($pieces[1], -5) === "_date") {
                                $pieces[1] = substr(
                                    $pieces[1],
                                    0,
                                    -5
                                );
                            } else {
                                throw new \LorisException(
                                    "Standard Date format field `$pieces[1]` ".
                                    "in LINST file `$filename` must end with ".
                                    "'_date'."
                                );
                            }
                            // Shows standard date
                            $this->addDateElement(
                                $pieces[1],
                                $pieces[2],
                                $dateOptions
                            );
                        } else {
                            throw new \LorisException(
                                "Unsupported dateformat `$dateFormat` in LINST ".
                                "file `$filename` for date element `$pieces[1]`."
                            );
                        }
                    }
                    $this->dictionary[] = new DictionaryItem(
                        $this->testName."_".$pieces[1],
                        $pieces[2],
                        $scope,
                        new DateType(),
                        new Cardinality(Cardinality::SINGLE),
                        $pieces[1],
                    );
                    if ($firstFieldOfPage) {
                        $this->_requiredElements[] = $fieldname;
                        $firstFieldOfPage          = false;
                    }
                    break;
                case 'numeric':
                    if ($addElements) {
                        $this->addNumericElement($pieces[1], $pieces[2]);
                    }
                    $this->dictionary[] = new DictionaryItem(
                        $this->testName."_".$pieces[1],
                        $pieces[2],
                        $scope,
                        new IntegerType(),
                        new Cardinality(Cardinality::SINGLE),
                        $pieces[1],
                    );
                    if ($firstFieldOfPage) {
                        $this->_requiredElements[] = $fieldname;
                        $firstFieldOfPage          = false;
                    }
                    $options = [
                        'min' =>$pieces[3] ?? null,
                        'max' =>$pieces[4] ?? null
                    ];
                    $this->LinstQuestions[$pieces[1]]
                        = [
                            'type'    => 'numeric',
                            'options' => $options,
                        ];
                    break;

                case 'selectmultiple':
                    $type = 'multiple';
                    $this->selectMultipleElements[] = $pieces[1];
                    // fall through and also execute select code below
                case 'select':
                    $options  = preg_split("/{-}/", trim($pieces[3]));
                    $opt      = [];
                    $dictopts = [];

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

                        if ($key !== '') {
                            $dictopts[] = $key;
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
                                        [ "multiple" => "multiple" ]
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
                                    ["multiple" => "multiple"]
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
                    if ($firstFieldOfPage) {
                        $this->_requiredElements[] = $fieldname;
                        $firstFieldOfPage          = false;
                    }

                    if ($type == 'multiple') {
                        $cardinality = new Cardinality(Cardinality::MANY);
                    } else {
                        $cardinality = new Cardinality(Cardinality::SINGLE);
                    }

                    $t  = new Enumeration(...$dictopts);
                    $it = new DictionaryItem(
                        $this->testName."_".$pieces[1],
                        $pieces[2],
                        $scope,
                        $t,
                        $cardinality,
                        $pieces[1],
                    );
                    $this->dictionary[] = $it;
                    $this->LinstQuestions[$pieces[1]] = ['type' => 'select'];
                    break;
                case 'header':
                    if ($addElements) {
                        $this->form->addElement('header', '', "$pieces[2]");
                    }
                    break;
                case 'static':
                    $this->_doubleDataEntryDiffIgnoreColumns[] = $pieces[1];
                    if ($addElements) {
                        if ($Group['Name'] != null) {
                            $Group['Elements'][]
                                = $this->form->createElement(
                                    'static',
                                    $pieces[1],
                                    '',
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
                    if (!empty($pieces[1])) {
                        $this->LinstQuestions[$pieces[1]]
                            = ['type' => 'score'];

                        $this->dictionary[] = new DictionaryItem(
                            $this->testName."_".$pieces[1],
                            $pieces[2],
                            $scope,
                            new StringType(255),
                            new Cardinality(Cardinality::SINGLE),
                            $pieces[1],
                        );
                    }
                    break;
                default:
                    break;
                }
            }
            fclose($fp);
        }
    }

    /**
     * Parses the metadata of a LINST instrument and sets the proper variables
     * in the instrument class accordingly
     *
     * This is intended to be overridden by a subclass of NDB_BVL_Instrument
     * to add support for other file formats.
     *
     * @param string $filename The filename to be loaded, or a base64 encoded
     *                         string.
     *
     * @return void
     */
    function loadInstrumentMetadata(string $filename): void
    {
        $fp = fopen($filename, "r");
        while (($line = fgets($fp, 4096)) !== false) {
            $pieces = preg_split("/{@}/", $line);
            $this->LinstLines[] = $pieces;

            $type = $pieces[0];

            switch ($type) {
            case 'testname':
                $this->testName = trim($pieces[1]);
                break;
            case 'table':
                $this->table = trim($pieces[1]);
                break;
            case 'jsondata':
                $this->jsonData = trim($pieces[1]) === 'true';
                break;
            case 'postmortem':
                $this->postMortem = trim($pieces[1]) === 'true';
                break;
            case 'norules':
                $this->skipRules = trim($pieces[1]) === 'true';
                break;
            default:
                break;
            }
        }
        fclose($fp);
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
     * @return void but registers all instrument rules as a side-effect.
     */
    function loadInstrumentRules(string $filename, bool $base64 = false): void
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

                    if (($q['UserRules'] ?? false) !== true) {
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

                    switch ($q['type']) {
                    // Selects (including multiselects), Basic Dates and MonthYears
                    // are the only type of rules that aren't part of a group
                    // the rest include a _status element
                    case 'select':
                        $this->XINRegisterRule($question, $rules, $message);
                        break;
                    case 'date':
                        if ($q['dateFormat'] === 'BasicDate'
                            || $q['dateFormat'] === 'MonthYear'
                        ) {
                            $this->XINRegisterRule($question, $rules, $message);
                            break;
                        }
                    default:
                        $rules_array = array_merge(
                            $rules,
                            [$question.'_status{@}=={@}']
                        );
                        $this->XINRegisterRule(
                            $question,
                            $rules_array,
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

    /**
     * Returns a JSON representation of the currently instantiated
     * instrument.
     *
     * The format of the JSON representation is specified in the
     * docs/API/InstrumentFormat documentation.
     *
     * @return string containing valid JSON
     */
    function toJSON(): string
    {
        $jsonObject = [
            'Meta'     => [
                "InstrumentVersion"       => "1l",
                "InstrumentFormatVersion" => "v0.0.1a-dev",
                "ShortName"               => "",
                "LongName"                => "",
                "IncludeMetaDataFields"   => "true",
            ],
            'Elements' => [],
        ];
        $elements   = [];
        $pageTitle  = 'Top';

        foreach ($this->LinstLines as $value) {
            if (strpos($value[1], "_status") !== false) {
                $lastIndex = count($elements) - 1;
                $elements[$lastIndex]['Options']['RequireResponse'] = true;
            } else {
                $element         = [];
                $element['Type'] = $value[0];
                $element['Name'] = $value[1];
                $specialCase     = false;
                if ($value[0] !== 'table' && $value[0] !== 'title') {
                    $element['Description'] = rtrim($value[2]);
                }
                switch ($value[0]) {
                case 'selectmultiple':
                    $specialCase     = true;
                    $element['Type'] = 'select';
                case 'select':
                    $selectOptions = preg_split("/{-}/", trim($value[3]));
                    $opt           = [];
                    $RequireResponse = false;
                    foreach ($selectOptions as $o) {
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
                        if ($key === 'not_answered') {
                            $RequireResponse = true;
                        } else {
                            $opt[$key] = $val;
                        }
                    }
                    $AllowMultiple      = ($specialCase ? true : false);
                    $element['Options'] = [
                        'Values'          => $opt,
                        'AllowMultiple'   => $AllowMultiple,
                        'RequireResponse' => $RequireResponse,
                    ];
                    break;
                case 'textarea':
                    $specialCase     = true;
                    $element['Type'] = 'text';
                case 'text':
                    $textType           = ($specialCase ? 'large' : 'small');
                    $element['Options'] = ['Type' => $textType];
                    break;
                case 'date':
                    $minDate            = $value[3] . "-01-01";
                    $maxDate            = rtrim($value[4]) . "-12-31";
                    $element['Options'] = [
                        'MinDate' => $minDate,
                        'MaxDate' => $maxDate,
                    ];
                    break;
                case 'numeric':
                    $minval = isset($value[3]) ? (int) $value[3] : null;
                    $maxval = (int) rtrim($value[4] ?? null);
                    $element['Options'] = [
                        'NumberType' => 'integer',
                        'MinValue'   => $minval,
                        'MaxValue'   => $maxval,
                    ];
                    break;
                case 'score':
                    break;
                case 'label':
                case 'header':
                    unset($element['Name']);
                    break;
                case 'page':
                    $pageElement = [
                        "Type"        => "ElementGroup",
                        "GroupType"   => "Page",
                        "Description" => $pageTitle,
                        "Elements"    => $elements,
                    ];
                    $jsonObject['Elements'][] = $pageElement;
                    unset($element['Type']);
                    $elements  = [];
                    $pageTitle = rtrim($value[2]);
                    break;
                case 'table':
                    $jsonObject['Meta']['ShortName'] = rtrim($value[1]);
                    unset($element['Type']);
                case 'title':
                    $jsonObject['Meta']['LongName'] = rtrim($value[1]);
                default:
                    unset($element['Type']);
                    break;
                }
                if (isset($element['Type'])) {
                    $elements[] = $element;
                }
            }
        }
        if (empty($jsonObject['Elements'])) {
            $jsonObject['Elements'] = $elements;
        } else {
            $pageElement = [
                "Type"        => "ElementGroup",
                "GroupType"   => "Page",
                "Description" => $pageTitle,
                "Elements"    => $elements,
            ];
            $jsonObject['Elements'][] = $pageElement;
        }
        return json_encode($jsonObject);
    }

    /**
     * Return the full, human readable name for the
     * current instrument.
     *
     * @return ?string the full name of the instrument
     */
    public function getFullName(): ?string
    {
        return $this->fullName;
    }

    /**
     * Returns the dictionary for this instrument.
     *
     * @return \LORIS\Data\Dictionary\DictionaryItem[]
     */
    public function getDataDictionary() : iterable
    {
         return $this->dictionary;
    }

    /**
     * Returns a list of subtests of the current instrument.
     * The returned array should be a list of rows where each
     * row has a key for "Name" (the subpage name) and "Description"
     * (the human readable name)
     *
     * @return array
     */
    function getSubtestList(): array
    {
        return $this->subtests;
    }
}
