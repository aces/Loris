<?php
/**
 * For gwas_browser class file, a subtab in the Genomic Browser
 * Displays GWAS analysis results 
 * Filterable by SNP and p-value, and other fields.
 *
 * PHP version 5
 *
 *  @category   Genomic
 *  @package    Main
 *  @subpackage Genomic
 *  @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 *  @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link       https://www.github.com/aces/Loris/
 *  Submenu:    GWAS
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_GWAS_Browser Class
 *
 * This class is gwas_browser Form
 * GWAS submenu tab for Genomic Browser
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link       https://github.com/aces/Loris
*/
class NDB_Menu_Filter_GWAS_Browser extends NDB_Menu_Filter
{
    /**
     * Variables to enable special filter behaviour -
     * Show brief results or show full results (all available fields)
     * used in (overridden) _addValidFilters function below
     */
    var $_displayBrief = true;  // default: display only Brief results
    var $_briefFields  = array(); // which fields to display

    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privileges
     *
     * @note   overloaded function
     * @return bool
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return ($user->hasPermission('genomic_browser_view_allsites')
                || $user->hasPermission('genomic_browser_view_site'));
    }

    /**
     * Function _setupVariables
     *
     * @note   overloaded function
     * @return bool
    */
    function _setupVariables()
    {
        // set the class variables
        $this->columns = array(
                          'GWAS.rsID AS SNP_ID',
                          'genome_loc.Chromosome AS Chromosome',
                          'genome_loc.StartLoc AS Position_BP',
                          'GWAS.MajorAllele AS Major_Allele',
                          'GWAS.MinorAllele AS Minor_Allele',
                          'GWAS.MAF AS MAF',
                          'GWAS.Estimate AS Estimate',
                          'GWAS.StdErr AS StdErr',
                          'GWAS.Pvalue AS P_value', 
                         );

        $this->_briefFields = array(
                          'SNP_ID',
                          'Chromosome',
                          'Position_BP',
                          'Major_Allele',
                          'Minor_Allele',
                          'MAF',
                          'Estimate',
                          'StdErr',
                          'P_value', 
                         );

        // $this->query = " FROM GWAS "; 
        $this->query = " FROM GWAS 
            JOIN SNP ON (GWAS.SNPID = SNP.SNPID)
            LEFT JOIN genome_loc ON (genome_loc.GenomeLocID = SNP.GenomeLocID)"; 

        $this->order_by     = 'genome_loc.Chromosome, GWAS.Pvalue DESC';
        $this->validFilters = array(
                               'GWAS.rsID',
                               'genome_loc.Chromosome',
                               'genome_loc.StartLoc',
                               'GWAS.MajorAllele',
                               'GWAS.MinorAllele',
                               'GWAS.MAF',
                               'GWAS.Estimate',
                               'GWAS.StdErr',
                               'GWAS.Pvalue',
                              );

        $this->formToFilter = array(
                               'SNP_ID'       => 'GWAS.rsID',
                               'Chromosome'   => 'genome_loc.Chromosome',
                               'Position_BP'  => 'genome_loc.StartLoc',
                               'Major_Allele' => 'GWAS.Major_Allele',
                               'Minor_Allele' => 'GWAS.Minor_Allele',
                               'MAF'          => 'GWAS.MAF',
                               'Estimate'     => 'GWAS.Estimate',
                               'StdErr'       => 'GWAS.StdErr',
                               'P_value'      => 'GWAS.P_value', 
                              );

        return true;
    }

    /**
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return bool
     */
    function _setFilterForm()
    {
        // create user object
        $user = User::singleton();

        // add form elements
        $show_results_options = array(
               'brief' => 'Summary fields',
               'full'  => 'All fields'); 
        $this->addSelect('Show_Brief_Results', 'Display:', $show_results_options);

        $this->addBasicText('SNP_ID', 'SNP ID:');
        $this->addBasicText('Chromosome', 'Chromosome:');
        $this->addBasicText('BP_Position', 'BP Position:');
        $this->addBasicText('MAF', 'MAF:');

        $alleleArray = array(
             ''  => 'Any',
             'A' => 'A',
             'C' => 'C',
             'T' => 'T',
             'G' => 'G',
            );
        $this->addSelect('Minor_Allele', 'Minor Allele:', $alleleArray); 
        $this->addSelect('Major_Allele', 'Major Allele:', $alleleArray); 

        $this->addBasicText('Estimate', 'Estimate:');
        $this->addBasicText('StdErr', 'Std Err:');
        $this->addBasicText('Pvalue', 'P-value:');

        return true;
    }

    /**
     * Function _setDataTableRows
     *
     * @param string $count number of data
     *
     * @note   overloaded function
     * @return bool
     */
    function _setDataTableRows($count)
    {
        // create user object
        $user           = User::singleton();
        $subprojectlist = Utility::getSubprojectList();

        $this->tpl_data['resultcount']  = $this->TotalItems;
        $this->tpl_data['displayBrief'] = $this->_displayBrief;

        // re-set headers if Brief; if full, gets set by _setDataTable()
        if ($this->_displayBrief) {
            $this->headers = array(); // re-initialize i.e. wipe
            foreach ($this->_briefFields as $col) {
                $this->headers[] = $col;
            }

            // copy column headings to new array, then replace
            $colCount     = 0; // column counter
            $maxCols      = sizeof($this->tpl_data['headers']); //limit
            $briefHeaders = array();  // reset
            foreach ($this->headers as $header) {
                $found = false;
                while ($colCount < $maxCols && !$found ) {
                    // copy entire tpl_data element
                    // including displayName and fieldOrder
                    if ($this->tpl_data['headers'][$colCount]['name'] == $header) {
                        $found          = true;
                        $briefHeaders[] = $this->tpl_data['headers'][$colCount];
                    }
                    $colCount++;
                } // iterate to check for next elt, starting from here
            }
            // When done, replace tpl_data headers
            $this->tpl_data['headers'] = $briefHeaders;
        }

        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {

                if ($this->_displayBrief && !in_array($key, $this->_briefFields)) {
                    continue;  // no increment to $i
                }

                //Show the URL to the timepoint list on PSCID field
                if ($key == 'SNP_ID' && 
                    $user->hasPermission('access_all_profiles')) {
                    $this->tpl_data['items'][$x][$i]['SNP_ID'] = $item['SNP_ID'];
                }
                $this->tpl_data['items'][$x][$i]['name']  = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;

                $i++;
            }
            $x++;
        }
        $this->tpl_data['resultcount']   = $this->TotalItems;
        $this->tpl_data['displayFilter'] = $this->_displayBrief;

        return true;
    }

    /**
     * Adds filters
     * This function overrides filters to enable display of brief/full results
     *
     * @param string $prepared_key filter key
     * @param string $field        filter field
     * @param string $val          filter value
     *
     * @note overloaded function
     *
     * @return $query
    */
    function _addValidFilters($prepared_key, $field, $val)
    {
        $query = ''; //initialize
        if ($field == "show_brief_results") {
            if ($val == "full") {
                $this->_displayBrief = false;
            }
            return $query;
        }

        if ((!empty($val) || $val === '0') && $field != 'order') {
            if (in_array($field, $this->CheckboxFilters) && $val) {
                 $query .= " AND $field";
            } elseif (strtolower(substr($field, -8)) == 'centerid'
                || strtolower(substr($field, -10)) == 'categoryid'
                || strtolower(substr($field, -6)) == 'gender'
                || strtolower(substr($field, -10)) == 'chromosome'
                || (isset($this->EqualityFilters)
                && in_array($field, $this->EqualityFilters))
            ) {

                 $query .= " AND $field = :v_$prepared_key";
            } else {
                 $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
            }
        }
        return $query;
    }

}
?>
