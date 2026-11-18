ALTER TABLE sex
ADD COLUMN `Colour` VARCHAR(50) NULL;

SET @sex_row_num := 0;

UPDATE sex s
JOIN (
    SELECT Name, (@sex_row_num := @sex_row_num + 1) AS row_num
    FROM (SELECT Name FROM sex ORDER BY Name LIMIT 6) ordered_names
) ordered_sex ON ordered_sex.Name = s.Name
SET s.Colour = CASE ordered_sex.row_num
    WHEN 1 THEN '#2FA4E7'
    WHEN 2 THEN '#1C70B6'
    WHEN 3 THEN '#4AE8C2'
    WHEN 4 THEN '#7900DB'
    WHEN 5 THEN '#FF8000'
    WHEN 6 THEN '#D90074'
    ELSE s.Colour
END
WHERE ordered_sex.row_num <= 6;