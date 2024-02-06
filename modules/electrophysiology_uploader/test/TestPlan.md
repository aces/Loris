## Electrophysiology Uploader test plan

### A. Electrophysiology Uploader front page
1. User can load Electrophysiology Uploader module front page if and only if user has either permission:
   * `electrophysiology_browser_view_site` : _"View all-sites Electrophysiology Browser pages"_
   * `electrophysiology_browser_view_allsites` : _"View own site Electrophysiology Browser pages"_

   [Manual Testing]
2. Ensure that upon loading, the Electrophysiology Uploader page has the 'Browse' and 'Upload' tabs. [Manual Testing]
3. Check that when accessing the Electrophysiology Uploader page, the 'Browse' tab displays all the uploads done for all users.
   [Manual Testing]
4. Ensure that the Browse tab allows searching based on Site, PSCID, and/or Visit Label. Ensure that the Site filter 
   is a dropdown menu containing all the possible sites, and ensure that fields automatically filter the list of entries in Electrophysiology Uploader table on the 'fly', as fields are being filled out. Ensure that this works no matter what page of results
   from the query to the uploads table you are currently on. Ensure that 'Clear Filters' button works.
   [Manual Testing]     
5. Ensure that the 'Upload' tab has the CandID, PSCID, and Visit Label greyed out.
   These greyed out fields are properly filled based on the uploaded filename.  
   [Manual Testing]
6. Test validation errors for 'CandID', 'PSCID', and 'Visit Label' in the 'Upload' tab and ensure that the appropriate
   error messages are displayed under the relevant form elements.

   Try to upload a valid `tar.gz` file for each scenario below:
   - A `CandID` that does not exist in the `candidate` table (e.g. try appending letters to an existing `CandID`)
   - A `PSCID` that is invalid for a specific `CandID` in the `candidate` table
   - A `Visit_label` that is invalid for a specific `CandID` in the `session` table
   - A candidate that has `Active` set to 'N' in the `candidate` table
   - A session that has `Active` set to 'N' in the `session` table
   - You should also consider scenarios where there are a combination of these errors or no error at all

   _e.g. SQL command to set candidate associated with CandID X as inactive:_

   `UPDATE candidate SET Active = 'N' WHERE CandID = X;`

   _e.g. SQL command to set session associated with CandID X and Visit Label Y as inactive:_

   `UPDATE session SET Active = 'N' WHERE CandID = X AND Visit_label = 'Y';`

   [Manual Testing]
7. Test validations for 'File to Upload' in the 'Upload' tab and ensure that the appropriate
   error messages are displayed under the 'File to Upload' element.

   Try to upload a file for each scenario below:
   - A file that is not of type `tar.gz` (e.g. a `.jpg` or `.txt`)
   - A file that exceeds the `upload_max_filesize` and/or the `post_max_size` .ini directive.
   - A file that that does not match the `PSCID_CandID_VisitLabel` convention

   [Manual Testing]
8. Once all the values in the form have been validated, ensure that the upload process runs successfully.
   Verify that you can start another upload process and that the file appears in the browse panel after uploading is complete. 
   [Manual Testing]
9. Upload a file which was already uploaded. Ensure the file is successfully uploaded and that the previous file was moved in /archives.  
   [Manual Testing]
10. Change config setting `EEGUploadIncomingPath` so that its value is set to a directory that does not exist.
    Upload an EEG archive that passes validation. Once the upload is done, check that a message indicates that
    there is something wrong with the setup of the EEG path.
    [Manual Testing]
11. Assign yourself the permission `monitor_eeg_uploads` and upload a new file.
    Check that you receive an mail notification once the upload is complete.
    [Manual Testing]
