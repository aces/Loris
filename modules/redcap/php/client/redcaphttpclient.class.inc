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

namespace LORIS\redcap\client;

use LORIS\Http\Client;
use GuzzleHttp\Psr7\Request;

// models
use LORIS\redcap\client\models\RedcapArm;
use LORIS\redcap\client\models\RedcapEvent;
use LORIS\redcap\client\models\RedcapDictionaryRecord;
use LORIS\redcap\client\models\RedcapInstrument;
use LORIS\redcap\client\models\RedcapProject;
use LORIS\redcap\client\models\RedcapSurveyParticipant;
use LORIS\redcap\client\models\mappings\RedcapRepeatingInstrumentEvent;
use LORIS\redcap\client\models\mappings\RedcapInstrumentEventMap;
use LORIS\redcap\client\models\records\IRedcapRecord;
use LORIS\redcap\client\models\records\RedcapRecord;
use LORIS\redcap\client\models\records\RedcapRepeatingRecord;

/**
 * A REDCap Client.
 * Represents a connection to a single REDCap instance and project.
 * A REDCap instance can have multiple projects.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapHttpClient
{
    /**
     * Verbose mode.
     */
    private bool $_verbose;

    /**
     * REDCap URL.
     */
    private string $_url;

    /**
     * REDCap access token.
     */
    private string $_token;

    /**
     * REDCap client.
     */
    private Client $_client;

    /**
     * A cache of all already done calls.
     *
     * @var array
     */
    private array $_cache;

    /**
     * Create a new REDCap Client for a specific REDCap instance and project.
     *
     * @param string $instance_api_url  A REDCap instance API URL.
     * @param string $project_api_token A REDCap project API token.
     * @param bool   $verbose           Verbose mode.
     */
    public function __construct(
        string $instance_api_url,
        string $project_api_token,
        bool $verbose = false
    ) {
        $this->_url     = $instance_api_url;
        $this->_token   = $project_api_token;
        $this->_client  = new Client($instance_api_url);
        $this->_verbose = $verbose;
    }

    /**
     * Check connection.
     *
     * @throws \LorisException
     *
     * @return void
     */
    public function checkConnection()
    {
        try {
            $info = $this->getProjectInfo();
        } catch (\Throwable $th) {
            // mainly curl not able to connect error.
            $msg = "[redcap] connection cannot be established, error: "
                . $th->getMessage();
            throw new \LorisException($msg);
        }
        if (isset($info) && !empty($info)) {
            if ($this->_verbose) {
                $pid = $info->project_id;
                $pti = $info->project_title;
                error_log("[redcap][pid:$pid] Connected to project: $pti");
            }
        } else {
            $msg = "[redcap] Error: connection cannot be established.";
            throw new \LorisException($msg);
        }
    }

    /**
     * Get the project token.
     *
     * @return string
     */
    public function getToken()
    {
        return $this->_token;
    }

    /**
     * Get the instance URL.
     *
     * @return string
     */
    public function getURL()
    {
        return $this->_url;
    }

    /**
     * Get the verbosity.
     *
     * @return bool
     */
    public function getVerbosity()
    {
        return $this->_verbose;
    }

    /**
     * Send a request with data to REDCap.
     *
     * @param array $data the data to send.
     *
     * @return ?string string representation, data results
     */
    private function _sendRequest(array $data): ?string
    {

        // add return json
        $data = array_merge(
            $data,
            [
                'token'        => $this->_token,
                'format'       => 'json',
                'returnFormat' => 'json'
            ]
        );

        // send request
        if ($this->_verbose) {
            // anonymize token
            $dataMsg          = $data;
            $dataMsg['token'] = 'XXXXX';
            $url         = $this->_url;
            $jsonPayload = json_encode($dataMsg);
            error_log(
                "[redcap] Sending request to '$url' with payload: $jsonPayload"
            );
        }

        $response = $this->_client->sendRequest(
            new Request(
                'POST',
                '',
                ['Content-Type' => 'application/x-www-form-urlencoded'],
                http_build_query($data)
            )
        );

        // reading it consumes it.
        $res = $response->getBody()->getContents();

        // error
        $statusCode = $response->getStatusCode();
        if ($statusCode != 200) {
            throw new \LorisException(
                "[redcap] Error $statusCode: cannot fetch record. $res"
            );
        }

        // get content
        return $res;
    }

    /**
     * Update cached data.
     *
     * @param string $cacheType the cache type (key type)
     * @param mixed  $data      data to be cached
     *
     * @return void
     */
    private function _updateCache(string $cacheType, mixed $data): void
    {
        if ($this->_verbose) {
            error_log("[redcap] cached '$cacheType' updated.");
        }
        $this->_cache[$cacheType] = $data;
    }

    /**
     * Get REDCap version.
     *
     * @return string|null REDCap version
     */
    public function getVersion(): ?string
    {
        $data = [
            'content' => 'version'
        ];
        // update cache if first use
        if (empty($this->_cache['version'])) {
            $r = $this->_sendRequest($data);
            $this->_updateCache('version', $r);
        }
        //
        return $this->_cache['version'];
    }

    /**
     * Get project information.
     *
     * @return ?RedcapProject the project information.
     */
    public function getProjectInfo(): ?RedcapProject
    {
        $data = [
            'content' => 'project'
        ];
        // update cache if first use
        if (empty($this->_cache['project'])) {
            $project = json_decode($this->_sendRequest($data), true);
            if ($project === null) {
                return null;
            }

            $this->_updateCache('project', new RedcapProject($project));
        }
        return $this->_cache['project'];
    }

    /**
     * Get all the REDCap arms of the REDCap project.
     *
     * @return RedcapArm[] The REDCap arms.
     */
    public function getArms(): array
    {
        $data = [
            'content' => 'arm'
        ];

        // update cache if first use
        $arms = json_decode($this->_sendRequest($data), true);
        if ($arms === null) {
            return [];
        }

        return array_map(
            fn ($redcap_arm) => new RedcapArm($redcap_arm),
            $arms,
        );
    }

    /**
     * Get events.
     *
     * @return RedcapEvent[] all events.
     */
    public function getEvents(): array
    {
        $data = [
            'content' => 'event'
        ];

        // update cache if first use
        if (empty($this->_cache['event'])) {
            $events = json_decode($this->_sendRequest($data), true);
            if ($events === null) {
                return [];
            }
            $eventData = array_map(fn($e) => new RedcapEvent($e), $events);
            $this->_updateCache('event', $eventData);
        }
        return $this->_cache['event'];
    }

    /**
     * Get the list of instruments with their associated title.
     *
     * @param bool $toMapping get a mapping [instrument name => label] instead.
     *
     * @return RedcapInstrument[] all instruments
     */
    public function getInstruments(bool $toMapping = false): array
    {
        $data = [
            'content' => 'instrument',
        ];
        // update cache if first use
        if (empty($this->_cache['instrument'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if ($instruments === null) {
                return [];
            }
            $instData = array_map(fn($i) => new RedcapInstrument($i), $instruments);
            $this->_updateCache('instrument', $instData);
        }

        // return raw list
        if (!$toMapping) {
            return $this->_cache['instrument'];
        }

        // mapping between instrument backend name and instrument title
        $m = [];
        foreach ($this->_cache['instrument'] as $i) {
            $m[$i->name] = $i->label;
        }
        return $m;
    }

    /**
     * Get repeating instruments and events.
     *
     * @todo will be deprecated since the update in REDCap 14.5.3 not granting
     * people enough privilege to get repeating instrument related information.
     *
     * @return RedcapRepeatingInstrumentEvent[] repeating instruments mapping.
     */
    public function getRepeatingInstrumentsAndEvents(): array
    {
        $data = [
            'content' => 'repeatingFormsEvents'
        ];
        // update cache if first use
        if (empty($this->_cache['repeating_instrument_event'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if ($instruments === null) {
                return [];
            }

            $instData = array_map(
                fn($i) => new RedcapRepeatingInstrumentEvent($i),
                $instruments
            );
            $this->_updateCache('repeating_instrument_event', $instData);
        }
        return $this->_cache['repeating_instrument_event'];
    }

    /**
     * Get mapping between instruments and events.
     *
     * @return RedcapInstrumentEventMap[] instrument-event mapping.
     */
    public function getInstrumentEventMapping(): array
    {
        $data = [
            'content' => 'formEventMapping'
        ];
        // update cache if first use
        if (empty($this->_cache['instrument_event_map'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if ($instruments === null) {
                return [];
            }

            $instData = array_map(
                fn($i) => new RedcapInstrumentEventMap($i),
                $instruments
            );
            $this->_updateCache('instrument_event_map', $instData);
        }
        return $this->_cache['instrument_event_map'];
    }

    /**
     * Get a survey link.
     *
     * Note: this method does not cache data.
     *
     * @param string  $recordId       a record id
     * @param string  $instrument     an instrument/form name
     * @param ?string $event          an event
     * @param ?string $repeatInstance a repeat instance index if any
     *
     * @return ?string a link if found, else null
     */
    public function getSurveyLink(
        string $recordId,
        string $instrument,
        ?string $event,
        ?string $repeatInstance
    ): ?string {
        if (empty($instrument)) {
            throw new \LorisException("[redcap] Error: 'instrument' null or empty.");
        }
        if (empty($recordId)) {
            throw new \LorisException("[redcap] Error: 'recordId' null or empty.");
        }
        $event          = empty($event) ? null : $event;
        $repeatInstance = empty($repeatInstance) ? null : $repeatInstance;

        // check mapping exists
        if (!$this->hasMappingInstrumentEvent($instrument, $event)) {
            throw new \LorisException(
                "[redcap] Error: mapping '$instrument'"
                ."/'$event' does not exist"
            );
        }

        // data to send
        $data = [
            'content'    => 'surveyLink',
            'instrument' => $instrument,
            'event'      => $event,
            'record'     => $recordId,
        ];

        if ($repeatInstance !== null) {
            $data['repeat_instance'] = $repeatInstance;
        }

        // send request
        return $this->_sendRequest($data);
    }

    /**
     * Get survey participants.
     *
     * @param string $instrument_name The REDCap instrument name.
     * @param string $event_name      The REDCap event name.
     *
     * @return RedcapSurveyParticipant[] all events.
     */
    public function getSurveyParticipants(
        string $instrument_name,
        string $event_name,
    ): array {
        $data = [
            'content'    => 'participantList',
            'instrument' => $instrument_name,
            'event'      => $event_name,
        ];

        $participants = json_decode($this->_sendRequest($data), true);
        return array_map(
            fn($participant) => new RedcapSurveyParticipant($participant),
            $participants,
        );
    }

    /**
     * Check if the instrument/event mapping exists.
     *
     * @param string $instrument_name an instrument name
     * @param string $event_name      an event name
     *
     * @return bool true if couple is found, else false
     */
    public function hasMappingInstrumentEvent(
        string $instrument_name,
        string $event_name,
    ): bool {
        $map = $this->getInstrumentEventMapping();
        return $this->_hasMappingElement(
            $map,
            $instrument_name,
            $event_name,
        );
    }

    /**
     * Check if the repeating-instrument/event mapping exists.
     *
     * @param string $instrument_name an repeating instrument name
     * @param string $event_name      an event name
     *
     * @return bool true if couple is found, else false
     */
    public function hasRepeatingInstrumentEvent(
        string $instrument_name,
        string $event_name,
    ): bool {
        $map = $this->getRepeatingInstrumentsAndEvents();
        return $this->_hasMappingElement(
            $map,
            $instrument_name,
            $event_name,
        );
    }

    /**
     * Check if the instrument/event mapping exists in an arbitrary mapping array.
     *
     * @param array  $instrument_event_mappings a mapping array
     * @param string $instrument_name           an instrument name
     * @param string $event_name                an event name
     *
     * @return bool true if couple is found in the array, else false
     */
    private function _hasMappingElement(
        array &$instrument_event_mappings,
        string $instrument_name,
        string $event_name
    ): bool {
        return array_any(
            $instrument_event_mappings,
            fn($mapping) => (
                $mapping->getEventName() === $event_name
                    && $mapping->getFormName() === $instrument_name
            )
        );
    }

    /**
     * Get a survey queue link.
     *
     * Note: this method does not cache data.
     *
     * @param string $recordId a record ID
     *
     * @return ?string a link if found, else null
     */
    public function getSurveyQueueLink(string $recordId)
    {
        if (empty($recordId)) {
            throw new \LorisException("[redcap] Error: 'recordId' null or empty.");
        }

        $data = [
            'content' => 'surveyQueueLink',
            'record'  => $recordId
        ];

        return $this->_sendRequest($data);
    }

    /**
     * Get the data dictionary (all records), or only the records for specified
     * instruments.
     *
     * @param array $givenInstruments an array of instruments to select
     * @param bool  $trimFormName     if true, returns as a stream
     *
     * @return RedcapDictionaryRecord[] selected data dictionary records.
     */
    public function getDataDictionary(
        array $givenInstruments = [],
        bool $trimFormName = false
    ): array {
        $data = [
            'content' => 'metadata'
        ];

        // before anything, check the full DD before any call, update cache
        if (empty($this->_cache['dictionary'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if ($instruments === null) {
                return [];
            }
            $badMap   = 0;
            $mapped   = 0;
            $instData = [];
            foreach ($instruments as $instrument) {
                try {
                    $dd = new RedcapDictionaryRecord($instrument, $trimFormName);
                    $mapped++;
                } catch (\LorisException $le) {
                    fprintf(STDERR, $le->getMessage() . "\n");
                    $dd = new RedcapDictionaryRecord($instrument, false);
                    $badMap++;
                }
                $instData[] = $dd;
            }

            // bad map
            if ($trimFormName) {
                fwrite(
                    STDERR,
                    "\nCould not map $badMap fields\nMapped $mapped fields\n"
                );
            }

            $this->_updateCache('dictionary', $instData);
        }

        // full dictionary
        if (empty($givenInstruments)) {
            return $this->_cache['dictionary'];
        }

        // select only non null values, check they are existing instruments
        $allInstruments = array_map(
            fn($v) => $v->name,
            $this->getInstruments()
        );
        foreach (array_filter($givenInstruments) as $instrument) {
            if (!in_array($instrument, $allInstruments, true)) {
                throw new \LorisException(
                    "[redcap] Error: unknown instrument '$instrument'."
                );
            }
        }

        // only return selected instruments if specified
        return array_filter(
            $this->_cache['dictionary'],
            fn($d) => in_array(
                $d->getFormName(),
                $givenInstruments,
                true
            )
        );
    }

    /**
     * Get all records for an single instrument.
     *
     * @param string $instrument           an instrument name
     * @param string $event                an event name
     * @param string $recordId             a record ID
     * @param bool   $completedRecordsOnly only consider complete records?
     *
     * @throws \LorisException
     *
     * @return IRedcapRecord[] an array of records
     */
    public function getInstrumentRecord(
        string $instrument,
        string $event,
        string $recordId,
        bool $completedRecordsOnly = true
    ): array {
        if (empty($instrument)) {
            throw new \LorisException("[redcap] Error: required 'instrument'.");
        }
        if (empty($event)) {
            throw new \LorisException("[redcap] Error: required 'event'.");
        }
        if (empty($recordId)) {
            throw new \LorisException("[redcap] Error: required 'recordId'.");
        }

        // mapping check
        if (!$this->hasMappingInstrumentEvent($instrument, $event)) {
            throw new \LorisException(
                "[redcap] Error: mapping '$instrument'/"
                . "'$event' does not exist in REDCap"
            );
        }

        // request
        $r = $this->_getRecords(
            [$instrument],
            [$event],
            [$recordId]
        );

        if (empty($r)) {
            throw new \LorisException("[redcap] Error: no data found.");
        }

        // Only keep complete records
        if ($completedRecordsOnly) {
            $completed = array_filter(
                $r,
                function ($record) use ($instrument) {
                    return $record["{$instrument}_complete"] == 2;
                }
            );

            if (count($completed) === 0) {
                throw new \LorisException(
                    "[redcap] Error: no complete record found."
                );
            }
        } else {
            // if not only completed records
            $completed = $r;
        }

        // Order the records by ${instrument_name}_dtt field value
        usort(
            $completed,
            function ($a, $b) use ($instrument) {
                $dttField = "{$instrument}_dtt";
                $a_date   = new \DateTimeImmutable($a[$dttField]);
                $b_date   = new \DateTimeImmutable($b[$dttField]);
                return $a_date <=> $b_date;
            }
        );

        // is a repeating instrument?
        $final = [];
        if ($this->getProjectInfo()->has_repeating_instruments
            && $this->hasRepeatingInstrumentEvent($instrument, $event)
        ) {
            foreach ($completed as $index => $record) {
                $final[] = new RedcapRepeatingRecord(
                    $instrument,
                    $record,
                    $index + 1
                );
            }
        } else {
            // return the only record
            $final[] = new RedcapRecord($instrument, $completed[0]);
        }
        return $final;
    }

    /**
     * Get records from REDCap.
     * Cannot return all values. At least one of the three parameters needs to
     * be filled with one value, else an exception will be generated.
     *
     * @param array $instruments instrument names
     * @param array $events      event names
     * @param array $records     records IDs
     *
     * @return array an array of records (array of [field name => field values])
     */
    private function _getRecords(
        array $instruments = [],
        array $events = [],
        array $records = []
    ): array {
        // security, do not get all records
        if (empty($instruments) && empty($events) && empty($records)) {
            throw new \LorisException(
                "[redcap] Error: get all recrods forbidden without arguments."
            );
        }

        // data to send
        $data = [
            'content'                => 'record',
            'action'                 => 'export',
            'type'                   => 'flat',
            'csvDelimiter'           => '',
            'forms'                  => $instruments,
            'fields'                 => [],
            'events'                 => $events,
            'records'                => $records,
            'rawOrLabel'             => 'raw',
            'rawOrLabelHeaders'      => 'raw',
            'exportCheckboxLabel'    => true,
            'exportSurveyFields'     => true,
            'exportDataAccessGroups' => true,
        ];

        // send request
        return json_decode($this->_sendRequest($data), true);
    }
}
