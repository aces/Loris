**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]** > **[[HOW TO CODE AN INSTRUMENT|How to Code an Instrument]]**  > **[[SCORING|Instrument Scoring]]**

---

1. [Scoring Algorithm Script](#1-scoring-algorithm-script)
2. [Scoring Function](#2-scoring-function)
3. [Reliability Scoring](#3-reliability-scoring)

---

## 1) Scoring Algorithm Script
If an instrument form should include a scoring algorithm, a scoring script can be coded manually to accompany the form. This scoring script will be executed by Loris automatically when a user saves data entered in the instrument form via their browser. The script should be stored as an executable file in the project/instruments/ directory, and the filename must be called `Instrument_name.score`.

It can be coded in any scripting language, but we suggest using our PHP example below. CommentID is passed as the first argument, after which it selects from Instrument_table, performs calculations and updates using the CommentID. To test your scoring script, run it from the tools directory and provide CommentID. Below is a sample scoring script for BMI calculation - this file can be copied from the docs/instruments/ directory:

```php
<?php
/* Test_name Scoring
* Description of the scoring algorithm
* @category Instrument
* @package  Test_name
* @author   Author
* @license  Loris License */
require_once "../tools/generic_includes.php";
require_once "Database.class.inc";
$CommentID = $argv[1];
$db =& Database::singleton();
$query = "SELECT * from 'test_name' WHERE CommentID = :CommentID";
$WhereCriteria = array('CommentID'=>$CommentID);
$result        = $db->pselectRow($query, $WhereCriteria);
$scores = array();

//check unit of measurement
if ($result['unit_of_measurement'] == 'standard') {
    $query_std = "SELECT bmi_value FROM bmi_standard WHERE height_feet =:hgt_feet AND height_inches=:hgt_inches AND weight=:wgt_pounds";
    $Where     =  array('hgt_feet'=>$result['height_feet'], 'hgt_inches'=>$result['height_inches'],
'wgt_pounds'=>$result['weight_pound']);

$scores['bmi_value'] = $db->pselectOne($query_std, $Where);   

} else if ($result['unit_of_measurement'] == metric) {$query_metric = "SELECT bmi_value FROM bmi_metric WHERE height_cms=:hgt_cms'' AND weight_kgs=:wgt_kgs";
$Where = array('hgt_cms'=>$result['height_cms'], 'hgt_kgs'=>$result['weight_kgs']);
 $scores['bmi_value'] = $db->pselectOne($query_metric, $Where);}

if ($bmi_value <= 18.5) { $scores['bmi_category'] = 'Underweight';} 
else if ($bmi_value > 18.5 && $bmi_value <= 24.9 ) {$scores['bmi_category'] = 'Normal weight';} 
else if ($bmi_value >= 25 && $bmi_value <= 29.9) {$scores['bmi_category’] = 'Overweight';} 
else if ($bmi_value >= 30) {$scores['bmi_category'] = 'Obesity';}

//save scores
$result = $db->update('test_name', $scores, $WhereCriteria);
```

## 2) Scoring Function
If your instrument was coded manually in PHP, then your scoring algorithm can be implemented within your instrument’s PHP file as a function. The function must be named score. Below is an example of what a scoring function typically looks like:

```php
/**
* Example scoring function
*
* @return void
*/
function score() {
    if ($this->_determineDataEntryCompletionStatus() == "Incomplete") {
        return;
    }
        
    $db =& Database::singleton();
    //Get raw questions point values
    $query = "SELECT * FROM " . $this->table .
        " WHERE CommentID='" . $this->getCommentID() . "'";
    $record = $db->pselectRow($query, null);
        
    $score = array(
        'score_1' => null,
    );
        
    $score['score_1'] = true;
    if ($record['abc_1'] <> 'yes') {
        $score['score_1'] = false;
    } 

    // save the scores
    $db->update(
        $this->table,
        $score,
        array('CommentID'=>$this->getCommentID())
    );
}
```

## 3) Reliability Scoring
> Under construction.

The Reliability module is used to calculate behavioural reliability with respect to gold standard cases and across testing sites by asking another examiner to perform the same evaluation on the same content.

To include instruments in the Reliability module, you must enable `ReliabilityInstruments` in the `config.xml` in your project directory.
```xml
<!-- Instruments for reliability module -->
<ReliabilityInstruments>
    <Instrument>
        <Testname>bmi</Testname>
        <Threshold>0.5</Threshold>
        <Displayname>BMI</Displayname>
    </Instrument>
</ReliabilityInstruments>
```

To enable reliability scoring, you must create a reliability instrument called `NDB_Reliability_$TESTNAME$_reliability.class.inc` in your project/reliability/ directory.
This class should have the same questions as the original instrument. The difference is in the setup and scoring functions. The reliability instrument needs to compare the values of the original instrument form with the reliability instrument form. If the percentage of equivalent answers is above the threshold value set in the config.xml (see above), the instrument form is marked as "Reliable". 

```php
<?php

/**
 * This file contains the NDB_Reliability_bmi
 * class
 *
 * PHP Version 5
 *
 * @category Reliability_Instrument
 * @package  BMI
 * @author   Stella Lee <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */

require_once "NDB_Reliability.class.inc";

/**
 * Creates the form elements for the Boston_Diagnostic_Aphasia_Exam instrument
 *
 * @category Reliability_Instrument
 * @package  BMI
 * @author   Stella Lee <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */
class NDB_Reliability_bmi_reliability extends NDB_Reliability
{

    function _getAgeInMonths()
    {
        throw new LorisException("Could not calculate age because don't know if subject or proband");
    }
    function _getDefaults()
    {
        $DB     =& Database::singleton();
        $result = $DB->pselect("SELECT * FROM " . $DB->escape($this->name), array());

        //print_r($this->identifier);
        if (!empty($this->identifier)) {
            // set the bmi_reliability values
            $row = $DB->pselectRow(
                "SELECT * FROM " . $DB->escape($this->name) . " WHERE CommentID=:cid AND reliability_center_id=:rcid",
                array(
                 'cid'  => $this->identifier,
                 'rcid' => $this->reliability_center_id,
                )
            );

            // Set the defaults
            $sites = array(
                      1 => 'DCC',
                      2 => 'MTL',
                      3 => 'OTT',
                      4 => 'ROM',
                     );

            $initial_table = preg_replace('/_reliability/', '', $this->name);

            foreach ($row as $key=>$value) {
                $defaults[$key] = $value;
            }
            $defaults['CommentID'] = "<a href=\"main.php?test_name=reliability_breakdown&instrument=$initial_table&CommentID=$row[CommentID]\">" . $row['CommentID'] . "</a>";

        } else {
            echo("Identifer empty! No ID has been chosen. Please contact the DCC.<br>");
        }

        return $defaults;
    }


    function score()
    {
        //holds raw question values
        $score_record = array();
        //holds calculated
        $db =& Database::singleton();

        // null scores
        //$this->_nullScores();
        $initial_table = preg_replace('/_reliability/', '', $this->name);

        //Get values from both tables (reliability and original)
        $query  = "SELECT * FROM " . $db->escape($this->name) . " WHERE CommentID=:cid  AND reliability_center_id=:rcid";
        $query1 = "SELECT * FROM " . $db->escape($initial_table) . " WHERE CommentID=:cid";

        $reliability_record = $db->pselectRow($query, array('cid' => $this->identifier, 'rcid' => $this->reliability_center_id));
        $instrument_record  = $db->pselectRow($query1, array('cid' => $this->identifier));

        $mismatches            = 0;
        $denominator           = 0;
        $algorithm_mismatches  = 0;
        $algorithm_denominator = 0;
        $algorithm_questions   = array(
                                  'height_feet',
                                  'height_inches',
                                  'weight_lbs',
                                 );

        foreach ($instrument_record as $key=>$value) {
            if (!in_array($key, $algorithm_questions)) {
                continue;
            }

            $rel_key            = $key;
            $algorithm_question = in_array($key, $algorithm_questions);
            $rel_value          = $reliability_record[$rel_key];
            if (!empty($value) && !empty($rel_value)) {

                $denominator++;
                if ($algorithm_question) {
                    $algorithm_denominator++;
                }

                if ($this->_checkEquivalency($value, $rel_value)) {
                    continue;
                }
                $mismatches++;
                if ($algorithm_question) {
                    $algorithm_mismatches++;
                }
            }
        }
        // Score the reliability
        $reliability['Reliability_score_all_items'] = (($denominator-$mismatches)/$denominator*100);

        // Do the update here for the reliability scores - saving the scores
        $result = $db->update("{$this->name}", $reliability, array("CommentID" => $this->identifier, 'reliability_center_id' => $this->reliability_center_id));
        $result = $db->update("reliability", array("Reliability_score" => round(min($reliability['Reliability_score_all_items'], $reliability['Reliability_score_scored_items']), 3)), array("CommentID" => $this->identifier, "Instrument" => preg_replace("/_reliability$/", "", $this->name), 'reliability_center_id' => $this->reliability_center_id));
        // Update the main reliability table with the overall reliability score
        $result1 = $db->update("reliability", array('reliability_score' => $reliability['Reliability_score_all_items']), array("CommentID" => $this->identifier));
    } // end function score

    function _checkEquivalency($val, $rel_val)
    {
        if ($val === $rel_val) {
            return true;
        }
        return false;
    }
    function _nullScores()
    {
        $db =& Database::singleton();

        // set the scores to NULL
        foreach ($this->scores as $val) {
            $scores[$val] =null;
        }

        // update the scores
        $success = $db->update("{$this->name}", $scores, array("CommentID" => $this->identifier, 'reliability_center_id' => $this->reliability_center_id));
        return;
    }

    function bmi_reliability()
    {
        $this->create_form();
    }


    function create_form()
    {
        $this->_addMetadataFields();
        $this->form->addElement("static", "reliability_center", "Site of Reliability Test:");

        //Scoring header
        $this->form->addElement('header', 'instrument_title', "Scoring:");
        // $this->form->addElement("static", "Reliability_score_scored_items", "Reliability Score All items(%):");
        $this->form->addElement("static", "Reliability_score_all_items", "Reliability Scored items(%):");
        $this->form->addElement("static", "CommentID", "CommentID:");

        //display test name
        $this->form->addElement('header', null, 'BMI');
        $this->addNumericElement('height_feet', "Height (feet)");
        $this->addNumericElement('height_inches', "Height (inches)");
        $this->addNumericElement('weight_lbs', "Weight (lbs)");
    } // End function

    function _cleanTo3Digits($string)
    {
        return ereg_replace("[^0-9]", "", substr($string, 0, 3));
    }

    function _process($values)
    {
        $DB =& Database::singleton();

        $user =& User::singleton();

        $row = $DB->pselectRow(
            "SELECT * FROM " . $DB->escape($this->name) . " WHERE CommentID=:cid AND reliability_center_id=:rcid",
            array(
             'cid'  => $this->identifier,
             'rcid' => $this->reliability_center_id,
            )
        );

        $invalid = $values['invalid'];
        $DB->update("reliability", array('invalid' => $invalid), array("CommentID" => $this->identifier, "Instrument" => preg_replace("/_reliability$/", "", $this->name), "reliability_center_id" => $this->reliability_center_id));
        unset($values['invalid']);

        if ($invalid == "yes") {
            $this->form->freeze();
            $this->tpl_data['success'] = true;
            return;
        }
        foreach ($values as $key=>$value) {
            if ($key == 'Date_taken' || $key == 'DoB_proband') {
                $values[$key] = $this->_getDatabaseDate($values[$key]);
            }
        }
        if (empty($row)) {

            $values['CommentID'] = $this->identifier;
            $values['reliability_center_id'] = $this->reliability_center_id;
            // insert the event
            $success = $DB->insert($this->name, $values);
        } else {
            // update the event
            $success = $DB->update(
                $this->name,
                $values,
                array(
                 'CommentID'             => $this->identifier,
                 'reliability_center_id' => $this->reliability_center_id,
                )
            );
        }

        $scoreResult = $this->score();

        $this->form->freeze();
        $this->tpl_data['success'] = true;
    }

    function _validate($values)
    {
        $DB           =& Database::singleton();
        $query        = "SELECT count(*) AS counter FROM candidate WHERE CandID=:cid and PSCID=:pid";
        $recordsFound = $DB->pselectOne($query, array('cid' => $values['CandID'], 'pid' => $values['PSCID']));
        $errors       = array();

        if ($recordsFound < 1) {
            $errors['CandID'] = "Specified DCCID and PSCID do not exist or do not match.";
        }

        return $errors;
    }

    function display()
    {
        if (!$this->form->isFrozen()) {
            // hidden values
            $this->form->addElement(
                'hidden',
                'test_name',
                $this->name
            );
            $this->form->addElement(
                'hidden',
                'subtest',
                $this->page
            );
            $this->form->addElement(
                'hidden',
                'identifier',
                $this->identifier
            );
            $this->form->addElement(
                'hidden',
                'reliability_center_id',
                $this->reliability_center_id
            );
            $this->form->addElement(
                'submit',
                'fire_away',
                'Save Data',
                'class=button'
            );
        }

        // get the defaults
        $localDefaults = $this->_getDefaults();
        if (!is_array($localDefaults)) {
            $localDefaults = array();
        }
        // set the quickform object defaults
        $this->form->setDefaults(array_merge($this->defaults, $localDefaults));

        // trim all values
        $this->form->applyFilter('__ALL__', 'trim');

        // display the HTML_Quickform object
        $smarty = new Smarty_neurodb;

        // display the HTML_Quickform object
        return $this->form->toHTML();

        $renderer =& new HTML_QuickForm_Renderer_Default();
        $renderer->setFormTemplate(
            "<form{attributes}><table class=\"instrument\">{content}</table></form>"
        );
        $renderer->setElementTemplate(
            "<tr><td class=\"lab\">
            <!-- BEGIN required --><span style=\"color: #ff0000\">*</span>
            <!-- END required -->{label}</td><td class=\"ele\">
            <!-- BEGIN error --><span style=\"color: #ff0000\">{error}</span><br />
            <!-- END error -->{element}</td></tr>
        "
        );
        $renderer->setElementTemplate(
            "<tr><td class=\"lab\"><i>{label}</i></td>
            <td class=\"ele\">\t<i>{element}</i></td></tr>",
            "static"
        );
        $renderer->setHeaderTemplate(
            "<tr><th colspan=\"2\"><br><b>{header}</b></th></tr>"
        );
        $this->form->accept($renderer);
        return $renderer->toHtml();

    } // end function display


    /**
     * Wrapper to create a field that only accepts a number, with an
     * accompanying status field.
     *
     * @param string  $field   The database field in which the response
     *                         will be stored
     * @param string  $label   The question text to display
     * @param unknown $options Does not appear to be used?
     *
     * @return none
     */
    function addNumericElement($field, $label, $options = null)
    {
        $group[] = $this->createText($field, $label);
        $this->WrapperNumericElements[$field] = $group[0];
        $group[] = $this->createSelect(
            $field . "_status",
            null,
            array(
             null           => "",
             'not_answered' => "Not Answered",
            ),
            array('class' => 'form-control input-sm not-answered')
        );
        $this->addGroup($group, $field . "_group", $label, null, false);
        unset($group);
        $this->addGroupRule(
            $field . "_group",
            array(array(array("Value must be numeric.", 'numeric')))
        );
        $this->XINRegisterRule(
            $field,
            array($field . '_status{@}=={@}'),
            'This field is required',
            $field . '_group'
        );
    }

}
?>
```
