-- MINC to BIDS converter settings
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('minc2bids', 'Settings related to converting MINC to BIDS LORIS-MRI tool script', 1, 0,  'MINC to BIDS Converter Tool Options', 13);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_dataset_authors', 'Authors for the BIDS dataset', 1, 1, 'text', ID, 'BIDS Dataset Authors', 1 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_acknowledgments_text', 'Acknowledgments to be added in the dataset_description.json file of the BIDS dataset created out of the MINC files', 1, 0, 'text', ID, 'BIDS Dataset Acknowledgments', 2 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_readme_text', 'Content to be added to the README of the BIDS dataset generated out of the MINC files', 1, 0, 'textarea', ID, 'BIDS Dataset README', 3 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_validator_options_to_ignore', 'Options to be ignored for BIDS validation', 1, 1, 'text', ID, 'BIDS Validation options to ignore', 4 FROM ConfigSettings WHERE Name='minc2bids';

-- Default values for mnc2bids config settings
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_dataset_authors';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_acknowledgments_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_readme_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_validator_options_to_ignore';
