# Imaging Uploader - Test Plan

## Testing Access
1. Check that you have access to the Imaging Uploader page if you have either the imaging_uploader_allsites or imaging_uploader_ownsites permissions.
   [Automation Testing]
2. Ensure that upon loading, the Imaging Uploader page has the 'Browse' and 'Upload' tabs.  
   [Manual Testing]
3. Ensure user can always see scans they upload under the browse tab regardless of the permission combinations below. 
4. Set the `useAdvancedPermissions` (Use Advanced Permissions in the Imaging Modules tab) Configuration to NO.
    - Assign the user the `imaging_uploader_allsites` permission only. 
        - Ensure that the user can see ALL data for all sites and all projects including scans with no session ID assigned. (Backwards compatible behaviour)
    - Assign the user the `imaging_uploader_ownsites` permission only.
        - Ensure that the user can see data for their own sites only regardless of the project. Data with no sessionID should not be visible as we don't know what site it belongs to.
    - Assign the user the combination of `imaging_uploader_ownsites` and `imaging_uploader_nosessionid`.
        - Ensure that the user can see data for their own sites regardless of the project AND data with no session ID.
   [Manual Testing]
5. Change the `useAdvancedPermissions` (Use Advanced Permissions in the Imaging Modules tab) Configuration to YES.
    - Assign the user the `imaging_uploader_allsites` permission only. 
        - Ensure that the user can see ALL data for all sites but only for the projects they are assigned to. Data with no sessionID should not be visible.
    - Assign the user the `imaging_uploader_ownsites` permission only.
        - Ensure that the user can see data for their own sites and projects only. Data with no sessionID should not be visible as we don't know what site it belongs to.
    - Assign the user the combination of `imaging_uploader_ownsites` and `imaging_uploader_nosessionid`.
        - Ensure that the user can see data for their own sites, projects AND data with no session ID.
    - Assign the user the combination of `imaging_uploader_allsites` and `imaging_uploader_nosessionid`.
        - Ensure that the user can see data for all sites but only for the projects they are assigned to AND data with no session ID.
   [Manual Testing]

## Testing Functionality
1. Ensure that the Browse tab allows searching based on CandID, PSCID, and/or Visit Label. Ensure that the Visit Label 
    is a dropdown menu containing all the possible visit labels (taken from the Visit_label column in the session table 
    for any Active candidate), and ensure that the CandID and PSCID automatically filter the list of entries in Imaging 
    Uploader table on the 'fly', as fields are being filled out. Ensure that this works no matter what page of results
    from the query to the uploads table you are currently on. Ensure that 'Clear Filters' button works.
    [Manual Testing]      
2. Ensure that the 'Upload' tab has the CandID, PSCID, and Visit Label greyed out. These greyed out fields remain
    empty if the 'Phantom Scans' is set to Yes, and are properly filled based on the uploaded filename if 'Phantom Scans' is set to No.  
    [Manual Testing]
3. Test validation errors for 'CandID', 'PSCID', and 'Visit Label' in the 'Upload' tab and ensure that the appropriate
    error messages are displayed under the relevant form elements.

    Set Phantom Scans to 'No' and try to upload a valid `.zip` file for each scenario below:
    - A `CandID` that does not exist in the `candidate` table (e.g. try appending letters to an existing `CandID`)
    - A `PSCID` that is invalid for a specific `CandID` in the `candidate` table
    - A `Visit_label` that is invalid for a specific `CandID` in the `session` table
    - Set the `useAdvancedPermissions` (Use Advanced Permissions in the Imaging Modules tab) Configuration to NO.
        - Check that you can upload a scan to any site or project (including ones your user is not affiliated to)
    - Set the `useAdvancedPermissions` (Use Advanced Permissions in the Imaging Modules tab) Configuration to YES.
        - Check that you can NOT upload a scan to a site or project your user is not affiliated to
    - A candidate that has `Active` set to 'N' in the `candidate` table
    - A session that has `Active` set to 'N' in the `session` table
    - You should also consider scenarios where there are a combination of these errors or no error at all 

    _e.g. SQL command to set candidate associated with CandID X as inactive:_

    `UPDATE candidate SET Active = 'N' WHERE CandID = X;`

    _e.g. SQL command to set session associated with CandID X and Visit Label Y as inactive:_

    `UPDATE session SET Active = 'N' WHERE CandID = X AND Visit_label = 'Y';`

    [Manual Testing]

4. Test validations for 'File to Upload' in the 'Upload' tab and ensure that the appropriate
    error messages are displayed under the 'File to Upload' element.

    Set Phantom Scans to 'Yes' and try to upload a file for each scenario below:
    - A file that is not of type `.tgz` or `tar.gz` or `.zip` (e.g. a `.jpg` or `.txt`)
    - A file that exceeds the max upload size

    Set Phantom Scans to 'No' and try to upload a file for each scenario below:
    - A file that is not of type `.tgz` or `tar.gz` or `.zip` (e.g. a `.jpg` or `.txt`)
    - A file that exceeds the max upload size
    - A file that that does not match the `PSCID_CandID_VisitLabel` convention

    [Manual Testing]

5. Once all the values in the form have been validated, ensure that you can upload a `.zip` file and a `.tgz` file
    [Manual Testing]
6. Upload a scan which was already uploaded and which has either 'Not Started' or 'Failure' status in the Progress column.
    Ensure the file exists in the location specified in the Upload Location column. 
    Ensure you get the Warning message 'Are you sure? A file with this name already exists! Would you like to override 
    existing file?'. Ensure the correct behaviour of the two possible actions by the user: 'Yes, I am sure!' or 'No, cancel it!'.  
    [Manual Testing]      
7. Upload a scan which was already uploaded and which was processed with 'Success' status in the Progress column. 
    Ensure you can not re-upload the file, and get the Error message 'File already exists! A file with this name has already 
    successfully passed the MRI pipeline!'. 
    [Manual Testing]      
8. Upload a new, valid, anonymized `.tar.gz` DICOM archive with the correct CandID, PSCID and visit label. Verify that the 
    file appears in the table after loading is complete. 
    [Manual Testing]
9. In the Study section of the Admin/Configuration module, `Study` tab, ensure the 'ImagingUploader Auto launch' option is set to 'No'. 
    Click on the show-data button and check the contents of the upload table after the successful upload done in 8. Ensure that
    the Progress column entry for that UploadID displays 'Not Started'. 
    Launch the imaging insertion scripts from a terminal window. Ensure the Progress column entry for that UploadID displays
    'In Progress ...' during the insertion process, and either 'Success' or 'Failure' at the end of the insertion process.
    Ensure all fields are correct. Also check that:

    - the Tarchive info column contains a link to the DICOM archive page with the details of the archive displayed (with
      the view Dicom Archive module and pages permission).
    - if the Number Of MincInserted column contains something, then it will be a clickable number (link) that takes you to 
      the MRI Browser page with all the valid scans loaded in the result table (with view imaging browser pages permission).
    - check that the Number Of MincCreated >= Number Of MincInserted. If there is difference between the number in
      the Number Of MincCreated and Number Of MincInserted columns, then check that the Number Of MincCreated column has a 
      clickable link that takes the user to the MRI violations page, displaying the violated scans of this upload.
    [Manual Testing]      
10. Go to the Candidate Profile page and search for the CandID of the candidate to which the scan belongs. Click on the
    `View Imaging datasets` button and verify that it takes you to the Imaging Browser page with all the valid scans for
    this candidate loaded in the result table.
    [Manual Testing]
11. Go in the profile details for the candidate found in step 20 and go into the visit table. Ensure that column
    `MR Scan Done` is set to `Y`. Click on the `View Imaging data` button at the bottom of the page and verify that it takes
    you to the Imaging Browser page with the valid scans performed for that candidate at that visit loaded in the result table.
    [Manual Testing]
12. Go the the Imaging Uploader page and search for the upload done in step 18 using (in turn) the CandID, PSCID and
    visit label. Verify that the upload done in step 18 is shown in the table each time. 
    [Manual Testing]
13. Repeat steps 18-22 but with a `.tgz` and `.zip` file.
    [Manual Testing]
14. In the Admin/Configuration module, set the 'ImagingUploader Auto launch' option to 'Yes'.
    Repeat steps 18-23 to verify that the insertion scripts work with the Auto Launch option.
    [Manual Testing]
15. Upload a valid, anonymized `.tar.gz` DICOM archive but with a patient name (PSCID, CandID, Visit label) that does not
    match the one stored in the DICOM files of the archive (for example, patient name DICOM header = `MTL0001_111111_V01`
    but `.tar.gz` name being `MTL0002_222222_V01` which corresponds to another valid candidate).
    Check that an appropriate message is written in the Log Viewer UI bloc (i.e. "`The PatientName read from the DICOM
    header does not start with MTL0002_222222_V01 from the mri_upload table`").
    [Manual Testing]
16. Set the config setting 'ImagingUploader auto launch' to 'Yes'. Then, edit your prod file (in
	`<LORIS MRI code dir>/dicom-archive/.loris-mri`) and comment out the definition of the @db array. Once these operations
	are done, upload any valid scan: check in the server processes manager that this fails with an error code of 4.
	Now try to upload the scan again. When the system asks you if you want to overwrite the existing 
	archive, answer 'Yes'. Check that this reupload fails with error code 4 (and not 2). 
	Related to Redmine#14093 and PR#3555.
	[Manual Testing]
17. Set the config setting 'ImagingUploader auto launch' to 'No'. Upload an MRI archive that can successfully be
    uploaded. Check that the value of the Progress column for the uploaded archive is 'Not started'.
    [Manual Testing]
18. Set the config setting 'ImagingUploader auto launch' to 'Yes'. Upload an MRI archive that can successfully be
    uploaded and that will be processed successfully by the pipeline. Once the upload is finished and processing of the
    archive has begun, check that the value of the Progress column for the uploaded archive is 'In Progress...'.  Click 
    on the uploaded archive in the results table and select 'Detailed' in the combo box of the log panel. Check that an 
    increasing serie of dots is displayed along with a rotating bar to indicate that the archive is being processed. Once
    processing is finished, reload the page and check that the value of the Progress column for the uploaded archive is 
    'Success (X out of Y)', where X is the number of MINC files successfully inserted and Y is the total number of MINC 
    files created. 
    [Manual Testing]
19. Set the config setting 'ImagingUploader auto launch' to 'Yes'. Upload a file that can successfully be uploaded but that 
    will fail the processing done by the MRI pipeline. After the upload succeeds, wait for the MRI pipeline to finish processing
    the archive and check that the Progress column is set to 'Failure'. Note down the text that is displayed in the log panel
    (Detailed view). Now change the config setting 'ImagingUploader auto launch' to 'No'. Upload the same file again. once the
    upload is finished, ensure that the detailed log messages seen earlier are gone and have been replaced by a message that
    indicates that processing of the archive has not begun yet.
    [Manual Testing]
20. Set the config setting 'ImagingUploader auto launch' to 'Yes'. Change config setting MRICodePath so that its value is set to
    a directory that does not exist. Upload an MRI archive that can successfully be uploaded. Once the upload is done, check that
    the value in the 'Progress' column for this scan is set to 'Failure'. Also check that a message in the log panel indicate that
    there is something wrong with the setup of the LORIS-MRI code base.
    [Manual Testing]