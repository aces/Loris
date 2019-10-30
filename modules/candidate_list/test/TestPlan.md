# Access Profile Test Plan

1. Access access profile page, ensure that it renders.[Automation Testing]
2. Verify that either the permission access_all_profiles or data_entry is required for access the page.[Automation Testing]
3. Verify that if data_entry and not access_all_profiles permissions, can only see subjects from own site.[Automation Testing]
4. Verify that if data_entry and not access_all_profiles permissions, check that initial filter state is Subproject = All.[Automation Testing]
5. Verify advanced/basic filter toggle works.[Automation Testing]
6. Verify advanced filters are expanded on page load when an advanced filter is set, and collapsed otherwise.[Automation Testing]
7. Check that each dropdown has the correct options.[Automation Testing]
8. Test each filter individually
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
9. Click "Clear Form" and ensure filters are reset to same state as #2.
10. Ensure that columns are sortable by clicking on them.
11. Filter for Scan done. Ensure that "Yes" link points to correct scan in imaging browser.
12. Ensure PSCID link points to correct timepoint_list page.
13. Ensure that for candidates with feedback, feedback column is displayed and in the correct colour.
14. Ensure that the Open Profile panel only appears when not access_all_profiles permissions.
15. Enter wrong PSCID/DCCID combination and click Open Profile. Ensure that you get an error.
Incorrect PSCID/DCCID combinations in the filter form should not give such an error.
It should return that no results were found.
16. Enter correct PSCID/DCCID combination and ensure that it loads correct timepoint_list page
17. Remove access_all_profiles permission and ensure that PSCID links are still clickable.
18. Change useEDC config variable to _no_ from the Configuration Module and ensure filters are removed from menu.
