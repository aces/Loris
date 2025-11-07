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
 * This represents a redcap dictionary entry.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapDictionaryRecord
{
    /**
     * The dictionary record field name.
     */
    public readonly string $field_name;

    /**
     * The dictionary record form name.
     */
    public readonly string $form_name;

    /**
     * The dictionary record section header.
     */
    public readonly ?string $section_header;

    /**
     * The dictionary record field type.
     */
    public readonly string $field_type;

    /**
     * The dictionary record field label.
     */
    public readonly string $field_label;

    /**
     * The dictionary record select choices or calculations.
     */
    public readonly ?string $select_choices;

    /**
     * The dictionary record field note.
     */
    public readonly ?string $field_note;

    /**
     * The dictionary record text validation type.
     */
    public readonly ?string $text_validation_type;

    /**
     * The dictionary record text validation minimum.
     */
    public readonly ?string $text_validation_min;

    /**
     * The dictionary record text validation maximum.
     */
    public readonly ?string $text_validation_max;

    /**
     * The dictionary record identifier.
     */
    public readonly ?string $identifier;

    /**
     * The dictionary record branching logic.
     */
    public readonly ?string $branching_logic;

    /**
     * The dictionary record required field.
     */
    public readonly bool $required_field;

    /**
     * The dictionary record custom alignment.
     */
    public readonly ?string $custom_alignment;

    /**
     * The dictionary record question number.
     */
    public readonly ?string $question_number;

    /**
     * The dictionary record matrix group name.
     */
    public readonly ?string $matrix_group_name;

    /**
     * The dictionary record matrix ranking.
     */
    public readonly ?string $matrix_ranking;

    /**
     * The dictionary record field annotation.
     */
    public readonly ?string $field_annotation;

    /**
     * Constructor
     *
     * @param array $props          The dictionary entry properties from REDCap.
     * @param bool  $trim_form_name Should the instrument name be trimmed?
     */
    public function __construct(array $props, bool $trim_form_name = false)
    {
        $props = new RedcapProps('dictionary', $props);

        $field_name = $props->getString('field_name');
        $form_name  = $props->getString('form_name');

        if ($trim_form_name) {
            if (strpos($field_name, $form_name) !== 0) {
                throw new \LorisException(
                    "[redcap:redcapdictionaryrecord] Field '$field_name' does not"
                    . " have form name '$form_name' as a prefix"
                );
            } else {
                $pattern    = "/^". preg_quote($form_name) ."(_*)/";
                $field_name = preg_replace($pattern, "", $field_name, 1);
            }
        }

        $this->field_name           = $field_name;
        $this->form_name            = $form_name;
        $this->section_header       = $props->getStringNullable('section_header');
        $this->field_type           = $props->getString('field_type');
        $this->field_label          = $props->getString('field_label');
        $this->select_choices       = $props->getStringNullable(
            'select_choices_or_calculations'
        );
        $this->field_note           = $props->getStringNullable('field_note');
        $this->text_validation_type = $props->getStringNullable(
            'text_validation_type_or_show_slider_number'
        );
        $this->text_validation_min  = $props->getStringNullable(
            'text_validation_min'
        );
        $this->text_validation_max  = $props->getStringNullable(
            'text_validation_max'
        );
        $this->identifier           = $props->getStringNullable('identifier');
        $this->branching_logic      = $props->getStringNullable('branching_logic');
        $this->required_field       = $props->getBoolYN('required_field');
        $this->custom_alignment     = $props->getStringNullable('custom_alignment');
        $this->question_number      = $props->getStringNullable('question_number');
        $this->matrix_group_name    = $props->getStringNullable('matrix_group_name');
        $this->matrix_ranking       = $props->getStringNullable('matrix_ranking');
        $this->field_annotation     = $props->getStringNullable('field_annotation');
    }

    /**
     * Get header values.
     *
     * @return array
     */
    public static function getHeaders(): array
    {
        return [
            'field_name',
            'form_name',
            'section_header',
            'field_type',
            'field_label',
            'select_choices_or_calculations',
            'field_note',
            'text_validation_type_or_show_slider_number',
            'text_validation_min',
            'text_validation_max',
            'identifier',
            'branching_logic',
            'required_field',
            'custom_alignment',
            'question_number',
            'matrix_group_name',
            'matrix_ranking',
            'field_annotation',
        ];
    }

    /**
     * Props to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'field_name'                                 => $this->field_name,
            'form_name'                                  => $this->form_name,
            'section_header'                             => $this->section_header,
            'field_type'                                 => $this->field_type,
            'field_label'                                => $this->field_label,
            'select_choices_or_calculations'             => $this->select_choices,
            'field_note'                                 => $this->field_note,
            'text_validation_type_or_show_slider_number' =>
                $this->text_validation_type,
            'text_validation_min'                        =>
                $this->text_validation_min,
            'text_validation_max'                        =>
                $this->text_validation_max,
            'identifier'                                 => $this->identifier,
            'branching_logic'                            => $this->branching_logic,
            'required_field'                             => $this->required_field,
            'custom_alignment'                           => $this->custom_alignment,
            'question_number'                            => $this->question_number,
            'matrix_group_name'                          =>
                $this->matrix_group_name,
            'matrix_ranking'                             => $this->matrix_ranking,
            'field_annotation'                           => $this->field_annotation,
        ];
    }

    /**
     * Get the LINST version of that dicitonary record
     *
     * @throws \LorisException
     *
     * @return string a LINST string representing the record.
     */
    public function toLINST(): string
    {
        $field_type  = $this->field_type;
        $field_name  = $this->field_name;
        $field_label = str_replace("\n", "<br /><br />", $this->field_label);
        $field_desc  = "$field_name{@}$field_label";

        //
        switch ($field_type) {
        case 'text':
            // text maps directly to LORIS
            return "text{@}$field_desc";
        case 'descriptive':
            // descriptive maps to label with no field.
            return "static{@}$field_desc";
        case 'radio':
        case 'dropdown':
            // Radio or dropdown maps to a select and the options are in the
            // same format in the dictionary.
            $select_options = $this->_optionsToLINST();
            if (!empty($select_options)) {
                $select_options = "NULL=>''{-}$select_options";
            }
            return "select{@}$field_desc{@}$select_options";
        case 'checkbox':
            // checkboxes are the same format as radios but allow multiple options,
            // so map to a selectmultiple instead of a select
            return "selectmultiple{@}$field_desc{@}"
                . $this->_optionsToLINST();
        case 'yesno':
            // Map yes/no fields to dropdowns with yes and no options.
            return "select{@}$field_desc{@}NULL=>''{-}'yes'=>'Yes'{-}'no'=>'No'";
        case 'calc':
            // Calc maps to a score field. We create the DB field but don't do
            // the score.
            return "static{@}$field_desc";
        case 'sql':
            // The "SQL" data type is used for a dynamic display of enum options.
            // Since we don't have access to the redcap database that the sql is
            // selecting from, we treat it the same way as a score/calc field so
            // that data can be imported.
            return "static{@}$field_desc";
        case 'slider':
            return "numeric{@}$field_desc{@}0{@}100";
        case 'file':
            // LORIS does not handle the file itself but it does save the name of
            // the uploaded file.
            return "static{@}$field_desc";
        case 'notes':
            // REDCap calls textareas notes
            return "textarea{@}$field_desc";
        default:
            throw new \LorisException("Unhandled REDCap type '$field_type'");
        }
    }

    /**
     * Take the options column from a dictionary record and convert it to the
     * linst format for select/multiselect.
     *
     * @return string a LINST option string
     */
    private function _optionsToLINST() : string
    {
        $dictionary = $this->select_choices;
        if ($dictionary === null) {
            return '';
        }

        $dictionary = str_replace(' | | ', ' | ', $dictionary);
        if (str_starts_with($dictionary, '| ')) {
            $dictionary = substr($dictionary, 2);
        }

        $choices      = explode('|', $dictionary);
        $linstChoices = [];
        $pattern      = "/^(\s)*([[:alnum:]._]+)(\s)*,(.*)$/";

        $index = 1; //Auto-index counter
        foreach ($choices as $choice) {
            $choice = trim($choice);
            if (empty($choice)) {
                continue;
            }

            $matches = [];

            if (preg_match($pattern, $choice, $matches) !== 1) {
                // Missing code -auto-generate one
                error_log(
                    "Warning: Auto-indexing malformed option:
                    '$choice' as index $index"
                );
                $backend = $index;
                $label - $choice;
                $index++;
            } else {
                //Normal parsing
                $backend = $matches[2];
                $label   = trim($matches[4]);
            }

            $linstFormat    = "'$backend'=>'$label'";
            $linstChoices[] = $linstFormat;

        }
        return join('{-}', $linstChoices);
    }
}
