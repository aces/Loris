<?php
/**
 * This file contains the JSON Instrument class
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

use LORIS\LorisScript\Evaluator;
/**
 * JSON Instrument class
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Instrument_JSON extends \NDB_BVL_Instrument
{
    var $InstrumentType = 'JSON';


    /**
     * Sets up the variables required for a JSON instrument to load
     *
     * @param string $commentID The CommentID being loaded
     * @param string $page      The page being loaded
     *
     * @return none
     */
    function setup($commentID = null, $page = null)
    {
        $this->commentID = $commentID;
        $this->page      = $page;
        parent::setup($commentID, $page);
    }

    /**
     * Returns candidate-related context variables to be accessed during runtime
     * Allows access to: date of birth, age in months (calculated)
     *
     * @return array containing context variables
     */
    function _getContext()
    {
        $timepoint = \TimePoint::singleton($this->getSessionID());
        $candID    = $timepoint->getCandID();
        $candidate = \Candidate::singleton($candID);
        $dob       = $candidate->getCandidateDoB();
        $dobDT     = new \DateTime($dob);
        $curDate   = new \DateTime("now");
        $interval  = date_diff($curDate, $dobDT, true);
        $ageM      = $this->calculateAgeMonths(
            array(
             'year' => $interval->format("%y"),
             'mon'  => $interval->format("%m"),
             'day'  => $interval->format("%d"),
            )
        );
        //TODO replace the hacky age function with this
        //$ageTEST = $this->getCandidateAge($curDate);
        $gender = $candidate->getCandidateGender();
        return array(
                "age_mths" => $ageM,
                "dob"      => $dob,
                "gender"   => $gender,
               );
    }

    /**
     * Returns the lang to be used
     *
     * @return string
     */
    function _getLang()
    {
        return "en-CA";
    }

    /**
     * Returns the instrument data
     *
     * @param db $db DB connection
     *
     * @return array
     */
    function _getInstrumentData($db)
    {
        $result = $db->pselect(
            "SELECT * FROM $this->table WHERE CommentID=:CID",
            array('CID' => $this->getCommentID())
        );
        return $result[0];
    }

    /**
     * Loads instrument JSON file
     *
     * @param string  $filename The filename to be loaded, or a base64 encoded
     *                          string of a .json file to be interpreted.
     * @param boolean $base64   (NOT IMPLEMENTED) If true, read the filename
     *                          as a base64 encoded
     *                          string of the file content, used for preview
     *                          when no file has yet been saved to the
     *                          instruments/ directory
     *
     * @return json   returns the instrument from the .json
     */
    function loadInstrumentFile($filename, $base64 = false)
    {
        if (file_exists($filename) || $base64 === true) {
            $this->InstrumentType = 'JSON';
            $json = file_get_contents($filename);
            $this->instrumentJSON = $json;
            $this->instrument     = json_decode($json, true);
            $this->instrument["Elements"] = self::inlineScoreFormulas(
                $this->instrument["Elements"]
            );
            $this->table    = $this->instrument['Meta']['ShortName'];
            $this->testName = $this->table;
            return $json;
        }
    }

    /**
     * Set the options for this instrument
     *
     * @param array $options Options
     *
     * @return none
     */
    function setOptions($options = array())
    {
        $this->options = $options;
    }

    /**
     * Set the options for this instrument
     *
     * @param array   $element    Element
     * @param array   $values     Values
     * @param array   $context    Context
     * @param boolean $surveyMode Boolean indicating whether in Survey Mode or not
     *
     * @return array
     */
    static function isDisplayed($element, $values, $context, $surveyMode)
    {
        if (($element["Hidden"])
            || ($surveyMode && $element["HiddenSurvey"])
            || ($element.DisplayIf === false)
        ) {
            return false;
        }

        if ($element["DisplayIf" === ""]) {
            return true;
        }

        $displayIf = $element["DisplayIf"];

        $scope = array_merge($values, array("context" => $context));
        $res   = Evaluator::evaluate($displayIf, $scope);
        return $res;
    }

    /**
     * Returns only the elements that should be visible
     *
     * @param array   $elements   Elements
     * @param array   $values     Values
     * @param array   $context    Context
     * @param boolean $surveyMode Boolean indicating whether in Survey Mode or not
     *
     * @return array
     */
    static function filterElements($elements, $values, $context, $surveyMode)
    {
        return array_filter(
            $elements,
            function ($element) use ($values, $context, $surveyMode) {
                return self::isDisplayed($element, $values, $context, $surveyMode);
            }
        );
    }

    /**
     * Determines whether an element should be required
     *
     * @param array $element Element
     * @param array $values  Values
     * @param array $context Context
     *
     * @return array
     */
    static function isRequired($element, $values, $context)
    {
        $inputTypes = [
                       'select',
                       'date',
                       'radio',
                       'text',
                       'score',
                       'checkbox',
                      ];

        if (!in_array($element["Type"], $inputTypes)) {
            return false;
        }

        $requireResponse = $element["Options"]["RequireResponse"];
        if (!isset($requireResponse)) {
            return false;
        }

        if (is_bool($requireResponse)) {
            return $requireResponse;
        }

        return Evaluator::evaluate(
            $requireResponse,
            array_merge($values, array("context" => $context))
        );
    }

    /**
     * Checks if submitted values are missing any required fields
     *
     * @param array $values Values
     *
     * @return boolean
     */
    function incompleteExists($values)
    {
        $incompleteExists = false;
        $context          = $this->_getContext();
        $visibleElements  = self::filterElements(
            $this->instrument["Elements"],
            $values,
            $context,
            $this->options["surveyMode"]
        );

        foreach ($visibleElements as &$element) {
            if (isset($values[$element["Name"]])) {
                continue;
            } else {
                $isRequired = self::isRequired(
                    $element,
                    $values,
                    $this->_getContext()
                );
                if ($isRequired) {
                    $incompleteExists = true;
                }
            }
        }

        return $incompleteExists;
    }

    /**
     * Calculates the values of score elements
     *
     * @param array $values Values
     *
     * @return array
     */
    function calculateFields($values)
    {
        $calculatedValues = array();

        foreach ($this->instrument["Elements"] as &$element) {
            if ($element["Type"] == 'score') {
                $calculatedValues[$element["Name"]] = Evaluator::evaluate(
                    $element["Formula"],
                    array_merge($values, array("context" => $this->_getContext()))
                );
            }
        }

        return $calculatedValues;
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
    function toJSON()
    {
        return json_encode($this->instrument);
    }

    /**
     * Returns a HTML representation of the currently instantiated
     * instrument.
     *
     * @return string containing valid HTML
     */
    function display()
    {
        $db     =& \Database::singleton();
        $smarty = new \Smarty_NeuroDB();
        $smarty->assign('instrumentJSON', htmlspecialchars($this->toJSON()));
        $smarty->assign(
            'initialData',
            htmlspecialchars(
                json_encode(\NDB_BVL_Instrument::loadInstanceData($this))
            )
        );
        $smarty->assign(
            'context',
            htmlspecialchars(json_encode($this->_getContext()))
        );
        $smarty->assign('lang', htmlspecialchars($this->_getLang()));
        $html = $smarty->fetch("instrument_react.tpl");
        return $html;
    }

    /**
     * Saves the instrument
     *
     * @return boolean
     */
    function save()
    {
        $db =& \Database::singleton();
        $isDataSubmission = isset($_POST['instrumentData']);

        if ($isDataSubmission) {
            $frontEndValues   = json_decode($_POST['instrumentData'], true);
            $calculatedValues = $this->calculateFields($frontEndValues);
            $values           = array_merge(
                array(),
                $frontEndValues,
                $calculatedValues
            );
            if ($this->incompleteExists($values)) {
                throw new \Exception("A required field was left incomplete", 400);
            }
        } else {
            $values = array();
        }

        $recordExists = !empty(
            $db->pselect(
                "SELECT * FROM $this->table WHERE CommentID=:CID",
                array('CID' => $this->getCommentID())
            )
        );
        if (!$recordExists) {
            $db->insert(
                $this->table,
                array_merge($values, array('CommentID' => $this->getCommentID())),
                array('CommentID' => $this->getCommentID())
            );
        } else if ($recordExists && !empty($values)) {
            $db->update(
                $this->table,
                $values,
                array('CommentID' => $this->getCommentID())
            );
        }
        return true;
    }

    /**
     * Determines whether an circular reference exists in instrument
     *
     * @param array $formulaMap Formula Map
     *
     * @return none
     */
    static private function _checkForCircularRefs($formulaMap)
    {
        foreach ($formulaMap as $key => $formula) {
            $encounteredVars = [];
            array_push($encounteredVars, $key);
            $res = self::_referenceTree($formula, $formulaMap, $encounteredVars);
            if ($res !== false) {
                throw new \Exception("Circular reference at $res");
            }
        }
    }

    /**
     * TODO
     *
     * @param string $formula         Formula
     * @param array  $formulaMap      Formula Map
     * @param array  $encounteredVars Encountered Vars
     *
     * @return TODO
     */
    static private function _referenceTree($formula, $formulaMap, $encounteredVars)
    {
        preg_match_all("/\[\w+\]*/", $formula, $matches);

        $variables = array_unique(
            array_map(
                function ($match) {
                    return substr($match, 1, -1);
                },
                $matches[0]
            )
        );

        foreach ($variables as $variable) {
            if (array_key_exists($variable, $formulaMap)) {
                if (in_array($variable, $encounteredVars)) {
                    return "$variable";
                }

                array_push($encounteredVars, $variable);

                return self::_referenceTree(
                    $formulaMap[$variable],
                    $formulaMap,
                    $encounteredVars
                );
            }
        }

        return false;
    }

    /**
     * Inlines all references to score fields
     *
     * @param array $elements Elements
     *
     * @return array Inlined Elements
     */
    static function inlineScoreFormulas($elements)
    {
        $calcElements = array_filter(
            $elements,
            function ($element) {
                return $element["Type"] === 'score';
            }
        );

        $formulaMap = array_reduce(
            $calcElements,
            function ($result, $element) {
                $result[$element["Name"]] = $element["Formula"];
                return $result;
            },
            array()
        );

        self::_checkForCircularRefs($formulaMap);

        return array_map(
            function ($element) use ($formulaMap) {
                if ($element["Type"] !== 'score') {
                    return $element;
                }
                $recusivelyInlinedFormula = $element["Formula"];
                $resultIsSame = false;
                while (!$resultIsSame) {
                    $result       = self::_inlineSubFormulas(
                        $recusivelyInlinedFormula,
                        $formulaMap
                    );
                    $resultIsSame = $result === $recusivelyInlinedFormula;
                    $recusivelyInlinedFormula = $result;
                }
                $element["Formula"] = $recusivelyInlinedFormula;
                return $element;
            },
            $elements
        );
    }

    /**
     * Inlines all references to score fields
     *
     * @param array $formula    Formula
     * @param array $formulaMap Formula Map
     *
     * @return array Inlined Elements
     */
    static private function _inlineSubFormulas($formula, $formulaMap)
    {
        preg_match_all("/\[\w+\]*/", $formula, $matches);

        $variables = array_map(
            function ($match) {
                return substr($match, 1, -1);
            },
            $matches[0]
        );

        $inlinedFormula = array_reduce(
            $variables,
            function ($result, $variable) use ($formulaMap) {
                if (array_key_exists($variable, $formulaMap)) {
                    return preg_replace(
                        "/\[{$variable}\]/",
                        "({$formulaMap[$variable]})",
                        $result
                    );
                } else {
                    return $result;
                }
            },
            $formula
        );

        return $inlinedFormula;
    }
}

?>
