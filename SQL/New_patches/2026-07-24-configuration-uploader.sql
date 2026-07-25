ALTER TABLE ConfigSettings
MODIFY COLUMN DataType ENUM(
    'text',
    'boolean',
    'email',
    'instrument',
    'textarea',
    'scan_type',
    'date_format',
    'lookup_center',
    'path',
    'web_path',
    'log_level',
    'image'
);

UPDATE ConfigSettings
SET DataType='image',
    Description='Image displayed as the study logo'
WHERE Name='studylogo';

UPDATE ConfigSettings
SET DataType='image',
    Description='Image displayed at the top left of the login page'
WHERE Name='login_logo_left';

UPDATE ConfigSettings
SET DataType='image',
    Description='Image displayed at the top right of the login page'
WHERE Name='login_logo_right';

UPDATE ConfigSettings
SET DataType='image',
    Description='Partner images displayed on the homepage'
WHERE Name='partner_logos';

INSERT INTO ConfigSettings (
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
    'config_upload_path',
    'Path to images uploaded through the Configuration module',
    1,
    0,
    'web_path',
    ID,
    'Configuration Upload Path',
    15
FROM ConfigSettings
WHERE Name='paths';

INSERT INTO Config (ConfigID, Value)
SELECT
    upload.ID,
    CONCAT(TRIM(TRAILING '/' FROM base.Value), '/htdocs/images/configuration/')
FROM ConfigSettings upload
JOIN ConfigSettings baseSetting ON baseSetting.Name='base'
JOIN Config base ON base.ConfigID=baseSetting.ID
WHERE upload.Name='config_upload_path';
