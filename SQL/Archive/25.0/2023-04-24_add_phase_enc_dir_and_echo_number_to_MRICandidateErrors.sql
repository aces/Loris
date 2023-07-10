-- ---------------------------------------------------------------------------------------------
-- alter MRICandidateErrors table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE MRICandidateErrors ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE MRICandidateErrors ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;
