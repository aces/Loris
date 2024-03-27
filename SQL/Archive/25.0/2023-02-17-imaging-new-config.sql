INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createVisit', 'Enable visit creation in the imaging pipeline', 1, 0, 'boolean', ID, 'Enable visit creation', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_project', 'Default project used when creating scan candidate or visit', 1, 0, 'text', ID, 'Default project', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'default_cohort', 'Default cohort used when creating scan visit', 1, 0, 'text', ID, 'Default cohort', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";

UPDATE ConfigSettings SET Label = 'Enable candidate creation' WHERE Name = 'createCandidates';

UPDATE ConfigSettings SET OrderNumber = 14 WHERE Name = 'default_bids_vl';
UPDATE ConfigSettings SET OrderNumber = 15 WHERE Name = 'is_qsub';
UPDATE ConfigSettings SET OrderNumber = 16 WHERE Name = 'DTI_volumes';
UPDATE ConfigSettings SET OrderNumber = 17 WHERE Name = 't1_scan_type';
UPDATE ConfigSettings SET OrderNumber = 18 WHERE Name = 'reject_thresh';
UPDATE ConfigSettings SET OrderNumber = 19 WHERE Name = 'niak_path';
UPDATE ConfigSettings SET OrderNumber = 20 WHERE Name = 'QCed2_step';
UPDATE ConfigSettings SET OrderNumber = 21 WHERE Name = 'excluded_series_description';
UPDATE ConfigSettings SET OrderNumber = 22 WHERE Name = 'ComputeDeepQC';
UPDATE ConfigSettings SET OrderNumber = 23 WHERE Name = 'MriConfigFile';
UPDATE ConfigSettings SET OrderNumber = 24 WHERE Name = 'EnvironmentFile';
UPDATE ConfigSettings SET OrderNumber = 25 WHERE Name = 'compute_snr_modalities';
UPDATE ConfigSettings SET OrderNumber = 26 WHERE Name = 'reference_scan_type_for_defacing';
UPDATE ConfigSettings SET OrderNumber = 27 WHERE Name = 'modalities_to_deface';
UPDATE ConfigSettings SET OrderNumber = 28 WHERE Name = 'MriPythonConfigFile';
