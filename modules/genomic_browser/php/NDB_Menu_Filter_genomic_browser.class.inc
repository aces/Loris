<?php

/**
 * For genomic_browser class file
 * Displays genomic variant data; Copy Number Variants in main tab.
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
 * NDB_Menu_Filter_Genomic_Browser Class
 *
 * This class is genomic_browser Form
 *
 * @category Genomic
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
*/
class NDB_Menu_Filter_Genomic_Browser extends NDB_Menu_Filter
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
     * and users w/ multisite privs
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
                          'CNV.Type as CNV_Type',
                          'CNV.Description as CNV_Description',
                          'CNV.CopyNumChange as Copy_Num_Change',
                          'CNV.EventName as Event_Name',
                          'CNV.Common_CNV as Common_CNV',
                          'CNV.Characteristics as Characteristics',
                          'CNV.Inheritance as Inheritance',
                          'CNV.ArrayReport as Array_Report',
                          'CNV.Markers as Markers',
                          'CNV.ValidationMethod as Validation_Method',
                         );

        $this->_briefFields = array(
                               'DCCID',
                               'PSCID',
                               'Subproject',
                               'Chromosome',
                               'StartLoc',
                               'Size',
                               'Gene_Name',
                               'Platform',
                               'CNV_Type',
                               'CNV_Description',
                               'Copy_Num_Change',
                               'Common_CNV',
                              );

        $this->query = " FROM candidate 
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID=candidate.CandID) 
            LEFT JOIN psc ON (psc.CenterID=candidate.CenterID)
            JOIN CNV ON (candidate.CandID = CNV.CandID)
            LEFT JOIN genome_loc ON (genome_loc.GenomeLocID = CNV.GenomeLocID)  
            LEFT JOIN gene ON (gene.GenomeLocID = CNV.GenomeLocID) 
            LEFT JOIN genotyping_platform ON 
              (CNV.PlatformID = genotyping_platform.PlatformID)
            WHERE 
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $DB   = Database::singleton();
        $user = User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
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
                               'CNV.Type',
                               'CNV.CopyNumChange',
                               'CNV.Description',
                               'CNV.EventName',
                               'CNV.Common_CNV',
                               'CNV.Characteristics',
                               'CNV.Inheritance',
                               'CNV.ArrayReport',
                               'CNV.Markers',
                               'CNV.ValidationMethod',
                               'genome_loc.Chromosome',
                               'genome_loc.Strand',
                               'gene.OfficialSymbol',
                               'gene.OfficialName',
                               'genotyping_platform.Name',
                              );

        $this->formToFilter = array(
                               'centerID'           => 'candidate.CenterID',
                               'DCCID'              => 'candidate.CandID',
                               'PSCID'              => 'candidate.PSCID',
                               'gender'             => 'candidate.Gender',
                               'SubprojectID'       => 'cohort.SubprojectID',
                               'External_ID'        => 'candidate.ExternalID',
                               'Show_Brief_Results' => 'show_brief_results',
                               'CNV_Type'           => 'CNV.Type',
                               'Copy_Num_Change'    => 'CNV.CopyNumChange',
                               'CNV_Description'    => 'CNV.Description',
                               'Event_Name'         => 'CNV.EventName',
                               'Common_CNV'         => 'CNV.Common_CNV',
                               'Characteristics'    => 'CNV.Characteristics',
                               'Inheritance'        => 'CNV.Inheritance',
                               'Array_Report'       => 'CNV.ArrayReport',
                               'Markers'            => 'CNV.Markers',
                               'Validation_Method'  => 'CNV.ValidationMethod',
                               'Chromosome'         => 'genome_loc.Chromosome',
                               'Strand'             => 'genome_loc.Strand',
                               'Gene_Symbol'        => 'gene.OfficialSymbol',
                               'Gene_Name'          => 'gene.OfficialName',
                               'Platform'           => 'genotyping_platform.Name',
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

        // CNV
        $CNV_Type_options = array(
                             null      => 'All',
                             'gain'    => 'gain',
                             'loss'    => 'loss',
                             'unknown' => 'Unknown',
                            );
        $this->addSelect('CNV_Type', 'Type:', $CNV_Type_options);
        $this->addBasicText('Copy_Num_Change', 'Copy Number Change:');
        $this->addBasicText('CNV_Description', 'Description:');
        $this->addBasicText('Event_Name', 'Event Name:');

        $Common_CNV_options = array(
                               null => 'Any',
                               'Y'  => 'Yes',
                               'N'  => 'No',
                              );
        $this->addSelect('Common_CNV', 'Common:', $Common_CNV_options);
        $Characteristics_options = array(
                                    null         => 'Any',
                                    'Benign'     => 'Benign',
                                    'Pathogenic' => 'Pathogenic',
                                    'Unknown'    => 'Unknown',
                                   );
        $this->addSelect(
            'Characteristics',
            'Characteristics:',
            $Characteristics_options
        );
        $Inheritance_options = array(
                                null           => 'Any',
                                'de novo'      => 'de novo',
                                'maternal'     => 'maternal',
                                'paternal'     => 'paternal',
                                'unclassified' => 'unclassified',
                                'unknown'      => 'unknown',
                                'NA'           => 'NA',
                               );
        $this->addSelect('Inheritance', 'Inheritance:', $Inheritance_options);

        $this->addBasicText('Chromosome', 'Chromosome:');
        $this->addBasicText('Strand', 'Strand:');
        $this->addBasicText('Gene_Symbol', 'Symbol:');
        $this->addBasicText('Gene_Name', 'Name:');

        $DB = Database::singleton();
        $platform_results
            = $DB->select("SELECT distinct Name FROM genotyping_platform");
        $platform_options = array('' => 'Any');
        foreach ($platform_results as $row => $result) {
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
            $colCount     = 0; //  column counter
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
                    continue;  // loop without incrementing $i
                }

                //Show the URL to the timepoint list on PSCID field
                if ($key == 'PSCID' && $user->hasPermission('access_all_profiles')) {
                    $this->tpl_data['items'][$x][$i]['DCCID'] = $item['DCCID'];
                }
                $this->tpl_data['items'][$x][$i]['name']  = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;

                if ($key=='Subproject' ) {
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
