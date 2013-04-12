<?php
require_once "NDB_Form.class.inc";

/**
 * The form for the participant status module.
 *
 * @category Behavioural 
 * @package  Main
 * @author   Zia Mohadesz <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
 */
class NDB_Form_participant_status extends NDB_Form
{
    var $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";

    /**
     * Determine if the user should have access to this page.
     * Currently tied to data_entry permission.
     *
     * @return boolean True if the user should have access
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // check that the $candID is passed b/c the profile needs to be opened
        if ($this->identifier != $_REQUEST['candID']) {
            return PEAR::raiseError(
                "NDB_Form_participant_status::_access: " 
                . "Candidate Profile Error ($this->identifier)"
            );
        }
        // check user permissions
        return ($user->hasPermission('data_entry'));
    }

    /**
     * Gets default options for smarty to fill in.
     * This comes from the participant status table
     *
     * @return array Currently saved entries in database
     */
    function _getDefaults()
    {

        $DB =& Database::singleton();
        $defaults = $DB->pselectRow(
            "SELECT * FROM participant_status WHERE CandID = :cid", 
            array('cid'=>$this->identifier)
        );
        return $defaults;
    }

    /**
     * Process the submitted values, called after validation.
     *
     * @param array $values The values submitted by the user 
     *                      to the form.
     *
     * @return boolean True on success
     */
    function _process($values)
    {
        if (!is_array($values) || count($values) === 0) {
            return true;
        }
        $DB =& Database::singleton();

        $values['CandID'] = $this->identifier;

        if (!(is_null($_SESSION['State']))) {
            $currentUser =& User::singleton($_SESSION['State']->getUsername());
            $id = $currentUser->getData("UserID");
            $values['entry_staff'] = $id;
        }


        // save the values
        //if it exists update it
        $ParticipantCount = $DB->pselectOne(
            "SELECT COUNT(*) FROM participant_status WHERE CandID = :cid", 
            array("cid"=>$values['CandID'])
        );
        if ($ParticipantCount > 0) {
            $success = $DB->update(
                "participant_status", 
                $values,
                array("CandID"=>$values['CandID'])
            );
        } else {
            //insert it
            $success = $DB->insert("participant_status", $values);
        }

        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Form_participant_status::_process: ".$success->getMessage()
            );
        }

        $this->tpl_data['success'] = true;
        $this->form->freeze();
    }

    /**
     * Constructor called by loris to setup the tpl_data
     * array
     *
     * @return null
     */
    function participant_status()
    {

        $this->tpl_data['candID'] = $this->identifier;

        $config =& NDB_Config::singleton();
        $DB =& Database::singleton();

        //entry staff info
        $this->addScoreColumn('entry_staff', 'Data Entry Staff');
        $this->addScoreColumn('data_entry_date', 'Date of last Data entry');

        $pscid = $DB->pselectone(
            'SELECT PSCID FROM candidate where CandID = :candid',
            array('candid'=>$this->identifier)
        );
        $this->addScoreColumn('pscid', 'PSCID');
        $this->tpl_data['pscid'] = $pscid;

        // Selections array (standard template for questions selections)
        $notAns4 = array(
            "dnk"            => "Don't know", 
            "not_applicable" => "Not applicable",
            "refusal"        => "Refusal",
            "not_answered"   => "Not Answered"
        );


        $options = $this->getParticipantStatusOptions();

        $this->addSelect(
            'participant_status', 
            "Participant Status", 
            array('') + $options + $notAns4
        );

        $this->addTextAreaGroup('reason_specify', $this->indent . 'Please specify reason for status', array(null => null) + $notAns4);


        //drop out
        $options = array(
            null                     => '', 
            "1_voluntary_withdrawal" => "1. Voluntary withdrawal", 
            "2_lost_follow_up"       => "2. Lost to follow up", 
            "3_other"               => "3. Other"
        );
        $this->addSelect(
            'withdrawl_reasons',
            "If withdrawl, provide the reason",
            $options
        );
        $this->addTextAreaGroup('withdrawl_reasons_other_specify', 
            $this->indent . 'Please specify other reason for drop out ',
            array(null => null) + $notAns4);
        $this->form->addFormRule(array(&$this,'_validate'));
    }


    /** 
     * This function is for validation of user input, depending on
     * the questions answered.
     *
     * @param array $fields The list of input to the form submitted by
     *                      smarty.
     *
     * @return array An array of elements with errors. An empty array if
     *               all elements are valid.
     */
    function _validate($fields)
    {
        $errors=array();
        $options = $this->getParticipantStatusOptionsVerbose();

        $reasonID = $fields['participant_status'];

        if($options[$reasonID]['Required'] == true) {
            if (($options[$reasonID]['Description'])=='withdrawl') {
                if (empty($fields['withdrawl_reasons'])) {
                    $errors['withdrawl_reasons'] = "required";
                } else if($fields['withdrawl_reasons'] == '3_other') {
                    if(empty($fields['withdrawl_reasons_other_specify']) 
                        && empty($fields['withdrawl_reasons_other_specify_status'])) {
                            $errors['withdrawl_reasons_other_specify_group'] = "required";
                        }
                }
            }
            else {
                if(empty($fields['reason_specify']) && empty($fields['reason_specify_status'])) {
                    $errors['reason_specify_group'] = "Must specify when status is " . $options[$reasonID]['Description'];
                }
            }
        }
        return $errors;
    }
    /**
     * Gets the participant_status options from participant_status_options
     * getParticipantStatusOptions()
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    function getParticipantStatusOptions()
    {
        $DB =& Database::singleton();
        $options = $DB->pselect(
            "SELECT ID,Description FROM participant_status_options",
            array()
        );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

    function getParticipantStatusOptionsVerbose()
    {
        $DB =& Database::singleton();
        $options = $DB->pselect(
            "SELECT * FROM participant_status_options",
            array()
        );

        $option_array = array();
        foreach ($options as $option) {
            $ID = $option['ID'];
            unset($option['ID']);
            $option_array[$ID] = $option;
        }
        return $option_array;
    }
}
?>
