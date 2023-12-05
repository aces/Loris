SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `electrophysiology_uploader`;
LOCK TABLES `electrophysiology_uploader`  WRITE; 

INSERT INTO `electrophysiology_uploader` (`UploadID`,`MetaData`,`UploadDate`,`SessionID`,`UploadLocation`,`Status`,`UploadedBy`) 
values('1','Montreal','2023-04-19 14:43:22','1','archives/MTL001_300001_V1_bids_1681247806.tar.gz','Not Started','admin');

INSERT INTO `electrophysiology_uploader` (`UploadID`,`MetaData`,`UploadDate`,`SessionID`,`UploadLocation`,`Status`,`UploadedBy`) 
values('2','Data Coordinating Center','2023-04-19 13:53:55','1347','archives/MTL001_300001_V1_bids_1681247865.tar.gz','Not Started','admin');

INSERT INTO `electrophysiology_uploader` (`UploadID`,`MetaData`,`UploadDate`,`SessionID`,`UploadLocation`,`Status`,`UploadedBy`) 
values('3','Ottawa','2023-04-19 13:33:19','1189','archives/MTL001_300001_V1_bids_1681247891.tar.gz','Not Started','admin');

INSERT INTO `electrophysiology_uploader` (`UploadID`,`MetaData`,`UploadDate`,`SessionID`,`UploadLocation`,`Status`,`UploadedBy`) 
values('4','Rome','2023-04-19 14:43:22','2','archives/MTL001_300001_V1_bids_1681248351.tar.gz','Not Started','admin');

INSERT INTO `electrophysiology_uploader` (`UploadID`,`MetaData`,`UploadDate`,`SessionID`,`UploadLocation`,`Status`,`UploadedBy`) 
values('5','Montreal','2023-04-19 16:02:25','3','archives/MTL001_300001_V1_bids_1681249251.tar.gz','Not Started','admin');

UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
