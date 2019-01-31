# Timepoint List - Test Plan:

1.  **Module access permissions**
    - For a candidate of the same site as your user, accessing the timepoint_list module should not require any permission.
    - For a candidate of a different site than your user, ensure that either 
        - `access_all_profiles` permission is required 
        - or that the candidate's registration site is the same as the user's site
2. **Action buttons** 
    - For a candidate of a different site than your user, ensure that the only button available is "View Imaging datasets".
    - For a candidate of the same site as your user, there should be 2 additional buttons: 
        1. "Create time point". (links to create_timepoint module for that candidate)
        2. One of "Edit Candidate Info" or "View Candidate Info" according to your user permissions :
            - "Edit Candidate Info" if your user has the `candidate_parameters_edit` permission.
            - "View Candidate Info" if your user has the `candidate_parameters_view` permission.
3.  **Button links**
    - Ensure the "View Imaging datasets" button points to correct place. (imaging_browser module for that candidate)
    - Ensure the "Create time point" button points to correct place. (create_timepoint module for that candidate)
    - Ensure the "... Candidate Info" button points to correct place. (candidate_parameters module for that candidate)
5.  **Datatable content**
    - Visit Label: Ensure correct visits are shown and links point to correct place. (instrument_list for that specific timepoint)
    - Imaging Scan Done: If 'yes', ensure links point to correct place (imaging_browser for that candidate and visit_label)
