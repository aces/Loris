# MRI Violations Module Test Plan:

## Functionality to be tested manually

### MRI Violations page
1.  Check Selection Filter works for each of `Patient Name`, `Project`, `Cohort`,
    `Site`, `Time Run`, `Image File`, 
    `Series Description or Scan Type`,  `Type of Problem`, `Resolution Status`
    `SeriesUID`.
    - Note: `SeriesUID` does not have a column in the table on this page,
    but the filter should still limit results based on the MRI Violations data.
2. The `Problem` column with the entry `Protocol Violation` should display a popup
  with details of why the scan failed.
3. The `Problem` column with the entry `Could not identify scan type` should 
   display a popup with details of  why the scan type could not be identified.
4. The `Image File` column should have a link to 
   the correct violated scan in the Brainbrowser module. Check that this link 
   works and takes you to the Brainbrowser module.
5. Go back to the MRI violations menu filter page and resolve issues with each of the
    different types of resolutions. Once the page is refreshed, ensure the proper 
    resolution was set in column `Resolution Status`.
6. Click on the question mark on the right upper side of the windows and ensure
   that the help content about MRI Violation is showing up and is up-to-date.
7. Ensure user has access to this page if and only if he/she has either permission
   `mri_violations_view_allsite` or `mri_violations_view_ownsite`.
8. Check that if the user only has the permission `mri_violations_view_ownsite`, he/she
   is not allowed to see the violations associated to sites other than his/her
   own.
9. Check that the violations for which the site is unknown can always be seen 
    no matter what permission the user has (violated_scans_view_allsite or
    violated_scans_view_ownsite).


### Dashboard Widget - "My Tasks" for Violated scans
1. Ensure the total of Violated scans corresponds with the correct 
    number of rows inside the MRI Violations module where the Resolution Status is Unresolved.
2. Verify that either `violated_scans_view_allsites` or `violated_scans_view_ownsites` permissions 
    are necessary for the user to view the widget.
3. Click on the total number of Violated Scans and check if redirection
    to the MRI Violation module succeeds. The MRI Violations page should have the Resolution Status filter preset to "Unresolved".

## Functionality tested by automated testing
1.  Ensure that the module loads only when a user has appropriate permissions.
2.  MRI Protocol Violations page - check Selection Filter results for each of 
    `DCCID`, `PSCID`, `PatientName`, `SeriesUID`, `Time Run`, `Series Description`.
