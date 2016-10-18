<?php
/**
 * Code for the form for the final radiological review module.
 * See NDB_Menu_Filter_final_radiological_review for description
 * of how module works.
 *
 * PHP Version 5
 *
 *   @package    Main
 *   @subpackage RadiologicalReview
 *   @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *   @license    @GPLv3
 *   @link       https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Generates the form for user input in the final_radiological_review
 * module.
 *
 *   @package    Main
 *   @subpackage RadiologicalReview
 *   @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *   @license    @GPLv3
 *   @link       https://www.github.com/aces/Loris-Trunk/
 */

require_once "NDB_Form.class.inc";
require_once "NDB_Menu_Filter_final_radiological_review.class.inc";
class NDB_Form_final_radiological_review extends NDB_Form
{
    /**
     * Table that the review is saved to
     */
    var $__table = 'final_radiological_review';

    /**
     * Determine whether the logged in user has permission
     * to view this page
     *
     * @return boolean page access
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
     * Wrapper to get the user object and check the permission.
     * Used both in hasAccess and the setup when determining
     * if the user can view, or view and edit the page
     *
     * @param string $perm Name of the permission to check
     *
     * @return boolean Whether the user has said permission
     * @private
     */
    function _has_perm($perm)
    {
        $user =& User::singleton();
        return $user->hasPermission($perm);
    }

    /**
     * Constructor which sets up this->tpl_data for the form
     *
     * @return null
     */
    function final_radiological_review()
    {
        $yes_no = array('' => '', 'yes' => 'Yes', 'no' => 'No');
        $exclusionary = array('' => '',
                'exclusionary' => 'Exclusionary',
                'non_exclusionary' => 'Non-Exclusionary'
        );
        $results = array('' => '',
                         'normal' => 'Normal',
                         'abnormal' => 'Abnormal',
                         'atypical' => 'Atypical');
        $abnormality = array(null => '',
                            '0' => 'None',
                            '1' => 'Minimal',
                            '2' => 'Mild',
                            '3' => 'Moderate',
                            '4' => 'Marked');

        $DB =& Database::singleton();
        $radiologists_q = $DB->pselect("SELECT * FROM examiners WHERE radiologist=True", array());

        $radiologists[''] = '';
        foreach ($radiologists_q as &$row) {
            $radiologists[$row['examinerID']] = $row['full_name'];
        }

        $this->addSelect('Final_Examiner', 'Radiologist/Reviewer:', $radiologists);
        $this->addScoreColumn('CandID', 'DCCID:', 'Unknown');
        $this->addScoreColumn('PSCID', 'PSCID:', 'Unknown');
        $this->addScoreColumn('SessionID', 'Session ID:', '');
        $this->addScoreColumn('CommentID', 'Comment ID:', '');
        $this->addScoreColumn('Visit_label', 'Visit Label:', '');

        $this->addScoreColumn('DICOM_Folder_Name', 'DICOM Folder:', 'Unknown');
        $this->addScoreColumn('DICOM_ID', 'DICOM ID:', 'Unknown');

        $this->addSelect('Review_Done', 'Review Done:', $yes_no);
        $this->addSelect('Final_Review_Results', 'Results of Radiology Review:', $results);
        $this->addSelect('Final_Exclusionary', 'Exclusionary Status:', $exclusionary);
        $this->addSelect('SAS', 'SAS Score:', $abnormality);
        $this->addSelect('PVS', 'PVS Score:', $abnormality);
        $this->addBasicTextArea('Final_Incidental_Findings', 'Description of Incidental Findings (Comments):');
        $this->addSelect('Finalized', 'Is review finalized?', $yes_no);

        $this->addSelect('Final_Examiner2', 'Radiologist/Reviewer:', $radiologists);
        $this->addSelect('Review_Done2', 'Review Done:', $yes_no);
        $this->addSelect('Final_Review_Results2', 'Results of Radiology Review:', $results);
        $this->addSelect('Final_Exclusionary2', 'Exclusionary Status:', $exclusionary);
        $this->addSelect('SAS2', 'SAS Score:', $abnormality);
        $this->addSelect('PVS2', 'PVS Score:', $abnormality);
        $this->addBasicTextArea('Final_Incidental_Findings2', 'Description of Incidental Findings (Comments):');
        // Original review, this might move
        $this->addScoreColumn('Original_Scan_Done', 'Original Scan Done:', 'Unknown');
        $this->addScoreColumn('Original_Review_Results', 'Original Results:', 'Unknown');
        $this->addScoreColumn('Original_Exclusionary', 'Original Exclusionary Results:', '');
        $this->addScoreColumn('Original_Incidental_Findings', 'Original Incidental Findings:', '');
        $this->addScoreColumn('Original_Examiner', 'Original Radiologist/Reviewer:', 'Unknown');

        $this->form->addElement('static', 'history', '', '');

        if ($this->_has_perm('edit_final_radiological_review') == false) {
            $this->form->freeze();
        }

    }

    /** 
     * Overrides the base class getDefaults to get the needed
     * information from the final_radiological_review table for
     * smarty
     *
     * @return array defaults for smarty to use
     */
    function _getDefaults()
    {
        if (isset($this->identifier)) {
            $DB =& Database::singleton();
            // Get the basics for the final radiological review
            $final_review = $DB->pselectRow(
                "SELECT * FROM $this->__table WHERE CommentID=:CID",
                array('CID' => $this->identifier)
            );
            if(empty($final_review)) {
                $final_review = array(
                    'CommentID' => '',
                    'Review_Done' => '',
                    'Final_Review_Results' => '',
                    'Final_Exclusionary' => '',
                    'SAS' => '',
                    'PVS' => '',
                    'Final_Incidental_Findings' => '',
                    'Final_Examiner' => '',
                    'Final_Review_Results2' => '',
                    'Final_Examiner2' => '',
                    'Final_Exclusionary2' => '',
                    'Review_Done2' => '',
                    'SAS2' => '',
                    'PVS2' => '',
                    'Final_Incidental_Findings2' => '',
                    'Finalized' => ''
                );
            }

            $original_review = $DB->pselectRow(
                "SELECT r.Scan_done as Original_Scan_Done, 
                r.review_results as Original_Review_Results, 
                r.abnormal_atypical_exclusionary as Original_Exclusionary,
                r.Incidental_findings as Original_Incidental_Findings, 
                e.full_name as Original_Examiner, 
                c.PSCID as PSCID, 
                c.CandID as CandID, 
                s.Visit_Label as Visit_label, 
                GROUP_CONCAT(substring_index(t.sourcelocation, '/', -1)) as DICOM_Folder_Name, 
                f.SessionID as SessionID, 
                f.CommentID as CommentID 
                FROM radiology_review r LEFT JOIN examiners e on (e.ExaminerID=r.Examiner) 
                LEFT JOIN flag f ON (f.CommentID=r.CommentID) 
                LEFT JOIN session s ON (s.ID=f.SessionID) 
                LEFT JOIN candidate c ON (c.CandID=s.CandID) 
                LEFT JOIN tarchive t ON (upper(t.PatientName) 
                LIKE CONCAT(upper(c.PSCID), '_', upper(s.CandID), '_', upper(s.visit_label), '%')) 
                WHERE r.CommentID=:CID 
                GROUP by CandID, PSCID, Visit_label, SessionID, CommentID", 
                array('CID' => $this->identifier)
            );
            if(empty($original_review)) {
                $original_review = array(
                    'Original_Scan_Done' => '',
                    'Original_Review_Results' => '',
                    'Original_Exclusionary' => '',
                    'Original_Incidental_Findings' => '',
                    'Original_Examiner' => ''
                );
            }


            $history = $DB->pselect(
                'SELECT userID, changeDate, col, old, new FROM final_radiological_review_history
                WHERE CommentID= :primKey ORDER BY changeDate DESC',
                array('primKey' => $this->identifier)
            );

            $history_display = '';
            foreach ($history as &$history_item) {
                $history_display .= '<tr><td>' . 
                    $history_item['changeDate'] . '</td><td>' . 
                    $history_item['userID'] . '</td><td>' . 
                    $history_item['col'] . '</td><td>' . 
                    _makePretty($history_item['col'], $history_item['old']) . '</td><td>' 
                    . _makePretty($history_item['col'], $history_item['new']) 
                    . '</td></tr>';
            }
            $defaults = array_merge(
                $final_review, 
                $original_review, 
                array( 'history' => $history_display)
            );

            if ($defaults['Final_Review_Results'] !=  $defaults['Final_Review_Results2'] 
                || $defaults['Final_Exclusionary'] != $defaults['Final_Exclusionary2'] 
                || $defaults['SAS'] != $defaults['SAS2'] 
                || $defaults ['PVS'] != $defaults['PVS2']
            ) {
                $this->tpl_data['conflicts'][] = "Conflict between final and extra review";
            }
            if ($defaults['Final_Review_Results'] != $defaults['Original_Review_Results']
                || $defaults['Original_Exclusionary'] != $defaults['Final_Exclusionary']
            ) {
                $this->tpl_data['conflicts'][] = "Conflict between original and final review";
            }

            return $defaults;
        }
        return array();
    }

    /**
     * Converts empty string to null, because Smarty converts null
     * to empty, and we don't want to screw up the table
     *
     * @param array  &$arr  A reference to the array being cleaned
     * @param string $field The field being cleaned
     *
     * @return array $arr Modified so that empty strings are instead
     *                    null
     * @private
     */
    function stripEmpty(&$arr, $field)
    {
        if ($arr[$field] === '') {
            $arr[$field] = null;
        }
        return $arr;
    }

    /**
     * Process the submitted data and save if valid
     *
     * @param array $values The data submitted on the form
     *
     * @return boolean Always true?
     */
    function _process($values)
    {
        if (!is_array($values) 
            || count($values) == 0 
            || $this->_has_perm('edit_final_radiological_review') == false
        ) {
            return true;
        }

        $this->stripEmpty($values, 'Review_Done');
        $this->stripEmpty($values, 'SAS');
        $this->stripEmpty($values, 'PVS');
        $this->stripEmpty($values, 'Final_Examiner');
        $this->stripEmpty($values, 'SAS2');
        $this->stripEmpty($values, 'PVS2');
        $this->stripEmpty($values, 'Final_Examiner2');
        $this->stripEmpty($values, 'Review_Done2');
        $this->stripEmpty($values, 'Finalized');

        if (!(is_null($_SESSION['State']))) {
            $currentUser           = User::singleton($_SESSION['State']->getUsername());
            $userID                = $currentUser->getData("UserID");
        }

        $DB =& Database::singleton();
        if (isset($this->identifier)) {
            $exists = $DB->pselectRow(
                "SELECT * FROM " . $this->__table . " WHERE CommentID=:CID",
                array('CID' => $this->identifier)
            );

            if ($exists == array()) {
                $insert_values = array_merge(
                    array('CommentID' => $this->identifier),
                    $values
                );
                $DB->insert($this->__table, $insert_values);
            } else {
                /* update the final radiological review history table
                 * if any field was updated */
                foreach($values as $key=>$val) {
                    if ($exists[$key] != $val) {
                        $update_vals = array('col'=>$key,
                                'new'=>$val,
                                'old'=>$exists[$key],
                                'CommentID'=>$this->identifier,
                                'userID'=>$userID );

                        $DB->insert("final_radiological_review_history", $update_vals);
                    }
                }
                $DB->update(
                        $this->__table, $values,
                        array('CommentID' => $this->identifier)
                        );
            }

        }
        return true;
    }
}
?>
