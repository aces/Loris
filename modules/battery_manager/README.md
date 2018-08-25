# Battery Manager

## Purpose

The Battery Manager module allows users to **browse**, **add**, **edit**, **activate**, **deactivate** entries 
in the Test Battery.
The Test Battery is used to determine which Instruments are administered at different timepoints.

## Intended Users

The Battery Manager module is used by study administrators.

## Scope

The Battery Manager module provides a tool for browsing, adding, editing, activating, and deactivating entries in the
the Test Battery.

### Browse

The **browse** functionality is under the `Browse` tab.
Users can browse entries in the Test Battery and filter the entries using the `Selection Filters`.

### Add

The **add** functionality is under the `Add` tab.
Users can add an entry by filling out the required fields.
If the entry already exists in the Test Battery table, the entry cannot be added.

### Edit

The **edit** functionality can be accessed in the Menu Table under the `Browse` tab.
Users can navigate to an entry's edit window by clicking on the corresponding `Edit` link in the `Edit Metadata` column.
The edit window will have a form that is populated with the values of that entry.
Editing entails deactivating the original entry and creating a new entry with the edited values.
The following rules apply when editing:
- Users cannot edit an entry if they have made no changes in the form.
- Users cannot edit an entry if it becomes the same as another active entry in the Test Battery.
- If the edited entry becomes the same as another deactivated entry in the Test Battery,
  users will be given the option to activate the other entry and deactivate the original one.

### Activate

The **activate** functionality can be accessed in the `Browse` tab, `Edit` window, and the `Add` tab..

#### Browse tab
In the `Change Status` column of the Menu Table, users can directly activate an entry by pressing the **Activate** button.

#### Edit window
In an entry's edit window, users can indirectly activate another entry.
If they edit the entry so that it is the same as another deactivated entry, they will be given the option to activate the other entry.

#### Add tab
In the `Add tab`, users can indirectly activate another entry.
If they add an entry that is the same as another deactivated entry, they will be given the option to activate the other entry.

### Deactivate

The **deactivate** functionality can be accessed in the `Browse` tab and the `Edit` window.

#### Browse tab
In the `Change Status` column of the Menu Table, users can directly deactivate an entry by pressing the **Deactivate** button.

#### Edit window
When users edit an entry, the older version of the entry will be deactivated.

## Permissions

In order to use the Battery Manager module the user needs one or both of the following 
permissions:

- `battery_manager_view`: gives user read-only access to Battery Manager module 
(browsing the Test Battery).
- `battery_manager_edit`: gives user edit access to Battery Manager module 
(add/edit/activate/deactivate entries in Test Battery).
