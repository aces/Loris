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
            return array('VL' => "Visit ". $values['VL']." does not exist for given candidate");
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

        $InstrumentExists = $db->pselectOne(
            "SELECT 'x' FROM participant_accounts WHERE Test_name=:TN AND SessionID=:SID",
            array(
                'TN' => $values['Test_name'],
                'SID' => $SessionID
            )
        );
        if($InstrumentExists == 'x') {
            return;
        }
        $battery = new NDB_BVL_Battery();
        $battery->selectBattery($SessionID);

        $commentID = $battery->addInstrument($values['Test_name']);

        $key = User::newPassword();

        $email = false;
        if(isset($_REQUEST['send_email'])) {
            $email = true;
        }
        if($email) {
            $status = 'Sent';
        } else {
            $status = 'Created';
        }

        $success = $db->insert(
            "participant_accounts", 
            array(
                'SessionID'        => $SessionID,
                'Test_name'        => $values['Test_name'],
                'Email'            => $values['Email'],
                'Status'           => $status,
                'OneTimePassword'  => $key,
                'CommentID'        => $commentID
            )
        );
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }
        $this->tpl_data['success'] = $success;
        
        if($email) {
            $config = NDB_Config::singleton();
            $www = $config->getSetting("www");

            $msg_data = array(
                'study'     => $config->getSetting("title"),
                'url'       => $www['url'] . '/submit.php?key=' . $key,
                'EmailForm' => $values['EmailContent']
            );
            Email::send($values['Email'], 'new_survey.tpl', $msg_data);
         }
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
        $this->addSelect("Test_name", "Test name", Utility::getDirectInstruments());
        $this->addBasicText("Email", "Email address");

        $this->form->addFormRule(array(&$this, '_validate_add_survey'));
    }
}
?>
