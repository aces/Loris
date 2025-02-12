ALTER TABLE candidate ADD COLUMN ParticipantID VARCHAR(25) NULL, ADD UNIQUE INDEX `UK_candidate_ParticipantID` (`ParticipantID` ASC);
INSERT INTO modules (Name, Active) VALUES ('participant_portal', 'Y');

CREATE TABLE `participant_portal_emails` (
                                             `ID` INT(10) NOT NULL AUTO_INCREMENT,
                                             `ParticipantAccountID` INT(10) NOT NULL,
                                             `ParticipantSurveyEmail` VARCHAR(255) NOT NULL,
                                             PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;