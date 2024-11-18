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

namespace LORIS\redcap\models;

use LORIS\redcap\models\RedcapProp;

/**
 * This represents a REDCap project.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapProject extends RedcapProp
{
    /**
     * The project project_id.
     *
     * @var int
     */
    private int $_project_id;

    /**
     * The project project_title.
     *
     * @var string
     */
    private string $_project_title;

    /**
     * The project creation_time.
     *
     * @var \DateTimeImmutable
     */
    private \DateTimeImmutable $_creation_time;

    /**
     * The project production_time.
     *
     * @var \DateTimeImmutable
     */
    private \DateTimeImmutable $_production_time;

    /**
     * The project in_production.
     *
     * @var bool
     */
    private bool $_in_production;

    /**
     * The project project_language.
     *
     * @var string
     */
    private string $_project_language;

    /**
     * The project purpose.
     *
     * @var int
     */
    private int $_purpose;

    /**
     * The project purpose_other.
     *
     * @var int
     */
    private int $_purpose_other;

    /**
     * The project project_notes.
     *
     * @var string
     */
    private string $_project_notes;

    /**
     * The project custom_record_label.
     *
     * @var string
     */
    private string $_custom_record_label;

    /**
     * The project secondary_unique_field.
     *
     * @var string
     */
    private string $_secondary_unique_field;

    /**
     * The project is_longitudinal.
     *
     * @var bool
     */
    private bool $_is_longitudinal;

    /**
     * The project has_repeating_instruments.
     *
     * @var bool
     */
    private bool $_has_repeating_instruments;

    /**
     * The project surveys_enabled.
     *
     * @var bool
     */
    private bool $_surveys_enabled;

    /**
     * The project scheduling_enabled.
     *
     * @var bool
     */
    private bool $_scheduling_enabled;

    /**
     * The project record_autonumbering_enabled.
     *
     * @var bool
     */
    private bool $_record_autonumbering_enabled;

    /**
     * The project randomization_enabled.
     *
     * @var bool
     */
    private bool $_randomization_enabled;

    /**
     * The project ddp_enabled.
     *
     * @var bool
     */
    private bool $_ddp_enabled;

    /**
     * The project project_irb_number.
     *
     * @var string
     */
    private string $_project_irb_number;

    /**
     * The project project_grant_number.
     *
     * @var string
     */
    private string $_project_grant_number;

    /**
     * The project project_pi_firstname.
     *
     * @var string
     */
    private string $_project_pi_firstname;

    /**
     * The project project_pi_lastname.
     *
     * @var string
     */
    private string $_project_pi_lastname;

    /**
     * The project display_today_now_button.
     *
     * @var bool
     */
    private bool $_display_today_now_button;

    /**
     * The project missing_data_codes.
     *
     * @var string
     */
    private string $_missing_data_codes;

    /**
     * The project external_modules.
     *
     * @todo should be string[], try to find a multimodule project
     *
     * @var string
     */
    private string $_external_modules;

    /**
     * The project bypass_branching.
     *
     * @var bool
     */
    private bool $_bypass_branching;

    /**
     * Constructor
     *
     * @param array $props The project properties typically from redcap.
     */
    public function __construct(array $props)
    {
        $propType      = 'project';
        $expectedProps = [
            'project_id',
            'project_title',
            'creation_time',
            'production_time',
            'in_production',
            'project_language',
            'purpose',
            'purpose_other',
            'project_notes',
            'custom_record_label',
            'secondary_unique_field',
            'is_longitudinal',
            'has_repeating_instruments_or_events',
            'surveys_enabled',
            'scheduling_enabled',
            'record_autonumbering_enabled',
            'randomization_enabled',
            'ddp_enabled',
            'project_irb_number',
            'project_grant_number',
            'project_pi_firstname',
            'project_pi_lastname',
            'display_today_now_button',
            'missing_data_codes',
            'external_modules',
            'bypass_branching_erase_field_prompt',
        ];
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'project_id');
        self::checkPropIsNotNull($props, $propType, 'project_title');

        $this->_project_id       = intval($props['project_id']);
        $this->_project_title    = $props['project_title'];
        $this->_creation_time    = !empty($props['creation_time'])
            ? new \DateTimeImmutable($props['creation_time'])
            : null;
        $this->_production_time  = !empty($props['production_time'])
            ? new \DateTimeImmutable($props['production_time'])
            : null;
        $this->_in_production    = !empty($props['in_production'])
            && $props['in_production'] == 1;
        $this->_project_language
            = $props['project_language'];
        $this->_purpose          = intval($props['purpose']);
        $this->_purpose_other    = intval($props['purpose_other']);
        $this->_project_notes    = $props['project_notes'];
        $this->_custom_record_label       = $props['custom_record_label'];
        $this->_secondary_unique_field    = $props['secondary_unique_field'];
        $this->_is_longitudinal           = !empty($props['is_longitudinal'])
            && $props['is_longitudinal'] == 1;
        $this->_has_repeating_instruments
            = !empty($props['has_repeating_instruments_or_events'])
            && $props['has_repeating_instruments_or_events'] == 1;
        $this->_surveys_enabled           = !empty($props['surveys_enabled'])
            && $props['surveys_enabled'] == 1;
        $this->_scheduling_enabled        = !empty($props['scheduling_enabled'])
            && $props['scheduling_enabled'] == 1;
        $this->_record_autonumbering_enabled
            = !empty($props['record_autonumbering_enabled'])
            && $props['record_autonumbering_enabled'] == 1;
        $this->_randomization_enabled        = !empty(
            $props['randomization_enabled']
        ) && $props['randomization_enabled'] == 1;
        $this->_ddp_enabled          = !empty($props['ddp_enabled'])
            && $props['ddp_enabled'] == 1;
        $this->_project_irb_number   = $props['project_irb_number'];
        $this->_project_grant_number
            = $props['project_grant_number'];
        $this->_project_pi_firstname
            = $props['project_pi_firstname'];
        $this->_project_pi_lastname  = $props['project_pi_lastname'];
        $this->_display_today_now_button
            = !empty($props['display_today_now_button'])
            && $props['display_today_now_button'] == 1;
        $this->_missing_data_codes       = $props['missing_data_codes'];
        $this->_external_modules         = $props['external_modules'];
        $this->_bypass_branching         = !empty(
            $props['bypass_branching_erase_field_prompt']
        ) && $props['bypass_branching_erase_field_prompt'] == 1;
    }


    /**
     * Get ProjectId
     *
     * @return int
     */
    public function getProjectId(): int
    {
        return $this->_project_id;
    }

    /**
     * Get ProjectTitle
     *
     * @return string
     */
    public function getProjectTitle(): string
    {
        return $this->_project_title;
    }

    /**
     * Get CreationTime
     *
     * @return \DateTimeImmutable
     */
    public function getCreationTime(): \DateTimeImmutable
    {
        return $this->_creation_time;
    }

    /**
     * Get ProductionTime
     *
     * @return \DateTimeImmutable
     */
    public function getProductionTime(): \DateTimeImmutable
    {
        return $this->_production_time;
    }

    /**
     * Get nProduction
     *
     * @return bool
     */
    public function isInProduction(): bool
    {
        return $this->_in_production;
    }

    /**
     * Get ProjectLanguage
     *
     * @return string
     */
    public function getProjectLanguage(): string
    {
        return $this->_project_language;
    }

    /**
     * Get Purpose
     *
     * @return int
     */
    public function getPurpose(): int
    {
        return $this->_purpose;
    }

    /**
     * Get PurposeOther
     *
     * @return int
     */
    public function getPurposeOther(): int
    {
        return $this->_purpose_other;
    }

    /**
     * Get ProjectNotes
     *
     * @return string
     */
    public function getProjectNotes(): string
    {
        return $this->_project_notes;
    }

    /**
     * Get CustomRecordLabel
     *
     * @return string
     */
    public function getCustomRecordLabel(): string
    {
        return $this->_custom_record_label;
    }

    /**
     * Get SecondaryUniqueField
     *
     * @return string
     */
    public function getSecondaryUniqueField(): string
    {
        return $this->_secondary_unique_field;
    }

    /**
     * Get ongitudinal
     *
     * @return bool
     */
    public function isLongitudinal(): bool
    {
        return $this->_is_longitudinal;
    }

    /**
     * Get RepeatingInstrumentsOrEvents
     *
     * @return bool
     */
    public function hasRepeatingInstrumentsOrEvents(): bool
    {
        return $this->_has_repeating_instruments;
    }

    /**
     * Get SurveysEnabled
     *
     * @return bool
     */
    public function hasSurveysEnabled(): bool
    {
        return $this->_surveys_enabled;
    }

    /**
     * Get SchedulingEnabled
     *
     * @return bool
     */
    public function hasSchedulingEnabled(): bool
    {
        return $this->_scheduling_enabled;
    }

    /**
     * Get RecordAutonumberingEnabled
     *
     * @return bool
     */
    public function hasRecordAutonumberingEnabled(): bool
    {
        return $this->_record_autonumbering_enabled;
    }

    /**
     * Get RandomizationEnabled
     *
     * @return bool
     */
    public function getRandomizationEnabled(): bool
    {
        return $this->_randomization_enabled;
    }

    /**
     * Get DDPEnabled
     *
     * @return bool
     */
    public function getDDPEnabled(): bool
    {
        return $this->_ddp_enabled;
    }

    /**
     * Get ProjectIRBNumber
     *
     * @return string
     */
    public function getProjectIRBNumber(): string
    {
        return $this->_project_irb_number;
    }

    /**
     * Get ProjectGrantNumber
     *
     * @return string
     */
    public function getProjectGrantNumber(): string
    {
        return $this->_project_grant_number;
    }

    /**
     * Get ProjectPIFirstname
     *
     * @return string
     */
    public function getProjectPIFirstname(): string
    {
        return $this->_project_pi_firstname;
    }

    /**
     * Get ProjectPILastname
     *
     * @return string
     */
    public function getProjectPILastname(): string
    {
        return $this->_project_pi_lastname;
    }

    /**
     * Get DisplayTodayNowButton
     *
     * @return bool
     */
    public function getDisplayTodayNowButton(): bool
    {
        return $this->_display_today_now_button;
    }

    /**
     * Get MissingDataCodes
     *
     * @return string
     */
    public function getMissingDataCodes(): string
    {
        return $this->_missing_data_codes;
    }

    /**
     * Get ExternalModules
     *
     * @return string
     */
    public function getExternalModules(): string
    {
        return $this->_external_modules;
    }

    /**
     * Summary of getBypassBranchingEraseFieldPrompt
     *
     * @return bool
     */
    public function getBypassBranchingEraseFieldPrompt(): bool
    {
        return $this->_bypass_branching;
    }

    /**
     * Prop array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'project_id'                   => $this->_project_id,
            'project_title'                => $this->_project_title,
            'creation_time'                => $this->_creation_time,
            'production_time'              => $this->_production_time,
            'in_production'                => $this->_in_production,
            'project_language'             => $this->_project_language,
            'purpose'                      => $this->_purpose,
            'purpose_other'                => $this->_purpose_other,
            'project_notes'                => $this->_project_notes,
            'custom_record_label'          => $this->_custom_record_label,
            'secondary_unique_field'       => $this->_secondary_unique_field,
            'is_longitudinal'              => $this->_is_longitudinal,
            'has_repeating_instruments'    => $this->_has_repeating_instruments,
            'surveys_enabled'              => $this->_surveys_enabled,
            'scheduling_enabled'           => $this->_scheduling_enabled,
            'record_autonumbering_enabled' => $this->_record_autonumbering_enabled,
            'randomization_enabled'        => $this->_randomization_enabled,
            'ddp_enabled'                  => $this->_ddp_enabled,
            'project_irb_number'           => $this->_project_irb_number,
            'project_grant_number'         => $this->_project_grant_number,
            'project_pi_firstname'         => $this->_project_pi_firstname,
            'project_pi_lastname'          => $this->_project_pi_lastname,
            'display_today_now_button'     => $this->_display_today_now_button,
            'missing_data_codes'           => $this->_missing_data_codes,
            'external_modules'             => $this->_external_modules,
            'bypass_branching'             => $this->_bypass_branching,
        ];
    }
}
