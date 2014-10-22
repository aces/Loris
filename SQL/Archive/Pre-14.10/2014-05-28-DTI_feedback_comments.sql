--
-- Add Dominant Direction Artifact (Color Artifact) feedback mri comment type
--
INSERT INTO feedback_mri_comment_types (CommentTypeID, CommentName, CommentType, CommentStatusField) VALUES (8,"Dominant Direction Artifact (DWI ONLY)","volume",'a:2:{s:5:"field";s:14:"Color_Artifact";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"Good";i:2;s:4:"Fair";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}');
--
-- Add Entropy rating feedback mri comment type
--
INSERT INTO feedback_mri_comment_types (CommentTypeID, CommentName, CommentType, CommentStatusField) VALUES (9,"Entropy Rating (DWI ONLY)", "volume", 'a:2:{s:5:"field";s:7:"Entropy";s:6:"values";a:5:{i:0;s:0:"";i:1;s:10:"Acceptable";i:2;s:10:"Suspicious";i:3;s:12:"Unacceptable";i:4;s:13:"Not Available";}}');

-- insert in parameter_type table color artifact and entropy entries
INSERT INTO parameter_type (Name, Type, SourceFrom, Queryable, IsFile) VALUES ("Color_Artifact","text","parameter_file",0,0);
INSERT INTO parameter_type (Name, Type, SourceFrom, Queryable, IsFile) VALUES ("Entropy","text","parameter_file",0,0);

-- Intensity comments
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (24,2,"checkerboard artifact");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (25,2,"horizontal intensity striping (Venetian blind effect, DWI ONLY)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (26,2,"diagonal striping (NRRD artifact, DWI ONLY)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (27,2,"high intensity in direction of acquisition");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (28,2,"signal loss (dark patches)");

-- color artifact comments
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (29,8,"red artifact");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (30,8,"green artifact");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (31,8,"blue artifact");

-- overall comments 
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (32,6,"Too few remaining gradients (DWI ONLY)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (33,6,"No b0 remaining after DWIPrep (DWI ONLY)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (34,6,"No gradient information available from scanner (DWI ONLY)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (35,6,"Incorrect diffusion direction (DWI ONLY)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (36,6,"Duplicate series");

-- motion artifacts
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (37,3,"slice wise artifact (DWI ONLY)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (38,3,"gradient wise artifact (DWI ONLY)");

