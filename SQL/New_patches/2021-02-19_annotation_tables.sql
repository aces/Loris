-- SQL tables for BIDS derivative file structure

-- Create annotation_file_type table
CREATE TABLE `annotation_file_type` (
    `FileType`        VARCHAR(20)   NOT NULL UNIQUE,
    `Description` VARCHAR(255),
    PRIMARY KEY (`FileType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_file table
CREATE TABLE `annotation_file` (
    `AnnotationFileID`    INT(10)      UNSIGNED NOT NULL AUTO_INCREMENT,
    `PhysiologicalFileID` INT(10)      UNSIGNED NOT NULL,
    `FileType`            VARCHAR(20)  NOT NULL,
    `FilePath`            VARCHAR(255) NOT NULL,
    PRIMARY KEY (`AnnotationFileID`),
    CONSTRAINT `FK_phys_file_ID`
        FOREIGN KEY (`PhysiologicalFileID`)
        REFERENCES `physiological_file` (`PhysiologicalFileID`),
    CONSTRAINT `FK_annotation_file_type`
        FOREIGN KEY (`FileType`)
        REFERENCES `annotation_file_type` (`FileType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_archive which will store archives of all the annotation files for
-- Front-end download
CREATE TABLE `annotation_archive` (
  `AnnotationArchiveID`   INT(10) UNSIGNED NOT NULL   AUTO_INCREMENT,
  `PhysiologicalFileID`      INT(10) UNSIGNED NOT NULL,
  `Blake2bHash`              VARCHAR(128)     NOT NULL,
  `FilePath`                 VARCHAR(255)     NOT NULL,
  PRIMARY KEY (`AnnotationArchiveID`),
  CONSTRAINT `FK_physiological_file_ID`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_parameter table
-- Note: This corresponds with the JSON annotation files
CREATE TABLE `annotation_parameter` (
    `AnnotationParameterID` INT(10)      UNSIGNED NOT NULL AUTO_INCREMENT,
    `AnnotationFileID`      INT(10)      UNSIGNED NOT NULL,
    `Sources`               VARCHAR(255),
    `Author`                VARCHAR(50),
    PRIMARY KEY (`AnnotationParameterID`),
    CONSTRAINT `FK_annotation_file_ID`
        FOREIGN KEY (`AnnotationFileID`)
        REFERENCES `annotation_file` (`AnnotationFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_tsv table
-- Note: This corresponds with the .tsv annotation files
CREATE TABLE `annotation_instance` (
    `AnnotationInstanceID`  INT(10)       UNSIGNED NOT NULL AUTO_INCREMENT,
    `AnnotationFileID`      INT(10)       UNSIGNED NOT NULL,
    `AnnotationParameterID` INT(10)       UNSIGNED NOT NULL,
    `Onset`                 DECIMAL(10, 3) NOT NULL,
    `Duration`              INT(10)       NOT NULL DEFAULT 0,
    `Label`                 VARCHAR(255)  NOT NULL,
    `Channel`               VARCHAR(255),
    `AbsoluteTime`          TIMESTAMP,
    `Description`           VARCHAR(255),
    PRIMARY KEY (`AnnotationInstanceID`),
    CONSTRAINT `FK_annotation_parameter_ID`
        FOREIGN KEY (`AnnotationParameterID`)
        REFERENCES `annotation_parameter` (`AnnotationParameterID`),
    CONSTRAINT `FK_annotation_file`
        FOREIGN KEY (`AnnotationFileID`)
        REFERENCES `annotation_file` (`AnnotationFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert into annotation_file_type
INSERT INTO annotation_file_type
    (FileType, Description)
    VALUES
    ('tsv',  'TSV File Type, contains information about each annotation'),
    ('json', 'JSON File Type, metadata for annotations');
