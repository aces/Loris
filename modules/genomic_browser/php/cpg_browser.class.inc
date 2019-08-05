<?php
/**
 * For cpg_browser class file
 * Displays targeted CpG islands data.
 * Filterable by candidate, gene or variant fields.
 *
 * PHP version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Xavier <xavierlb.mavan@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser;

/**
 * CPG_Browser Class
 *
 * This class is cpg_browser Form
 * CpG submenu tab for Genomic Browser
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
 */
class CpG_Browser extends \NDB_Menu_Filter
{

    /**
     * Variables to enable special filter behaviour -
     * Show brief results or show full results (all available fields)
     */
    var $_displayBrief = true;  // default: display only Brief results

    /**
     * Tell the Caller that data will be queried using ajax and after
     * the HTML page rendering.
     */
    var $AjaxModule = true;

    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privileges
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('genomic_browser_view_allsites')
                || $user->hasPermission('genomic_browser_view_site'));
    }


    /**
     * Function _setupVariables
     *
     * @return void
     */
    function _setupVariables()
    {
        // set the class variables
        $this->_displayBrief = !(isset($_REQUEST['format']));
        $this->columns       = array(
            'psc.Name AS PSC',
            'LPAD(candidate.CandID, 6, "0") AS DCCID',
            'candidate.PSCID',
            'candidate.Sex',
            'cohort.SubprojectID as Subproject',
            'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
            'gscr.sample_label as Sample',
            'cpg.cpg_name as cpg_name',
            'cpg.beta_value as Beta_value',
            'gca.Chromosome as Chromosome',
            'gca.Strand as Strand',
            'gca.StartLoc as StartLoc',
            'gca.address_id_a as Probe_Loc_A',
            'gca.probe_seq_a as Probe_Seq_A',
            'gca.address_id_b as Probe_Loc_B',
            'gca.probe_seq_b as Probe_Seq_B',
            'gca.design_type as Design',
            'gca.color_channel as Color',
            'gca.genome_build as Assembly',
            'gca.probe_snp_10 as SNP_10',
            'gca.gene_name as Gene',
            'gca.gene_acc_num as Accession_number',
            'gca.gene_group as Gene_Grp',
            'gca.island_loc as Island_Loc',
            'gca.island_relation as Context',
            'gca.fantom_promoter_loc as Fantom_Prom',
            'gca.dmr as DMR',
            'gca.enhancer as Enhancer',
            'gca.hmm_island_loc as HMM_Island',
            'gca.reg_feature_loc as Reg_Feature_Loc',
            'gca.reg_feature_group as Reg_Feature_Grp',
            'gca.dhs as DHS',
            'platform.Name as Platform',
        );

        // This variable will be used by the columnFormatter javascript
        // to set the default hidden columns in the data table.
        $this->tpl_data['hiddenHeaders'] = json_encode(
            array_map(
                function ($header) {
                        return ucwords(str_replace('_', ' ', $header));
                },
                array(
                    'PSC',
                    'DCCID',
                    'Subproject',
                    'DoB',
                    'Sample',
                    'StartLoc',
                    'Probe_Loc_A',
                    'Probe_Seq_A',
                    'Probe_Loc_B',
                    'Probe_Seq_B',
                    'Design',
                    'Color',
                    'Assembly',
                    'SNP_10',
                    'Accession_number',
                    'Gene_Grp',
                    'Island_Loc',
                    'Context',
                    'Fantom_Prom',
                    'DMR',
                    'Enhancer',
                    'HMM_Island',
                    'Reg_Feature_Loc',
                    'Reg_Feature_Grp',
                    'DHS',
                    'Platform',
                )
            )
        );

        // If a candidate has no CPG records, they will not appear.
        $this->query = " FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID 
                    from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID = candidate.CandID) 
            LEFT JOIN psc
                ON (psc.CenterID = candidate.RegistrationCenterID)
            LEFT JOIN genomic_sample_candidate_rel gscr
                ON (gscr.CandID = candidate.CandID)
            LEFT JOIN genomic_cpg cpg
                ON (gscr.sample_label = cpg.sample_label)
            LEFT JOIN genomic_cpg_annotation gca
                USING (cpg_name)
            LEFT JOIN genotyping_platform platform
                ON (gca.platform_id = platform.PlatformID)
            WHERE 
            cpg.beta_value IS NOT NULL AND 
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $DB   = \Database::singleton();
        $user = \User::singleton();

        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND candidate.RegistrationCenterID IN ($site_arr)";
        }

        $this->order_by = 'psc.Name, candidate.CandID DESC';

        $this->limit = 10000;

        $this->validFilters = array(
            'candidate.RegistrationCenterID',
            'candidate.CandID',
            'candidate.PSCID',
            'candidate.Sex',
            'cohort.SubprojectID',
            'candidate.DoB',
            'show_brief_results',
            'cpg.cpg_name',
            'cpg.beta_value',
            'gca.Chromosome',
            'gca.Strand',
            'gca.StartLoc',
            'gca.EndLoc',
            'genomic_range',
            'gca.gene_name',
            'gca.genome_build',
            'gca.design_type',
            'gca.color_channel',
            'gca.probe_snp_10',
            'gca.gene_group',
            'gca.island_loc',
            'gca.island_relation',
            'gca.fantom_promoter_loc',
            'gca.dmr',
            'gca.enhancer',
            'gca.hmm_island_loc',
            'gca.reg_feature_group',
            'gca.dhs',
            'platform.Name',
        );

        $ftf = array(
            'centerID'           => 'candidate.RegistrationCenterID',
            'DCCID'              => 'candidate.CandID',
            'PSCID'              => 'candidate.PSCID',
            'sex'                => 'candidate.Sex',
            'SubprojectID'       => 'cohort.SubprojectID',
            'dob'                => 'candidate.DoB',
            'Show_Brief_Results' => 'show_brief_results',
            'cpg_name'           => 'cpg.cpg_name',
            'Beta_value'         => 'cpg.beta_value',
            'Chromosome'         => 'gca.Chromosome',
            'Gene_Symbol'        => 'gca.gene_name',
            'Platform'           => 'platform.Name',
            'Strand'             => 'gca.Strand',
            'StartLoc'           => 'gca.StartLoc',
            'EndLoc'             => 'gca.EndLoc',
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
        $this->formToFilter = $ftf;

        $this->EqualityFilters = array(
            'candidate.Sex',
            'cpg.cpg_name',
            'gca.genome_build',
            'gca.design_type',
            'gca.Strand',
        );

        return true;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        // create user object
        $user = \User::singleton();

        // PSC
        if ($user->hasPermission('genomic_browser_view_allsites')) {
            // has access to all sites genomic data
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList();
            if (is_array($list_of_sites)) {
                $list_of_sites = array('' => 'Any') + $list_of_sites;
            }
        } else {
            // allow only to view own site data
            $list_of_sites = $user->getStudySites();
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        // SubprojectID
        $list_of_subprojects = \Utility::getSubprojectList();

        // ------------------------------------------------------------
        // ----------------- Candidate Filters --------------------
        // ------------------------------------------------------------

        $this->addSelect('centerID', 'Site:', $list_of_sites);
        $this->addBasicText('DCCID', 'DCCID:');
        $this->addBasicText('PSCID', 'PSCID:');
        $this->addSelect(
            'sex',
            'Sex:',
            array(
                ''       => 'All',
                'Male'   => 'Male',
                'Female' => 'Female',
            )
        );
        $this->addSelect(
            'SubprojectID',
            'Subproject:',
            array('' => 'Any') + $list_of_subprojects
        );
        $this->addBasicText('dob', 'Date of Birth:', array('maxlength' => 10));

        $show_results_options
            = array(
                'brief' => 'Summary fields',
                'full'  => 'All fields',
            );
        $this->addSelect('Show_Brief_Results', 'Display:', $show_results_options);

        // ------------------------------------------------------------
        // ----------------- Genomic Range Filters --------------------
        // ------------------------------------------------------------

        $this->addBasicText('Gene_Symbol', 'Gene:');
        $this->addBasicText('genomic_range', 'Genomic Range:');
        $Base_options = array(
            null => 'Any',
            '37' => 'GRCh37',
        );
        $this->addSelect('Assembly', 'Build:', $Base_options);
        $Base_options = array(
            null => 'Any',
            'F'  => 'Forward',
            'R'  => 'Reverse',
        );
        $this->addSelect('Strand', 'Strand:', $Base_options);

        // ------------------------------------------------------------
        // ----------------- CPG Annotations Filters --------------------
        // ------------------------------------------------------------

        $this->addBasicText('cpg_name', 'CPG name:');

        // Context
        $Base_options = $this->getDistinctValues(
            'genomic_cpg_annotation',
            'island_relation'
        );
        $this->addSelect('Context', 'Context:', $Base_options);

        // Platform
        $Base_options = $this->getDistinctValues(
            'genotyping_platform',
            'Name'
        );
        $this->addSelect('Platform', 'Platform:', $Base_options);

        // Gene_Grp
        $Base_options = array(
            null      => 'Any',
            '1stExon' => '1st Exon',
            '3`UTR'   => '3`UTR',
            '5`UTR'   => '5`UTR',
            'Body'    => 'Body',
            'TSS1500' => 'TSS1500',
            'TSS200'  => 'TSS200',
        );
        $this->addSelect('Gene_Grp', 'Position:', $Base_options);

        // Design
        $Base_options = array(
            null => 'Any',
            'I'  => 'I',
            'II' => 'II',
        );
        $this->addSelect('Design', 'Infinium design:', $Base_options);

        // Color
        $Base_options = array(
            null  => 'Any',
            'Grn' => 'Green',
            'Red' => 'Red',
        );
        $this->addSelect('Color', 'Color:', $Base_options);

        // Enhancer
        $Base_options = array(
            null => 'Any',
            '1'  => 'Yes',
        );
        $this->addSelect('Enhancer', 'Enhancer:', $Base_options);

        // SNP_10
        $Base_options = array(
            null   => 'Any',
            'NULL' => 'No',
            '_'    => 'Yes',
        );
        $this->addSelect('SNP_10', 'SNP:', $Base_options);

        // Reg_Feature_Grp
        $Base_options = $this->getDistinctValues(
            'genomic_cpg_annotation',
            'reg_feature_group'
        );
        $this->addSelect('Reg_Feature_Grp', 'Regulatory feat.:', $Base_options);

        // Fantom_Prom
        $Base_options = array(
            null       => 'Any',
            'NULL'     => 'No',
            'NOT_NULL' => 'Yes',
        );
        $this->addSelect('Fantom_Prom', 'Promoter:', $Base_options);

        // HMM_Island
        $Base_options = array(
            null       => 'Any',
            'NULL'     => 'No',
            'NOT_NULL' => 'Yes',
        );
        $this->addSelect('HMM_Island', 'HMM Island:', $Base_options);

        // DHS
        $Base_options = array(
            null   => 'Any',
            '1'    => 'Yes',
            'NULL' => 'No',
        );
        $this->addSelect('DHS', 'DHS:', $Base_options);

        // DMR
        $Base_options = $this->getDistinctValues(
            'genomic_cpg_annotation',
            'dmr'
        );
        $this->addSelect('DMR', 'DMR:', $Base_options);
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
     * @return string
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
                || (isset($this->EqualityFilters)
                && in_array($field, $this->EqualityFilters))
            ) {
                 $query .= " AND $field = :v_$prepared_key";

            } elseif ($field == "candidate.CandID") {
                $query .= " AND $field = CONVERT( :v_$prepared_key, DECIMAL) ";

            } elseif ($field == "genomic_range") {
                $temp_array = explode(':', $val);
                $chr        = $temp_array[0];
                $query     .= " AND gca.Chromosome = '$chr'";

                if (!empty($temp_array[1]) AND strpos($temp_array[1], '-') ) {
                    $temp_array = explode('-', $temp_array[1]);
                    $from       = $temp_array[0];
                    $to         = $temp_array[1];
                    $query     .= " AND gca.StartLoc < $to";
                    $query     .= " AND gca.EndLoc > $from";
                }

                $query .= " AND :v_$prepared_key IS NOT NULL";

            } elseif ($field == "gca.probe_snp_10" && $val === 'NULL'
                || $field == "gca.dhs" && $val === 'NULL'
            ) {
                $query .= " AND  $field IS NULL and 'NULL' = :v_$prepared_key" ;

            } else {
                $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";

            }
        }
        return $query;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/genomic_browser/js/genomic_browser.js",
                $baseURL . "/genomic_browser/js/cpgColumnFormatter.js",
            )
        );
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
    function getDistinctValues( $table, $column)
    {
        $DB      = \Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            array()
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
            array(null => 'Any')
        );

    }

}
