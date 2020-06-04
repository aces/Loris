-- default study variables

-- additional_user_info
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings WHERE Name="additional_user_info";

-- title
INSERT INTO Config (ConfigID, Value) SELECT ID, "Example Study" FROM ConfigSettings WHERE Name="title";

-- studylogo
INSERT INTO Config (ConfigID, Value) SELECT ID, "images/neuro_logo_blue.gif" FROM ConfigSettings WHERE Name="studylogo";

-- columnThreshold
INSERT INTO Config (ConfigID, Value) SELECT ID, 250 FROM ConfigSettings WHERE Name="columnThreshold";

-- useEDC
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useEDC";

-- ageMin
INSERT INTO Config (ConfigID, Value) SELECT ID, 8 FROM ConfigSettings WHERE Name="ageMin";

-- ageMax
INSERT INTO Config (ConfigID, Value) SELECT ID, 11 FROM ConfigSettings WHERE Name="ageMax";

-- multipleSites
INSERT INTO Config (ConfigID, Value) SELECT ID, "true" FROM ConfigSettings WHERE Name="multipleSites";

-- useFamilyID
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useFamilyID";

-- startYear
INSERT INTO Config (ConfigID, Value) SELECT ID, 2004 FROM ConfigSettings WHERE Name="startYear";

-- endYear
INSERT INTO Config (ConfigID, Value) SELECT ID, 2014 FROM ConfigSettings WHERE Name="endYear";

-- useExternalID
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useExternalID";

-- useProband
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProband";

-- useProjects
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useProjects";

-- useScreening
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="useScreening";

-- default path settings

-- imagePath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="imagePath";

-- base
INSERT INTO Config (ConfigID, Value) SELECT ID, "%LORISROOT%" FROM ConfigSettings WHERE Name="base";

-- data
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="data";

-- extLibs
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/EXTERNAL/LIBRARY/" FROM ConfigSettings WHERE Name="extLibs";

-- mincPath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/data/" FROM ConfigSettings WHERE Name="mincPath";

-- DownloadPath
INSERT INTO Config (ConfigID, Value) SELECT ID, "%LORISROOT%" FROM ConfigSettings WHERE Name="DownloadPath";

-- log
INSERT INTO Config (ConfigID, Value) SELECT ID, "tools/logs/" FROM ConfigSettings WHERE Name="log";

-- IncomingPath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/incoming/" FROM ConfigSettings WHERE Name="IncomingPath";

-- MRICodePath
INSERT INTO Config (ConfigID, Value) SELECT ID, "/data/%PROJECTNAME%/bin/mri/" FROM ConfigSettings WHERE Name="MRICodePath";

-- default gui settings

-- css
INSERT INTO Config (ConfigID, Value) SELECT ID, "main.css" FROM ConfigSettings WHERE Name="css";

-- rowsPerPage
INSERT INTO Config (ConfigID, Value) SELECT ID, 25 FROM ConfigSettings WHERE Name="rowsPerPage";

-- showTiming
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings WHERE Name="showTiming";

-- showPearErrors
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings WHERE Name="showPearErrors";

-- default www settings

-- host
INSERT INTO Config (ConfigID, Value) SELECT ID, "localhost" FROM ConfigSettings WHERE Name="host";

-- url
INSERT INTO Config (ConfigID, Value) SELECT ID, "https://localhost/" FROM ConfigSettings WHERE Name="url";

-- default dashboard settings

-- projectDescription
INSERT INTO Config (ConfigID, Value) SELECT ID, "This database provides an on-line mechanism to store both imaging and behavioral data collected from various locations. Within this framework, there are several tools that will make this process as efficient and simple as possible. For more detailed information regarding any aspect of the database, please click on the Help icon at the top right. Otherwise, feel free to contact us at the DCC. We strive to make data collection almost fun." FROM ConfigSettings WHERE Name="projectDescription";

-- default dicom_archive settings

-- patientIDRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./" FROM ConfigSettings WHERE Name="patientIDRegex";

-- patientNameRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="patientNameRegex";

-- LegoPhantomRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="LegoPhantomRegex";

-- LivingPhantomRegex
INSERT INTO Config (ConfigID, Value) SELECT ID, "/./i" FROM ConfigSettings WHERE Name="LivingPhantomRegex";

-- showTransferStatus
INSERT INTO Config (ConfigID, Value) SELECT ID, "false" FROM ConfigSettings WHERE Name="showTransferStatus";

-- default statistics settings

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) SELECT ID, "radiology_review" FROM ConfigSettings WHERE Name="excludedMeasures";

-- excludedMeasures
INSERT INTO Config (ConfigID, Value) SELECT ID, "mri_parameter_form" FROM ConfigSettings WHERE Name="excludedMeasures";

-- default mail settings

-- From
INSERT INTO Config (ConfigID, Value) SELECT ID, "nobody@example.com" FROM ConfigSettings WHERE Name="From";

-- Reply-to
INSERT INTO Config (ConfigID, Value) SELECT ID, "nobody@example.com" FROM ConfigSettings WHERE Name="Reply-to";

-- X-MimeOLE
INSERT INTO Config (ConfigID, Value) SELECT ID, "Produced by LorisDB" FROM ConfigSettings WHERE Name="X-MimeOLE";
