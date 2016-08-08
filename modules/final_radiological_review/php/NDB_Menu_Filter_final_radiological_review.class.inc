<?php
/**
 * This class features the code for the menu portion of the final radiological
 * review. The Final Radiological Review module is used for the head radiologist
 * of a study to do an radiological review on each subject in a study, in addition
 * to the on-site review that was done by the each site's (likely more junior) 
 * radiologist.
 *
 * For sites where the head radiologist is also the site radiologist, a second,
 * trusted radiologist does the second review. Conflicts between any of the radiology
 * reviews are flagged for the radiologists to consult over before finalizing.
 *
 * PHP Version 5
 *
 *  @package    Main
 *  @subpackage RadiologicalReview
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    @GPLv3
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Utility function to make things more human readable.
 *
 * This is used both below and in the history on the NDB_Form.
 *
 * This maybe should be moved into the base class so that other menus that need
 * to customize the display of how data is shown can do so in a consistent manner
 *
 * @param string  $key The key that's being prettified
 * @param unknown $val The raw value for the key
 *
 * @return string Human readable version of raw data
 *
 */
function _makePretty($key, $val)
{
    if( $key=='Conflict'
        || $key=="Conflict2"
        || $key=="Conflict"
    ) {
        // The table was created with a boolean, which mysql turns into a tinyint.
        // Print 'Yes' or 'No' instead of 1 or 0.
        if ($val == 1 || $val === '1' || $val === 'true') {
            return 'Yes';
        } elseif ($val === "0" || $val === "false") { // PHP turns the tinyint back into a string ....
            return 'No';
        } else { // Leave nulls empty so that we can distinguish
            return '';
        }
    }
    if($key == "Finalized" || $key =="Review_Done"){
        if($val == "yes"){
            return 'Yes';
        }elseif ($val == "no"){
            return 'No';
        }else{
            return '';
        }

    }

    if ($key == 'Final_Review_Results' 
        || $key == 'Exclusionary_Status'
        || $key=="Final_Exclusionary" 
        || $key == "Results"
    ) {
        // Make the enum columns prettier by changing _ into a space and capitalizing
        return ucwords(str_replace('_', ' ', $val));
    } elseif ($key == 'SAS' or $key == 'PVS') {
        switch($val) {
        case '0': return 'None';
        case '1': return 'Minimal';
        case '2': return 'Mild';
        case '3': return 'Moderate';
        case '4': return 'Marked';
        default:  return 'Not Answered';
        }
    } elseif ($key == 'Project') {
        $projectlist=Utility::getProjectList();
        return $projectlist[$val];
    } else {
        return $val;
    }
}

/**
 * Provides the PHP code for the menu filter for the final radiological review.
 *
 *  @package    Main
 *  @subpackage RadiologicalReview
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    @GPLv3
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter_final_radiological_review extends NDB_Menu_Filter
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user hass access
     */
    function _hasAccess()
    {
        $user =& User::singleton();
        return (
            $user->hasPermission('view_final_radiological_review') ||
            $user->hasPermission('edit_final_radiological_review')
        );
    }

    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return null
     */
    function _setupVariables()
    {
        $config = NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        if($useProjects === "false") {
            $useProjects = false;
        }

        $conflict_condition1 = "(CASE
            WHEN orig.review_results <> r.final_review_results THEN 'true'
            WHEN orig.abnormal_atypical_exclusionary <> r.final_exclusionary
               THEN 'true'
            WHEN r.Final_Review_Results <> r.Final_Review_Results2 THEN 'true'
            WHEN r.Final_Exclusionary <> r.Final_Exclusionary2 THEN 'true'
            WHEN r.SAS <> r.SAS2 THEN 'true'
            WHEN r.PVS <> r.PVS2 THEN 'true'
            ELSE 'false' END)";
        $conflict_condition2 = "(CASE
            WHEN r.Final_Review_Results <> r.Final_Review_Results2 THEN 'prim_second'
            WHEN r.Final_Exclusionary <> r.Final_Exclusionary2 THEN 'prim_second'
            WHEN r.SAS <> r.SAS2 THEN 'prim_second'
            WHEN r.PVS <> r.PVS2 THEN 'prim_second'
            ELSE 'false' END)";

        $this->query = " FROM radiology_review orig
            LEFT JOIN final_radiological_review r ON (r.CommentID=orig.CommentID)
            JOIN flag f ON (f.CommentID=orig.CommentID)
            JOIN session s ON (s.ID=f.SessionID)
            JOIN candidate c ON (c.CandID=s.CandID)
            WHERE orig.commentid NOT LIKE 'DDE_%' AND orig.commentid IS NOT NULL
            AND s.active='Y' AND NOT (f.Administration='None')
            AND f.Data_entry='Complete'
            AND (orig.Scan_done IS NULL OR orig.Scan_done <> 'no')";
        $this->columns = array(
            'c.PSCID as PSCID',
            'c.CandID as DCCID',
            's.visit_label as Visit_Label',
        );
        if($useProjects) {
            $this->columns[] = 'c.ProjectID as Project';
        }

        $this->columns = array_merge(
            $this->columns,
            array(
                'c.CenterID as Site',
                'c.DOB as Birth_Date',
                'r.Review_Done as Review_Done',
                'r.Final_Review_Results as Results',
                'r.Final_Exclusionary as Exclusionary_Status',
                'r.sas as SAS',
                'r.pvs as PVS',
                'orig.CommentID as CommentID',
                "$conflict_condition1 as Conflict",
                "$conflict_condition2 as Conflict2",
                'r.Finalized as Finalized',
                'r.Final_Incidental_Findings as Comments'
            )
        );
        $this->order_by = 'PSCID';
        $this->headers = array(
            'PSCID',
            'DCCID',
            'Visit_Label',
        );
        if($useProjects) {
            $this->headers[] = 'Project';
        }
        $this->headers = array_merge($this->headers,
            array(
                'Birth_Date',
                'Review_Done',
                'Results',
                'Exclusionary_Status',
                'SAS',
                'PVS',
                'Conflict',
                'Finalized',
                'Comments',
            )
        );
        $this->validFilters = array('c.CandID',
            'r.DICOM_ID',
            's.visit_label',
            'c.PSCID',
            'r.Final_Review_Results',
            "COALESCE(r.Review_Done, 'no')",
            'r.sas',
            'r.pvs',
            'r.Final_Exclusionary',
            $conflict_condition1,
            $conflict_condition2,
            "COALESCE(r.Finalized, 'no')",
            'c.CenterID',
            'c.ProjectID',
            'keyword'
        );
        
        $this->formToFilter = array (
                                    'dccid'       => 'c.CandID',
                                    'site'        => 'c.CenterID',
                                    'Visit_label' => 's.visit_label',
                                    'Project'   => 'c.ProjectID',
                                    'pscid'       => 'c.PSCID',
                                    'Review_Done' => "COALESCE(r.Review_Done, 'no')",
                                    'Results'     => 'r.Final_Review_Results',
                                    'Final_Review_Results' 
                                                  => 'r.Final_Review_Results',
                                    'Exclusionary_Status'  
                                                  => 'r.Final_Exclusionary',
                                    'PVS'         => 'r.pvs',
                                    'SAS'         => 'r.sas',
                                    'Conflict'    => $conflict_condition1,
                                    'Conflict2'   => $conflict_condition2,
                                    'Finalized'   => "COALESCE(r.Finalized, 'no')",
                                    'keyword'     => 'r.Final_Incidental_Findings'
        );
        $this->EqualityFilters = array(
            $conflict_condition1,
            $conflict_condition2,
            'r.Final_Exclusionary',
            'r.Finalized',
            "COALESCE(r.Review_Done, 'no')",
            "r.Final_Review_Results"
        );
        $this->searchKeyword    = array('r.Final_Incidental_Findings');
    }

    /**
     * Setup $this->tpl_data for use by Smarty
     *
     * @return null
     */
    function _setFilterForm()
    {
        $config = NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        if($useProjects === "false") {
            $useProjects = false;
        }

        $list_of_visit_labels = array(null => 'All' );
        $visitList = Utility::getVisitList();
        foreach ($visitList as $key=>$value) {
            $list_of_visit_labels[$key] = $value;
        }
        $list_of_sites = array(null =>'All');
        $sitesList = Utility::getSiteList(false);
        foreach ($sitesList as $key=>$value) {
            $list_of_sites[$key]= $value;
        } 
        ksort($list_of_sites);
        if($useProjects) {
            $list_of_projects = array(null =>'All');
            $projectList = Utility::getProjectList();
            foreach ($projectList as $key => $value) {
                $list_of_projects[$key] =$value;
            }
        }
        $options_boolean= array(null => 'All', 'yes' => 'Yes', 'no' => 'No');
        $conflict_options1 = array(null => 'All', 'true' => 'Yes', 'false' => 'No' );
        $conflict_options2 = array(null => 'All', 
            'prim_second' => 'Yes', 
            'false' => 'No'
        );
        $comment_options = array(null => 'All', 'True' => 'Yes', 'False' => 'No');
        $bob_score = array(null => 'All', 
            '0' => 'None', 
            '1' => 'Minimal', 
            '2' => 'Mild', 
            '3' => 'Moderate', 
            '4' => 'Marked'
        );
        $abnormal_atypical = array(null => 'All', 
            'abnormal' => 'Abnormal', 
            'atypical' => 'Atypical', 
            'normal' => 'Normal'
        );
        $exclude = array(null => 'All', 
            'exclusionary' => 'Exclusionary', 
            'non_exclusionary' => 'Non Exclusionary'
        );

        $this->addBasicText(
            'dicomid', 'DICOM ID:', array("size"=>9, "maxlength"=>20)
        );
        $this->addBasicText('pscid', 'PSCID:', array("size"=>9, "maxlength"=>11));
        $this->addBasicText('dccid', 'DCCID:', array("size"=>9, "maxlength"=>6));
        $this->addSelect('Visit_label', 'Visit Label:', $list_of_visit_labels);
        $this->addSelect('site', 'Site', $list_of_sites);
        $this->addSelect('Review_Done', 'Review Done:', $options_boolean);
        $this->addSelect(
            'Conflict',
            'Conflict between any reviews:',
            $conflict_options1
        );
        $this->addSelect(
            'Conflict2',
            'Conflict between final and extra reviews:',
            $conflict_options2
        );

        $this->addSelect('SAS', 'SAS (Subarachnoid Spaces):', $bob_score);
        $this->addSelect('PVS', 'PVS (Perivascular Spaces):', $bob_score);

        $this->addSelect('Final_Review_Results', 'Results', $abnormal_atypical);
        $this->addSelect('Exclusionary_Status', 'Exclusionary Status', $exclude);

        $this->addSelect('Finalized', 'Finalized', $options_boolean);
        if($useProjects) {
            $this->addSelect('Project', 'Project', $list_of_projects);
        }
        $this->addBasicText('keyword','Search keyword in Comments', array("size"=>10,"maxlength"=>25));
    }


    /**
     * Overrides the NDB_Menu's setDataTableRows function in order to
     * not show the variables that were selected because the information
     * is needed to construct the url for the NDB_Form.
     *
     * Also uses makePretty function to make some variables more human
     * readable
     *
     * @param integer $count Page offset
     *
     * @return null
     */
    function _setDataTableRows($count)
    {
        $x = 0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key == 'CommentID') {
                    continue;
                }
                if ($key == 'SessionID') {
                    continue;
                }
                if ($key == 'Site') {
                    continue;
                }
                if ($key == 'Conflict2') {
                    continue;
                }


                $this->tpl_data['items'][$x][$i]['value'] = _makePretty($key, $val);
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                if(isset($item['CandID'])) {
                    $this->tpl_data['items'][$x][$i]['CandID'] = $item['CandID'];
                }
                if(isset($item['CommentID'])) {
                    $this->tpl_data['items'][$x][$i]['CommentID'] = $item['CommentID'];
                }
                if(isset($item['SessionID'])) {
                    $this->tpl_data['items'][$x][$i]['SessionID'] = $item['SessionID'];
                }
                $i++;
            }
            $x++;
        }
    }
}
