## Imaging Browser test plan
	
#A Imaging Browser front page
1. User can see Imaging Browser front page IFF has permission view_final_radiological_review
2. User can see other sites Imaging datasets IFF has permission access_all_profiles
3. Test all Filters
4. Test Selection Filter buttons: Show data and Clear filters (button missing!)
5. Test column table is sortable by headers
6. Test that Links work, to correct dataset (selected/native)

#B. ViewSession / Volume List 
7. Sidebar:  all links work 
8. 3d panel overlay etc - they work.  add panel checkbox works
9. "Visit Level Feedback" - pops up QC window (see section D below)
10. Visit level QC controls:  Pass/Fail, Pending: editable IFF permission mri_feedback
11. Save button appears IFF permission mri_feedback
12. Test Save button works 
13. visit-level QC control can be deleted/unchecked/emptied and saved

Main panel:  per acquisition:
14. Files can be downloaded (links clickable) only IFF has permission [future feature not implemented yet]
15. Scan-level QC flags (Selected, pass/fail, Caveat emptor) modifiable iff permission mri_feedback
16. Selected:  can be set back to Null (blank)
17. Selected:  cannot be set to t2 if scan is a t1
18. Jiv viewer link works (launches window)
19. BrainBrowser link works (launches window)
20. Link to Comments link works (launches window)

#C. MRI-QC : Scan-level (Link to Comments) dialog window
21. editable IFF permission mri_feedback
22. Comments save, checkboxes save, dropdown values save
23. Both save buttons work
24. Comments can be cleared.  checkboxes, dropdown values too. 

#D. Visit-level QC feedback dialog window
25. editable IFF permission mri_feedback
26. Comments save, checkboxes save, dropdown values save
27. Both save buttons work (top and bottom)
28. Comments can be cleared.  checkboxes, dropdown values too. 
