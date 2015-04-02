UPDATE permissions SET code='examiner_view', description='Add and certify examiners' WHERE code='certification';
UPDATE permissions SET code='examiner_multisite', description='Across all sites add and certify examiners' WHERE code='certification_multisite';

UPDATE LorisMenu SET Label='Examiner', Link='main.php?test_name=examiner' WHERE Label='Certification';

ALTER TABLE users DROP COLUMN Examiner;