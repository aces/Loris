ALTER TABLE mri_protocol_violated_scans CHANGE Last_inserted time_run datetime;
ALTER TABLE mri_protocol_violated_scans ADD COLUMN time_range varchar(255) AFTER zstep_range;
