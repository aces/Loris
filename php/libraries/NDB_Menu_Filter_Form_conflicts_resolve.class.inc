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

require_once 'NDB_Menu_Filter_Form.class.inc';

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
                $hash = $key;
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
        $this->columns = array(
            'conflicts_unresolved.TableName', 
            'session.CandID', 
            'candidate.PSCID', 
            'session.Visit_label', 
            'conflicts_unresolved.FieldName', 
            "MD5(CONCAT_WS(':',conflicts_unresolved.TableName, conflicts_unresolved.ExtraKeyColumn, conflicts_unresolved.ExtraKey1, conflicts_unresolved.ExtraKey2, conflicts_unresolved.FieldName, conflicts_unresolved.CommentId1, conflicts_unresolved.CommentId2)) AS hash", 
            'conflicts_unresolved.ExtraKeyColumn', 
            'conflicts_unresolved.ExtraKey1', 
            'conflicts_unresolved.ExtraKey2', 
            'conflicts_unresolved.CommentId1', 
            'conflicts_unresolved.CommentId2', 
            'conflicts_unresolved.Value1', 
            'conflicts_unresolved.Value2', 
            'session.CenterID'
        );
        $this->query = " FROM conflicts_unresolved LEFT JOIN flag ON (conflicts_unresolved.CommentId1=flag.CommentID) LEFT JOIN session ON (flag.SessionID=session.ID) LEFT JOIN candidate ON (candidate.CandID=session.CandID) WHERE 1=1";
        $this->group_by = '';
        $this->order_by = 'conflicts_unresolved.TableName, session.Visit_label';
        $this->validFilters = array(
            'conflicts_unresolved.TableName', 
            'session.CenterID', 
            'session.Visit_label', 
            'candidate.PSCID', 
            'session.CandID'
        );
        $this->headers = array(
            'TableName', 
            'CandID', 
            'PSCID', 
            'Visit_label', 
            'FieldName'
        );
        $this->formToFilter = array(
            'Instrument' => 'conflicts_unresolved.TableName',
            'site' => 'session.CenterID',
            'visit' => 'session.Visit_label',
            'CandID' => 'session.CandID',
            'PSCID' => 'candidate.PSCID'
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
        $this->addBasicText('CandID', 'DCCID:', array("size"=>9, "maxlength"=>6));
        $this->addBasicText('PSCID', 'PSCID:', array("size"=>9, "maxlength"=>7));

        return true;
    }

    function _setDataTableRows($count)
    {
        $DB =& Database::singleton();
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key=='TableName' || $key=='CandID' || $key=='PSCID' || $key=='Visit_label' || $key=='FieldName' || $key=='hash') {
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }

                $i++;
            }

            if($item['FieldName'] == 'Examiner') {
                $name1 = $item['Value1'];
                $name2 = $item['Value2'];
                if($item['Value1'] != '') {
                    $name1 = $DB->pselectOne("SELECT Full_Name FROM examiners WHERE examinerID=:EID",
                        array('EID' =>$item['Value1'])
                    );
                    if(Utility::isErrorX($name1)) {
                        $name1 = $item['Value1'];
                    }
                }

                if($item['Value2'] != '') {
                    $name2 = $DB->pselectOne("SELECT Full_Name FROM examiners WHERE examinerID=:EID",
                        array('EID' => $item['Value2'])
                    );
                    if(Utility::isErrorX($name2)) {
                        $name2 = $item['Value2'];
                    }
                }
                $options = array('none'=>'Unresolved', '1'=> $name1, '2'=> $name2);
            } else {
                $options = array('none'=>'Unresolved', '1'=>$item['Value1'], '2'=>$item['Value2']);
            }

            $this->addSelect($item['hash'], "", $options);

            $x++;
        }

        return true;
    }
}
?>