# Instrument List Test Plan

1. Verify that in order to access the module, the user must either have the `Across all sites access candidate profiles` permission, or be at the same site as the visit, or at the same site as one of the candidate's other visits.
2. Verify that in order to update the current `Stage` status, the user requires `Data entry` permissions, and must be at the proper site. Exception: if the current `Stage` status is `Approval`, then only the `Behavioural QC` permission is necessary to update the `Stage` status.
3. Verify that each instrument in the list directs to the corresponding instrument page.
4. Verify that the flags' values (Data Entry, Administration, Feedback, Double Data Entry Form, Double Data Entry Status) for each instrument in the list are showing up appropriately.
5. Verify that `Double Data Entry` is available if it is enabled for that instrument, and that there is no link if it is not enabled.
6. Verify that the meta data for the candidate/timepoint is correct - eg DoB, Sex, Visit Label, Visit Status, etc. Verify that the values are correct for `Within Optimal` visit window and `Within Permitted` visit window, by consulting the `Visit_Windows` table of the database.
7. Verify that BVL QC flags (`BVL QC Type` and `BVL QC Status`) are working and only available if the user has the `Behavioural QC` permission.
8. Verify that `Stage` can only be set after data entry (and DDE if applicable) is complete, and conflicts are resolved.
9. Verify that if the current `Stage` is `Not Started`, `Start Next Stage` is available (provided that it's a valid Timepoint).
10. Verify that `Send to DCC` is only available after Visit is marked as Pass/Failure/Withdrawal, and if the user has the `Send to DCC` permission.
11. Verify that `Reverse Send from DCC` permission is necessary to unsend to DCC.
12. Verify that breadcrumbs work.

