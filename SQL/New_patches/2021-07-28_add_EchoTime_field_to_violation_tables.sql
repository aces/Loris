ALTER TABLE MRICandidateErrors ADD `EchoTime` double DEFAULT NULL AFTER `Reason`;
ALTER TABLE mri_violations_log ADD `EchoTime` double DEFAULT NULL AFTER `ValidRegex`;
ALTER TABLE mri_protocol_violated_scans ADD `EchoTime` double DEFAULT NULL AFTER `image_type`;
