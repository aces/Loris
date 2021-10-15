<?php declare(strict_types=1);
namespace LORIS\consent;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\StudyEntities\Candidate\CandID;

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
     * @return ResponseInterface
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
     * @return ResponseInterface
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
            return $this->createConsent($values);
        case 'CreateEConsent':
            return $this->createEConsent($values);
        case 'Send':
            return $this->sendConsent($values);
        case 'CreateSend':
            $createConsent = $this->createConsent($values);
            if ($createConsent->getStatusCode() !== 200) {
                return $createConsent;
            }
            return $this->sendConsent($values);
        case 'Expire':
            return $this->expireConsent($values);
        case 'ExpireAndInactivate':
            return $this->expireConsent($values, true);
        default:
            return new \LORIS\Http\Response\JSON\BadRequest("Invalid action");
        }
    }

    /**
     * Creates row(s) in candidate_consent_rel table
     *
     * @param array $values consent form values
     *
     * @return ResponseInterface
     */
    function createConsent($values)
    {
        $validConsent = $this->validateConsent($values);
        if ($validConsent->getStatusCode() !== 200) {
            return $validConsent;
        }
        $validEmail = $this->validateEmail($values);
        if ($validEmail->getStatusCode() !== 200) {
            return $validEmail;
        }

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
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Consent codes not found"
            );
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
            return new \LORIS\Http\Response\JSON\Conflict(
                "Consent form has already been added for this candidate."
            );
        }

        // Add each consent code as row
        foreach ($consentIDs as $id) {

            // insert into candidate_consent_rel if it's not already there
            if (!array_key_exists($id, $candidateConsents)) {

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
            return $this->createEConsent($values);
        }
        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Create link for eConsent form by populating
     * direct_consent
     *
     * @param array $values consent form values
     *
     * @return ResponseInterface
     */
    function createEConsent($values)
    {
        $validConsent = $this->validateConsent($values);
        if ($validConsent->getStatusCode() !== 200) {
            return $validConsent;
        }

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
            return new \LORIS\Http\Response\JSON\Conflict(
                "Consent form not available for eConsent."
            );
        }

        // Get request status
        $requestStatus = $this->getRequestStatus($values['candID'], $consentGroupID);
        // error if already exists in DB
        if (!empty($requestStatus) && $requestStatus !== 'expired') {
            return new \LORIS\Http\Response\JSON\Conflict(
                "Consent form already added as eConsent."
            );
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
        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Sends consent to participant
     *
     * @param array $values consent form values
     *
     * @return ResponseInterface
     */
    function sendConsent($values)
    {
        $validConsent = $this->validateConsent($values);
        if ($validConsent->getStatusCode() !== 200) {
            return $validConsent;
        }
        $validEmail = $this->validateEmail($values);
        if ($validEmail->getStatusCode() !== 200) {
            return $validEmail;
        }

        $db = \Database::singleton();
        $consentGroupID = $this->getConsentGroupID($values['consent_group']);

        // Get request status
        $requestStatus = $this->getRequestStatus($values['candID'], $consentGroupID);

        if ($requestStatus === 'complete') {
            return new \LORIS\Http\Response\JSON\Conflict(
                "Can not send eConsent form if consent is already completed"
            );
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
        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Sets the consent row to expired
     *
     * @param array $values              consent form values
     * @param bool  $inactivateCandidate Whether candidate should be inactivated
     *
     * @return ResponseInterface
     */
    function expireConsent($values, $inactivateCandidate = false)
    {
        $validConsent = $this->validateConsent($values);
        if ($validConsent->getStatusCode() !== 200) {
            return $validConsent;
        }

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
                return new \LORIS\Http\Response\JSON\Unauthorized(
                    "Can not edit participant status without correct permission"
                );
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
        return new \LORIS\Http\Response\JSON\OK();
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
     * @return ResponseInterface
     */
    function validateConsent($values)
    {
        if ($this->valueIsNull($values['candID'])) {
            return new \LORIS\Http\Response\JSON\BadRequest("CandID required.");
        }
        if ($this->valueIsNull($values['pscid'])) {
            return new \LORIS\Http\Response\JSON\BadRequest("PSCID required.");
        }
        if ($this->valueIsNull($values['consent_group'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Consent form required."
            );
        }

        // Check that candidate exists and CandID / PSCID match
        try {
            $candID = new CandID($values['candID']);
        } catch (\DomainException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Invalid CandID."
            );
        }

        $validCand = \Candidate::candidateExists(
            $candID,
            $values['pscid']
        );
        if (!$validCand) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Make sure PSCID and CandID are valid ".
                "and reflect the same candidate."
            );
        }

        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Validates the consent form values.
     *
     * @param array $values send consent form values
     *
     * @return ResponseInterface
     */
    function validateEmail($values)
    {
        $action = $values['action'];

        // Check email validation if sending
        if ($values['eConsent']
            || $action === 'Send'
        ) {
            // Email required when sending
            if ($this->valueIsNull($values['email1'])
                && ($action === 'Send'
                || $action === 'CreateSend')
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest("Email required.");
            }

            if ($values['email1'] !== $values['email2']) {
                // check that emails match
                return new \LORIS\Http\Response\JSON\BadRequest(
                    "Emails must match."
                );
            } else if (!$this->valueIsNull($values['email1'])
                && !filter_var($values['email1'], FILTER_VALIDATE_EMAIL)
            ) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    "Email format not valid."
                );
            }
        }
        return new \LORIS\Http\Response\JSON\OK();
    }
}