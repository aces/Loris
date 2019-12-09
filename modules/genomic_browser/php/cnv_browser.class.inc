<?php
/**
 * For cnv_browser class file, a subtab in the Genomic Browser
 * Displays CNV (Copy Number Variant) genomic data
 * Filterable by candidate, gene or variant fields.
 *
 * PHP version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://www.github.com/aces/Loris/
 *  Subtab: CNV
 */
namespace LORIS\genomic_browser;

/**
 * CNV_Browser Class
 *
 * This class is cnv_browser Form
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 * @link     https://github.com/aces/Loris
 */
class CNV_Browser extends \NDB_Menu_Filter
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
     * @return void
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns = array(
            'psc.Name AS PSC',
            'LPAD(candidate.CandID, 6, "0") AS DCCID',
            'candidate.PSCID',
            'candidate.Sex',
            'cohort.SubprojectID as Subproject',
            'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
            'candidate.ExternalID as ExternalID',
            'CNV.Chromosome as Chromosome',
            'CNV.Strand as Strand',
            'CNV.StartLoc as StartLoc',
            'CNV.EndLoc as EndLoc',
            'CONCAT(
                              CNV.Chromosome, 
                              ":",
                              CNV.StartLoc,
                              "-",
                              CNV.EndLoc
                           ) as Location',
            'CNV.OfficialSymbol as Gene_Symbol',
            'CNV.OfficialName as Gene_Name',
            'CNV.Description as CNV_Description',
            'CNV.Type as CNV_Type',
            'CNV.CopyNumChange as Copy_Num_Change',
            'CNV.EventName as Event_Name',
            'CNV.Common_CNV as Common_CNV',
            'CNV.Characteristics as Characteristics',
            'CNV.Inheritance as Inheritance',
            'CNV.ArrayReport as Array_Report',
            'CNV.Markers as Markers',
            'CNV.ValidationMethod as Validation_Method',
            'genotyping_platform.Name as Platform',
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
                    'ExternalID',
                    'Chromosome',
                    'Strand',
                    'StartLoc',
                    'EndLoc',
                    'Event_Name',
                    'Gene_Symbol',
                    'Gene_Name',
                    'Platform',
                    'Array_Report',
                    'Markers',
                    'Validation_Method',
                )
            )
        );

        $this->query = " FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID=candidate.CandID)
            LEFT JOIN psc ON (psc.CenterID=candidate.RegistrationCenterID)
            JOIN CNV ON (candidate.CandID = CNV.CandID)
            LEFT JOIN genotyping_platform ON
              (CNV.PlatformID = genotyping_platform.PlatformID)
            WHERE
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $DB   = \Database::singleton();
        $user = \User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND candidate.RegistrationCenterID IN ("
                            . $site_arr . ")";
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
            'CNV.Chromosome',
            'CNV.Strand',
            'genomic_range',
            'CNV.OfficialSymbol',
            'CNV.OfficialName',
            'genotyping_platform.Name',
        );

        $ftf = array(
            'centerID'           => 'candidate.RegistrationCenterID',
            'DCCID'              => 'candidate.CandID',
            'PSCID'              => 'candidate.PSCID',
            'sex'                => 'candidate.Sex',
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
            'Chromosome'         => 'CNV.Chromosome',
            'Strand'             => 'CNV.Strand',
            'genomic_range'      => 'genomic_range',
            'Gene_Symbol'        => 'CNV.OfficialSymbol',
            'Gene_Name'          => 'CNV.OfficialName',
            'Platform'           => 'genotyping_platform.Name',
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
            // allow only to view own site data
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
                'Other'  => 'Other',
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

        // CNV

        $Base_options = array(
            null => 'Any',
            '37' => 'GRCh37',
        );
        $this->addSelect('Assembly', 'Build:', $Base_options);

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

        $Base_options = array(
            null => 'Any',
            'F'  => 'Forward',
            'R'  => 'Reverse',
        );
        $this->addSelect('Strand', 'Strand:', $Base_options);

        $this->addBasicText('genomic_range', 'Genomic Range:');
        $this->addBasicText('Gene_Symbol', 'Gene:');

        $DB = \Database::singleton();
        $platform_results = $DB->pselect(
            "SELECT distinct Name FROM genotyping_platform",
            array()
        );

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
            } elseif ($field == "genomic_range") {
                $temp_array = explode(':', $val);
                $chr        = $GLOBALS['DB']->quote($temp_array[0]);
                $chrchr     = $GLOBALS['DB']->quote('chr'.$temp_array[0]);

                $query .= " AND (CNV.Chromosome = $chr";
                $query .= " OR CNV.Chromosome = $chrchr)";

                if (!empty($temp_array[1]) AND strpos($temp_array[1], '-') ) {
                    $temp_array = explode('-', $temp_array[1]);
                    $from       = $temp_array[0];
                    $to         = $temp_array[1];
                    $query     .= " AND CNV.StartLoc < $to";
                    $query     .= " AND CNV.EndLoc > $from";
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
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/genomic_browser/js/genomic_browser.js",
                $baseURL . "/genomic_browser/js/cnvColumnFormatter.js",
            )
        );
    }

}
