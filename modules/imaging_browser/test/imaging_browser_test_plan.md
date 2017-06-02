## Imaging Browser test plan
	
#A. Imaging Browser front page
1. User can load Imaging Browser module front page IFF has permission imaging_browser_view_site or imaging_browser_view_allsites
   [Automation Testing]
2. User can see other sites Imaging datasets IFF has permission imaging_browser_view_allsites. User can see only own site Imaging datasets IFF has permission imaging_browser_view_site.[Automation Testing]
3. Test that all Filters work.  Upon first loading, Site filter should be set to own site IFF user does not have permission imaging_browser_view_allsites
4. Test Selection Filter buttons: Show Data and Clear Forms
5. Test column table is sortable by headers
6. Test that Links work, to correct dataset (selected/native)
7. Add more modalities (from the Scan_type column of the mri_scan_type table) to the Configuration/Imaging Modules/Tabulated Scan Types field, and ensure that for each added modality, a new corresponding column shows up in the Imaging Browser table    

#B. ViewSession / Volume List 
8. Sidebar:  all links work 
9. 3d panel overlay etc - they work.  add panel checkbox works. 3D only or 3D+Overlay loads files if at least one image exists and is selected
10. "Visit Level Feedback" - pops up QC window (see section E below)
11. Visit level QC controls (Pass/Fail, Pending, Visit Level Caveat) viewable to all, editable IFF permission imaging_browser_qc
12. Save button appears IFF permission imaging_browser_qc
13. Test Save button works 
14. Verify Visit-level QC controls and comments can be deleted/unchecked/emptied and saved
15. Test Breadcrumb link back to Imaging Browser

#C. Main panel:  per acquisition:
16. Files can be downloaded (links clickable) only IFF has permission (future feature not implemented yet)
17. Scan-level QC flags (Selected, pass/fail, Caveat emptor) viewable to all, modifiable iff permission imaging_browser_qc. Caveat List link is viewable with the Violated Scans: View all-sites Violated Scans permission
18. Selected:  can be set back to Null (blank)
19. BrainBrowser link works (launches window)
20. Link to Comments link works (launches window)
21. Longitudinal View button launches BrainBrowser with images of the chosen modality for that specific candidate across visits/timepoints

#D. MRI-QC : Scan-level (Link to Comments) dialog window
22. Viewable by all, editable IFF permission imaging_browser_qc
23. Comments save, checkboxes save, dropdown values save
24. Save button works
25. Comments can be deleted (field cleared). checkboxes, dropdown values too. 

#E. Visit-level QC feedback dialog window
26. editable IFF permission imaging_browser_qc
27. Comments save
28. Save button works
29. Comments can be deleted (field cleared). 
