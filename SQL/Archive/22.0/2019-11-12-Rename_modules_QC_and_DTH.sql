-- rename modules and change order number according to the new parent menu they belong to
SELECT MAX(OrderNumber)+1 INTO @ordernumber FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Clinical');
SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Clinical';

UPDATE LorisMenu SET Label='Behavioural Quality Control', Link='behavioural_qc/', Parent=@parentid, OrderNumber=@ordernumber  WHERE Link='data_team_helper/';

SELECT MAX(OrderNumber)+1 INTO @ordernumber FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Imaging');
SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET Label='Imaging Quality Control', Link='imaging_qc/', Parent=@parentid, OrderNumber=@ordernumber WHERE Link='quality_control/';

-- change location of Genomic Browser to place right after imaging tab
SELECT OrderNumber INTO @ordernumber FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET OrderNumber=(OrderNumber+1) WHERE Parent IS NULL AND OrderNumber>@ordernumber;

INSERT INTO LorisMenu (Label, OrderNumber)
SELECT 'Genomics', OrderNumber+1 FROM LorisMenu WHERE Label='Imaging';

SELECT ID INTO @parentid FROM LorisMenu WHERE Label='Genomics';
UPDATE LorisMenu SET Parent=@parentid WHERE Link='genomic_browser/';

UPDATE permissions SET Code='quality_control', description='Quality Control access' WHERE code='data_team_helper';

