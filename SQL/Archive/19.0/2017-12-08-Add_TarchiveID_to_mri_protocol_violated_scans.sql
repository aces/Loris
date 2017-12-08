ALTER TABLE mri_protocol_violated_scans 
  ADD TarchiveID INT(11) AFTER PSCID
  ADD CONSTRAINT `FK_mri_violated_1` FOREIGN KEY (`TarchiveID`) 
        REFERENCES `tarchive` (`TarchiveID`);
