# Next Stage - Test Plan
1. Create a new candidate and create new timepoint for them.
   [Manual Testing]
2. Click "Start Visit Stage" on left of `instrument_list` ensure that page
   renders.
   [Manual Testing]
3. Ensure that stage can only be started with the `data_entry` permission
   and for candidates at the user's site.
   [Automation Testing]
4. Ensure that you get an error if dates do not match.
   [Automation Testing]
5. Ensure that you get an error if `scan_done` missing
   [Manual Testing]
6. Create a timepoint where the age (date entered minus DoB) falls within the
   AgeMin and AgeMax for a `test_battery`. The `test_battery` needs to have a 
   matching `subprojectID` and a NULL `Visit_label`. Ensure that those 
   instruments are inserted.
   [Manual Testing]
7. Create a timepoint where there is a `test_battery` entry for the
   `Visit_label` and `subprojectID`, and start the stage. Ensure that those 
   were inserted into the battery, and NOT the ones based on age (when 
   `Visit_label` is NULL).
   [Manual Testing]
8. Ensure that any instruments in `test_battery` with firstVisit='Y' where
   inserted if and only if it's the first timepoint started. Ensure that
   firstVisit='N' instruments are inserted if and only if it is NOT the
   first timepoint started, and firstVisit=null whether or not it's the
   first time point.
   [Manual Testing]
9. Ensure that if a CenterID is set for a row in the test battery, the
   instrument is inserted for candidates at that centerID (if `Age` is 
   correct and `Visit_label` is NULL or identical to the timepoint's one), 
   and not other centers.
   [Manual Testing]
10. Ensure that if Active='N' for an instrument in the `test_battery` it is
   NOT inserted even if other criteria pass.
   [Manual Testing]
