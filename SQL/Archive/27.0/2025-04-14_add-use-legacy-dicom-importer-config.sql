INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
  SELECT 'use_legacy_dicom_study_importer', 'Use the legacy DICOM study importer instead of the new one', 1, 0, 'boolean', ID, 'Use legacy DICOM study importer', 15
  FROM ConfigSettings
  WHERE Name="imaging_pipeline";

INSERT INTO Config (ConfigID, Value)
  SELECT ID, 1
  FROM ConfigSettings cs
  WHERE cs.Name='use_legacy_dicom_study_importer';
