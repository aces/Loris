1. User has access to document repository if they have the "View and upload files in Document Repository” permission or is the super user.
   [Automation Testing]
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
10. Check that when performing a search without global filtering, the categories
   containing the resulting files (and only those) are shown in a list format. 
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
15. Check that the preference “Receive Document Repository Notifications” works.
    [Manual Testing]
16. Check that performance is OK with large number of files.
    [Manual Testing]
17. Check that if you have the 'Receive document repository notification' activated you will receive an email each 
    time one of the following event occurs:
       - Addition, deletion or modification of a file (by a user other than yourself)
       - Addition of a category (by a user other than yourself)
    Also check that the www address contained in the notification email is correct.
    [Manual Testing]
17. To upload large files, check that the following settings are in php.ini (default: /etc/php/{php_version}/apache2/php.ini):
      session.gc_maxlifetime 10800
      max_execution_time  10800
      upload_max_filesize 1020M
      post_max_size   1024M
    [Manual Testing]
