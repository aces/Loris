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
     * REDCap API URL.
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
     * @param string $instance_url      A REDCap instance URL.
     * @param string $project_api_token A REDCap project API token.
     * @param bool   $verbose           Verbose mode.
     */
    public function __construct(
        string $instance_url,
        string $project_api_token,
        bool $verbose = false
    ) {
        $trimmed_url    = rtrim($instance_url, '/');
        $api_url        = "{$trimmed_url}/api/";
        $this->_url     = $api_url;
        $this->_token   = $project_api_token;
        $this->_client  = new Client($api_url);
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
     * @param string  $instrument_name   A REDCap instrument name.
     * @param ?string $unique_event_name A REDCap unique event name, if any.
     * @param string  $record_id         A REDCap record ID.
     * @param ?string $repeat_instance   A repeat instance index, if any.
     *
     * @return ?string The corresponding REDCap survery link if found, else null.
     */
    public function getSurveyLink(
        string $instrument_name,
        ?string $unique_event_name,
        string $record_id,
        ?string $repeat_instance
    ): ?string {
        if (empty($instrument_name)) {
            throw new \LorisException("[redcap] Error: 'instrument' null or empty.");
        }

        if (empty($record_id)) {
            throw new \LorisException("[redcap] Error: 'record_id' null or empty.");
        }

        $unique_event_name = empty($unique_event_name) ? null : $unique_event_name;
        $repeat_instance   = empty($repeat_instance) ? null : $repeat_instance;

        // check mapping exists
        $mapping_instrument_event_exists = $this->hasMappingInstrumentEvent(
            $instrument_name,
            $unique_event_name
        );

        if (!$mapping_instrument_event_exists) {
            throw new \LorisException(
                "[redcap] Error: mapping '$instrument_name'"
                ."/'$unique_event_name' does not exist"
            );
        }

        // data to send
        $data = [
            'content'    => 'surveyLink',
            'instrument' => $instrument_name,
            'event'      => $unique_event_name,
            'record'     => $record_id,
        ];

        if ($repeat_instance !== null) {
            $data['repeat_instance'] = $repeat_instance;
        }

        // send request
        return $this->_sendRequest($data);
    }

    /**
     * Get survey participants.
     *
     * @param string $instrument_name   The REDCap instrument name.
     * @param string $unique_event_name The REDCap unique event name.
     *
     * @return RedcapSurveyParticipant[] all events.
     */
    public function getSurveyParticipants(
        string $instrument_name,
        string $unique_event_name,
    ): array {
        $data = [
            'content'    => 'participantList',
            'instrument' => $instrument_name,
            'event'      => $unique_event_name,
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
     * @param string $instrument_name   A REDCap instrument name.
     * @param string $unique_event_name A REDCap unique event name.
     *
     * @return bool true if couple is found, else false
     */
    public function hasMappingInstrumentEvent(
        string $instrument_name,
        string $unique_event_name,
    ): bool {
        $map = $this->getInstrumentEventMapping();
        return $this->_hasMappingElement(
            $map,
            $instrument_name,
            $unique_event_name,
        );
    }

    /**
     * Check if the repeating-instrument/event mapping exists.
     *
     * @param string $instrument_name   A REDCap repeating instrument name.
     * @param string $unique_event_name A REDCap unique event name.
     *
     * @return bool true if couple is found, else false
     */
    public function hasRepeatingInstrumentEvent(
        string $instrument_name,
        string $unique_event_name,
    ): bool {
        $map = $this->getRepeatingInstrumentsAndEvents();
        return $this->_hasMappingElement(
            $map,
            $instrument_name,
            $unique_event_name,
        );
    }

    /**
     * Check if the instrument/event mapping exists in an arbitrary mapping array.
     *
     * @param array  $instrument_event_mappings A mapping array.
     * @param string $instrument_name           A REDCap instrument name.
     * @param string $unique_event_name         A REDCap unique event name.
     *
     * @return bool true if couple is found in the array, else false
     */
    private function _hasMappingElement(
        array &$instrument_event_mappings,
        string $instrument_name,
        string $unique_event_name,
    ): bool {
        return array_any(
            $instrument_event_mappings,
            fn($mapping) => (
                $mapping->getUniqueEventName() === $unique_event_name
                    && $mapping->getFormName() === $instrument_name
            )
        );
    }

    /**
     * Get a survey queue link.
     *
     * Note: this method does not cache data.
     *
     * @param string $record_id a record ID
     *
     * @return ?string a link if found, else null
     */
    public function getSurveyQueueLink(string $record_id)
    {
        if (empty($record_id)) {
            throw new \LorisException("[redcap] Error: 'record_id' null or empty.");
        }

        $data = [
            'content' => 'surveyQueueLink',
            'record'  => $record_id
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
                $d->form_name,
                $givenInstruments,
                true
            )
        );
    }

    /**
     * Get all records for an single instrument.
     *
     * @param string  $instrument_name        A REDCap instrument name.
     * @param string  $unique_event_name      A REDCap unique event name.
     * @param ?string $record_id              A REDCap record ID.
     * @param bool    $completed_records_only Only return completed records.
     *
     * @throws \LorisException
     *
     * @return RedcapRecord[] an array of records
     */
    public function getInstrumentRecords(
        string  $instrument_name,
        string  $unique_event_name,
        ?string $record_id,
        bool $completed_records_only = true
    ): array {
        if (empty($instrument_name)) {
            throw new \LorisException(
                "[redcap] Error: required 'instrument_name'."
            );
        }

        if (empty($unique_event_name)) {
            throw new \LorisException(
                "[redcap] Error: required 'unique_event_name'."
            );
        }

        // mapping check
        $mapping_instrument_event_exists = $this->hasMappingInstrumentEvent(
            $instrument_name,
            $unique_event_name,
        );

        if (!$mapping_instrument_event_exists) {
            throw new \LorisException(
                "[redcap] Error: mapping '$instrument_name'/"
                . "'$unique_event_name' does not exist in REDCap"
            );
        }

        // request
        $record_dicts = $this->_getRecords(
            [$instrument_name],
            [$unique_event_name],
            $record_id !== null ? [$record_id] : [],
        );

        if (empty($record_dicts)) {
            throw new \LorisException("[redcap] Error: no data found.");
        }

        // Only keep complete records
        if ($completed_records_only) {
            $record_dicts = array_filter(
                $record_dicts,
                fn ($record) => $record["{$instrument_name}_complete"] == 2
            );

            if (empty($record_dicts)) {
                throw new \LorisException(
                    "[redcap] Error: no complete record found."
                );
            }
        }

        $records = [];

        // is a repeating instrument?
        if ($this->getProjectInfo()->has_repeating_instruments
            && $this->hasRepeatingInstrumentEvent(
                $instrument_name,
                $unique_event_name
            )
        ) {
            // TODO: ${instrument_name}_dtt seems to be HBCD-specific. The code
            // could probably be cleaner with a single timestamp abstraction. The
            // problem is that the repeating index depends on the order in which the
            // records were filled. However, this index might also be obtainable
            // from a field in the record. Investigation needed.
            // Order the records by ${instrument_name}_dtt field value
            usort(
                $record_dicts,
                function ($a, $b) use ($instrument_name) {
                    $dttField = "{$instrument_name}_dtt";
                    $a_date   = new \DateTimeImmutable($a[$dttField]);
                    $b_date   = new \DateTimeImmutable($b[$dttField]);
                    return $a_date <=> $b_date;
                }
            );

            foreach ($record_dicts as $index => $record) {
                $records[] = new RedcapRepeatingRecord(
                    $instrument_name,
                    $record,
                    $index + 1
                );
            }
        } else {
            // Transform the record dictionaries into record objects.
            $records = array_map(
                fn ($record_dict) => new RedcapRecord(
                    $instrument_name,
                    $record_dict,
                ),
                $record_dicts,
            );

            // Sort the records by datetime.
            usort(
                $records,
                function ($a, $b) {
                    // If both records have a datetime, compare them.
                    if ($a->datetime !== null && $b->datetime !== null) {
                        return $a->datetime <=> $b->datetime;
                    }

                    // If only record $a has datetime, it comes first.
                    if ($a->datetime !== null) {
                        return -1;
                    }

                    // If only record $b has datetime, it comes first.
                    if ($b->datetime !== null) {
                        return 1;
                    }

                    // If both records have no datetime, maintain the original order.
                    return 0;
                },
            );
        }

        return $records;
    }

    /**
     * Get records from REDCap.
     * Cannot return all values. At least one of the three parameters needs to
     * be filled with one value, else an exception will be generated.
     *
     * @param array $instrument_names   A list of REDCap instrument names.
     * @param array $unique_event_names A list of REDCap unique event names.
     * @param array $record_ids         A list of REDCap records IDs.
     *
     * @return array an array of records (array of [field name => field values])
     */
    private function _getRecords(
        array $instrument_names = [],
        array $unique_event_names = [],
        array $record_ids = []
    ): array {
        // security, do not get all records
        if (empty($instrument_names)
            && empty($unique_event_names)
            && empty($record_ids)
        ) {
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
            'forms'                  => $instrument_names,
            // The 'record_id' parameter adds both the 'record_id' and
            // 'redcap_event_name' fields to the REDCap records.
            'fields'                 => ['record_id'],
            'events'                 => $unique_event_names,
            'records'                => $record_ids,
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
