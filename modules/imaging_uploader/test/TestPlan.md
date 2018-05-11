# Imaging Uploader - Test Plan
      
1. Check that you have access to the Imaging Uploader page if you have either the imaging_uploader or superuser permission.
   [Automation Testing]
2. Ensure that upon loading, the Imaging Uploader page has the 'Browse' and 'Upload' tabs.  
   [Manual Testing]
3. Check that when accessing the Imaging Uploader page, the 'Browse' tab displays all the uploads done for all users.
   [Automation Testing]
4. Ensure that the Browse tab allows searching based on CandID, PSCID, and/or Visit Label. Ensure that the Visit Label 
   is a dropdown menu containing all the possible visit labels (taken from the Visit_label column in the session table 
   for any Active candidate), and ensure that the CandID and PSCID automatically filter the list of entries in Imaging 
   Uploader table on the 'fly', as fields are being filled out. Ensure that 'Clear Filters' button works.  
   [Manual Testing]      
5. Ensure that the 'Upload' tab has the CandID, PSCID, and Visit Label greyed out upon loading. These greyed out fields remain
   as such if the 'Phantom Scans' is set to Yes, and become fillable and required fields if 'Phantom Scans' is set to No.  
   [Manual Testing]      
6. Try uploading an invalid file (a .jpg or .txt) with syntactically correct CandID, PSCID and visit labels. Make sure
   an appropriate message is displayed in the Console Output at the top of the page.
   [Manual Testing]
7. Execute step 6 again, but with a .tgz and .zip file.
   [Manual Testing]
8. Upload a scan which was already uploaded and which has either 'Not Started' or 'Failure' status in the Progress column. 
   Make sure you get the Warning message 'Are you sure? A file with this name already exists! Would you like to override 
   existing file?'. Ensure the correct behavior of the two possible actions by the user: 'Yes, I am sure!' or 'No, cancel it!'.  
   [Manual Testing]      
9. Upload a scan which was already uploaded and which was processed with 'Success' status in the Progress column. 
   Make sure you can not re-upload the file, and get the Error message 'File already exists! A file with this name has already 
   successfully passed the MRI pipeline!'. 
   [Manual Testing]      
10. Upload a new, valid, anonymized .tar.gz DICOM archive with the correct CandID, PSCID and visit label. Verify that the 
    file appears in the table after loading is complete. 
    [Manual Testing]
11. In the Admin/Configuration module, make sure the 'ImagingUploader Auto launch' option is set to 'No'. 
    Click on the show-data button and check the contents of the upload table after the successful upload done in 6. Ensure that
    the Progress column entry for that UploadID displays 'Not Started'. 
    Launch the imaging insertion scripts from a terminal window. Make sure the Progress column entry for that UploadID displays
    'In Progress ...' during the insertion process, and either 'Success' or 'Failure' at the end of the insertion process.
    Make sure all fields are correct. Also check that:

    - the Tarchive info column contains a link to the DICOM archive page with the details of the archive displayed (with
      the view Dicom Archive module and pages permission).
    - if the Number Of MincInserted column contains something, then it will be a clickable number (link) that takes you to 
      the MRI Browser page with all the valid scans loaded in the result table (with view imaging browser pages permission).
    - check that the Number Of MincCreated >= Number Of MincInserted. If there is difference between the number in
      the Number Of MincCreated and Number Of MincInserted columns, then check that the Number Of MincInserted column has a 
      clickable link that takes the user to the MRI violations page, displaying the violated scans of this upload.
    [Manual Testing]      
12. Go to the Candidate Profile page and search for the CandID of the candidate to which the scan belongs. Make sure 
    that column scan done is set to yes. Click on the 'Yes' link and verify that it takes you to the Imaging Browser
    page with all the valid scans for this candidate loaded in the result table.
    [Manual Testing]
13. Go in the profile details for the candidate found in step 10 and go into the visit table. Check that the MR Scan 
    done column is set to 'Yes' for the visit at which the scan was done. Click on the Yes link and make sure you 
    are taken to the Imaging Browser page with the valid scans performed for that candidate at that visit loaded 
    in the result table.
    [Manual Testing]
14. Go the the Imaging Uploader page and search for the upload done in step 10 using (in turn) the CandID, PSCID and
    visit label. Verify that the upload done in step 10 is shown in the table each time. 
    [Manual Testing]
15. Repeat steps 10-14 but with a .tgz and .zip file.
    [Manual Testing]
16. In the Admin/Configuration module, set the 'ImagingUploader Auto launch' option to 'Yes'.
    Repeat steps 10-15 to verify that the insertion scripts work with the Auto Launch option.
    [Manual Testing]
17. Upload a valid, anonymized .tar.gz DICOM archive but with a CandID that does not match the one in the archive 
    (PSCID and visit label should be correct though). Check that an appropriate message is written in the Console 
    Output.
    [Manual Testing]
18. First, set the config setting 'ImagingUploader auto launch' to 'Yes'. Then, edit your prod file (in
	<LORIS MRI code dir>/dicom-archive/.loris-mri) and comment out the definition of the @db array. Once these operations
	are done, upload any valid scan: check in the server processes manager that this fails with an error code of 4.
	Now try to upload the scan again. When the system asks you if you want to overwrite the existing 
	archive, answer 'Yes'. Check that this reupload fails with error code 4 (and not 2). 
	Related to Redmine#14093 and PR#3555.
	[Manual Testing]
19. Upload a valid, anonymized .tar.gz DICOM archive but with a PSCID that does not match the one in the archive 
    (CandID and visit label should be correct though). Check that an appropriate message is written in the Console 
    Output.
    [Automation Testing]
20. Upload a valid, anonymized .tar.gz DICOM archive but with a visit label that does not match the one in the 
    archive (CandID and PSCID should be correct though). Check that an appropriate message is written in the Console 
    Output.
    [Automation Testing]
