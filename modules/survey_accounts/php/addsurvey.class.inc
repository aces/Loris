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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\survey_accounts;
/**
 * The form which creates the add_survey page for the
 * Loris survey module
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AddSurvey extends \NDB_Form
{
    /**
     * Determine whether the logged in user has access to this page.
     * Tied to data_entry
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has access to this page
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('user_accounts');
    }

    /**
     * Return default values for QuickForm elements on this page
     *
     * @return array (associative) of FieldName => Default Value mapping
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
    function _validateAddSurvey($values)
    {
        $db = \Database::singleton();

        $numCandidates = $db->pselectOne(
            "SELECT COUNT(*) FROM candidate 
            WHERE PSCID=:v_PSCID 
            AND CandID=:v_CandID AND Active='Y'",
            array(
                'v_PSCID'  => $values['PSCID'],
                'v_CandID' => $values['CandID'],
            )
        );
        $error         = "PSCID and DCC ID do not match "
                ."or candidate does not exist.";
        if ($numCandidates != 1) {
            return
              array('CandID' => $error);
        }

        $numSessions = $db->pselectOne(
            "SELECT COUNT(*) FROM session 
            WHERE CandID=:v_CandID 
            AND UPPER(Visit_label)=UPPER(:v_VL) 
            AND Active='Y'",
            array(
                'v_CandID' => $values['CandID'],
                'v_VL'     => $values['VL'],
            )
        );

        if ($numSessions != 1) {
            return array(
                'VL' => "Visit ".
                            $values['VL'].
                            " does not exist for given candidate",
            );
        }

        $instrument_list = $db->pselect(
            "SELECT f.Test_name FROM flag f
             JOIN session s on s.ID = f.SessionID
             WHERE s.CandID=:v_CandID  
             AND UPPER(s.Visit_label)=UPPER(:v_VL) 
             AND s.Active='Y'",
            array(
                'v_CandID' => $values['CandID'],
                'v_VL'     => $values['VL'],
            )
        );
        $reminder        = " already exists for given candidate for visit ";
        foreach ($instrument_list as $instrument) {
            if ($values['Test_name'] == $instrument['Test_name']) {
                return array(
                    'Test_name' => "Instrument ". $values['Test_name'].
                                       $reminder. $values['VL'],
                );
            }
        }

        if (!empty($values['Email']) ) {
            if (!filter_var($values['Email'], FILTER_VALIDATE_EMAIL) ) {
                return array('Email' => 'The email address is not valid.');
            }
        }
        if (!empty($values['Email']) && !empty($values['Email2'])) {
            if ($values['Email'] != $values['Email2']) {
                return array('Email2' => 'The email addresses do not match.');
            }
        }

        if (!empty($values['Email']) && empty($values['Email2'])) {
            return array('Email2' => 'Please confirm the email address.');
        }

        if (empty($values['Test_name'])) {
            return array('Test_name' => 'Please choose an instrument.');
        }
        if ($_REQUEST['fire_away'] !== 'Create survey') {
            if (!filter_var(
                $values['Email'],
                FILTER_VALIDATE_EMAIL
            )
            ) {
                return array('Email' => 'Email is not valid.');

            }
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
     * @return void (but as a side-effect inserts into database)
     */
    function _process($values)
    {
        $db        = \Database::singleton();
        $SessionID = $db->pselectOne(
            "SELECT ID FROM session".
            " WHERE CandID=:v_CandID AND Visit_label=:v_VL",
            array(
                'v_CandID' => $values['CandID'],
                'v_VL'     => $values['VL'],
            )
        );

        $timepoint =& \TimePoint::singleton($SessionID);

        $InstrumentExists = $db->pselectOne(
            "SELECT 'x' FROM participant_accounts
            WHERE Test_name=:TN AND SessionID=:SID",
            array(
                'TN'  => $values['Test_name'],
                'SID' => $SessionID,
            )
        );
        if ($InstrumentExists == 'x') {
            return;
        }
        $battery = new \NDB_BVL_Battery();
        $battery->selectBattery($SessionID);

        $commentID = $battery->addInstrument($values['Test_name']);

        $key = $this->_generateSurveyKey();

        $email = false;
        if (isset($_REQUEST['send_email'])) {
            $email = true;
        }
        if ($email) {
            $status = 'Sent';
        } else {
            $status = 'Created';
        }

        try {
            $db->insert(
                "participant_accounts",
                array(
                    'SessionID'       => $SessionID,
                    'Test_name'       => $values['Test_name'],
                    'Email'           => $values['Email'],
                    'Status'          => $status,
                    'OneTimePassword' => $key,
                    'CommentID'       => $commentID,
                )
            );
        } catch(\DatabaseException $e) {
            error_log($e->getMessage());
            $this->tpl_data['success'] = false;
        }
        $this->tpl_data['success'] = true;

        if ($email) {
            $config = \NDB_Config::singleton();
            $www    = $config->getSetting("www");

            $msg_data = array(
                'study'     => $config->getSetting("title"),
                'url'       => $www['url'] . '/survey.php?key=' .
                                         urlencode($key),
                'EmailForm' => $values['email_dialog'],
            );
            \Email::send($values['Email'], 'new_survey.tpl', $msg_data);
        }
    }

    /**
     * Generates a URL safe key
     *
     * @return string
     */
    function _generateSurveyKey()
    {
        $bytes = openssl_random_pseudo_bytes(8);
        return bin2hex($bytes);
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $this->redirect = "test_name=$this->name";
        $this->addBasicText("CandID", "DCCID");
        $this->addBasicText("PSCID", "PSCID");
        $this->addSelect("VL", "Visit Label", \Utility::getVisitList());
        $this->addSelect(
            "Test_name",
            "Instrument",
            array_merge(
                array('' => ''),
                \Utility::getDirectInstruments()
            )
        );
        $this->addBasicText("Email", "Email address");
        $this->addBasicText("Email2", "Confirm Email address");

        $this->form->addFormRule(array(&$this, '_validateAddSurvey'));
    }

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/survey_accounts/js/survey_accounts_helper.js",
            )
        );
    }
}

