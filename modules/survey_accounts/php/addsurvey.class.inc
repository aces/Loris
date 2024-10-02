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
        return $user->hasPermission('survey_accounts_view');
    }

    /**
     * Return default values for QuickForm elements on this page
     *
     * @return array (associative) of FieldName => Default Value mapping
     */
    function _getDefaults()
    {
        $defaults = [];
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
        $db = $this->loris->getDatabaseConnection();

        // Check that all required fields are present.
        if (!empty($values['Email']) ) {
            if (!filter_var($values['Email'], FILTER_VALIDATE_EMAIL) ) {
                return ['Email' => 'The email address is not valid.'];
            }
        }
        if (!empty($values['Email']) && !empty($values['Email2'])) {
            if ($values['Email'] != $values['Email2']) {
                return ['Email2' => 'The email addresses do not match.'];
            }
        }

        if (!empty($values['Email']) && empty($values['Email2'])) {
            return ['Email2' => 'Please confirm the email address.'];
        }

        if (empty($values['Test_name'])) {
            return ['Test_name' => 'Please choose an instrument.'];
        }

        $numCandidates = $db->pselectOne(
            "SELECT COUNT(*) FROM candidate
            WHERE PSCID=:v_PSCID
            AND CandID=:v_CandID AND Active='Y'",
            [
                'v_PSCID'  => $values['PSCID'],
                'v_CandID' => $values['CandID'],
            ]
        );
        $error         = "PSCID and CandID do not match "
                ."or candidate does not exist.";
        if ($numCandidates != 1) {
            return
              ['CandID' => $error];
        }

        if (! in_array($values['VL'], \Utility::getVisitList(), true)) {
            return ['VL' => "You must specify a valid Visit Label."];
        }

        $numSessions = $db->pselectOne(
            "SELECT COUNT(*) FROM session
            WHERE CandID=:v_CandID
            AND UPPER(Visit_label)=UPPER(:v_VL)
            AND Active='Y'",
            [
                'v_CandID' => $values['CandID'],
                'v_VL'     => $values['VL'],
            ]
        );

        if ($numSessions != 1) {
            return [
                'VL' => "Visit ".
                            $values['VL'].
                            " does not exist for given candidate",
            ];
        }

        $projectID = $db->pselectOneInt(
            "SELECT ProjectID FROM session
            WHERE CandID=:v_CandID
            AND Visit_Label=:v_VL",
            [
                'v_CandID' => $values['CandID'],
                'v_VL'     => $values['VL']
            ]
        );

        $user = \NDB_Factory::singleton()->user();
        if (!$user->hasProject(\ProjectID::singleton($projectID))) {
            return [
                'Project' => "You are not affiliated with this session's project"
            ];
        }

        $instrument_list = $db->pselect(
            "SELECT f.Test_name FROM flag f
             JOIN session s on s.ID = f.SessionID
             WHERE s.CandID=:v_CandID
             AND UPPER(s.Visit_label)=UPPER(:v_VL)
             AND s.Active='Y'",
            [
                'v_CandID' => $values['CandID'],
                'v_VL'     => $values['VL'],
            ]
        );
        $reminder        = " already exists for given candidate for visit ";
        foreach ($instrument_list as $instrument) {
            if ($values['Test_name'] == $instrument['Test_name']) {
                $instrument_instance = \NDB_BVL_Instrument::factory(
                    $this->loris,
                    $instrument['Test_name']
                );
                return [
                    'Test_name' => "Instrument ".
                        $instrument_instance->getFullName().
                        $reminder. $values['VL'],
                ];
            }
        }
        if (!isset($_REQUEST['fire_away'])
            || ($_REQUEST['fire_away'] !== 'Create survey')
        ) {
            if (!filter_var(
                $values['Email'],
                FILTER_VALIDATE_EMAIL
            )
            ) {
                return ['Email' => 'Email is not valid.'];

            }
        }

        return [];
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
        $db    = $this->loris->getDatabaseConnection();
        $email = $values['Email'];
        unset($values['Email']);
        $SessionID = $db->pselectOne(
            "SELECT ID FROM session".
            " WHERE CandID=:v_CandID AND Visit_label=:v_VL",
            [
                'v_CandID' => $values['CandID'],
                'v_VL'     => $values['VL'],
            ]
        );

        $InstrumentExists = $db->pselectOne(
            "SELECT 'x' FROM participant_accounts
            WHERE Test_name=:TN AND SessionID=:SID",
            [
                'TN'  => $values['Test_name'],
                'SID' => $SessionID,
            ]
        );
        if ($InstrumentExists == 'x') {
            return;
        }
        $battery = new \NDB_BVL_Battery($this->loris);
        $battery->selectBattery(
            new \SessionID($SessionID)
        );

        $commentID = $battery->addInstrument($this->loris, $values['Test_name']);

        $key = $this->_generateSurveyKey();

        $sendEmail = false;
        if (isset($_REQUEST['send_email'])) {
            $sendEmail = true;
        }
        if ($sendEmail) {
            $status = 'Sent';
        } else {
            $status = 'Created';
        }

        try {
            $db->insert(
                "participant_accounts",
                [
                    'SessionID'       => $SessionID,
                    'Test_name'       => $values['Test_name'],
                    'Status'          => $status,
                    'OneTimePassword' => $key,
                    'CommentID'       => $commentID,
                ]
            );
            $this->tpl_data['success'] = true;
        } catch (\DatabaseException $e) {
            error_log($e->getMessage());
            $this->tpl_data['success'] = false;
        }

        if ($email && ($values['send_email'] == 'true')) {
            $config   = \NDB_Config::singleton();
            $baseURL  = \NDB_Factory::singleton()->settings()->getBaseURL();
            $msg_data = [
                'study'     => $config->getSetting("title"),
                'url'       => $baseURL . '/survey.php?key=' .
                        urlencode($key),
                'EmailForm' => $values['email_dialog'],
            ];
            \Email::send($email, 'new_survey.tpl', $msg_data);
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
                ['' => ''],
                \NDB_BVL_Instrument::getDirectEntryInstrumentNamesList($this->loris)
            )
        );
        $this->addBasicText("Email", "Email address");
        $this->addBasicText("Email2", "Confirm Email address");

        $this->form->addFormRule([&$this, '_validateAddSurvey']);
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
            [
                $baseURL . "/survey_accounts/js/survey_accounts_helper.js",
            ]
        );
    }
}

