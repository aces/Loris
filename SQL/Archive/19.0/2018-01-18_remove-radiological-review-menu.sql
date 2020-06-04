WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete Menu Permission' as 'Step #1';
DELETE FROM LorisMenuPermissions WHERE MenuID IN
    (SELECT ID FROM LorisMenu WHERE Link = 'final_radiological_review/');

SELECT 'Delete Menu Entry' as 'Step #2';
DELETE FROM LorisMenu WHERE Link = 'final_radiological_review/';

SELECT 'Patch complete' as 'Status';
