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
