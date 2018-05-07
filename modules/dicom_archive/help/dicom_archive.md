# Dicom Archive

The Dicom Archive module displays all scans that have been uploaded
to LORIS, whether or not they have been inserted or not (due to protocol
violations, mislabeling, not having been run, etc.) It's a filterable archive
of every single dicom that this LORIS instance knows about.

The PatientName, and PatientID are only displayed if they've been properly
anonymized.

Clicking on the "View Details" link in the Metadata column will take you
to a page displaying more details of every scan and clicking on "View Images"
in the MRI Browser column will take you to the session containing those
images in the LORIS imaging browser.

Clicking on the "Archive Location" link will begin a download of the scans'
DICOMs.