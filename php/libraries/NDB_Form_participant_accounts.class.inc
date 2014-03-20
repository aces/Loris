<?php
/**
 * This file implements the add_survey page which is used by the Loris
 * survey module, for creating user account/keys that are tied to a
 * CommentID and only valid for one use.
 *
 * PHP Version 5
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once "NDB_Form.class.inc";
require_once "Email.class.inc";

/**
 * The form which creates the add_survey page for the
 * Loris survey module
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Form_participant_accounts extends NDB_Form
{
    /**
     * Determine whether the logged in user has access to this page.
     * Tied to data_entry
     * 
     * @return boolean true if user has access to this page
     */
    function _hasAccess()
    {
        // create user object
        $editor =& User::singleton();
        if (Utility::isErrorX($editor)) {
            return PEAR::raiseError("User Error: ".$editor->getMessage());
        }

        return $editor->hasPermission('user_accounts');
    }

    /**
     * Return default values for QuickForm elements on this page
     *
     * @return associative array of FieldName => Default Value mapping
     */
    function _getDefaults()
    {
        $defaults = array();
        return $defaults;
    }

    /**
     * Validate that user data entered on the add survey page was correct
     *
     * @param array $values Array of values submitted on the page
     *
     * @return array Empty if no error, associative array of element with
     *               error if there was a problem with data entered.
     */
    function _validate_add_survey($values)
    {
        $db = Database::singleton();

        $numCandidates = $db->pselectOne(
            "SELECT COUNT(*) FROM candidate 
            WHERE PSCID=:v_PSCID 
            AND CandID=:v_CandID AND Active='Y'",
            array('v_PSCID' => $values['PSCID'], 'v_CandID' => $values['CandID'])
        );
        if ($numCandidates != 1) {
            return array(
                'CandID' =>
                    'PSCID and DCC ID do not match or candidate does not exist.'
            );
        }

        $numSessions = $db->pselectOne(
            "SELECT COUNT(*) FROM session 
            WHERE CandID=:v_CandID 
            AND UPPER(Visit_label)=UPPER(:v_VL) 
            AND Active='Y'", 
            array('v_CandID' => $values['CandID'], 'v_VL' => $values['VL'])
        );

        if ($numSessions != 1) {
            return array(
                'VL' => "Visit ". $values['VL']." does not exist for given candidate"
            );
        }

        if (!filter_var($values['Email'], FILTER_VALIDATE_EMAIL)) {
            return array('Email' => 'Email is not valid.');

        }


        return array();
    }

    /**
     * Process the form submission. Data has already been validated
     * when this is called, so we only need to handle insertion into
     * the database
     *
     * @param array $values The values submitted on the page
     *
     * @return none, but as a side-effect inserts into database
     */
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
            "SELECT 'x' FROM participant_accounts
            WHERE Test_name=:TN AND SessionID=:SID",
            array(
                'TN' => $values['Test_name'],
                'SID' => $SessionID
            )
        );
        if ($InstrumentExists == 'x') {
            return;
        }
        $battery = new NDB_BVL_Battery();
        $battery->selectBattery($SessionID);

        $commentID = $battery->addInstrument($values['Test_name']);

        $key = User::newPassword();

        $email = false;
        if (isset($_REQUEST['send_email'])) {
            $email = true;
        }
        if ($email) {
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
        
        if ($email) {
            $config = NDB_Config::singleton();
            $www = $config->getSetting("www");

            $msg_data = array(
                'study'     => $config->getSetting("title"),
                'url'       => $www['url'] . '/survey.php?key=' . $key,
                'EmailForm' => $values['EmailContent']
            );
            Email::send($values['Email'], 'new_survey.tpl', $msg_data);
        }
    }

    /**
     * Implements the quickform portion of the page which is used for
     * adding user surveys
     *
     * @return none
     */
    function add_survey()
    {
        $this->redirect = "test_name=$this->name";
        $this->addBasicText("CandID", "DCCID");
        $this->addBasicText("PSCID", "PSCID");
        $this->addSelect("VL", "Visit Label", Utility::getVisitList());
        $this->addSelect("Test_name", "Instrument", array_merge(array('' => ''), Utility::getDirectInstruments()));
        $this->addBasicText("Email", "Email address");

        $this->form->addFormRule(array(&$this, '_validate_add_survey'));
    }
}
?>
