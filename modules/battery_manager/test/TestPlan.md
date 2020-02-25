# Battery Manager Module Test Plan

##  Overview

Battery Manager module allows users to search for, add, edit, activate, and deactivate entries in the
Test Battery.

##  Features

1. **Browse** entries in the Test Battery.
2. **Add** new entry to the `test_battery` table.
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
     `Instrument`, `Minimum age (days)`, `Maximum age(days)`, `Stage`, `Subproject`, `Visit Label`, `Site`, `First Visit`,
     and `Instrument Order`.
  6. Clicking on Edit in **Edit Metadata** takes you to a new page with a form with the following fields:
     `Instrument`, `Minimum age (days)`, `Maximum age(days)`, `Stage`, `Subproject`, `Visit Label`, `Site`, `First Visit`,
     and `Instrument Order`.

### Add tab

**Testing add functionality**
  1. Check that you cannot add an entry without filling out the required fields: `Instrument`, `Minimum age (days)`, `Maximum age (days)`, `Stage`.
  2. Check that you can only enter a site that exists.
  3. Check that you can only enter numbers between 0 and 99999 in Minumum age (days) and Maximum age (days).
  4. Check that you can only enter numbers between 0 and 127 in Instrument order.
  5. Check that when you try to add an entry that has an active duplicate in the table (Active = 'Y'), you receive an error message.
  6. Try to add an entry that does not have a duplicate.
     - Ensure that a success message appears and the page goes back to the Browse tab.
     - Ensure the entry you just added is shown in data table.

**Testing activate functionality**
  1. Try to add an entry that has an inactive duplicate in the table (Active = 'N').
     - Ensure that you receive a warning message that allows you to activate the duplicate.
     - Ensure that when you press "Yes", a success message appears and the page goes back to the Browse tab.
     - Ensure the entry you just activated is activated in the data table.

### Browse tab

**Testing data table**
  1. After a couple of entries are added, ensure they are properly displayed in the data table.
  2. Ensure that information in the data table corresponds to the information in the `test_battery` table.
  3. Click on **column headers** to ensure sorting functionality is working as expected (Ascending/Descending).

**Testing Change Status column**
  1. Press the `Deactivate` button in the `Change Status` column on an entry in the data table.
     - Ensure that a warning message appears that asks you to confirm the action.
     - Ensure that when you press "Yes", a success message appears and the page refreshes.
     - Ensure the entry has the new Active status in the data table.
  2. Repeat step 1 using the `Activate` button.

**Testing Edit Metadata column**
  1. Press the `Edit` link in the `Edit Metadata` column on an entry in the data table to edit.
     - Ensure that you are taken to an Edit page with a form that is populated with the entry's values.

**Test filters**
  1. Under **Browse** tab, a selection filter should be present on top of the page containing the following fields:
     - Minimum age, Maximum age, and Instrument Order (as text fields).
     - Instrument, Stage, Subproject, Visit Label, Site, First Visit, Instrument Order, and Active (as dropdown fields with blank default option).
  2. Type text in the Minimum age and verify that the table gets filtered as you type.
  3. Type text in the Maximum age and verify that the table gets filtered as you type.
  4. Select values from the dropdown filters (independently and combined) to filter table further.
    - The table should update and display filtered records accordingly.

### Edit window

**Testing edit (activate/deactivate/add) functionality**
  1. Check that you cannot edit an entry without filling out the required fields: `Instrument`, `Minimum age (days)`, `Maximum age (days)`, `Stage`.
  2. Check that you can only enter a site that exists.
  3. Check that you can only enter numbers between 0 and 99999 in Minumum age (days) and Maximum age (days).
  4. Check that you can only enter numbers between 0 and 127 in Instrument order.
  5. Check that when you try to edit an entry without making changes to the form, you receive an error message.
  6. Check that when the edited entry has the same values as another active entry in the Test Battery, you receive an error message.
  7. Try to edit an entry so that it has the same values as another deactivated entry in the Test Battery.
     - Ensure that a warning message appears giving the option to activate the other entry and deactivate the original entry.
     - Ensure that when you press "Yes", a success message appears and the page goes back to the Browse tab.
     - Ensure the original entry was deactivated and the other duplicate entry has been activated in the data table.
  8. Try to edit an entry so that it does not have a duplicate (i.e. itself or another entry).
     - Ensure that a success message appears and the page goes back to the `Browse` tab.
     - Ensure the original entry was deactivated and the new entry has been added to the data table.
