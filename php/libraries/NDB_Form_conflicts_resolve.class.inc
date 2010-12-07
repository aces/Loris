<?php
require_once "NDB_Form.class.inc";

/**
 * Conflict resolver
 * @package main
 */
class NDB_Form_conflicts_resolve extends NDB_Form
{
    
    function _hasAccess()
    {
        return true;
    }

    function _getDefaults()
    {
  		$DB =& Database::singleton();
        //Get the default values
        $DB->select("SELECT ParameterTypeID, Value FROM parameter_candidate WHERE CandID='".$this->identifier."'",&$value_results);
        foreach($value_results AS $vresult){
        	$defaults["PTID_".$vresult['ParameterTypeID']]=$vresult['Value'];
        }
        return $defaults;
    }

    function _process($values)
    {
        if(!is_array($values) || count($values) ==0) {
        	return true;
        }
        
        $DB =& Database::singleton();
        
        foreach($values AS $key=>$val) {
            if($val != 'none') {
                $hash = substr($key, 9);
                $DB->selectRow("SELECT * FROM conflicts_unresolved WHERE MD5(CONCAT_WS(':',TableName, ExtraKeyColumn, ExtraKey1, ExtraKey2, FieldName, CommentId1, CommentId2)) = '$hash'", $row);
                if(!empty($row)) {
                    // insert into conflicts_resolved
                    print "Inserting into conflicts resolved... - user chose $val";
                    print_r($row);

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
                }
            }
        }

        $this->tpl_data['success'] = true;

        // freeze it, just in case
        //$this->form->freeze();
    }

    function conflicts_resolve()
    {
        $DB =& Database::singleton();

 		//Extract the fields from the parameter_type table
        $conflicts = array();
        $DB->select("SELECT TableName, ExtraKeyColumn, ExtraKey1, ExtraKey2, FieldName, CommentId1, CommentId2, Value1, Value2, MD5(CONCAT_WS(':',TableName, ExtraKeyColumn, ExtraKey1, ExtraKey2, FieldName, CommentId1, CommentId2)) AS hash FROM conflicts_unresolved", $conflicts);
        //If there are no conflicts print a message to that effect
        if(empty($conflicts)){
        	$this->form->addElement('static', "static", "No conflicts detected at this time.");
        	return;
        }
        
        
        //Loop through the conflicts and add a row per
        foreach($conflicts AS $conflict) {
            $options = array('none'=>'Unresolved', '1'=>$conflict['Value1'], '2'=>$conflict['Value2']);
            $this->form->addElement('select', 'conflict_'.$conflict['hash'], "$conflict[TableName] $conflict[CommentId1] $conflict[ExtraKeyColumn] $conflict[ExtraKey1] $conflict[FieldName]", $options);
            $this->tpl_data['elements_list'][]='conflict_'.$conflict['hash'];
        }

    }
}
?>