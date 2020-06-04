ALTER TABLE `candidate` DROP FOREIGN KEY `FK_candidate_1`;
ALTER TABLE `candidate` 
    CHANGE COLUMN `CenterID` `RegistrationCenterID` integer unsigned NOT NULL DEFAULT '0';
ALTER TABLE `candidate`
  ADD CONSTRAINT `FK_candidate_1` FOREIGN KEY (`RegistrationCenterID`) REFERENCES `psc` (`CenterID`);

