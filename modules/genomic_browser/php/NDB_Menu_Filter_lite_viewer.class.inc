<?php
/**
 * For cpg_browser class file
 * Displays targeted CpG islands data.
 * Filterable by candidate, gene or variant fields.
 *
 * PHP version 5
 *
 *  @category Genomic
 *  @package  Main
 *  @author   Xavier <xavierlb.mavan@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link     https://www.github.com/aces/Loris/
 *  Main page: CNV. Submenu: SNP
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_SNP_Browser Class
 *
 * This class is cpg_browser Form
 * CpG submenu tab for Genomic Browser
 *
 * @category Genomic
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
*/
class NDB_Menu_Lite_Viewer extends NDB_Menu_Filter
{
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
        return ($user->hasPermission('genomic_browser_view_site')
                || $user->hasPermission('genomic_browser_view_allsites'));
    }

    /** 
     * Computes the initial values this page will be filled with.
     *
     * @return the default values for the initial state of this page.
     */
    function _getDefaults()
    {
        $defaults = array(
            'Chromosome' => '14',
        );

        return $defaults;
    }

    /**
     * Function _setupVariables
     *
     * @note   overloaded function
     * @return bool
    */

    function _setupVariables()
    {
        $this->columns = array('cpg_name');

        $this->query = ' FROM genomic_cpg cpg WHERE 0=1 ';

        $this->validFilters = array(
            'cpg.cpg_name',
        );

        $this->formToFilter = array(
                               'centerID'           => 'candidate.CenterID',
                               'DCCID'              => 'candidate.CandID',
                               'PSCID'              => 'candidate.PSCID',
                               'gender'             => 'candidate.Gender',
                               'SubprojectID'       => 'cohort.SubprojectID',
                               'dob'                => 'candidate.DoB',
                               'cpg_name'           => 'cpg.cpg_name',
                               'Beta_value'         => 'cpg.beta_value',
                               'Chromosome'         => 'genome_loc.Chromosome',
                               'Gene_Symbol'        => 'gca.gene_name',
                               'Platform'           => 'platform.Name',
                               'Strand'             => 'genome_loc.Strand',
                               'StartLoc'           => 'genome_loc.StartLoc',
                               'EndLoc'             => 'genome_loc.EndLoc',
                               'genomic_range'      => 'genomic_range',
                               'Assembly'           => 'gca.genome_build',
                               'Context'            => 'gca.island_relation',
                               'Design'             => 'gca.design_type',
                               'Color'              => 'gca.color_channel',
                               'SNP_10'             => 'gca.probe_snp_10',
                               'Gene_Grp'           => 'gca.gene_group',
                               'Island_Loc'         => 'gca.island_loc',
                               'Fantom_Prom'        => 'gca.fantom_promoter_loc',
                               'DMR'                => 'gca.dmr',
                               'Enhancer'           => 'gca.enhancer',
                               'HMM_Island'         => 'gca.hmm_island_loc',
                               'Reg_Feature_Loc'    => 'gca.reg_feature_loc',
                               'Reg_Feature_Grp'    => 'gca.reg_feature_group',
                               'DHS'                => 'gca.dhs',
                              );

    }

    /**
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return bool
     */
    function _setFilterForm()
    {

        // Chromosome
        $options_list = array(
            '1'  => '1',
            '2'  => '2',
            '3'  => '3',
            '4'  => '4',
            '5'  => '5',
            '6'  => '6',
            '7'  => '7',
            '8'  => '8',
            '9'  => '9',
            '10' => '10',
            '11' => '11',
            '12' => '12',
            '13' => '13',
            '14' => '14',
            '15' => '15',
            '16' => '16',
            '17' => '17',
            '18' => '18',
            '19' => '19',
            '20' => '20',
            '21' => '21',
            '22' => '22',
            'X'  => 'X',
            'Y'  => 'Y',
        );
        $this->addSelect('Chromosome','Chromosome:', $options_list);

        $this->addBasicText('StartLoc','From:');
        $this->addBasicText('EndLoc','To:');

        $options_list = array(
            null => 'Any',
            'F'  => 'Forward',
            'R'  => 'Reverse',
        );
        $this->addSelect('Strand','Strand:',$options_list);
    }

    /**
     * Adds filters
     * This function overrides filters to enable the initial query.
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
        if ($field == "show_results_options") {
            if ($val == "full") {
                $this->_displayBrief = false;
            }
            return $query;
        }
        if ((!empty($val) || $val === '0') && $field != 'order') {
            switch ($field) {
                case 'genome_loc.StartLoc':
                    $query .= " AND cpg.cpg_loc >= :v_$prepared_key";
                    break;
                case 'genome_loc.EndLoc':
                    $query .= " AND cpg.cpg_loc <= :v_$prepared_key";
                    break;
                case 'genome_loc.chromosome':
                    $query .= " AND $field = :v_$prepared_key";
                    break;
                default:
                    $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
                    break;
            }
        }
        return $query;
    }

    /** 
     * Add dependency on D3 and C3 javascript libraries
     * for the pretty dashboards in the chart
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {   
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting('www');
        $baseurl = $www['url'];

        $paths = $config->getSetting("paths");

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
                $baseurl . '/js/d3.min.js',
                $baseurl . '/js/c3.min.js',
                $baseurl . '/js/util/jstat.min.js',
                $baseurl . '/genomic_browser/js/lite_viewer_react_components.js',
                $baseurl . '/genomic_browser/js/lite_viewer.js',
                $baseurl . '/genomic_browser/js/genomic_browser.js',
            )   
        );  

    }
}
