-- ---------------------------------------------------------------------------------------------
-- fix incorrectly serialized feedback
-- ---------------------------------------------------------------------------------------------
UPDATE feedback_mri_comment_types SET
    CommentStatusField='a:2:{s:5:"field";s:34:"Movement_artifacts_between_packets";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"None";i:2;s:15:"Slight Movement";i:3;s:12:"Poor Quality";i:4;s:12:"Unacceptable";}}'
WHERE CommentTypeID=4;
