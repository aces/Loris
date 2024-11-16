<?php declare(strict_types=1);
/**
 * PHP Version 8
 *
 *  @category REDCap
 *  @package  Main
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

use LORIS\Http\Client;
use GuzzleHttp\Psr7\Request;

// models
use LORIS\redcap\models\RedcapProject;
use LORIS\redcap\models\RedcapArm;
use LORIS\redcap\models\RedcapEvent;
use LORIS\redcap\models\RedcapDictionaryRecord;
use LORIS\redcap\models\RedcapInstrument;
use LORIS\redcap\models\mappings\RedcapRepeatingInstrumentEvent;
use LORIS\redcap\models\mappings\RedcapInstrumentEventMap;
use LORIS\redcap\models\records\IRedcapRecord;
use LORIS\redcap\models\records\RedcapRecord;
use LORIS\redcap\models\records\RedcapRepeatingRecord;

/**
 * A REDCap Client.
 * Represents a connection to a single REDCap instance and project.
 * A REDCap instance can have multiple projects.
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class REDCapHTTPClient
{
    /**
     * A LORIS instance.
     */
    private \LORIS\LorisInstance $_loris;

    /**
     * Verbose mode.
     */
    private bool $_verbose;

    /**
     * REDCap URL.
     */
    private string $_url;

    /**
     * REDCap projectID.
     */
    private string $_projectId;

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
     * Create a new REDCap Client for a sepcific REDCap instance and project ID.
     *
     * @param \LORIS\LorisInstance $loris
     * @param string               $instanceName
     * @param string               $projectID
     * @param bool                 $verbose
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        string $instanceAPIURL,
        string $projectId,
        string $projectToken,
        bool $verbose = false
    ) {
        $this->_loris     = $loris;
        $this->_verbose   = $verbose;
        $this->_url       = $instanceAPIURL;
        $this->_projectId = $projectId;
        $this->_token     = $projectToken;
        $this->_client    = new Client($instanceAPIURL);
    }

    /**
     * Check connection.
     *
     * @throws \LorisException
     *
     * @return void
     */
    public function checkConnection() {
        try {
            $info = $this->getProjectInfo();
        } catch (\Throwable $th) {
            // mainly curl not able to connect error.
            $msg = "[redcap] connection cannot be established, error: " . $th->getMessage();
            throw new \LorisException($msg);
        }
        if (isset($info) && !empty($info)) {
            if ($this->_verbose) {
                $pid = $info->getProjectId();
                $pti = $info->getProjectTitle();
                error_log("[redcap][pid:$pid] Connected to project: $pti");
            }
        } else {
            $msg = "[redcap] Error: connection cannot be established.";
            throw new \LorisException($msg);
        }
    }

    public function getToken() {
        return $this->_token;
    }

    public function getURL() {
        return $this->_url;
    }

    public function getVerbosity() {
        return $this->_verbose;
    }

    /**
     * Send a request with data to REDCap.
     *
     * @param array $data the data to send.
     *
     * @return string string representation, data results
     */
    private function _sendRequest(array $data): ?string {

        // add return json
        $data = array_merge($data, [
            'token'        => $this->_token,
            'format'       => 'json',
            'returnFormat' => 'json'
        ]);

        // send request
        if ($this->_verbose) {
            // anonymize token
            $dataMsg = $data;
            $dataMsg['token'] = 'XXXXX';
            $url = $this->_url;
            $jsonPayload = json_encode($dataMsg);
            error_log("[redcap] Sending request to '$url' with payload: $jsonPayload");
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
        if($statusCode != 200) {
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
     * @param mixed $data       data to be cached
     *
     * @return void
     */
    private function _updateCache(string $cacheType, mixed $data): void {
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
    public function getVersion(): ?string {
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
    public function getProjectInfo(): ?RedcapProject {
        $data = [
            'content' => 'project'
        ];
        // update cache if first use
        if (empty($this->_cache['project'])) {
            $project = json_decode($this->_sendRequest($data), true);
            if (is_null($project)) {
                return null;
            }
            $this->_updateCache('project', new RedcapProject($project));
        }
        return $this->_cache['project'];
    }

    /**
     * Get arms.
     *
     * @return RedcapArm[] all arms.
     */
    public function getArms(): array {
        $data = [
            'content' => 'arm'
        ];
        // update cache if first use
        if (empty($this->_cache['arm'])) {
            $arms     = json_decode($this->_sendRequest($data), true);
            if (is_null($arms)) {
                return [];
            }
            $armsData = array_map(fn($e) => new RedcapArm($e), $arms);
            $this->_updateCache('arm', $armsData);
        }
        return $this->_cache['arm'];
    }

    /**
     * Get events.
     *
     * @return RedcapEvent[] all events.
     */
    public function getEvents(): array {
        $data = [
            'content' => 'event'
        ];
        // update cache if first use
        if (empty($this->_cache['event'])) {
            $events    = json_decode($this->_sendRequest($data), true);
            if (is_null($events)) {
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
     * @return RedcapInstrument[] all instruments
     */
    public function getInstruments(): array {
        $data = [
            'content' => 'instrument',
        ];
        // update cache if first use
        if (empty($this->_cache['instrument'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if (is_null($instruments)) {
                return [];
            }
            $instData    = array_map(fn($i) => new RedcapInstrument($i), $instruments);
            $this->_updateCache('instrument', $instData);
        }
        return $this->_cache['instrument'];
    }

    /**
     * Get repeating instruments and events.
     *
     * @todo will be deprecated since the update in REDCap 14.5.3 not granting
     * people enough privilege to get repeating instrument related information.
     *
     * @return RedcapRepeatingInstrumentEvent[] repeating instruments mapping.
     */
    public function getRepeatingInstrumentsAndEvents(): array {
        $data = [
            'content' => 'repeatingFormsEvents'
        ];
        // update cache if first use
        if (empty($this->_cache['repeating_instrument_event'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if (is_null($instruments)) {
                return [];
            }
            $instData    = array_map(fn($i) => new RedcapRepeatingInstrumentEvent($i), $instruments);
            $this->_updateCache('repeating_instrument_event', $instData);
        }
        return $this->_cache['repeating_instrument_event'];
    }

    /**
     * Get mapping between instruments and events.
     *
     * @return RedcapInstrumentEventMap[] instrument-event mapping.
     */
    public function getInstrumentEventMapping(): array {
        $data = [
            'content' => 'formEventMapping'
        ];
        // update cache if first use
        if (empty($this->_cache['instrument_event_map'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if (is_null($instruments)) {
                return [];
            }
            $instData    = array_map(fn($i) => new RedcapInstrumentEventMap($i), $instruments);
            $this->_updateCache('instrument_event_map', $instData);
        }
        return $this->_cache['instrument_event_map'];
    }

    /**
     * Get a survey link.
     *
     * Note: this method does not cache data.
     *
     * @param string $instrument an instrument/form name
     * @param string $event      an event
     * @param string $recordId   a record id
     *
     * @return ?string a link if found, else null
     */
    public function getSurveyLink(
        string $recordId,
        string $instrument,
        ?string $event,
        ?string $repeatInstance
    ): ?string  {
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
            throw new \LorisException("[redcap] Error: mapping '$instrument'/'$event' does not exist");
        }

        // data to send
        $data = [
            'content'    => 'surveyLink',
            'instrument' => $instrument,
            'event'      => $event,
            'record'     => $recordId,
        ];

        // send request
        return $this->_sendRequest($data);
    }

    /**
     * Check if the instrument/event mapping exists.
     *
     * @param string $instrument an instrument name
     * @param string $event      an event name
     *
     * @return bool true if couple is found, else false
     */
    public function hasMappingInstrumentEvent(string $instrument, string $event): bool {
        $map = $this->getInstrumentEventMapping();
        return $this->_hasMappingElement(
            $map,
            $instrument,
            $event
        );
    }

    /**
     * Check if the repeating-instrument/event mapping exists.
     *
     * @param string $instrument an repeating instrument name
     * @param string $event      an event name
     *
     * @return bool true if couple is found, else false
     */
    public function hasRepeatingInstrumentEvent(string $instrument, string $event): bool {
        $map = $this->getRepeatingInstrumentsAndEvents();
        return $this->_hasMappingElement(
            $map,
            $instrument,
            $event
        );
    }

    /**
     * Check if the instrument/event mapping exists in an arbitrary mapping array.
     *
     * @param array  $instrumentEventMapping a mapping array
     * @param string $instrument             an instrument name
     * @param string $event                  an event name
     *
     * @return bool true if couple is found in the array, else false
     */
    private function _hasMappingElement(
        array &$instrumentEventMapping,
        string $instrument,
        string $event
    ): bool {
        $found = false;
        foreach ($instrumentEventMapping as $mapping) {
            if ($mapping->getEventName() === $event
                && $mapping->getFormName() === $instrument
            ) {
                $found = true;
                break;
            }
        }
        return $found;
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
    public function getSurveyQueueLink(string $recordId) {
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
     *
     * @return RedcapDictionaryRecord[] selected data dictionary records.
     */
    public function getDataDictionary(array $givenInstruments = []): array {
        $data = [
            'content' => 'metadata'
        ];

        // before anything, check the full DD before any call, update cache
        if (empty($this->_cache['dictionary'])) {
            $instruments = json_decode($this->_sendRequest($data), true);
            if (is_null($instruments)) {
                return [];
            }
            $instData    = array_map(fn($i) => new RedcapDictionaryRecord($i), $instruments);
            $this->_updateCache('dictionary', $instData);
        }

        // full dictionary
        if (empty($givenInstruments)) {
            return $this->_cache['dictionary'];
        }

        // select only non null values, check they are existing instruments
        $allInstruments = array_map(fn($v) => $v->getInstrumentName(), $this->getInstruments());
        foreach (array_filter($givenInstruments) as $instrument) {
            if (!in_array($instrument, $allInstruments, true)) {
                throw new \LorisException("[redcap] Error: unknown instrument '$instrument'.");
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
     * @param string $instrument an instrument name
     * @param string $event      an event name
     * @param string $recordId   a record ID
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
            throw new \LorisException("[redcap] Error: mapping '$instrument'/'$event' does not exist in REDCap");
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
            $completed = array_filter($r, function ($record) use ($instrument) {
                return $record[$instrument . "_complete"] == 2;
            });

            if (count($completed) < 1) {
                throw new \LorisException("[redcap] Error: no complete record found.");
            }
        } else {
            // if not only completed records
            $completed = $r;
        }

        // Order the records by ${instrument_name}_dtt field value
        usort($completed, function($a, $b) use ($instrument) {
            $dttField = $instrument . "_dtt";
            $a_date = new \DateTimeImmutable($a[$dttField]);
            $b_date = new \DateTimeImmutable($b[$dttField]);
            return $a_date <=> $b_date;
        });

        // is a repeating instrument?
        $final = [];
        if ($this->getProjectInfo()->hasRepeatingInstrumentsOrEvents()
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
            $final[] = new RedcapRecord($instrument , $completed[0]);
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
     * @return array an array of records (array of array (field name => field values)).
     */
    private function _getRecords(
        array $instruments = [],
        array $events = [],
        array $records = []
    ): array {
        // security, do not get all records
        if (empty($instruments) && empty($events) && empty($records)) {
            throw new \LorisException("[redcap] Error: get all recrods forbidden without arguments.");
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