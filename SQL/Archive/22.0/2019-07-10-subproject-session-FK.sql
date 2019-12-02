ALTER TABLE session CHANGE `SubprojectID` `SubprojectID` int(10) unsigned DEFAULT NULL;
ALTER TABLE session ADD CONSTRAINT `FK_session_3` FOREIGN KEY (`SubprojectID`) REFERENCES `subproject` (`SubprojectID`);
