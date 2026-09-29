ALTER TABLE candidate
ADD COLUMN RegistrationCohortID int(10) unsigned DEFAULT NULL
AFTER RegistrationProjectID;

ALTER TABLE candidate
ADD CONSTRAINT FK_candidate_RegistrationCohortID
FOREIGN KEY (RegistrationCohortID) REFERENCES cohort (CohortID)
ON DELETE SET NULL ON UPDATE CASCADE;

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
    'useRegistrationCohort',
    'Require a registration cohort when creating a candidate',
    1,
    0,
    'boolean',
    ID,
    'Use registration cohorts',
    32
FROM ConfigSettings
WHERE Name = 'study';

INSERT INTO Config (ConfigID, Value)
SELECT ID, 'false'
FROM ConfigSettings
WHERE Name = 'useRegistrationCohort';
