## Imaging Browser test plan
	
### Imaging Browser main page
1. User can access Imaging Browser module front page if and only if they have permission `imaging_browser_view_site`, `imaging_browser_view_allsites`, `imaging_browser_phantom_allsites` or `imaging_browser_phantom_ownsite`.
 [Partial Automation Testing]
2. User can see other sites Imaging datasets if and only if has permission `imaging_browser_view_allsites`. User can see only own site Imaging datasets if and only if has permission `imaging_browser_view_site`. User can see phantom data only from across all sites with the `imaging_browser_phantom_allsites`, and from own sites with `imaging_browser_phantom_ownsite`. 
 [Partial Automation Testing]
3. Test that all filters work. When the Site filter is empty, all sites with which the user is associated should be displayed. Every site should be displayed if the user has the `imaging_browser_view_allsites` permission.
4. Test Clear Filters button.
5. Test column table is sortable by headers.
6. Ensure that the hyperlinks in the Links column are active and load the correct dataset.
7. Add more modalities (from the Scan_type column of the `mri_scan_type` table) to the Configuration -> Imaging Modules -> Tabulated Scan Types field, and ensure that for each added modality, a new corresponding column shows up in the Imaging Browser table. (This requires back-end access)

### View Session / Volume List
8. Sidebar:  
   - Ensure that all links work, including the Download DICOM option. 
   - Ensure that projects can customize (add/remove) their list of instruments that can be linked to from the Configuration -> Imaging Modules -> Imaging Browser Links to Insruments.
9. Select an image using the checkbox above the volume previews. Click the "3D Only" and "3D + Overlay" buttons. These should load the Brain Browser module.
10. Visit level QC controls (Pass/Fail, Pending, Visit Level Caveat) viewable to all, editable if and only if user has permission `imaging_browser_qc`.
11. Save button appears if and only if user has permission `imaging_browser_qc`.
12. Test Save button works.
13. Verify Visit-level QC controls and comments can be deleted/unchecked/emptied and saved.
14. Test Breadcrumb link back to Imaging Browser.

### Main panel:  Per Acquisition
15. Files can be downloaded (links clickable) if and only if user has at least one of the module permissions. Ensure that DICOM downloads are
prepended with the Patient Name.
16. Scan-level QC flags (Selected, pass/fail, Caveat emptor) are viewable to all, modifiable if and only if user has permission `imaging_browser_qc`.  
17. Caveat List link is viewable with the Violated Scans if and only if user has `View all-sites Violated Scans` permission.
18. Selected:  can be set back to Null (blank).
19. Clicking on an image launches the BrainBrowser.
20. Clicking on the "QC Comments" button opens the QC comments window.
21. Longitudinal View button launches BrainBrowser with images of the chosen modality for that specific candidate across visits/timepoints.

### MRI-QC : Scan-level (QC Comments) dialog window
22. With the permission `imaging_browser_qc`, edit comments, checkboxes, and dropdown values. 
23. Clicking Save should update the values.
24. Data should not be editable without this permission.

### Visit-level QC feedback dialog window
25. On the view session page, click the button "Visit Level Feedback".
26. The entries in this dialog should be editable when a user has the permission `imaging_browser_qc`.
27. Try editing comments (adding new ones, deleting old ones). Click Save and ensure the data is saved.
