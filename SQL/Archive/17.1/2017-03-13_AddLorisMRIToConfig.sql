-- Loris-MRI/Imaging Pipeline options from the $profile (commonly "prod") file
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('imaging_pipeline', 'Imaging Pipeline settings', 1, 0, 'Imaging Pipeline', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataDirBasepath', 'Base Path to the data directory of Loris-MRI', 1, 0, 'text', ID, 'Loris-MRI Data Directory', 1 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'prefix', 'Study prefix or study name', 1, 0, 'text', ID, 'Study Name', 2 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mail_user', 'User to be notified during imaging pipeline execution', 1, 0, 'text', ID, 'User to notify when executing the pipeline', 3 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'get_dicom_info', 'Full path to get_dicom_info.pl', 1, 0, 'text', ID, 'Full path to get_dicom_info.pl script', 4 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'horizontalPics', 'Generate horizontal pictures', 1, 0, 'boolean', ID, 'Horizontal pictures creation', 5 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'no_nii', 'Create NIFTII files if set to 0', 1, 0, 'boolean', ID, 'NIFTII file creation', 6 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'converter', 'If converter is set to dcm2mnc, the c-version of dcm2mnc will be used. If however you want to use any of the various versions of the converter, you will have to specify what it is called and the uploader will try to invoke it', 1, 0, 'text', ID, 'dcm2mnc binary to use when converting', 7 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tarchiveLibraryDir', 'Location of storing the library of used tarchives. If this is not set, they will not be moved', 1, 0, 'text', ID, 'Path to Tarchives', 8 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'lookupCenterNameUsing', 'The element of the tarchive table to be used in getPSC(), being either PatientID or PatientName', 1, 0, 'text', ID, 'Center name lookup variable', 9 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createCandidates', 'Creation of candidates if set to 1', 1, 0, 'boolean', ID, 'Upload creation of candidates', 10 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'is_qsub', 'Do not use batch management if qsub is set to 0', 1, 0, 'boolean', ID, 'Project batch management used', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'if_site', 'Use site if set to 1', 1, 0, 'boolean', ID, 'If site is used', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DTI_volumes', 'Number of volumes in native DTI acquisitions', 1, 0, 'text', ID, 'Number of volumes in native DTI acquisitions', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 't1_scan_type', 'Scan type of native T1 acquisition (as in the mri_scan_type table)', 1, 0, 'text', ID, 'Scan type of native T1 acquisition', 14 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reject_thresh', 'Max number of directions that can be rejected to PASS QC', 1, 0, 'text', ID, 'Max number of DTI rejected directions for passing QC', 15 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'niak_path', 'Path to niak quarantine to use if mincdiffusion will be run (option -runMincdiffusion set when calling DTIPrep_pipeline.pl)', 1, 0, 'text', ID, 'NIAK Path', 16 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'QCed2_step', 'DTIPrep protocol step at which a secondary QCed dataset is produced (for example one without motion correction and eddy current correction would be saved at INTERLACE_outputDWIFileNameSuffix step of DTIPrep)', 1, 0, 'text', ID, 'Secondary QCed dataset', 17 FROM ConfigSettings WHERE Name="imaging_pipeline";


-- default imaging_pipeline settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/DATA/location" FROM ConfigSettings cs WHERE cs.Name="dataDirBasepath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "project" FROM ConfigSettings cs WHERE cs.Name="prefix";
INSERT INTO Config (ConfigID, Value) SELECT ID, "yourname\@example.com" FROM ConfigSettings cs WHERE cs.Name="mail_user";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/get_dicom_info.pl" FROM ConfigSettings cs WHERE cs.Name="get_dicom_info";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="horizontalPics";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="no_nii";
INSERT INTO Config (ConfigID, Value) SELECT ID, "dcm2mnc" FROM ConfigSettings cs WHERE cs.Name="converter";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/dicomlib/" FROM ConfigSettings cs WHERE cs.Name="tarchiveLibraryDir";
INSERT INTO Config (ConfigID, Value) SELECT ID, "PatientName" FROM ConfigSettings cs WHERE cs.Name="lookupCenterNameUsing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="createCandidates";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="is_qsub";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="if_site";
INSERT INTO Config (ConfigID, Value) SELECT ID, 65 FROM ConfigSettings cs WHERE cs.Name="DTI_volumes";
INSERT INTO Config (ConfigID, Value) SELECT ID, "adniT1" FROM ConfigSettings cs WHERE cs.Name="t1_scan_type";
INSERT INTO Config (ConfigID, Value) SELECT ID, 19 FROM ConfigSettings cs WHERE cs.Name="reject_thresh";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/opt/niak-0.6.4.1/" FROM ConfigSettings cs WHERE cs.Name="niak_path";
INSERT INTO Config (ConfigID, Value) SELECT ID, "INTERLACE_outputDWIFileNameSuffix" FROM ConfigSettings cs WHERE cs.Name="QCed2_step";
