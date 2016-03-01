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
        $this->columns = array(
                          'psc.Name AS PSC',
                          'candidate.CandID AS DCCID',
                          'candidate.PSCID',
                          'candidate.Gender',
                          'cohort.SubprojectID as Subproject',
                          'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
                          'candidate.ExternalID as externalID',
                          'genomic_cpg.tissue as Tissue',
                          'genomic_cpg.date_collected as DATE_Collected',
                          'genomic_cpg.CpG as CpG',
                          'genomic_cpg.cpg_context as Context',
                          'genomic_cpg.beta_value as Beta_value',
                          'genomic_cpg.methylation as Methylation',
                          'genomic_cpg.gene as Gene',
                          'genomic_cpg.genes_accession_number as Accession_number',
                          'genomic_cpg.assembly as Assembly',
                          'genomic_cpg.chromosome as Chromosome',
                          'genomic_cpg.strand as Strand',
                          'genomic_cpg.cpg_loc as StartLoc',
                          'genomic_cpg.platform as Platform',
                          'genomic_cpg.chip_id as Chip',
                          'genomic_cpg.chip_position as Position',
                         );

        $this->_briefFields = array(
                               'DCCID',
                               'PSCID',
                               'Subproject',
                               'Tissue',
                               'CpG',
                               'Beta_value',
                               'Methylation',
                               'Gene',
                              );

        // Chromosome from genome_loc table
        // INNER JOIN on SNP table.
        // If a candidate has no SNP records, they will not appear.
        $this->query = " FROM candidate 
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID 
                    from session s GROUP BY s.CandID) AS cohort
            ON (cohort.CandID = candidate.CandID) 
            LEFT JOIN psc ON (psc.CenterID = candidate.CenterID)
            JOIN genomic_cpg ON (candidate.CandID = genomic_cpg.CandID)
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
                               'candidate.CenterID',
                               'candidate.CandID',
                               'candidate.PSCID',
                               'candidate.Gender',
                               'cohort.SubprojectID',
                               'candidate.DoB',
                               'candidate.ExternalID',
                               'show_brief_results',
                               'genomic_cpg.chromosome',
                               'genomic_cpg.strand',
                               'genomic_cpg.platform',
                               'genomic_cpg.cpg',
                               'genomic_cpg.beta_value',
                               'genomic_cpg.tissue',
                               'genomic_cpg.date_collected',
                               'genomic_cpg.gene',
                               'genomic_cpg.assembly',
                               'genomic_cpg.genes_accession_number',
                               'genomic_cpg.cpg_context',
                               'genomic_cpg.strand',
                               'genomic_cpg.methylation',
                               'genomic_cpg.chip_id',
                               'genomic_cpg.chip_position',
                               'genomic_cpg.beta_value',
                              );

        $this->formToFilter = array(
                               'centerID'            => 'candidate.CenterID',
                               'DCCID'               => 'candidate.CandID',
                               'PSCID'               => 'candidate.PSCID',
                               'gender'              => 'candidate.Gender',
                               'SubprojectID'        => 'cohort.SubprojectID',
                               'dob'                 => 'candidate.DoB',
                               'External_ID'         => 'candidate.ExternalID',
                               'Show_Brief_Results'  => 'show_brief_results',
                               'CpG'                 => 'genomic_cpg.cpg',
                               'Beta_value'          => 'genomic_cpg.beta_value',
                               'Tissue'              => 'genomic_cpg.tissue',
                               'Date_collected'      => 'genomic_cpg.date_collected',
                               'Gene'                => 'genomic_cpg.gene',
                               'AccNumber'           => 'genomic_cpg.genes_accession_number',
                               'Context'             => 'genomic_cpg.Context',
                               'Strand'              => 'genomic_cpg.Strand',
                               'Methylation'         => 'genomic_cpg.methylation',
                               'Chromosome'          => 'genomic_cpg.chromosome',
                               'Platform'            => 'genomic_cpg.platform',
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
        $this->addBasicText('External_ID', 'External ID:');
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

        // CpG
        $this->addBasicText('CpG', 'CpG:');
        $Base_options = array(
                         null              => 'Any',
                         'Island'          => 'Island',
                         'N_Shore'         => 'North shore',
                         'S_Shelf'         => 'South shelf',
                         'S_Shore'         => 'South shore',
                        );
        $this->addSelect('Context', 'Context:', $Base_options);
        $this->addBasicText('Date_collected', 'Date collected:');
        $Base_options = array(
                         null               => 'Any',
                         'High-methylation' => 'High-methylation',
                         'Partially'        => 'Partially',
                         'Low-methylation'  => 'Low-methylation',
                        );
        $this->addSelect('Methylation', 'Methylation:', $Base_options);
        $this->addBasicText('Beta_value', 'Beta-value:');
        $Base_options = array(
                         null     => 'Any',
                         'Buccal' => 'Buccal',
                        );
        $this->addSelect('Tissue', 'Tissue:', $Base_options);

        // Gene
        $this->addBasicText('Chromosome', 'Chromosome:');
        $Base_options = array(
                         null     => 'Any',
                         'GRCh37' => 'GRCh37',
                        );
        $this->addSelect('Assembly', 'Build:', $Base_options);
        $Base_options = array(
                         null => 'Any',
                         'F'  => 'Foward',
                         'R'  => 'Reverse',
                        );
        $this->addSelect('Strand', 'Strand:', $Base_options);
        $this->addBasicText('Gene', 'Symbol:');

        $DB = Database::singleton();
        $platform_results
            = $DB->select("SELECT distinct platform FROM genomic_cpg ");
        $platform_options = array('' => 'Any');
        foreach ($platform_results as $row => $result ) {
            $name = $result['platform'];
            $platform_options[$name] = $name;
        }
        $this->addSelect('Platform', 'Platform:', $platform_options);

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
                    $this->tpl_data['items'][$x][$i]['value'] = '<a title="UCSC Genome Browser" href="http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&position=' . strtok($item["Accession_number"], ';') . '" target="_blank">' . strtok($val, ';' ) . '</a>';
                }
                if ($key=='CpG') {
                    $assembly = $item['Assembly'];
                    $startLoc = $item['StartLoc'] - 500;
                    $endLoc = $item['StartLoc'] + 500;
	            $this->tpl_data['items'][$x][$i]['value'] = '<a title="UCSC Genome Browser" href="https://genome.ucsc.edu/cgi-bin/hgTracks?db=' . $assembly . '&position=Chr' . $item['Chromosome'] . ':' . $startLoc . '-' . $endLoc . '" target="_blank">' . $val . '</a>';
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
            } else {
                 $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
            }
        }
        return $query;
    }

}
?>
