INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'idAlphabet', 'The character set used to generate study IDs (e.g. PSCID).', 1, 0, 'text', ID, 'Study ID Alphabet', 27 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'idGenerationMethod', 'How study IDs should be generated', 1, 0, 'text', ID, 'Study ID Generation Method', 28 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'idPrefixMethod', 'The prefix to be used for study IDs. "Alias" will use the Site or Project alias as a prefix. "Static" will take the value from the "idStaticPrefix" config setting', 1, 0, 'text', ID, 'Study ID Prefix', 29 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'idStaticPrefix', 'This string will be used as the prefix for study IDs if "static" is selected for "idPrefixMethod"', 1, 0, 'text', ID, 'Study ID Prefix', 30 FROM ConfigSettings WHERE Name="study";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'idLength', 'The number of characters to use for an ID. Does not include the site or project prefix.', 1, 0, 'text', ID, 'Length of study identifier', 31 FROM ConfigSettings WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'alpha'  FROM ConfigSettings WHERE Name="idAlphabet";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'sequential'  FROM ConfigSettings WHERE Name="idGenerationMethod";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'alias'  FROM ConfigSettings WHERE Name="idPrefixMethod";
INSERT INTO Config (ConfigID, Value) SELECT ID, 'LORIS'  FROM ConfigSettings WHERE Name="idStaticPrefix";
INSERT INTO Config (ConfigID, Value) SELECT ID, '4'  FROM ConfigSettings WHERE Name="idLength";
