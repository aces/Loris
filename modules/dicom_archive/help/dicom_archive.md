# Dicom Archive

This module displays all scans that have been uploaded to LORIS. This includes scans that have been inserted, as well as those that haven’t (due to protocol violations, mislabeling, not having been run, etc.) In other words, it's an archive of every single DICOM that your LORIS instance knows about.

Use the *Selection Filter* section to narrow down the results in the table. Note: PatientName and PatientID are only displayed if they've been properly anonymized.

In the resulting table, you might notice some clickable cells. In the *Metadata* column, click **View Details** to see the compressed package of DICOM files for that scan, along with their metadata. In the *MRI Browser* column, click on **View Images** to access the session—in the LORIS imaging browser—containing those images.

In the **Archive Location** column, click any link to download the DICOMs in that scan.
