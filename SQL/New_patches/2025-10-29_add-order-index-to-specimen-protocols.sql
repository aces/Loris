-- Step 1: Add the column allowing NULL (temporarily)
-- This allows the operation to succeed on a table that already has existing rows.
ALTER TABLE biobank_specimen_protocol_attribute_rel
ADD COLUMN OrderIndex INT UNSIGNED NULL;

-- Step 2: Populate the existing rows with unique, non-NULL OrderIndex values.
-- This uses a variable-based method to assign a sequential number (0, 1, 2, ...)
-- to each row within the same SpecimenProtocolID group.

SET @r := -1;
SET @g := 0;

-- A temporary table/derived table is used to calculate the unique index for each group
UPDATE biobank_specimen_protocol_attribute_rel AS t1
INNER JOIN (
    SELECT
        t2.SpecimenProtocolID,
        t2.SpecimenAttributeID,
        @r := CASE WHEN @g = t2.SpecimenProtocolID THEN @r + 1 ELSE 0 END AS new_OrderIndex,
        @g := t2.SpecimenProtocolID AS current_group
    FROM
        biobank_specimen_protocol_attribute_rel AS t2
    ORDER BY
        t2.SpecimenProtocolID, t2.SpecimenAttributeID

) AS ranked_data
ON t1.SpecimenProtocolID = ranked_data.SpecimenProtocolID
AND t1.SpecimenAttributeID = ranked_data.SpecimenAttributeID
SET t1.OrderIndex = ranked_data.new_OrderIndex;

-- Step 3: Enforce the constraints (NOT NULL and UNIQUE).
-- Now that every row has a valid, unique value, these operations will succeed.

-- 3a. Add the UNIQUE Constraint
ALTER TABLE biobank_specimen_protocol_attribute_rel
ADD CONSTRAINT UK_SpecimenProtocolId_OrderIndex
UNIQUE (SpecimenProtocolID, OrderIndex);

-- 3b. Change the Column to NOT NULL
ALTER TABLE biobank_specimen_protocol_attribute_rel
MODIFY COLUMN OrderIndex INT UNSIGNED NOT NULL;
