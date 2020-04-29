## Electrophysiology Browser test plan
	
### A. Electrophysiology Browser front page
1. User can load Electrophysiology Browser module front page if and only if user has either permission:
   * `electrophysiology_browser_view_site` : _"View all-sites Electrophysiology Browser pages"_
   * `electrophysiology_browser_view_allsites` : _"View own site Electrophysiology Browser pages"_
2. User can see other sites Electrophysiology datasets if and only if user has permission `electrophysiology_browser_view_allsites`. User can see only own-site datasets if and only if user has permission `electrophysiology_browser_view_site`. 
3. Test that all Filters work.  
4. Test Clear Filters button.
5. Test column table is sortable by headers.
6. Test that Links work and point to correct dataset (raw/all types).

### B. subpage: Sessions 

7. Sidebar: Navigation links work. 
8. Data table display: information displayed looks decently laid out, not garbled.
9. Click each "Download" button (there should be 5). Check: Does the download button work? Does the file that is downloaded have greater than 0kb size? Is a different file downloaded by each button? 
10. Test Breadcrumb link back to Electrophysiology Browser.

_For extra credit: Verify LORIS Menu permissions_ 
User can view the top-level LORIS Menu _Electrophysiology_ and Menu item : _Electrophysiology Browser_ if and only if user has either permission:
   * `electrophysiology_browser_view_site` : _"View all-sites Electrophysiology Browser pages"_
   * `electrophysiology_browser_view_allsites` : _"View own site Electrophysiology Browser pages"_
