# Timepoint List - Test Plan:

1.  **Module access permissions**
    - For a candidate of the same site as your user, accessing the timepoint_list module via the url (https://\<yourInstance>\.loris.ca/\<candidateID\>) should not require any permission (With data entry permisson, click on the "Open Profile" button can also lead to the page).
    - For a candidate of a different site than your user, ensure that either 
        - `access_all_profiles` permission is required 
        - or that the candidate's registration site is the same as the user's site
2. **Action buttons** 
    - For a candidate of a different site than your user, attempt to access the timepoint list via the url. The page should load with a message of 'Permission Denied'.
    - For a candidate of the same site as your user, there should be up to 3 additional buttons:
        1. "Create time point" (links to create_timepoint module for that candidate) if your user has permission `data_entry`
        2. "Candidate Info" (links to candidate_parameters module for that candidate) if your user has permission `data_entry`
        3. "View Imaging Datasets" (links to the imaging_browser module for that candidate
3.  **Button links**
    - Ensure the "View Imaging datasets" button points to correct place. (imaging_browser module for that candidate)
    - Ensure the "Create time point" button points to correct place. (create_timepoint module for that candidate)
    - Ensure the "Candidate Info" button points to correct place. (candidate_parameters module for that candidate)
5.  **Datatable content**
    - Visit Label: Ensure correct visits are shown and links point to correct place. (instrument_list for that specific timepoint)
    - Imaging Scan Done: If 'yes', ensure links point to correct place (imaging_browser for that candidate and visit_label)
