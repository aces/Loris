ALTER TABLE `session`
    ADD COLUMN `language_id` integer unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_session_4` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`);

INSERT INTO language (language_code, language_label) VALUES
    ('fr-CA', 'French');
