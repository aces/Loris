# BrainBrowser Test Plan

1. Load BrainBrowser by clicking on the chosen minc file.

2. Navigate on all three views (sagittal, coronal and axial). 
    - Check that coordinates updating while moving cursor. 
    - Check that slices are updated in the other views correctly 
        -> if move toward the nose, should also see the nose in the other views
        -> same for top of the head 
        -> same for left-right orientation

3. Check that the filename is displayed on top of the control box (below three views)

4. Check coordinates 
    - Enter world coordinates and check that the cursor moves across the volume. 
    - Enter voxel coordinates and check that the cursor moves across the volume. 
    - Enter 0, 0, 0 as voxel coordinates (should bring the cursor to the bottom left of each view).

5. Check all color maps
    - Grey (should be that color by default
    - Spectral
    - Thermal
    - Green
    - Blue

6. Check threshold options
    - Enter different values in the threshold text boxes
        -> Check that it changes the intensity of the images.
        -> Check that the slider is updated. 
    - Move the min and max button on the slider 
        -> Check that the intensity changes.
        -> Check that the values are updated in the text box.

7. Test "View slices" buttons (Sagittal, Coronal and Axial)
    - Should give a screenshot of all slices within the selected orientation.

8. Close BrainBrowser window

9. Load BrainBrowser by clicking on the "BrainBrowser Volume Viewer" link below the pic.
    - Repeat 2 to 7 steps.

10. Load BrainBrowser using the "Add panel" checkbox (on the left of the pic) and the “3D only” button (left panel). 
    - Should display only the selected image(s), no overlay. 

11. Repeat 2 to 7 steps on each displayed volume. 
    - Check that it updates only the appropriate image.

12. Click on the “Sync Volumes” button (top of the page). 
    - Repeat 2 to 4 on each displayed volume. 
        -> Should update coordinates and view for all volumes together.

13. Close BrainBrowser window. 

14. Load BrainBrowser using the “Add panel” checkbox (on the left of the pic) and the “3D overlay” button (left panel). 
    - Should display the selected images plus the overlay.

15. Repeat 2 to 7 steps on each displayed volume. 
    - Check that it updates only the appropriate image.

16. Click on the “Sync Volumes” button (top of the page). 
    - Repeat 2 to 4 on each displayed volume. 
        -> Should update coordinates for all volumes.

17. Test the “Blend” option (text box and slider) on the overlay. 
    - Check that it switches display between the different volumes
    - Check that it updates the slider and text box respectively. 
