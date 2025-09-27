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

namespace LORIS\redcap\config;

use LORIS\redcap\config\RedcapConfig;
use LORIS\redcap\config\RedcapConfigLorisId;
use LORIS\redcap\config\RedcapConfigRedcapId;
use LORIS\redcap\config\RedcapConfigVisit;

/**
 * This represents a REDCap configuration parser.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfigParser
{
    /**
     * The LORIS instance.
     *
     * @var \LORIS\LorisInstance
     */
    private \LORIS\LorisInstance $_loris;

    /**
     * The REDCap instance URL.
     *
     * @var string
     */
    private string $_redcap_instance_url;

    /**
     * The REDCap project ID.
     *
     * @var string
     */
    private string $_redcap_project_id;

    /**
     * Constructor.
     *
     * @param \LORIS\LorisInstance $loris               A loris instance
     * @param string               $redcap_instance_url A REDCap instance URL.
     * @param string               $redcap_project_id   A REDCap project ID.
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        string $redcap_instance_url,
        string $redcap_project_id,
    ) {
        $this->_loris = $loris;
        $this->_redcap_instance_url = $redcap_instance_url;
        $this->_redcap_project_id   = $redcap_project_id;
    }

    /**
     * Get the REDCap configuration for that matches the parser parameters.
     *
     * @return ?RedcapConfig The REDCap configuration, or `NULL` if no configuration
     *                       matches the parser parameters.
     */
    public function parse(): ?RedcapConfig
    {
        // Get the LORIS configuration
        $config = $this->_loris->getConfiguration();

        // Get the REDCap LORIS configuration tree
        $redcap_node = $config->getSetting('redcap');
        if (empty($redcap_node)) {
            throw $this->_exception("no REDCap configuration.");
        }

        return $this->_parseRedcapNode($redcap_node);
    }

    /**
     * Parse a REDCap XML configuration node.
     *
     * @param array $redcap_node The REDCap configuration XML node.
     *
     * @return ?RedcapConfig The REDCap configuration, or `NULL` if no configuration
     *                       matches the parser parameters.
     */
    private function _parseRedcapNode(array $redcap_node): ?RedcapConfig
    {
        $instance_node = $this->_getInstanceNode($redcap_node);
        if ($instance_node === null) {
            throw $this->_exception(
                "no REDCap instance in configuration for the provided parameters'."
            );
        }

        $project_node = $this->_getProjectNode($instance_node);
        if ($project_node === null) {
            throw $this->_exception(
                "no REDCap project in configuration for the provided parameters."
            );
        }

        $redcap_api_token           = $this->_parseRedcapApiToken($project_node);
        $prefix_instrument_variable = $this->_parsePrefixInstrumentVariable(
            $project_node
        );
        $redcap_participant_id      = $this->_parseRedcapParticipantId(
            $project_node
        );
        $candidate_id = $this->_parseCandidateId($project_node);
        $visits       = $this->_parseVisits($project_node);

        return new RedcapConfig(
            $this->_redcap_project_id,
            $this->_redcap_instance_url,
            $redcap_api_token,
            $prefix_instrument_variable,
            $redcap_participant_id,
            $candidate_id,
            $visits,
        );
    }

    /**
     * Parse the REDCap configuration instance XML node from a REDCap configuration
     * XML node.
     *
     * @param array $redcap_node The REDCap configuration XML node.
     *
     * @return ?array The REDCap configuration instance XML node, or `NULL` if no
     *                REDCap configuration instance matches the parser parameters.
     */
    private function _getInstanceNode(array $redcap_node): ?array
    {
        $instance_entry = $redcap_node['instance'] ?? null;

        // No instance described.
        if (empty($instance_entry)) {
            throw $this->_exception(
                "no REDCap instance in configuration, missing node 'instance'."
            );
        }

        if (array_key_exists(0, $instance_entry)) {
            // Multiple instances.
            $instance_nodes = $instance_entry;
        } else {
            // Single instance.
            $instance_nodes = [$instance_entry];
        }

        return array_find(
            $instance_nodes,
            fn($instance_node) => (
                $instance_node['redcap-url'] === $this->_redcap_instance_url
            ),
        );
    }

    /**
     * Parse the REDCap configuration project XML node from a REDCap configuration
     * instance XML node.
     *
     * @param array $instance_node The REDCap configuration instance XML node.
     *
     * @return ?array The REDCap configuration project XML node, or `NULL` if no
     *                REDCap configuration project matches the parser parameters.
     */
    private function _getProjectNode(array $instance_node): ?array
    {
        $project_entry = $instance_node['project'] ?? null;

        if (empty($project_entry)) {
            throw $this->_exception(
                "no REDCap project in configuration instance, missing node"
                . " 'project'."
            );
        }

        if (array_key_exists(0, $project_entry)) {
            // Multiple projects.
            $project_nodes = $project_entry;
        } else {
            // Single project.
            $project_nodes = [$project_entry];
        }

        return array_find(
            $project_nodes,
            fn($project_node) => (
                $project_node['redcap-project-id'] === $this->_redcap_project_id
            ),
        );
    }

    /**
     * Parse the REDCap API token from a REDCap configuration project XML node.
     *
     * @param array $project_node The REDCap configuration project XML node.
     *
     * @return string The REDCap API token.
     */
    private function _parseRedcapApiToken(array $project_node): string
    {
        $redcap_api_token = $project_node['redcap-api-token'] ?? null;

        if (empty($redcap_api_token)) {
            throw new \LorisException(
                "no REDCap API token in configuration for the selected project,"
                . " missing node 'redcap-api-token'."
            );
        }

        return $redcap_api_token;
    }

    /**
     * Parse whether the REDCap variable names are prefixed from a REDCap
     * configuration project XML node.
     *
     * @param array $project_node The REDCap configuration project XML node.
     *
     * @return bool Whether the REDCap variable names are prefixed.
     */
    private function _parsePrefixInstrumentVariable(array $project_node): bool
    {
        $prefix_instrument_variable = $project_node['prefix-instrument-variable']
            ?? null;

        // Default value.
        if ($prefix_instrument_variable === null) {
            return false;
        }

        switch ($prefix_instrument_variable) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            throw $this->_exception(
                "invalid REDCap prefix instrument variable value for the selected"
                . " project, expected 'true' or 'false' but found"
                . " '$prefix_instrument_variable'."
            );
        }
    }

    /**
     * Parse the REDCap participant identifier configuration from a REDCap
     * configuration project XML node.
     *
     * @param array $project_node The REDCap configuration project XML node.
     *
     * @return RedcapConfigRedcapId The REDCap participant configuration.
     */
    private function _parseRedcapParticipantId(
        array $project_node,
    ): RedcapConfigRedcapId {
        $redcap_participant_id = $project_node['redcap-participant-id'] ?? null;

        // Default value.
        if ($redcap_participant_id === null) {
            return RedcapConfigRedcapId::RecordId;
        }

        switch ($redcap_participant_id) {
        case 'record_id':
            return RedcapConfigRedcapId::RecordId;
        case 'survey_participant_id':
            return RedcapConfigRedcapId::SurveyParticipantId;
        default:
            throw $this->_exception(
                "invalid REDCap participant identifier type for the selected"
                . " project, expected 'record_id' or 'survey_participant_id' but"
                . " found '$redcap_participant_id'."
            );
        }
    }

    /**
     * Parse the REDCap participant LORIS candidate identifier configuration
     * from a REDCap configuration project XML node.
     *
     * @param array $project_node The REDCap configuration project XML node.
     *
     * @return RedcapConfigLorisId The LORIS candidate identifier configuration.
     */
    private function _parseCandidateId(
        array $project_node,
    ): RedcapConfigLorisId {
        $loris_candidate_id = $project_node['candidate-id'] ?? null;

        // Default value.
        if (empty($loris_candidate_id)) {
            return RedcapConfigLorisId::PscId;
        }

        switch ($loris_candidate_id) {
        case 'candid':
            return RedcapConfigLorisId::CandId;
        case 'pscid':
            return RedcapConfigLorisId::PscId;
        case 'external_id':
            return RedcapConfigLorisId::ExternalId;
        default:
            throw $this->_exception(
                "invalid LORIS candidate identifier type for the selected project,"
                . " expected 'candid' or 'pscid' but found '$loris_candidate_id'."
            );
        }
    }

    /**
     * Parse the REDCap visit mappings configuration from a REDCap configuration
     * project XML node.
     *
     * @param array $project_node The REDCap configuration project XML node.
     *
     * @return ?array The REDCap visit mapping configuration XML nodes, or `NULL` if
     *                no visit mappings are defined.
     */
    private function _parseVisits(array $project_node): ?array
    {
        $visit_entry = $project_node['visit'] ?? null;

        if (!isset($visit_entry)) {
            return null;
        }

        if (array_key_exists(0, $visit_entry)) {
            // Multiple visits.
            $visit_nodes = $visit_entry;
        } else {
            // Single visit.
            $visit_nodes = [$visit_entry];
        }

        return array_map($this->_parseVisit(...), $visit_nodes);
    }

    /**
     * Parse a REDCap visit mapping configuration from a REDCap configuration visit
     * mapping XML node.
     *
     * @param array $visit_node The REDCap configuration visit mapping XML node.
     *
     * @return RedcapConfigVisit The REDCap visit mapping configuration.
     */
    private function _parseVisit(array $visit_node): RedcapConfigVisit
    {
        $visit_label = $visit_node['visit-label'] ?? null;
        if (empty($visit_label)) {
            throw $this->_exception(
                "no visit label in configuration visit, missing node 'visit-label'."
            );
        }

        $redcap_arm_name   = $visit_node['redcap-arm-name'] ?? null;
        $redcap_event_name = $visit_node['redcap-event-name'] ?? null;
        $create_session    = $this->_parseCreateSession($visit_node);

        return new RedcapConfigVisit(
            $visit_label,
            $redcap_arm_name,
            $redcap_event_name,
            $create_session,
        );
    }

    /**
     * Parse a REDCap session creation configuration from a REDCap session creation
     * configuration XML node.
     *
     * @param array $visit_node The REDCap configuration visit mapping XML node.
     *
     * @return ?RedcapConfigCreateSession The REDCap session creation configuration.
     */
    private function _parseCreateSession(
        array $visit_node,
    ): ?RedcapConfigCreateSession {
        $create_session_node = $visit_node['create-session'] ?? null;
        if (empty($create_session_node)) {
            return null;
        }

        $site_name = $create_session_node['site-name'] ?? null;
        if (empty($site_name)) {
            throw $this->_exception(
                "no site name in session creation configuration, missing node"
                . " 'site-name'."
            );
        }

        $project_name = $create_session_node['project-name'] ?? null;
        if (empty($project_name)) {
            throw $this->_exception(
                "no project name in session creation configuration, missing node"
                . " 'project-name'."
            );
        }

        $cohort_name = $create_session_node['cohort-name'] ?? null;
        if (empty($cohort_name)) {
            throw $this->_exception(
                "no cohort name in session creation configuration, missing node"
                . " 'cohort-name'."
            );
        }

        return new RedcapConfigCreateSession(
            $site_name,
            $project_name,
            $cohort_name,
        );
    }

    /**
     * Create a new REDCap configuration exception for the parser parameters.
     *
     * @param string $message The exception message.
     *
     * @return \LorisException The REDCap configuration exception.
     */
    private function _exception(string $message): \LorisException
    {
        return new \LorisException(
            "[redcap][config] (redcap-instance-url: {$this->_redcap_instance_url})"
            . " (redcap-project-id: {$this->_redcap_project_id}): $message"
        );
    }
}
