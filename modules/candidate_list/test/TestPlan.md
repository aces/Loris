# Access Profile Test Plan

1. Access "Access Profile" page, ensure that it renders.[Automation Testing]
2. Verify that either the permission "Access Profile: View Candidates and Timepoints - All Sites" or "Access Profile: View/Create Candidates and Timepoints - Own Sites" is required to access the page.[Automation Testing]
3. Verify that with the "Access Profile: View/Create Candidates and Timepoints - Own Sites" permission and without the "Access Profile: View Candidates and Timepoints - All Sites" permission, only subjects from the user's own sites can be viewed.[Automation Testing]
4. Verify that the "Show Advanced Filters"/"Hide Advanced Filters" toggle works.[Automation Testing]
5. Check that each dropdown has the correct options.[Automation Testing]
6. Test each filter individually
   [ ] Site
   [ ] DCCID
   [ ] PSCID
   [ ] Visit Label
   [ ] Cohort
   [ ] Project
   [ ] Scan Done
   [ ] Participant Status
   [ ] Sex
   [ ] Visit Count
   [ ] DoB
   [ ] Feedback
   [ ] Entity Type
   [ ] EDC
   [Automation Testing]
7. Click "Clear Filter" and ensure filters are reset to same state as #2.
8. Ensure that columns are sortable by clicking on the column headers.
9. Filter for Scan Done "Yes". Ensure that, in the 'Scan Done' column of the data table, the "Y" link for a candidate points to the Imaging Browser, with its 'PSCID' filter set to that of the candidate.
10. Ensure the 'PSCID' link points to the correct Candidate Profile page.
11. Ensure that for candidates with feedback, the 'Feedback' column is displayed and in the correct colour: green for "Closed", and red for "Opened".
12. Ensure that the Open Profile button only appears without "Access Profile: View Candidates and Timepoints - All Sites" permission.
13. Click 'Open Profile', enter wrong PSCID/DCCID combination and click 'Open Profile' again. Ensure an error is thrown.
Alternatively, an incorrect PSCID/DCCID combination in the Selection Filter form should not give such an error; it should return that no results were found.
14. Enter a correct PSCID/DCCID combination in the 'Open Profile' form and ensure that it loads the correct Candidate Profile page
15. In the Configuration module, set the Study variable 'Use EDC' to _No_. Ensure that the _EDC_ filter and the _EDC_ column are removed from the Selection Filter form and data table, respectively.
