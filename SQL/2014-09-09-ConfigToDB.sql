-- 1. dicom_archive
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dicom_archive', 'Settings related to the DICOM archive', 1, 0);

-- 2. dashboard
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dashboard', 'Settings related to the Dashboard', 1, 0);

-- 3. mail
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('mail', 'Mail settings', 1, 0);

-- 4. www
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('www', 'www settings', 1, 0);

-- 5. study
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('study', 'Study variables', 1, 0);

-- 6. statistics
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('statistics', 'Statistics options', 1, 0);

-- 7. gui
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('gui', 'GUI default settings', 1, 0);

--
-- dicom_archive children
--

-- patientIDRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('patientIDRegex', 'Settings related to the DICOM archive', 1, 0, 1);

-- patientNameRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('patientNameRegex', 'Settings related to the DICOM archive', 1, 0, 1);

-- LegoPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('LegoPhantomRegex', 'Settings related to the DICOM archive', 1, 0, 1);

-- LivingPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('LivingPhantomRegex', 'Settings related to the DICOM archive', 1, 0, 1);

-- showTransferStatus
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showTransferStatus', 'Settings related to the DICOM archive', 1, 0, 1);

--
-- dashboard children
--

-- projectDescription
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('projectDescription', 'Settings related to the Dashboard', 1, 0, 2);

-- recruitmentTarget
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('recruitmentTarget', 'Settings related to the Dashboard', 1, 0, 2);

--
-- mail children
--

-- headers
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('headers', 'Mail settings', 1, 0, 3);

-- From
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('From', 'Mail settings', 1, 0, REPLACE);

-- Reply-to
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Reply-to', 'Mail settings', 1, 0, REPLACE);

-- X-MimeOLE
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('X-MimeOLE', 'Mail settings', 1, 0, REPLACE);

--
-- www children
--

-- host
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('host', 'www settings', 1, 0, 4);

-- url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('url', 'www settings', 1, 0, 4);

-- mantis_url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('mantis_url', 'www settings', 1, 0, 4);

--
-- study children
--

-- additional_user_info
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('additional_user_info', 'Display additional user fields in User Accounts page e.g. Institution', 1, 0, 5);

-- title
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('title', 'Descriptive study title, appears on top of the screen', 1, 0, 5);

-- studylogo
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('studylogo', 'Logo of the study, appears on the left of the title on the top of the screen', 1, 0, 5);

-- columnThreshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('columnThreshold', 'Number of columns the quat table will contain', 1, 0, 5);

-- useEDC
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useEDC', 'true/false - use EDC (Expected Date of Confinement) field is false unless the study focuses on neonatals for birthdate estimations.', 1, 0, 5);

-- ageMin
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ageMin', 'minimum age in years (0+)', 1, 0, 5);

-- ageMax
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ageMax', 'max subject age in years', 1, 0, 5);

-- multipleSites
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('multipleSites', 'true/false - more than one site in the project?', 1, 0, 5);

-- useFamilyID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useFamilyID', 'true/false - use family ID', 1, 0, 5);

-- startYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('startYear', "project's start year", 1, 0, 5);

-- endYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('endYear', "project's end year", 1, 0, 5);

-- useProband
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useProband', "true/false - displays the proband field in the candidate profile", 1, 0, 5);

-- useScreening
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useScreening', "", 1, 0, 5);

-- ReliabilityInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ReliabilityInstruments', "Instruments for relability module", 1, 0, 5);

-- Instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Instrument', "Instrument for reliability module", 1, 1, REPLACE);

-- Testname
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Testname', "Instrument for reliability module", 1, 0, REPLACE);

-- Threshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Threshold', "Threshold for the instrument in the reliability module", 1, 0, REPLACE);

-- Displayname
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Displayname', "Display name for the intrument in the reliability module", 1, 0, REPLACE);

-- excluded_instruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('excluded_instruments', "Define a list of instruments to be skipped by quickform_parser.php. These instruments will not be available in Data Dictionary module", 1, 0, 5);

-- instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('instrument', "Instrument to be skipped by quickform_parser.php.", 1, 1, REPLACE);

-- DoubleDataEntryInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('DoubleDataEntryInstruments', "Add instruments for which Double Data entry should be enabled", 1, 0, 5);

-- instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('instrument', "Instrument for which Double Data entry should be enabled", 1, 1, REPLACE);

-- ConsentModule
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ConsentModule', "Consent module allows addition of consent information in the candidate information page", 1, 0, 5);

-- useConsent
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useConsent', "Enable the consent section in candidate information page", 1, 0, REPLACE);

-- Consent
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Consent', "", 1, 1, REPLACE);

-- name
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('name', "", 1, 0, REPLACE);

-- label
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('label', "", 1, 0, REPLACE);

--
-- statistics children
--

-- excludedMeasures
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('excludedMeasures', 'Statistics options', 1, 1, 6);

--
-- gui children
--

-- css
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('css', 'GUI default settings', 1, 0, 7);

-- rowsPerPage
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('rowsPerPage', 'GUI default settings', 1, 0, 7);

-- showTiming
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showTiming', 'GUI default settings', 1, 0, 7);

-- showPearErrors
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showPearErrors', 'GUI default settings', 1, 0, 7);

-- showDatabaseQueries
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showDatabaseQueries', 'GUI default settings', 1, 0, 7);

-- PopUpFeedbackBVL
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('PopUpFeedbackBVL', 'GUI default settings', 1, 0, 7);
