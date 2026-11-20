CREATE TABLE `biobank_specimen_protocol_type_rel` (
  `SpecimenProtocolID` integer unsigned NOT NULL,
  `SpecimenTypeID` integer unsigned NOT NULL,
  CONSTRAINT `PK_biobank_specimen_protocol_type_rel` PRIMARY KEY (`SpecimenProtocolID`, `SpecimenTypeID`),
  CONSTRAINT `FK_biobank_specimen_protocol_type_rel_SpecimenProtocolID`
    FOREIGN KEY (`SpecimenProtocolID`) REFERENCES `biobank_specimen_protocol` (`SpecimenProtocolID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_biobank_specimen_protocol_type_rel_SpecimenTypeID`
    FOREIGN KEY (`SpecimenTypeID`) REFERENCES `biobank_specimen_type` (`SpecimenTypeID`)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO biobank_specimen_protocol_type_rel (SpecimenProtocolID, SpecimenTypeID)
SELECT SpecimenProtocolID, SpecimenTypeID FROM biobank_specimen_protocol;

ALTER TABLE biobank_specimen_protocol DROP FOREIGN KEY FK_biobank_specimen_protocol_SpecimenTypeID;
ALTER TABLE biobank_specimen_protocol DROP COLUMN SpecimenTypeID;
