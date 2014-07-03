<?php
/**
 * This class over-rides the NDB_Menu_Filter class by including the functionality 
 * of saving/processing the form.
 *
 * PHP Version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Tara Campbell
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once 'NDB_Menu_Filter.class.inc';

/**
 * Menu_Filter_Form_conflicts_resolve Class
 *
 * This class over-rides the NDB_Menu_Filter class by including the functionality 
 * to save/process the form.
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Tara Campbell
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk	
*/

class NDB_Menu_Filter_Form_conflicts_resolve extends NDB_Menu_Filter_Form
{

	function _hasAccess()
    {    
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return ($user->hasPermission('conflict_resolver'));
    }

    function _getDefaults()
    {
  		$DB =& Database::singleton();
        //Get the default values
        $value_results = $DB->pselect("SELECT ParameterTypeID, Value 
            FROM parameter_candidate WHERE CandID=:CaID",
            array('CaID' => $this->identifier)
        );
        $defaults = array();
        foreach($value_results AS $vresult){
        	$defaults["PTID_".$vresult['ParameterTypeID']]=$vresult['Value'];
        }
        if(isset($_REQUEST['site'])) {
            $defaults['site'] = $_REQUEST['site'];
        }
        if(isset($_REQUEST['visit'])) {
            $defaults['visit'] = $_REQUEST['visit'];
        }
        if(isset($_REQUEST['Instrument'])) {
            $defaults['Instrument'] = $_REQUEST['Instrument'];
        }
        if(isset($_REQUEST['CandID'])) {
            $defaults['CandID'] = $_REQUEST['CandID'];
        }
        if(isset($_REQUEST['PSCID'])) {
            $defaults['PSCID'] = $_REQUEST['PSCID'];
        }
        return $defaults;
    }

    function _process($values)
    {
        if(!is_array($values) || count($values) ==0) {
        	return true;
        }
        
        $DB =& Database::singleton();
        
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }


        foreach($values AS $key=>$val) {
            if($val != 'none') {
                $hash = substr($key, 9);
                $row = $DB->pselectRow(
                    "SELECT * FROM conflicts_unresolved 
                    WHERE MD5(CONCAT_WS(':',TableName, ExtraKeyColumn, ExtraKey1, ExtraKey2, FieldName, CommentId1, CommentId2)) = :hash", 
                    array('hash' => $hash)
                );
                if(!empty($row)) {
                   
                    // insert into conflicts_resolved
                    $user1 = $DB->pselectOne("SELECT UserID FROM $row[TableName] WHERE CommentID=:CID",
                        array('CID' => $row['CommentId1'])
                    );
                    $user2 = $DB->pselectOne("SELECT UserID FROM $row[TableName] WHERE CommentID=:CID",
                        array('CID' => $row['CommentId2'])
                    );
                    $resolutionLog=array(
                        'UserID' => $user->getUsername(), 
                        // 'ResolutionTimestamp'=>null, 
                        'User1'=>$user1, 
                        'User2'=>$user2, 
                        'TableName'=>$row['TableName'], 
                        'ExtraKeyColumn'=>$row['ExtraKeyColumn'], 
                        'ExtraKey1'=>$row['ExtraKey1'], 
                        'ExtraKey2'=>$row['ExtraKey2'], 
                        'FieldName'=>$row['FieldName'], 
                        'CommentId1'=>$row['CommentId1'], 
                        'CommentId2'=>$row['CommentId2'], 
                        'OldValue1'=>$row['Value1'], 
                        'OldValue2'=>$row['Value2'], 
                        'NewValue'=>$val,
                        'ConflictID'=>$row['ConflictID']
                    );

                    $DB->insert('conflicts_resolved', $resolutionLog);

                    // update the source tables
                    $setArray = array($row['FieldName'] => ($val == '1' ? $row['Value1'] : $row['Value2']));
                    $whereArray1 = array('CommentID'=>$row['CommentId1']);
                    $whereArray2 = array('CommentID'=>$row['CommentId2']);
                    if($row['ExtraKeyColumn'] != null) {
                        $whereArray1[$row['ExtraKeyColumn']] = $row['ExtraKey1'];
                        $whereArray2[$row['ExtraKeyColumn']] = $row['ExtraKey2'];
                    }
                    $DB->update($row['TableName'], $setArray, $whereArray1);
                    $DB->update($row['TableName'], $setArray, $whereArray2);

                    // delete from conflics_unresolved
                    $DB->run("DELETE FROM conflicts_unresolved WHERE MD5(CONCAT_WS(':',TableName, ExtraKeyColumn, ExtraKey1, ExtraKey2, FieldName, CommentId1, CommentId2)) = '$hash'");

                    // Load the instrument and save it to force the score 
                    // function to run.
                    // Wrapped in a try/catch block in case the table doesn't have its own
                    // instrument (ie. figs_year3_relative)
                    $TableName = $row['TableName'];
                    $Instrument = NDB_BVL_Instrument::factory($TableName, $row['CommentId1'], '', false);
                    if($Instrument != null) {
                        $Instrument->score();
                        // Score runs the update statements to update the scored columns. There's no need to save,
                        // (and save() doesn't work) because it calls $this->form->getSubmittedValues(), and at
                        // this point we're submitting the conflict resolver, not the instrument
                    }

                    $Instrument = NDB_BVL_Instrument::factory($TableName, $row['CommentId2'], '', false);
                    if($Instrument != null) {
                        $Instrument->score();
                    }
                }
            }
        }

        $this->tpl_data['success'] = true;
    }

    function _setupVariables()
    {
    	// set the class variables
        $this->columns = array('c.TableName', 'c.ExtraKeyColumn', 'c.ExtraKey1', 'c.ExtraKey2', 'c.FieldName', 'c.CommentId1', 'c.CommentId2', 'c.Value1', 'c.Value2', 's.Visit_label', 's.CandID AS DCCID', 'ca.PSCID', 's.CenterID AS Site');
        $this->query = " FROM conflicts_unresolved c LEFT JOIN flag f ON (c.CommentId1=f.CommentID) LEFT JOIN session s ON (f.SessionID=s.ID) LEFT JOIN candidate ca ON (ca.CandID=s.CandID)";
        $this->group_by = '';
        $this->order_by = 'c.TableName, session.Visit_label';
        $this->headers = array('TableName', 'DCCID', 'PSCID', 'Visit_label', 'Question', 'Correct Answer');
        $this->validFilters = array('reliability.CommentID', 'reliability.reliability_center_id', 'session.SubprojectID', 'candidate.CenterID', 'session.CandID', 'candidate.PSCID', 'candidate.Gender', 'session.Visit_label', 'candidate.ProjectID','reliability.Instrument', 'reliability.Reliability_score', 'session.Current_stage', 'reliability.invalid');

        $this->formToFilter = array(
                                    'CommentID' => 'reliability.CommentID',
                                    'Cohort' => 'session.SubprojectID',
                                    'CenterID' => 'candidate.CenterID',
                                    'DCCID' => 'candidate.CandID',
                                    'PSCID' => 'candidate.PSCID',
                                    'Visit_label' => 'session.Visit_label',
                                    'Instrument' => 'reliability.Instrument',
                                    'reliability_score'=>'reliability.Reliability_score',
                                    'Current_stage'=>'session.Current_stage',
                                    'Invalid' => 'reliability.invalid',
                                    'ProjectID'=>'candidate.ProjectID'
                                    // 'Lock_record' => 'session.Lock_record'
                                    );
        return true;
    }

    function _setFilterForm()
    {
    	// Create user object
    	$user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // Get instruments
    	$instruments = Utility::getAllInstruments();
        $instruments = array_merge(array('' => 'All Instruments'), $instruments);
        
        // Get visits
        $visits = Utility::getVisitList();
        $visits = array_merge(array('' => 'All'), $visits);

        // Get sites that the user has access to
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites =& Utility::getSiteList();
            if(Utility::isErrorX($sites)) {
                return PEAR::raiseError("DB Error: ". $sites->getMessage());
            }
            if(is_array($sites)) {
            	$sites = array('' => 'All') + $sites;
            }
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        // Add form elements
        $this->addSelect('site', 'Site:', $sites);
        $this->addSelect('Instrument', 'Instrument:', $instruments);
        $this->addSelect('visit', 'Visit label:', $visits);
        $this->addBasicText('Question', 'Question:', '');
        $this->addBasicText('CandID', 'DCCID:', '');
        $this->addBasicText('PSCID', 'PSCID:', '');

        return true;
    }

    function _setDataTableRows($count)
    {

    }

}
?>