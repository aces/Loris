<?php
require_once "NDB_Form.class.inc";
require_once "Email.class.inc";

/**
 * The forms for the user accounts menu
 * @package main
 */
class NDB_Form_participant_accounts extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        $editor =& User::singleton();
        if (Utility::isErrorX($editor)) {
            return PEAR::raiseError("User Error: ".$editor->getMessage());
        }

        if ($this->page == 'edit_user') {
            if(!empty($this->identifier)) {
                $user =& User::factory($this->identifier);
                if(Utility::isErrorX($user)) {
                    return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
                }
            }

            return ($editor->hasPermission('user_accounts') && ($editor->hasPermission('user_accounts_multisite') || (empty($this->identifier) || $editor->getData('CenterID') == $user->getData('CenterID'))));
        }

        return true;
    }

    function _getDefaults()
    {
        $defaults = array();
        return $defaults;
    }

    function _validate_add_survey($values) {
        $db = Database::singleton();

        $numCandidates = $db->pselectOne("SELECT count(*) FROM candidate WHERE PSCID=:v_PSCID AND CandID=:v_CandID AND Active='Y'", array('v_PSCID' => $values['PSCID'], 'v_CandID' => $values['CandID']));
        if($numCandidates != 1) {
            return array('CandID' =>'PSCID and DCC ID do not match or candidate does not exist.');
        }

        $numSessions = $db->pselectOne("SELECT COUNT(*) FROM session WHERE CandID=:v_CandID AND UPPER(Visit_label)=UPPER(:v_VL) AND Active='Y'", array('v_CandID' => $values['CandID'], 'v_VL' => $values['VL']));

        if($numSessions != 1) {
            return array('VL' => "Visit does not exist for chosen candidate $numSessions");
        }

        if(!filter_var($values['Email'], FILTER_VALIDATE_EMAIL)) {
            return array('Email' => 'Email is not valid.');

        }


        return array();
    }

    function _process($values)
    {
        $db = Database::singleton();
        $SessionID = $db->pselectOne(
            "SELECT ID FROM session WHERE CandID=:v_CandID AND Visit_label=:v_VL",
            array(
                'v_CandID' => $values['CandID'], 
                'v_VL'     => $values['VL']
            )
        );

        $timepoint =& TimePoint::singleton($SessionID);

        $battery = new NDB_BVL_Battery();
        $battery->selectBattery($SessionID);

        $commentID = $battery->addInstrument($values['Test_name']);

        $db->insert(
            "participant_accounts", 
            array(
                'SessionID'        => $SessionID,
                'Test_name'        => $values['Test_name'],
                'Email'            => $values['Email'],
                'Complete'         => 'No',
                'OneTimePassword'  => User::newPassword(),
                'CommentID'        => $commentID
/*$this->_createCommentID(
                    $values['CandID'],
                    $values['PSCID'],
                    $SessionID,
                    $timepoint->getSubprojectID(),
                    $testID
                )
                 */
                    
            )
        );

    }

    function _createCommentID($CandID, $PSCID, $SessionID, $SubprojectID, $testID) {
        return $CandID . $PSCID . $SessionID . $SubprojectID . $testID . time();
    }
    function add_survey()
    {
        $this->redirect = "test_name=$this->name";
        $this->addBasicText("CandID", "DCC ID");
        $this->addBasicText("PSCID", "PSCID");
        $this->addSelect("VL", "Visit Label", Utility::getVisitList());
        $this->addSelect("Test_name", "Test name", Utility::getAllInstruments());
        $this->addBasicText("Email", "Email address");

        $this->form->addFormRule(array(&$this, '_validate_add_survey'));
    }
}
?>
