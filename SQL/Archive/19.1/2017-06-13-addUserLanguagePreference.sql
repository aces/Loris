CREATE TABLE `language` (
  `language_id` integer unsigned NOT NULL AUTO_INCREMENT,
  `language_code` varchar(255) NOT NULL,
  `language_label` varchar(255) NOT NULL,
  PRIMARY KEY (`language_id`),
  UNIQUE KEY (`language_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO language (language_code, language_label) VALUES ('en-CA', 'English');

ALTER TABLE users ADD language_preference integer unsigned DEFAULT NULL;
ALTER TABLE users ADD CONSTRAINT `FK_users_2` FOREIGN KEY (`language_preference`) REFERENCES `language` (`language_id`);