SET @parentID = (SELECT ID FROM ConfigSettings WHERE Name = 'APIKeys');

-- Cleanup 
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPrivate';
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPublic';
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPrivate');
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPublic');

-- Insert
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPrivate', 'Private Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Private Key', 2
);
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPublic', 'Public Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Public Key', 3
);
