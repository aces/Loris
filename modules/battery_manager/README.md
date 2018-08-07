# Battery Manager

## Purpose

The Battery Manager module allows users to **browse**, **add**, **edit**, and **activate/deactivate** entries 
in the Test Battery. 

## Intended Users

The Battery Manager module is used by study administrators.

## Scope

The Battery Manager module provides a tool for browsing, adding, editing, and activating/deactivating entries in the
the Test Battery.

### Browse

The **browse** functionality is under the `Browse` tab.
Users can browse entries in the Test Battery and filter the entries using the `Selection Filters`.

### Add

The **add** functionality is under the `Add` tab.
Users can add an entry by navigating to this tab and filling out the required fields.
If the entry already exists in the Test Battery table, the entry cannot be added.

### Edit

The **edit** functionality can be accessed in the Menu Table under the `Browse` tab.
Users can edit an entry by clicking on the corresponding `Edit` link in the `Edit Metadata` column.
This will take them to a new page with a form that is originally populated by the values of the entry and that can be edited.
Users cannot edit an entry if they have made no changes in the form or if they have made changes to the point where the entry becomes the same as another entry in the Test Battery table.

### Activate/Deactivate

The **activate/deactivate** functionalities can be accessed in the Menu Table under the `Browse` tab.

In the `Change Status` column, users can directly activate or deactivate an entry by pressing the **Activate** or **Deactivate** button.

In the `Edit Metadata` column, users can indirectly activate or deactivate an entry by navigating to the `Edit` form and changing the value of `Active`. Within an entry's `Edit` form, users can also indirectly activate or deactivate another entry if they edit an entry to the point where the entry becomes the same as another entry in the Test Battery but has a different `Active` value. In this case, the entry that was originally selected for editing will not be updated.

The **activate** functionality is also in the `Add` tab. If users add an entry that already exists in the Test Battery table but has been deactivated, they will be given the option to activate the existing entry.

## Permissions

In order to use the Battery Manager module the user needs one or both of the following 
permissions:

- `battery_manager_view`: gives user a read-only access to Battery Manager module 
(browsing the Test Battery).
- `battery_manager_edit`: gives user a edit access to Battery Manager module 
(add/edit/activate/deactivate entries in Test Battery).
