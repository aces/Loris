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
        'UserMaximumDaysInactive',
        'The maximum number of days since last login before making a user inactive',
        1,
        0,
        'text',
        ID,
        'Maximum Days Before Making User Inactive',
        30
    FROM ConfigSettings
    WHERE Name="study";

INSERT INTO Config (ConfigID, Value) SELECT ID, "365" FROM ConfigSettings WHERE Name="UserMaximumDaysInactive";
