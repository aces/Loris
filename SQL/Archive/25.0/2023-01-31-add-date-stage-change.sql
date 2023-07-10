ALTER TABLE session
	ADD COLUMN Date_status_change date DEFAULT NULL AFTER Date_visit;