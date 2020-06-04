-- Intensity comments
UPDATE feedback_mri_comment_types SET CommentName="Intensity artifact",CommentStatusField='a:2:{s:5:\"field\";s:9:\"Intensity_artifact\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Intensity";
UPDATE parameter_type SET Name='Intensity_artifact' WHERE Name="Intensity";
INSERT INTO feedback_mri_predefined_comments (CommentTypeID,Comment) 
VALUES ((SELECT CommentTypeID FROM feedback_mri_comment_types WHERE CommentName='Intensity artifact'),"susceptibility artifact due to anatomy");
