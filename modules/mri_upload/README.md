For the imaging uploader can handle large files, please update the apache configuration file
with the following values

File to update : /etc/php5/apache2/php.ini

Sample values: 

session.gc_maxlifetime = 10800
max_input_time = 10800
max_execution_time = 10800
upload_max_filesize = 1024M
post_max_size = 1024M
