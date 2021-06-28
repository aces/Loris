ALTER TABLE `session`
    ADD COLUMN `languageID` integer unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_session_4` FOREIGN KEY (`languageID`) REFERENCES `language` (`language_id`);
