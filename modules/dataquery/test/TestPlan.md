# Data Query - Test Plan

## Welcome page

Make sure all displayed components are working as expected.

1. `Instructions` panel, `Recent Qeuries` panel, and `Next Steps` panel (bottom-right corner) collapse as expected.
2. `Continue to Define Fields` button in the main panel, and `Choose Fields` button in the `Next Steps` panel are redirecting to the same page.
3. `Recent Queries` panel
   1. If not queries are available, make some so they will be added to this section.
   2. Assert that: queries you made have their parameters correctly displayed (i.e. fields and filters).
   3. Asset that: `text filter` immediately filter the queries.
   4. Assert that: clicking `Collapse queries` effectively collapse all queries.
   5. Make a mix of the following action on different queries: `Star` some queries, `Name` some queries, `Share` some queries, `Rerun` some queries.
   6. Assert that: starred queries have a yellow star, shared queries have a blue shared state.
   7. Assert that using the `Starred Only` checkbox filter only keep the starred one.
   8. Assert that removing the `Starred Only` checkbox prints the same queries oringinally printed.
   9. Repeat 3.5. and 3.6. for `Shared Only`, `Named Only` and `No run times` checkboxes.
   10. Assert that: mixing checkboxes returns the right query selection.
   11. Remove all pinned queries.
   12. Assert that: there is no `Study Queries` panel at the top of the page.
   13. `Pin` some queries.
   14. Assert that: the query is now pinned at the top of the page, in `Study Queries` panel.
   15. Go back to `LORIS main page`.
   16. Assert that: `starred queries` are available in the right side `Starred Queries` panel.
   17. Assert that: clinking on any `starred query` send you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).
   18. Go back to `LORIS main page`.
   19. Assert that: `pinned queries` are available in the right side `Study Queries` panel.
   20. Assert that: clinking on any `study query` send you back to dataquery module with the selected query loaded (bottom-right panel already with the `Run Query` button active).

## Fields selection page

## Filters selection page

## Shared queries

