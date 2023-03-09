INSERT INTO `ImagingFileTypes` VALUE ('archive', 'Archive file');

ALTER TABLE `physiological_file`
    ADD COLUMN `Index` INT(5) DEFAULT NULL,
    ADD COLUMN `ParentID` INT(10) unsigned DEFAULT NULL,
    ADD CONSTRAINT `FK_ParentID` FOREIGN KEY (`ParentID`) REFERENCES `physiological_file` (`PhysiologicalFileID`);

CREATE TABLE `physiological_split_file` (
  `ID`        INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `Index`     INT(5)           NOT NULL,
  `ArchiveID` INT(10) UNSIGNED NOT NULL,
  `FileType`  VARCHAR(12)      DEFAULT NULL,
  `FilePath`  VARCHAR(255)     NOT NULL,
  `Duration`  DECIMAL(10,3)    NOT NULL,
  CONSTRAINT `FK_ArchiveID`
    FOREIGN KEY (`ArchiveID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`),
  CONSTRAINT `FK_ImagingFileTypes`
    FOREIGN KEY (`FileType`)
    REFERENCES `ImagingFileTypes` (`type`),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
