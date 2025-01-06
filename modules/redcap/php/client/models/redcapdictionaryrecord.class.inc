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

use LORIS\redcap\client\models\RedcapProp;

/**
 * This represents a redcap dictionary entry.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapDictionaryRecord extends RedcapProp
{
    private string $_field_name;
    private string $_form_name;
    private string $_section_header;
    private string $_field_type;
    private string $_field_label;
    private string $_select_choices;
    private string $_field_note;
    private string $_text_validation_type;
    private string $_text_validation_min;
    private string $_text_validation_max;
    private string $_identifier;
    private string $_branching_logic;
    private bool $_required_field;
    private string $_custom_alignment;
    private string $_question_number;
    private string $_matrix_group_name;
    private string $_matrix_ranking;
    private string $_field_annotation;

    /**
     * Constructor
     *
     * @param array $props        The dictionary entry properties from redcap.
     * @param bool  $trimFormName Should the instrument name be trimmed?
     */
    public function __construct(array $props, bool $trimFormName = false)
    {
        $propType      = 'dictionary';
        $expectedProps = [
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
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'field_name');
        self::checkPropIsNotNull($props, $propType, 'form_name');
        self::checkPropIsNotNull($props, $propType, 'field_type');
        self::checkPropIsNotNull($props, $propType, 'field_label');

        $field_name = $props['field_name'];
        $form_name  = $props['form_name'];
        if ($trimFormName) {
            if (strpos($field_name, $form_name) !== 0) {
                $msg = "[redcap:redcapdictionaryrecord] Field '$field_name'"
                . " does not have form name '$form_name' as a prefix";
                throw new \LorisException($msg);
            } else {
                $pattern    = "/^" . preg_quote($form_name) . "(_*)/";
                $field_name = preg_replace($pattern, "", $field_name);
            }
        }

        $this->_field_name           = $field_name;
        $this->_form_name            = $form_name;
        $this->_section_header       = $props['section_header'] ?? '';
        $this->_field_type           = $props['field_type'];
        $this->_field_label          = $props['field_label'];
        $this->_select_choices       = $props['select_choices_or_calculations']
            ?? '';
        $this->_field_note           = $props['field_note'] ?? '';
        $this->_text_validation_type
            = $props['text_validation_type_or_show_slider_number']
            ?? '';
        $this->_text_validation_min  = $props['text_validation_min'] ?? '';
        $this->_text_validation_max  = $props['text_validation_max'] ?? '';
        $this->_identifier           = $props['identifier'] ?? '';
        $this->_branching_logic      = $props['branching_logic'] ?? '';
        $this->_required_field       = !is_null($props['required_field'])
            ? (strtolower($props['required_field']) === 'y')
            : false;
        $this->_custom_alignment     = $props['custom_alignment'] ?? '';
        $this->_question_number      = $props['question_number'] ?? '';
        $this->_matrix_group_name    = $props['matrix_group_name'] ?? '';
        $this->_matrix_ranking       = $props['matrix_ranking'] ?? '';
        $this->_field_annotation     = $props['field_annotation'] ?? '';
    }

    /**
     * Get field name.
     *
     * @return string
     */
    public function getFieldName(): string
    {
        return $this->_field_name;
    }

    /**
     * Get form name.
     *
     * @return string
     */
    public function getFormName(): string
    {
        return $this->_form_name;
    }

    /**
     * Get seciton header.
     *
     * @return string
     */
    public function getSectionHeader(): string
    {
        return $this->_section_header;
    }

    /**
     * Get field type.
     *
     * @return string
     */
    public function getFieldType(): string
    {
        return $this->_field_type;
    }

    /**
     * Get field label.
     *
     * @return string
     */
    public function getFieldLabel(): string
    {
        return $this->_field_label;
    }

    /**
     * Get the select choices or calculation.
     *
     * @return string
     */
    public function getSelectChoices(): string
    {
        return $this->_select_choices;
    }

    /**
     * Get field note.
     *
     * @return string
     */
    public function getFieldNote(): string
    {
        return $this->_field_note;
    }

    /**
     * Get text validation Type.
     *
     * @return string
     */
    public function getTextValidationType(): string
    {
        return $this->_text_validation_type;
    }

    /**
     * Get text validation Min.
     *
     * @return string
     */
    public function getTextValidationMin(): string
    {
        return $this->_text_validation_min;
    }

    /**
     * Get text validation Max.
     *
     * @return string
     */
    public function getTextValidationMax(): string
    {
        return $this->_text_validation_max;
    }

    /**
     * Get identifier.
     *
     * @return string
     */
    public function getIdentifier(): string
    {
        return $this->_identifier;
    }

    /**
     * Get branching logic.
     *
     * @return string
     */
    public function getBranchingLogic(): string
    {
        return $this->_branching_logic;
    }

    /**
     * Get field required.
     *
     * @return bool
     */
    public function isRequiredField(): bool
    {
        return $this->_required_field;
    }

    /**
     * Get custom alignment
     *
     * @return string
     */
    public function getCustomAlignment(): string
    {
        return $this->_custom_alignment;
    }

    /**
     * Get question number.
     *
     * @return string
     */
    public function getQuestionNumber(): string
    {
        return $this->_question_number;
    }

    /**
     * Get matrix group name.
     *
     * @return string
     */
    public function getMatrixGroupName(): string
    {
        return $this->_matrix_group_name;
    }

    /**
     * Get matrix ranking.
     *
     * @return string
     */
    public function getMatrixRanking(): string
    {
        return $this->_matrix_ranking;
    }

    /**
     * Get field annotation.
     *
     * @return string
     */
    public function getFieldAnnotation(): string
    {
        return $this->_field_annotation;
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
            'field_name'                                 => $this->_field_name,
            'form_name'                                  => $this->_form_name,
            'section_header'                             => $this->_section_header,
            'field_type'                                 => $this->_field_type,
            'field_label'                                => $this->_field_label,
            'select_choices_or_calculations'             => $this->_select_choices,
            'field_note'                                 => $this->_field_note,
            'text_validation_type_or_show_slider_number' =>
                $this->_text_validation_type,
            'text_validation_min'                        =>
                $this->_text_validation_min,
            'text_validation_max'                        =>
                $this->_text_validation_max,
            'identifier'                                 => $this->_identifier,
            'branching_logic'                            => $this->_branching_logic,
            'required_field'                             => $this->_required_field,
            'custom_alignment'                           => $this->_custom_alignment,
            'question_number'                            => $this->_question_number,
            'matrix_group_name'                          =>
                $this->_matrix_group_name,
            'matrix_ranking'                             => $this->_matrix_ranking,
            'field_annotation'                           => $this->_field_annotation,
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
        $fieldType  = $this->getFieldType();
        $field_name = $this->getFieldName();
        $fieldLabel = str_replace("\n", "<br /><br />", $this->getFieldLabel());
        $fieldDesc  = "$field_name{@}$fieldLabel";

        //
        switch ($fieldType) {
        case 'text':
            // text maps directly to LORIS
            return "text{@}$fieldDesc";
        case 'descriptive':
            // descriptive maps to label with no field.
            return "static{@}$fieldDesc";
        case 'radio':
        case 'dropdown':
            // Radio or dropdown maps to a select and the options are in the
            // same format in the dictionary.
            $selectoptions = $this->_optionsToLINST();
            if (!empty($selectoptions)) {
                $selectoptions = "NULL=>''{-}$selectoptions";
            }
            return "select{@}$fieldDesc{@}$selectoptions";
        case 'checkbox':
            // checkboxes are the same format as radios but allow multiple options,
            // so map to a selectmultiple instead of a select
            return "selectmultiple{@}$fieldDesc{@}"
                . $this->_optionsToLINST();
        case 'yesno':
            // Map yes/no fields to dropdowns with yes and no options.
            return "select{@}$fieldDesc{@}NULL=>''{-}'yes'=>'Yes'{-}'no'=>'No'";
        case 'truefalse':
            // Map true/false fields to dropdowns with true and false options.
            return "select{@}$fieldDesc{@}NULL=>''"
                . "{-}'true'=>'True'{-}'false'=>'False'";
        case 'calc':
            // Calc maps to a score field. We create the DB field but don't do
            // the score.
            return "static{@}$fieldDesc";
        case 'sql':
            // The "SQL" data type is used for a dynamic display of enum options.
            // Since we don't have access to the redcap database that the sql is
            // selecting from, we treat it the same way as a score/calc field so
            // that data can be imported.
            return "static{@}$fieldDesc";
        case'slider':
            return "numeric{@}$fieldDesc{@}0{@}100";
        case 'file':
            // File upload - NOT SUPPORTED BY LINST
            return "";
        case 'notes':
            // REDCap calls textareas notes
            return "textarea{@}$fieldDesc";
        default:
            throw new \LorisException("Unhandled REDCap type '$fieldType'");
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
        $dictionary = $this->getSelectChoices();
        $dictionary = str_replace(' | | ', ' | ', $dictionary);
        if (str_starts_with($dictionary, '| ')) {
            $dictionary = substr($dictionary, 2);
        }

        $choices      = explode('|', $dictionary);
        $linstChoices = [];
        $pattern      = "/^(\s)*([[:alnum:]]+)(\s)*,(.*)$/";
        foreach ($choices as $choice) {
            $matches = [];
            if (preg_match($pattern, $choice, $matches) !== 1) {
                throw new \DomainException(
                    "Could not parse radio option: '$choice'"
                );

            }
            $backend        = $matches[2];
            $linstFormat    = "'$backend'=>'" . trim($matches[4]) . '\'';
            $linstChoices[] = $linstFormat;

        }
        return join('{-}', $linstChoices);
    }
}
