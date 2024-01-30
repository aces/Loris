<?php declare(strict_types=1);

use \LORIS\LorisInstance;
use \GuzzleHttp\Client;
use \LORIS\Http\Request;

class RedcapHttpClient
{
    private Client $_client;
    private string $_token;

    public function __construct(LorisInstance $loris)
    {
        $settings = $loris->getConfiguration()->getSetting('REDCap');

        $this->_token  = $settings['token'];
        $this->_client = new Client(
            ['base_uri' => $settings['url'] ?? '']
        );
    }

    /**
     * Returns a list of records from REDCap.
     *
     * @param ?string $pscid          The participant id
     * @param ?string $visit_label    The visit label
     * @param ?string $instrument     The instrument name
     * @param bool    $label          Indicates labels should be exported for options of
     *                                multiple choice fields, instead of raw coded values
     * @param ?string $dateRangeBegin Date string 'YYYY-MM-DD HH:MM:SS' after which REDCap records were
     *                                created or modified
     * @param ?string $dateRangeEnd   Date string 'YYYY-MM-DD HH:MM:SS' before which REDCap records were
     *                                created or modified
     *
     * @return array
     */
    private function _exportRecords(
        ?string $pscid = null,
        ?string $visit_label = null,
        ?string $instrument = null,
        bool    $label = false,
        ?string $dateRangeBegin = null,
        ?string $dateRangeEnd = null
    ): array {

        $rawOrLabel = $label ? 'label' : 'raw';

        $data = [
            'token'                  => $this->_token,
            'content'                => 'record',
            'action'                 => 'export',
            'format'                 => 'json',
            'type'                   => 'flat',
            'csvDelimiter'           => '',
            'records'                => [],
            'fields'                 => [],
            'forms'                  => [],
            'events'                 => [],
            'rawOrLabel'             => $rawOrLabel,
            'rawOrLabelHeaders'      => 'raw',
            'exportCheckboxLabel'    => 'true',
            'exportSurveyFields'     => 'true',
            'exportDataAccessGroups' => 'true',
            'returnFormat'           => 'json'
        ];

        if ($pscid !== null) {
            $data['records'] = [$pscid];
        }

        if ($visit_label !== null) {
            $data['events'] = [$visit_label];
        }

        if ($instrument !== null) {
            $data['forms'] = [$instrument];
        }

        if ($dateRangeBegin !== null) {
            $data['dateRangeBegin'] = $dateRangeBegin;
        }

        if ($dateRangeEnd !== null) {
            $data['dateRangeEnd'] = $dateRangeEnd;
        }

        $response = $this->_client->request(
            'POST',
            '/api/',
            [
                'form_params' => $data,
                'debug'       => false
            ]
        );

        $record = json_decode((string) $response->getBody(), true);

        if ($response->getStatusCode() != 200) {
            throw new \Exception('Cannot export record');
        }

        if (count($record) < 1) {
            throw new \Exception('No record found');
        }

        return $record;
    }

    /**
     * Returns a report from REDCap.
     *
     * @param int  $reportId The report id
     * @param bool $label    Indicates labels should be exported for options of
     *                       multiple choice fields, instead of raw coded values
     *
     * @return array
     */
    private function _exportReport(
        int  $reportId,
        bool $label = false,
    ): array {

        $rawOrLabel = $label ? 'label' : 'raw';

        $data = [
            'token'               => $this->_token,
            'content'             => 'report',
            'format'              => 'json',
            'report_id'           => $reportId,
            'csvDelimiter'        => '',
            'rawOrLabel'          => $rawOrLabel,
            'rawOrLabelHeaders'   => 'raw',
            'exportCheckboxLabel' => 'false',
            'returnFormat'        => 'json'
        ];

        $response = $this->_client->request(
            'POST',
            '/api/',
            [
                'form_params' => $data,
                'debug'       => false
            ]
        );

        $report = json_decode((string) $response->getBody(), true);

        if ($response->getStatusCode() != 200) {
            throw new \Exception('Cannot export report');
        }

        if (count($report) < 1) {
            throw new \Exception('No report found');
        }

        return $report;
    }

    /**
     * Returns a list of events from REDCap.
     *
     * @return array
     */
    private function _exportEvents(): array
    {
        $data = [
            'token'        => $this->_token,
            'content'      => 'event',
            'format'       => 'json',
            'returnFormat' => 'json'
        ];

        $response = $this->_client->request(
            'POST',
            '/api/',
            [
                'form_params' => $data,
                'debug'       => false
            ]
        );

        $events = json_decode((string) $response->getBody(), true);

        if ($response->getStatusCode() != 200) {
            throw new \Exception('Cannot export record');
        }

        if (count($events) < 1) {
            throw new \Exception('No event found');
        }

        return $events;
    }
}
