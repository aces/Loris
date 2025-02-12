ALTER TABLE candidate ADD COLUMN ParticipantID VARCHAR(25) NULL, ADD UNIQUE INDEX `UK_candidate_ParticipantID` (`ParticipantID` ASC);
INSERT INTO modules (Name, Active) VALUES ('participant_portal', 'Y');

CREATE TABLE `instrument_completion_time` (
                                              `ID` int(10) NOT NULL AUTO_INCREMENT,
                                              `TestNameID` int(6) NOT NULL,
                                              `completion_time` VARCHAR(10) DEFAULT NULL,
                                              PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `partcipant_portal_emails` (
                                              `ID` int(10) NOT NULL AUTO_INCREMENT,
                                              `TestNameID` int(6) NOT NULL,
                                              `completion_time` VARCHAR(10) DEFAULT NULL,
                                              PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `participant_portal_emails` (
                                             `ID` INT(10) NOT NULL AUTO_INCREMENT,
                                             `ParticipantAccountID` INT(10) NOT NULL,
                                             `ParticipantSurveyEmail` VARCHAR(255) NOT NULL,
                                             PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;