-- 1. paths
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('paths', 'path settings', 1, 0);

-- 2. dicom_archive
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dicom_archive', 'DICOM archive settings', 1, 0);

-- 3. dashboard
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('dashboard', 'dashboard settings', 1, 0);

-- 4. mail
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('mail', 'mail settings', 1, 0);

-- 5. www
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('www', 'www settings', 1, 0);

-- 6. study
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('study', 'study variables', 1, 0);

-- 7. statistics
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('statistics', 'statistics settings', 1, 0);

-- 8. gui
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple) VALUES ('gui', 'GUI settings', 1, 0);

--
-- path children
--

-- 9. imagePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('imagePath', "path to images", 1, 0, 1);

-- 10. base
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('base', "base path", 1, 0, 1);

-- 11. data
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('data', "path to data", 1, 0, 1);

-- 12. extLibs
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('extLibs', "path to external libraries", 1, 0, 1);

-- 13. mincPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('mincPath', "path to MINC files", 1, 0, 1);

-- 14. DownloadPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('DownloadPath', "where files are downloaded", 1, 0, 1);

-- 15. log
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('log', "path to logs", 1, 0, 1);

-- 16. IncomingPath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('IncomingPath', "NOT SURE", 1, 0, 1);

-- 17. MRICodePath
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('MRICodePath', "NOT SURE", 1, 0, 1);

--
-- dicom_archive children
--

-- 18. patientIDRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('patientIDRegex', 'regex for the patient ID', 1, 0, 2);

-- 19. patientNameRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('patientNameRegex', 'regex for the patient name', 1, 0, 2);

-- 20. LegoPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('LegoPhantomRegex', 'regex to be used on a Lego Phantom scan', 1, 0, 2);

-- 21. LivingPhantomRegex
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('LivingPhantomRegex', 'regex to be used on Living Phantom scan', 1, 0, 2);

-- 22. showTransferStatus
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showTransferStatus', 'show transfer status in the DICOM archive table', 1, 0, 2);

--
-- dashboard children
--

-- 23. projectDescription
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('projectDescription', 'description of the project that will be displayed in the top panel of the dashboard', 1, 0, 3);

-- 24. recruitmentTarget
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('recruitmentTarget', 'target number of participants for the study', 1, 0, 3);

--
-- mail children
--

-- 25. headers
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('headers', 'Mail settings', 1, 0, 4);

-- 26. From
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('From', 'Mail settings', 1, 0, 25);

-- 27. Reply-to
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Reply-to', 'Mail settings', 1, 0, 25);

-- 28. X-MimeOLE
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('X-MimeOLE', 'Mail settings', 1, 0, 25);

--
-- www children
--

-- 29. host
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('host', '', 1, 0, 5);

-- 30. url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('url', 'main project URL', 1, 0, 5);

-- 31. mantis_url
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('mantis_url', 'bug tracker URL', 1, 0, 5);

--
-- study children
--

-- 32. additional_user_info
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('additional_user_info', 'display additional user fields in User Accounts page e.g. Institution', 1, 0, 6);

-- 33. title
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('title', 'descriptive study title, appears on top of the screen', 1, 0, 6);

-- 34. studylogo
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('studylogo', 'logo of the study, appears on the left of the title on the top of the screen', 1, 0, 6);

-- 35. columnThreshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('columnThreshold', 'number of columns the quat table will contain', 1, 0, 6);

-- 36. useEDC
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useEDC', 'use EDC (Expected Date of Confinement) - false unless the study focuses on neonatals for birthdate estimations.', 1, 0, 6);

-- 37. ageMin
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ageMin', 'minimum candidate age in years (0+)', 1, 0, 6);

-- 38. ageMax
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ageMax', 'maximum candidate age in years', 1, 0, 6);

-- 39. multipleSites
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('multipleSites', 'more than one site in the project', 1, 0, 6);

-- 40. useFamilyID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useFamilyID', 'use family ID', 1, 0, 6);

-- 41. startYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('startYear', "project's start year", 1, 0, 6);

-- 42. endYear
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('endYear', "project's end year", 1, 0, 6);

-- 43. useExternalID
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useExternalID', "external ID field is false unless data is used for blind data distribution, or/from external data sources", 1, 0, 6);

-- 44. useProband
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useProband', "show proband section on the candidate parameter page", 1, 0, 6);

-- 45. useProjects
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useProjects', "useProject field is false unless study involves more than one project where each project has multiple cohorts/subprojects", 1, 0, 6);

-- 46. useScreening
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('useScreening', "", 1, 0, 6);

-- 47. ReliabilityInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('ReliabilityInstruments', "instruments for relability module", 1, 0, 6);

-- 48. Instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Instrument', "instrument for reliability module", 1, 1, 47);

-- 49. Testname
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Testname', "Instrument for reliability module", 1, 0, 48);

-- 50. Threshold
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Threshold', "threshold for the instrument in the reliability module", 1, 0, 48);

-- 51. Displayname
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Displayname', "display name for the intrument in the reliability module", 1, 0, 48);

-- 52. excluded_instruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('excluded_instruments', "instruments to be excluded from the data dictionary and the data query tool", 1, 0, 6);

-- 53. instrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('instrument', "instrument to be excluded from the data dictionary and the data query tool", 1, 1, 61);

-- 54. Certification
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('Certification', "certification module settings", 1, 0, 6);

-- 55. EnableCertification
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('EnableCertification', "enable certification", 1, 0, 54);

-- 56. CertificationProjects
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationProjects', "projects using certification", 1, 0, 54);

-- 57. CertificationProject
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationProject', "project that uses certification", 1, 1, 56);

-- 58. CertificationInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationInstruments', "instruments using certification", 1, 0, 54);

-- 59. CertificationInstrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CertificationInstrument', "instrument using certification", 1, 1, 58);

-- 60. DoubleDataEntryInstruments
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('DoubleDataEntryInstruments', "instruments for which double data entry should be enabled", 1, 0, 6);

-- 61. DoubleDataEntryInstrument
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('DoubleDataEntryInstrument', "instrument for which Double Data entry should be enabled", 1, 1, 60);

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

--
-- statistics children
--

-- 67. excludedMeasures
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('excludedMeasures', '', 1, 1, 7);

--
-- gui children
--

-- 68. css
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('css', 'name of the css file that will be used to render LORIS', 1, 0, 8);

-- 69. rowsPerPage
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('rowsPerPage', 'number of table rows to appear, per page', 1, 0, 8);

-- 70. showTiming
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showTiming', 'show breakdown of timing information for page loading', 1, 0, 8);

-- 71. showPearErrors
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showPearErrors', 'print PEAR errors', 1, 0, 8);

-- 72. showDatabaseQueries
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('showDatabaseQueries', 'print all the database queries required for page load to the in-page console ', 1, 0, 8);

-- 73. PopUpFeedbackBVL
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('PopUpFeedbackBVL', 'show the behavioural feedback pop-up', 1, 0, 8);
