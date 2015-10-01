# Current changelogs
Please refer to the [Releases](https://github.com/aces/Loris/releases) page.


# Old changelogs

2008-06-19 Jonathan Harlap <jharlap@bic.mni.mcgill.ca>
    * Fixed a bug in the user accounts menu template that broke sorting

2008-04-30 J-Sebastian Muehlboeck <sebas@bic.mni.mcgill.ca>
    * added the change to make instruments look nice using css

2008-04-30 J-Sebastian Muehlboeck <sebas@bic.mni.mcgill.ca>
    * it now has a date for "start stage approval"

2008-04-12  Jonathan Harlap <jharlap@bic.mni.mcgill.ca>

    * tools/create_quickform_from_table.php: New tool to assist creating 
    quickform code for an instrument based on an existing table in the database

2008-04-10 J-Sebastian Muehlboeck <sebas@bic.mni.mcgill.ca>
    * Enabled passfile.php for securely downloading automatically generated reports
      mri-browser now offers site reports for download (you will need to generate them as a cronjob)

2008-04-10 J-Sebastian Muehlboeck <sebas@bic.mni.mcgill.ca>
    * mri browser has been completely re-worked.
	- added 3d and 3D combined views for the standard templates
	- added floating navigation and controls
	- added civet output support for processed data QC
	- added some smart views based on civet output types
	- changed files display to vertical as a default
	- changed files info display to display only pertinent information
	- changed files info display by adding fields like pipelines and comments.
    * dicom archive
	- added floating navigation

2008-03-28  Jonathan Harlap <jharlap@bic.mni.mcgill.ca>

    * tools/quat_diff.php: Fixed bug that prevented columns with unchanged
    names from being diffed properly.

2008-03-20  Jonathan Harlap <jharlap@bic.mni.mcgill.ca>

    * smarty: moved from php/smarty

    * php/libraries/NDB_Client.class.inc: added set_include_path to include the
    extLibs config setting

    * php/libraries/Smarty_hook.class.inc: updated to match location change of
    smarty templates.  also explicitly specified custom plugins dir to allow
    arbirary smarty location.



