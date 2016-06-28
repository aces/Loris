
-- Add 'videos' tab to the menu under Clinical section
DELETE FROM LorisMenu WHERE Label='Videos';
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Videos', 'videos/', (SELECT ID FROM LorisMenu as L WHERE Label='Clinical'), 5);

-- Add 'videos' table
DROP TABLE IF EXISTS `videos`;
CREATE TABLE `videos` (
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


-- Add user permissions
DELETE FROM permissions WHERE code='video_upload';
INSERT INTO permissions (`code`, `description`, `categoryID`) VALUES (
	'video_upload', 'Video uploading ', 1
);

DELETE FROM user_perm_rel WHERE permID=(SELECT permID FROM permissions WHERE code = 'video_upload');
INSERT INTO user_perm_rel (`userID`, `permID`) VALUES (
	(SELECT ID FROM users WHERE UserID = 'admin'),
	(SELECT permID FROM permissions WHERE code = 'video_upload')
);


-- Set path to upload/download videos
SET @parentID = (SELECT ID FROM ConfigSettings WHERE Name = 'paths');
DELETE FROM ConfigSettings WHERE Name='videosPath';
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
	'videosPath', 'Path to uploaded videos', 1, 0, 'text', @parentID, 'Videos', 10
);

DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='videosPath');
INSERT INTO Config (`ConfigID`, `Value`) VALUES (
	(SELECT ID FROM ConfigSettings WHERE Name='videosPath'), '/data/uploads/'
);


