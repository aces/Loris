ALTER TABLE media ADD COLUMN  language_id INT UNSIGNED DEFAULT NULL;
ALTER TABLE media ADD CONSTRAINT `FK_media_language` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`);

