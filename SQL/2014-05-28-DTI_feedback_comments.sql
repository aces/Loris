--
-- Add Dominant Direction Artifact (Color Artifact) feedback mri comment type
--
INSERT INTO feedback_mri_comment_types (CommentTypeID, CommentName, CommentType, CommentStatusField) VALUES (8,"Dominant Direction Artifact (Color Artifact, DWI only)","volume",'a:2:{s:5:"field";s:14:"Color Artifact";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"Good";i:2;s:4:"Fair";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}');
--
-- Add Entropy rating feedback mri comment type
--
INSERT INTO feedback_mri_comment_types (CommentTypeID, CommentName, CommentType, CommentStatusField) VALUES (9,"Entropy Rating (DWI only)", "volume", 'a:2:{s:5:"field";s:7:"Entropy";s:6:"values";a:5:{i:0;s:0:"";i:1;s:10:"Acceptable";i:2;s:10:"Suspicious";i:3;s:12:"Unacceptable";i:4;s:13:"Not Available";}}');
-- Add Motion Slice Wise (DWI only)
-- INSERT INTO feedback_mri_comment_types (CommentTypeID, CommentName, CommentType, CommentStatusField) VALUES (10,"Slice Wise Motion (DWI only)", "volume", 'a:2:{s:5:"field";s:17:"Slice Wise Motion";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"None";i:2;s:6:"Slight";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}');
-- Add Motion Gradient Wise (DWI only)
-- INSERT INTO feedback_mri_comment_types (CommentTypeID, CommentName, CommentType, CommentStatusField) VALUES (11,"Gradient Wise Motion (DWI only)", "volume", 'a:2:{s:5:"field";s:20:"Gradient Wise Motion";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"None";i:2;s:6:"Slight";i:3;s:4:"Poor";i:4;s:12:"Unacceptable";}}');

-- Intensity comments
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (24,2,"checkerboard artifact");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (25,2,"horizontal intensity striping (Venetian blind effect, DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (26,2,"diagonal striping (NRRD artifact, DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (27,2,"high intensity in direction of acquisition");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (28,2,"signal loss (dark patches)");

-- color artifact comments
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (29,8,"red artifact");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (30,8,"green artifact");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (31,8,"blue artifact");

-- overall comments 
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (32,6,"Too few remaining gradients (DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (33,6,"No b0 remaining after DWIPrep (DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (34,6,"No gradient information available from scanner (DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (35,6,"Incorrect diffusion direction (DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (36,6,"Duplicate series");

-- motion artifacts
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (37,3,"slight slice wise artifact (DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (38,3,"severe slice wise artifact (DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (39,3,"slight gradient wise artifact (DWI only)");
INSERT INTO feedback_mri_predefined_comments (PredefinedCommentID,CommentTypeID,Comment) VALUES (40,3,"severe gradient wise artifact (DWI only)");
