-- SQL tables for BIDS derivative file structure

-- Create physiological_annotation_file_type table
CREATE TABLE `physiological_annotation_file_type` (
    `FileType`        VARCHAR(20)   NOT NULL UNIQUE,
    `Description` VARCHAR(255),
    PRIMARY KEY (`FileType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create physiological_annotation_file table
CREATE TABLE `physiological_annotation_file` (
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
        REFERENCES `physiological_annotation_file_type` (`FileType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_archive which will store archives of all the annotation files for
-- Front-end download
CREATE TABLE `physiological_annotation_archive` (
  `AnnotationArchiveID` INT(10) UNSIGNED NOT NULL   AUTO_INCREMENT,
  `PhysiologicalFileID` INT(10) UNSIGNED NOT NULL,
  `Blake2bHash`         VARCHAR(128)     NOT NULL,
  `FilePath`            VARCHAR(255)     NOT NULL,
  PRIMARY KEY (`AnnotationArchiveID`),
  CONSTRAINT `FK_physiological_file_ID`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_parameter table
-- Note: This corresponds with the JSON annotation files
CREATE TABLE `physiological_annotation_parameter` (
    `AnnotationParameterID` INT(10)      UNSIGNED NOT NULL AUTO_INCREMENT,
    `AnnotationFileID`      INT(10)      UNSIGNED NOT NULL,
    `Sources`               VARCHAR(255),
    `Author`                VARCHAR(50),
    PRIMARY KEY (`AnnotationParameterID`),
    CONSTRAINT `FK_annotation_file_ID`
        FOREIGN KEY (`AnnotationFileID`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create an annotation_label_type table
CREATE TABLE `physiological_annotation_label` (
  `AnnotationLabelID`    INT(5)       UNSIGNED NOT NULL      AUTO_INCREMENT,
  `LabelName`            VARCHAR(255)          NOT NULL      UNIQUE,
  `LabelDescription`         VARCHAR(255)          DEFAULT NULL,
  PRIMARY KEY (`AnnotationLabelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create annotation_tsv table
-- Note: This corresponds with the .tsv annotation files
CREATE TABLE `physiological_annotation_instance` (
    `AnnotationInstanceID`  INT(10)         UNSIGNED NOT NULL AUTO_INCREMENT,
    `AnnotationFileID`      INT(10)         UNSIGNED NOT NULL,
    `AnnotationParameterID` INT(10)         UNSIGNED NOT NULL,
    `Onset`                 DECIMAL(10, 4),
    `Duration`              DECIMAL(10, 4)  DEFAULT 0,
    `AnnotationLabelID`     INT(5)          UNSIGNED NOT NULL,
    `Channels`              TEXT,
    `AbsoluteTime`          TIMESTAMP,
    `Description`           VARCHAR(255),
    PRIMARY KEY (`AnnotationInstanceID`),
    CONSTRAINT `FK_annotation_parameter_ID`
        FOREIGN KEY (`AnnotationParameterID`)
        REFERENCES `physiological_annotation_parameter` (`AnnotationParameterID`),
    CONSTRAINT `FK_annotation_file`
        FOREIGN KEY (`AnnotationFileID`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`),
    CONSTRAINT `FK_annotation_label_ID`
        FOREIGN KEY (`AnnotationLabelID`)
        REFERENCES `physiological_annotation_label` (`AnnotationLabelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert into annotation_file_type
INSERT INTO physiological_annotation_file_type
    (FileType, Description)
    VALUES
    ('tsv',  'TSV File Type, contains information about each annotation'),
    ('json', 'JSON File Type, metadata for annotations');

-- Insert into annotation_label_type
INSERT INTO physiological_annotation_label
    (AnnotationLabelID, LabelName, LabelDescription)
    VALUES
    (1,  'artifact',            'artifactual data'),
    (2,  'motion',              'motion related artifact'),
    (3,  'flux_jump',           'artifactual data due to flux jump'),
    (4,  'line_noise',          'artifactual data due to line noise (e.g., 50Hz)'),
    (5,  'muscle',              'artifactual data due to muscle activity'),
    (6,  'epilepsy_interictal', 'period deemed interictal'),
    (7,  'epilepsy_preictal',   'onset of preictal state prior to onset of epilepsy'),
    (8,  'epilepsy_seizure',    'onset of epilepsy'),
    (9,  'epilepsy_postictal',  'postictal seizure period'),
    (10, 'epileptiform',        'unspecified epileptiform activity'),
    (11, 'epileptiform_single', 'a single epileptiform graphoelement (including possible slow wave)'),
    (12, 'epileptiform_run',    'a run of one or more epileptiform graphoelements'),
    (13, 'eye_blink',           'Eye blink'),
    (14, 'eye_movement',        'Smooth Pursuit / Saccadic eye movement'),
    (15, 'eye_fixation',        'Fixation onset'),
    (16, 'sleep_N1',            'sleep stage N1'),
    (17, 'sleep_N2',            'sleep stage N2'),
    (18, 'sleep_N3',            'sleep stage N3'),
    (19, 'sleep_REM',           'REM sleep'),
    (20, 'sleep_wake',          'sleep stage awake'),
    (21, 'sleep_spindle',       'sleep spindle'),
    (22, 'sleep_k-complex',     'sleep K-complex'),
    (23, 'scorelabeled',        'a global label indicating that the EEG has been annotated with SCORE.');

UPDATE physiological_output_type SET OutputTypeName='derivative' WHERE PhysiologicalOutputTypeID=2;

