# Battery Manager Module Test Plan

##  Overview

Battery Manager module allows users to search for, add, edit, activate, and deactivate entries in the
Test Battery.

##  Permissions 

In order to use the Battery Manager module the user might need one or both of the following permissions:

1. **battery_manager_view** - gives user read-only access to Battery Manager module
(browse entries in Test Battey).
2. **battery_manager_edit** - gives user edit access to Battery Manager module
(add/edit/activate/deactivate entries in Test Battery)

>**Note**: superusers have both of the aforementioned permissions by default.

##  Features

1. **Browse** entries in the Test Battery.
2. **Add** new entry to the `test_battery` table.
  - Instrument, Minimum age, Maximum age, and Stage are required fields.
3. **Edit** entry in the `test_battery` table.
4. **Activate** entry in the `test_battery` table.
5. **Deactivate** entry in the `test_battery` table.

---

##  Testing Procedure

### Permissions

**Testing with no permissions** [Automation Testing]
  1. Access the module with a regular user (without superuser permissions).
  2. By default, the access to module should be denied.

**Testing with view permission** [Automation Testing]
  1. Add view permission to the aforementioned user.
  2. Battery Manager module should be accessible and only present with **one** tab (Browse).
  3. The **Change Status** column should not be in the data table.
  4. The **Edit Metadata** column should not be in the data table.

**Testing with edit permission** [Automation Testing]
  1. Add edit permission.
  2. Battery Manager module should now have **two** tabs (Browse) and (Add).
  3. The **Change Status** column should be in the data table.
  4. The **Edit Metadata** column should be in the data table.
  5. Clicking on Add tab should hide the data table and display a form with the following fields:
     Instrument, Minimum age (days), Maximum age(days), Stage, Subproject, Visit Label, Site, First Visit,
     and Instrument Order.

### Add tab

**Testing add functionality**
  1. Check that you cannot add an entry without filling out the required fields: Instrument, Minimum age (days), Maximum age (days), Stage.
  2. Check that you can only enter a site that exists.
  3. Check that you can only enter numbers in Minumum age (days), Maximum age (days), and Instrument order.
     - You should only be able to enter a number in between 0 and 99999 for Minimum age (days) and Maximum age (days).
     - You should only be able to enter a number in between 0 and 127 for Instrument Order.
  4. Check that when you try to add an entry that has an active duplicate in the table (Active = 'Y'), you receive an error message.
  5. Check that you can add an entry that does not have a duplicate.
     - Make sure that a success message appears and the page goes back to the Browse tab.
     - Make sure the entry you just added is shown in data table.

**Testing activate functionality**
  1. Check that when you try to add an entry that has an inactive duplicate in the table (Active = 'N'), you receive a warning message that allows you to activate the duplicate.
     - Make sure that when you press "Yes", a success message appears and the page goes back to the Browse tab.
     - Make sure the entry you just activated is activated in the data table.

### Browse tab

**Testing data table**
  1. After a couple of entries are added, make sure they are properly displayed in the data table.
  2. Make sure that information in the data table corresponds to the information in the `test_battery` table.
  3. Click on **column headers**  to make sure sorting functionality is working as expected (Ascending/Descending).

**Testing Change Status column**
  1. Press `Deactivate` button in the `Change Status` column on an entry in the data table to deactivate it in the Test Battery.
  2. Check that a warning message appears that asks you if you want to deactivate the entry.
     - Make sure that when you press "Yes", a success message appears and the page refreshes.
     - Make sure the entry you just deactivated is deactivated in the data table.
  3. Repeat steps 1-2 using the `Activate` button in the `Change Status` column.

**Testing Edit Metadata column**
  1. Press the `Edit` link in the `Edit Metadata` column on an entry in the data table to edit it.
  2. Check that you are taken to an Edit page with a form that is populated with the entry's values.

**Test filters**
  1. Under **Browse** tab, a selection filter should be present on top of the page containing the following fields:
Instrument, Minimum age, Maximum age, Stage, Subproject, Visit Label, Site, First Visit, Instrument Order, Active.
    - Minimum age, Maximum age, and Instrument Order are text fields.
    - Other fields are dropdowns with options pre-filled based on the current project.
    - Default option of dropdown should be blank.
  2. Type text in the Minimum age and verify that the table gets filtered as you type.
  3. Type text in the Maximum age and verify that the table gets filtered as you type.
  4. Select values from the dropdown filters (independently and combined) to filter table further.
    - The table should update and display filtered records accordingly.

### Edit page

**Testing edit functionality**
  1. Check that you cannot update an entry without filling out the required fields: Instrument, Minimum age (days), Maximum age (days), Stage.
  2. Check that you can only enter a site that exists.
  3. Check that you can only enter numbers in Minumum age (days), Maximum age (days), and Instrument order.
     - You should only be able to enter a number in between 0 and 99999 for Minimum age (days) and Maximum age (days).
     - You should only be able to enter a number in between 0 and 127 for Instrument Order.
  4. Check that when you press **Edit entry** without making changes to the form, you receive an error message.
  5. Check that when you edit the entry to the point where it becomes the same as another entry in the Test Battery with the same `Active` value, you receive an error message.
  5. Check that you can update an entry if it does not have a duplicate (i.e. itself or another entry).
     - Make sure that a success message appears and the page goes back to the `Browse` tab.
     - Make sure the changes to the entry are shown in data table.

**Testing activate/deactivate functionalities**
  1. Go to the edit page for an entry that is not active and change `Active` to "Yes".
 - Check that a warning message appears that points out that only the Active status of the current entry was changed and that asks you whether you want to Activate the current entry.
 - Make sure that when you press "Yes", a success message appears and the page goes back to the Browse tab.
 - Make sure the entry you just activated is activated in the data table.
  2. Go to the edit page for an entry that is active and change `Active` to "No".
 - Check that a warning message appears that points out that only the Active status of the current entry was changed and that asks you
 whether you want to Deactivate the current entry.
 - Make sure that when you press "Yes", a success message appears and the page goes back to the Browse tab.
 - Make sure the entry you just deactivated is deactivated in the data table.
  3. Go to the edit page for a random entry and edit it so that it has same the same values as an existing deactivated entry in the data table except for an `Active` value "Yes".
 - Check that a warning message appears that points out that the edited entry is identical to another entry except for its Active status and asks whether you want to Activate the other entry.
 - Make sure that when you press "Yes", a success message appears and the page goes back to the Browse tab.
 - Make sure the other entry is activated in the data table.
  4. Go to the edit page for a random entry and edit it so that it has same the same values as an existing activated entry in the da
ta table except for an `Active` value "No".
 - Check that a warning message appears that points out that the edited entry is identical to another entry except for its Active status and asks whether you want to Deactivate the other entry.
 - Make sure that when you press "Yes", a success message appears and the page goes back to the Browse tab.
 - Make sure the entry you just deactivated is deactivated in the data table.
