# Imaging Browser: View Session

The View Session page displays a candidate's scans collected from
a single timepoint.  General information on a candidate's session
appears in a table at top including Patient Name, PSCID, DCCID,
Visit Label, etc.

Files for the selected candidate's dataset are displayed below the
general information table. Horizontal (axial), sagittal and coronal
thumbnails are displayed -- click on any image to launch the
BrainBrowser visualization tool.

To the right of the image thumbnails appears a list of scan parameters
including QC Status, "Selected" (indicating which scan will be
available in the data query tool when there are multiple scans of
a single modality), and a Caveat flag (True/False). Within the same
panel, users may click "Header Info" located in the top right corner
to expand the panel, revealing further scan parameters from the
DICOM header such as Voxel size, Acquisition Date, Protocol, Echo
Time etc. To toggle this panel and hide this information, click
"Header Info" again.

Buttons at the bottom of each scan panel allow users to view/edit
QC Comments, download the scan as a Minc file, or viewing the scans
from a Longitudinal View which will launch the BrainBrowser. Click
the QC Comments button to open up a pop-up window in which users
with appropriate permissions may select QC issues and enter comments
regarding intensity, movement artifacts, coverage and overall
feedback on the selected scan.

## Navigation In the Left Sidebar

Return to the main Imaging Browser page, or navigate to the previous
or next scan session based on the filtered list of search results.

## Volume Viewer

Select scans to visualize by clicking the checkbox in the top left
corner of one or more scan panels, then click "3D Only", or "3D +
Overlay" which will overlay 2 (or more) selected volumes.

## Links

The Links section provides access to other LORIS imaging modules
and features such as the MRI Parameter Form containing scan session
report notes, Radiology Review module, DICOM archive, and the Issue
Tracker tool for reporting problems with data.

## Visit Level QC

Authorized users can set the QC status for the scan session to Pass
or Fail, mark whether QC is pending or not, and flag a Caveat at
the visit-level.

Click "Save" to finalize any changes under the Visit-Level QC
section. Click "Visit Level Feedback" to launch a popup where
comments on the entire imaging time-point can be entered.

