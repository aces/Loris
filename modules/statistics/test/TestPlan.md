# Statistics Test Plan

1. Check that you can access the page only if you have the `data_entry` permission.
2. Try clicking on all the tabs. Do they appear to be working?
3. On each page, check that tables are aligned and look good, and columns and rows are properly/adequately labelled.

### Demographic Statistics
1. Click on the Demographic Statistics tab. For the general statistics table, compare the data in the table to that in the database to ensure that it is being queried correctly.
2. Check the general statistics filters. Try filtering by both site and project separately. Check that the site filter only applies to the general statistics table and that the project filter applies to both tables.
3. In the breakdown table, try filtering by each of the different instruments. Does each filter appear to be working? Check that it only applies to the breakdown table.
4. For the sex breakdown:
   - compare the data in the table to that in the database to ensure that it is being queried correctly.
   - check to see if the % Male is being calculated properly by looking at the data that's in the table.

### Behavioural Statistics
1. Click on the Behavioural Statistics tab. Try using the project filter Data Entry Statistics table (The `use projects` option need to set to `yes` under Loris configration). Does it work? Does it change what appears in both the top table and bottom table?
2. For both tables:
   - check that the % Completion makes sense in relation to the values in the table.
   - check that the data in the table matches what is stored in the database.
3. Check that the `View Details` links work in the Data Entry Statistics table.
4. After following this link, check that the incomplete candidates are correct in comparison to the incomplete forms in the database.
5. In the incomplete forms table, check that the candidate links take you to the appropriate candidate instrument forms.
6. Returning to the behavioural statistics page, check that the "Click here for breakdown per participant" link below the Data Entry Statistics table works.
7. Verify that this link takes you to page with completion statistics for all sites.
8. Returning to the behavioural statistics page, check that the `View Details` links work in the Double Data Entry Statistics table.
9. After following this link, check that the candidates requiring double data entry are correct in comparison to the forms requiring double data entry in the database.
10. On the incomplete double data entry page, check that the candidate links take you to the appropriate data entry page for that candidate.
11. Returning to the behavioral statistics tab, check that the "Click here for breakdown per participant for" link below the Double Data Entry Statistics table works.
12. Verify that this link takes you to page with double data entry statistics for all sites.
13. Returning to the behavioural statistics page, verify that if you do not have the `access_all_profiles` permission you should not be able to click through to forms for candidates from other sites.
14. Check the breadcrumbs from Completion stats page back to BVL stats tab within Statistics appear and allow you to use the `Back` button to previous pages (future feature).

### Imaging Statistics
1. Click on the Imaging Statistics tab. Try using the Site and Project filters. Does it change the data? Double check that the data represented is consistent with the data in the database.
2. For the 1st table, check that the Total column adds up correctly.
3. Check that `Select All`, as well as different combinations of scan types adjust the table accordingly.
4. Check that the data in the `Breakdown by Scan Type` table is accurate.
5. Check that `Show/Hide` visit labels works.
6. Check that changing the breakdown adjusts the table accurately.
7. Verify site and grand totals.
