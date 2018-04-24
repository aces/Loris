# Imaging Uploader

The Imaging Uploader allows users to upload DICOM scan sessions and browse past uploads.  

To upload a file, click on the Upload tab and enter required information about the scan: whether it is a 
“Phantom Scan”, the “CandID” (DCCID), “PSCID”, and “Visit Label”. 
Note: the candidate must already be registered in LORIS and the visit label must be known for the study. 

Typically an entire imaging session containing several raw DICOM acquisitions is uploaded at time. 
Please note that file to upload should be in a compressed format (.tgz, .tar.gz, or .zip) and must be labeled 
properly (by default: PSCID_DCCID_VisitLabel) in order to be uploaded and inserted into the database.  

Click “Browse” to select the file to upload from the local computer.  Click “Submit” to launch the upload. 
The newly uploaded file will be displayed in the table at the bottom.  
As the upload progresses, refreshing the page will show the current status in the “Progress” column.

Use the Selection Filters to find past uploads, filtering by “CandID”, “PSCID”, or “Visit Label”. 
As filter criteria are added, the data table of results below will dynamically update.  
Click “Clear Filters” to reset all filters and search fields. 

Click on any row in the data table to view the output of the imaging insertion pipeline for that file, which will appear 
in the “Log Viewer” panel at top right. In this panel, users have the option to display a “Detailed” view of all pipeline 
output, or “Summary” of key pipeline steps. This log information is displayed in the grey panel below;  scroll down within 
the grey panel to view additional output. 

To view all DICOM header fields and metadata, click on “View Details” under the “Tarchive Info” column to load the DICOM Archive module.


