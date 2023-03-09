ALTER TABLE `physiological_annotation_parameter`
    MODIFY COLUMN `Description` text DEFAULT NULL
;

-- ---------------------------------------------------------------------------------------------
-- alter mri_protocol table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE mri_protocol ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)   DEFAULT NULL;
ALTER TABLE mri_protocol ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;


-- ---------------------------------------------------------------------------------------------
-- alter mri_protocol_violated_scans table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE mri_protocol_violated_scans ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)   DEFAULT NULL;
ALTER TABLE mri_protocol_violated_scans ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter files table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE files ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE files ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter files_qcstatus table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE files_qcstatus ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE files_qcstatus ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter feedback_mri_comments table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE feedback_mri_comments ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE feedback_mri_comments ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter mri_violations_log table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE mri_violations_log ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE mri_violations_log ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- add an entry in parameter_type table to for the BIDS PhaseEncodingDirection parameter
-- ---------------------------------------------------------------------------------------------
INSERT INTO parameter_type (Name, Type, Description, SourceFrom)
SELECT 'PhaseEncodingDirection', 'text', 'BIDS PhaseEncodingDirection (a.k.a. i, i-, j, j-, k, k-)', 'parameter_file'
FROM DUAL
WHERE NOT EXISTS (SELECT * FROM parameter_type where Name='PhaseEncodingDirection');

-- ---------------------------------------------------------------------------------------------
-- fix incorrectly serialized feedback
-- ---------------------------------------------------------------------------------------------
UPDATE feedback_mri_comment_types SET
    CommentStatusField='a:2:{s:5:"field";s:34:"Movement_artifacts_between_packets";s:6:"values";a:5:{i:0;s:0:"";i:1;s:4:"None";i:2;s:15:"Slight Movement";i:3;s:12:"Poor Quality";i:4;s:12:"Unacceptable";}}'
WHERE CommentTypeID=4;
