-- ---------------------------------------------------------------------------------------------
-- alter files table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE files ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)   DEFAULT NULL;
ALTER TABLE files ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter files_qcstatus table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE files_qcstatus ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)   DEFAULT NULL;
ALTER TABLE files_qcstatus ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;

-- ---------------------------------------------------------------------------------------------
-- alter feedback_mri_comments table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE feedback_mri_comments ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)   DEFAULT NULL;
ALTER TABLE feedback_mri_comments ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;
