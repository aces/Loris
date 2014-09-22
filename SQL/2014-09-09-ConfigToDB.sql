--
-- study
--

-- study
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('study', 'study variables', 1, 0);

-- additional_user_info
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'additional_user_info', 'display additional user fields in User Accounts page e.g. Institution', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- title
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'title', 'descriptive study title, appears on top of the screen', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- studylogo
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'studylogo', 'logo of the study, appears on the left of the title on the top of the screen', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- columnThreshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'columnThreshold', 'number of columns the quat table will contain', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- useEDC
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'useEDC', 'use EDC (Expected Date of Confinement) - false unless the study focuses on neonatals for birthdate estimations.', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- ageMin
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'ageMin', 'minimum candidate age in years (0+)', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- ageMax
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'ageMax', 'maximum candidate age in years', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- multipleSites
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'multipleSites', 'more than one site in the project', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- useFamilyID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'useFamilyID', 'use family ID', 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- startYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'startYear', "project's start year", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- endYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'endYear', "project's end year", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- useExternalID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'useExternalID', "external ID field is false unless data is used for blind data distribution, or/from external data sources", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- useProband
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'useProband', "show proband section on the candidate parameter page", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- useProjects
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'useProjects', "useProject field is false unless study involves more than one project where each project has multiple cohorts/subprojects", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- useScreening
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'useScreening', "useScreening", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- excluded_instruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'excluded_instruments', "instruments to be excluded from the data dictionary and the data query tool", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'instrument', "instrument to be excluded from the data dictionary and the data query tool", 1, 1, ID FROM ConfigSettings WHERE Name="excluded_instruments";

-- DoubleDataEntryInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'DoubleDataEntryInstruments', "instruments for which double data entry should be enabled", 1, 0, ID FROM ConfigSettings WHERE Name="study";

-- DoubleDataEntryInstrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'DoubleDataEntryInstrument', "instrument for which Double Data entry should be enabled", 1, 1, ID FROM ConfigSettings WHERE Name="DoubleDataEntryInstruments";

--
-- paths
--

-- paths
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('paths', 'path settings', 1, 0);

-- imagePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'imagePath', 'path to images', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- base
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'base', 'base path', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- data
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'data', 'path to data', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- extLibs
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'extLibs', 'path to external libraries', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- mincPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'mincPath', 'path to MINC files', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- DownloadPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'DownloadPath', 'where files are downloaded', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- log
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'log', 'path to logs', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- IncomingPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'IncomingPath', 'path for data transferred to the project server', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

-- MRICodePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'MRICodePath', 'path to MRI code', 1, 0, ID FROM ConfigSettings WHERE Name="paths";

--
-- gui
--

-- gui
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('gui', 'GUI settings', 1, 0);

-- css
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'css', 'name of the css file that will be used to render LORIS', 1, 0, ID FROM ConfigSettings WHERE Name="gui";

-- rowsPerPage
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'rowsPerPage', 'number of table rows to appear, per page', 1, 0, ID FROM ConfigSettings WHERE Name="gui";

-- showTiming
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'showTiming', 'show breakdown of timing information for page loading', 1, 0, ID FROM ConfigSettings WHERE Name="gui";

-- showPearErrors
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'showPearErrors', 'print PEAR errors', 1, 0, ID FROM ConfigSettings WHERE Name="gui";

--
-- www
--

-- www
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('www', 'www settings', 1, 0);

-- host
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'host', 'host', 1, 0, ID FROM ConfigSettings WHERE Name="www";

-- url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'url', 'main project URL', 1, 0, ID FROM ConfigSettings WHERE Name="www";

-- mantis_url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'mantis_url', 'bug tracker URL', 1, 0, ID FROM ConfigSettings WHERE Name="www";

--
-- dashboard
--

-- dashboard
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dashboard', 'dashboard settings', 1, 0);

-- projectDescription
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'projectDescription', 'description of the project that will be displayed in the top panel of the dashboard', 1, 0, ID FROM ConfigSettings WHERE Name="dashboard";

-- recruitmentTarget
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'recruitmentTarget', 'target number of participants for the study', 1, 0, ID FROM ConfigSettings WHERE Name="dashboard";

--
-- dicom_archive
--

-- dicom_archive
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dicom_archive', 'DICOM archive settings', 1, 0);

-- patientIDRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'patientIDRegex', 'regex for the patient ID', 1, 0, ID FROM ConfigSettings WHERE Name="dicom_archive";

-- patientNameRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'patientNameRegex', 'regex for the patient name', 1, 0, ID FROM ConfigSettings WHERE Name="dicom_archive";

-- LegoPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'LegoPhantomRegex', 'regex to be used on a Lego Phantom scan', 1, 0, ID FROM ConfigSettings WHERE Name="dicom_archive";

-- LivingPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'LivingPhantomRegex', 'regex to be used on Living Phantom scan', 1, 0, ID FROM ConfigSettings WHERE Name="dicom_archive";

-- showTransferStatus
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'showTransferStatus', 'show transfer status in the DICOM archive table', 1, 0, ID FROM ConfigSettings WHERE Name="dicom_archive";

--
-- statistics
--

-- statistics
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('statistics', 'statistics settings', 1, 0);

-- excludedMeasures
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'excludedMeasures', 'excludedMeasures', 1, 1, ID FROM ConfigSettings WHERE Name="statistics";

--
-- mail
--

-- mail
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('mail', 'mail settings', 1, 0);

-- headers
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'headers', 'headers', 1, 0, ID FROM ConfigSettings WHERE Name="mail";

-- From
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'From', 'From', 1, 0, ID FROM ConfigSettings WHERE Name="headers";

-- Reply-to
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'Reply-to', 'Reply-to', 1, 0, ID FROM ConfigSettings WHERE Name="headers";

-- X-MimeOLE
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) SELECT 'X-MimeOLE', 'X-MimeOLE', 1, 0, ID FROM ConfigSettings WHERE Name="headers";


/*
-- 32. ReliabilityInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ReliabilityInstruments', "instruments for relability module", 1, 0, 16);

-- 33. Instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Instrument', "instrument for reliability module", 1, 1, 47);

-- 34. Testname
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Testname', "Instrument for reliability module", 1, 0, 48);

-- 35. Threshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Threshold', "threshold for the instrument in the reliability module", 1, 0, 48);

-- 36. Displayname
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Displayname', "display name for the intrument in the reliability module", 1, 0, 48);

-- 34. Certification
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Certification', "certification module settings", 1, 0, 16);

-- 35. EnableCertification
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('EnableCertification', "enable certification", 1, 0, 34);

-- 36. CertificationProjects
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationProjects', "projects using certification", 1, 0, 34);

-- 37. CertificationProject
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationProject', "project that uses certification", 1, 1, 36);

-- 38. CertificationInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationInstruments', "instruments using certification", 1, 0, 34);

-- 39. CertificationInstrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationInstrument', "instrument using certification", 1, 1, 38);

-- 62. ConsentModule
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ConsentModule', "consent module settings", 1, 0, 6);

-- 63. useConsent
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useConsent', "show the consent module in the candidate information page", 1, 0, 62);

-- 64. Consent
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Consent', "type of consent that will be obtained (eg. consent to study, consent to blood work)", 1, 1, 62);

-- 65. name
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('name', "name of the field in the database where consent information of this type are stored", 1, 0, 64);

-- 66. label
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('label', "name of the type of consent as it will show up in the consent module", 1, 0, 64);
*/
