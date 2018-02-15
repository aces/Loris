-- Add Imaging Browser to Imaging Modules
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'linkedInstruments', 'Instruments that the users want to see linked from Imaging Browser', 1, 1, 'instrument', ID, 'Imaging Browser Links to Instruments', 7 FROM ConfigSettings WHERE Name="imaging_modules";

-- default imaging_browser settings for Linked instruments
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, 'mri_parameter_form' FROM ConfigSettings cs WHERE cs.Name="linkedInstruments";
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, 'radiology_review' FROM ConfigSettings cs WHERE cs.Name="linkedInstruments";


