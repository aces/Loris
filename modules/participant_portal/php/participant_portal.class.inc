<?php

/**
 * IBIS module.
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Participant Portal
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\Participant_portal;
/**
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Participant_Portal
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Participant_Portal extends \NDB_Form
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */


    /**
     * CommonPageSetup sets up the common form elements which
     * are on the page, regardless of HTTP request method.
     *
     * @return void
     */
    function setup(): void
    {
        $this->tpl_data['page_title'] = 'Participant Portal';
        $this->addBasicText(
            "ParticipantID",
            "ParticipantID",
            ["placeholder" => ""]
        );

        $this->addBasicText(
            "email",
            "Email",
            ["placeholder" => ""]
        );
        $this->form->addFormRule([&$this, '_validate']);
        $localDefaults = $this->_getDefaults();
        if (!is_array($localDefaults)) {
            $localDefaults = [];
        }
        $this->form->setDefaults(array_merge($this->defaults, $localDefaults));

    }
    /**
     * Validate the value
     *
     * @param array $values the values array
     *
     * @return array (possibly empty) of errors
     */
    function _validate($values)
    {
        $errors = [];

        if (empty($values['ParticipantID'])) {
            $errors['ParticipantID'] = " ParticipantID is required!";
        } else if (empty($values['email'])  ) {
            $errors['email'] = " Email is required!";
        } else {
            $db = \Database::singleton();

            $numSurveys = $db->pselectOne(
                "SELECT COUNT(*) FROM participant_accounts p
                 JOIN session s ON (p.SessionID=s.ID)
                 JOIN candidate c ON (c.CandID=s.CandID)
                 WHERE p.Email=:surv_email AND c.ParticipantID=:pid",
                [
                    'surv_email' => $values['email'],
                    'pid'        => $values['ParticipantID'],
                ]
            );
            if ($numSurveys == 0) {
                // As suggested by Pierre to deter malicious automated attempts
                // to hack the portal.
                sleep(3);
                $errors['email'] = "Sorry, No Surveys Found With".
                                  " The Above Information.";
            }
        }

            return $errors;

    }
    /**
     * GetDefaults function
     *
     * @return array
     */
    function _getDefaults(): array
    {

        $sanitize = array_map('htmlentities', $_GET);
        $id       = $sanitize['id'] ?? null;

        $defaults['ParticipantID'] =$id;
        return $defaults;
    }
    /**
     * Process function
     *
     * @param array $values the values array
     *
     * @return void
     */
    function _process($values): void
    {
        $factory           = \NDB_Factory::singleton();
        $baseURL           = $factory->settings()->getBaseURL();
        $_SESSION['pid']   = $_REQUEST['ParticipantID'];
        $_SESSION['email'] = $_REQUEST['email'];
        header("Location: $baseURL/Participant_portal/View_Surveys");
        exit;
    }
}

