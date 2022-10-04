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
