# Access Profile Test Plan

1. Access access profile page, ensure that it renders.[Automation Testing]
2. Verify that either the permission access_all_profiles or data_entry is required for access the page.[Automation Testing]
3. Verify that if data_entry and not access_all_profiles permissions, can only see subjects from own site.[Automation Testing]
4. Verify that if data_entry and not access_all_profiles permissions, check that initial filter state is Subproject = All.[Automation Testing]
5. Verify advanced/basic filter toggle works.[Automation Testing]
6. Check that each dropdown has the correct options.[Automation Testing]
7. Test each filter individually
   [ ] Site
   [ ] DCCID
   [ ] PSCID
   [ ] Subproject
   [ ] Project
   [ ] Scan done
   [ ] Participant Status
   [ ] Biological Sex
   [ ] Number of visits
   [ ] Date of birth
   [ ] Latest Visit Status
   [ ] Feedback
   [Automation Testing]
8. Click "Clear Filters" and ensure filters are reset to same state as #2.
9. Ensure that columns are sortable by clicking on them.
10. Filter for Scan done. Ensure that "Yes" link points to correct scan in imaging browser.
11. Ensure PSCID link points to correct timepoint_list page.
12. Ensure that for candidates with feedback, feedback column is displayed and in the correct colour.
13. Ensure that the Open Profile panel only appears when not access_all_profiles permissions.
14. Enter wrong PSCID/DCCID combination and click Open Profile. Ensure that you get an error.
Incorrect PSCID/DCCID combinations in the filter form should not give such an error.
It should return that no results were found.
15. Enter correct PSCID/DCCID combination and ensure that it loads correct timepoint_list page
16. Remove access_all_profiles permission and ensure that PSCID links are still clickable.
17. Change useEDC config variable to _no_ from the Configuration Module and ensure filters are removed from menu.
