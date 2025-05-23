## Imaging Browser test plan

### Imaging Browser main page
1. User can access Imaging Browser module front page if and only if they have permission `imaging_browser_view_site`, `imaging_browser_view_allsites`, `imaging_browser_phantom_allsites` or `imaging_browser_phantom_ownsite`.
 [Partial Automation Testing]
2. User can see other sites Imaging datasets if and only if has permission `imaging_browser_view_allsites`. User can see only own site Imaging datasets if and only if has permission `imaging_browser_view_site`. User can see phantom data only from across all sites with the `imaging_browser_phantom_allsites`, and from own sites with `imaging_browser_phantom_ownsite`.
 [Partial Automation Testing]
3. Test that all filters work. When the Site filter is empty, all sites with which the user is associated should be displayed. Every site should be displayed if the user has the `imaging_browser_view_allsites` permission.
[Automation Testing]
4. Test Clear Filters button. [Automation Testing]
5. Test column table is sortable by headers.
6. Ensure that the hyperlinks in the Links column are active and load the correct dataset.
7. Add more modalities (from the `MriScanTypeName` column of the `mri_scan_type` table) to the Configuration -> Imaging Modules -> Tabulated Scan Types field, and ensure that for each added modality, a new corresponding column shows up in the Imaging Browser table. (This requires back-end access)

### View Session / Volume List
8. Make sure a user can only access the viewSession page if and only if at least one of the following cases is true:
   - The session's candidate is of entity type "scanner" and the user has the permission `imaging_browser_phantom_allsites` while being affiliated to the project to which this session belongs.
   - The session's candidate is of entity type "scanner" and the user has the permission `imaging_browser_phantom_ownsite` while being affiliated to the site and the project to which this session belongs.
   - The session's candidate is of entity type "human" and the user has the permission `imaging_browser_view_allsites` while being affiliated to the project to which this session belongs.
   - The session's candidate is of entity type "human" and the user has the permission `imaging_browser_view_site` while being affiliated to the site and the project to which this session belongs.
9. Sidebar:
   - Ensure that all links work, including the Download DICOM option.
   - Ensure that projects can customize (add/remove) their list of instruments that can be linked to from the Configuration -> Imaging Modules -> Imaging Browser Links to Insruments.
10. Select an image using the checkbox above the volume previews. Click the "3D Only" and "3D + Overlay" buttons. These should load the Brain Browser module.
11. Visit level QC controls (Pass/Fail, Pending, Visit Level Caveat) viewable to all, editable if and only if user has permission `imaging_browser_qc`.
12. Save button appears if and only if user has permission `imaging_browser_qc`.
13. Test Save button works.
14. Verify Visit-level QC controls and comments can be deleted/unchecked/emptied and saved.
15. Test Breadcrumb link back to Imaging Browser.

### Main panel:  Per Acquisition
16. Files can be downloaded (links clickable) if and only if user has at least one of the module permissions. Ensure that DICOM downloads are
prepended with the Patient Name.
17. Scan-level QC flags (Selected, pass/fail) are viewable to all, modifiable if and only if user has permission `imaging_browser_qc`.
18. Scan-level Caveat emptor are viewable to all, modifiable if and only if user has permission `imaging_browser_qc` and there are no
    pipeline protocol violations associated to the image in the MRI violation module (`Manual Caveat Set by...` protocol violation
    with no other protocol violations can be modified). Example in raisinbread: `OTT170_300170_V1` `fieldmapBOLD` images have
    pipeline protocol violations associated to the image in the MRI violation module and therefore Caveat should not be editable.
19. There will be a Caveat link just above the Caveat drop-down in the image panel of a given scan if and only if there is an MRI violation with:
       i) the same path as the image file
       ii) the same SeriesUID as the image's SeriesUID
    Search in the MRI violations' Resolved tab using the scan's SeriesUID and image file path to verify this. Note that you can see the header
    of an MRI violation by clicking on the 'Protocol Violation' link in the 'Problem' column.
20. In the imaging browser, pick a scan that does not have a Caveat link. Use the drop-down to set the Caveat to true and save your modification.
    Ensure that there is now a link to your newly created caveat and verify that when you click on it it redirects to the MRI violations' violations
    resolved submenu with your caveat displayed in the search result table.
21. In the imaging browser, pick a scan that has a Caveat link. Use the drop-down to set the Caveat to false and save your modification.
    Ensure that there is no Caveat link for that scan now. Using the MRI violation module and the technique described in 17, validate that there
    are no MRI violations that would justify the presence of a link for that scan.
22. Selected:  can be set back to Null (blank).
23. Clicking on an image launches the BrainBrowser.
24. Clicking on the "QC Comments" button opens the QC comments window.
25. Longitudinal View button launches the BrainBrowser with images of the chosen modality for that specific candidate across visits/timepoints.

### MRI-QC : Scan-level (QC Comments) dialog window
26. With the permission `imaging_browser_qc`, edit comments, checkboxes, and dropdown values.
27. Clicking Save should update the values.
28. Data should not be editable without this permission.

### Visit-level QC feedback dialog window
29. On the view session page, click the button "Visit Level Feedback".
30. The entries in this dialog should be editable when a user has the permission `imaging_browser_qc`.
31. Try editing comments (adding new ones, deleting old ones). Click Save and ensure the data is saved.

### Test the Candidate Dashboard widget
32. Go to the candidate dashboard in the candidate module and check the Imaging QC Summary widget.
    - For each visit, check that the QC status displayed matches the Imaging Browser Module by hovering over any visit to see detailed modality breakdown for visit.
    - Click on a visit from the graph to access the imaging browser. Check that the link redirects to the correct scans in the imaging browser.
    - For a few candidate/visits, check that all the files from the Imaging Browser Module appear in the widget for all the visits.

