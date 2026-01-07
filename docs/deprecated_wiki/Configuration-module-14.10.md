# Configuration Module (14.10)

This page provides basic descriptions of Configuration Module settings (see "Label" column) for LORIS Release 14.10.

Note for existing projects: the first table column provides the old config.xml tag/variable name.

Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

_Mac users: Please scroll right on the below table for further details on each field._

## Study variables
Name|Label|Description|Value
----|-----|-----------|-----
additional_user_info|Display additional user fields in User Accounts page|Additional fields can be added to the user accounts page, such as Academic Position, Institution, etc. To enable these extra fields, set this value to 1. |0/1
title|Descriptive study title|The study title will appear on multiple pages, including the login page|string
studylogo|Logo of the study|The logo file should be located under the /var/www/loris/htdocs/images/ folder. The value for this field should be images/$logofile|filename
columnThreshold|Number of columns the quat table will contain|For existing projects using quat-based DQG|integer
useEDC|Use EDC (Expected Date of Confinement) - false unless the study focuses on neonatals for birthdate estimations.|This must also be set for each subproject in the config.xml file|false/true
ageMin|Minimum candidate age in years (0+)||integer
ageMax|Maximum candidate age in years||integer
multipleSites|More than one site in the project||false/true
useFamilyID|Use family ID|When this field is set to true, the family information panel is shown on the Candidate Parameters page. It allows family members who are part of the same study to be linked. The ID of the family member and their relationship to the candidate shows up in the panel.|false/true
startYear|Project's start year||integer (year)
endYear|Project's end year||integer (year)
useExternalID|Use external ID field - false unless data is used for blind data distribution, or from external data sources||false/true
useProband|Show proband section on the candidate parameter page|When this field is set to true, the proband information panel is displayed on the Candidate Parameters page. This allows the insertion of proband information, such as proband ID, gender and date of birth.|false/true
useProjects|Whether or not study involves more than one project where each project has multiple cohorts/subprojects||false/true
useScreening|Whether or not there is a screening stage with its own instruments done before the visit stage||false/true
excluded_instruments|Instruments to be excluded from the Data Dictionary and the Data Query tool||empty
instrument|Instrument to be excluded from the data dictionary and the data query tool|Use the instrument test name (e.g. hand_preference)|instrument name
DoubleDataEntryInstruments|Instruments for which double data entry should be enabled|You must enter at least two instruments. Use the instrument test name (e.g. hand_preference)|instrument name

## Path Settings
Name|Label|Description|Value
----|-----|-----------|-----
imagePath|Path to images||path
base|Base path||path
data|Path to data||path
extLibs|Path to external libraries||path
mincPath|Path to MINC files||path
DownloadPath|Where files are downloaded||path
log|Path to logs|This should be a relative path starting from /var/www/loris|path
IncomingPath|Path for data transferred to the project server||path
MRICodePath|Path to MRI code||path

## GUI Settings
Name|Label|Description|Value
----|-----|-----------|-----
css|CSS file used for rendering|The file should be in the htdocs folder|filename
rowsPerPage|Number of table rows to appear, per page|This specifies the number of table rows to appear on pages with tables that can be filtered|integer
showTiming|Show breakdown of timing information for page loading|This is development feature that displays the time taken to load various aspects of the web page. To turn it on, set this field to 1. This should not be on for production databases.|0/1
showPearErrors|Print PEAR errors|This is a development feature that prints PEAR errors to the screen? This should not be on for production databases.|0/1

## WWW Settings
Name|Label|Description|Value
----|-----|-----------|-----
host|Host||string
url|Main project URL||string
mantis_url|Bug tracker URL||string

## Dashboard Settings
Name|Label|Description|Value
----|-----|-----------|-----
projectDescription|Description of the project that will be displayed in the top panel of the dashboard||string
recruitmentTarget|Target number of participants for the study|The target number will be used to generate the recruitment progress bar on the dashboard|integer

## DICOM Archive Settings
Name|Label|Description|Value
----|-----|-----------|-----
patientIDRegex|Regex for masking the patient ID||string
patientNameRegex|Regex for masking the patient name||string
LegoPhantomRegex|Regex to be used on a Lego Phantom scan|for identifying phantom scan from header|string
LivingPhantomRegex|Regex to be used on Living Phantom scan|for identifying phantom scan from header|string
showTransferStatus|Show transfer status in the DICOM Archive table||false/true

## Statistics Settings
Name|Label|Description|Value
----|-----|-----------|-----
excludedMeasures|Excluded measures|Instruments to exclude from the Statistics module. Use the instrument test name (e.g. hand_preference)|instrument name

## Mail Settings : Headers
Name|Label|Description|Value
----|-----|-----------|-----
From|From||email
Reply-to|Reply-to||email
X-MimeOLE|X-MimeOLE||string