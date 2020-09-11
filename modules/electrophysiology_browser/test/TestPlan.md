## Electrophysiology Browser test plan
	
### A. Electrophysiology Browser front page
1. User can load Electrophysiology Browser module front page if and only if user has either permission:
   * `electrophysiology_browser_view_site` : _"View all-sites Electrophysiology Browser pages" [Automated Testing]
   * `electrophysiology_browser_view_allsites` : _"View own site Electrophysiology Browser pages"_[Automated Testing]
2. User can see other sites Electrophysiology datasets if and only if user has permission `electrophysiology_browser_view_allsites`. User can see only own-site datasets if and only if user has permission `electrophysiology_browser_view_site`. 
3. Test that all Filters work. [Automated Testing]
4. Test Clear Filters button. [Automated Testing]
5. Test column table is sortable by headers. [Automated Testing]
6. Test that Links work and point to correct dataset (raw/all types). [Automated Testing]

### B. Subpage: Sessions 

7. User can view a session from any site if the user has `electrophysiology_browser_view_allsites` permissions. User can see only own-site session if the user has permission `electrophysiology_browser_view_site`. [Automated Testing]
8. User can view only own-project sessions if they have either `electrophysiology_browser_view_site` or `electrophysiology_browser_view_allsites` permissions. [Automated Testing]
9. Sidebar: Navigation links work. [Automated Testing]
10. Data table display: information displayed looks decently laid out, not garbled.
11. Click each "Download" button (there should be 5). Check: Does the download button work? Does the file that is downloaded have greater than 0kb size? Is a different file downloaded by each button? 
12. Test Breadcrumb link back to Electrophysiology Browser. [Automated Testing]

_For extra credit: Verify LORIS Menu permissions_ 
User can view the top-level LORIS Menu _Electrophysiology_ and Menu item : _Electrophysiology Browser_ if and only if user has either permission:
   * `electrophysiology_browser_view_site` : _"View all-sites Electrophysiology Browser pages"_
   * `electrophysiology_browser_view_allsites` : _"View own site Electrophysiology Browser pages"_
