# Test plan for the Server Processes Manager

This test plan should be executed by someone with decent knowledge of the MRI upload process and in possession of an MRI scan.

1. Log in with a user that does not have the "View and manage server processes" permission. 
   Check that when logged in there is no Sevrer Processes Manager sub menu in the Admin menu.
   [Automation Test]
2. Log in with a user that has the "View and manage server processes" permission. 
   Check that there is a Server Processes Manager sub menu in the Admin menu.
   [Automation Test]
3. Check three filters, input correct data and click the show data button.Then check the table.
   [Automation Test]
4. Check the contents of the server processes page and remember the number of entries.
   Ensure that the ImagingUploader Auto-Launch is set to Yes (Config module, Study section).
   Using the Imaging uploader, upload an invalid scan (i.e. a `.tar.gz` file that is *not* a scan)
   When the upload fails, verify that no new entries were created in the server processes table.
5. Upload a valid scan using the correct CandID, PSCID and Visit Label on the imaging_upload page.
   After the progress bar reaches 100%, access the server processes manager page and check that a new
   entry for the upload was created in the process tables. 
   Using a Unix shell on the server on which the upload was done, do a tail -f on each of the process 
   files listed in the table (stdout,stderr and exit code). Monitor the contents and make sure that they represent what 
   would have appeared on the screen if the upload had been done running the MRI pipeline on the command line.
   When the process finishes (when the exit code file contains something), verify that all the process files
   have been deleted from `/tmp` if and only if the exit code is zero.

