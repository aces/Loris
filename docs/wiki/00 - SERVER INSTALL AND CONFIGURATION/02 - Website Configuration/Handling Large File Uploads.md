# Handling Large File Uploads

In order for users to upload large files (> 2 MB), you'll need to configure
Apache's `php.ini` configuration file. 

Recommended sample values appropriate for compressed scans not exceeding 500M in size are: 

```
session.gc_maxlifetime = 10800  // After this number of seconds, stored data will be seen as 'garbage' and cleaned up by the garbage collection process.
max_input_time = 10800          // Maximum amount of time each script may spend parsing request data (in seconds)
max_execution_time = 10800      // Maximum execution time of each script (in seconds)
upload_max_filesize = 1024M     // Maximum allowed size for uploaded files.
post_max_size = 1024M           // Maximum size of POST data that PHP will accept.
```
