-- MINC to BIDS converter settings
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('minc2bids', 'Settings related to converting MINC to BIDS', 1, 0,  'MINC to BIDS Converter', 13);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_dataset_authors', 'Authors for the BIDS dataset', 1, 1, 'text', ID, 'BIDS Dataset Authors', 1 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_acknowledgments_text', 'Acknowledgments for the BIDS dataset', 1, 0, 'text', ID, 'BIDS Dataset Acknowledgments', 2 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_readme_text', 'README for the BIDS dataset', 1, 0, 'textarea', ID, 'BIDS Dataset README', 3 FROM ConfigSettings WHERE Name='minc2bids';
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'bids_validator_options_to_ignore', 'Options to ignore for BIDS validation', 1, 1, 'text', ID, 'BIDS Validation options to ignore', 4 FROM ConfigSettings WHERE Name='minc2bids';

-- Default values for mnc2bids config settings
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_dataset_authors';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_acknowledgments_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_readme_text';
INSERT INTO Config (ConfigID, Value) SELECT ID, '' FROM ConfigSettings WHERE Name='bids_validator_options_to_ignore';
