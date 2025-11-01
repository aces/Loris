# Data Query Test Plan : Part 1

- [Data query load](#data-query-load)
- [Panels](#panels)
- [Recent queries](#recent-queries)
- [Icons](#icons)
- [Pin](#pin)

## Setup

- Create a user with one site and one project, for example: Rome, Pumpernickel
- Create a second user with more than one site and more than one project
- **Perform all of the tests with the first user, then, repeat with the second user**

## Set the following basic permissions

- [x] Access Profile: View/Create Candidates and Timepoints - Own Sites 
- [x] Data Dictionary: View Parameter Type Descriptions
- [x] Data Query Tool: View/Download Cross-Modality Data

## Data query load

- Remove the following permission :
- [x] Data Query Tool: View/Download Cross-Modality Data

1. Assert that the dataquery module does **not** load.

## Panels

- Re-enable the following permission :
- [x] Data Query Tool: View/Download Cross-Modality Data

1. Assert that the following panels collapse and open :

   - Instructions
   - Recent Queries
   - Next Steps (in the bottom-right corner)

2. Assert that `Continue to Define Fields` button in the main panel, and `Choose Fields` button in the `Next Steps` panel are redirecting to the same page.

## Recent Queries

1. Assert that the queries you made have their fields and filters correctly displayed
2. Assert that `text filter` immediately filters the queries.
3. Assert that clicking `Collapse queries` effectively collapses all queries.

## Icons

- Performing the following actions:
- `Star`: should have a yellow star
- `Name` a query
- `Share` should have a blue shared state
- `Rerun` a query

1. Assert that using the `Starred Only` checkbox filter only keeps the starred ones.
2. Assert that removing the `Starred Only` checkbox prints the same queries originally printed.
3. Assert that using the `Shared only` checkbox filter only keeps the shared ones
4. Assert that the  `Named Only` checkbox filter only keeps the Named ones.
5. Assert that the 'No run times' checkbox filter only keeps the `No run times`
6. Assert that mixing checkboxes returns the right query selection. Only queries that match all of the checked conditions should be displayed.
7. Remove all pinned queries and assert that there is no `Study Queries` panel at the top of the page.

## Pin

**You will need `admin` permission for the following tests.

- Click the `Pin` icon to perform the following tests 

1. With the `query name` text field empty, click the `Submit` button and assert that the error message reads:

   `Must provide a query name to pin query as.`
2. Enter a query name and uncheck the following:

   - [ ] `Pin Study Query`
   - [ ] `Pin Dashboard Summary`
   - [ ] `Pin to Login Page`

3. Click 'Submit' and assert that the error message reads : `Must pin as study query, to dashboard, or to the login page.`
4. Check the following box [x]`Pin Study Query`

   - click the submit button and assert that the query is now pinned at the top of the page in the `Study Queries` panel
5. Go to LORIS main page by clicking the **LORIS** name in the top-left corner

   - assert that the query is **not** displayed inside the right-side `Study Queries` panel
6. Return to the module's splash page and pin a query, only checking the `Pin Dashboard Summary`

   - Assert that the query is **not** pinned at the top of the page in the `Study Queries` panel
7. Assert that the query is displayed inside the `Study Queries` panel on the right side
8. Click the pinned query. Assert that `Loaded Query` is displayed.
9. Pin a query with `Pin Study Query`. Assert the selected query is displayed in **both** the dataquery module Study Query Section and in the LORIS login page.
10. `Pin Dashboard Summary` and `Pin to Login Page` options.
   -  Assert that `Study Queries` in the dataquery module **and** `Study Queries` in LORIS welcome page **and** `Data in LORIS` on the LORIS Login Page are displayed.

   - Assert that the query is now pinned at the top of the page, in `Study Queries` panel.

11. Assert that: `starred queries` are available in the right side `Starred Queries` panel.

12. Assert that: clicking on any `starred query` sends you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

13. Assert that: clicking on any `study query` sends you back to the dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).
