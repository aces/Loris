# Publication - Test Plan
1. If not already sourced into your DB sandbox, source the publication 
schema into your DB sandbox and make sure no errors arise.
2. Before granting your (non-super / admin) user account any of the 
permissions for publication module, make sure you are unable to access the 
module from either the LorisMenu or directly via the URL
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
attempting a file upload.
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
9. Grant yourself the 
n. Test email notifications. There are three emails that can be sent out. One for
project submission, one for project editing.