# Battery Manager

The Battery Manager module serves as a front-end for browsing, adding, editing, and activating/deactivating entries in the Test Battery.

## Searching for an entry in the Test Battery

Under the `Browse` tab, use the `Selection Filters` to search for files by fields such 
as `Instrument`, `Minimum age (days)`, `Maximum age (days)`, `Stage`, `Subproject`, `Visit Label`,
`Site`, `First Visit`, `Instrument Order`, and `Active`. As filters are selected, the data table below will
dynamically update with relevant results. Click the “Clear Filters”
button to reset all filters.

Within the data table, results can be sorted in ascending or descending order by 
clicking on any column header.

## Adding an entry to the Test Battery

Under the `Add` tab, you can add a new entry to the Test Battery.
You can specify information about the entry by:
- Using the searchable dropdowns for `Instrument` and `Site`.
- Selecting from the dropdown menus for `Stage`, `Subproject`, `Visit Label`, and `First Visit`.
- Filling in the numeric text fields for `Minimum age (days)`, `Maximum age (days)`, and `Instrument Order`.
You will have to fill out the required fields `Instrument`, `Minimum age (days)`, `Maximum age (days)`, and `Stage`.
Finally, press the **Add entry** button to insert the entry into the Test Battery.

You cannot add an entry if it has a duplicate entry in the test battery.

## Editing an entry to the Test Battery

Under the `Browse` tab, you can edit an entry in the Test Battery by clicking on the `Edit` link in the `Edit Metadata` column of the Menu Table.
The link will display a form that is populated with the current values of the entry.
You can update information in the form by:
- Selecting from the dropdown menus for `Instrument`, `Stage`, `Subproject`, `Visit Label`, `Site`, `First Visit`, and `Active`.
- Filling in the numeric text fields for `Minimum age (days)`, `Maximum age (days)`, and `Instrument Order`.
You will have to fill out the required fields `Instrument`, `Minimum age (days)`, `Maximum age (days)`, `Stage`, and `Active`.
Finally, press the **Edit entry** button to update the entry in the Test Battery.

You cannot update an entry if you make no changes in the form or if you edit it to the point where it has a duplicate entry in the test battery.

## Activating/deactivating an entry in the Test Battery

There are several ways you can activate or deactivate entries in the Test Battery.

**Change Status** column
Click the **Activate** or the **Deactivate** button in the “Change Status” column of the Menu Table to directly change the Active status of an entry.

**Add** tab
Under the `Add` tab, add an entry that already exists in the Test Battery but has been deactivated.
A pop up will appear that gives you the option to activate the existing entry.
Note: There is no option to deactivate entries in the `Add` tab because new entries have Active set to "Yes" by default.

**Edit** window
Select an entry in the Menu table and click on `Edit`.
In the `Edit` window, change the value of Active and press the **Edit entry** button.
A pop up will appear that points out that you only edited the Active status and asks whether you want to activate or deactivate the current entry, depending on the change you made.
Alternatively, you can change the Active status of an entry from another entry's `Edit` window.
This is only possible if you edit an entry to the point where it becomes the same as another entry, except for the Active status (e.g. all values match except your edited entry has Active set to "Yes" and the existing entry has Active set to "No").
A pop up will appear that points out that your edits are similar to an existing entry and asks whether you want to activate or deactivate the existing entry, depending on the changes you made.
No changes will be made to the entry that was originally selected for editing.
