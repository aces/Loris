<?php declare(strict_types=1);
namespace LORIS\consent;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * Handles the /files endpoint of the module to upload or
 * retrieve specific files.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

class Direct_Consent extends \NDB_Page
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    private $result      = [];
    private $candID      = "";
    private $consentData = [];
    private $key         = "";

    /**
     * Check user permissions
     * Always true because this is a public module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGet($request);
        case 'POST':
            return $this->_handlePost($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET', 'POST']);
        }
    }

    /**
     * Handle a GET request. This will render and display the page.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function _handleGet(ServerRequestInterface $request) : ResponseInterface
    {
        $this->key = $request->getQueryParams()['key'] ?? null;
        $db        = $this->loris->getDatabaseConnection();

        $this->consentData = $db->pselectWithIndexKey(
            "SELECT 
            	dc.CandidateID AS CandID,
                dc.ConsentGroupID, 
            	cd.Title,
                cd.Media,
            	cd.Description,
            	cd.training, 
            	dc.Request_status AS requestStatus, 
            	dc.trainingProgress, 
            	cdr.CenterID,
                dc.Date_sent,
                dc.Data_cleared,
                cdr.version,
                ca.PSCID
            FROM direct_consent dc
            INNER JOIN candidate ca ON ca.CandID=dc.CandidateID
            INNER JOIN consent_display_rel cdr 
                ON cdr.ConsentGroupID=dc.ConsentGroupID
            INNER JOIN consent_display cd 
                ON cd.ConsentDisplayID=cdr.ConsentDisplayID
            WHERE dc.OneTimeKey=:key
            AND COALESCE(cdr.CenterID, 'X') IN (
                CASE 
                WHEN (SELECT DISTINCT CenterID 
                    FROM consent_display_rel 
                    WHERE ConsentGroupID=dc.ConsentGroupID 
                    AND CenterID=ca.RegistrationCenterID 
                    AND CenterID IS NOT NULL) 
                    IS NOT NULL 
                THEN (ca.RegistrationCenterID)
                WHEN (SELECT ConsentDisplayID 
                    FROM consent_display_rel 
                    WHERE ConsentGroupID=dc.ConsentGroupID 
                    AND CenterID IS NULL) 
                    IS NOT NULL
                THEN ('X')
                ELSE ('Y')
                END
            )
            AND (cdr.CenterID=ca.RegistrationCenterID OR cdr.CenterID IS NULL)
            AND (cdr.version=dc.version OR cdr.version LIKE dc.version)",
            ['key' => $this->key],
            'CenterID'
        );

        if (count(array_keys($this->consentData)) === 2) {
            // If there is site specific data, unset the non-specific data
            unset($this->consentData[null]);
        } else if (count(array_keys($this->consentData)) === 0) {
            // If there is no consent data, return that it was not found
            $this->result['not_found'] = true;
            return new \LORIS\Http\Response\JSON\OK($this->result);
        }
        // reduce dimension of array
        $this->consentData         = reset($this->consentData);
        $this->result['not_found'] = false;

        // Get each consent code for consent group
        $individualConsents = $db->pselectWithIndexKey(
            "SELECT c.Name, c.Label, ccr.Status, c.ConsentID
            FROM consent c 
            JOIN direct_consent d ON d.ConsentGroupID=c.ConsentGroupID 
            JOIN candidate_consent_rel ccr ON ccr.CandidateID=d.CandidateID
            WHERE d.OneTimeKey=:key
            AND c.ConsentID=ccr.ConsentID",
            ['key' => $this->key],
            'Name'
        );

        $this->consentData['consents'] = $individualConsents;
        // Validate training JSON if present
        $file = $this->consentData['training'];
        if ($file !== null) {
            $training = file_get_contents(
                __DIR__."/../../../project/eConsents/{$file}.json"
            );

            // Check for errors in JSON format
            $JSONerrors = $this->validateTraining($individualConsents, $training);
            if (count($JSONerrors) > 0) {
                return new \LORIS\Http\Response\JSON\InternalServerError(
                    "Something is wrong with the JSON data"
                );
            }

            $this->consentData['training'] = $training;

        } else {
            $this->consentData['consentOptions'] = [
                'yes' => "Yes",
                'no'  => "No"
            ];
        }

        // Update Request status if this is the first time accessing after being sent
        if ($this->consentData['requestStatus'] === 'sent') {
            // Update history to indicate form being in progress
            $directUpdateHistory = [
                'PSCID'          => $this->consentData['PSCID'],
                'ConsentGroupID' => $this->consentData['ConsentGroupID'],
                'Request_status' => 'in_progress',
                'UserID'         => 'Candidate',
                'version'        => $this->consentData['version']
            ];
            $db->insert(
                "direct_consent_history",
                $directUpdateHistory
            );

            $db->update(
                'direct_consent',
                ['Request_status' => 'in_progress'],
                ['OneTimeKey' => $this->key]
            );
            $this->consentData['requestStatus'] = 'in_progress';
        }

        $this->result['requestStatus'] = $this->consentData['requestStatus'];
        unset($this->consentData['requestStatus']);

        $this->result['consentData'] = $this->consentData;
        return new \LORIS\Http\Response\JSON\OK($this->result);
    }

    /**
     * Handle a POST request
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    function _handlePost(ServerRequestInterface $request) : ResponseInterface
    {
        // Get Action
        $action = $request->getQueryParams()['action'];
        if (empty($action)) {
            return new \LORIS\Http\Response\JSON\BadRequest("Missing action");
        }

        switch ($action) {
        case 'progress':
            return $this->_updateProgress($request);
        case 'submit':
            return $this->_submitConsent($request);
        case 'send':
            return $this->_sendConfirmation($request);
        default:
            return new \LORIS\Http\Response\JSON\BadRequest("Invalid action");
        }

    }
    /**
     * Update training progress
     * This keeps the participant's place in the eConsent form
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function _updateProgress(ServerRequestInterface $request) : ResponseInterface
    {
        $body = $request->getParsedBody();

        if ($body === null || !is_array($body)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "No valid data was sent in the request"
            );
        }

        $oneTimeKey = $request->getQueryParams()['key'];
        $db         = $this->loris->getDatabaseConnection();

        $requestStatus = $db->pselectOne(
            "SELECT Request_status 
            FROM direct_consent
            WHERE OneTimeKey=:key",
            ['key' => $oneTimeKey]
        );

        // Update request status if not yet "in progress"
        if ($requestStatus === 'created' || $requestStatus === 'sent') {
            // Update history to indicate form being in progress
            $valsForHistory = $db->pselectRow(
                "SELECT ca.PSCID, dc.ConsentGroupID, dc.version 
                FROM direct_consent dc
                JOIN candidate ca ON dc.CandidateID=ca.CandID
                 WHERE OneTimeKey=:key",
                ['key' => $oneTimeKey]
            );
            if (isset($valsForHistory['PSCID'])
                && isset($valsForHistory['ConsentGroupID'])
                && isset($valsForHistory['version'])
            ) {
                $directUpdateHistory = [
                    'PSCID'          => $valsForHistory['PSCID'],
                    'ConsentGroupID' => $valsForHistory['ConsentGroupID'],
                    'Request_status' => 'in_progress',
                    'UserID'         => 'Candidate',
                    'version'        => $valsForHistory['version']
                ];
                $db->insert(
                    "direct_consent_history",
                    $directUpdateHistory
                );

                $updateData['Request_status'] = 'in_progress';
            }
        }

        $updateData['trainingProgress'] = $body['progress'];

        // unsafe update needed to hold json form
        $db->unsafeUpdate(
            "direct_consent",
            $updateData,
            [
                'OneTimeKey' => $oneTimeKey
            ]
        );
        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Submit consent value
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function _submitConsent(ServerRequestInterface $request) : ResponseInterface
    {
        // Get server data
        $body = $request->getParsedBody();
        if ($body === null || !is_array($body)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "No valid data was sent in the request"
            );
        }
        $oneTimeKey = $request->getQueryParams()['key'];

        $db = $this->loris->getDatabaseConnection();

        // Get Identifiers
        $candID    = $db->pselectOne(
            "SELECT CandidateID FROM direct_consent WHERE OneTimeKey=:otk",
            ['otk' => $oneTimeKey]
        );
        $candidate = \Candidate::singleton(new CandID($candID));
        $pscid     = $candidate->getPSCID();

        // Update values for each consent code that was submitted
        foreach ($body AS $consent => $value) {
            // Get consent info
            $consentInfo = $db->pselectRow(
                "SELECT ConsentID, Label FROM consent WHERE Name=:cnst",
                ['cnst' => $consent]
            );
            if (is_array($consentInfo)
                && array_key_exists('ConsentID', $consentInfo)
                && array_key_exists('Label', $consentInfo)
            ) {
                $consentID = $consentInfo['ConsentID'];
                // Update consent status
                $db->update(
                    "candidate_consent_rel",
                    [
                        'Status'    => $value,
                        'DateGiven' => date('Y-m-d H-i-s')
                    ],
                    [
                        'CandidateID' => $candID,
                        'ConsentID'   => $consentID
                    ]
                );
            }
        }

        // Only update request status to "complete"
        // if all consents have been updated from consent group
        $consents = $db->pselectColWithIndexKey(
            "SELECT ccr.ConsentID, ccr.Status
            FROM direct_consent dc
            JOIN consent c ON c.ConsentGroupID=dc.ConsentGroupID
            LEFT JOIN candidate_consent_rel ccr ON
                (ccr.ConsentID=c.ConsentID
                AND ccr.CandidateID=dc.CandidateID)
            WHERE dc.OneTimeKey=:key",
            ['key' => $oneTimeKey],
            'ConsentID'
        );

        // Check that consent answer exists for each consent code
        $complete = true;
        foreach ($consents as $consent) {
            if (empty($consent)) {
                $complete = false;
            }
        }

        $valsForHistory = $db->pselectRow(
            "SELECT ConsentGroupID, version 
            FROM direct_consent WHERE OneTimeKey=:otk",
            ["otk" => $oneTimeKey]
        );

        // Update request status if form complete
        if ($complete
            && isset($valsForHistory['ConsentGroupID'])
            && isset($valsForHistory['version'])
        ) {
            $db->update(
                "direct_consent",
                ['Request_status' => 'complete'],
                [
                    'OneTimeKey' => $oneTimeKey
                ]
            );

            // Update history to indicate form being completed
            $directUpdateHistory = [
                'PSCID'          => $pscid,
                'ConsentGroupID' => $valsForHistory['ConsentGroupID'],
                'Request_status' => 'complete',
                'UserID'         => 'Candidate',
                'version'        => $valsForHistory['version']
            ];

            $db->insert(
                "direct_consent_history",
                $directUpdateHistory
            );
            $directConsentHistoryID = $db->getLastInsertId();

            // Send notification to users
            $notifData = $db->pselectRow(
                "SELECT u.Email, cg.Label, c.PSCID
                FROM direct_consent dc
                JOIN users u ON dc.UserID=u.ID
                JOIN consent_group cg ON cg.ConsentGroupID=dc.ConsentGroupID
                JOIN candidate c ON c.CandID=dc.CandidateID
                WHERE dc.OneTimeKey=:otk",
                ['otk' => $oneTimeKey]
            );
            if (!empty($notifData['Email'])) {
                $msg_data = [
                    'title'       => $notifData['Label'],
                    'participant' => $notifData['PSCID']
                ];
                // Send email
                \Email::send(
                    $notifData['Email'],
                    'completed_econsent_notification.tpl',
                    $msg_data,
                    "",
                    "LORIS Team <noreply@loris.ca>"
                );
            }
        }

        foreach ($body AS $consent => $value) {
            // Get consent info
            $label = $db->pselectOne(
                "SELECT Label FROM consent WHERE Name=:cnst",
                ['cnst' => $consent]
            );
            if (isset($label) && isset($valsForHistory['version'])) {

                // Update history
                $updateHistory = [
                    'PSCID'                  => $pscid,
                    'ConsentName'            => $consent,
                    'ConsentLabel'           => $label,
                    'Status'                 => $value,
                    'DateGiven'              => date('Y-m-d H-i-s'),
                    'EntryStaff'             => 'Candidate',
                    'version'                => $valsForHistory['version'],
                    'DirectConsentHistoryID' => $directConsentHistoryID ?? null
                ];
                $db->insert(
                    "candidate_consent_history",
                    $updateHistory
                );
            }
        }

        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Send Confirmation Email
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function _sendConfirmation(ServerRequestInterface $request) : ResponseInterface
    {
        $body = $request->getParsedBody();
        if ($body === null || !is_array($body)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "No valid data was sent in the request"
            );
        }
        $validEmail = $this->validateEmail($body);
        if ($validEmail->getStatusCode() !== 200) {
            return $validEmail;
        }

        $email = $body['email1'];
        $key   = $request->getQueryParams()['key'];
        unset($body['email1']);
        unset($body['email2']);

        // Reset email in direct_consent
        $db = $this->loris->getDatabaseConnection();

        $hash = password_hash($email, PASSWORD_DEFAULT);
        $db->update(
            'direct_consent',
            ['Email_hash' => $hash],
            ['OneTimeKey' => $key]
        );

        // Set email message data
        $config  = \NDB_Config::singleton();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        // set email values
        $url = $baseURL.'/consent/consent_page/?key=' . $key."\n";

        $msg_data = [
            'study' => $config->getSetting("title"),
            'url'   => $url,
        ];

        // Send email
        \Email::send(
            $email,
            'send_confirmation.tpl',
            $msg_data,
            "",
            "<noreply@loris.ca>"
        );
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
        if ($values['email1'] !== $values['email2']) {
            // check that emails match
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Emails must match."
            );
        } else if (!filter_var($values['email1'], FILTER_VALIDATE_EMAIL)) {
            // check that email is valid
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Email format not valid."
            );
        }
        return new \LORIS\Http\Response\JSON\OK();
    }

    /**
     * Validates the format of the eConsent form
     *
     * @param Array        $consents - List of consent codes
     * @param false|string $training - eConsent form
     *
     * @return Array errors
     */
    function validateTraining($consents, $training) : array
    {
        $errors   = [];
        $training = json_decode($training, true);

        // Make sure that training JSON has correct structure
        if (!array_key_exists('ui', $training)
            || !array_key_exists('schema', $training)
            || !array_key_exists('elements', $training['schema'])
            || !array_key_exists('setup', $training['schema'])
        ) {
            $errors[] = "Problem with JSON structure detected. The JSON must 
                contain a 'ui' object and a 'schema' object. In the 'schema' 
                object, there must be an 'elements' object and a 'setup' object.";
            return $errors;
        }

        $elements = $training['schema']['elements'];
        $ui       = $training['ui'];

        // Check that the right consent questions are present in JSON
        // And check validity of quiz questions

        foreach ($ui as $el => $info) {
            // Give error if no correct response in element or in options
            if ($info['type'] === 'select') {
                $opts      = $elements[$el]['options'];
                $isConsent = array_key_exists('isSavable', $opts)
                    && $opts['isSavable'];

                if ($isConsent
                    && !array_key_exists($el, $consents)
                ) {
                    $errors[$el] = "Consent code $el from JSON not recognized";
                }

                if (!$isConsent
                    && !array_key_exists('correctResponse', $opts)
                ) {
                    $errors[$el] = "No correct response given for quiz question $el";
                } else if (!$isConsent) {
                    $JSONVals        = $opts['values'];
                    $options         = array_column($JSONVals, 'value');
                    $correctResponse = $opts['correctResponse'];
                    if (!in_array($correctResponse, $options)) {
                        $errors[$el]
                            = "Correct response does not exist in options for $el";
                    }
                }
            }
        }

        foreach ($consents as $name => $consentInfo) {
            // Give error if element does not exist for consent code,
            // or if element type is not 'consent'
            $isConsent = array_key_exists(
                'isSavable',
                $elements[$name]['options'] ?? []
            )
                && $elements[$name]['options']['isSavable'] ;

            if (!array_key_exists($name, $elements)
                || !$isConsent
            ) {
                $errors[$name]
                    = "Missing consent code {$consentInfo['Label']} in JSON";
            }

            // Check that only "yes" and "no" exist as keys in the consent options
            $optionVals     = $elements[$name]['options']['values'] ?? [];
            $options        = array_column($optionVals, 'value') ?? [];
            $allowedOptions = ['yes','no'];
            if (!array_diff($options, $allowedOptions)
                && (!in_array('yes', $options) || !in_array('no', $options))
            ) {
                $errors[$name] = "Consent options in JSON must be 'yes' and 'no'";
            }
        }
        return $errors;
    }
}