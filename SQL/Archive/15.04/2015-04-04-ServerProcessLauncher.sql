DROP TABLE IF EXISTS `server_processes`;
CREATE TABLE `server_processes` (
  `id`                int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pid`               int(11) unsigned NOT NULL,
  `type`              enum('mri_upload') NOT NULL,
  `stdout_file`       varchar(255) DEFAULT NULL,
  `stderr_file`       varchar(255) DEFAULT NULL,
  `exit_code_file`    varchar(255) DEFAULT NULL,
  `exit_code`         varchar(255) DEFAULT NULL,
  `userid`            varchar(255) NOT NULL,
  `start_time`        timestamp NULL,
  `end_time`          timestamp NULL,
  `exit_text`         text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_task_1` (`userid`),
  CONSTRAINT `FK_task_1` FOREIGN KEY (`userid`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO permissions (code,description,categoryID) VALUES ('server_processes_manager','View and manage server processes','2');

INSERT INTO user_perm_rel (userID, permID) VALUES (1, (SELECT permID FROM permissions WHERE code = 'server_processes_manager'));

INSERT INTO LorisMenu (Parent, Label, Link, Visible, OrderNumber) VALUES (6, 'Server Processes Manager', 'main.php?test_name=server_processes_manager', NULL, 6);

INSERT INTO LorisMenuPermissions (MenuID, PermID) 
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='server_processes_manager' AND m.Label='Server Processes Manager';
