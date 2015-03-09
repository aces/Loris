ALTER TABLE notification_types ADD COLUMN `Origin` varchar(255) DEFAULT NULL;
ALTER TABLE notification_spool ADD COLUMN `ProcessID` int(11) NOT NULL DEFAULT '0' AFTER NotificationTypeID;
ALTER TABLE notification_spool CHANGE COLUMN TimeSpooled TimeSpooled datetime DEFAULT NULL;
ALTER TABLE notification_spool ADD COLUMN `Error` tinyint(1) DEFAULT '0' AFTER Message;

INSERT INTO notification_types (Type,Description,Origin) VALUES ('mri','Insertion of the mincs into the mri-table','minc_insertion');
INSERT INTO notification_types (Type,Description,Origin) VALUES ('mri','calls specific Insertiong Scripts','tarchive_loader');
INSERT INTO notification_types (Type,Description,Origin) VALUES ('mri','Validation of the dicoms After uploading','tarchive_validation');
INSERT INTO notification_types (Type,Description,Origin) VALUES ('mri','Validation of DICOMS before uploading','imaging_upload_file');
INSERT INTO notification_types (Type,Description,Origin) VALUES ('mri','Validation and execution of DicomTar.pl and TarchiveLoader','ImagingUpload');
