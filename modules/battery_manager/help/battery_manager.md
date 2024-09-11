# Battery Manager
The Battery Manager module serves as a front-end for manipulating the Test Battery.
This includes browsing, adding, editing, activating, and deactivating entries.

## Searching for an entry in the Test Battery
Use the `Selection Filters` to search for entries by fields such as:
`Instrument`,
`Minimum age (days)`,
`Maximum age (days)`,
`Stage`,
`Cohort`,
`Visit Label`,
`Site`,
`First Visit`,
`Instrument Order`,
`Active`.
As filters are selected, the data table below will dynamically update with relevant results.
Click the **Clear Filters** button to reset all filters.

Within the data table, results can be sorted in ascending or descending order by 
clicking on any column header.

## Adding an entry to the Test Battery
Clicking the `New Test` button, you can add a new entry to the Test Battery.
You can specify information about the entry by using the searchable dropdowns, dropdown menus, and numeric text fields.
You will have to fill out the required fields `Instrument`, `Minimum age (days)`, `Maximum age (days)`, and `Stage`.
Finally, press the **Add entry** button to add the entry to the Test Battery.
You cannot add an entry if it has a duplicate entry in the Test Battery.

*For more information on the behaviour of each parameter refer to the [Behaviour of Parameters](#behaviour-of-parameters) section of this document*

## Editing an entry in the Test Battery
You can edit an entry by clicking on the `Edit` link in the `Edit Metadata` column of the Menu Table.
The link will display a form that is populated with the values of the entry.
You can update information in the form by selecting from the dropdown menus and filling in the numeric text fields.
You will have to fill out the required fields `Instrument`, `Minimum age (days)`, `Maximum age (days)`, `Stage`, and `Active`.
Finally, press the **Submit** button to edit the entry in the Test Battery.
This will create a new Test with the information supplied, and deactivate the Test that was edited.
You cannot edit an entry if you make no changes in the form.
You cannot edit an entry if it becomes the same as another active entry in the Test Battery.

*For more information on the behaviour of each parameter refer to the [Behaviour of Parameters](#behaviour-of-parameters) section of this document*

## Activating/Deactivating an entry in the Test Battery

### Change status (Activate/Deactivate)
You can change the status of an entry by clicking on the **Activate** or
**Deactivate** button on the `Change Status` column of the Menu Table, to directly change the status of an entry.

### Add tab (activate)
Clicking the `Add` tab, you can add an entry that already exists in the Test
Battery but has been deactivated. A pop-up will appear that will give you
the option to activate the existing entry.

### Edit window (Activate/Deactivate)
For a given entry in the Menu table and click on `Edit`.
In the `Edit` window, edit an entry and make sure the new entry has no duplicate in the Test Battery.
This will add the new entry to the table and deactivate the original one.
Alternatively, if you edit an entry so that it becomes the same as another deactivated entry in the Test Battery,
a pop-up will appear that will give you the option to activate the other entry and deactivate the original one.

## Behaviour of Parameters

### Cohort: 
   - If the test battery entry does NOT have a `cohortID` 
   (`cohortID=NULL`), the instrument gets administered to ALL cohorts.
   - If the test battery entry has a `cohortID` set and the `cohortID`
   matches the one of the timepoint, the instrument is administered only to 
   that cohort.

### Stage: 
   - If the test battery entry has a `stage` set and the `stage` matches the 
   one of the timepoint, the instrument is administered at that stage.

### Center:
   - If the test battery entry does NOT have a `CenterID` (`CenterID=NULL`), 
   the instrument gets administered at ALL centers.
   - If the test battery entry has a `CenterID` set and the `CenterID` matches
   the one of the timepoint, the instrument is administered at that CenterID.

### AgeMinDays/AgeMaxDays:
   - If the test battery entry has `AgeMinDays` and `AgeMaxDays` set, and they
   are both set to `0`, the instrument gets administered at ALL ages;
   - If the test battery entry has `AgeMinDays` and `AgeMaxDays` set, and they
   are set to any value other than `0`, the instrument gets administered IF AND
   ONLY IF the age of the candidate at the timepoint is between `AgeMinDays` 
   and `AgeMaxDays`;

### VisitLabel:
   - If the test battery entry does NOT have a `Visit_label`
   (`Visit_label=NULL`), the instrument gets administered IF AND ONLY IF no
   other test battery entries matches the timepoint's visit label and
   cohort.
   - If the test battery entry has a `Visit_label` set and the `Visit_label`
   matches the one of the timepoint, the instrument is administered at that
   Visit.
   - **NOTE:** *In order to administer an instrument at all visits without
   defining each visit individually in the battery, the test battery table
   should NOT contain any entries for the cohort/visit_label combination
   of the timepoint. If the timepoint's cohort/visit_label combination
   has a specified set of instruments defined in the test_battery, all entries
   of the battery with no visit labels (`Visit_label=NULL`) will be ignored.*
   
 ### FirstVisit:
   - If `firstVisit` is set to `Y`, the test battery instance is applied
   only if it is the first visit.
   - If `firstVisit` is to `N`, the test battery instance is applied only if it
   *not* the first visit.
   - If `firstVisit` is set to null, the test battery instance is applied to any
   visit.
   - **NOTE:** *The `firstVisit` flag can allow to bypass all other rules in
   some instances. In these instances, the `stage`, `CenterID`, `Visit_label`,
   `AgeMinDays` and `AgeMaxDays` will not affect in any way the administration
   of the instrument. Only the `cohortID` value will impact if the
   instrument gets administered or not; the `cohortID` value must match
   the timepoint's in order for the instrument to be administered in these
   instances.*
