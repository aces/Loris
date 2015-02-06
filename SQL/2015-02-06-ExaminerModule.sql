UPDATE permissions SET code='examiner', description='Add and certify examiners' where code='certification';
UPDATE permissions SET code='examiner_multisite', description='Across all sites add and certify examiners' where code='certification';

UPDATE LorisMenu SET Label='Examiner', Link='main.php?test_name=examiner' WHERE Label='Certification';