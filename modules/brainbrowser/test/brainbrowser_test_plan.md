# BrainBrowser Test Plan

1. Load BrainBrowser by clicking on the chosen minc file.
2. Navigate on all three views (sagittal, coronal and axial). 
    - Check that coordinates updating while moving cursor.
    - Check that slices are updated in the other views correctly
        - if move toward the nose, should also see the nose in the other views
        - same for top of the head
        - same for left-right orientation
3. Check that the filename is displayed on top of the control box (below 
`Sync Volumes`). If the filename is too long, hovering over it displays the full name.
4. Check that clicking the filename or the arrow in the header causes the panel to 
expand and collapse.
5. Check coordinates
    - Enter world coordinates and check that the cursor moves across the volume.
    - Enter voxel coordinates and check that the cursor moves across the volume.
    - Enter 0, 0, 0 as voxel coordinates should bring you close to a corner of the 
    volume, but it could be any of the eight corners. It depends on the orientation.
6. Check all color maps
    - Gray (should be that color by default)
    - Spectral
    - Thermal
    - Blue
    - Green
7. Check threshold options
    - Enter different values in the threshold text boxes
        - Check that it changes the intensity of the images.
        - Check that the slider is updated.
    - Move the min and max button on the slider
        - Check that the intensity changes.
        - Check that the values are updated in the text box.
8. Select a different panel size from the Panel Size drop-down. Default should be 
set to 300 Pixels.
    - Should change the size of the three displayed volumes.
9. Check that scrolling on top of the brain canvas zooms in and out.    
10. Check that the "Reset view" resets the view of the canvas (restores the default zoom). 
11. Check that the keyboard key 'r' also resets the view of the canvas. 
12. Test `View slices` buttons (Sagittal, Coronal and Axial).
    - Should give a screenshot of all slices within the selected orientation.    
13. From the Imaging Browser's View Session page, Load BrainBrowser by selecting the 
checkbox(es) in the upper left corner of the scan panel (right next to the scan's name) 
and clicking the **3D only** button (module's left control panel). 
(Select 2 or more scans for proper testing) 
    - Should display only the selected image(s), no overlay.
    - Repeat 2 to 12 steps on each displayed volume.
    - Check that it updates only the appropriate image.
14. From the Imaging Browser's View Session page, Load BrainBrowser by selecting the 
checkbox(es) in the upper left corner of the scan panel (right next to the scan's name) 
and clicking the **3D overlay** button (module's left control panel)
(Select 2 or more scans for proper testing)
    - Should display the selected images plus the overlay.
    - Repeat 2 to 12 steps on each displayed volume.
    - Check that it updates only the appropriate image.
15. Click on the `Sync Volumes` button (top of the page)
    - Should update coordinates for all volumes, but not reset the view. (This button 
    is only useful when 2 or more volumes are loaded in the module)
16. Test the “Blend” option (text box and slider) on the overlay.
    - Check that it switches display between the different volumes
    - Check that it updates the slider and text box respectively.
