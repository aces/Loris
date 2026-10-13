
# Set up
For this test, you will create 3 users. 
- user1 
    - (admin) all permissions. Use this account to create two more users
- user2
    - [x] Access Profile: Create/View Candidates and Timepoints - Own Sites
    - [x] Data Release: View Release Files
    - [x] Data Release: Grant Other Users Access to Releases
- user3
    - [x] Access Profile: Create/View Candidates and Timepoints - Own Sites
    - [x] Data Release: View Release Files

# Upload
This section tests the upload functionality of the module
- Open loris instance in a new "incognito" browser window
- Login with user2 credentials 
- Navigate to tools -> data release
- Assert that the `Upload File` button does **not** appear
- Go to your admin account in a normal browser window and add the following permission:
- [x] Data Release: Upload Release Files
- Hard-refresh the page in the incognito browser window opened for user 2
- Assert that the `Upload File` button has appeared
- Click on `Upload File`
- Select `Browse` and use the file-picker to upload any local file, ideally nothing with sensitive or personal information
- Leave `Version` blank
- Select a project
- Click `Upload File`

# Version
This section tests the version functionality of the module
- Assert that the file appears in the data release list as `Unversioned` and with the correct upload date and project
- Repeat the above procedure and assert that the following error swal appears:
- `A file with this name already exists! Would you like to overwrite existing file? Note that the version associated with the file will also be overwritten`
- Verify that the file still appears in the data release
- Repeat the procedure again but add `VERSION2`
- Assert that the above error swal appears and that the file is in the list with the entered version
- Check the data_release table for this entry and assert that the version string is in lower case

+----+------------+---------+-------------+-----------+
| id | file_name  | version | upload_date | ProjectID |
+----+------------+---------+-------------+-----------+
|  1 | test.txt   | version2 | 2026-07-07  |        1 |
+----+------------+---------+-------------+-----------+

## Permissions
This section tests the functionality to grant a specfied user access to specific files or versions

- Login with user3 in **another** incognito window and navigate to the data release module
- Assert that this user can *not* see the file you uploaded
Go to your admin window and give user2 the following permission:
- [x] Data Release: Grant Other Users Access to Releases
- Go to user2 window and hard refresh
- Assert that `Add Permission` button appears
- Click on `Add Permission`
- In the `Username` field, select user3
- In the `Data Release File`, select the file that you uploaded and click `Add Permission`
- Assert that that you get a swal saying the permission was added 
- Assert that user3 can now see the file that you uploaded
- Assert that `data_release_permissions` contains an entry with the associations 


- Repeat the steps above but instead of selecting a 'Data Release File', select a
'Data Release Version' and ensure that the user can see all data release files
associated to that data release version.

- Repeat steps above but instead of selecting a 'Data Release File', select a
'Data Release Version' and select ‘Unversioned’. Ensure that the user can see all data release files associated with ‘Unversioned’.

- Repeat steps above but this time select both a 'Data Release File' and a
'Data Release Version'. An data entry error should be shown.

- Select the 'pencil' icon next to a file name and try to add permissions for the file for a user. Ensure that the user can see the file now that the permission was added for him/her.

- Select the 'pencil' icon next to a file name and try to remove permissions for the file for a user. Ensure that the user can no longer see the file now that the permission was removed for him/her.

- Select the 'pencil' icon next to a file name and try to hide the file. Ensure that the file is no longer visible to other non-admin users.

- Select the 'pencil' icon next to a file name and try to unhide the file. Ensure that the file is visible to other non-admin users.

- Select the 'pencil' icon next to a file name and try to delete the file. Ensure that the file is no longer visible.

- Click on the 'Manage Permissions' button.

- Try adding/removing permissions to specific release versions for specific users.

- Ensure that an unmodified checkbox does not give or revoke any access permissions 
from the user.

- Ensure that when a box is unchecked, the user's access to any of the released 
files with that version is revoked.

- Ensure that when a box is checked, the user is granted access to all files within 
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
