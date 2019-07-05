CREATE TABLE `test_names_language_rel` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Test_name_ID` int(10) unsigned DEFAULT NULL,
  `Full_name` varchar(255) NOT NULL,
  `language_code` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `UK_test_names_language_rel_1` UNIQUE (`Test_name_ID`, `language_code`),
  CONSTRAINT `FK_test_name_language_rel_1` FOREIGN KEY (`Test_name_ID`) REFERENCES `test_names` (`ID`),
  CONSTRAINT `FK_test_name_language_rel_2` FOREIGN KEY (`language_code`) REFERENCES `language` (`language_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `session`
    ADD COLUMN `language_code` varchar(255) NOT NULL DEFAULT 'en-CA',
    ADD CONSTRAINT `FK_session_4` FOREIGN KEY (`language_code`) REFERENCES `language` (`language_code`);

INSERT INTO `test_names_language_rel` (Test_name_ID, Full_name, language_code)
    SELECT ID, Full_name, 'en-CA' FROM test_names;

ALTER TABLE `test_names`
    DROP COLUMN `Full_name`;

-- remove this
INSERT INTO `test_names_language_rel` (Test_name_ID, Full_name, language_code) VALUES
    (1, "FR-Radiology", "fr-CA"),
    (2, "FR-BMI", "fr-CA"),
    (3, "FR-MedicalHist", "fr-CA"),
    (4, "FR-MRIPAram", "fr-CA"),
    (6, "FR-AOSI", "fr-CA");