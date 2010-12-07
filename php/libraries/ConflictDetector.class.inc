<?
class ConflictDetector {

    function detectConflictsForCommentIds($instrumentName, $commentId1, $commentId2) {
        $diffResult = array();

        // Get data entry status for $commentId1
        $status = new NDB_BVL_InstrumentStatus();
        $status->select($commentId1);
        if($status->getDataEntryStatus() != 'Complete') return $diffResult;
    
        // Get data entry status for $commentId2
        $status = new NDB_BVL_InstrumentStatus();
        $status->select($commentId2);
        if($status->getDataEntryStatus() != 'Complete') return $diffResult;
    
        // Create the instrument instance for $commentId1
        $instance1 =& NDB_BVL_Instrument::factory($instrumentName, $commentId1, null);
    
        // Create the instrument instance for $commentId2
        $instance2 =& NDB_BVL_Instrument::factory($instrumentName, $commentId2, null);
    
        // Run the diff
        $diffResult = $instance1->diff($instance2);
    
        // Return the diff result
        return $diffResult;
    }

    function recordUnresolvedConflicts($diffResult) {
        $db=&Database::singleton();

        foreach($diffResult AS $diffLine) {
            
            $db->replace('conflicts_unresolved', $diffLine);
        }

    }

    function clearConflictsForField($diffLine) {
        $deleteWhere = array('TableName'=>$diffLine['TableName'], 'ExtraKeyColumn'=>$diffLine['ExtraKeyColumn'], 'ExtraKey1'=>$diffLine['ExtraKey1'], 'ExtraKey2'=>$diffLine['ExtraKey2'], 'FieldName'=>$diffLine['FieldName'], 'CommentId1'=>$diffLine['CommentId1'], 'CommentId2'=>$diffLine['CommentId2']);
        $db =& Database::singleton();
        $db->delete('conflicts_unresolved', $deleteWhere);
    }

    function clearConflictsForInstance($commentId) {
        $deleteWhere = array('CommentId1'=>$commentId);
        $db =& Database::singleton();
        $db->delete('conflicts_unresolved', $deleteWhere);
    }

    function isInstrumentInstanceInConflictState($commentId) {
        $db =& Database::singleton();
        $conflictCount = $db->selectOne("SELECT COUNT(*) FROM conflicts_unresolved WHERE CommentId1='$commentId'");
        return ($conflictCount != 0);
    }

}

?>