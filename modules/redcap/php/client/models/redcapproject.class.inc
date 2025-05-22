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

namespace LORIS\redcap\client\models;

use LORIS\redcap\client\RedcapProps;

/**
 * This represents a REDCap project.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapProject
{
    /**
     * The project project_id.
     *
     * @var int
     */
    public readonly int $project_id;

    /**
     * The project project_title.
     *
     * @var string
     */
    public readonly string $project_title;

    /**
     * The project creation_time.
     *
     * @var ?\DateTimeImmutable
     */
    public readonly ?\DateTimeImmutable $creation_time;

    /**
     * The project production_time.
     *
     * @var ?\DateTimeImmutable
     */
    public readonly ?\DateTimeImmutable $production_time;

    /**
     * The project in_production.
     *
     * @var bool
     */
    public readonly bool $in_production;

    /**
     * The project project_language.
     *
     * @var string
     */
    public readonly string $project_language;

    /**
     * The project purpose.
     *
     * @var int
     */
    public readonly int $purpose;

    /**
     * The project purpose_other.
     *
     * @var int
     */
    public readonly int $purpose_other;

    /**
     * The project project_notes.
     *
     * @var string
     */
    public readonly string $project_notes;

    /**
     * The project custom_record_label.
     *
     * @var string
     */
    public readonly string $custom_record_label;

    /**
     * The project secondary_unique_field.
     *
     * @var string
     */
    public readonly string $secondary_unique_field;

    /**
     * The project is_longitudinal.
     *
     * @var bool
     */
    public readonly bool $is_longitudinal;

    /**
     * The project has_repeating_instruments_or_events.
     *
     * @var bool
     */
    public readonly bool $has_repeating_instruments;

    /**
     * The project surveys_enabled.
     *
     * @var bool
     */
    public readonly bool $surveys_enabled;

    /**
     * The project scheduling_enabled.
     *
     * @var bool
     */
    public readonly bool $scheduling_enabled;

    /**
     * The project record_autonumbering_enabled.
     *
     * @var bool
     */
    public readonly bool $record_autonumbering_enabled;

    /**
     * The project randomization_enabled.
     *
     * @var bool
     */
    public readonly bool $randomization_enabled;

    /**
     * The project ddp_enabled.
     *
     * @var bool
     */
    public readonly bool $ddp_enabled;

    /**
     * The project project_irb_number.
     *
     * @var string
     */
    public readonly string $project_irb_number;

    /**
     * The project project_grant_number.
     *
     * @var string
     */
    public readonly string $project_grant_number;

    /**
     * The project project_pi_firstname.
     *
     * @var string
     */
    public readonly string $project_pi_firstname;

    /**
     * The project project_pi_lastname.
     *
     * @var string
     */
    public readonly string $project_pi_lastname;

    /**
     * The project display_today_now_button.
     *
     * @var bool
     */
    public readonly bool $display_today_now_button;

    /**
     * The project missing_data_codes.
     *
     * @var string
     */
    public readonly string $missing_data_codes;

    /**
     * The project external_modules.
     *
     * @todo should be string[], try to find a multimodule project
     *
     * @var string
     */
    public readonly string $external_modules;

    /**
     * The project bypass_branching.
     *
     * @var bool
     */
    public readonly bool $bypass_branching;

    /**
     * Constructor
     *
     * @param array $props The project properties typically from redcap.
     */
    public function __construct(array $props)
    {
        $props = new RedcapProps('project', $props);

        $this->project_id       = $props->getInt('project_id');
        $this->project_title    = $props->getString('project_title');
        $this->creation_time    = $props->getDateTimeNullable('creation_time');
        $this->production_time  = $props->getDateTimeNullable('production_time');
        $this->in_production    = $props->getBool('in_production');
        $this->project_language = $props->getString('project_language');
        $this->purpose          = $props->getInt('purpose');
        $this->purpose_other    = $props->getInt('purpose_other');
        $this->project_notes    = $props->getString('project_notes');
        $this->custom_record_label       = $props->getString(
            'custom_record_label'
        );
        $this->secondary_unique_field    = $props->getString(
            'secondary_unique_field'
        );
        $this->is_longitudinal           = $props->getBool('is_longitudinal');
        $this->has_repeating_instruments = $props->getBool(
            'has_repeating_instruments_or_events'
        );
        $this->surveys_enabled           = $props->getBool('surveys_enabled');
        $this->scheduling_enabled        = $props->getBool('scheduling_enabled');
        $this->record_autonumbering_enabled = $props->getBool(
            'record_autonumbering_enabled'
        );
        $this->randomization_enabled        = $props->getBool(
            'randomization_enabled'
        );
        $this->ddp_enabled          = $props->getBool('ddp_enabled');
        $this->project_irb_number   = $props->getString('project_irb_number');
        $this->project_grant_number = $props->getString('project_grant_number');
        $this->project_pi_firstname = $props->getString('project_pi_firstname');
        $this->project_pi_lastname  = $props->getString('project_pi_lastname');
        $this->display_today_now_button = $props->getBool(
            'display_today_now_button'
        );
        $this->missing_data_codes       = $props->getString('missing_data_codes');
        $this->external_modules         = $props->getString('external_modules');
        $this->bypass_branching         = $props->getBool(
            'bypass_branching_erase_field_prompt'
        );
    }

    /**
     * Prop array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'project_id'                          => $this->project_id,
            'project_title'                       => $this->project_title,
            'creation_time'                       => $this->creation_time,
            'production_time'                     => $this->production_time,
            'in_production'                       => $this->in_production,
            'project_language'                    => $this->project_language,
            'purpose'                             => $this->purpose,
            'purpose_other'                       => $this->purpose_other,
            'project_notes'                       => $this->project_notes,
            'custom_record_label'                 => $this->custom_record_label,
            'secondary_unique_field'              => $this->secondary_unique_field,
            'is_longitudinal'                     => $this->is_longitudinal,
            'has_repeating_instruments_or_events' =>
                $this->has_repeating_instruments,
            'surveys_enabled'                     => $this->surveys_enabled,
            'scheduling_enabled'                  => $this->scheduling_enabled,
            'record_autonumbering_enabled'        =>
                $this->record_autonumbering_enabled,
            'randomization_enabled'               => $this->randomization_enabled,
            'ddp_enabled'                         => $this->ddp_enabled,
            'project_irb_number'                  => $this->project_irb_number,
            'project_grant_number'                => $this->project_grant_number,
            'project_pi_firstname'                => $this->project_pi_firstname,
            'project_pi_lastname'                 => $this->project_pi_lastname,
            'display_today_now_button'            => $this->display_today_now_button,
            'missing_data_codes'                  => $this->missing_data_codes,
            'external_modules'                    => $this->external_modules,
            'bypass_branching'                    => $this->bypass_branching,
        ];
    }
}
