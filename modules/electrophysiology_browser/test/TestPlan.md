## Electrophysiology Browser test plan

### A. Electrophysiology Browser front page
1. User can load Electrophysiology Browser module front page if and only if user has either permission:
    * `electrophysiology_browser_view_site` : _"View all-sites Electrophysiology Browser pages"_ [Automated Testing]
    * `electrophysiology_browser_view_allsites` : _"View own site Electrophysiology Browser pages"_ [Automated Testing]
2. User can see other sites Electrophysiology datasets if and only if user has permission `electrophysiology_browser_view_allsites`. User can see only own-site datasets if and only if user has permission `electrophysiology_browser_view_site`.
3. Test that all Filters work. [Automated Testing]
4. Test Clear Filters button. [Automated Testing]
5. Test column table is sortable by headers. [Automated Testing]
6. Test that Links work and point to correct dataset (raw/derivative). [Manual Testing]

### B. Subpage: Sessions

7. User can view a session from any site if the user has `electrophysiology_browser_view_allsites` permissions. User can see only own-site session if the user has permission `electrophysiology_browser_view_site`. [Automated Testing]
8. User can view only own-project sessions if they have either `electrophysiology_browser_view_site` or `electrophysiology_browser_view_allsites` permissions. [Automated Testing]
9. Sidebar: Navigation links work. [Automated Testing]
10. Data table display: information displayed looks decently laid out, not garbled.
11. Click each "Download" button (there should be 5). Check: Does the download button work? Does the file that is downloaded have greater than 0kb size? Is a different file downloaded by each button?
    * Check that if a session does not have event files, the `Events` download button is not clickable
    * Check that if the session has event files, the `Events` download button is clickable and downloads the proper files
12. Test Breadcrumb link back to Electrophysiology Browser. [Automated Testing]

### C. Visualization

13. Follow the [module README extra installation steps](../README.md#installation-requirements-to-use-the-visualization-features)
    and make sure the `Signal Viewer panel` displays correctly on the screen. (Documentation: see [react-series-data-viewer README](../jsx/react-series-data-viewer/README.md#user-manual))
14. Set `useEEGBrowserVisualizationComponents` to "No" in the Configuration module and run `make dev`. Ensure it runs without failing, and that except the Signal Viewer panel, all the other components in the page display well.
15. Temporarily deactivate an entry in `physiological_parameter_file`
    for a ParameterTypeID IN (SELECT ParameterTypeID from parameter_type WHERE Name = 'electrophysiology_chunked_dataset_path')
    and a chosen PhysiologicalFileID to simulate an environment for which the visualization components are not loaded.
    Load the corresponding session page and make sure that except the Signal Viewer panel, the rest of the page displays well, either with or without the extra installation steps.
16. Make sure the 'Show Event Panel' opens the 'Event Panel' and it can be closed both via its close button and the 'Hide Event Panel' button.
17. Make sure the text fields can not be modified (support planned in future) .
18. Make sure HED tags belonging to an individual event can be added and deleted from that individual event. The selectable tags should only be SCORE 'Artifact's.
19. Make sure the 'Dataset Tag Viewer' can be opened with the 'Open Dataset Tag Viewer' button and the selectable fields are properly populated.
20. Test all the buttons on the interface to ensure they perform the action that the  [react-series-data-viewer README](../jsx/react-series-data-viewer/README.md#Signal Viewer) states it will perform.
21. Hover over a signal to ensure it responds to being hovered. It should change to a color and its value should be displayed below the signal plot.
22. Ensure that 'Stacked View' and 'Isolate Mode' behave as stateed in the [react-series-data-viewer README](../jsx/react-series-data-viewer/README.md).
23. Ensure that the electrodes on the 'Electrode Map' 2D view are visible and their index can be hovered to reveal their channel name.
24. Ensure that the electrodes on the 'Electrode Map' 3D view are visible and the mesh can be manipulated/rotated with the mouse.

_For extra credit: Verify LORIS Menu permissions_
User can view the top-level LORIS Menu _Electrophysiology_ and Menu item : _Electrophysiology Browser_ if and only if user has either permission:
* `electrophysiology_browser_view_site` : _"View all-sites Electrophysiology Browser pages"_
* `electrophysiology_browser_view_allsites` : _"View own site Electrophysiology Browser pages"_
