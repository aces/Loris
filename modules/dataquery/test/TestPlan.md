# Data Query - Test Plan

## Welcome page

1. Ensure the module loads only for a user that has the `dataquery_view` permission.
2. Assert that: `Instructions` panel, `Recent Queries` panel, and `Next Steps` panel (bottom-right corner) collapse as expected.
3. Assert that: `Continue to Define Fields` button in the main panel, and `Choose Fields` button in the `Next Steps` panel are redirecting to the same page.
4. `Recent Queries` panel
   1. If not queries are available, make some so they will be added to this section.
   2. Assert that: queries you made have their parameters correctly displayed (i.e. fields and filters).
   3. Assert that: `text filter` immediately filter the queries.
   4. Assert that: clicking `Collapse queries` effectively collapse all queries.
   5. Make a mix of the following action on different queries: `Star` some queries, `Name` some queries, `Share` some queries, `Rerun` some queries.
   6. Assert that: starred queries have a yellow star, shared queries have a blue shared state.
   7. Assert that using the `Starred Only` checkbox filter only keep the starred one.
   8. Assert that removing the `Starred Only` checkbox prints the same queries originally printed.
   9. Repeat 3.5. and 3.6. for `Shared Only`, `Named Only` and `No run times` checkboxes.
   10. Assert that: mixing checkboxes returns the right query selection. Only queries that match all of the checked conditions should be displayed.
   11. Remove all pinned queries.
   12. Assert that: there is no `Study Queries` panel at the top of the page.
   13. Click the `Pin` icon to pin some queries.
      1. With and empty text in the `query name` text field, click the `Submit` button.
      2. Assert that: the error message `Must provide a query name to pin query as.` is triggered.
      3. Unchecking all checkboxes (i.e. `Pin Study Query` and `Pin Dashboard Summary`).
      4. Assert that: clicking `Submit` triggers the error message `Must pin as study query or pin to dashboard.`.
      5. Check the `Pin Study Query` checkbox and click the submit button.
      6. Assert that: the query is now pinned at the top of the page in the `Study Queries` panel.
      7. Go to LORIS main page by clicking the `LORIS` name in the top-left corner.
      8. Assert that: the query is **NOT** displayed inside the right-side `Study Queries` panel.
      9. Go back to the module.
      10. Create a new named pinned query, only checking the `Pin Dashboard Summary` this time.
      11. Assert that: the query is **NOT** pinned at the top of the page in the `Study Queries` panel.
      12. Go to LORIS main page by clicking the `LORIS` name in the top-left corner.
      13. Assert that: the query is displayed inside the right-side `Study Queries` panel.
      14. Click the pinned query.
      15. Assert that: the confirmation message `Query loaded` is displayed and query can immediately be executed.
      16. Try pinning a query with both `Pin Study Query` and `Pin Dashboard Summary` options.
      17. Assert that: both `Study Queries` in the dataquery module **AND** `Study Queries` in LORIS welcome page are displayed.
   14. Assert that: the query is now pinned at the top of the page, in `Study Queries` panel.
   15. Go back to `LORIS main page`.
   16. Assert that: `starred queries` are available in the right side `Starred Queries` panel.
   17. Assert that: clinking on any `starred query` send you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).
   18. Go back to `LORIS main page`.
   19. Assert that: `pinned queries` are available in the right side `Study Queries` panel.
   20. Assert that: clinking on any `study query` send you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

## Fields selection page

### No visits

1. Select the `Candidate Identifiers` field category in the top dropdown bar.
2. Assert that: default visits are loaded, fields for this category are loaded.
3. Assert that: clicking on a candidate-level field such as `CandID` or `PSCID` only highlights the line **AND DOES NOT** add visit information on the same line.
4. Assert that: clicking `Add all` button adds all displayed fields in the right column.
5. Assert that: clicking `Remove all` button removes all selected fields from the right column.
6. Assert that: clicking `Remove all` button another time with no selected fields does nothing.
7. Enter some text in the fields search bar with `Filter within category` placeholder.
8. Assert that: clicking `Add all` button only adds the displayed filtered fields in the right column.
9. Assert that: clicking `Add all` button another time does nothing
10. Remove all selected fields from right column.
11. Remove text from fields filter bar.
12. Click the `Add all` button.
13. Assert that: clicking the `Clear` button in the `Selected Fields` column effectively clears all selected fields.
14. Click the `Add all` button.
15. Assert that: clicking the `trashbin icon` in the `Selected Fields` column effectively removes the selected field **AND** the active selection in the main table.
16. Assert that: clicking some selected fields in the main table (grey-ish lines in the table) also remove them from the selected column (toggle interaction).

### Visits

1. Select the `Other parameters` field category in the top dropdown bar.
2. Assert that: default visits are loaded, fields for this category are loaded.
3. Assert that: clicking on a field such as `VisitLabel` or `Project` greys the line **AND** adds visit information on the same line.
4. Assert that: removing visits from `Default Visits` allows to reselect them, either by clicking the right arrow, or by entering corresponding text in the text area.
5. Make sure the `Sync with selected fields` is **NOT** checked out.
6. Add all visits from `Default Visits` box.
7. Click some fields in the list.
8. Assert that: selected fields should have a visit selection box each.
9. Assert that: all visits should be displayed in the field lines (same as those ni the `Default Visits` box).
10. Assert that: all selected fields in the right column have all visits described.
11. Remove some visits from `Default Visits` box.
12. Click on other fields.
13. Assert that: new field visits only reflects what the `Default Visits` box is showing.
14. Assert that: new selected fields in the right column only have the newly default visits.
15. Check `Sync with selected field` checkbox.
16. Assert that: fields that were previously with all visits now are only with the selected visits in `Default Visits`.
17. Make sure field visits are still updatable independently (line by line).
18. Make sure if `Default Visits` are changed, it affects all fields.


## Filters selection page

1. Make sure no filter are already selected. The sentence `Currently querying for ALL candidates` should be displayed.
2. Make sure the blue notification saying `Note that only candidates which you have permission to access in LORIS are included in results. Number of results may vary from other users running the same query.` is there.
3. Make sure a preview of the number of candidates matched is displayed in the top-right hand corner.
4. Make sure the `Add Condition` button triggers field select modal.
   1. Add a field as a filter.
   2. Assert that: the condition now appears in the filter list.
   3. Assert that: `Add Condition` and `Import from CSV` buttons are now replaced by `Add "and" condition` and `Add "or" condition`.
   4. Assert that: the top-right corner is updated.
5. Remove added conditions with the trashbin icon on the right.
6. Make sure `Import from CSV` button feature an upload modal.
   1. Assert that: sending something different than CSV ends with an `Invalid CSV` alert.
   2. Test file import by creating and importing different files with the preset options (candidates vs. sessions, DCCID vs. PSCID, with or without headers).
7. Ensure conditions are organized by making several queries with various operators (AND/OR) and depths (condition groups).
8. Click on `Run query` button.


## Run query page

1. Assert that: the message `Query not yet run` is displayed when page loads.
2. Assert that: changing the `header display format` dropdown immediately changes the table header.
3. Assert that: changing the `Display visits as` dropdown immediately changes the table organization.
4. Assert that: `Display visits as = inline values (no download)` has a `Display empty visits?` checkbox.
5. Make sure the checkbox update the table.
6. Assert that: the `Download table as CSV` button triggers the file download with the right information in it.
7. Assert that: table pagination buttons work.
8. Assert that: table maximum number of rows per page dropdown modifies the number of displayed rows.

