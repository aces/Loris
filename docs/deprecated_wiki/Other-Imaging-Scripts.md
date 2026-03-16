This page provides a little more documentation on scripts not covered in the [recommended Imaging-Database script usage](Imaging-Database#3-executing-and-troubleshooting-the-imaging-insertion-scripts)

### batch_uploads_tarchive

As an alternative to the [tarchiveLoader script](Imaging-Database#multi-step-pipeline-execution) on one scanset, the **batch_uploads_tarchive** script may be used to process and load multiple dicom tarchives at a time, managed serially or by a queue manager such as qsub.  

Note the batch_uploads_tarchive script requires an input file stream containing a list of just tarchive names (DCM*.tar) : 

   ```bash
cd /data/$PROJ/bin/mri
./batch_uploads_tarchive < $file_of_tar_names.txt
   ```