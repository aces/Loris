[Loris Installation Guide](https://docs.google.com/document/d/1wh-kLdT6u80c-VxtcGrgPvGWuc2R_7PqleDC1VC6co0)

Permissions on document_repository directory should be 777 in order to save uploaded files

/etc/php5/apache2/php.ini changes for large file uploads:

session.gc_maxlifetime 10800
max_input_time         10800
max_execution_time     10800
upload_max_filesize    1024M
post_max_size          1024M

Set your 'imagePath' and 'url' in the config file as the scripts use it

Insert .obj and .txt files in the 'files' table for an existing session
