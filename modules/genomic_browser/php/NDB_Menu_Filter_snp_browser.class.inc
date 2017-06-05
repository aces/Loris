<?php
/**
 * For snp_browser class file, a subtab in the Genomic Browser
 * Displays SNP genomic variant data.
 * Filterable by candidate, gene or variant fields.
 *
 * PHP version 5
 *
 *  @category   Genomic
 *  @package    Main
 *  @subpackage Genomic
 *  @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 *  @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link       https://www.github.com/aces/Loris/
 *  Main page: genomic_browser. Submenu: SNP
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_SNP_Browser Class
 *
 * This class is snp_browser Form
 * SNP submenu tab for Genomic Browser
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link       https://github.com/aces/Loris
*/
class NDB_Menu_Filter_SNP_Browser extends NDB_Menu_Filter
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
                          'psc.Name AS PSC',
                          'LPAD(candidate.CandID, 6, "0") AS DCCID',
                          'candidate.PSCID',
                          'candidate.Gender',
                          'cohort.SubprojectID as Subproject',
                          'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
                          'candidate.ExternalID as externalID',
                          'genome_loc.Chromosome as Chromosome',
                          'genome_loc.Strand as Strand',
                          'genome_loc.StartLoc as StartLoc',
                          'genome_loc.EndLoc as EndLoc',
                          'genome_loc.Size as Size',
                          'gene.OfficialSymbol as Gene_Symbol',
                          'gene.OfficialName as Gene_Name',
                          'genotyping_platform.Name as Platform',
                          'SNP.rsID as rsID',
                          'SNP.SNPExternalName as SNP_Name',
                          'SNP.Description as SNP_Description',
                          'SNP.SNPExternalSource as External_Source',
                          'SNP_candidate_rel.AlleleA as Allele_A',
                          'SNP_candidate_rel.AlleleB as Allele_B',
                          'SNP.ReferenceBase as Reference_Base',
                          'SNP.MinorAllele as Minor_Allele',
                          'SNP_candidate_rel.ArrayReport as Array_Report',
                          'SNP.Markers as Markers',
                          'SNP_candidate_rel.ValidationMethod as Validation_Method',
                          'SNP_candidate_rel.Validated as Validated',
                          'SNP.FunctionPrediction as Function_Prediction',
                          'SNP.Damaging as Damaging',
                          'SNP_candidate_rel.GenotypeQuality as Genotype_Quality',
                          'SNP.ExonicFunction as Exonic_Function',
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
                 'externalID',
                 'Chromosome',
                 'Strand',
                 'StartLoc',
                 'EndLoc',
                 'Size',
                 'Gene_Symbol',
                 'Gene_Name',
                 'Platform',
                 'SNP_Name',
                 'SNP_Description',
                 'External_Source',
                 'Array_Report',
                 'Markers',
                 'Validation_Method',
                 'Validated',
                 'Genotype_Quality',
                )
            )
        );

        // Chromosome from genome_loc table
        // INNER JOIN on SNP_candidate_rel table. //##
        // If a candidate has no SNP records, they will not appear.
        $this->query = " FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                    from session s GROUP BY s.CandID) AS cohort
            ON (cohort.CandID = candidate.CandID)
            LEFT JOIN psc ON (psc.CenterID = candidate.CenterID)
            JOIN SNP_candidate_rel ON (candidate.CandID = SNP_candidate_rel.CandID)
            LEFT JOIN SNP ON (SNP.SNPID = SNP_candidate_rel.SNPID)
            LEFT JOIN genome_loc ON (genome_loc.GenomeLocID = SNP.GenomeLocID)
            LEFT JOIN gene ON (gene.GenomeLocID = SNP.GenomeLocID)
            LEFT JOIN genotyping_platform ON
              (SNP_candidate_rel.PlatformID = genotyping_platform.PlatformID)
            WHERE
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $DB   = Database::singleton();
        $user = User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            // restrict data to own site
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND candidate.CenterID IN (" . $site_arr . ")";
        }

        $this->order_by = 'psc.Name, candidate.CandID DESC';

        $this->limit = 10000;

        $this->validFilters = array(
                               'candidate.CenterID',
                               'candidate.CandID',
                               'candidate.PSCID',
                               'candidate.Gender',
                               'cohort.SubprojectID',
                               'candidate.DoB',
                               'candidate.ExternalID',
                               'show_brief_results',
                               'SNP.rsID',
                               'SNP.SNPExternalName',
                               'SNP.Description',
                               'SNP.SNPExternalSource',
                               'SNP_candidate_rel.AlleleA',
                               'SNP_candidate_rel.AlleleB',
                               'SNP.ReferenceBase',
                               'SNP.MinorAllele',
                               'SNP_candidate_rel.ArrayReport',
                               'SNP.Markers',
                               'SNP_candidate_rel.ValidationMethod',
                               'SNP_candidate_rel.Validated as Validated',
                               'SNP.FunctionPrediction',
                               'SNP.Damaging',
                               'SNP_candidate_rel.GenotypeQuality',
                               'SNP.ExonicFunction',
                               'genome_loc.Chromosome',
                               'genome_loc.Strand',
                               'genome_loc.StartLoc',
                               'genome_loc.EndLoc',
                               'genome_loc.Strand',
                               'gene.OfficialSymbol',
                               'gene.OfficialName',
                               'genotyping_platform.Name',
                               'genomic_range',
                              );

        $ftf = array(
                'centerID'            => 'candidate.CenterID',
                'DCCID'               => 'candidate.CandID',
                'PSCID'               => 'candidate.PSCID',
                'gender'              => 'candidate.Gender',
                'SubprojectID'        => 'cohort.SubprojectID',
                'dob'                 => 'candidate.DoB',
                'External_ID'         => 'candidate.ExternalID',
                'Show_Brief_Results'  => 'show_brief_results',
                'rsID'                => 'SNP.rsID',
                'SNP_Name'            => 'SNP.SNPExternalName',
                'SNP_Description'     => 'SNP.Description',
                'SNP_External_Source' => 'SNP.SNPExternalSource',
                'Allele_A'            => 'SNP_candidate_rel.AlleleA',
                'Allele_B'            => 'SNP_candidate_rel.AlleleB',
                'Reference_Base'      => 'SNP.ReferenceBase',
                'Minor_Allele'        => 'SNP.MinorAllele',
                'Array_Report'        => 'SNP.ArrayReport',
                'Markers'             => 'SNP.Markers',
                'Validation_Method'   => 'SNP_candidate_rel.ValidationMethod',
                'Validated'           => 'SNP_candidate_rel.Validated',
                'Function_Prediction' => 'SNP.FunctionPrediction',
                'Damaging'            => 'SNP.Damaging',
                'Genotype_Quality'    => 'SNP_candidate_rel.GenotypeQuality',
                'Exonic_Function'     => 'SNP.ExonicFunction',
                'Chromosome'          => 'genome_loc.Chromosome',
                'Gene_Symbol'         => 'gene.OfficalSymbol',
                'genomic_range'       => 'genomic_range',
                'Platform'            => 'genotyping_platform.Name',
               );

        $this->formToFilter = $ftf;

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
            $site_arr = $user->getData('CenterIDs');
            foreach ($site_arr as $key => $val) {
                $site[$key] = &Site::singleton($val);
                if ($site[$key]->isStudySite()) {
                    $list_of_sites[$val] = $site[$key]->getCenterName();
                }
                $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
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

        $show_results_options = array(
                                 'brief' => 'Summary fields',
                                 'full'  => 'All fields',
                                );
        $this->addSelect('Show_Brief_Results', 'Display:', $show_results_options);

        // SNP

        $Base_options = array(
                         null => 'Any',
                         '37' => 'GRCh37',
                        );
        $this->addSelect('Assembly', 'Build:', $Base_options);

        $this->addBasicText('rsID', 'rsID:');
        $this->addBasicText('SNP_Name', 'Name:');
        $this->addBasicText('SNP_Description', 'Description:');
        $this->addBasicText('SNP_External_Source', 'External Source:');
        $Base_options = array(
                         null => 'Any',
                         'A'  => 'A',
                         'C'  => 'C',
                         'T'  => 'T',
                         'G'  => 'G',
                        );
        $this->addSelect('Allele_A', 'Allele A:', $Base_options);
        $this->addSelect('Allele_B', 'Allele B:', $Base_options);
        $this->addSelect('Reference_Base', 'Reference Base:', $Base_options);
        $this->addSelect('Minor_Allele', 'Minor Allele:', $Base_options);

        $this->addSelect(
            'Validated',
            'Validated:',
            array(
             null => 'Any',
             '0'  => '0',
             '1'  => '1',
            )
        );
        $this->addSelect(
            'Function_Prediction',
            'Function Prediction:',
            array(
             null          => 'Any',
             'exonic'      => 'exonic',
             'ncRNAexonic' => 'ncRNAexonic',
             'splicing'    => 'splicing',
             'UTR3'        => 'UTR3',
             'UTR5'        => 'UTR5',
            )
        );
        $this->addSelect(
            'Damaging',
            'Damaging:',
            array(
             null => 'Any',
             'D'  => 'D',
             'NA' => 'NA',
            )
        );
        $this->addBasicText('Genotype_Quality', 'Genotype Quality:');
        $this->addBasicText('Exonic_Function', 'Exonic Function:');

        $Base_options = array(
                         null => 'Any',
                         'F'  => 'Forward',
                         'R'  => 'Reverse',
                        );
        $this->addSelect('Strand', 'Strand:', $Base_options);

        $this->addBasicText('genomic_range', 'Genomic Range:');
        $this->addBasicText('Gene_Symbol', 'Gene:');
        $this->addBasicText('Gene_Name', 'Name:');

        $DB = Database::singleton();
        $platform_results
            = $DB->pselect(
                "SELECT distinct Name FROM genotyping_platform ",
                array()
            );

        $platform_options = array('' => 'Any');
        foreach ($platform_results as $row => $result ) {
            $name = $result['Name'];
            $platform_options[$name] = $name;
        }
        $this->addSelect('Platform', 'Platform:', $platform_options);
        $Array_Report_options = array(
                                 null        => 'Any',
                                 'Abnormal'  => 'Abnormal',
                                 'Normal'    => 'Normal',
                                 'Pending'   => 'Pending',
                                 'Uncertain' => 'Uncertain',
                                );
        $this->addSelect('Array_Report', 'Array Report:', $Array_Report_options);
        $this->addBasicText('Markers', 'Markers:');
        $this->addBasicText('Validation_Method', 'Validation Method:');

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
                $query .= " AND $field = CONVERT( :v_$prepared_key, DECIMAL) ";
            } elseif ($field == "genomic_range") {
                $temp_array = explode(':', $val);
                $chr        = str_replace('chr', '', $temp_array[0]);
                $query     .= " AND genome_loc.Chromosome = '$chr'";

                if (!empty($temp_array[1]) AND strpos($temp_array[1], '-') ) {
                    $temp_array = explode('-', $temp_array[1]);
                    $from       = $temp_array[0];
                    $to         = $temp_array[1];
                    $query     .= " AND genome_loc.StartLoc <= $to";
                    $query     .= " AND genome_loc.EndLoc >= $from";
                }
                $query .= " AND :v_$prepared_key IS NOT NULL";

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
             $baseURL . "/genomic_browser/js/snpColumnFormatter.js",
            )
        );
    }

}
?>
