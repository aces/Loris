# Timepoint List - Test Plan:

1.  Access a candidate and ensure correct visits shown and links point to
   correct place.
2.a For a candidate of the same site as your user, accessing the timepoint_list module should not require any permission.
2.b For a candidate of a different site than your user, ensure that `access_all_profiles` permission is required. to access timepoint_list.
3.a For a candidate of a different site than your user, ensure that the only button available is "View Imaging datasets". This button should bring you to the imaging_browser module and the PSCID should be set in the filters.
3.b For a candidate of the same site as your user, their should be 2 additionnal buttons: 
    1. "Create time point". 
    2. One of "Edit Candidate Info" or "View Candidate Info" according to your user permissions :
        - "Edit Candidate Info" if your user has the `candidate_parameters_edit` permission.
        or
        - "View Candidate Info" if your user has the `candidate_parameters_view` permission.
4.  Ensure create timepoint link points to correct place. (create_timepoint module for that candidate)
5.  Ensure candidate_info link points to correct place. (candidate_parameters module for that candidate)
