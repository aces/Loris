-- Note: For projects with duplicate examiners, patch must be run AFTER running
-- tools/single_use/Remove_duplicate_examiners.php

-- Remove constraint on full name
-- Change userID to be unique
-- Make full name / userID combined unique
ALTER TABLE examiners
	DROP INDEX `full_name`,
	DROP INDEX `FK_examiners_2`,
	ADD UNIQUE KEY `unique_examiner` (`full_name`,`userID`),
	ADD UNIQUE KEY `FK_examiners_2` (`userID`);