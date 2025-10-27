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
use \LORIS\redcap\client\RedcapHttpClient;
use \LORIS\redcap\config\RedcapConfig;
use \LORIS\redcap\client\models\RedcapNotification;

/**
 * This represents a REDCap notification handler.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapNotificationHandler
{
    /**
     * LORIS fields to be excluded when comparing with REDCap dictionary.
     *
     * @var array
     */
    const LORIS_DD_EXCLUDE_FIELDS = [
        "Date_taken",
        "Candidate_age",
        "Window_Difference",
        "Examiner",
    ];

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
     * The REDCap notification.
     *
     * @var RedcapNotification
     */
    private RedcapNotification $_redcap_notif;

    /**
     * The REDCap module configuration.
     *
     * @var RedcapConfig
     */
    private RedcapConfig $_config;

    /**
     * The REDCap mapper.
     *
     * @var RedcapMapper
     */
    private RedcapMapper $_mapper;

    /**
     * The REDCap module database queries.
     *
     * @var RedcapQueries
     */
    private RedcapQueries $_queries;

    /**
     * Constructor.
     *
     * @param LorisInstance      $loris         The LORIS instance.
     * @param RedcapHttpClient   $redcap_client The REDCap HTTP client.
     * @param RedcapNotification $redcap_notif  The REDCap notification.
     * @param RedcapConfig       $config        The REDCap module configuration.
     */
    public function __construct(
        LorisInstance $loris,
        RedcapHttpClient $redcap_client,
        RedcapNotification $redcap_notif,
        RedcapConfig $config,
    ) {
        $queries = new RedcapQueries($loris);
        $mapper  = new RedcapMapper($loris, $redcap_client, $config);

        $this->_loris         = $loris;
        $this->_redcap_client = $redcap_client;
        $this->_redcap_notif  = $redcap_notif;
        $this->_config        = $config;
        $this->_mapper        = $mapper;
        $this->_queries       = $queries;
    }

    /**
     * Handle a notification.
     *
     * @throws \LorisException
     *
     * @return void
     */
    public function handle(): void
    {
        // The type checker does not recognize that this variable is always assigned
        // in the code below.
        $records = [];

        try {
            // Acquire LOCK on table to make sure notifications are hanled only once.
            $this->_acquireNotificationLock();

            // get data from redcap
            $records = $this->_redcap_client->getInstrumentRecord(
                $this->_redcap_notif->instrument_name,
                $this->_redcap_notif->unique_event_name,
                $this->_redcap_notif->record_id,
                true,
            );

            $this->_queries->markRedcapNotifAsHandled(
                $this->_redcap_notif->project_id,
                $this->_redcap_notif->record_id,
                $this->_redcap_notif->unique_event_name,
                $this->_redcap_notif->instrument_name,
                $this->_redcap_notif->received_datetime,
                new \DateTimeImmutable(),
            );
        } finally {
            $this->_queries->releaseNotificationLock();
        }

        $candidate_identifier = $this->_mapper->getCandidateIdentifier(
            $this->_redcap_notif->record_id,
            $this->_redcap_notif->instrument_name,
            $this->_redcap_notif->unique_event_name,
        );

        $candidate = $this->_mapper->getCandidateWithIdentifier(
            $candidate_identifier
        );

        $psc_id = $candidate->getPSCID();

        // Track which instruments are updated and not updated.
        $instruments_not_updated = [];

        $record_importer = new RedcapRecordImporter(
            $this->_loris,
            $this->_redcap_client,
            $this->_config,
        );

        // The visit label is populated later using record information.
        $visit_label = null;

        // Import each REDCap record into LORIS.
        foreach ($records as $record) {
            // if repeating instrument, contains the repeat index
            $instrument_name = $record->getLorisInstrumentName();

            if ($record_importer->import($record)) {
                $instruments_not_updated[] = $instrument_name;
            } else {
                $instruments_updated[] = $instrument_name;
            }

            $visit_label = $record_importer->visit_label;
        }

        // all not update = raise error
        if (count($instruments_not_updated) === count($records)) {
            throw new \LorisException(
                "[redcap] [pscid:{$psc_id}][visit:{$visit_label}]"
                . " instrument(s) not updatable."
            );
        }

        // repeating instruments case: some were update, some not
        if (count($instruments_not_updated) > 0) {
            $instruments_error_string = implode(',', $instruments_not_updated);
            throw new \LorisException(
                "[redcap] [pscid:{$psc_id}][visit:{$visit_label}]"
                . " repeating instruments not updated: $instruments_error_string."
            );
        }

        error_log(
            "[redcap] [pscid:{$psc_id}][visit:{$visit_label}] instrument updated."
        );
    }

    /**
     * Lock a notification.
     *
     * @throws \LorisException
     *
     * @return void
     */
    private function _acquireNotificationLock(): void
    {
        $this->_queries->acquireNotificationLock();

        $redcap_notifs = $this->_queries->getUnhandledRedcapNotifs(
            $this->_redcap_notif->received_datetime,
            $this->_redcap_notif->project_id,
            $this->_redcap_notif->record_id,
            $this->_redcap_notif->unique_event_name,
            $this->_redcap_notif->instrument_name,
        );

        if (empty($redcap_notifs)) {
            throw new \LorisException(
                "[redcap] notification already handled or not found."
            );
        }
    }
}
