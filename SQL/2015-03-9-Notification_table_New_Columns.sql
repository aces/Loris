ALTER TABLE notification_spool ADD COLUMN `Origin` varchar(255) DEFAULT NULL;
ALTER TABLE notification_spool ADD COLUMN `ProcessID` int(11) NOT NULL DEFAULT '0' AFTER NotificationTypeID;
ALTER TABLE notification_spool ADD COLUMN `TimeSpooledNew` datetime DEFAULT NULL AFTER TimeSpooled;
ALTER TABLE notification_spool ADD COLUMN `Error` enum('Y','N') default NULL AFTER Message;

INSERT INTO notification_types (Type,private,Description) VALUES
    ('minc insertion',1,'Insertion of the mincs into the mri-table'),
    ('tarchive loader',1,'calls specific Insertion Scripts'),
    ('tarchive validation',1,'Validation of the dicoms After uploading'),
    ('mri upload runner',1,'Validation of DICOMS before uploading'),
    ('mri upload processing class ',1,'Validation and execution of DicomTar.pl and TarchiveLoader');

UPDATE notification_spool SET TimeSpooledNew=FROM_UNIXTIME(TimeSpooled);
ALTER table notification_spool DROP COLUMN TimeSpooled;
ALTER table notification_spool CHANGE COLUMN TimeSpooledNew TimeSpooled datetime DEFAULT NULL;


