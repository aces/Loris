# Server Processes Manager

This module displays jobs that were launched asynchronously via the LORIS website. These jobs are actually Unix processes that run on the LORIS server. Currently, only MRI uploads can be executed this way, but future versions of LORIS might include other processes.

Use the *Selection Filter* section to narrow down the jobs you want to view.

The resulting data table displays summary information for each job and its logs:

**No:** LORIS internal ID for the process.<br>
**Pid:** the Unix process ID of the command that was launched asynchronously.<br>
**Type:** type of process (only mri_upload is currently implemented).<br>
**Stdout file:** full Unix path of the Output log file on the LORIS server (STDOUT output stream for the process).<br>
**Stderr file:** full Unix path of the Error log file on the LORIS server (STDERR output stream for the process).<br>
**Exit code file:** full Unix path of the file on the LORIS server that will contain the exit code of the process once it finishes.<br>
**Exit code:** Unix exit code for the process. This column will be empty until the process terminates.<br>
**Userid:** the LORIS username of the user that launched the asynchronous process.<br>
**Start time:** time (on the LORIS server) at which the process was started.<br>
**End time:** time (on the LORIS server) at which the process ended. Will be empty until the process finishes.<br>
**Exit text:** summary text describing the process execution result. Will be empty until the process finishes.
