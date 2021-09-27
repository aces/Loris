<?php declare(strict_types=1);
namespace LORIS\consent;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Create the form for consent/add page
 * It includes three functions.
 * Post method handles updating and add a consent.
 * Delete method handles deleting an appointment.
 * PHP Version 7
 *
 * @category Loris
 * @package  Schedule_Module
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class ConsentDataHandler extends \NDB_Form
{
    public $skipTemplate = true;
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('consent_edit');
    }

    /**
     * Handle how to operate consent rows.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return none
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'POST':
            return $this->_handlePost($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
        }
    }

    /**
     * Handle a POST request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return none
     */
    function _handlePost(ServerRequestInterface $request) : ResponseInterface
    {
        // Get Data
        $values = $request->getParsedBody();
        if ($values === null || !is_array($values)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "No valid data was sent in the request"
            );
        }

        $action = $values['action'];

        switch ($action) {
        case 'Create':
            $this->createConsent($values);
            return (new \LORIS\Http\Response())->withStatus(200);
        case 'CreateEConsent':
            $this->createEConsent($values);
            return (new \LORIS\Http\Response())->withStatus(200);
        case 'Send':
            $this->sendConsent($values);
            return (new \LORIS\Http\Response())->withStatus(200);
        case 'CreateSend':
            $this->createConsent($values);
            $this->sendConsent($values);
            return (new \LORIS\Http\Response())->withStatus(200);
        case 'Expire':
            $this->expireConsent($values);
            return (new \LORIS\Http\Response())->withStatus(200);
        case 'ExpireAndInactivate':
            $this->expireConsent($values, true);
            return (new \LORIS\Http\Response())->withStatus(200);
        default:
            return new \LORIS\Http\Response\JSON\BadRequest("Invalid action");
        }
    }

    /**
     * Creates row(s) in candidate_consent_rel table
     *
     * @param array $values consent form values
     *
     * @return void
     */
    function createConsent($values)
    {
        $this->validateCandidate($values);
        $db = \Database::singleton();

        // Get consent codes
        $consentGroupID = $this->getConsentGroupID($values['consent_group']);
        $consentIDs     = $db->pselectCol(
            "SELECT ConsentID
            FROM consent 
            WHERE ConsentGroupID=:cnst",
            ['cnst' => $consentGroupID]
        );

        // Error if consent codes not found
        if (empty($consentIDs)) {
            http_response_code(400);
            echo('Consent codes not found');
            throw new \LorisException("Error Processing Request", 1);
        }

        $addingEConsent = array_key_exists('eConsent', $values) &&
            $values['eConsent'] === 'true';

        // Check if consent has already been created for all consent codes in group
        $candidateConsents = $db->pselectWithIndexKey(
            "SELECT ccr.ConsentID, ccr.Status 
            FROM candidate_consent_rel ccr 
            JOIN consent c ON c.ConsentID=ccr.ConsentID
            WHERE ccr.CandidateID=:candid
            AND c.ConsentGroupID=:cnst",
            [
                'candid' => $values['candID'],
                'cnst'   => $consentGroupID
            ],
            'ConsentID'
        );
        $consentCreated    = true;
        foreach ($consentIDs as $id) {
            if (!array_key_exists($id, $candidateConsents)) {
                $consentCreated = false;
            }
        }

        // If all consent codes have been created for the group, give error
        if ($consentCreated) {
            http_response_code(400);
            echo("Consent form has already been added for this candidate.");
            throw new \LorisException("Error Processing Request", 1);
        }

        // Add each consent code as row
        foreach ($consentIDs as $key => $id) {

            $existsInCandConsent = $db->pselectOne(
                "SELECT CandidateID
                FROM candidate_consent_rel 
                WHERE CandidateID=:candid 
                AND ConsentID=:cnst",
                [
                    'candid' => $values['candID'],
                    'cnst'   => $id
                ]
            );

            // insert into candidate_consent_rel if it's not already there
            if (empty($existsInCandConsent)) {

                $db->insert(
                    'candidate_consent_rel',
                    [
                        'CandidateID' => $values['candID'],
                        'ConsentID'   => $id
                    ]
                );
            }
        }

        // If also adding eConsent, call createEConsent method
        if ($addingEConsent) {
            $this->createEConsent($values);
        }
    }

    /**
     * Create link for eConsent form by populating
     * direct_consent
     *
     * @param array $values consent form values
     *
     * @return void
     */
    function createEConsent($values)
    {
        $this->validateCandidate($values);

        $db = \Database::singleton();
        $consentGroupID = $this->getConsentGroupID($values['consent_group']);

        $registrationCenterID = $db->pselectOne(
            "SELECT RegistrationCenterID FROM candidate WHERE CandID=:candid",
            ['candid' => $values['candID']]
        );

        // Make sure that the form is eConsent compatible
        // (exists in consent_display)
        $eConsentCompatible = $db->pselectOne(
            "SELECT cd.ConsentDisplayID 
            FROM consent_display cd 
            JOIN consent_display_rel cdr ON cdr.ConsentDisplayID=cd.ConsentDisplayID 
            WHERE cdr.ConsentGroupID=:cnst
            AND COALESCE(cdr.CenterID, 'X') IN (
                CASE 
                WHEN (SELECT CenterID 
                    FROM consent_display_rel 
                    WHERE ConsentGroupID=:cnst
                    AND CenterID=:rcID
                    AND CenterID IS NOT NULL) 
                    IS NOT NULL 
                THEN (:rcID)
                ELSE ('X')
                END
            )",
            [
                'cnst' => $consentGroupID,
                'rcID' => $registrationCenterID
            ]
        );

        if (empty($eConsentCompatible)) {
            http_response_code(400);
            echo("Consent form not available for eConsent.");
            throw new \LorisException("Error Processing Request", 1);
        }

        // Get request status
        $requestStatus = $this->getRequestStatus($values['candID'], $consentGroupID);
        // error if already exists in DB
        if (!empty($requestStatus) && $requestStatus !== 'expired') {
            http_response_code(400);
            echo("Consent form already added as eConsent.");
            throw new \LorisException("Error Processing Request", 1);
        }

        // New key for insert
        $bytes = openssl_random_pseudo_bytes(8);
        $key   = bin2hex($bytes);

        $data = [
            'OneTimeKey'     => $key,
            'Request_status' => 'created'
        ];

        if ($requestStatus === 'expired') {
            $db->update(
                'direct_consent',
                $data,
                [
                    'CandidateID'    => $values['candID'],
                    'ConsentGroupID' => $consentGroupID
                ]
            );
            // If expired and adding as eConsent again, reset
            // consent status to null
            $consentIDs = $db->pselectCol(
                "SELECT ConsentID 
                FROM consent 
                WHERE ConsentGroupID=:cgid",
                ['cgid' => $consentGroupID]
            );
            foreach ($consentIDs AS $consentID) {
                $db->update(
                    'candidate_consent_rel',
                    ['Status' => null],
                    [
                        'ConsentID'   => $consentID,
                        'CandidateID' => $values['candID']
                    ]
                );
            }

        } else {
            // Setup insert data
            $data['CandidateID']    = $values['candID'];
            $data['ConsentGroupID'] = $consentGroupID;

            // insert data
            $db->insert(
                'direct_consent',
                $data
            );
        }
    }

    /**
     * Sends consent to participant
     *
     * @param array $values consent form values
     *
     * @return void
     */
    function sendConsent($values)
    {
        $this->validateCandidate($values);
        $this->validateEmail($values);

        $db = \Database::singleton();
        $consentGroupID = $this->getConsentGroupID($values['consent_group']);

        // Get request status
        $requestStatus = $this->getRequestStatus($values['candID'], $consentGroupID);

        if ($requestStatus === 'complete') {
            http_response_code(400);
            echo("Can not send eConsent form if consent is already completed");
            throw new \LorisException("Error Processing Request", 1);
        }

        // update date sent & request status (if applicable)
        $updateData['Date_sent'] = date('Y-m-d');

        // only update status if current status is "created"
        // and consent is being sent
        if ($requestStatus === 'created') {
            $updateData['Request_status'] = 'sent';
        }

        $db->update(
            'direct_consent',
            $updateData,
            [
                'CandidateID'    => $values['candID'],
                'ConsentGroupID' => $consentGroupID
            ]
        );

        // get settings for Send
        $config  = \NDB_Config::singleton();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $key = $db->pselectOne(
            "SELECT OneTimeKey FROM direct_consent
            WHERE candidateID=:candID
            AND ConsentGroupID=:cgID",
            [
                'candID' => $values['candID'],
                'cgID'   => $consentGroupID
            ]
        );

        // set email values
        $email = $values['email1'];
        $url   = $baseURL.'/consent/consent_page/?key=' . $key."\n";
        unset($values['email1']);

        $msg_data = [
            'study' => $config->getSetting("title"),
            'url'   => $url
        ];

        // Send email
        \Email::send(
            $email,
            'send_consent.tpl',
            $msg_data,
            "",
            "Loris Team <noreply@loris.ca>"
        );
    }

    /**
     * Sets the consent row to expired
     *
     * @param array $values              consent form values
     * @param bool  $inactivateCandidate Whether candidate should be inactivated
     *
     * @return void
     */
    function expireConsent($values, $inactivateCandidate = false)
    {
        $this->validateCandidate($values);
        $db = \Database::singleton();
        $consentGroupID = $this->getConsentGroupID($values['consent_group']);

        // Reset key training progress, and set Request status to expired
        $updateData = [
            'OneTimeKey'       => null,
            'Request_status'   => 'expired',
            'trainingProgress' => null,
        ];

        $db->update(
            'direct_consent',
            $updateData,
            [
                'CandidateID'    => $values['candID'],
                'ConsentGroupID' => $consentGroupID
            ]
        );

        // If requested, set candidate to inactive
        if ($inactivateCandidate) {
            $user = \User::singleton();
            if (!$user->hasPermission('candidate_parameter_edit')) {
                http_response_code(403);
                echo("Can not edit participant status without correct permission");
                throw new \LorisException("Error Processing Request", 1);
            }

            $status       = $db->pselectOne(
                "SELECT * FROM participant_status_options 
                WHERE Description='Inactive'",
                []
            );
            $id           = $user->getID();
            $updateValues = [
                'participant_status' => $status,
                'CandID'             => $values['candID'],
                'entry_staff'        => $id,
            ];

            $exists = $db->pselectOne(
                "SELECT * from participant_status WHERE CandID=:candid",
                ['candid' => $values['candID']]
            );

            // Create new row in participant_status, or update
            if ($exists === null || empty($exists)) {
                $db->insert('participant_status', $updateValues);
            } else {
                $db->update(
                    'participant_status',
                    $updateValues,
                    ['CandID' => $values['candID']]
                );
            }

            // Update history
            $db->insert('participant_status_history', $updateValues);
        }
    }

    /**
     * Get ConsentGroupID from name / label
     *
     * @param String $consentGroup - name / label of consent group
     *
     * @return ?string
     */
    function getConsentGroupID($consentGroup)
    {
        $db = \Database::singleton();
        return $db->pselectOne(
            "SELECT ConsentGroupID
            FROM consent_group
            WHERE Label=:cnst OR Name=:cnst",
            ['cnst' => $consentGroup]
        );
    }

    /**
     * Get Request_status
     *
     * @param String $candID         - CandidateID
     * @param String $consentGroupID - ConsentGroupID
     *
     * @return ?string
     */
    function getRequestStatus($candID, $consentGroupID)
    {
        $db = \Database::singleton();
        return $db->pselectOne(
            "SELECT Request_status 
            FROM direct_consent
            WHERE CandidateID=:candID 
            AND ConsentGroupID=:cgID",
            [
                'candID' => $candID,
                'cgID'   => $consentGroupID
            ]
        );
    }

    /**
     * True if value is null
     *
     * @param String $value - value to check
     *
     * @return bool
     */
    function valueIsNull($value)
    {
        return empty($value) || $value === 'null';
    }

    /**
     * Validates the consent form values.
     *
     * @param array $values send consent form values
     *
     * @return void
     */
    function validateCandidate($values)
    {
        $db = \Database::singleton();
        if ($this->valueIsNull($values['candID'])) {
            http_response_code(400);
            die("DCC required.");
        }
        if ($this->valueIsNull($values['pscid'])) {
            http_response_code(400);
            die("PSCID required.");
        }
        if ($this->valueIsNull($values['consent_group'])) {
            http_response_code(400);
            die("Consent form required.");
        }

        // Check that given candID & pscid are valid
        $validCand = $db->pselectOne(
            "SELECT CandID 
            FROM candidate 
            WHERE CandID=:candid 
            AND PSCID=:pscid",
            [
                'candid' => $values['candID'],
                'pscid'  => $values['pscid']
            ]
        );

        if (empty($validCand)) {
            http_response_code(400);
            die(
                "Make sure PSCID and CandID are valid and reflect the same candidate"
            );
        }
    }

    /**
     * Validates the consent form values.
     *
     * @param array $values send consent form values
     *
     * @return void
     */
    function validateEmail($values)
    {
        $action = $values['action'];

        // Check email validation if sending
        if ($values['eConsent']
            || $action === 'Send'
        ) {
            if ($values['email1'] !== $values['email2']) {
                // check that emails match
                http_response_code(400);
                die("Emails must match");
            } else if (!$this->valueIsNull($values['email1'])
                && !filter_var($values['email1'], FILTER_VALIDATE_EMAIL)
            ) {
                // check that email is valid
                http_response_code(400);
                die("Email format not valid");
            }
            // Email required when sending
            if ($this->valueIsNull($values['email1'])
                && ($action === 'Send'
                || $action === 'CreateSend')
            ) {
                http_response_code(400);
                die("Email Required");
            }
        }
        return;
    }
}