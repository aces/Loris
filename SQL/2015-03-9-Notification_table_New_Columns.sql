ALTER TABLE notification_types ADD COLUMN `Origin` varchar(255) DEFAULT NULL;
ALTER TABLE notification_spool ADD COLUMN `ProcessID` int(11) NOT NULL DEFAULT '0' AFTER NotificationTypeID;
ALTER TABLE notification_spool ADD COLUMN `TimeSpooledNew` datetime DEFAULT NULL AFTER TimeSpooled;
ALTER TABLE notification_spool ADD COLUMN `Error` tinyint(1) DEFAULT '0' AFTER Message;

INSERT INTO notification_types (Type,private,Description,Origin) VALUES
    ('minc insertion',1,'Insertion of the mincs into the mri-table','minc_insertion'),
    ('tarchive loader',1,'calls specific Insertion Scripts','tarchive_loader'),
    ('tarchive validation',1,'Validation of the dicoms After uploading','tarchive_validation'),
    ('mri upload',1,'Validation of DICOMS before uploading','imaging_upload_file'),
    ('mri upload',1,'Validation and execution of DicomTar.pl and TarchiveLoader','ImagingUpload');
