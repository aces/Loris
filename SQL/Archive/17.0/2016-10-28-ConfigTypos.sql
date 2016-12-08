UPDATE ConfigSettings SET Label='Multiple sites' WHERE Name='multipleSites';
UPDATE ConfigSettings SET Description='Used for identifying timepoints that have (or should have) imaging data' WHERE Name='useScanDone';
UPDATE ConfigSettings SET Description='Path to the directory where files available for download are stored. Used to transfer files to the imaging browser, data query tool, and the package_files.sh script.' WHERE Name='DownloadPath';
UPDATE ConfigSettings SET Description='Path to the Directory of Uploaded Scans' WHERE Name='MRIUploadIncomingPath';