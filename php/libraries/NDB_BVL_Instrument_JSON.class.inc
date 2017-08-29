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
use \Exception;
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
    function setup($commentID, $page)
    {
        $this->commentID     = $commentID;
        $this->page          = $page;
        parent::setup($commentID, $page);
    }

    /**
     * Returns candidate-related context variables to be accessed during runtime
     * Allows access to: date of birth, age in months (calculated)
     * 
     * @return array containing context variables
     */
    function _getContext() {
        $timepoint = \TimePoint::singleton($this->getSessionID());
        $candID = $timepoint->getCandID();
        $candidate = \Candidate::singleton($candID);
        $dob = $candidate->getCandidateDoB();
        $dobDT = new \DateTime($dob);
        $curDate = new \DateTime("now");
        $interval = date_diff($curDate, $dobDT, true);
        $ageM = $this->calculateAgeMonths(array('year' => $interval->format("%y"),
                                         'mon'  => $interval->format("%m"),
                                         'day'  => $interval->format("%d")));
        //$ageTEST = $this->getCandidateAge($curDate); //TODO replace the hacky age function with this
        $gender = $candidate->getCandidateGender();
        return array(
            "age_mths" => $ageM,
            "dob" => $dob,
            "gender" => $gender
        );
    }

    function _getLang() {
        //$timepoint = \TimePoint::singleton($this->getSessionID());
        //$candID = $timepoint->getCandID();
        //$candidate = \Candidate::singleton($candID);
        //$lang = $candidate->getCandidateLanguage();
        $lang = "en-ca";
        return $lang ? $lang : "en-ca";
    }


    function _getInstrumentData($db) {
        $result = $db->pselect(
            "SELECT * FROM $this->table WHERE CommentID=:CID",
            array('CID' => $this->getCommentID())
        );
        return $result ? $result[0] : array();
    }

    /**
     * @param string  $filename The filename to be loaded, or a base64 encoded
     *                          string of a .json file to be interpreted.
     * @param boolean $base64   (NOT IMPLEMENTED) If true, read the filename as a base64 encoded
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
            $this->instrument = json_decode($json, true);
            $this->instrument["Elements"] = self::inlineCalcFormulas($this->instrument["Elements"]);
            $this->table = $this->instrument['Meta']['ShortName'];
            $this->testName = $this->table;
            return $json;
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
    function toJSON()
    {

    }

    function display() {
        $db     =& \Database::singleton();
        $smarty = new \Smarty_NeuroDB();
        $smarty->assign('instrumentJSON', htmlspecialchars($this->instrumentJSON));
        $smarty->assign('initialData', htmlspecialchars(json_encode($this->_getInstrumentData($db))));
        $smarty->assign('context', htmlspecialchars(json_encode($this->_getContext())));
        $smarty->assign('lang', htmlspecialchars($this->_getLang()));
        $html = $smarty->fetch("instrument_react.tpl");
        return $html;
    }

    function save() {
        $db     =& \Database::singleton();
        $values = $_POST;

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

    static private function checkForCircularRefs($formulaMap) {
      foreach ($formulaMap as $key => $formula) {
        $encounteredVars = [];
        array_push($encounteredVars, $key);
        $res = self::referenceTree($formula, $formulaMap, $encounteredVars);
        if($res !== false)
          throw new Exception ("Circular reference at $res");
      }
    }

    static private function referenceTree($formula, $formulaMap, $encounteredVars) {
      preg_match_all("/\[\w+\]*/", $formula, $matches);
      
      $variables = array_unique(array_map(function($match) {
        return substr($match, 1, -1);
      }, $matches[0]));
         
      foreach ($variables as $variable) {
        if (array_key_exists($variable, $formulaMap)) {
          if (in_array($variable, $encounteredVars))
            return "$variable";
 
          array_push($encounteredVars, $variable);
          
          return self::referenceTree($formulaMap[$variable], $formulaMap, $encounteredVars);
        }
      }
      
      return false;
    }

    static function inlineCalcFormulas($elements) {
      $calcElements = array_filter($elements, function ($element) {
          return $element["Type"] === 'calc';
      });

      $formulaMap = array_reduce($calcElements, function ($result, $element) {
          $result[$element["Name"]] = $element["Formula"];
          return $result;
      }, array());
      
      self::checkForCircularRefs($formulaMap);

      return array_map(function ($element) use ($formulaMap) {
          if ($element["Type"] !== 'calc') { return $element; }
          $recusivelyInlinedFormula = $element["Formula"];
          $resultIsSame = false;
          while (!$resultIsSame) {
              $result = self::inlineSubFormulas($recusivelyInlinedFormula, $formulaMap);
              $resultIsSame = $result === $recusivelyInlinedFormula;
              $recusivelyInlinedFormula = $result;
          }
          $element["Formula"] = $recusivelyInlinedFormula;
          return $element;
      }, $elements);
    }

    static private function inlineSubFormulas($formula, $formulaMap) {
        preg_match_all("/\[\w+\]*/", $formula, $matches);

        $variables = array_map(function($match) {
            return substr($match, 1, -1);
        }, $matches[0]);

        $inlinedFormula = array_reduce($variables, function($result, $variable) use ($formulaMap) {
            if (array_key_exists($variable, $formulaMap)) {
                return preg_replace("/\[{$variable}\]/", "({$formulaMap[$variable]})", $result);
            } else {
                return $result;
            }
        }, $formula);

        return $inlinedFormula;
    }
}

?>
