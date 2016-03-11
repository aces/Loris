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
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_CPG_Browser Class
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
class NDB_Menu_Filter_CpG_Browser extends NDB_Menu_Filter
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
        $this->_displayBrief = !(isset($_REQUEST['format']));
        $this->columns       = array(
                                'psc.Name AS PSC',
                                'LPAD(candidate.CandID, 6, "0") AS DCCID',
                                'candidate.PSCID',
                                'candidate.Gender',
                                'cohort.SubprojectID as Subproject',
                                'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
                                'gscr.sample_label as Sample',
                                'cpg.cpg_name as CPG',
                                'cpg.beta_value as Beta_value',
                                'genome_loc.Chromosome as Chromosome',
                                'genome_loc.Strand as Strand',
                                'genome_loc.StartLoc as StartLoc',
                                'gca.probe_id_a as Probe_A',
                                'gca.address_id_a as Probe_Loc_A',
                                'gca.probe_seq_a as Probe_Seq_A',
                                'gca.probe_id_b as Probe_B',
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

        $this->_briefFields = array(
                               'DCCID',
                               'PSCID',
                               'Subproject',
                               'CPG',
                               'Beta_value',
                               'Chromosome',
                               'Gene',
                              );

        // Chromosome from genome_loc table
        // INNER JOIN on table.
        // If a candidate has no CPG records, they will not appear.
        $this->query = " FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID 
                    from session s GROUP BY s.CandID) AS cohort
            ON (cohort.CandID = candidate.CandID) 
            LEFT JOIN psc ON (psc.CenterID = candidate.CenterID)
            LEFT JOIN genomic_sample_candidate_rel gscr ON (gscr.candidate_id = candidate.ID)
            LEFT JOIN genomic_cpg cpg ON (gscr.sample_label = cpg.sample_label)
            LEFT JOIN genomic_cpg_annotation gca USING (cpg_name)
            LEFT JOIN genome_loc ON (genome_loc.GenomeLocID = gca.location_id)
            LEFT JOIN genotyping_platform platform ON (gca.platform_id = platform.PlatformID)
            WHERE 
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $DB   = Database::singleton();
        $user = User::singleton();

        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            // restrict data to own site
            $this->query .= " AND candidate.CenterID=";
            $this->query .= $DB->quote($user->getCenterID());
        }

        $this->order_by     = 'psc.Name, candidate.CandID DESC';
        $this->validFilters = array(
                               'PSC',
                               'candidate.CandID',
                               'candidate.PSCID',
                               'candidate.Gender',
                               'cohort.SubprojectID',
                               'DoB',
                               'show_brief_results',
                               'Sample',
                               'CPG',
                               'Beta_value',
                               'Chromosome',
                               'Strand',
                               'StartLoc',
                               'Platform',
                               'Gene',
                               'Assembly',
                               'Accession_number',
                               'Context',
                               'Beta_value',
                               'Probe_A',
                               'Probe_Loc_A',
                               'Probe_Seq_A',
                               'Probe_B',
                               'Probe_Loc_B',
                               'Probe_Seq_B',
                               'Design',
                               'Color',
                               'SNP_10',
                               'Gene_Grp',
                               'Island_Loc',
                               'Fantom_Prom',
                               'DMR',
                               'Enhancer',
                               'HMM_Island',
                               'Reg_Feature_Loc',
                               'Reg_Feature_Grp',
                               'DHS',
                               'Platform',
                              );

        $this->formToFilter = array(
                'centerID'            => 'candidate.CenterID',
                'DCCID'               => 'candidate.CandID',
                'PSCID'               => 'candidate.PSCID',
                'gender'              => 'candidate.Gender',
                'SubprojectID'        => 'cohort.SubprojectID',
                'dob'                 => 'candidate.DoB',
                'Show_Brief_Results'  => 'show_brief_results',
                'Chromosome'          => 'genome_loc.Chromosome',
                'Gene_Symbol'         => 'gca.gene_name',
                'Platform'            => 'platform.Name',
                'Strand'              => 'genome_loc.Strand',
                'StartLoc'            => 'genome_loc.StartLoc',
                'Assembly'            => 'gca.genome_build',
                'Accession_number'    => 'gca.gene_acc_num',
                'Context'             => 'gca.island_relation',
                'Beta_value'          => 'cpg.beta_value',
                'Probe_A'             => 'gca.probe_id_a',
                'Probe_Loc_A'         => 'gca.address_id_a',
                'Probe_Seq_A'         => 'gca.probe_seq_a',
                'Probe_B'             => 'gca.probe_id_b',
                'Probe_Loc_B'         => 'gca.address_id_b',
                'Probe_Seq_B'         => 'gca.probe_seq_b',
                'Design'              => 'gca.design_type',
                'Color'               => 'gca.color_channel',
                'SNP_10'              => 'gca.probe_snp_10',
                'Gene_Grp'            => 'gca.gene_group',
                'Island_Loc'          => 'gca.island_loc',
                'Fantom_Prom'         => 'gca.fantom_promoter_loc',
                'DMR'                 => 'gca.dmr',
                'Enhancer'            => 'gca.enhancer',
                'HMM_Island'          => 'gca.hmm_island_loc',
                'Reg_Feature_Loc'     => 'gca.reg_feature_loc',
                'Reg_Feature_Grp'     => 'gca.reg_feature_group',
                'DHS'                 => 'gca.dhs',
               );

/*
                                'gscr.sample_label as Sample',
                                'cpg.cpg_name as CPG',
                                'cpg.beta_value as Beta_value',
                                'genome_loc.Chromosome as Chromosome',
                                'genome_loc.Strand as Strand',
                                'genome_loc.StartLoc as StartLoc',
                                'gca.probe_id_a as Probe_A',
                                'gca.address_id_a as Probe_Loc_A',
                                'gca.probe_seq_a as Probe_Seq_A',
                                'gca.probe_id_b as Probe_B',
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
*/
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

        // PSC
        if ($user->hasPermission('genomic_browser_view_allsites')) {
            // has access to all sites genomic data
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList();
            if (is_array($list_of_sites)) {
                $list_of_sites = array('' => 'Any') + $list_of_sites;
            }
        } else {
            // allow only to view own site data
            $site = Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $list_of_sites
                    = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        // SubprojectID
        $list_of_subprojects = Utility::getSubprojectList();

        // add form elements
        $this->addSelect('centerID', 'Site:', $list_of_sites);
        $this->addBasicText('DCCID', 'DCCID:');
        $this->addBasicText('PSCID', 'PSCID:');
        $this->addSelect(
            'gender',
            'Gender:',
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

/*
                'Assembly'            => 'Assembly',
                'Accession_number'    => 'Accession_number',
                'Beta_value'          => 'Beta_value',
                'Probe_A'             => 'Probe_A',
                'Probe_Loc_A'         => 'Probe_Loc_A',
                'Probe_Seq_A'         => 'Probe_Seq_A',
                'Probe_B'             => 'Probe_B',
                'Probe_Loc_B'         => 'Probe_Loc_B',
                'Probe_Seq_B'         => 'Probe_Seq_B',
                'Design'              => 'Design',
                'Color'               => 'Color',
                'SNP_10'              => 'SNP_10',
                'Gene_Grp'            => 'Gene_Grp',
                'Island_Loc'          => 'Island_Loc',
                'Fantom_Prom'         => 'Fantom_Prom',
                'DMR'                 => 'DMR',
                'Enhancer'            => 'Enhancer',
                'HMM_Island'          => 'HMM_Island',
                'Reg_Feature_Loc'     => 'Reg_Feature_Loc',
                'Reg_Feature_Grp'     => 'Reg_Feature_Grp',
                'DHS'                 => 'DHS',
*/
        $this->addBasicText('Chromosome', 'Chromosome:');
        $this->addBasicText('Gene_Symbol', 'Gene:');
        $this->addBasicText('StartLoc', 'Location:');
        $this->addBasicText('Beta_value', 'Beta-value:');

        // Assembly
        $distinct_values = $this->getDistinctValue('genomic_cpg_annotation', 'genome_build');
        $Base_options = array();
        foreach ($distinct_values as $option) {
            if ($option == NULL) {
                $Base_options[null] = 'Any';
            } else {
                $Base_options[$option] = $option;
            }
        }
        $this->addSelect('Platform', 'Platform:', $Base_options);

        // Strand
        $Base_options = array(
                         null => 'Any',
                         'F'  => 'Foward',
                         'R'  => 'Reverse',
                        );
        $this->addSelect('Strand', 'Strand:', $Base_options);

        // Platform
        $distinct_values = $this->getDistinctValue('genotyping_platform', 'Name');
        $Base_options = array();
        foreach ($distinct_values as $option) {
            if ($option == NULL) {
                $Base_options[null] = 'Any';
            } else {
                $Base_options[$option] = $option;
            }
        }
        $this->addSelect('Platform', 'Platform:', $Base_options);

        // Context
        $distinct_values = $this->getDistinctValue('genomic_cpg_annotation', 'island_relation');
        $Base_options = array();
        foreach ($distinct_values as $option) {
            if ($option == NULL) {
                $Base_options[null] = 'Any';
            } else {
                $Base_options[$option] = $option;
            }
        }
        $this->addSelect('Context', 'Context:', $Base_options);



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
                if ($key == 'PSCID' && $user->hasPermission('access_all_profiles')) {
                    $this->tpl_data['items'][$x][$i]['DCCID'] = $item['DCCID'];
                }
                $this->tpl_data['items'][$x][$i]['name']  = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;

                if ($key=='Subproject') {
                    if (is_null($val)) {
                        $this->tpl_data['items'][$x][$i]['value'] = null;
                    } else {
                        $this->tpl_data['items'][$x][$i]['value']
                            = $subprojectlist[$val];
                    }
                }
                if ($key=='Gene') {
                    $this->tpl_data['items'][$x][$i]['value'] = '
    <a title="UCSC Genome Browser" 
       href="http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&position='
                    . strtok($item["Accession_number"], ';') . '" 
       target="_blank">' . strtok($val, ';') . '</a>';
                }
                if ($key=='CpG') {
                    $assembly = $item['Assembly'];
                    $startLoc = $item['StartLoc'] - 500;
                    $endLoc   = $item['StartLoc'] + 500;
                    $this->tpl_data['items'][$x][$i]['value'] = '
    <a title="UCSC Genome Browser"
       href="https://genome.ucsc.edu/cgi-bin/hgTracks?db='
                    . $assembly . '&position=Chr' . $item['Chromosome'] . ':'
                    . $startLoc . '-' . $endLoc . '" target="_blank">'
                    . $val . '</a>';
                }
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
            } elseif ($field == "candidate.CandID") {
                $query .= " AND $field = " . ltrim($val, '0');
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
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/genomic_browser/js/genomic_browser.js",
            )
        );
    }

    function getDistinctValue( $table, $column) 
    {
        $DB = Database::singleton();
        $results = $DB->pselect("SELECT DISTINCT $column FROM $table ", array());
        return array_map( function($e) {
            return array_values($e)[0];
        }, $results);
    }
}
?>
