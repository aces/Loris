# Data Release Module Test Plan 

Ensure that users with `data_release_view` permission only can see the data release 
module without the 'Upload File', 'Add Permission' and 'Manage Permissions' 
buttons at the top of the data table.


## Upload File

1. Give the user the `data_release_upload` *(Data Release: Upload file)* permission. 
 Ensure the user can upload new files to the module.
 
2. As the 'superuser', click on the 'Upload File' button to upload a file 
 and ensure the uploaded file is available in the list of files.

3. Upload a file with a version name containing `.` and ensure the permissions
 tests done in the next section work on that version.
 
## Permissions

1. Give the user the `data_release_edit_file_access` *(Data Release: Grant other 
users view-file permissions)* permission.

2. Click on the 'Add Permission' button.

3. Select another 'User' (that you have access to and is not a 'superuser').
 
4. Select a 'Data Release File' (ideally a file that the 'User' has no 
access to yet). Note that at least one file needs to be uploaded in the 
module to be able to set permissions to access a file, otherwise, the drop 
down for 'Data Release File' will remain empty).
 
5. Ensure that this 'User' can now see the file now that the 
permission was added for him/her.

6. Repeat steps 2 to 5 but instead of selecting a 'Data Release File', select a
'Data Release Version' and ensure that the user can see all data release files
associated to that data release version.

7. Repeat steps 2 to 5 but this time select both a 'Data Release File' and a
'Data Release Version'. An data entry error should be shown.

8. Click on the 'Manage Permissions' button.

9. Try adding/removing permissions to specific release versions for specific users.

10. Ensure that an unmodified checkbox does not give or revoke any access permissions 
from the user.

11. Ensure that when a box is unchecked, the user's access to any of the released 
files with that version is revoked.

12. Ensure that when a box is checked, the user is granted access to all files within 
that release version.


## Superuser

Ensure that a 'superuser' can see the 'Upload File' and 'Add 
Permission' buttons at the top of the module, as well as the list of already 
uploaded files.

## Sort table
 
Ensure that clicking on the table headers will sort the data present 
in the data release table according to that column.

## Download CSV

Test that the 'Download CSV' button downloads a CSV with the data present
in the data table.