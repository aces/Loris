ALTER TABLE users 
	ADD COLUMN active_from DATE 
	AFTER language_preference;

ALTER TABLE users 
	ADD COLUMN active_to DATE 
	AFTER active_from;


