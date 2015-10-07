# BrainBrowser Test Plan

1. Load BrainBrowser by clicking on the chosen minc file.
2. Navigate on all three views (sagittal, coronal and axial). 
    a) Check that coordinates updating while moving cursor.
    b) Check that slices are updated in the other views correctly
        - if move toward the nose, should also see the nose in the other views
        - same for top of the head
        - same for left-right orientation
3. Check that the filename is displayed on top of the control box (below `Sync Volumes` and `Choose Panel Size`)
4. Check that clicking the filename or the arrow in the header causes the panel to expand and collapse.
5. Check coordinates
    a) Enter world coordinates and check that the cursor moves across the volume.
    b) Enter voxel coordinates and check that the cursor moves across the volume.
    c) Enter 0, 0, 0 as voxel coordinates (should bring the cursor to the bottom left of each view).
6. Check all color maps
    a) Gray (should be that color by default)
    b) Spectral
    c) Thermal
    d) Green
    e) Blue
7. Check threshold options
    a) Enter different values in the threshold text boxes
        - Check that it changes the intensity of the images.
        - Check that the slider is updated.
    b) Move the min and max button on the slider
        - Check that the intensity changes.
        - Check that the values are updated in the text box.
8. Click on the “Sync Volumes” button (top of the page)
    Should update coordinates for all volumes.
9. Select a different panel size from the `Choose Panel Size` drop-down.
    Should change the size of the three displayed volumes.
10. Test `View slices` buttons (Sagittal, Coronal and Axial).
    Should give a screenshot of all slices within the selected orientation.
11. `BrainBrowser Volume Viewer`
    a) Close BrainBrowser window
    b) Load BrainBrowser by clicking on the `BrainBrowser Volume Viewer` link below the pic.
    c) Repeat 2 to 9 steps.
12. Load BrainBrowser using the `Add panel` checkbox (on the left of the pic) and the “3D only” button (left panel).
    a) Should display only the selected image(s), no overlay.
    b) Repeat 2 to 9 steps on each displayed volume.
    c) Check that it updates only the appropriate image.
13. Load BrainBrowser using the “Add panel” checkbox (on the left of the pic) and the “3D overlay” button (left panel).
    a) Should display the selected images plus the overlay.
    b) Repeat 2 to 9 steps on each displayed volume.
    c) Check that it updates only the appropriate image.
14. Test the “Blend” option (text box and slider) on the overlay.
    a) Check that it switches display between the different volumes
    b) Check that it updates the slider and text box respectively.