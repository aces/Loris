<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\config;

/**
 * Class representing a REDCap configuration for a given project.
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfig
{
    /**
     * The REDCap project ID of the project.
     *
     * @var string
     */
    public readonly string $redcap_project_id;

    /**
     * The URL of the REDCap instance in which the project is hosted.
     *
     * @var string
     */
    public readonly string $redcap_instance_url;

    /**
     * The REDCap API token used to access the REDCap API for this project.
     *
     * @var string
     */
    public readonly string $redcap_api_token;

    /**
     * Whether the REDCap variable names are prefixed with their instrument name.
     *
     * @var bool
     */
    public readonly bool $prefix_instrument_variable;

    /**
     * The type of REDCap participant identifier to match with the LORIS candidate.
     *
     * @var RedcapConfigRedcapId
     */
    public readonly RedcapConfigRedcapId $redcap_participant_id;

    /**
     * The type of LORIS candidate identifier to match with the REDCap participant.
     *
     * @var RedcapConfigLorisId
     */
    public readonly RedcapConfigLorisId $candidate_id;

    /**
     * The configuration parameters to map the REDCap arms and events to the LORIS
     * visits.
     *
     * @var ?RedcapConfigVisit[]
     */
    public readonly ?array $visits;

    /**
     * Constructor.
     *
     * @param string               $redcap_project_id          The REDCap project
     *                                                         ID.
     * @param string               $redcap_instance_url        The REDCap instance
     *                                                         URL.
     * @param string               $redcap_api_token           The REDCap API token.
     * @param bool                 $prefix_instrument_variable Whether the REDCap
     *                                                         variable names are
     *                                                         prefixed.
     * @param RedcapConfigRedcapId $redcap_participant_id      The REDCap
     *                                                         participant
     *                                                         identifier
     *                                                         configuration.
     * @param RedcapConfigLorisId  $candidate_id               The REDCap LORIS
     *                                                         candidate identifier
     *                                                         configuration.
     * @param ?array               $visits                     The REDCap visit
     *                                                         mappings.
     */
    public function __construct(
        string $redcap_project_id,
        string $redcap_instance_url,
        string $redcap_api_token,
        bool $prefix_instrument_variable,
        RedcapConfigRedcapId $redcap_participant_id,
        RedcapConfigLorisId $candidate_id,
        ?array $visits,
    ) {
        $this->redcap_project_id          = $redcap_project_id;
        $this->redcap_instance_url        = $redcap_instance_url;
        $this->redcap_api_token           = $redcap_api_token;
        $this->prefix_instrument_variable = $prefix_instrument_variable;
        $this->redcap_participant_id      = $redcap_participant_id;
        $this->candidate_id = $candidate_id;
        $this->visits       = $visits;
    }
}
