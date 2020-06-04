# Dicom Archive

This module displays all DICOM scans that have been uploaded to LORIS. This includes scans that have been inserted, as well as those that were rejected (due to protocol violations, mislabeling, etc.) or otherwise excluded. In other words, it's an archive of every single scan that your LORIS instance knows about.

Use the *Selection Filter* section to narrow down the results in the table. Note: PatientName and PatientID are only displayed if they've been properly anonymized.

In the resulting table, you might notice some clickable cells. In the *Metadata* column, click **View Details** to see the compressed package of DICOM files for that scan, along with their metadata. In the *MRI Browser* column, click on **View Images** to visualize and QC these scans in the Imaging Browser module.

In the **Archive Location** column, click on a link to download the DICOMs from all scans in that session.
