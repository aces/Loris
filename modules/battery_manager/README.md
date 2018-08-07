# Battery Manager

## Purpose

The Battery Manager module allows users to **add**, **activate**, and **deactivate** entries 
in the Test Battery. 

## Intended Users

The Battery Manager module is used by study administrators.

## Scope

The Battery Manager module provides a tool for adding, activating, and deactivating entries in the
the Test Battery.
The *add* functionality is in a separate page in the Battery Manager module.
Users can add an entry by navigating to this page and filling out the required fields.
If the entry already exists in the `test_battery` table, the entry cannot be added.
However, if the existing entry is currently inactive, the user will be able to activate it.
The *deactivate* functionality is on the main page.
Users can deactivate an entry by pressing 'Deactivate' on the row they want to deactivate
in the menu table. 

## Permissions

In order to use the Battery Manager module the user needs one or both of the following 
permissions:

- `battery_manager_view`: gives user a read-only access to Battery Manager module 
(browsing the Test Battery).
- `battery_manager_edit`: gives user a edit access to Battery Manager module 
(add/activate/deactivate entries in Test Battery).
