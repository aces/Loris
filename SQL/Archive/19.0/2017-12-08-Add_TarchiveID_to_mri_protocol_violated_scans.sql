-- Alter table mri_protocol_violated_scans to add TarchiveID
ALTER TABLE mri_protocol_violated_scans 
  ADD TarchiveID INT(11) AFTER PSCID,
  ADD CONSTRAINT `FK_mri_violated_1` FOREIGN KEY (`TarchiveID`) 
        REFERENCES `tarchive` (`TarchiveID`);

-- Populate mri_protocol_violated_scans.TarchiveID in joining 
-- with tarchive_series table using SeriesUID
UPDATE mri_protocol_violated_scans 
  LEFT JOIN tarchive_series ts USING (SeriesUID) 
  SET mri_protocol_violated_scans.TarchiveID=ts.TarchiveID;
