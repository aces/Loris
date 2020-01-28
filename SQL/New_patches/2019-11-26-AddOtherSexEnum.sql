ALTER TABLE
    `candidate`
MODIFY COLUMN
    `Sex` enum(
        'Male',
        'Female',
        'Other'
    )
DEFAULT NULL;

ALTER TABLE
    `candidate`
MODIFY COLUMN
    `ProbandSex` enum(
        'Male',
        'Female',
        'Other'
    )
DEFAULT NULL;
