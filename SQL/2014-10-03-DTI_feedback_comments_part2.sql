-- Intensity comments
INSERT INTO feedback_mri_predefined_comments (CommentTypeID,Comment) 
VALUES ((SELECT CommentTypeID FROM feedback_mri_comment_types WHERE CommentName='Intensity artifact'),"susceptibility artifact due to anatomy");
