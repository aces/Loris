# Data Query Test Plan : Part 2

- [Fields selection](#fields-selection)
- [Other parameters](#other-parameters)
- [Sync not sync](#sync-not-sync)
- [Filters](#filters)
- [Run query](#run-query)

## Setup

- Create a user with one site and one project, for example: Rome, Pumpernickel
- Create a second user with more than one site and more than one project
- **Perform all of the tests with the first user, then, repeat with the second user**

## Fields selection

- Click `Next Steps`
- In the page that subsequently loads, and under `Available Fields`, select `Candidate Identifiers`

1. Assert that the default visits fields for this category are loaded.
2. Assert that by clicking on `CandID` or `PSCID` only the lineis highlighted. More specifically, assert **not** add visit information to the same line.
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

- Select the `Other parameters` field category in the top dropdown bar.

1. Assert that default visits fields for this category are loaded.
2. Assert that clicking on a field such as `VisitLabel` or `Project` greys the line **and** adds visit information on the same line.
3. Assert that removing visits from `Default Visits` allows you to reselect them, either by clicking the right arrow, or by entering corresponding text in the text area.

## Sync not sync

- [ ] uncheck `Sync with selected fields` and add all visits from `Default Visits` box. Then click some fields in the list so that they are greyed out

1. Assert that selected fields each have a visit selection box.
2. Assert that all visits displayed in the field lines are the same as those in the `Default Visits` box
3. Assert that all visits are described in the selected fields in the right column
4. Remove some visits from `Default Visits` box and click on `Other Fields`
   - Assert that new field visits only reflects what the `Default Visits` box is showing
5. Assert that the newly selected fields in the right column have the new default visits
6. Check `Sync with selected field` checkbox and assert that all fields match the default
7. Make sure the `Selected Fields` are still updateable by ex-ing out visits in the main table

## Filters

Click on `Add Filters` in `Next Steps` and make sure no filter is already selected

1. Assert that the sentence `Currently querying for ALL candidates` should be displayed under the light-blue notification
2. Assert the light-blue notification saying `Note that only candidates which you have permission to access in LORIS are included in results. Number of results may vary from other users running the same query` is there
3. Assert that a preview of the number of candidates matched is displayed in the top-right hand corner
4. Make sure that the `Add Condition` button triggers field select modal
5. Add a field as a filter
    - Assert that the condition now appears in the filter list
6. Select your filter, and enter your condition, and click `Submit`
   - Assert that: `Add Condition` and `Import from CSV` buttons are now replaced by `Add "and" condition` and `Add "or" condition`
7. Assert that the top-right corner is updated
8. Remove the added conditions with the trashbin icon on the right

## CSV

1. Assert that `Import from CSV` button features an upload modal
2. Assert that: sending something different than CSV ends with an `Invalid <Something>` alert.
3. Test file import by creating and importing different files with the preset options (candidates vs. sessions, DCCID vs. PSCID, with or without headers).
Make several queries with various operators (AND/OR) and depths (condition groups)
4. Assert that these operators are working

## Run query

Click on the `Run query` button.

1. Assert that the message `Query not yet run` is displayed when page loads
2. Assert that changing the `header display format` dropdown immediately changes the table header
3. Assert that changing the `Display visits as` dropdown immediately changes the table organization
4. Assert that `Display visits as = inline values (no download)` has a `Display empty visits?` checkbox
5. Make sure the checkbox updates the table
6. Assert that the `Download table as CSV` button triggers the file download with the right information in it.
7. Assert that the table pagination buttons work
8. Assert that the table maximum number of rows per page dropdown modifies the number of displayed rows