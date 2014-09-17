-- default path settings

-- imagePath
INSERT INTO Config (ConfigID, Value) VALUES (9, "/data/%PROJECTNAME%/data/");

-- base
INSERT INTO Config (ConfigID, Value) VALUES (10, "%LORISROOT%");

-- data
INSERT INTO Config (ConfigID, Value) VALUES (11, "/data/%PROJECTNAME%/data/");

-- extLibs
INSERT INTO Config (ConfigID, Value) VALUES (12, "/PATH/TO/SMARTY/libs");

-- mincPath
INSERT INTO Config (ConfigID, Value) VALUES (13, "/data/%PROJECTNAME%/data/");

-- DownloadPath
INSERT INTO Config (ConfigID, Value) VALUES (14, "%LORISROOT%");

-- log
INSERT INTO Config (ConfigID, Value) VALUES (15, "tools/logs/");

-- IncomingPath
INSERT INTO Config (ConfigID, Value) VALUES (16, "/data/incoming/");

-- MRICodePath
INSERT INTO Config (ConfigID, Value) VALUES (17, "data/%PROJECTNAME%/bin/mri/");


-- default dicom_archive settings

-- patientIDRegex
INSERT INTO Config (ConfigID, Value) VALUES (18, "/./");

-- patientNameRegex
INSERT INTO Config (ConfigID, Value) VALUES (19, "/./i");

-- LegoPhantomRegex
INSERT INTO Config (ConfigID, Value) VALUES (20, "/./i");

-- LivingPhantomRegex
INSERT INTO Config (ConfigID, Value) VALUES (21, "/./i");

-- showTransferStatus
INSERT INTO Config (ConfigID, Value) VALUES (22, "false");


-- default dashboard settings

INSERT INTO Config (ConfigID, Value) VALUES (23, "This database provides an on-line mechanism to store both MRI and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun.");


-- default mail settings

-- From
INSERT INTO Config (ConfigID, Value) VALUES (26, "nobody@example.com");

-- Reply-to
INSERT INTO Config (ConfigID, Value) VALUES (27, "nobody@example.com");

-- X-MimeOLE
INSERT INTO Config (ConfigID, Value) VALUES (28, "Produced by LorisDB");


-- default www settings

-- host
INSERT INTO Config (ConfigID, Value) VALUES (29, "localhost");

-- url
INSERT INTO Config (ConfigID, Value) VALUES (30, "https://localhost/");

-- mantis_url
INSERT INTO Config (ConfigID, Value) VALUES (31);


-- default study variables

-- additional_user_info
INSERT INTO Config (ConfigID, Value) VALUES (32, 1);

-- title
INSERT INTO Config (ConfigID, Value) VALUES (33, "Example Study");

-- studylogo
INSERT INTO Config (ConfigID, Value) VALUES (34, "images/neuro_logo_blue.gif");

-- columnThreshold
INSERT INTO Config (ConfigID, Value) VALUES (35, 250);

-- useEDC
INSERT INTO Config (ConfigID, Value) VALUES (36, "false");

-- ageMin
INSERT INTO Config (ConfigID, Value) VALUES (37, 8);

-- ageMax
INSERT INTO Config (ConfigID, Value) VALUES (38, 11);

-- multipleSites
INSERT INTO Config (ConfigID, Value) VALUES (39, "true");

-- useFamilyID
INSERT INTO Config (ConfigID, Value) VALUES (40, "false");

-- startYear
INSERT INTO Config (ConfigID, Value) VALUES (41, 2004);

-- endYear
INSERT INTO Config (ConfigID, Value) VALUES (42, 2014);

-- useExternalID
INSERT INTO Config (ConfigID, Value) VALUES (43, "false");

-- useProband
INSERT INTO Config (ConfigID, Value) VALUES (44, "false");

-- useProjects
INSERT INTO Config (ConfigID, Value) VALUES (45, "false");

-- useScreening
INSERT INTO Config (ConfigID, Value) VALUES (46, "false");

-- Testname
INSERT INTO Config (ConfigID, Value) VALUES (49, "aosi");

-- Threshold
INSERT INTO Config (ConfigID, Value) VALUES (50, 0.5);

-- Displayname
INSERT INTO Config (ConfigID, Value) VALUES (51, "AOSI");

-- Testname
INSERT INTO Config (ConfigID, Value) VALUES (49, "adi_r_proband");

-- Threshold
INSERT INTO Config (ConfigID, Value) VALUES (50, 89.5);

-- Displayname
INSERT INTO Config (ConfigID, Value) VALUES (51, "ADI-R (Proband)");

-- Testname
INSERT INTO Config (ConfigID, Value) VALUES (49, "adi_r_subject");

-- Threshold
INSERT INTO Config (ConfigID, Value) VALUES (50, 89.5);

-- Displayname
INSERT INTO Config (ConfigID, Value) VALUES (51, "ADI-R (Subject)");

-- Testname
INSERT INTO Config (ConfigID, Value) VALUES (49, "csbs");

-- Threshold
INSERT INTO Config (ConfigID, Value) VALUES (50, 79.5);

-- Displayname
INSERT INTO Config (ConfigID, Value) VALUES (51, "CSBS");

-- Testname
INSERT INTO Config (ConfigID, Value) VALUES (49, "csbs");

-- Threshold
INSERT INTO Config (ConfigID, Value) VALUES (50, 79.5);

-- Displayname
INSERT INTO Config (ConfigID, Value) VALUES (51, "CSBS");

-- default statistics settings

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) VALUES ("radiology_review");

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) VALUES ("mri_parameter_form");


-- default gui settings

-- css
INSERT INTO Config (ConfigID, Value) VALUES ("main.css");

-- rowsPerPage
INSERT INTO Config (ConfigID, Value) VALUES (25);

-- showTiming
INSERT INTO Config (ConfigID, Value) VALUES (0);

-- showPearErrors
INSERT INTO Config (ConfigID, Value) VALUES (0);

-- showDatabaseQueries
INSERT INTO Config (ConfigID, Value) VALUES (0);

-- PopUpFeedbackBVL
INSERT INTO Config (ConfigID, Value) VALUES (1);
