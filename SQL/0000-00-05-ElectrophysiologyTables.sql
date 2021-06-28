--
-- Table structure for the electrophysiology component of LORIS
--

-- Create a physiological_modality table
CREATE TABLE `physiological_modality` (
  `PhysiologicalModalityID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `PhysiologicalModality`   VARCHAR(50)         NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalModalityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Create a physiological_output_type table
CREATE TABLE `physiological_output_type` (
  `PhysiologicalOutputTypeID` INT(5)      UNSIGNED NOT NULL AUTO_INCREMENT,
  `OutputTypeName`            VARCHAR(20)          NOT NULL UNIQUE,
  `OutputTypeDescription`     VARCHAR(255),
  PRIMARY KEY (`PhysiologicalOutputTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Create a physiological_file table
-- Note that the field InsertedByUser refers to the Linux User that ran the script
-- and not a LORIS user
CREATE TABLE `physiological_file` (
  `PhysiologicalFileID`       INT(10)    UNSIGNED  NOT NULL      AUTO_INCREMENT,
  `PhysiologicalModalityID`   INT(5)     UNSIGNED  DEFAULT NULL,
  `PhysiologicalOutputTypeID` INT(5)     UNSIGNED  NOT NULL,
  `SessionID`                 INT(10)    UNSIGNED  NOT NULL,
  `InsertTime`                TIMESTAMP            NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `FileType`                  VARCHAR(12)          DEFAULT NULL,
  `AcquisitionTime`           DATETIME             DEFAULT '1970-01-01 00:00:01',
  `InsertedByUser`            VARCHAR(50)          NOT NULL,
  `FilePath`                  VARCHAR(255)         NOT NULL,
  PRIMARY KEY (`PhysiologicalFileID`),
  CONSTRAINT `FK_session_ID`
    FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`),
  CONSTRAINT `FK_ImagingFileTypes_type`
    FOREIGN KEY (`FileType`)
    REFERENCES `ImagingFileTypes` (`type`),
  CONSTRAINT `FK_phys_modality_ModID`
    FOREIGN KEY (`PhysiologicalModalityID`)
    REFERENCES `physiological_modality` (`PhysiologicalModalityID`),
  CONSTRAINT `FK_phys_output_type_TypeID`
    FOREIGN KEY (`PhysiologicalOutputTypeID`)
    REFERENCES `physiological_output_type` (`PhysiologicalOutputTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_parameter_file table that will store all JSON
-- information that accompanies the BIDS physiological dataset
CREATE TABLE `physiological_parameter_file` (
  `PhysiologicalParameterFileID` INT(10) UNSIGNED NOT NULL  AUTO_INCREMENT,
  `PhysiologicalFileID`          INT(10) UNSIGNED NOT NULL,
  `ParameterTypeID`              INT(10) UNSIGNED NOT NULL,
  `InsertTime`                   TIMESTAMP        NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `Value`                        VARCHAR(255),
  PRIMARY KEY (`PhysiologicalParameterFileID`),
  CONSTRAINT `FK_phys_file_FileID`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_param_type_ParamTypeID`
    FOREIGN KEY (`ParameterTypeID`)
    REFERENCES `parameter_type` (`ParameterTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_status_type table
CREATE TABLE `physiological_status_type` (
  `PhysiologicalStatusTypeID` INT(5)      UNSIGNED NOT NULL AUTO_INCREMENT,
  `ChannelStatus`             VARCHAR(10)          NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalStatusTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_channel_type table
CREATE TABLE `physiological_channel_type` (
  `PhysiologicalChannelTypeID` INT(5)       UNSIGNED NOT NULL      AUTO_INCREMENT,
  `ChannelTypeName`            VARCHAR(255)          NOT NULL      UNIQUE,
  `ChannelDescription`         VARCHAR(255)          DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalChannelTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create a physiological_channel table that will store all information from
CREATE TABLE `physiological_channel` (
  `PhysiologicalChannelID`     INT(10)    UNSIGNED NOT NULL      AUTO_INCREMENT,
  `PhysiologicalFileID`        INT(10)    UNSIGNED NOT NULL,
  `PhysiologicalChannelTypeID` INT(5)     UNSIGNED NOT NULL,
  `PhysiologicalStatusTypeID`  INT(5)     UNSIGNED DEFAULT NULL,
  `InsertTime`                 TIMESTAMP           NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `Name`                       VARCHAR(50)         NOT NULL,
  `Description`                VARCHAR(255)        DEFAULT NULL,
  `SamplingFrequency`          INT(6)              DEFAULT NULL,
  `LowCutoff`                  DECIMAL(8,3)        DEFAULT NULL,
  `HighCutoff`                 DECIMAL(8,3)        DEFAULT NULL,
  `ManualFlag`                 DECIMAL(5,4)        DEFAULT NULL,
  `Notch`                      INT(6)              DEFAULT NULL,
  `Reference`                  VARCHAR(255)        DEFAULT NULL,
  `StatusDescription`          VARCHAR(255)        DEFAULT NULL,
  `Unit`                       VARCHAR(255)        DEFAULT NULL,
  `FilePath`                   VARCHAR(255)        DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalChannelID`),
  CONSTRAINT `FK_phys_file_FileID_2`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_phys_channel_type_TypeID`
    FOREIGN KEY (`PhysiologicalChannelTypeID`)
    REFERENCES `physiological_channel_type` (`PhysiologicalChannelTypeID`),
  CONSTRAINT `FK_phys_status_type_TypeID`
    FOREIGN KEY (`PhysiologicalStatusTypeID`)
    REFERENCES `physiological_status_type` (`PhysiologicalStatusTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create physiololgical_electrode_type table
CREATE TABLE `physiological_electrode_type` (
  `PhysiologicalElectrodeTypeID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ElectrodeType`                VARCHAR(50)     NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalElectrodeTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create physiological_electrode_material table
CREATE TABLE `physiological_electrode_material` (
  `PhysiologicalElectrodeMaterialID` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ElectrodeMaterial`                VARCHAR(50)     NOT NULL UNIQUE,
  PRIMARY KEY (`PhysiologicalElectrodeMaterialID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create a physiological_electrode table
CREATE TABLE `physiological_electrode` (
  `PhysiologicalElectrodeID`          INT(10) UNSIGNED NOT NULL      AUTO_INCREMENT,
  `PhysiologicalFileID`               INT(10) UNSIGNED NOT NULL,
  `PhysiologicalElectrodeTypeID`      INT(5)  UNSIGNED DEFAULT NULL,
  `PhysiologicalElectrodeMaterialID`  INT(5)  UNSIGNED DEFAULT NULL,
  `InsertTime`                        TIMESTAMP        NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `Name`                              VARCHAR(50)      NOT NULL,
  `X`                                 DECIMAL(12,6)    NOT NULL,
  `Y`                                 DECIMAL(12,6)    NOT NULL,
  `Z`                                 DECIMAL(12,6)    NOT NULL,
  `Impedance`                         INT(10)          DEFAULT NULL,
  `FilePath`                          VARCHAR(255)     DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalElectrodeID`),
  CONSTRAINT `FK_phys_file_FileID_3`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_phys_elec_type_ID`
    FOREIGN KEY (`PhysiologicalElectrodeTypeID`)
    REFERENCES `physiological_electrode_type` (`PhysiologicalElectrodeTypeID`),
  CONSTRAINT `FK_phys_elec_material_ID`
  FOREIGN KEY (`PhysiologicalElectrodeMaterialID`)
  REFERENCES `physiological_electrode_material` (`PhysiologicalElectrodeMaterialID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create physiological_task_event table that will store all information
-- regarding the task executed during the physiological recording
CREATE TABLE `physiological_task_event` (
  `PhysiologicalTaskEventID` INT(10) UNSIGNED NOT NULL      AUTO_INCREMENT,
  `PhysiologicalFileID`      INT(10) UNSIGNED NOT NULL,
  `InsertTime`               TIMESTAMP        NOT NULL      DEFAULT CURRENT_TIMESTAMP,
  `Onset`                    DECIMAL(11,6)    NOT NULL,
  `Duration`                 DECIMAL(11,6)    NOT NULL,
  `EventCode`                INT(10)          DEFAULT NULL,
  `EventValue`               INT(10)          DEFAULT NULL,
  `EventSample`              INT(10)          DEFAULT NULL,
  `EventType`                VARCHAR(50)      DEFAULT NULL,
  `TrialType`                VARCHAR(255)     DEFAULT NULL,
  `ResponseTime`             TIME             DEFAULT NULL,
  `FilePath`                 VARCHAR(255)     DEFAULT NULL,
  PRIMARY KEY (`PhysiologicalTaskEventID`),
  CONSTRAINT `FK_phys_file_FileID_4`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- Create physiological_archive which will store archives of all the files for
-- Front-end download
CREATE TABLE `physiological_archive` (
  `PhysiologicalArchiveID`   INT(10) UNSIGNED NOT NULL   AUTO_INCREMENT,
  `PhysiologicalFileID`      INT(10) UNSIGNED NOT NULL,
  `InsertTime`               TIMESTAMP        NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  `Blake2bHash`              VARCHAR(128)     NOT NULL,
  `FilePath`                 VARCHAR(255)     NOT NULL,
  PRIMARY KEY (`PhysiologicalArchiveID`),
  CONSTRAINT `FK_phys_file_FileID_5`
    FOREIGN KEY (`PhysiologicalFileID`)
    REFERENCES `physiological_file` (`PhysiologicalFileID`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

-- Insert into physiological_output_type
INSERT INTO physiological_output_type
  (`OutputTypeName`, `OutputTypeDescription`)
  VALUES
  ('raw',         'raw dataset'),
  ('derivative',  'derivative/processed dataset');

-- Insert into physiological_channel_type
INSERT INTO physiological_channel_type
  (`ChannelTypeName`, `ChannelDescription`)
  VALUES
  ('EEG',              'ElectoEncephaloGram: EEG sensors'                    ),
  ('VEOG',             'Vertical ElectroOculoGram (eyes)'                    ),
  ('HEOG',             'Horizontal ElectOculoGram'                           ),
  ('EOG',              'Generic EOG channel, if HEOG or VEOG information not available'),
  ('ECG',              'ElectroCardioGram (heart)'                           ),
  ('EMG',              'ElectroMyoGram (muscle)'                             ),
  ('TRIG',             'System Triggers'                                     ),
  ('REF',              'Reference electrode'                                 ),
  ('GRD',              'Ground electrode'                                    ),
  ('MISC',             'Miscellaneous'                                       ),
  ('MEGMAG',           'MEG magnetometer'                                    ),
  ('MEGGRADAXIAL',     'MEG axial gradiometer'                               ),
  ('MEGGRADPLANAR',    'MEG planar gradiometer'                              ),
  ('MEGGREFMAG',       'MEG reference magnetometer'                          ),
  ('MEGREFGRADAXIAL',  'MEG reference axial gradiometer'                     ),
  ('MEGREFGRADPLANAR', 'MEG reference planar gradiometer'                    ),
  ('MEGOTHER',         'Any other type of MEG sensor'                        ),
  ('ECOG',             'Electrode channel: electrocortigogram (intracranial)'),
  ('SEEG',             'Electrode channel: stereo-electroencephalogram (intracranial)'),
  ('DBS',              'Electrode channel: deep brain stimulation (intracranial)'),
  ('AUDIO',            'Audio signal'                                        ),
  ('PD',               'Photodiode'                                          ),
  ('EYEGAZE',          'Eye Tracker gaze'                                    ),
  ('PUPIL',            'Eye Tracker pupil diameter'                          ),
  ('SYSCLOCK',         'System time showing elapsed time since trial started'),
  ('ADC',              'Analog to Digital input'                             ),
  ('DAC',              'Digital to Analog input'                             ),
  ('HLU',              'Measure position of head and head coils'             ),
  ('FITERR',           'Fit error signal from each head localization coil'   ),
  ('OTHER',            'Any other type of channel'                           );


-- Insert into physiological_modality
INSERT INTO physiological_modality
  (PhysiologicalModality)
  VALUES
  ('eeg'),
  ('meg'),
  ('ieeg');


-- Insert into physiological_status_type
INSERT INTO physiological_status_type
  (ChannelStatus)
  VALUES
  ('good'),
  ('bad');

-- Insert into ImagingFileTypes
INSERT INTO ImagingFileTypes
  (type, description)
  VALUES
  ('set',  'EEGlab file format (EEG)'),
  ('bdf',  'Biosemi file format (EEG)'),
  ('vhdr', 'Brainvision file format (EEG)'),
  ('vsm',  'BrainStorm file format (EEG)'),
  ('edf',  'European data format (EEG)'),
  ('cnt',  'Neuroscan CNT data format (EEG)');

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

