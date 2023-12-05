-- Add the EEG Pipeline Config group
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber)
VALUES ('eeg_pipeline', 'EEG Pipeline settings', 1, 0, 'EEG Pipeline', 15);

-- Add the EEGS3DataPath Config
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber, Parent)
SELECT 'EEGS3DataPath', 'EEG S3 data path for assembly data', 1, 0, 'EEG S3 data path', 15, ID
    FROM ConfigSettings
    WHERE Name = 'eeg_pipeline';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'eeg_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'EEGUploadIncomingPath';

-- Add the Imaging Pipeline Config group
UPDATE ConfigSettings SET OrderNumber = 14 WHERE Name = 'imaging_pipeline';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'imaging_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'MRICodePath';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'imaging_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'MRIUploadIncomingPath';

UPDATE
  ConfigSettings cs1,
  (
    SELECT *
    FROM ConfigSettings
    WHERE Name = 'imaging_pipeline'
  ) AS cs2
SET cs1.Parent = cs2.ID
WHERE cs1.Name = 'MINCToolsPath';

-- Add default value to electrophysiology_uploader UploadDate
ALTER TABLE `electrophysiology_uploader` MODIFY COLUMN `UploadDate` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP;