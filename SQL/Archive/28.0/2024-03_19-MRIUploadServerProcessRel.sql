CREATE TABLE `mri_upload_server_processes_rel` (
  `UploadID` int(10) unsigned NOT NULL,
  `ProcessID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`UploadID`,`ProcessID`),
  CONSTRAINT `UK_mri_upload_server_processes_rel_ProcessID`
    UNIQUE KEY `ProcessID` (`ProcessID`),
  CONSTRAINT `FK_mri_upload_server_processes_rel_UploadID`
    FOREIGN KEY (`UploadID`) REFERENCES `mri_upload` (`UploadID`),
  CONSTRAINT `FK_mri_upload_server_processes_rel_ProcessID`
    FOREIGN KEY (`ProcessID`) REFERENCES `server_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
