<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category MethylationViews
 * @package  Loris
 * @author   Alizee Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\genomic_browser\Views;

/**
 * This class formats a form object into array for the genomic_browser module
 *
 * @category MethylationViews
 * @package  Loris
 * @author   Alizee Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Methylation
{
    /**
     * The formElement
     *
     * @var array
     */
    private $_formElement;

    /**
     * Constructor
     *
     * @param array $list_of_sites The list_of_sites for form element
     * @param array $subprojects   The subprojects for form element
     */
    public function __construct($list_of_sites, $subprojects)
    {
        $this->_formElement = [
            'Sites'           => $list_of_sites,
            'SubprojectID'    => $subprojects,
            'Context'         => $this->_getDistinctValues(
                'genomic_cpg_annotation',
                'island_relation'
            ),
            'DMR'             => $this->_getDistinctValues(
                'genomic_cpg_annotation',
                'dmr'
            ),
            'Reg_Feature_Grp' => $this->_getDistinctValues(
                'genomic_cpg_annotation',
                'reg_feature_group'
            ),
            'Platform'        => $this->_getDistinctValues(
                'genotyping_platform',
                'Name'
            ),
        ];
    }

    /**
     * Generates the array
     *
     * @return array
     */
    public function toArray() : array
    {
        return $this->_formElement;
    }

    /**
     * Provide an array of distinct value from a column in
     * the specified table. The first element has a null key and
     * its value is 'Any'.
     *
     * @param string $table  The tables name
     * @param string $column The column name
     *
     * @return array An array where value are keys as well as values
     */
    private function _getDistinctValues($table, $column)
    {
        $DB      = \Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            []
        );
        return array_reduce(
            $results,
            function ($carry, $item) {
                $value = array_values($item)[0];
                if (!empty($value)) {
                    $carry[$value] = $value;
                }
                return $carry;
            },
            []
        );
    }

}
