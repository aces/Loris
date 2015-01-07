-- Description updates

UPDATE ConfigSettings SET Description='Start year for study recruitment or data collection' WHERE Name='startYear';
UPDATE ConfigSettings SET Description='End year for study recruitment or data collection' WHERE Name='endYear';
UPDATE ConfigSettings SET Description='Use EDC (Expected Date of Confinement) for birthdate estimations if the study involves neonatals' WHERE Name='useEDC';
UPDATE ConfigSettings SET Description='Display additional user profile fields on the User accounts page (e.g. Institution, Position, Country, Address)' WHERE Name='additional_user_info';
UPDATE ConfigSettings SET Description='Instruments to be excluded from the Data Dictionary and download via the Data Query Tool' WHERE Name='excluded_instruments';
UPDATE ConfigSettings SET Description='Specify directories where LORIS-related files are stored or created. Take care when editing these fields as changing them incorrectly can cause certain modules to lose functionality.' WHERE Name='paths';
UPDATE ConfigSettings SET Description='Path for imaging data transferred to the project server (e.g. /data/incoming/$project/)' WHERE Name='IncomingPath';
UPDATE ConfigSettings SET Description='Path to directory where Loris-MRI (git) code is installed' WHERE Name='MRICodePath';
UPDATE ConfigSettings SET Description='Path to main imaging data directory (e.g. /data/$project/data/)' WHERE Name='data';
UPDATE ConfigSettings SET Description='Path to MINC files (e.g. /data/$project/data/)' WHERE Name='mincPath';
UPDATE ConfigSettings SET Description='Path to images for display in Imaging Browser (e.g. /data/$project/data/)' WHERE Name='imagePath';
UPDATE ConfigSettings SET Description='Number of table rows to display per page' WHERE Name='rowsPerPage';
UPDATE ConfigSettings SET Description='Main URL where LORIS can be accessed' WHERE Name='url';
UPDATE ConfigSettings SET Description='Description of the study displayed in main dashboard panel' WHERE Name='projectDescription';
UPDATE ConfigSettings SET Description='DICOM Archive settings' WHERE Name='dicom_archive';
UPDATE ConfigSettings SET Description='Regex for masking the Patient ID header field' WHERE Name='patientIDRegex';
UPDATE ConfigSettings SET Description='Regex for masking the Patient Name header field' WHERE Name='patientNameRegex';
UPDATE ConfigSettings SET Description='Show transfer status in the DICOM Archive table' WHERE Name='showTransferStatus';
UPDATE ConfigSettings SET Description='Instruments to be excluded from Statistics calculations' WHERE Name='excludedMeasures';
UPDATE ConfigSettings SET Description='LORIS email settings for notifications sent to users' WHERE Name='mail';
UPDATE ConfigSettings SET Description='Sender email address header (e.g. admin@myproject.loris.ca)' WHERE Name='From';
UPDATE ConfigSettings SET Description='Reply-to email address header (e.g. admin@myproject.loris.ca)' WHERE Name='Reply-to';

-- Label updates

UPDATE ConfigSettings SET Label='Start year' WHERE Name='startYear';
UPDATE ConfigSettings SET Label='End year' WHERE Name='endYear';
UPDATE ConfigSettings SET Label='LORIS-MRI code' WHERE Name='MRICodePath';
UPDATE ConfigSettings SET Label='Imaging data' WHERE Name='data';
UPDATE ConfigSettings SET Label='Main Loris URL' WHERE Name='url';
UPDATE ConfigSettings SET Label='DICOM Archive' WHERE Name='dicom_archive';
UPDATE ConfigSettings SET Label='Excluded instruments' WHERE Name='excludedMeasures';
UPDATE ConfigSettings SET Label='Email' WHERE Name='mail';

-- Order Number updates

UPDATE ConfigSettings SET OrderNumber=1 WHERE Name='base';
UPDATE ConfigSettings SET OrderNumber=2 WHERE Name='log';
UPDATE ConfigSettings SET OrderNumber=3 WHERE Name='extLibs';
UPDATE ConfigSettings SET OrderNumber=4 WHERE Name='DownloadPath';
UPDATE ConfigSettings SET OrderNumber=5 WHERE Name='IncomingPath';
UPDATE ConfigSettings SET OrderNumber=6 WHERE Name='MRICodePath';
UPDATE ConfigSettings SET OrderNumber=7 WHERE Name='data';
UPDATE ConfigSettings SET OrderNumber=8 WHERE Name='mincPath';
UPDATE ConfigSettings SET OrderNumber=9 WHERE Name='imagePath';