CREATE TABLE `mri_upload_server_processes_rel` (
  `mri_upload_id` int(10) unsigned NOT NULL,
  `process_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`mri_upload_id`,`process_id`),
  KEY `fk_process_id` (`process_id`),
  CONSTRAINT `mri_upload_server_processes_rel_ibfk_1` FOREIGN KEY (`mri_upload_id`) REFERENCES `mri_upload` (`UploadID`),
  CONSTRAINT `mri_upload_server_processes_rel_ibfk_2` FOREIGN KEY (`process_id`) REFERENCES `server_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
