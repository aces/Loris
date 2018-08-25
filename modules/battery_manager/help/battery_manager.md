# Battery Manager

The Battery Manager module serves as a front-end for manipulating the Test Battery.
This includes browsing, adding, editing, activating, and deactivating entries.

## Searching for an entry in the Test Battery

Under the `Browse` tab, use the `Selection Filters` to search for entries by fields such as:
`Instrument`,
`Minimum age (days)`,
`Maximum age (days)`,
`Stage`,
`Subproject`,
`Visit Label`,
`Site`,
`First Visit`,
`Instrument Order`,
`Active`.
As filters are selected, the data table below will dynamically update with relevant results.
Click the `Clear Filters` button to reset all filters.

Within the data table, results can be sorted in ascending or descending order by 
clicking on any column header.

## Adding an entry to the Test Battery

Under the `Add` tab, you can add a new entry to the Test Battery.
You can specify information about the entry by using the searchable dropdowns, dropdown menus, and numeric text fields.
You will have to fill out the required fields `Instrument`, `Minimum age (days)`, `Maximum age (days)`, and `Stage`.
Finally, press the **Add entry** button to add the entry to the Test Battery.
You cannot add an entry if it has a duplicate entry in the Test Battery.

## Editing an entry to the Test Battery

Under the `Browse` tab, you can edit an entry by clicking on the `Edit` link in the `Edit Metadata` column of the Menu Table.
The link will display a form that is populated with the values of the entry.
You can update information in the form by selecting from the dropdown menus and filling in the numeric text fields.
You will have to fill out the required fields `Instrument`, `Minimum age (days)`, `Maximum age (days)`, `Stage`, and `Active`.
Finally, press the **Edit entry** button to edit the entry in the Test Battery.
You cannot edit an entry if you make no changes in the form.
You cannot edit an entry if it becomes the same as another active entry in the Test Battery.

## Activating/Deactivating an entry in the Test Battery

### Browse tab (activate/deactivate)

In the `Change Status` column of the Menu Table, press the **Activate** or **Deactivate** button to directly change the status of an entry.

### Add tab (activate)

Under the `Add` tab, add an entry that already exists in the Test Battery but has been deactivated.
A pop up will appear that will give you the option to activate the existing entry.

### Edit window (activate/deactivate)

Select an entry in the Menu table and click on `Edit`.
In the `Edit` window, edit an entry and make sure the new entry has no duplicate in the Test Battery.
This will add the new entry to the table and deactivate the original one.
Alternatively, edit an entry so that it becomes the same as another deactivated entry in the Test Battery.
A pop up will appear that will give you the option to activate the other entry and deactivate the original one.
