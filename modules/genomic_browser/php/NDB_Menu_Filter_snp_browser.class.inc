<?php
/**
 * For snp_browser class file
 * Displays SNP genomic variant data.
 * Filterable by candidate, gene or variant fields.
 *
 * PHP version 5
 *
 *  @category Genomic
 *  @package  Main
 *  @author   Christine Rogers <christine.rogers@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link     https://www.github.com/aces/Loris/
 *  Main page: CNV. Submenu: SNP
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_SNP_Browser Class
 *
 * This class is snp_browser Form
 * SNP submenu tab for Genomic Browser
 *
 * @category Genomic
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
*/
class NDB_Menu_Filter_SNP_Browser extends NDB_Menu_Filter
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
                          'psc.Name AS PSC',
                          'candidate.CandID AS DCCID',
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
                          'SNP.ObservedBase as Observed_Base',
                          'SNP.ReferenceBase as Reference_Base',
                          'SNP.ArrayReport as Array_Report',
                          'SNP.Markers as Markers',
                          'SNP.ValidationMethod as Validation_Method',
                          'SNP.Validated as Validated',
                          'SNP.FunctionPrediction as Function_Prediction',
                          'SNP.Damaging as Damaging',
                          'SNP.GenotypeQuality as Genotype_Quality',
                          'SNP.ExonicFunction as Exonic_Function',
                         );

        $this->_briefFields = array(
                               'DCCID',
                               'PSCID',
                               'Subproject',
                               'Chromosome',
                               'StartLoc',
                               'Gene_Name',
                               'Platform',
                               'rsID',
                               'SNP_Name',
                               'SNP_Description',
                               'Function_Prediction',
                              );

        // Chromosome from genome_loc table
        // INNER JOIN on SNP table.
        // If a candidate has no SNP records, they will not appear.
        $this->query = " FROM candidate 
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID 
                    from session s GROUP BY s.CandID) AS cohort
            ON (cohort.CandID = candidate.CandID) 
            LEFT JOIN psc ON (psc.CenterID = candidate.CenterID)
            JOIN SNP ON (candidate.CandID = SNP.CandID)
            LEFT JOIN genome_loc ON (genome_loc.GenomeLocID = SNP.GenomeLocID)  
            LEFT JOIN gene ON (gene.GenomeLocID = SNP.GenomeLocID)
            LEFT JOIN genotyping_platform ON 
              (SNP.PlatformID = genotyping_platform.PlatformID)
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
                               'SNP.rsID',
                               'SNP.SNPExternalName',
                               'SNP.Description',
                               'SNP.SNPExternalSource',
                               'SNP.ObservedBase',
                               'SNP.ReferenceBase',
                               'SNP.ArrayReport',
                               'SNP.Markers',
                               'SNP.ValidationMethod',
                               'SNP.Validated as Validated',
                               'SNP.FunctionPrediction',
                               'SNP.Damaging',
                               'SNP.GenotypeQuality',
                               'SNP.ExonicFunction',
                               'genome_loc.Chromosome',
                               'genome_loc.Strand',
                               'gene.OfficialSymbol',
                               'gene.OfficialName',
                               'genotyping_platform.Name',
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
                               'rsID'                => 'SNP.rsID',
                               'SNP_Name'            => 'SNP.SNPExternalName',
                               'SNP_Description'     => 'SNP.Description',
                               'SNP_External_Source' => 'SNP.SNPExternalSource',
                               'Observed_Base'       => 'SNP.ObservedBase',
                               'Reference_Base'      => 'SNP.ReferenceBase',
                               'Array_Report'        => 'SNP.ArrayReport',
                               'Markers'             => 'SNP.Markers',
                               'Validation_Method'   => 'SNP.ValidationMethod',
                               'Validated'           => 'SNP.Validated',
                               'Function_Prediction' => 'SNP.FunctionPrediction',
                               'Damaging'            => 'SNP.Damaging',
                               'Genotype_Quality'    => 'SNP.GenotypeQuality',
                               'Exonic_Function'     => 'SNP.ExonicFunction',
                               'Chromosome'          => 'genome_loc.Chromosome',
                               'Gene_Symbol'         => 'gene.OfficalSymbol',
                               'Platform'            => 'genotyping_platform.Name',
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

        // SNP
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
        $this->addSelect('Observed_Base', 'Observed Base:', $Base_options);
        $this->addSelect('Reference_Base', 'Reference Base:', $Base_options);

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

        $this->addBasicText('Chromosome', 'Chromosome:');
        $this->addBasicText('Strand', 'Strand:');
        $this->addBasicText('Gene_Symbol', 'Symbol:');
        $this->addBasicText('Gene_Name', 'Name:');

        $DB = Database::singleton();
        $platform_results
            = $DB->select("SELECT distinct Name FROM genotyping_platform ");
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
