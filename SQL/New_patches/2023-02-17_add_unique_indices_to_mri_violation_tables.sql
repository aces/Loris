-- ---------------------------------------------------------------------------------------------
-- alter MRICandidateErrors table to add PhaseEncodingDirection and EchoNumber
-- ---------------------------------------------------------------------------------------------
ALTER TABLE MRICandidateErrors ADD COLUMN `PhaseEncodingDirection` VARCHAR(3)  DEFAULT NULL;
ALTER TABLE MRICandidateErrors ADD COLUMN `EchoNumber`             VARCHAR(20) DEFAULT NULL;


ALTER TABLE MRICandidateErrors ADD UNIQUE KEY `unique_MCE_entry` (`SeriesUID`, `EchoTime`, `PhaseEncodingDirection`, `EchoNumber`, `PatientName`, `Reason`);

ALTER TABLE mri_violations_log
    ADD COLUMN `all_columns_hash` binary(32) GENERATED ALWAYS AS (UNHEX(SHA2(CONCAT(SeriesUID, '-', EchoTime, '-', PhaseEncodingDirection, '-', EchoNumber, '-', Scan_type, '-', Severity, '-', Header, '-', Value, '-', ValidRange, '-', ValidRegex), 256))),
    ADD UNIQUE INDEX `unique_mvl_entry` (`all_columns_hash`);

ALTER TABLE mri_protocol_violated_scans ADD UNIQUE KEY `unique_mpvs_entry` (`SeriesUID`, `TE_range`, `PhaseEncodingDirection`, `EchoNumber`);
