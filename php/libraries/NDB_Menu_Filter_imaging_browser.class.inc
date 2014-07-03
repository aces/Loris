<?php

/**
 * This class features the code for the menu portion of the Loris imaging
 * browser.
 *
 * PHP Version 5
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Imaging 
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    Loris license
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */

require_once 'NDB_Menu_Filter.class.inc';

/**
 * Provides the PHP code for the menu filter for the imaging browser
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Imaging
 *  @author     Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license    Loris license
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter_Imaging_Browser extends NDB_Menu_Filter
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user hass access
     */
    function _hasAccess()
    {
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: " .$user->getMessage());
        }
        return $user->hasPermission('view_final_radiological_review');
    }

    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return null
     */
    function _setupVariables()
    {
        $NewDataSubquery = "CASE 
            COALESCE((
                SELECT MIN(QCLastChangeTime) 
                FROM files LEFT JOIN files_qcstatus 
                USING(FileID) 
                WHERE files.SessionID=s.ID 
                AND OutputType='native' 
                AND AcquisitionProtocolID not in (1, 2, 3, 52) 
                GROUP BY QCLastChangeTime 
                ORDER BY QCLastChangeTime limit 1
            ), 'new')
            WHEN 'new' THEN 'new' 
            WHEN '' THEN 'new'
            ELSE ''
            END";
        $T1PassSubquery = "CASE 
            COALESCE((
                SELECT MIN(files_qcstatus.QCStatus+0) 
                FROM files JOIN files_qcstatus 
                USING (FileID) 
                WHERE files.SessionID=s.ID AND files.AcquisitionProtocolID=44 
                GROUP BY files.SessionID), '')
            WHEN '' THEN ''
            WHEN 1 THEN 'Passed'
            WHEN 2 THEN 'Failed'
            END
            ";
        $T2PassSubquery = "CASE 
            COALESCE((
                SELECT MIN(files_qcstatus.QCStatus+0) 
                FROM files JOIN files_qcstatus 
                USING (FileID) 
                WHERE files.SessionID=s.ID AND files.AcquisitionProtocolID=45 
                GROUP BY files.SessionID), '')
            WHEN '' THEN ''
            WHEN 1 THEN 'Passed'
            WHEN 2 THEN 'Failed'
            END
            ";

        $PendingFailSubquery = "
            CASE s.MRIQCStatus
                WHEN 'Fail' THEN
                    IF(s.MRIQCPending, 'Pending Fail', 'Fail')
                WHEN 'Pass' THEN
                    IF(s.MRIQCPending='Y', 'Pending Pass', 'Pass')
                ELSE s.MRIQCStatus
            END 
            ";

        $this->query = " FROM psc AS p 
            JOIN session s ON (s.CenterID=p.CenterID) 
            JOIN candidate c ON (c.CandID=s.CandID) 
            JOIN files f ON (f.SessionID=s.ID) 
            LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID) 
            JOIN mri_acquisition_dates md ON (md.SessionID=s.ID) 
            WHERE 
            f.PendingStaging=0 AND 
            f.FileType='mnc' AND 
            f.OutputType='native' AND 
            f.AcquisitionProtocolID not in (1, 2, 3, 52)";

        $this->columns = array(
            'p.MRI_alias as Site',
            'c.PSCID as PSCID',
            'c.CandID as DCCID',
            's.visit_label as Visit_Label',
            "$PendingFailSubquery as QC_Status",
            'MIN(md.AcquisitionDate) as First_Acq_Date',
            'MAX(fqc.QCLastChangeTime) as Last_QC',
            "$NewDataSubquery as New_Data",
            "$T1PassSubquery as T1_Passed",
            "$T2PassSubquery as T2_Passed",
            "'links' as Links",
            's.ID as sessionID'
        );
        $this->order_by = 'c.PSCID, s.Visit_label';
        $this->group_by = 's.ID';
        $this->headers = array(
            'Site',
            'PSCID',
            'DCCID',
            'Visit_Label',
            'QC_Status', 
            'First_Acq_Date',
            'Last_QC',
            'New_Data',
            'T1_Passed',
            'T2_Passed',
            'Links'
        );
       
        $this->validFilters = array(
            'c.PSCID',
            's.Visit_label',
            'c.CandID',
            'c.ProjectID',
            'c.CenterID',
            's.MRIQCStatus',
            'pending'
        );

        $this->formToFilter = array(
            'pscid' => 'c.PSCID',
            'VL'    => 's.Visit_label',
            'DCCID'=> 'c.CandID',
            'ProjectID' => 'c.ProjectID',
            'SiteID' => 'c.CenterID',
            'VisitQCStatus' => 's.MRIQCStatus',
            'Pending' => 'pending'
        );
        $this->EqualityFilters = array();
        $this->searchKeyword    = array();
    }

    /**
     * Setup $this->tpl_data for use by Smarty
     *
     * @return null
     */
    function _setFilterForm()
    {
        $DB = Database::singleton();
        $allAr = array('' => 'All');
        $this->addBasicText('pscid', 'PSCID', array("size"=>10,"maxlength"=>25);
        $this->addBasicText(
            'VL', 'Visit Label', array('size' => "10", "maxlength"=>"25")
        );
        $this->addBasicText(
            'DCCID', 'DCCID', array('size' => 10, "maxlength" => 25)
        );
        $this->addSelect('ProjectID', 'Project', $allAr + Utility::getProjectList());
        $this->addSelect('SiteID', 'Site', $allAr + Utility::getSiteList());
        $this->addSelect(
            'VisitQCStatus',
            'QC Status',
            array(''=>'All', 'Pass'=>'Pass', 'Fail'=>'Fail')
        );

        $this->addSelect(
            'Pending',
            'Pending and New',
            array(''=>'All', 'P'=>'Pending', 'N'=>'New', 'PN'=>'Pendng or New')
        ); 
        $outputTypes = $DB->pselect(
            "SELECT DISTINCT OutputType AS outputType 
            FROM files WHERE FileType='mnc' AND OutputType!='native'", array()
        );

        $this->tpl_data['outputTypes'] = array_merge(
            array(
                array('outputType'=>'native'),array('outputType'=>'selected')
            ),
            $outputTypes
        );

        $this->tpl_data['numOutputTypes'] = count($outputTypes);
        $this->addBasicText(
            'keyword', 
            'Search keyword in Comments', 
            array("size"=>10,"maxlength"=>25)
        );

        $this->tpl_data['backURL'] = $_SERVER['REQUEST_URI'];
    }

    /**
     * Setup table rows for the template
     *
     * @param int $count number
     *
     * @return null
     */

    function _setDataTableRows($count)
    {
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key == 'sessionID') {
                    $this->tpl_data['items'][$x]['sessionID'] = $val;
		    $filtered_sessionIDs[] = $val;
                    continue;
                }
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                $i++;
            }
            $x++;
        }
        $this->tpl_data['numTimepoints'] = $x;
	$_SESSION['State']->setProperty(
	    'mriSessionsListed', $filtered_sessionIDs
        );
        return true;
    }
    /**
     * Overwrites the function to add a customized filter
     * for Pending and New
     *
     * @param string $prepared_key filter key
     * @param string $field        filter field
     * @param string $val          filter value
     *
     * @return null
     */
    function _addValidFilters($prepared_key, $field, $val)
    {
        $query = '';
        if ((!empty($val) || $val === '0') && $field != 'order') {
            if ($field != 'pending') {
                if (in_array($field, $this->CheckboxFilters) && $val) {
                    $query .= " AND $field";
                } elseif (strtolower(substr($field, -8)) == 'centerid'
                        || strtolower(substr($field, -10)) == 'categoryid'
                        || strtolower(substr($field, -6)) == 'gender'
                        || (isset($this->EqualityFilters)
                        && in_array($field, $this->EqualityFilters))
                        ) {
                    $query .= " AND $field = :v_$prepared_key";
                    // $qparams["v_$prepared_key"] = $val;
                } else {
                    $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
                }
            } else {
                switch ($val) {
                case "P":
                    $query .= " AND s.MRIQCPending='Y'"; 
                    break;
                case "N":
                    $query .= " AND (s.MRIQCStatus='' 
                        OR fqc.QCFirstChangeTime IS NULL)"; 
                    break;
                case "PN":
                    $query .= " AND s.MRIQCPending='Y' 
                        OR (s.MRIQCStatus='' OR fqc.QCFirstChangeTime IS NULL)"; 
                    break;
                }
            }
        }
        return $query;
    }
}
