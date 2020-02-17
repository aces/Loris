# Battery Manager

## Purpose
The Battery Manager module allows users to **browse**, **add**,
**edit**, **activate** and **deactivate** entries in the Test Battery. The
Test Battery is used to determine which Instruments are administered at
different timepoints.

## Intended Users
The Battery Manager module is used by study
administrators.

## Scope
The Battery Manager module provides a tool for browsing, adding,
editing, activating, and deactivating entries in the the Test Battery.

#### Interactions with LORIS
Changes, additions and deletion of data in this module affects the test
battery assigned to a candidate at each timepoint

## Permissions
In order to use the Battery Manager module the user needs
one or both of the following permissions:
- `battery_manager_view`: gives user read-only access to Battery Manager
module (browsing the Test Battery).
- `battery_manager_edit`: gives user edit access to Battery
Manager module (add/edit/activate/deactivate entries in Test Battery).
