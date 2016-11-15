# Imaging Uploader - Test Plan
      
1. Check that you have access to the Imaging Uploader page if you have either the imaging_uploader or superuser permission.

2. Check that when accessing the Imaging Uploader page, the search result table displays all the uploads done for all users.

3. Check that the visit label combo box contains all the possible visit labels (taken from the Visit_label column 
   in the session table for any Active candidate).
   
4. Try uploading an invalid file (a .jpg or .txt) with syntactically correct CandID, PSCID and visit labels. Make sure
   an appropriate message is displayed in the Console Output at the top of the page.
   
5. Execute step 4 again, but with a .tgz and .zip file.

6. Upload a valid, anonymized .tar.gz DICOM archive with the correct CandID, PSCID and visit label. Verify that the 
   file appears in the table after loading is complete. 
   
7. In the Admin/Configuration module, make sure the 'ImagingUploader Auto launch' option is set to 'No'. 
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
         the Number Of MincCreated and Number Of MincInserted columns, then check that the invalid MRI scans appear on the 
	 MRI violations page.
         
8. Go to the Candidate Profile page and search for the CandID of the candidate to which the scan belongs. Make sure 
   that column scan done is set to yes. Click on the 'Yes' link and verify that it takes you to the Imaging Browser
   page with all the valid scans for this candidate loaded in the result table.
   
9. Go in the profile details for the candidate found in step 8 and go into the visit table. Check that the MR Scan 
   done column is set to 'Yes' for the visit at which the scan was done. Click on the Yes link and make sure you 
   are taken to the Imaging Browser page with the valid scans performed for that candidate at that visit loaded 
   in the result table.
    
10. Go the the Imaging Uploader page and search for the upload done in step 6 using (in turn) the CandID, PSID and
    visit label. Verify that the upload done in step 6 is shown in the table each time. 
    
11. Repeat steps 7-11 but with a .tgz and .zip file.

12. In the Admin/Configuration module, set the 'ImagingUploader Auto launch' option to 'Yes'.
    Repeat steps 6-11 to verify that the insertion scripts work with the Auto Launch option.

13. Upload a valid, anonymized .tar.gz DICOM archive but with a CandID that does not match the one in the archive 
    (PSCID and visit label should be correct though). Check that an appropriate message is written in the Console 
    Output.
    
14. Upload a valid, anonymized .tar.gz DICOM archive but with a PSCID that does not match the one in the archive 
    (CandID and visit label should be correct though). Check that an appropriate message is written in the Console 
    Output.
    
15. Upload a valid, anonymized .tar.gz DICOM archive but with a visit label that does not match the one in the 
    archive (CandID and PSCID should be correct though). Check that an appropriate message is written in the Console 
    Output.
