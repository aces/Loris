-- default dicom_archive settings

-- patientIDRegex
INSERT INTO Config (ConfigID, Value) VALUES (2, "/./");

-- patientNameRegex
INSERT INTO Config (ConfigID, Value) VALUES (3, "/./i");

-- LegoPhantomRegex
INSERT INTO Config (ConfigID, Value) VALUES (4, "/./i");

-- LivingPhantomRegex
INSERT INTO Config (ConfigID, Value) VALUES (5, "/./i");

-- showTransferStatus
INSERT INTO Config (ConfigID, Value) VALUES (6, "false");

-- default mail settings

-- From
INSERT INTO Config (ConfigID, Value) VALUES (9, "nobody@example.com");

-- Reply-to
INSERT INTO Config (ConfigID, Value) VALUES (10, "nobody@example.com");

-- X-MimeOLE
INSERT INTO Config (ConfigID, Value) VALUES (11, "Produced by LorisDB");


-- default dashboard settings

INSERT INTO Config (ConfigID, Value) VALUES (23, "This database provides an on-line mechanism to store both imaging and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun.");


-- default www settings

-- host
INSERT INTO Config (ConfigID, Value) VALUES (13, "localhost");

-- url
INSERT INTO Config (ConfigID, Value) VALUES (14, "https://localhost/");

-- mantis_url
INSERT INTO Config (ConfigID, Value) VALUES (15);


-- default study variables

-- additional_user_info
INSERT INTO Config (ConfigID, Value) VALUES (17, 1);

-- title
INSERT INTO Config (ConfigID, Value) VALUES (18, "Example Study");

-- studylogo
INSERT INTO Config (ConfigID, Value) VALUES (19, "images/neuro_logo_blue.gif");

-- columnThreshold
INSERT INTO Config (ConfigID, Value) VALUES (20, 250);

-- useEDC
INSERT INTO Config (ConfigID, Value) VALUES (21, "false");

-- ageMin
INSERT INTO Config (ConfigID, Value) VALUES (22, 8);

-- ageMax
INSERT INTO Config (ConfigID, Value) VALUES (23, 11);

-- multipleSites
INSERT INTO Config (ConfigID, Value) VALUES (24, "true");

-- useFamilyID
INSERT INTO Config (ConfigID, Value) VALUES (25, "false");

-- startYear
INSERT INTO Config (ConfigID, Value) VALUES (26, 2004);

-- endYear
INSERT INTO Config (ConfigID, Value) VALUES (27, 2014);

-- useExternalID
INSERT INTO Config (ConfigID, Value) VALUES (28, "false");

-- useProband
INSERT INTO Config (ConfigID, Value) VALUES (29, "false");

-- useProjects
INSERT INTO Config (ConfigID, Value) VALUES (30, "false");

-- useScreening
INSERT INTO Config (ConfigID, Value) VALUES (31, "false");

-- instrument
INSERT INTO Config (ConfigID, Value) VALUES (33);


-- default statistics settings

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) VALUES (35, "radiology_review");

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) VALUES (35, "mri_parameter_form");


-- default gui settings

-- css
INSERT INTO Config (ConfigID, Value) VALUES (37, "main.css");

-- rowsPerPage
INSERT INTO Config (ConfigID, Value) VALUES (38, 25);

-- showTiming
INSERT INTO Config (ConfigID, Value) VALUES (39, 0);

-- showPearErrors
INSERT INTO Config (ConfigID, Value) VALUES (40, 0);

-- showDatabaseQueries
INSERT INTO Config (ConfigID, Value) VALUES (41, 0);

-- PopUpFeedbackBVL
INSERT INTO Config (ConfigID, Value) VALUES (42, 1);


/*
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

*/
