<?php
/**
 * For genomic_browser class file
 * Main Genomic Browser tab
 * Displays genomic profiles - genomic data available per candidate
 * Filterable by candidate or genomic criteria.
 *
 * PHP version 7
 *
 *  @category LORIS_Module
 *  @package  Genomics
 *  @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser;

/**
 * Genomic_Browser Class
 *
 * This class is genomic_browser Form
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
*/
class Genomic_Browser extends \NDB_Menu_Filter
{
    /**
     * Variables to enable special filter behaviour -
     * Show brief results or show full results (all available fields)
     * used in (overridden) _addValidFilters function below
     */
    var $_displayBrief = true;  // default: display only Brief results

    /**
     * Tell the Caller that data will be queried using ajax and after
     * the HTML page rendering.
     */
    var $AjaxModule = true;

    /**
     * Overloading this method to allow access to site users (own site only)
     * and users w/ multisite privs
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
     * @note   overloaded function
     * @return void
    */
    function _setupVariables()
    {
        // set the class variables
        $file_subquery = "
          CASE WHEN EXISTS (
            select genomicfileid
            from genomic_candidate_files_rel
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $snp_subquery  = "
          CASE WHEN EXISTS (
            select snpid
            from SNP_candidate_rel
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $cnv_subquery  = "
          CASE WHEN EXISTS (
            select cnvid
            from CNV
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $cpg_subquery  = "
          CASE WHEN EXISTS (
            select cpg_name
            from genomic_sample_candidate_rel
            left join genomic_cpg using (sample_label)
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $this->columns = array(
                          'psc.Name AS PSC',
                          'LPAD(candidate.CandID, 6, "0") AS DCCID',
                          'candidate.PSCID',
                          'candidate.Sex',
                          'cohort.SubprojectID as Subproject',
                          'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
                          'candidate.ExternalID as externalID',
                          "$file_subquery as File",
                          "$snp_subquery as SNP",
                          "$cnv_subquery as CNV",
                          "$cpg_subquery as CPG",
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
                 'externalID',
                 'DoB',
                )
            )
        );

        $this->query = " FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID=candidate.CandID)
            LEFT JOIN psc ON (psc.CenterID= candidate.CenterID)
            WHERE
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $DB   = \Database::singleton();
        $user = \User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            // allow only to view own site data
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND candidate.CenterID IN (" . $site_arr . ")";
        }

        $this->group_by = '';

        $this->order_by = 'psc.Name, candidate.CandID DESC';

        $this->validFilters = array(
                               'candidate.CenterID',
                               'candidate.CandID',
                               'candidate.PSCID',
                               'candidate.Sex',
                               'cohort.SubprojectID',
                               'candidate.DoB',
                               'candidate.ExternalID',
                               'show_brief_results',
                               'File',
                               'CNV',
                               'SNP',
                               'CPG',
                              );

        $this->validHavingFilters = array(
                                     'File',
                                     'CNV',
                                     'SNP',
                                     'CPG',
                                    );

        $ftf = array(
                'centerID'           => 'candidate.CenterID',
                'DCCID'              => 'candidate.CandID',
                'PSCID'              => 'candidate.PSCID',
                'sex'                => 'candidate.Sex',
                'SubprojectID'       => 'cohort.SubprojectID',
                'External_ID'        => 'candidate.ExternalID',
                'Show_Brief_Results' => 'show_brief_results',
                'File'               => 'File',
                'SNP'                => 'SNP',
                'CNV'                => 'CNV',
                'CPG'                => 'CPG',
               );

        $this->formToFilter = $ftf;

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
            $list_of_sites = $user->getStudySites();
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        // SubprojectID
        $list_of_subprojects = \Utility::getSubprojectList();

        // add form elements
        $this->addSelect('centerID', 'Site:', $list_of_sites);
        $this->addBasicText('DCCID', 'DCCID:');
        $this->addBasicText('PSCID', 'PSCID:');
        $this->addBasicText('External_ID', 'External ID:');
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

        $any_options = array(
                        ''  => null,
                        'Y' => 'Yes',
                        'N' => 'No',
                       );
        $this->addSelect('File', 'Files:', $any_options);
        $this->addSelect('SNP', 'SNPs found:', $any_options);
        $this->addSelect('CNV', 'CNVs found:', $any_options);
        $this->addSelect('CPG', 'CPGs found:', $any_options);

        $show_results_options = array(
                                 'brief' => 'Summary fields',
                                 'full'  => 'All fields',
                                );
        $this->addSelect('Show_Brief_Results', 'Display:', $show_results_options);

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
                || strtolower(substr($field, -3)) == 'sex'
                || (isset($this->EqualityFilters)
                && in_array($field, $this->EqualityFilters))
            ) {
                 $query .= " AND $field = :v_$prepared_key";
            } elseif ($field == "candidate.CandID") {
                $query .= " AND $field = CONVERT( :v_$prepared_key, DECIMAL) ";
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
             $baseURL . "/genomic_browser/js/profileColumnFormatter.js",
            )
        );
    }
}

