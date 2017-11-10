# Server Processes Manager

The Server Processes Manager displays jobs that were launched asynchronously via the LORIS website. These jobs are actually Unix processes that run on the LORIS server. Currently, only MRI uploads can be executed this way but future versions of LORIS might include other type of processes.

The process table on the Server Processes Manager module displays summary information for each job and its logs:
  - No: LORIS internal ID for the process.
  - Pid: the Unix process ID of the command that was launched asynchronously.
  - Type: type of process (only mri_upload is currently implemented).
  - Stdout file: full Unix path of the Output log file on the LORIS server (STDOUT output stream for the process).
  - Stderr file: full Unix path of the Error log file on the LORIS server (STDERR output stream for the process).
  - Exit code file: full Unix path of the file on the LORIS server that will contain the exit code of the process once it finishes.
  - Exit code: Unix exit code for the process. This column will be empty until the process terminates.
  - Userid: the LORIS username of the user that launched the asynchronous process.
  - Start time: time (on the LORIS server) at which the process was started.
  - End time: time (on the LORIS server) at which the process ended. Will be empty until the process finishes.
  - Exit text: summary text describing the process execution result. Will be empty until the process finishes.

The Server Processes Manager page provides a Selection Filter that can be used to display only specific processes. Filtering can be performed based on the PID, type of process or user ID.
Finally, note that when a process finishes, all temporary files used store metadata are available for this file.
