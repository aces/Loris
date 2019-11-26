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

### MRI Protocol Violations Page
 This page contains two 
 tables, the first one lists all the valid MRI protocols for the study 
 while the second one lists all the parameters for the scan that violated
 the MRI protocol (check that correct scan information is set in the 
 filters of that page).  
1.  Page should display header information of violated scans.
2.  Table cells should be editiable with the permission
    `Violated Scans: Edit MRI protocol table`. Ensure that the edited data is
    saved to the database.
3.  Ensure first table displays all valid protocols for the study.
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

## Functionality tested by automated testing
1.  Ensure that the module loads only when a user has appropriate permissions.
2.  MRI Protocol Violations page - check Selection Filter results for each of 
    `DCCID`, `PSCID`, `PatientName`, `SeriesUID`, `Time Run`, `Series Description`.
