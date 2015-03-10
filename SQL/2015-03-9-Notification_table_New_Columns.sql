ALTER TABLE notification_spool ADD COLUMN `Origin` varchar(255) DEFAULT NULL;
ALTER TABLE notification_spool ADD COLUMN `ProcessID` int(11) NOT NULL DEFAULT '0' AFTER NotificationTypeID;
ALTER TABLE notification_spool CHANGE COLUMN TimeSpooled TimeSpooled datetime DEFAULT NULL;
ALTER TABLE notification_spool ADD COLUMN `Error` enum('Y','N') default NULL AFTER Message;

INSERT INTO notification_types (Type,private,Description) VALUES
    ('minc insertion',1,'Insertion of the mincs into the mri-table'),
    ('tarchive loader',1,'calls specific Insertion Scripts'),
    ('tarchive validation',1,'Validation of the dicoms After uploading'),
    ('mri upload',1,'Validation of DICOMS before uploading'),
    ('mri upload',1,'Validation and execution of DicomTar.pl and TarchiveLoader');
