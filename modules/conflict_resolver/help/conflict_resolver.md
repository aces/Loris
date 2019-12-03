# Conflict Resolver  

This module is designed to identify and resolve data conflicts in a study. LORIS uses double data entry, which means you may be asked to enter critical data twice in duplicate instrument forms. The Conflict Resolver will flag any discrepancies between the two entries (called *unresolved conflicts*) and allow you to fix or "resolve" them easily. 

Conflicts are displayed in a table with two separate tabs—resolved and unresolved conflicts. By default, the module displays the *Unresolved Conflicts* tab. You can narrow this list of results using any combination of filters in the *Selection Filters* section. 

You can resolve conflicts in the **Correct Answer** column of the resulting table. Click the drop-down to reveal two different responses—this is the conflict. These are two distinct values that were entered initially and during double data entry—they should be the same value. After cross-checking your data records for accuracy, select the correct response of the two. Changes are saved automatically. Once a conflict is resolved a green check will appear beside the input filed. If a red cross is displayed, the conflict could not be saved (Your browser console log will display the error message.)

It is possible to change the resolved conflicts to a new value until the page is refreshed. After refresh or when changing tab, the newly resolved conflicts will appear in the *Resolved Conflicts* tab.

