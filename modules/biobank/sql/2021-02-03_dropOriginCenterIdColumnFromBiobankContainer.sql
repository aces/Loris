ALTER TABLE biobank_container DROP FOREIGN KEY FK_biobank_container_OriginCenterID;
ALTER TABLE biobank_container DROP COLUMN OriginCenterID;
ALTER TABLE biobank_container CHANGE CurrentCenterID CenterID integer unsigned;
ALTER TABLE biobank_container DROP FOREIGN KEY `FK_biobank_container_CurrentCenterID`, ADD CONSTRAINT `FK_biobank_container_CenterID` FOREIGN KEY (`CenterID`) REFERENCES `psc`(`CenterID`) ON UPDATE RESTRICT ON DELETE RESTRICT;
