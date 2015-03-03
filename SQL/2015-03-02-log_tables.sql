REATE TABLE `log` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `LogTypeID` int(11) NOT NULL DEFAULT '0',
  `ProcessID` int(11) NOT NULL DEFAULT '0',
  `CreatedTime` int(11) NOT NULL DEFAULT '0',
  `Message` text,
  `Error` tinyint(1) DEFAULT '0',
  `CenterID` tinyint(2) unsigned DEFAULT NULL,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




CREATE TABLE `log_types` (
  `LogTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `Type` enum('mri','behavioural') DEFAULT NULL,
  `private` tinyint(1) DEFAULT '0',
  `Description` text,
  `Origin` varchar(255),
  PRIMARY KEY (`LogTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO log_types (Type,Description,Origin) VALUES ('mri','Insertion of the mincs into the mri-table','minc_insertion');
INSERT INTO log_types (Type,Description,Origin) VALUES ('mri','calls the different scrips','tarchive_loader');
INSERT INTO log_types (Type,Description,Origin) VALUES ('mri','Validation of the dicoms After uploading','tarchive_validation');
INSERT INTO log_types (Type,Description,Origin) VALUES ('mri','Validation of DICOMS before uploading','imaging_upload_file');
INSERT INTO log_types (Type,Description,Origin) VALUES ('mri','Validation,Running DicomTar.pl and TarchiveLoader','ImagingUpload');

