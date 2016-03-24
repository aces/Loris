<?php
/**
 * For genomic_browser class file
 * Main Genomic Browser tab
 * Displays genomic profiles - genomic data available per candidate
 * Filterable by candidate or genomic criteria.
 *
 * PHP version 5
 *
 *  @category   Genomic
 *  @package    Main
 *  @subpackage Genomic
 *  @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 *  @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link       https://www.github.com/aces/Loris/
 *  Main tab: Genomic Profiles. Submenus: CNV,SNP,GWAS
 */

require_once 'NDB_Menu_Filter.class.inc';
/**
 * NDB_Menu_Filter_Genomic_Browser Class
 *
 * This class is genomic_browser Form
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link       https://github.com/aces/Loris
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
                          'LPAD(candidate.CandID, 6, "0") AS DCCID',
                          'candidate.PSCID',
                          'candidate.Gender',
                          'cohort.SubprojectID as Subproject',
                          'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
                          'candidate.ExternalID as externalID',
                          'gbf1.`FileName` as Top_Raw_File',
                          'count(DISTINCT gbf1.`FileName`) as Raw_Filesets',
                          'gbf2.FileName as Top_Cleaned_File',
                          'count(DISTINCT gbf2.FileName) as Cleaned_Filesets',
                          'S.SNPCount as SNPs',
                          'C.CNVCount as CNVs',
                          'M.CPGCount as CPGs',
                         );

        $this->_briefFields = array(
                               'DCCID',
                               'PSCID',
                               'Total_Filesets',
                               'Top_Raw_File',
                               'Raw_Filesets',
                               'Top_Cleaned_File',
                               'Cleaned_Filesets',
                               'SNPs',
                               'CNVs',
                               'CPGs',
                              );

        $this->query = " FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID=candidate.CandID)
            LEFT JOIN psc ON (psc.CenterID= candidate.CenterID)

            LEFT JOIN  `genomic_files` AS gbf1 ON candidate.CandID = gbf1.CandID
                AND gbf1.Category='raw'
            LEFT JOIN  `genomic_files` AS gbf2 ON candidate.CandID = gbf2.CandID
                AND gbf2.Category='cleaned'
            LEFT JOIN (select scr.CandID, count(scr.CandID) as SNPCount
                from SNP_candidate_rel as scr GROUP BY scr.CandID) as S
                 ON (candidate.CandID = S.CandID)
            LEFT JOIN (select CNV.CandID, count(CNV.CandID) as CNVCount
                from CNV GROUP BY CNV.CandID) AS C
                ON (C.CandID=candidate.CandID)
            LEFT JOIN  (select gscr.CandID, COUNT(cpg_name) as CPGCount 
                from genomic_cpg gc 
                JOIN genomic_sample_candidate_rel gscr 
                    USING (sample_label) 
                group by gscr.CandID) as M
                ON (M.CandID = candidate.CandID)
            WHERE
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $DB   = Database::singleton();
        $user = User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            $this->query .= " AND candidate.CenterID=";
            $this->query .= $DB->quote($user->getCenterID());
        }

        $this->group_by     = 'candidate.CandID';
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
                               'rawfiles.rawFileCount',
                               'cleanedfiles.cleanedFileCount',
                               'C.CNVCount',
                               'S.SNPCount',
                               'M.CPGCount',
                              );

        $ftf = array(
                'centerID'           => 'candidate.CenterID',
                'DCCID'              => 'candidate.CandID',
                'PSCID'              => 'candidate.PSCID',
                'gender'             => 'candidate.Gender',
                'SubprojectID'       => 'cohort.SubprojectID',
                'External_ID'        => 'candidate.ExternalID',
                'Show_Brief_Results' => 'show_brief_results',
                'Raw_Filesets'       => 'rawfiles.rawFileCount',
                'Cleaned_Filesets'   => 'cleanedfiles.cleanedFileCount',
                'SNP_Hits'           => 'S.SNPCount',
                'CNV_Hits'           => 'C.CNVCount',
                'CPG'                => 'M.CPGCount',
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
            $site = Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $centerIDdata  = $user->getData('CenterID');
                $siteData      = $user->getData('Site');
                $list_of_sites = array($centerIDdata => $siteData);
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

        $any_options = array(
                        ''  => null,
                        '1' => 'Any',
                        '0' => 'None',
                       );
        $this->addSelect('Raw_Filesets', 'Raw Filesets:', $any_options);
        $this->addSelect('Cleaned_Filesets', 'Cleaned Filesets:', $any_options);
        $this->addSelect(
            'GWAS_Results',
            'GWAS top-100 p-value results:',
            $any_options
        );
        $this->addSelect('SNP_Hits', 'SNPs found:', $any_options);
        $this->addSelect('CNV_Hits', 'CNVs found:', $any_options);
        $this->addSelect('CPG', 'CPGs found:', $any_options);

        $show_results_options = array(
                                 'brief' => 'Summary fields',
                                 'full'  => 'All fields',
                                );
        $this->addSelect('Show_Brief_Results', 'Display:', $show_results_options);

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
                if ($col == "Top_Raw_File" || $col == "Top_Cleaned_File") {
                    continue;
                }
                $this->headers[] = $col;
            }
            // Note this includes an extra column: Total Filesets

            // copy column headings to new array, then replace
            $colCount     = 0; //  column counter
            $maxCols      = sizeof($this->tpl_data['headers']); //limit
            $briefHeaders = array();  // reset
            foreach ($this->headers as $header) {
                // special case: insert header for a derived column
                if ($header == "Total_Filesets") {
                    $headerArray = array(
                                    "name"        => $header,
                                    "displayName" => "All Filesets",
                                    "fieldOrder"  => "ASC",
                                   );

                    $this->tpl_data['headers'][$colCount] = $headerArray;
                    $briefHeaders[] = $headerArray;
                    $colCount++; // increment and continue processing
                    continue;
                }

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
            //calculate row number
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i           = 1;
            $rawFile     = ""; // re-initialize for each row
            $cleanedFile = "";
            foreach ($item as $key => $val) {
                if ($this->_displayBrief && !in_array($key, $this->_briefFields)) {
                    continue;  // loop without incrementing $i
                }

                //Show the URL to the timepoint list on PSCID field
                if ($key == 'PSCID' && $user->hasPermission('access_all_profiles')) {
                    $this->tpl_data['items'][$x][$i]['DCCID']
                        = str_pad($item['DCCID'], 6, '0', STR_PAD_LEFT);
                }

                // don't store to tpl_data, just store col value
                // in $rawFile/$cleanedFile variable, and loop
                if ($key=='Top_Raw_File') {
                    // value may be blank ?
                    $rawFile = $val;
                    // increment to leave Total_Filesets column blank in tpl_data
                    $i++;
                    continue;
                } elseif ($key=='Top_Cleaned_File') {
                    $cleanedFile = $val;
                    continue;
                }

                $this->tpl_data['items'][$x][$i]['name']  = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;

                if ($key=='Raw_Filesets') {
                    $this->tpl_data['items'][$x][$i]['file'] = $rawFile;
                } elseif ($key=='Cleaned_Filesets') {
                    $this->tpl_data['items'][$x][$i]['file'] = $cleanedFile;

                    // back-calculate Total Count of Filesets
                    // by adding Raw and Cleaned cols
                    $totalCol = $i - 2; // 2 columns prior to Cleaned_Filesets column
                    $totalVal = 0;  // initialize
                    // assumed raw is previous col, already processed
                    $rawCol = $i - 1; // 1 column prior
                    $rawVal = $this->tpl_data['items'][$x][$rawCol]['value'];

                    if (is_numeric($val)) { // Cleaned Val
                        $totalVal = $val;
                    }
                    if (is_numeric($rawVal)) {
                        $totalVal += $rawVal;
                    }

                    if ($totalVal == '0') { //blank if none
                        $totalVal = "";
                    }
                    $this->tpl_data['items'][$x][$totalCol]['value'] = $totalVal;

                    $this->tpl_data['items'][$x][$totalCol]['name']
                        = "Total_Filesets";

                } // end if Cleaned

                // Print '' if no data
                if ($key=='Raw_Filesets' || $key=='Cleaned_Filesets'
                    || $key == 'SNPs' || $key == 'CNVs' || $key == 'CPGs'
                ) {
                    if (is_null($val) || $val === '0') {
                        $this->tpl_data['items'][$x][$i]['value'] = '';
                    }
                }  // if is_numeric, set = $val

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
            } elseif ($field == "rawfiles.rawFileCount"
                || $field == "cleanedfiles.cleanedFileCount"
                || $field == "S.SNPCount"
                || $field == "C.CNVCount"
                || $field == "M.CPGCount"
            ) {
                if ($val == "1") {  // if ANY found i.e. >= 1
                    $query .= " AND $field >= :v_$prepared_key";
                } elseif ($val == "0") { // if NONE found i.e. = 0
                    $query .= " AND $field = :v_$prepared_key";
                }
            } elseif ($field == "candidate.CandID") {
                $query .= " AND $field = " . ltrim($val, '0');
            } else {
                 $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
            }
        }
        return $query;
    }

}
?>
