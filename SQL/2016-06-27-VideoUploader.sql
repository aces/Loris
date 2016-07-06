
-- Add 'videos' tab to the menu under Clinical section
DELETE FROM LorisMenu WHERE Label='Media';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Media', 'media/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 5);

-- Add 'videos' table
CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pscid` varchar(255) NOT NULL DEFAULT '',
  `visit_label` varchar(255) NOT NULL DEFAULT '',
  `instrument` varchar(255) DEFAULT NULL,
  `for_site` int(2) DEFAULT NULL,
  `date_taken` date DEFAULT NULL,
  `comments` text,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) unsigned DEFAULT NULL,
  `data_dir` varchar(255) DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `hide_video` tinyint(1) DEFAULT '0',
  `date_uploaded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- If table already exists, update field names
ALTER IGNORE TABLE videos CHANGE record_id id int(11);
ALTER IGNORE TABLE videos CHANGE PSCID pscid varchar(255);
ALTER IGNORE TABLE videos CHANGE Instrument instrument varchar(255);
ALTER IGNORE TABLE videos CHANGE visitLabel visit_label varchar(255);
ALTER IGNORE TABLE videos CHANGE Date_taken date_taken date;
ALTER IGNORE TABLE videos CHANGE Date_uploaded date_uploaded timestamp;
ALTER IGNORE TABLE videos CHANGE File_type file_type varchar(255);
ALTER IGNORE TABLE videos CHANGE Data_dir data_dir varchar(255);
ALTER IGNORE TABLE videos CHANGE File_name file_name varchar(255);
ALTER IGNORE TABLE videos CHANGE File_size file_size bigint(20);
ALTER IGNORE TABLE videos CHANGE For_site for_site varchar(255);

-- Add user permissions
SET @currentPermissionID = (SELECT permID FROM permissions WHERE code='video_upload');
INSERT IGNORE INTO permissions (`permID`, `code`, `description`, `categoryID`) VALUES (
    @currentPermissionID, 'video_upload', 'Video uploading ', 1
);
INSERT IGNORE INTO user_perm_rel (`userID`, `permID`) VALUES (
  (SELECT ID FROM users WHERE UserID = 'admin'), (SELECT permID FROM permissions WHERE code = 'video_upload')
);

-- Set path to upload/download videos
SET @parentID = (SELECT ID FROM ConfigSettings WHERE Name = 'paths');
DELETE FROM ConfigSettings WHERE Name='mediaPath';
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'mediaPath', 'Path to uploaded media files', 1, 0, 'text', @parentID, 'Media', 10
);

DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='videosPath');
INSERT INTO Config (`ConfigID`, `Value`) VALUES (
  (SELECT ID FROM ConfigSettings WHERE Name='videosPath'), '/data/uploads/'
);


