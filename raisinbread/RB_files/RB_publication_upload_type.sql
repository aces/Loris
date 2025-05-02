SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `publication_upload_type`;
LOCK TABLES `publication_upload_type` WRITE;
INSERT INTO `publication_upload_type` (`PublicationUploadTypeID`, `Label`) VALUES (4,'Other');
INSERT INTO `publication_upload_type` (`PublicationUploadTypeID`, `Label`) VALUES (1,'Paper');
INSERT INTO `publication_upload_type` (`PublicationUploadTypeID`, `Label`) VALUES (2,'Poster');
INSERT INTO `publication_upload_type` (`PublicationUploadTypeID`, `Label`) VALUES (3,'Presentation');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
