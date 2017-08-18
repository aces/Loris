#Statistics Test Plan

1. Check that you can only access the page if you have the data_entry permission.
2. Try clicking on all the tabs. Do they appear to be working?
3. On each page, check that tables are aligned and look good, and columns and rows are properly/adequately labelled.

### Demographic Statistics
4. Click on the Demographic Statistics tab. For the general statistics table, compare the data in the table to that in the database to ensure that it is being queried correctly.
5. Check the general statistics filters. Try filtering by both site and project separately. Check that the filters only apply to the general statistics table.
6. In the breakdown table, try filtering by each of the different instruments. Does each filter appear to be working? Check that it only applies to the breakdown table.
7. For the gender breakdown, compare the data in the table to that in the database to ensure that it is being queried correctly.
8. For the gender breakdown, check to see if the % Male is being calculated properly by looking at the data that's in the table.
9. For one of the data entry completeness breakdowns, compare the data in the table to that in the database to ensure that it is being queried correctly.
10. For one of the data entry completeness breakdowns, check to see if the % complete is being calculated properly by looking at the data that is in the table.

### Behavioural Statistics
11. Click on the Behavioural Statistics tab. Try using the project filter Data Entry Statistics table. Does it work? Does it change what appears in the top table only (perhaps it should be made clearer that it only applies to the top table)?
12. For both tables, check that the % Completion makes sense in relation to the values in the table.
13. For both tables, check that the data in the table matches what is stored in the database.
14. Check that the "Please click here" links work in the Data Entry Statistics table.
15. After following this link, check that the incomplete candidates are correct in comparison to the incomplete forms in the database.
16. In the incomplete forms table, check that the candidate links take you to the appropriate candidate instrument forms.
17. Returning to the behavioural statistics page, check that the "Click here for breakdown per participant" link below the Data Entry Statistics table works.
18. Verify that this link takes you to page with completion statistics for all sites
19. Returning to the behaviouarl statistics page, check that the "Please click here" links work in the Double Data Entry Statistics table
20. After following this link, check that the candidates requiring double data entry are correct in comparison to the forms requiring double data entry in the database.
21. On the incomplete double data entry page, check that the candidate links take you to the appropriate data entry page for that candidate
22. Returning to the behavioral statistics tab, check that the "Click here for breakdown per participant for" link below the Double Data Entry Statistics table works.
23. Verify that this link takes you to page with double data entry statistics for all sites
24. Returning to the behavioural statistics page, verify that if you do not have the access_all_profiles permission you should not be able to click through to forms for candidates from other sites.
25. Check the the breadcrumbs from Completion stats page back to BVL stats tab within Statistics appear and allow you to use the "back" button to previous pages (future feature).

### Imaging Statistics
26. Click on the Imaging Statistics tab. Try using the Site and Project filters. Does it change the data? Double check that the data represented is consistent with the data in the database.
27. For the 1st table, check that the Total column adds up correctly.
28. Check that Select All, as well as different combinations of scan types adjust the table accordingly.
29. Check that the data in the Breakdown by Scan Type table is accurate.
30. Check that show/hide visit labels works.
31. Check that changing the breakdown adjusts the table accurately.
32. Verify site and grand totals.
