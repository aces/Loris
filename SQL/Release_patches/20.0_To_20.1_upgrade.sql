ALTER TABLE ConfigSettings
  MODIFY COLUMN DataType ENUM('text','boolean','email','instrument','textarea','scan_type', 'lookup_center');

UPDATE ConfigSettings
  SET DataType='lookup_center'
  WHERE Name='lookUpCenterNameUsing';

UPDATE ConfigSettings SET
  Description='Path to the upload directory for incoming MRI studies',
  Label='MRI Incoming Directory'
  WHERE Name='MRIUploadIncomingPath';

ALTER TABLE users
	ADD COLUMN active_from DATE
	AFTER language_preference;

ALTER TABLE users
	ADD COLUMN active_to DATE
	AFTER active_from;
