# Data Query - Test Plan

This test plan is long, so, it is divided into sections. As such, each test in the table of contents is meant to be run with 2 users; one with one site and one project, the other with multiple sites and multiple projects.

## Table of Contents

1. [Permission Test](#permission-test)
2. [Panels Test](#panels-test)
3. [Recent Queries Test](#recent-queries-test)
4. [Pin Tests](#pin-tests)
5. [Fields Selection](#fields-selection)
6. [Other parameters](#other-parameters)
7. [Sync not Sync](#sync-not-sync)
8. [Filters](#filters)
9. [Run Query Page](#run-query-page)

- Create a user with one site and one project, for example: Rome, Pumpernickel.
- Create a second user with more than one site and more than one project with the same permissions.

## Permission Test

For your first user, enable the following permissions:
- [x] Access Profile: View/Create Candidates and Timepoints - Own Sites. `data_entry`  
- [x] Data Dictionary: View Parameter Type Descriptions. `data_dict_edit`
- [x] Data Query Tool: View/Download Cross-Modality Data. `dataquery_view`
- Remove the following permission and assert that the module does **not** load:
- [x] Data Query Tool: View/Download Cross-Modality Data. `dataquery_view`
- Switch to your other user, remove the `data_query_view` permission and assert that the module does **not** load for this user

## Panels Test

1. Assert that the following panels collapse and open :

   - Instructions
   - Recent Queries
   - Next Steps (in the bottom-right corner)

2. Assert that `Continue to Define Fields` button in the main panel, and `Choose Fields` button in the `Next Steps` panel are redirecting to the same page.

## Recent Queries Test

1. Assert that the queries you made have their parameters correctly displayed (i.e. fields and filters).
2. Assert that `text filter` immediately filters the queries.
3. Assert that clicking `Collapse queries` effectively collapses all queries.

Make a mix of the following actions

- `Star`: should have a yellow star
- `Name` some queries
- `Share` should have a blue shared state
- `Rerun` some queries

3. Assert that using the `Starred Only` checkbox filter only keeps the starred ones.
4. Assert that removing the `Starred Only` checkbox prints the same queries originally printed.

- Repeat 3. and 4. for `Shared Only`, `Named Only` and `No run times` checkboxes.

1. Assert that mixing checkboxes returns the right query selection. Only queries that match all of the checked conditions should be displayed.
2. Remove all pinned queries and assert that there is no `Study Queries` panel at the top of the page.

## Pin Tests

- Click the `Pin` icon to perform the following tests (ensure that you have 'admin' permission):

1. With the `query name` text fieldataqueryd empty, click the `Submit` button and assert that the error message reads:

`Must provide a query name to pin query as.`

- Enter a query name and uncheck the following:
- [ ] `Pin Study Query`
- [ ] `Pin Dashboard Summary`
- [ ] `Pin to Login Page`

2. Click 'Submit' and assert that the error message reads :

`Must pin as study query, to dashboard, or to the login page.'
  
3. Check the `Pin Study Query` checkbox and click the submit button and assert that the query is now pinned at the top of the page in the `Study Queries` panel.

4. Go to LORIS main page by clicking the **LORIS** name in the top-left corner and assert that the query is **not** displayed inside the right-side `Study Queries` panel

5. Now go back to the module and create a new named pinned query, only checking the `Pin Dashboard Summary` this time. Assert that the query is **not** pinned at the top of the page in the `Study Queries` panel.

6. Assert that the query is displayed inside the right-side `Study Queries` panel

7. Click the pinned query. Assert that the confirmation message `Loaded Query` is displayed and query can immediately be executed.

8. Try pinning a query with `Pin Study Query`, `Pin Dashboard Summary` and `Pin to Login Page` options.
Assert that `Study Queries` in the dataquery module **and** `Study Queries` in LORIS welcome page **and** `Data in LORIS` on the LORIS Login Page are displayed.

9. Assert that the query is now pinned at the top of the page, in `Study Queries` panel.

10. Assert that: `starred queries` are available in the right side `Starred Queries` panel.

11. Assert that: clicking on any `starred query` sends you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

12. Assert that: clicking on any `study query` sends you back to the dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

## Fields selection

1. Click `Next Steps` at the bottom right hand side of the page, and, in the next page, under `Available Fields`, select`Candidate Identifiers`. Assert that default visits fields for this category are loaded.

2. Assert that clicking on a candidate-level field such as `CandID` or `PSCID` only highlights the line and does **not** add visit information on the same line.

3. Assert that clicking `Add all` button adds all displayed fields in the right column.

4. Assert that clicking `Remove all` button removes all selected fields from the right column.

5. Assert that clicking `Remove all` button another time with no selected fields does nothing.

6. Enter some text in the `Filter within category` field

7. Assert that clicking `Add all` button only adds the displayed filtered fields in the right column.

8. Assert that clicking `Add all` button another time does nothing

9. Remove all selected fields from right column.

10. Remove text from fields filter bar.

11. Click the `Add all` button and assert that clicking the `Clear` button in the `Selected Fields` column effectively clears all selected fields.

12. Click the `Add all` button again and assert that clicking the `trashbin icon` in the `Selected Fields` column effectively removes the selected field **and** deselects the active selection in the main table.

13. Assert that clicking some selected fields in the main table (greyed-out lines in the table) also remove them from the selected column (toggle interaction).

## Other Parameters

Select the `Other parameters` field category in the top dropdown bar.

1. Assert that default visits fields for this category are loaded.

2. Assert that clicking on a field such as `VisitLabel` or `Project` greys the line **and** adds visit information on the same line.

3. Assert that removing visits from `Default Visits` allows to reselect them, either by clicking the right arrow, or by entering corresponding text in the text area.

## Sync not sync

[ ] uncheck `Sync with selected fields` and add all visits from `Default Visits` box. Then click some fields in the list so that theyj are greyed out.

1. Assert that selected fields each have a visit selection box.

2. Assert that all visits displayed in the field lines are the same as those in the `Default Visits` box.

3. Assert that all visits are described in the selected fields in the right column.

Remove some visits from `Default Visits` box and click on `Other Fields`.

4. Assert that new field visits only reflects what the `Default Visits` box is showing.

5. Assert that the newly selected fields in the right column have the new default visits.

6. Check `Sync with selected field` checkbox and assert that all fields match the default.

7. Make sure the `Selected Fields` are still updateable by ex-ing out visits in the main table.

## Filters

Click on `Add Filters` in `Next Steps` and make sure no filter is already selected.

1. Assert that the sentence `Currently querying for ALL candidates` should be displayed under the light-blue notification.

2. Assert the light-blue notification saying `Note that only candidates which you have permission to access in LORIS are included in results. Number of results may vary from other users running the same query' is there`.

3. Assert that a preview of the number of candidates matched is displayed in the top-right hand corner.

4. Make sure that the `Add Condition` button triggers field select modal.

Add a field as a filter

5. Assert that the condition now appears in the filter list.

Select your filter, and enter your condition, and click `Submit`. 

6. Assert that: `Add Condition` and `Import from CSV` buttons are now replaced by `Add "and" condition` and `Add "or" condition`.

7. Assert that the top-right corner is updated.

8. Remove the added conditions with the trashbin icon on the right.

9. Assert that `Import from CSV` button features an upload modal.

10. Assert that: sending something different than CSV ends with an `Invalid <Something>` alert.

11. Test file import by creating and importing different files with the preset options (candidates vs. sessions, DCCID vs. PSCID, with or without headers).

Make several queries with various operators (AND/OR) and depths (condition groups)
12. Assert that these operators are working.

## Run query page

Click on the `Run query` button.

1. Assert that the message `Query not yet run` is displayed when page loads.
2. Assert that changing the `header display format` dropdown immediately changes the table header.
3. Assert that changing the `Display visits as` dropdown immediately changes the table organization.
4. Assert that `Display visits as = inline values (no download)` has a `Display empty visits?` checkbox.
5. Make sure the checkbox updates the table.
6. Assert that the `Download table as CSV` button triggers the file download with the right information in it.
7. Assert that the table pagination buttons work.
8. Assert that the table maximum number of rows per page dropdown modifies the number of displayed rows.