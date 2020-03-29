ALTER Table Project ADD COLUMN GUIDRequired binary NOT NULL DEFAULT 0;
ALTER Table candidate ADD COLUMN GUID VARCHAR(100) DEFAULT NULL;

INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'piiURL', 'Address of server hosting the personally identifying information', 1, 0, 'text', MAX(Parent), 'PII URL', MAX(OrderNumber)+1
FROM ConfigSettings WHERE Parent=(SELECT ID FROM ConfigSettings WHERE Name='APIKeys');
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'piiKey', 'Access key for the PII system', 1, 0, 'text', MAX(Parent), 'PII Key', MAX(OrderNumber)+1
FROM ConfigSettings WHERE Parent=(SELECT ID FROM ConfigSettings WHERE Name='APIKeys');
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'piiAuthPath', 'Authentication path for PII system', 1, 0, 'text', MAX(Parent), 'PII Authentication Path', MAX(OrderNumber)+1
FROM ConfigSettings WHERE Parent=(SELECT ID FROM ConfigSettings WHERE Name='APIKeys');
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber)
SELECT 'piiCandPath', 'Candidate creation path for PII system', 1, 0, 'text', MAX(Parent), 'PII Candidate Creation Path', MAX(OrderNumber)+1
FROM ConfigSettings WHERE Parent=(SELECT ID FROM ConfigSettings WHERE Name='APIKeys');

