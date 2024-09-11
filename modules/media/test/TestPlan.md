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
2. **Upload** new files associated to a specific timepoint
  - PSCID and Visit Label are required fields for all uploaded files
  - File name should always start with [PSCID]\_[Visit Label]. If an instrument
is selected, the file name should should start with [PSCID]\_[Visit Label]\_[Instrument].
3. **Delete** files. Deleting a file hides it from the frontend, but preserves a copy in the database.

---

### 💻 Testing Procedure

**Install Module** -- [Automation Testing] 
  1. Run associated SQL patch to create a "media" table and add "Media" module under _Clinical_ section in Loris.


**Testing with no permissions** [Automation Testing]
  1. Access the module with a regular user (without superuser permissions)
  2. By default, the access to module should be denied


**Testing with read-only permission** [Automation Testing]
  1. Add read permission to the aforementioned user
  2. Media module should be accessible and only present with **one** tab (Browse), containing a data table for the uploaded media files.

**Testing with write-permission** [Automation Testing]
  1. Add write permission
  2. Media module should now have **two** tabs (Browse) and (Upload)
  3. Clicking on Upload tab should hide the data table and display a form with the following fields: PSCID, Visit Label, Instrument, Date of Administration, Comments, File to Upload

**Testing file upload**
  1. Click on the 👉 **Upload File** button
    - An error dialog should appear to notify that you must select a **PSCID** as it is a required field ❌
  2. Select PSCID and click on the 👉  **Upload file** button
    - An error dialog should appear to notify that you must select a **Visit Label** as it is a required field ❌
  3. Try adding a **PSCID** and **Visit Label** combination where there is only one relevant instrument. Make sure that the instrument is not selected by default.
  4. Select Visit Label and click on the 👉  **Upload file**
    - An error dialog should appear to notify that you must select a **File** as it is a required field ❌
  5. Click on the 👉 **Browse** button and a select a file from your file system
    - Note: it is suggested to try different file types and sizes (e.g pdf, mp4, mov, jpg, doc, etc)
  6. After you selected the file click on **Upload File**
    - An error dialog should appear to notify that you must name the file according to the requested format (unless already done so)
    - Once file is named properly clicking on **Upload File** button should trigger file upload and display a progress bar.
  7. Once the file finished uploading, a modal containing a success message should appear with an 'OK' button.
  8. Click on the 👉 **OK** button and the page should refresh to the browse tab. Make sure the file you just uploaded is shown in the data table.

**Test file browsing** 
  1. After a couple of files are uploaded, make sure they are properly displayed in the data table
  2. Make sure that information in the data table corresponds to the information in the database (media table)
  3. Click on 👉  **column headers** to make sure sorting functionality is working as expected (Ascending/Descending)
  4. Click on 👉 **file name** to trigger file download
    - A popup should appear asking you to download the file _(Note: if your browser is configured to download files automatically it might not show a popup)_
    - After downloading the file to your computer make sure it is playable/viewable and works exactly like the copy you uploaded (also make sure they are of the same size)
  5. Click on 👉 **visit label** in data table to go to associated timepoint (make sure it links to the proper timepoint)
  6. Click on 👉 **Edit** in order to edit an existing file
    - This will open a modal window in which you can edit the file

**Test file edit**
  1. Make sure that PSCID, Visit Label and Instrument display proper information and are greyed-out (unchangeable by the user)
  2. Verify that information (if any) is displayed accordingly in _Date of Administration_, _Comments_ and 'Uploaded File'
  3. Change the _Date of Administration_ and click 👉 **Update File**.
    - After the success message is shown, **refresh the page** and make sure the data is still correct.
    - Verify that the database field updated accordingly
  4. Repeat **Step 3** for _Comments_ field.
  5. Select YES in **Hide File** dropdown in order to delete/hide the file
    - Click 👉 **Update File** and go back to **Browse** tab under ```$LORISURL/media/```. The file should no longer be displayed in the data table (unless the user has superuser permissions).
    - _Note: only a person with direct database access could revert the hide file action._

**Test filters** [Automation Testing]
  1. Under **Browse** tab, a selection filter should be present on top of the page containing the following fields: File Name, Language, Project, File Visibility, PSCID, Instrument, Uploaded By, Visit Label, Site and File type.
    - PSCID, File name and Uploaded by are text fields, whereas other fields are dropdowns with options pre-filled based on the current project.
    - Default option of dropdown should be blank.
  2. Type text in the PSCID input and verify that the table gets filtered as you type.
  3. Type text in the File name input and verify that the table gets filtered as you type.
  4. Type text in the Uploaded by input and verify that the table gets filtered as you type.
  5. Select Language, Project, File Visibility, Instrument, Visit Label, and File type (independently and combined) to filter table further
    - The table should update and display filtered records accordingly

**Test the Candidate Dashboard widget for Candidate Media**
   1. Visit the Candidate Dashboard for a candidate found inside the media module and notice the widget titled Candidate Media.
     - Check if the correct number of files are visible corresponding with the column **File Name** for the candidate.
     - Check if the **Last modified** date is correct for the files of the candidate.
     - Check if the file downloads when clicking on the file. 
     - Check if the widget correctly hides when the candidate has no media files.
