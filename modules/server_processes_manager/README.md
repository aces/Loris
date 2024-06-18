# Server Processes Manager

## Purpose

The server processes manager module is used to get information about processes that were 
launched asynchronously by other LORIS modules.

## Intended Users

The LORIS system administrator(s) should be the only user(s) that should have access to 
this module.

## Scope

This module displays the information relevant to the asynchronous processes
(currently running or not) launched by other modules. The properties displayed for
each process are as follows:

- The internal LORIS process ID for the process
- Pid: the Unix process ID of the command that was launched asynchronously.
- Type: type of process (only mri_upload is currently implemented).
- Stdout file: full Unix path of the Output log file on the LORIS server 
(STDOUT output stream for the process).
- Stderr file: full Unix path of the Error log file on the LORIS server 
(STDERR output stream for the process).
- Exit code file: full Unix path of the file on the LORIS server that will 
contain the exit code of the process once it finishes.
- Exit code: Unix exit code for the process. This column will be empty until 
the process terminates.
- Userid: the LORIS username of the user that launched the asynchronous process.
- Start time: time (on the LORIS server) at which the process was started.
- End time: time (on the LORIS server) at which the process ended. Will be 
empty until the process finishes.
- Exit text: summary text describing the process execution result. Will be 
empty until the process finishes.

By default, all processes (active or not) are displayed on the server processes
manager page but the page provides a selection filter that can be used to display 
only specific processes. Filtering can be performed based on the PID, type of 
process or user ID. Finally, note that upon termination, the temporary files used
to store the processe's STDOUT, STDERR and exit code are deleted by default. For 
processes that were launched by the imaging uploader though, these files are deleted
only if the process terminates successfully (i.e with an exit code equal to 0).

NOT in scope:

The page does not offer the possibility to suspend or stop an active process.

## Permissions

server_processes_manager
 - This permission allows the user access to the server processes manager
module and the ability to view the information for all processes.

## Configurations

The following configurations affect the load of the server_processes_manager module:
 - The `LORIS-MRI code` path of the `Imaging Pipeline` tab in the configuration module must be set for the `server_processes_manager` module to load.

## Interactions with LORIS

The imaging uploader module is currently the only LORIS module capable of 
launching an asynchronous process, namely the execution of the MRI processing
pipeline on a successfully uploaded scan archive. Consequently, the result table
will only show these type of processes.
