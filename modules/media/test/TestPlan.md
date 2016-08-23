## Media Module Test Plan

### 📄 Overview

Media module allows users to upload, browse and edit media files associated with a specific timepoint in Loris.

### 🔒 Permissions

In order to use the media module the user might need one or both of the following permissions:

1. **media_read** - gives user read-only access to media module (file browsing only)
2. **media_write** - gives user write access to media module (file uploading, editing and deletion)

>**Note**: superusers have both of the aforementioned permissions by default! 💪

### 💯 Features

1. **Browse** a list of uploaded files and related information
2. **Edit** meta information about media files (except timepoint related data such as PSCID, Visit Label and Instrument)
3. **Upload** new files associated to a specific timepoint
  - PSCID, Visit Label and Instrument are required fields for all uploaded files
  - File name should always start with [PSCID]\_[Visit Label]\_[Instrument]
4. **Delete** files. Deleting a file hides it from the frontend, but preserves a copy in the database.

---

### 💻 Testing Procedure

**Install Module**
  1. Run associated SQL patch to create a "media" table and add "Media" module under _Clinical_ section in Loris.


**Testing with no permissions**
  1. Access the module with a regular user (without superuser permissions)
  2. By default, the access to module should be denied


**Testing with read-only permission**
  1. Add read permission to the aforementioned user
  2. Media module should be accessible and only present with **one** tab (Browse) with an empty datatable

**Testing with write-permission**
  1. Add write permission
  2. Media module should now have **two** tabs (Browse) and (Upload)
  3. Clicking on Upload tab should hide the data table and display a form with the following fields: PSCID, Visit Label, Instrument, For Site, Data of Administration, Comments, File to Upload

**Testing file upload**
  1. Click on the 👉 **Upload File** button
    - A popup should prompt you to select a **PSCID** as it is a required field ❌
  2. Select PSCID and click on the 👉  **Upload file** button again
    - A popup should prompt you to select a **Visit Label** as it is a required field ❌
  3. Select Visit Label and click on the 👉  **Upload file** again
    - A popup should prompt you to select a **Instrument** as it is a required field ❌
  4. Select Instrument and click on the 👉  **Upload file** again
    - A popup should prompt you to select a **File to upload** as it is a required field ❌
  5. Click on the 👉 **Browse** button and a select a file from your file system
    - Note: it is suggested to try different file types and sizes (e.g pdf, mp4, mov, jpg, doc, etc)
  6. After you selected the file click on **Upload File** one more time
    - A popup should appear prompting to name the file according to the requested format (unless already done so)
    - Once file is named properly clicking on **Upload File** button should trigger file upload and display a progress bar.
  8. Once the file finished uploading a success message should appear on top of the page and fade away in a couple of seconds
  9. Click on browse tab and make sure the file you just uploaded is shown in data table

**Test file browsing**
  1. After a couple of files are uploaded, make sure they are properly displayed in the data table
  2. Make sure that information in the data table corresponds to the information in the database (media table)
  3. Click on 👉  **column headers** to make sure sorting functionality is working as expected (Ascending/Descending)
  4. Click on 👉 **file name** to trigger file download
    - A popup should appear asking you to download the file _(Note: if your browser is configured to download files automatically it might not show a popup)_
    - After downloading the file to your computer make sure it is playable/viewable and works exactly like the copy you uploaded (also make sure they are of the same size)
  5. Click on 👉 **visit label** in data table to go to associated timepoint (make sure it links to the proper timepoint)
  6. Click on 👉 **Edit** in order to edit an existing file
    - This will bring you to a new page ```$LORISURL/media/edit/?id=$fileID```

**Test file edit**
  1. Make sure that PSCID, Visit Label and Instrument display proper information and are greyed-out (unchangeable by the user)
  2. Verify that information (if any) is displayed accordingly in _For Site_, _Date of Administration_, _Comments_ and 'Uploaded File'
  3. Select a site from the dropdown and click 👉 **Update File**.
    - After the success message is shown, **refresh the page** and make sure the site is still selected.
    - Verify that the database field updated accordingly
  4. Repeat **Step 3** for _Date of Administration_ and _Comments_ fields
  5. Select YES in **Hide File** dropdown in order to delete/hide the file
    - Click 👉 **Update File** and go back to **Browse** tab under ```$LORISURL/media/```. The file should no longer be displayed in the data table.
    - _Note: only a person with direct database access could revert the hide file action._

**Test filters**
  1. Under **Browse** tab, a selection filter should be present on top of the page containing the following fields: PSCID, Visit Label, Instrument, For Site.
    - PSCID is a text field, whereas other fields are dropdowns with options pre-filled based on the current project.
    - Default option is "Any"
  2. Enter an invalid PSCID and click 👉 **Show Data**
    - The page should display a message "No results found"
  3. Enter a valid PSCID and click 👉 **Show Data**
    - The page should display a data table with records corresponding to this PSCID only
  4. Select Instrument, Visit Label and For Site (independently and combined) to filter table further
    - Clicking 👉 **Show Data** should update the table and display filtered records accordingly
