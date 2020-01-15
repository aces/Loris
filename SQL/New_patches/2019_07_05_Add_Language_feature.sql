ALTER TABLE `session`
    ADD COLUMN `languageID` integer unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_session_4` FOREIGN KEY (`languageID`) REFERENCES `language` (`language_id`);

INSERT INTO language (language_code, language_label) VALUES
    ('fr-CA', 'French');
