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
        $db        = \Database::singleton();

        $this->consentData = $db->pselectWithIndexKey(
            "SELECT 
            	dc.CandidateID AS CandID,
                dc.ConsentGroupID, 
            	cd.Title, 
            	cd.Description, 
            	cd.training, 
            	dc.Request_status AS requestStatus, 
            	dc.trainingProgress, 
            	cdr.CenterID,
                dc.Date_sent,
                dc.Data_cleared
            FROM direct_consent dc
            INNER JOIN candidate ca ON ca.CandID=dc.CandidateID
            INNER JOIN consent_display_rel cdr 
                ON cdr.ConsentGroupID=dc.ConsentGroupID
            INNER JOIN consent_display cd 
                ON cd.ConsentDisplayID=cdr.ConsentDisplayID
            WHERE dc.OneTimeKey=:key
            AND COALESCE(cdr.CenterID, 'X') IN (
                CASE 
                WHEN (SELECT CenterID 
                    FROM consent_display_rel 
                    WHERE ConsentGroupID=dc.ConsentGroupID 
                    AND CenterID=ca.RegistrationCenterID 
                    AND CenterID IS NOT NULL) 
                    IS NOT NULL 
                THEN (ca.RegistrationCenterID)
                ELSE ('X')
                END
            )",
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
            $db->update(
                'direct_consent',
                ['Request_status' => 'in_progress'],
                ['OneTimeKey' => $this->key]
            );
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
        $db         = \Database::singleton();

        $requestStatus = $db->pselectOne(
            "SELECT Request_status 
            FROM direct_consent
            WHERE OneTimeKey=:key",
            ['key' => $oneTimeKey]
        );

        // Update request status if not yet "in progress"
        if ($requestStatus === 'created' || $requestStatus === 'sent') {
            $updateData['Request_status'] = 'in_progress';
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

        $db = \Database::singleton();

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
                // Update history
                $updateHistory = [
                    'PSCID'        => $pscid,
                    'ConsentName'  => $consent,
                    'ConsentLabel' => $consentInfo['Label'],
                    'Status'       => $value,
                    'DateGiven'    => date('Y-m-d H-i-s'),
                    'EntryStaff'   => 'Candidate',
                ];
                $db->insert(
                    "candidate_consent_history",
                    $updateHistory,
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

        // Update request status if form complete
        if ($complete) {
            $db->update(
                "direct_consent",
                ['Request_status' => 'complete'],
                [
                    'OneTimeKey' => $oneTimeKey
                ]
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
            $isConsent = $elements[$name]['options']['isSavable'];

            if (!array_key_exists($name, $elements)
                || !$isConsent
            ) {
                $errors[$name]
                    = "Missing consent code {$consentInfo['Label']} in JSON";
            }

            // Check that only "yes" and "no" exist as keys in the consent options
            $optionVals     = $elements[$name]['options']['values'];
            $options        = array_column($optionVals, 'value');
            $allowedOptions = ['yes','no'];
            if (!array_diff($options, $allowedOptions)
                && (!in_array('yes', $options) || !in_array('no', $options))
            ) {
                $errors[$name] = "Consent options in JSON must be 'yes' and 'no'";
            }
        }
        error_log(print_r($errors, true));
        return $errors;
    }
}