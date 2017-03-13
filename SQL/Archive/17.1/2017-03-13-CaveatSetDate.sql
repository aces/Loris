--Adding caveat flag set date
ALTER TABLE `candidate` ADD COLUMN `flagged_date` DATE DEFAULT NULL;
