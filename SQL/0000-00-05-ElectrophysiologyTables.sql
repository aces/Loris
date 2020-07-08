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


-- Insert into physiological_output_type
INSERT INTO physiological_output_type
  (`OutputTypeName`, `OutputTypeDescription`)
  VALUES
  ('raw',         'raw dataset'),
  ('derivatives', 'derivative/processed dataset');

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

