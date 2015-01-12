UPDATE ConfigSettings SET Description="Logo of the study. File should be located under the /var/www/$projectname/htdocs/images/ folder" WHERE Name="studyLogo";

UPDATE ConfigSettings SET Description="Study involves more than one project, where each project has multiple cohorts/subprojects" WHERE Name="useProjects";

UPDATE ConfigSettings SET Description="Use Screening stage with its own distinct instruments, administered before the Visit stage" WHERE Name="useScreening";

UPDATE ConfigSettings SET Description="Instruments to be excluded from the Data Dictionary and the Data Query tool" WHERE Name="excluded_instruments";

UPDATE ConfigSettings SET Description="Instrument (test name e.g. hand_preference)" WHERE Name="instrument";

UPDATE ConfigSettings SET Description="Instruments for which double data entry should be enabled (test name e.g. hand_preference)" WHERE Name="DoubleDataEntryInstruments";

UPDATE ConfigSettings SET Description="Path to logs (relative path starting from /var/www/$projectname)" WHERE Name="log";

UPDATE ConfigSettings SET Description="Regex for masking the patient ID" WHERE Name="patientIDRegex";

UPDATE ConfigSettings SET Description="Regex for masking the patient name" WHERE Name="patientNameRegex";

UPDATE ConfigSettings SET Description="Regex for identifying a Lego Phantom scan header" WHERE Name="LegoPhantomRegex";

UPDATE ConfigSettings SET Description="Regex for identifying a Living Phantom scan header" WHERE Name="LivingPhantomRegex";

UPDATE ConfigSettings SET Description="Excluded measures (test name e.g. hand_preference)" WHERE Name="excludedMeasures";