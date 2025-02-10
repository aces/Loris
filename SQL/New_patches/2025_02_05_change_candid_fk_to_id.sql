-- Change FKs from CandID to CandidateID which is now candidate.ID
ALTER TABLE CNV DROP constraint CNV_ibfk_3;
UPDATE CNV SET CandID=(SELECT ID from candidate c WHERE c.CandID=CNV.CandID);
ALTER TABLE CNV CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE CNV ADD CONSTRAINT CNV_ibfk_3 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE candidate_consent_rel DROP CONSTRAINT `FK_candidate_consent_rel_CandidateID`;
UPDATE candidate_consent_rel SET CandidateID=(SELECT ID from candidate c WHERE c.CandID=candidate_consent_rel.CandidateID);
ALTER TABLE candidate_consent_rel CHANGE CandidateID CandidateID int(10) unsigned;
ALTER TABLE candidate_consent_rel ADD CONSTRAINT FK_candidate_consent_rel_CandidateID FOREIGN KEY (CandidateID) REFERENCES candidate(ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE participant_status DROP CONSTRAINT `fk_participant_status_3`;
UPDATE participant_status SET CandID=(SELECT ID from candidate c WHERE c.CandID=participant_status.CandID);
ALTER TABLE participant_status CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE participant_status ADD CONSTRAINT FK_participant_status_3 FOREIGN KEY (CandidateID) REFERENCES candidate(ID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE dataquery_run_results DROP CONSTRAINT `dataquery_run_results_ibfk_1`;
UPDATE dataquery_run_results SET CandID=(SELECT ID from candidate c WHERE c.CandID=dataquery_run_results.CandID);
ALTER TABLE dataquery_run_results CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE dataquery_run_results ADD CONSTRAINT dataquery_run_results_ibfk_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE issues DROP CONSTRAINT `fk_issues_3`;
UPDATE issues SET CandID=(SELECT ID from candidate c WHERE c.CandID=issues.CandID);
ALTER TABLE issues CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE issues ADD CONSTRAINT fk_issues_3 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE session DROP CONSTRAINT `fk_session_1`;
UPDATE session SET CandID=(SELECT ID from candidate c WHERE c.CandID=session.CandID);
ALTER TABLE session CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE session ADD CONSTRAINT fk_session_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);l

ALTER TABLE genomic_candidate_files_rel DROP CONSTRAINT `genomic_candidate_files_rel_ibfk_1`;
UPDATE genomic_candidate_files_rel SET CandID=(SELECT ID from candidate c WHERE c.CandID=genomic_candidate_files_rel.CandID);
ALTER TABLE genomic_candidate_files_rel CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE genomic_candidate_files_rel ADD CONSTRAINT genomic_candidate_files_rel_ibfk_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE mri_scanner DROP CONSTRAINT `FK_mri_scanner_1`;
UPDATE mri_scanner SET CandID=(SELECT ID from candidate c WHERE c.CandID=mri_scanner.CandID);
ALTER TABLE mri_scanner CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE mri_scanner ADD CONSTRAINT FK_mri_scanner_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE genomic_sample_candidate_rel DROP CONSTRAINT `genomic_sample_candidate_rel_ibfk_1`;
UPDATE genomic_sample_candidate_rel SET CandID=(SELECT ID from candidate c WHERE c.CandID=genomic_sample_candidate_rel.CandID);
ALTER TABLE genomic_sample_candidate_rel CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE genomic_sample_candidate_rel ADD CONSTRAINT `genomic_sample_candidate_rel_ibfk_1` FOREIGN KEY (CandidateID) REFERENCES `candidate`(`ID`);

ALTER TABLE SNP_candidate_rel DROP CONSTRAINT `fk_SNP_candidate_rel_2`;
UPDATE SNP_candidate_rel SET CandID=(SELECT ID from candidate c WHERE c.CandID=SNP_candidate_rel.CandID);
ALTER TABLE SNP_candidate_rel CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE SNP_candidate_rel ADD CONSTRAINT `fk_SNP_candidate_rel_2` FOREIGN KEY (CandidateID) REFERENCES candidate(ID) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE parameter_candidate DROP CONSTRAINT `FK_parameter_candidate_2`;
UPDATE parameter_candidate SET CandID=(SELECT ID from candidate c WHERE c.CandID=parameter_candidate.CandID);
ALTER TABLE parameter_candidate CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE parameter_candidate ADD CONSTRAINT FK_parameter_candidate_2 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

ALTER TABLE candidate_diagnosis_evolution_rel DROP CONSTRAINT `PK_candidate_diagnosis_evolution_rel`;
ALTER TABLE candidate_diagnosis_evolution_rel DROP CONSTRAINT `FK_candidate_diagnosis_evolution_rel_CandID`;
UPDATE candidate_diagnosis_evolution_rel SET CandID=(SELECT ID from candidate c WHERE c.CandID=candidate_diagnosis_evolution_rel.CandID);
ALTER TABLE candidate_diagnosis_evolution_rel CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE candidate_diagnosis_evolution_rel ADD CONSTRAINT PK_candidate_diagnosis_evolution_rel PRIMARY KEY (CandidateID, DxEvolutionID);
ALTER TABLE candidate_diagnosis_evolution_rel ADD CONSTRAINT FK_candidate_diagnosis_evolution_rel_CandID FOREIGN KEY (CandidateID) REFERENCES candidate(ID) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Changes references to candidate.CandID that were NOT FK. Add FK
UPDATE feedback_bvl_thread SET CandID=(SELECT ID from candidate c WHERE c.CandID=feedback_bvl_thread.CandID);
ALTER TABLE feedback_bvl_thread CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE feedback_bvl_thread ADD CONSTRAINT FK_feedback_bvl_thread_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE mri_violations_log SET CandID=(SELECT ID from candidate c WHERE c.CandID=mri_violations_log.CandID);
ALTER TABLE mri_violations_log CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE mri_violations_log ADD CONSTRAINT FK_mri_violations_log_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE mri_protocol_violated_scans SET CandID=(SELECT ID from candidate c WHERE c.CandID=mri_protocol_violated_scans.CandID);
ALTER TABLE mri_protocol_violated_scans CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE mri_protocol_violated_scans ADD CONSTRAINT FK_mri_protocol_violated_scans_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE participant_status_history SET CandID=(SELECT ID from candidate c WHERE c.CandID=participant_status_history.CandID);
ALTER TABLE participant_status_history CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE participant_status_history ADD CONSTRAINT FK_participant_status_history_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);

UPDATE family SET CandID=(SELECT ID from candidate c WHERE c.CandID=family.CandID);
ALTER TABLE family CHANGE CandID CandidateID int(10) unsigned;
ALTER TABLE family ADD CONSTRAINT FK_family_candidate_1 FOREIGN KEY (CandidateID) REFERENCES candidate(ID);


-- Change candidate's PK to ID
ALTER TABLE candidate DROP PRIMARY KEY, ADD PRIMARY KEY(ID);
