# Publication - Test Plan
1. If not already sourced into your DB sandbox, source the publication 
schema into your DB sandbox and make sure no errors arise.
2. Before granting your (non-super / admin) user account any of the 
permissions for publication module, make sure you are unable to access the 
module from either the LorisMenu or directly via the URL.
3. Using an admin account, grant your non-admin account the 
"Publication - Access to module" permission. Then using that non-admin account
make sure that the module is accessible via either the LorisMenu or directly 
via the URL. Make sure that the "Propose a Project" tab does not appear, 
and that accessing the URL `<LORIS_Base_URL>/publication/#propose` 
does not grant you access to the project proposal page.
4. Grant your non-admin account the "Publication - Propose a project" permission
and ensure that the project proposal page is now accessible.
5. Fill out all the fields in the form and try to submit. Make sure you have
a corresponding directory to the directory specified in Config if you are 
attempting a file upload. Try submitting without filling in required fields.
6. Try adding a file to upload, and then adding another file to upload. Next, 
select browse in the second file that was uploaded, but cancel the file. The
file should be removed, and no extra "File to upload" fields should be added.
6. Login under one of the accounts you specified under the 
"Users with Edit Permission" and access the project page and make edits to 
the proposal.
7. Propose a second project. You should not be able to submit another project 
with the same title as the one you previously submitted. Collaborators and keywords
that you submitted in the previous proposal should now appear as suggestions, though
 you should not be limited to these.
8. Propose a project under another account, and try accessing it given that you
 have the "Publication - Access to module" permission. You should be able to view
 a static version of the project proposal and be able to download the uploaded files.
9. Grant yourself the "Publication - Approve or reject proposed publication projects"
permission. You should now have an additional "Status" dropdown option. If selecting
"Rejected," make sure that a textbox appears beneath the dropdown prompting for "Reason
 for rejection." Fill this out and save. Sign back into an account associated with
 the project proposal, but without the "Publication - Approve or reject proposed 
 publication projects" permission and check to see that the reason for rejection is 
 displayed statically. Test selecting other statuses as well.
10. Test email notifications. There are three emails that can be sent out. One for
project submission, one for project editing, and one for project reviewing. Emails
will only be sent if you check the box next to the email fields saying "Send email
notification?" Make sure your mail server is enabled on your VM before you file a bug
report.
11. Test file download and file deletion. Only users that are affiliated 
with the proposal can delete. File download should only be allowed for
users with proposal affiliation or view permission can download.
12. Test that the title of a proposal is only editable if the status is still Pending. 