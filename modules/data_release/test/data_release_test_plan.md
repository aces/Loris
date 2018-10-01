# Data Release Module Test Plan 

Make sure that regular users can see the data release module without the 
'Upload File' and 'Add Permission' buttons at the top


## Upload File
1. Give the user the `data_release_upload` *(Data Release: Upload file)* permission. 
 Make sure the user can upload new files to the module
 
2. As the 'superuser', click on the 'Upload File' button to upload a file 
 and make sure the uploaded file is available in the list of files
 
## Permissions

1. Give the user the `data_release_edit_permissions` *(Data Release: Give user 
permission to view files)* permission

2. Click on the 'Add Permission' button

3. Select another 'User ID' (that you have access to and is not a 
 'superuser')
 
4. Select a 'Data Release ID' (ideally a file that the 'User ID' has no 
 access to yet) (note that at least one file needs to be uploaded in the 
 module to be able to set permissions to access a file, otherwise, the drop 
 down for 'Data Release ID' will remain empty)
 
5. Make sure that this 'User ID' can now see the file now that the 
 permission was added for him/her

## Superuser

Make sure that a 'superuser' can see the 'Upload File' and 'Add 
Permission' buttons at the top of the module, as well as the list of already 
uploaded files

## Sort table
 
Make sure that clicking on the table headers will sort the data present 
 in the data release table according to that column\

