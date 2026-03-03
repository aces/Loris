ALTER TABLE participant_status_options
ADD COLUMN commentRequired tinyint(1) DEFAULT NULL;

UPDATE participant_status_options
SET commentRequired = 1
WHERE Description NOT IN ('Active', 'Complete') AND parentID IS NULL;