# MRI Violations Module Test Plan:

## Functionality to be tested manually

### MRI Violations page
1.  Check Selection Filter works for each of `Patient Name`, `File Name`,
    `Series Description or Scan Type`, `Time Run`, `Type of Problem`,
    `SeriesUID`.
    - Note: `SeriesUID` does not have a column in the table on this page,
    but the filter should still limit results based on the MRI Violations data.
2. The `Problem` column with the entry `Protocol Violation` should link to the 
  `MRI Protocol Check Violations` page. The filters of that page should
  be automatically populated with the scan information.
3. The `Problem` column with the entry `Could not identify scan type` should 
   link to the `MRI Protocol Violations` page.
4. Go back to the MRI_violations page and resolve issues with each of the
    different types of resolutions, and ensure that they show up in the 
    `Resolved` tab, and are no longer in the `Not resolved` tab.
5. Ensure that the link to the `protocol violation` and `Could not identify scan
   type` works within the `Resolved` tab (`Problem` column).
6. Ensure all filters and sorting work in the `Resolved` tab.
7. Click on the question mark on the right upper side of the windows and ensure
   that the help content about MRI Violation is showing up and is up-to-date.
8. Ensure user has access to this page if and only if he/she has either permission
   `mri_violations_view_allsite` or `mri_violations_view_ownsite`.
9. Check that if the user only has the permission `mri_violations_view_ownsite`, he/she
   is not allowed to see the violations associated to sites other than his/her
   own.
10. Check that the violations for which the site is unknown can always be seen 
    no matter what permission the user has (violated_scans_view_allsite or
    violated_scans_view_ownsite).


### MRI Protocol Violations Page
 This page contains two 
 tables, the first one lists all the valid MRI protocols for the study 
 while the second one lists all the parameters for the scan that violated
 the MRI protocol (check that correct scan information is set in the 
 filters of that page).  
1.  Page should display header information of violated scans.
2.  Ensure first table displays all valid protocols for the study.
3.  The table cells of the MRI protocols table should not be editable under
    any circumstances.
4. Click on the question mark on the right upper side of the windows and ensure
   that the help content about MRI Protocol Violation is showing up and is
   up-to-date.

### MRI Protocol Check Violations page
1. Ensure that the Selection Filter works for 
    each of `Tarchive ID`, `PatientName`, `CandID` and `DICOM Series UID`.
    - Note: `TarchiveID` does not have a column in the table on this page,
    but the filter should still limit results based on the MRI Violations data.
    You may find a valid TarchiveID by looking at the URL for a link under the
    'PatientName' column.
2. Click on link under `PatientName` 
    column, should go to DICOM Archive for the patient if permission `Across 
    all sites view DICOM Archive module and pages` is granted.
3. Click on the question mark on the right upper side of the windows and ensure
   that the help content about MRI Protocol Check Violation is showing up
   and is up-to-date.

### Dashboard Widget - "My Tasks" for Violated scans
1. Ensure the total of Violated scans corresponds with the correct 
    number of rows inside the MRI Violations module.
2. Verify that either `violated_scans_view_allsites` or `violated_scans_view_ownsites` permissions 
    are necessary for the user to view the widget.
3. Click on the total number of Violated Scans and check if redirection
    to the MRI Violation module succeeds.

## Functionality tested by automated testing
1.  Ensure that the module loads only when a user has appropriate permissions.
2.  MRI Protocol Violations page - check Selection Filter results for each of 
    `DCCID`, `PSCID`, `PatientName`, `SeriesUID`, `Time Run`, `Series Description`.
