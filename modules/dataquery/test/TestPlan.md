# Data Query - Test Plan

## Table of Contents

1. [Setup](#setup)
2. [Test Data Query Permission](#test-data-query-view-permission)
3. [Panel Tests](#panel-tests)
4. [Recent Queries Panel Tests](#recent-queries-panel-tests)
5. [Pin Tests](#pin-tests)
6. [Fields Selection page](#fields-selection-page)
7. [Run Query Page](#run-query-page)

## Setup

Sign into your loris instance with an **admin** account.

- select Admin Accounts and click the Add User button.
- enter all required information.
- select *ONE* site for example, "Rome".
- select *ONE* project, for example Pumpernickel.
- Tick box:Roles/Access Profile: View/Create Candidates and Timepoints - Own Sites.

**This permission ensures that ONLY candidates who share the same site as your user are listed (in this case "Rome").**

## Test Data Query View Permission

Ensure the module loads only for a user that has the **dataquery_view** permission. They must also have access to the dictionary module.

## Panel Tests

### Test Panel Collapse

- **Instructions** panel:

click to open and click again to collapse ETCETC, `Recent Queries` panel, and `Next Steps` panel (bottom-right corner) collapse as expected.

### Test Panel Redirect

- Assert `Continue to Define Fields` button in the main panel, and `Choose Fields` button in the `Next Steps` panel are redirecting to the same page.

## Recent Queries Panel Tests

Perform the following assertions: (If no queries are available, add some).

- that queries you made have their parameters correctly displayed (i.e. fields and filters).

- that `text filter` immediately filter the queries.

- that clicking `Collapse queries` effectively collapses all queries.

- Make a mix of the following actions

   - `Star`: should have a yellow star

   - `Name` some queries

   - `Share` should have a blue shared state

   - `Rerun` some queries

- that using the `Starred Only` checkbox filter only keeps the starred ones.

- that removing the `Starred Only` checkbox prints the same queries originally printed.

- Repeat 3.5. and 3.6. for `Shared Only`, `Named Only` and `No run times` checkboxes.

- Assert that mixing checkboxes returns the right query selection. Only queries that match all of the checked conditions should be displayed.

- Remove all pinned queries and that there is no `Study Queries` panel at the top of the page.

### If all of these actions work, then this test is successful

## Pin Tests

Click the `Pin` icon to perform the following tests (ensure that you have 'admin' permission):

- With the `query name` text field empty, click the `Submit` button and assert that the error message reads: 
   >`Must provide a query name to pin query as.'

- [ ] Uncheck `Pin Study Query`, `Pin Dashboard Summary` and `Pin to Login Page` and click 'Submit'.
Assert that the error message reads :

>`Must pin as study query, to dashboard, or to the login page.'
  
- Check the `Pin Study Query` checkbox and click the submit button and assert that the query is now pinned at the top of the page in the `Study Queries` panel.

- Go to LORIS main page by clicking the **LORIS** name in the top-left corner and assert that the query is **not** displayed inside the right-side `Study Queries` panel

## Now go back to the module

- Create a new named pinned query, only checking the `Pin Dashboard Summary` this time. Assert that the query is **NOT** pinned at the top of the page in the `Study Queries` panel.<br>
- Go to LORIS main page by clicking the `LORIS` name in the top-left corner. Assert that: the query is displayed inside the right-side `Study Queries` panel.
- Click the pinned query. Assert that: the confirmation message `Query loaded` is displayed and query can immediately be executed.
- Try pinning a query with `Pin Study Query`, `Pin Dashboard Summary` and `Pin to Login Page` options.
- Assert that: `Study Queries` in the dataquery module **AND** `Study Queries` in LORIS welcome page **AND** `Data in LORIS` on the LORIS Login Page are displayed.
- Assert that: the query is now pinned at the top of the page, in `Study Queries` panel.

## Now go back to LORIS main page

- Assert that: `starred queries` are available in the right side `Starred Queries` panel.
- Assert that: clicking on any `starred query` send you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).
- Assert that: `pinned queries` are available in the right side `Study Queries` panel.
- Assert that: clicking on any `study query` sends you back to the dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

## Fields selection page

### No visits

- Select the `Candidate Identifiers` field category in the top dropdown bar and:<br> 
- Assert that default visits are loaded, fields for this category are loaded.
- Assert that clicking on a candidate-level field such as `CandID` or `PSCID` only highlights the line **and does not** add visit information on the same line.
- Assert that: clicking `Add all` button adds all displayed fields in the right column.
- Assert that: clicking `Remove all` button removes all selected fields from the right column.
- Assert that: clicking `Remove all` button another time with no selected fields does nothing.
- Enter some text in the fields search bar with `Filter within category` placeholder.
- Assert that: clicking `Add all` button only adds the displayed filtered fields in the right column.
- Assert that: clicking `Add all` button another time does nothing
- Remove all selected fields from right column.
- Remove text from fields filter bar.

Click the `Add all` button.

- Assert that: clicking the `Clear` button in the `Selected Fields` column effectively clears all selected fields.

Click the `Add all` button again.

- Assert that: clicking the `trashbin icon` in the `Selected Fields` column effectively removes the selected field **AND** the active selection in the main table.
- Assert that: clicking some selected fields in the main table (grey-ish lines in the table) also remove them from the selected column (toggle interaction).

## Visits

Select the `Other parameters` field category in the top dropdown bar.

- Assert that: default visits are loaded, fields for this category are loaded.
- Assert that: clicking on a field such as `VisitLabel` or `Project` greys the line **AND** adds visit information on the same line.
- Assert that: removing visits from `Default Visits` allows to reselect them, either by clicking the right arrow, or by entering corresponding text in the text area.
- Make sure the `Sync with selected fields` is **NOT** checked out.
- Add all visits from `Default Visits` box.
- Click some fields in the list.
- Assert that: selected fields should have a visit selection box each.
- Assert that: all visits should be displayed in the field lines (same as those ni the `Default Visits` box).
- Assert that: all selected fields in the right column have all visits described.

Remove some visits from `Default Visits` box and click on 'other fields'.

- Assert that: new field visits only reflects what the `Default Visits` box is showing.
- Assert that: new selected fields in the right column only have the newly default visits.
- Check `Sync with selected field` checkbox.
- Assert that: fields that were previously with all visits now are only with the selected visits in `Default Visits`.
- Make sure field visits are still updatable independently (line by line).
- Make sure if `Default Visits` are changed, it affects all fields.

   **if all of these actions work, then this test is successful**

## Filters selection page (csv format ??)

- Make sure no filter is already selected. The sentence `Currently querying for ALL candidates` should be displayed.
- Make sure the blue notification saying 'Note that only candidates which you have permission to access in LORIS are included in results. Number of results may vary from other users running the same query' is there.
- Make sure that a preview of the number of candidates matched is displayed in the top-right hand corner.
- Make sure that the `Add Condition` button triggers field select modal.
   - Add a field as a filter.
   - Assert that: the condition now appears in the filter list.
   - Assert that: `Add Condition` and `Import from CSV` buttons are now replaced by `Add "and" condition` and `Add "or" condition`.
- Assert that: the top-right corner is updated.
- Remove added conditions with the trashbin icon on the right.
- Make sure `Import from CSV` button feature an upload modal.
   - Assert that: sending something different than CSV ends with an `Invalid CSV` alert.
   - Test file import by creating and importing different files with the preset options (candidates vs. sessions, DCCID vs. PSCID, with or without headers).
- Ensure conditions are organized by making several queries with various operators (AND/OR) and depths (condition groups).
- Click on `Run query` button.

<br>

## Run query page

   - Assert that: the message `Query not yet run` is displayed when page loads.
   - Assert that: changing the `header display format` dropdown immediately changes the table header.
   - Assert that: changing the `Display visits as` dropdown immediately changes the table organization.
   - Assert that: `Display visits as = inline values (no download)` has a `Display empty visits?` checkbox.
   - Make sure the checkbox update the table.
   - Assert that: the `Download table as CSV` button triggers the file download with the right information in it.
   - Assert that: table pagination buttons work.
   -Assert that: table maximum number of rows per page dropdown modifies the number of displayed rows.

