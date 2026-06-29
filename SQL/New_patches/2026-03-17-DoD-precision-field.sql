ALTER TABLE candidate
ADD COLUMN DoD_precision enum('known_full','known_year_month','known_year','unknown') DEFAULT NULL AFTER DoD;