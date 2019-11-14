# Imaging Uploader

This module allows you to upload DICOM scan sessions and browse past uploads.

In the **Browse** tab, you can use the *Selection Filter* section to search for existing uploads. 

Click on any row in the data table to view the output of the imaging insertion pipeline for that file, which will appear in the *Log Viewer* section in the top right. Use the drop-down menu to toggle between a *Detailed* view of all pipeline output, or a *Summary* view of key pipeline steps. 

In the data table, in the *Tarchive Info* column, you can click any **View Details** link to view all DICOM header fields and metadata for that scan (in the DICOM Archive module). You can also click on any number in the **Number of MINC Inserted** column to view the files in BrainBrowser.

To upload scans, click on the **Upload** tab. Enter the required information about the scan and select your file for upload.

Note: the candidate must already be registered in LORIS and the visit label must be known for the study.

Pay attention to the *Notes* for upload rules. If you are uploading an entire imaging session containing several raw DICOM acquisitions, the file must be in a compressed format, and labelled appropriately, or your upload will not be successful.
