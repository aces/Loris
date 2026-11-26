<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

use \LORIS\LorisInstance;
use \LORIS\redcap\RedcapQueries;
use \LORIS\redcap\config\RedcapConfig;
use \LORIS\redcap\config\RedcapConfigLorisId;
use \LORIS\redcap\config\RedcapConfigRedcapId;
use \LORIS\redcap\config\RedcapConfigVisit;
use \LORIS\redcap\client\RedcapHttpClient;
use \LORIS\redcap\client\models\RedcapEvent;
use \LORIS\redcap\client\models\records\RedcapRecord;
use \Candidate;
use \TimePoint;

/**
 * Mapping methods to match REDCap and LORIS identifiers in the REDCap module.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapMapper
{
    /**
     * THe LORIS instance.
     *
     * @var LorisInstance
     */
    private LorisInstance $_loris;

    /**
     * The REDCap HTTP client.
     *
     * @var RedcapHttpClient
     */
    private RedcapHttpClient $_redcap_client;

    /**
     * The REDCap module configuration.
     *
     * @var RedcapConfig
     */
    private RedcapConfig $_config;

    /**
     * The REDCap module database queries.
     *
     * @var RedcapQueries
     */
    private RedcapQueries $_queries;

    /**
     * Constructor.
     *
     * @param LorisInstance    $loris         The LORIS instance.
     * @param RedcapHttpClient $redcap_client The REDCap HTTP client.
     * @param RedcapConfig     $config        The REDCap module configuration.
     */
    public function __construct(
        LorisInstance $loris,
        RedcapHttpClient $redcap_client,
        RedcapConfig $config,
    ) {
        $this->_loris         = $loris;
        $this->_redcap_client = $redcap_client;
        $this->_config        = $config;
        $this->_queries       = new RedcapQueries($loris);
    }

    /**
     * Get the visit label of the session associated with a REDCap record. If the
     * session does not already exist, this function either creates it if automatic
     * session creation is enabled for that visit in the REDCap module
     * configuration, or throws an error if it is not.
     *
     * @param RedcapRecord $redcap_record The REDCap record.
     * @param \Candidate   $candidate     The LORIS candidate associated with
     *                                    that REDCap record.
     *
     * @return string The visit label of the relevant session.
     */
    public function getVisitLabel(
        RedcapRecord $redcap_record,
        \Candidate $candidate,
    ): string {
        $visit_config = $this->getVisitConfig($redcap_record->unique_event_name);

        // If no visit mappings are defined in the configuration, use the REDCap
        // unique event name as the visit label directly.
        if ($visit_config === null) {
            return $redcap_record->unique_event_name;
        }

        $session = $this->checkOrCreateSession($candidate, $visit_config);

        $this->checkOrStartSessionStage(
            $candidate,
            $session,
            $visit_config,
            $redcap_record,
        );

        return $visit_config->visit_label;
    }

    /**
     * Get the LORIS visit label associated with a REDCap unique event name
     * based on the REDCap module configuration.
     *
     * @param string $unique_event_name The REDCap unique event name.
     *
     * @return ?RedcapConfigVisit The LORIS visit label associated with the REDCap
     *                 notification, or `null` if no corresponding visit label is
     *                 found.
     */
    public function getVisitConfig(string $unique_event_name): ?RedcapConfigVisit
    {
        // Get the list of all the REDCap events for this REDCap project.
        $redcap_events = $this->_redcap_client->getEvents();

        // Find the REDCap event that matches the REDCap notification event.
        $redcap_event = array_find(
            $redcap_events,
            fn($redcap_event) => $redcap_event->unique_name === $unique_event_name,
        );

        // There should always be a REDCap event that matches the REDCap
        // notification event, but since this is an external API, check this
        // assumption nonetheless.
        if ($redcap_event === null) {
            throw new \LorisException(
                "[redcap] Error: No REDCap event found for unique event name"
                . " '{$unique_event_name}'."
            );
        }

        // If there are no visit mappings in the REDCap module configuration, simply
        // use the REDCap event name as the LORIS vist name.
        if ($this->_config->visits === null) {
            return null;
        }

        $event_name = $redcap_event->name;
        $arm_name   = $this->_getRedcapEventArmName($redcap_event);

        // Look for the REDCap module configuration visit mappings that match the
        // REDCap notification event, using the event name and arm name.
        $visit_mappings = array_filter(
            $this->_config->visits,
            function ($visit_config) use ($event_name, $arm_name) {
                if ($visit_config->redcap_event_name !== null
                    && $visit_config->redcap_event_name !== $event_name
                ) {
                    return false;
                }

                if ($visit_config->redcap_arm_name !== null
                    && $visit_config->redcap_arm_name !== $arm_name
                ) {
                    return false;
                }

                return true;
            },
        );

        // If there is no visit mapping that match the REDCap notification event,
        // return `null` and ignore this notification.
        if (count($visit_mappings) === 0) {
            return null;
        }

        // If there are several visit mappings that match the REDCap notification
        // event, raise an error.
        if (count($visit_mappings) !== 1) {
            throw new \LorisException(
                "[redcap] Error: Multiple visits selectable for event name"
                . " '$event_name' and arm name '$arm_name'."
            );
        }

        // Return the LORIS visit label associated with the matching visit mapping.
        $visit_config = reset($visit_mappings);
        return $visit_config ? $visit_config : null;
    }

    /**
     * Get the REDCap event associated with a REDCap visit mapping configuration
     * node.
     *
     * @param RedcapConfigVisit $visit_config A REDCap visit mapping configuration
     *                                        node.
     *
     * @return RedcapEvent The associated REDCap event.
     */
    public function getVisitConfigEvent(
        RedcapConfigVisit $visit_config,
    ): RedcapEvent {
        // Get the list of all the REDCap arms for this REDCap project.
        $redcap_arms = $this->_redcap_client->getArms();

        // Find the REDCap arm that matches the configuration arm name.
        $redcap_arm = array_find(
            $redcap_arms,
            fn($redcap_arm) => $redcap_arm->name === $visit_config->redcap_arm_name,
        );

        // Get the list of all the REDCap events for this REDCap project.
        $redcap_events = $this->_redcap_client->getEvents();

        // Find the REDCap event that matches the arm and configuration event name.
        $redcap_event = array_find(
            $redcap_events,
            fn($redcap_event) => (
                $redcap_event->arm_number === $redcap_arm->number
                && $redcap_event->name === $visit_config->redcap_event_name
            ),
        );

        return $redcap_event;
    }

    /**
     *  Check that a session exists or create it using the REDCap module automatic
     *  session creation configuration. Throw an exception if the session does not
     *  exist and automatic session creation is not enabled for that visit.
     *
     * @param \Candidate        $candidate    The LORIS candidate associated with
     *                                        that REDCap record.
     * @param RedcapConfigVisit $visit_config The REDCap module visit configuration
     *                                        associated with that REDCap record.
     *
     * @return TimePoint
     */
    public function checkOrCreateSession(
        \Candidate $candidate,
        RedcapConfigVisit $visit_config,
    ): TimePoint {
        // Get the ID of the session associated with the candidate and visit label.
        $session_id = array_search(
            $visit_config->visit_label,
            $candidate->getListOfVisitLabels()
        );

        // If the session already exists, no need to create it.
        if ($session_id) {
            return TimePoint::singleton(new \SessionID(strval($session_id)));;
        }

        // Throw an exception if the session does not exist and there is no
        // session creation configuration for that visit, hence skipping the
        // notification.
        if ($visit_config->create_session === null) {
            $psc_id      = $candidate->getPSCID();
            $visit_label = $visit_config->visit_label;
            throw new \LorisException(
                "[redcap] No session found for candidate '$psc_id' and visit label"
                . " '$visit_label', skipping notification."
            );
        }

        // Get the LORIS site, project, and cohort from the database using the
        // information provided by the session creation configuration.

        $site_name = $visit_config->create_session->site_name;
        $site_id   = array_search($site_name, \Utility::getSiteList());

        $project_name = $visit_config->create_session->project_name;
        $project_id   = array_search($project_name, \Utility::getProjectList());

        $cohort_name = $visit_config->create_session->cohort_name;
        $cohort_id   = array_search($cohort_name, \Utility::getCohortList());

        // Throw an exception if any of the site, project, or cohort could not be
        // obtained from the database, which means that the information present in
        // the session creation configuration was incorrect.

        if (!$site_id) {
            throw new \LorisException(
                "[redcap] Error: No LORIS site found for site name '$site_name',"
                . " the REDCap module configuration is incorrect."
            );
        }

        if (!$project_id) {
            throw new \LorisException(
                "[redcap] Error: No LORIS project found for project name"
                . " '$project_name', the REDCap module configuration is incorrect."
            );
        }

        if (!$cohort_id) {
            throw new \LorisException(
                "[redcap] Error: No LORIS cohort found for cohort name"
                . " '$cohort_name', the REDCap module configuration is incorrect."
            );
        }

        // Since the REDCap module is called by the REDCap API or from a script,
        // there is usually no logged in user. As such, manually set the user to be
        // the REDCap issue assignee to create the session.

        $user = $this->_queries->getRedcapIssueAssignee();

        $state = \State::singleton();
        $state->setUsername($user->getUsername());
        $_SESSION['State'] =& $state;

        // Create the session that corresponds to this mapping.

        // TODO: Return directly once `TimePoint::createNew` has been modified to
        // return the session.
        TimePoint::createNew(
            $candidate,
            $cohort_id,
            $visit_config->visit_label,
            \Site::singleton(new \CenterID(strval($site_id))),
            \Project::getProjectFromID(new \ProjectID(strval($project_id))),
        );

        // Get the session again now that it been created.

        $session_id = array_search(
            $visit_config->visit_label,
            $candidate->getListOfVisitLabels()
        );

        return TimePoint::singleton(new \SessionID(strval($session_id)));
    }

    /**
     * Start the session if it is not already started and the automatic session
     * creation is enabled.
     *
     * @param Candidate         $candidate     The LORIS candidate associated with
     *                                         the REDCap record.
     * @param TimePoint         $session       The LORIS session associated with the
     *                                         REDCap record.
     * @param RedcapConfigVisit $visit_config  The REDCap module visit configuration
     *                                         associated with that REDCap record.
     * @param RedcapRecord      $redcap_record The REDCap record.
     *
     * @return void
     */
    function checkOrStartSessionStage(
        Candidate $candidate,
        TimePoint $session,
        RedcapConfigVisit $visit_config,
        RedcapRecord $redcap_record,
    ) {
        // If the session is not startable, do not start it.
        if ($session->getCurrentStage() !== 'Not Started') {
            return;
        }

        // Throw an exception if the automatic session creation is not enabled for
        // that visit, hence skipping the notification.
        if ($visit_config->create_session === null) {
            $psc_id      = $candidate->getPSCID();
            $visit_label = $visit_config->visit_label;
            throw new \LorisException(
                "[redcap] Session for candidate '$psc_id' and visit label"
                . " '$visit_label' is not started, skipping notification."
            );
        }

        // Start the session next stage, so that it can receive instrument data.

        $new_stage = $session->getNextStage();
        $session->startStage($new_stage);

        // Use the record completion date if it is present, or fall back to the
        // current date otherwise.
        // TODO: Factorize the "get record date" operation.
        if ($redcap_record->datetime !== null) {
            $datetime = $redcap_record->datetime;
        } else {
            $datetime = new \DateTimeImmutable();
        }

        $session->setData(
            [
                "Date_{$new_stage}" => $datetime->format('Y-m-d'),
            ]
        );

        // Add the test batteries to the session.

        $battery = new \NDB_BVL_Battery;

        $first_visit_label = $candidate->getFirstVisit();
        if ($first_visit_label == $session->getVisitLabel()) {
            $first_visit = true;
        } else {
            $first_visit = false;
        }

        $battery->selectBattery($session->getSessionID());

        // add instruments to the time point (lower case stage)
        $battery->createBattery(
            $this->_loris,
            $session->getCohortID(),
            $new_stage,
            $session->getVisitLabel(),
            $session->getCenterID(),
            $first_visit,
        );
    }

    /**
     * Get the LORIS candidate identifier (CandID or PSCID) that matches a REDCap
     * record ID, instrument name, and unique event named based on the REDCap module
     * configuration.
     *
     * @param string $record_id         The REDCap record ID.
     * @param string $instrument_name   The REDCap instrument name.
     * @param string $unique_event_name The REDCap unique event name.
     *
     * @return string The LORIS candidate identifier.
     */
    public function getCandidateIdentifier(
        string $record_id,
        string $instrument_name,
        string $unique_event_name,
    ): string {
        // If the REDCap module configuration is to use the REDCap record ID, simply
        // return the REDCap notification record ID.
        $condition = $this->_config->redcap_participant_id
            === RedcapConfigRedcapId::RecordId;

        if ($condition) {
            return $record_id;
        }

        // Get the list of all REDCap survey participants for the notification
        // instrument and event.
        $participants = $this->_redcap_client->getSurveyParticipants(
            $instrument_name,
            $unique_event_name,
        );

        // Find the survey participant matching the notification record.
        $participant = array_find(
            $participants,
            fn($participant) => $participant->record === $record_id
        );

        // If no survey participant is found for that record, raise an error. This
        // can happen because even with surveys enabled in REDCap, there is no
        // requirement for all records to be linked to survey participants.
        if ($participant === null) {
            throw new \LorisException(
                "[redcap] Error: No survey participant found for record ID"
                . " '$record_id'."
            );
        }

        // If the REDCap survey participant does not have a custom identifier, raise
        // an error. This can happen because the survey participant identifier must
        // be set manually in REDCap and is optional.
        if ($participant->identifier === null) {
            throw new \LorisException(
                "[redcap] Error: Survey participant has no identifier for"
                . " record ID '$record_id'."
            );
        }

        // Return the identifier of the survey participant.
        return $participant->identifier;
    }

    /**
     * Get the LORIS candidate that matches a candidate identifier (CandID or PSCID)
     * based on the REDCap module configuration.
     *
     * @param string $candidate_identifier The candidate identifier obtained from
     *                                     REDCap.
     *
     * @return \Candidate The LORIS candidate.
     */
    public function getCandidateWithIdentifier(
        string $candidate_identifier,
    ): \Candidate {
        // Get the candidate using the REDCap participant identifier as a CandID or
        // PSCID depending on the REDCap module configuration.
        $candidate = match ($this->_config->candidate_id) {
            RedcapConfigLorisId::CandId =>
                $this->_queries->tryGetCandidateWithCandId($candidate_identifier),
            RedcapConfigLorisId::PscId =>
                $this->_queries->tryGetCandidateWithPscId($candidate_identifier),
            RedcapConfigLorisId::ExternalId=>
                $this->_queries->tryGetCandidateWithExternalId($candidate_identifier)
        };

        // If no candidate matches the REDCap participant identifier, raise an
        // error.
        if ($candidate === null) {
            throw new \LorisException(
                "[redcap] Error: No LORIS candidate found for candidate identifier"
                . " '$candidate_identifier'."
            );
        }

        // Return the candidate.
        return $candidate;
    }

    /**
     * Get the REDCap arm name of a REDCap event.
     *
     * @param RedcapEvent $redcap_event The REDCap event.
     *
     * @return string The REDCap event arm name.
     */
    private function _getRedcapEventArmName(RedcapEvent $redcap_event): string
    {
        // Get the list of all the REDCap arms for this REDCap project.
        $redcap_arms = $this->_redcap_client->getArms();

        // Find the REDCap arm that matches the REDCap event.
        $redcap_arm = array_find(
            $redcap_arms,
            fn($redcap_arm) => $redcap_arm->number === $redcap_event->arm_number,
        );

        // There should always be a REDCap arm that matches the REDCap event arm,
        // but since this is an external API, check this
        // assumption nonetheless.
        if ($redcap_arm === null) {
            throw new \LorisException(
                "[redcap] Error: No REDCap arm found for event arm number"
                . " '{$redcap_event->arm_number}'."
            );
        }

        // Return the name of the REDCap arm.
        return $redcap_arm->name;
    }
}
