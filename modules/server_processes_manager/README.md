# Server Processes Manager

## Purpose

The server processes manager module is used to get information about processes that were 
launched asynchronously by other LORIS modules

## Intended Users

The only user that should have access to this module is the person in charge of
the administration of the LORIS website

## Scope

This module displays the information relevant to the asynchronous processes
(active and inactive) launched by other modules. The properties displayed for
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
to store the processe's STDOUT, STDERR and exit code are either deleted or left as
is depending on predefined criteria (e.g. the files associated to processes
launched by the imaging uploader module are not deleted if the process does not
terminate successfully).

NOT in scope:

The page does not offer the possibility to suspend or stop an active process.

## Permissions

server_processes_manager
 - This permission allows the user access to the server processes manager
module and the ability to view the information for all processes.

## Configurations

There are no configuration settings associated to this module.

## Interactions with LORIS

The imaging uploader module is currently the only LORIS module capable of 
launching an asynchronous process, namely the execution of the MRI processing
pipeline on a successfully uploaded scan archive. Consequently, the result table
will only show these type of processes.
