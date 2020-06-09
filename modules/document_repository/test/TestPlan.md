# Document Repository Test Plan

1. User has access to document repository if they have the "View and upload files in Document Repository” or "Delete files in Document Repository" permission.
   [Manual Testing]
2. Create a category and a sub category.
   [Automation Testing]
3. Check that the comments for a category are displayed properly as a tooltip.
   [Automation Testing]
4. Upload a file.
   [Manual Testing]
5. User is able to delete a file if they have the "Delete files in Document Repository" permission or is the super user.
   [Manual Testing]
6. Edit document properties and save. Check that changes were saved properly.
   [Manual Testing]
7. Check that the breadcrumbs on the main page and the Edit page work.
   [Manual Testing]
8. Download a file and check the content.
   [Manual Testing]
9. Add files in the repository to test search according to file name, file type, version, site and uploaded by.
   [Manual Testing]
10. Check that when performing a search without global filtering, the resulting files which are under the current category are shown in a list format. 
   [Manual Testing]
11. Check that when performing a search with global filtering, all files matching the filtered case 
   (regardless of category) are shown in a list format. 
   [Manual Testing]
12. Check that if a category contains special characters (e.g. space, dot or comma) it can be expanded.
   [Manual Testing]
13. Add two files with the same name. You should get a 'duplicate file name' error.
   [Manual Testing]
14. Edit a file in the repository: check that “Date Uploaded” date is updated.
    [Manual Testing]
15. Visit the My Preferences module and enable notifications for the document_repository.
    Make sure that you are notified for the follow changes:
       - Addition, deletion or modification of a file (by a user other than yourself)
       - Addition of a category (by a user other than yourself)
    [Manual Testing]
16. Try uploading a file that exceeds the max upload limit. Ensure that an error message occurs
    when the server has detected that the file is too large.
    [Manual Testing]
