-- Adds the option to toggle the usage of the Pwned Passwords
-- API (https://haveibeenpwned.com/API/v2#PwnedPasswords) in a project. This
-- is enabled by default to allow for a higher level of security. This
-- setting is added to allow projects to disable the API check in case of
-- networking issues.
INSERT INTO ConfigSettings
  (
    Name,
    Description,
    Visible,
    AllowMultiple,
    DataType,
    Parent,
    Label,
    OrderNumber
  )
  SELECT
    'usePwnedPasswordsAPI',
    'Whether to query the Have I Been Pwned password API on password changes to prevent the usage of common and breached passwords',
    1,
    0,
    'boolean',
    ID,
    'Enable "Pwned Password" check',
    22
  FROM
    ConfigSettings
  WHERE
    Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, 'true' FROM ConfigSettings WHERE Name="usePwnedPasswordsAPI";
