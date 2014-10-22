<?php
/**
 * This class implements a menu filter which acts as a front end to the
 * mri_protocol_check_violations table. The table logs violations to
 * specific MRI protocol headers on a 1 header violation per line basis,
 * after the protocol type has been identified by the mri_protocol table.
 *
 * Inability to determine the scan type is logged in the mri_protocol_violations
 * table to which the NDB_Menu_Filter_mri_protocol_violations provides a frontend.
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once 'NDB_Menu_Filter.class.inc';

/**
 * Implements the menu filter for mri_violations_log table
 *
 * @category MRI
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter_mri_protocol_check_violations extends NDB_Menu_Filter
{
    /**
     * Determine who has access to this page. At the moment, tied to
     * access to the final_radiological_review module.
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess()
    {
        $user =& User::singleton();
        if (PEAR::isError($user)) {
            return PEAR::raiseError("User Error: " .$user->getMessage());
        }
        return $user->hasPermission('view_final_radiological_review');
    }

    /**
     * Set up the class and smarty variables to use for the menu filter
     * 
     * @return none
     */
    function _setupVariables()
    {
        $this->query = " FROM mri_violations_log l WHERE 1=1 ";
        $this->columns = array(
            'l.PatientName',
            'l.CandID',
            'l.Visit_label',
            'l.Severity',
            'l.Header',
            'l.Value',
            'l.ValidRange',
            'l.ValidRegex',
            'l.SeriesUID',
            'l.TarchiveID'
        );
        $this->order_by = 'PatientName';
        $this->headers = array('PatientName',
                               'CandID',
                               'Visit_label',
                               'Severity',
                               'Header',
                               'Value',
                               'ValidRange',
                               'ValidRegex',
                               'SeriesUID'
        );
        $this->validFilters = array(
            'l.TarchiveID',
            'l.SeriesUID',
            'l.PatientName',
            'l.CandID'
        );
        $this->formToFilter = array (
                                    'TarchiveID' => 'l.TarchiveID',
                                    'SeriesUID' => 'l.SeriesUID',
                                    'PatientName' => 'l.PatientName',
                                    'CandID' => 'l.CandID'
        );
    }

    /**
     * Create the QuickForm elements for the menu filter
     *
     * @return none
     */
    function _setFilterForm()
    {

        $this->addBasicText(
            'TarchiveID',
            'Tarchive ID:',
            array("size"=>9, "maxlength"=>20)
        );
        $this->addBasicText(
            'PatientName',
            'PatientName:',
            array("size"=>20, "maxlength"=>64)
        );
        $this->addBasicText(
            'CandID',
            'CandID:',
            array("size"=>20, "maxlength"=>6)
        );
        $this->addBasicText(
            'SeriesUID',
            'DICOM Series UID:',
            array("size"=>20, "maxlength"=>64)
        );

    }


    /**
     * Overwrite the function that is used for generating the table
     * because some fields that came from the select statement aren't
     * for display to the user, but are just because we need the value
     * to generate a link to the proper page.
     *
     * @param integer $count The offset that this page is starting at
     *
     * @return none but as a side-effect populates $this->tpl_data['items']
     */
    function _setDataTableRows($count)
    {
        $x = 0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key == 'TarchiveID') {
                    $this->tpl_data['items'][$x]['TarchiveID'] = $val;
                    continue;
                }
                if ($key == 'Severity') {
                    $this->tpl_data['items'][$x]['severity'] = $val;
                }
                $row = array(
                    'value' => $val,
                    'name' => $key
                );
                $row['CandID'] = isset($item['CandID']) ? $item['CandID'] : '';
                $row['CommentID'] = isset($item['CommentID']) 
                    ? $item['CommentID'] 
                    : '';
                $row['SessionID'] = isset($item['SessionID']) 
                    ? $item['SessionID'] 
                    : '';


                $this->tpl_data['items'][$x][$i] = $row;
                $i++;
            }
            $x++;
        }
    }
}
