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
use LORIS\redcap\config\RedcapConfigLorisCandidateId;
use LORIS\redcap\config\RedcapConfigRedcapParticipantId;
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
     * The LORIS database.
     *
     * @var \Database
     */
    private \Database $_db;

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
        $this->_db    = $loris->getDatabaseConnection();
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
            throw new \LorisException("[redcap][init] no REDCap configuration.");
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
        $issue_assignee = $this->_parseIssueAssignee($redcap_node);

        $instance_node = $this->_getInstanceNode($redcap_node);
        if ($instance_node === null) {
            error_log("TODO: Error parse instance node.");
            return null;
        }

        $project_node = $this->_getProjectNode($instance_node);
        if ($project_node === null) {
            error_log("TODO: Error parse project node.");
            return null;
        }

        $redcap_api_token      = $this->_parseRedcapApiToken($project_node);
        $redcap_participant_id = $this->_parseRedcapParticipantId($project_node);
        $candidate_id          = $this->_parseCandidateId($project_node);
        $visits = $this->_parseVisits($project_node);

        return new RedcapConfig(
            $issue_assignee,
            $this->_redcap_project_id,
            $this->_redcap_instance_url,
            $redcap_api_token,
            $redcap_participant_id,
            $candidate_id,
            $visits,
        );
    }

    /**
     * Parse the REDCap issue assignee from a REDCap configuration XML node.
     *
     * @param array $redcap_node The REDCap configuration XML node.
     *
     * @return \User The REDCap issue assignee user.
     */
    private function _parseIssueAssignee(array $redcap_node): \User
    {
        $assignee_user_id = $redcap_node['issue-assignee'] ?? null;
        if (!isset($assignee_user_id) || empty($assignee_user_id)) {
            throw new \LorisException(
                "TODO: Error parse issue assignee."
            );
        }

        $assignee = $this->_db->pselectOne(
            "SELECT u.userID
            FROM users u
                JOIN user_perm_rel upr ON (upr.userid = u.id)
                JOIN permissions p ON (p.permid = upr.permid)
            WHERE u.userID = :usid
                AND u.Active = 'Y'
                AND u.Pending_approval = 'N'
                AND p.code = 'issue_tracker_developer'
            ",
            ['usid' => $assignee_user_id]
        );

        if ($assignee === null) {
            throw new \LorisException(
                "[redcap][init] assignee '$assignee_user_id' does not exist"
                . " or does not have enough privilege."
            );
        }

        return \User::factory($assignee_user_id);
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
        $instance_entry = $redcap_node['instance'];

        // No instance described.
        if (!isset($instance_entry)) {
            throw new \LorisException(
                "TODO: Error parse instance entry."
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
        $project_entry = $instance_node['project'];

        if (!isset($project_entry)) {
            throw new \LorisException(
                "TODO: Error parse project entry."
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
        $redcap_api_token = $project_node['redcap-api-token'];

        if (empty($redcap_api_token)) {
            throw new \LorisException(
                "TODO: Error parse API token."
            );
        }

        return $redcap_api_token;
    }

    /**
     * Parse the REDCap participant identifier configuration from a REDCap
     * configuration project XML node.
     *
     * @param array $project_node The REDCap configuration project XML node.
     *
     * @return RedcapConfigRedcapParticipantId The REDCap participant identifier
     *                                         configuration.
     */
    private function _parseRedcapParticipantId(
        array $project_node,
    ): RedcapConfigRedcapParticipantId {
        $redcap_participant_id = $project_node['redcap-participant-id'];

        // Default value.
        if (empty($redcap_participant_id)) {
            return RedcapConfigRedcapParticipantId::RecordId;
        }

        switch ($redcap_participant_id) {
        case 'record-id':
            return RedcapConfigRedcapParticipantId::RecordId;
        case 'survery-participant-id':
            return RedcapConfigRedcapParticipantId::SurveyParticipantId;
        default:
            throw new \LorisException(
                "TODO: Error parse REDCap participant ID type."
            );
        }
    }

    /**
     * Parse the REDCap participant LORIS candidate identifier configuration
     * from a REDCap configuration project XML node.
     *
     * @param array $project_node The REDCap configuration project XML node.
     *
     * @return RedcapConfigLorisCandidateId The LORIS candidate identifier
     *                                      configuration.
     */
    private function _parseCandidateId(
        array $project_node,
    ): RedcapConfigLorisCandidateId {
        $loris_candidate_id = $project_node['candidate-id'];

        // Default value.
        if (empty($loris_candidate_id)) {
            return RedcapConfigLorisCandidateId::PscId;
        }

        switch ($loris_candidate_id) {
        case 'dcc-id':
            return RedcapConfigLorisCandidateId::CandId;
        case 'psc-id':
            return RedcapConfigLorisCandidateId::PscId;
        default:
            throw new \LorisException(
                "TODO: Error parse REDCap candidate ID type."
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
        $visit_entry = $project_node['visit'];

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
        $visit_label       = $visit_node['visit-label'];
        $redcap_arm_name   = $visit_node['redcap-arm-name'];
        $redcap_event_name = $visit_node['redcap-event-name'];

        // TODO: Error handling.

        return new RedcapConfigVisit(
            $visit_label,
            $redcap_arm_name,
            $redcap_event_name,
        );
    }
}
