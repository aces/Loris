# Data Release Module Test Plan 

## Permissions

1. Make sure that regular users can see the data release module without the 
'Upload File' and 'Add Permission' buttons at the top
2. Make sure that only the 'superuser' can see the 'Upload File' and 'Add 
Permission' buttons at the top of the module, as well as the list of already 
uploaded files
3. As the 'superuser', execute the following:
 > - Click on the 'Add Permission' button
 > - Select another 'User ID' (that you have access to and is not a 
 'superuser') 
 > - Select a 'Data Release ID' (ideally a file that the 'User ID' has no 
 access to yet) (note that at least one file needs to be uploaded in the 
 module to be able to set permissions to access a file, otherwise, the drop 
 down for 'Data Release ID' will remain empty)
 > - Make sure that this 'User ID' can now see the file now that the 
 permission was added for him/her
 
 ## Upload File
 
 4. As the 'superuser', click on the 'Upload File' button to upload a file 
 and make sure the uploaded file is available in the list of files
 
 ## Sort table
 
 5. Make sure that clicking on the table headers will sort the data present 
 in the data release table according to that column.

