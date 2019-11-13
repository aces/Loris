-- rename modules and change order number according to the new parent menu they belong to
UPDATE LorisMenu SET Label='Behavioural Quality Control', Link='behavioural_qc/', Parent=(SELECT ID FROM LorisMenu WHERE Label='Clinical'), OrderNumber=(SELECT MAX(OrderNumber)+1 FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Clinical')) WHERE Link='data_team_helper/';
UPDATE LorisMenu SET Label='Imaging Quality Control', Link='imaging_qc/', Parent=(SELECT ID FROM LorisMenu WHERE Label='Imaging'), OrderNumber=(SELECT MAX(OrderNumber)+1 FROM LorisMenu WHERE Parent=(SELECT ID FROM LorisMenu WHERE Label='Imaging')) WHERE Link='quality_control/';

-- change location of Genomic Browser to place right after imaging tab
UPDATE LorisMenu SET OrderNumber=(OrderNumber+1) WHERE Parent IS NULL AND OrderNumber>(SELECT OrderNumber FROM LorisMenu WHERE Label='Imaging');
INSERT INTO LorisMenu (Label, OrderNumber)
SELECT 'Genomics', OrderNumber+1 FROM LorisMenu WHERE Label='Imaging';
UPDATE LorisMenu SET Parent=(SELECT ID FROM LorisMenu WHERE Label='Genomics') WHERE Link='genomic_browser/';

UPDATE permissions SET Code='quality_control', description='Quality Control access' WHERE code='data_team_helper';

