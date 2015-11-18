UPDATE feedback_mri_comment_types SET CommentName='Geometric distortion', CommentStatusField='a:2:{s:5:\"field\";s:20:\"Geometric_distortion\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"Good\";i:2;s:4:\"Fair\";i:3;s:4:\"Poor\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName='Geometric intensity';

UPDATE feedback_mri_comment_types SET CommentStatusField='a:2:{s:5:"field";s:18:"Intensity_artifact";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"Good";i:2;s:4:"Fair";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}' WHERE CommentName="Intensity artifact";

UPDATE feedback_mri_comment_types SET CommentStatusField='a:2:{s:5:\"field\";s:30:\"Movement_artifacts_within_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Movement artifact";

UPDATE feedback_mri_comment_types SET CommentStatusField='a:3:{s:5:\"field\";s:31:\"Movement_artifacts_between_scan\";s:6:\"values\";a:5:{i:0;s:0:\"\";i:1;s:4:\"None\";i:2;s:15:\"Slight Movement\";i:3;s:12:\"Poor Quality\";i:4;s:12:\"Unacceptable\";}}' WHERE CommentName="Packet movement artifact";
